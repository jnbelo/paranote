import { Sequelize } from 'sequelize';
import { v4 } from 'uuid';
import { deleteFile } from '../utils/file.helpers';
import { CreateDatabase, Database } from './interfaces/database.interface';
import { initMetaModel } from './models/meta.model';
import { initNoteModel } from './models/note.model';

const databases: { [key: string]: Database } = {};

export const create = async ({ location, password }: CreateDatabase): Promise<Database> => {
    await deleteFile(location);
    return await open({ location, password });
};

export const open = async ({ location, password }: CreateDatabase): Promise<Database> => {
    const id = v4();
    const sequelize = new Sequelize('', '', '', {
        dialect: 'sqlite',
        dialectModulePath: '@journeyapps/sqlcipher',
        storage: location
    });

    if (password) {
        await sequelize.query('PRAGMA cipher_compatibility = 3');
        await sequelize.query(`PRAGMA key = '${password}'`);
    }

    const database = {
        id,
        sequelize,
        Meta: initMetaModel(sequelize),
        Note: initNoteModel(sequelize)
    };

    await sequelize.sync({ alter: true });

    databases[id] = database;
    return database;
};

export const close = async (id: string): Promise<void> => {
    const database = databases[id];

    if (database) {
        await database.sequelize.close();
        delete databases[id];
    }
};

export const get = (id: string): Database => {
    const database = databases[id];

    if (!database) {
        throw new Error(`Database ${id} was not found.`);
    }

    return database;
};
