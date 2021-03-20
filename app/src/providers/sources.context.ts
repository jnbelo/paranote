import { v4 } from 'uuid';
import { CreateSource, LoadSource, Source } from '@paranote/common/src';

declare global {
    interface Window {
        sourcesRepo?: {
            create: (createSource: CreateSource) => Promise<Source>;
            load: (loadSource: LoadSource) => Promise<Source>;
            close: (id: string) => Promise<void>;
        };
    }
}

export const create = async ({ location, password, name }: CreateSource): Promise<Source> => {
    if (window.sourcesRepo) {
        return window.sourcesRepo.create({ location, password, name });
    }

    return {
        id: v4(),
        location,
        name,
        version: 'no-version'
    };
};

export const load = async ({ location, password }: LoadSource): Promise<Source> => {
    if (window.sourcesRepo) {
        return window.sourcesRepo.load({ location, password });
    }

    return {
        id: v4(),
        location,
        name: 'no-name',
        version: 'no-version'
    };
};

export const close = async (id: string): Promise<void> => {
    if (window.sourcesRepo) {
        return window.sourcesRepo.close(id);
    }
};
