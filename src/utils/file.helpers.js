import fs from 'fs';
import log from './logging';

export const deleteFile = async (file) => {
    const fsp = fs.promises;
    try {
        await fsp.unlink(file);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            log.error('An error ocurred while deleting the file', error);
            throw error;
        }
        log.debug(`No file found in location ${file}`);
    }
};
