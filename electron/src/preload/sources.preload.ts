import { contextBridge } from 'electron';
import { CreateSource, LoadSource, Source } from '@paranote/common/src';
import logger from 'electron-log';
import * as databases from '../database/databases';

const CURRENT_VERSION = '0.1';

contextBridge.exposeInMainWorld('sourcesRepo', {
    create: async ({ location, password, name }: CreateSource): Promise<Source> => {
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
    load: async ({ location, password }: LoadSource): Promise<Source> => {
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
    close: async (id: string): Promise<void> => {
        logger.debug('Context bridge: Closing a database');
        return databases.close(id);
    }
});
