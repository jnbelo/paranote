import { app, ipcMain, dialog, BrowserWindow } from 'electron';
import installExtension, { REDUX_DEVTOOLS } from 'electron-devtools-installer';
import log from 'electron-log';
import path from 'path';
import isDev from 'electron-is-dev';

log.catchErrors();
log.info(`Starting Paranote up [version: ${app.getVersion()}] [dev: ${isDev}]`);

let mainWindow: BrowserWindow;

const addReduxExtension = async () => {
    if (!isDev) return;

    try {
        const name = await installExtension(REDUX_DEVTOOLS);
        log.info(`Added Extension:  ${name}`);
    } catch (error) {
        log.error('An error occurred: ', error);
    }
};

const createWindow = async () => {
    mainWindow = new BrowserWindow({
        width: 900,
        height: 680,
        title: `Paranote v${app.getVersion()}`,
        icon: path.join(__dirname, '../assets/icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            devTools: isDev,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    mainWindow.setMenu(null);

    const url = isDev
        ? 'http://localhost:3000'
        : `file://${path.join(__dirname, '../build/index.html')}`;

    log.debug(`Loading url ${url}`);
    mainWindow.loadURL(
        isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
    );

    if (isDev) {
        mainWindow.webContents.openDevTools();
    }
};

const setUpIpc = () => {
    /* IPC communication */
    ipcMain.removeAllListeners();

    ipcMain.handle('open-file-saver', async () => {
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

    ipcMain.handle('open-file-opener', async () => {
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

    ipcMain.handle('open-ok-cancel-box', async (_, args) => {
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
};

const onReady = async () => {
    log.debug('Application is ready');
    await addReduxExtension();
    setUpIpc();
    await createWindow();
};

const onWindowAllClosed = async () => {
    log.info('Closing application');
    if (process.platform !== 'darwin') {
        app.quit();
    }
};

const onActivate = async () => {
    log.debug('Activating application');
    if (mainWindow === null) {
        await createWindow();
    }
};

app.on('ready', onReady);
app.on('window-all-closed', onWindowAllClosed);
app.on('activate', onActivate);
