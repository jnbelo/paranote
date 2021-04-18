import { CreateSource, LoadSource, Source } from '@paranote/common/src';
import { mockCreateSource, mockLoadSource } from './storage.mock';

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
    } else {
        return mockCreateSource({ location, password, name });
    }
};

export const load = async ({ location, password }: LoadSource): Promise<Source> => {
    if (window.sourcesRepo) {
        return window.sourcesRepo.load({ location, password });
    } else {
        return mockLoadSource({ location, password });
    }
};

export const close = async (id: string): Promise<void> => {
    if (window.sourcesRepo) {
        return window.sourcesRepo.close(id);
    }
};
