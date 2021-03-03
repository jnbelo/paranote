import { contextBridge, ipcRenderer } from 'electron';
import logger from 'electron-log';

require('./preload/notes.preload');
require('./preload/sources.preload');

contextBridge.exposeInMainWorld('ipc', {
    invoke: (channel: string, data?: unknown): Promise<unknown> => {
        return ipcRenderer.invoke(channel, data);
    }
});

contextBridge.exposeInMainWorld('log', {
    info: (message: string) => {
        logger.info(message);
    },
    debug: (message: string) => {
        logger.debug(message);
    },
    error: (message: string) => {
        logger.error(message);
    },
    warn: (message: string) => {
        logger.warn(message);
    }
});
