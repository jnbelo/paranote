import fs from 'fs';
import logger from 'electron-log';

export const deleteFile = async (file: string): Promise<void> => {
    const fsp = fs.promises;
    try {
        await fsp.unlink(file);
    } catch (error) {
        if (error.code !== 'ENOENT') {
            logger.error('An error ocurred while deleting the file', error);
            throw error;
        }
        logger.debug(`No file found in location ${file}`);
    }
};
