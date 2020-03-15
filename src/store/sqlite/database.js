import sqlite3 from '@journeyapps/sqlcipher';
import fs from 'fs';
import moment from 'moment';
import SQL from 'sql-template-strings';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';
import log from '../../utils/logging';
import { getSourcesOfType } from '../source-manager';
import { createSchema } from './migrations';

export const CURRENT_VERSION = 0.1;
const TYPE = 'database';

const fsp = fs.promises;

const deleteExistingDatabase = async (location) => {
    try {
        if (!location.indexOf(':memory:') > -1) {
            log.debug(`Attempting to delete database in location ${location}`);
            await fsp.unlink(location);
        }
    } catch (error) {
        if (error.code !== 'ENOENT') {
            log.error('An error ocurred while deleting the file', error);
            throw error;
        }
        log.debug(`No database found in location ${location}`);
    }
};

const validateSourceNotOpen = (location) => {
    const index = getSourcesOfType(TYPE).findIndex((s) => s.location === location);
    if (index > -1) {
        throw new Error('Source is already loaded');
    }
};

const tryCloseDatabase = async (database) => {
    if (database) {
        log.debug('Silently closing database');
        try {
            await database.close();
        } catch (error) {
            log.warn('Error trying to silently close database', error);
        }
    }
};

export const createSource = async (name, location, password) => {
    let database;
    try {
        log.info(`Creating a new database in location ${location}`);

        await deleteExistingDatabase(location);

        database = await open({
            filename: location,
            driver: sqlite3.Database
        });

        if (password) {
            log.info('Encrypting database');
            await database.run('PRAGMA cipher_compatibility = 3');
            await database.run(`PRAGMA key = '${password}'`);
        }

        await createSchema(database);

        log.info('Building database meta information');
        await database.run(
            SQL`INSERT INTO meta (id, name, created_at, updated_at, version) 
                VALUES (${1}, ${name}, ${moment().toJSON()}, ${moment().toJSON()}, ${CURRENT_VERSION})`
        );

        log.info(`Database in ${location} successfully created`);
        return await DatabaseSource.create(database, location);
    } catch (error) {
        await tryCloseDatabase(database);

        log.error(`Unable to create database in ${location}`, error);
        throw error;
    }
};

export const loadSource = async (location, password) => {
    validateSourceNotOpen(location);

    log.info(`Loading database from location ${location}`);
    let database;

    try {
        database = await open({
            filename: location,
            driver: sqlite3.Database,
            mode: sqlite3.OPEN_READWRITE
        });

        if (password) {
            log.info('Decrypting database');
            await database.exec('PRAGMA cipher_compatibility = 3');
            await database.exec(`PRAGMA key = '${password}'`);
        }

        await createSchema(database);

        const result = await database.get('SELECT * FROM meta LIMIT 1');
        if (!result) {
            throw new Error('Unable to find meta-information');
        }

        if (!result.name || !result.created_at || !result.updated_at) {
            throw new Error('Database has invalid meta-information');
        }

        log.info(`Database in ${location} successfully loaded`);
        return await DatabaseSource.create(database, location);
    } catch (error) {
        await tryCloseDatabase(database);

        if (error.code === 'SQLITE_NOTADB') {
            throw new Error('Invalid password or file');
        }
        throw error;
    }
};

const rowToNote = (row) => {
    return {
        id: row.id,
        title: row.title,
        createdAt: moment(row.created_at),
        updatedAt: moment(row.updated_at),
        content: row.content
    };
};

class DatabaseSource {
    constructor(database, location, name, version) {
        this.id = uuidv4();
        this.database = database;
        this.location = location;
        this.type = TYPE;
        this.name = name;
        this.version = version;
    }

    static async create(database, location) {
        const result = await database.get('SELECT * FROM meta LIMIT 1');
        if (!result) {
            throw new Error('Unable to find meta-information');
        }

        return new DatabaseSource(database, location, result.name, result.version);
    }

    isSameAs(other) {
        return other.type === this.type && other.location && other.location === this.location;
    }

    async getNotes() {
        const result = await this.database.all('SELECT * FROM notes');
        return result.map(rowToNote);
    }

    async getNote(id) {
        const result = await this.database.get(SQL`SELECT * FROM notes WHERE id=${id}`);
        if (!result) {
            throw new Error(`Unable to find note ${id}`);
        }

        return rowToNote(result);
    }

    async createNote({ title, content, tags }) {
        const result = await this.database.run(
            SQL`INSERT INTO notes (title, created_at, updated_at, content) VALUES (${
                title || ''
            }, ${moment().toJSON()}, ${moment().toJSON()}, ${content || ''})`
        );

        return await this.getNote(result.lastID);
    }

    async removeNote(id) {
        await this.database.run(SQL`DELETE FROM notes WHERE id=${id}`);
    }

    async updateNote({ id, title, content, tags }) {
        await this.database.run(
            SQL`UPDATE notes SET title=${title || ''}, updated_at=${moment().toJSON()}, content=${
                content || ''
            } WHERE id=${id}`
        );
        return await this.getNote(id);
    }

    async cleanUp() {
        log.info(`Closing the database in location ${this.location}`);
        await this.database.close();
        log.info(`Successfully closed the database in location ${this.location}`);
    }
}
