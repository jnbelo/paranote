const electron = require('electron');
const { ipcMain, dialog } = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

const log = require('electron-log');
const path = require('path');
const isDev = require('electron-is-dev');

log.catchErrors();
log.info(`Starting Paranote up [version: ${app.getVersion()}] [dev: ${isDev}]`);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        title: `Paranote v${app.getVersion()}`,
        icon: path.join(__dirname, '../assets/icon.png'),
        webPreferences: { nodeIntegration: true, enableRemoteModule: true, devTools: isDev }
    });

    mainWindow.setMenu(null);

    const url = isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`;

    log.debug(`Loading url ${url}`);
    mainWindow.loadURL(
        isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
    );
    mainWindow.on('closed', () => (mainWindow = null));

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }

    /* IPC communication */
    ipcMain.removeAllListeners();

    ipcMain.handle('open-file-saver', async (event, arg) => {
        log.debug('Opening file saver dialog');
        const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
            title: 'Select File Location',
            properties: ['createDirectory', 'showOverwriteConfirmation'],
            filters: [
                {
                    name: 'Paranote Files',
                    extensions: ['parax']
                }
            ]
        });

        return canceled ? '' : filePath;
    });

    ipcMain.handle('open-file-opener', async (event, arg) => {
        log.debug('Opening file opener dialog');
        const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
            title: 'Open File From Location',
            properties: ['openFile'],
            filters: [
                {
                    name: 'Paranote Files',
                    extensions: ['parax']
                }
            ]
        });

        return canceled ? '' : filePaths ? filePaths[0] : '';
    });

    ipcMain.handle('open-ok-cancel-box', async (event, args) => {
        const { type, title, message } = args;
        log.debug(`Opening message box with title ${title}`);
        const { response } = await dialog.showMessageBox(mainWindow, {
            type,
            title,
            buttons: ['OK', 'Cancel'],
            message
        });
        return response == 0;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    log.info('Closing application');
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    log.debug('Activating');
    if (mainWindow === null) {
        createWindow();
    }
});
