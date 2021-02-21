const { contextBridge, ipcRenderer } = require('electron');
const logger = require('electron-log');
const { v4 } = require('uuid');
const databases = require('../database/database');

const CURRENT_VERSION = 0.1;

contextBridge.exposeInMainWorld('sourcesRepo', {
    create: async ({ location, password, name }) => {
        logger.debug('Context bridge: Creating new database');
        const database = await databases.create({ location, password });
        await database.Meta.create({ name, version: `${CURRENT_VERSION}` });

        return {
            id: database.id,
            location,
            name,
            version: CURRENT_VERSION
        };
    },
    load: async ({ location, password }) => {
        logger.debug('Context bridge: Loading a database');
        const database = await databases.open({ location, password });
        const meta = await database.Meta.findOne();

        if (!meta) {
            throw new Error('Unable to find meta-information');
        }

        if (!meta.name || !meta.createdAt || !meta.updatedAt) {
            throw new Error('Database has invalid meta-information');
        }

        return {
            id: database.id,
            location,
            name: meta.name,
            version: meta.version
        };
    },
    close: async (id) => {
        logger.debug('Context bridge: Closing a database');
        await databases.close(id);
    }
});
