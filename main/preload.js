const { contextBridge, ipcRenderer } = require('electron');
const logger = require('electron-log');
require('./preload/notes.preload');
require('./preload/sources.preload');

contextBridge.exposeInMainWorld('ipc', {
    invoke: (channel, data) => {
        return ipcRenderer.invoke(channel, data);
    }
});

contextBridge.exposeInMainWorld('log', {
    info: (message) => {
        logger.info(message);
    },
    debug: (message) => {
        logger.debug(message);
    },
    error: (message) => {
        logger.error(message);
    },
    warn: (message) => {
        logger.warn(message);
    }
});
