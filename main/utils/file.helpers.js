const fs = require('fs');
const logger = require('electron-log');

module.exports.deleteFile = async (file) => {
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
