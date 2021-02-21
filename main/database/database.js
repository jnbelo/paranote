const { DataTypes, Sequelize } = require('sequelize');
const { v4 } = require('uuid');
const defineMetaModel = require('./models/meta.model');
const defineNoteModel = require('./models/note.model');
const { deleteFile } = require('../utils/file.helpers');

const databases = {};

module.exports.create = async ({ location, password }) => {
    await deleteFile(location);
    return await open({ location, password });
};

module.exports.open = async ({ location, password }) => {
    const id = v4();
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

module.exports.close = async (id) => {
    const database = databases[id];

    if (database) {
        await database.sequelize.close();
        delete databases[id];
    }
};

module.exports.get = (id) => {
    const database = databases[id];

    if (!database) {
        throw new Error(`Database ${id} was not found.`);
    }

    return database;
};
