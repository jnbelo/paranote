declare global {
    interface Window {
        log?: {
            info: (message: string) => void;
            debug: (message: string) => void;
            warn: (message: string) => void;
            error: (message: string) => void;
        };
    }
}

export const info = (message: string): void => {
    if (window.log) {
        window.log.info(message);
    } else {
        console.info(message);
    }
};

export const debug = (message: string): void => {
    if (window.log) {
        window.log.debug(message);
    } else {
        console.debug(message);
    }
};

export const warn = (message: string): void => {
    if (window.log) {
        window.log.warn(message);
    } else {
        console.warn(message);
    }
};

export const error = (message: string): void => {
    if (window.log) {
        window.log.error(message);
    } else {
        console.error(message);
    }
};
