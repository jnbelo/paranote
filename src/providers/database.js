import { DataTypes, Sequelize } from 'sequelize';
import { v4 as uuidv4 } from 'uuid';
import { deleteFile } from '../utils/file.helpers';
import defineMetaModel from './models/metaModel';
import defineNoteModel from './models/noteModel';

const databases = {};

export const create = async ({ location, password }) => {
    await deleteFile(location);
    return await open({ location, password });
};

export const open = async ({ location, password }) => {
    const id = uuidv4();
    const sequelize = new Sequelize(null, null, null, {
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
        Meta: defineMetaModel(sequelize, DataTypes),
        Note: defineNoteModel(sequelize, DataTypes)
    };

    await sequelize.sync({ alter: true });

    databases[id] = database;
    return database;
};

export const close = async (id) => {
    const database = databases[id];

    if (database) {
        await database.sequelize.close();
        delete databases[id];
    }
};

export const get = (id) => {
    const database = databases[id];

    if (!database) {
        throw new Error(`Database ${id} was not found.`);
    }

    return database;
};

export default databases;
