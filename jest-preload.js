global.console = {
    log: jest.fn(),
    info: jest.fn(),
    debug: jest.fn(),
    error: console.error,
    warn: console.warn
};
