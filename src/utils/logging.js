import { remote } from 'electron';

const log = remote ? remote.require('electron-log') : console;

export default log;
