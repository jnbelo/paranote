import { v4 } from 'uuid';

export const create = async ({ location, password, name }) => {
    if (window.sourcesRepo) {
        return await window.sourcesRepo.create({ location, password, name });
    }

    return {
        id: v4(),
        location,
        name,
        version: 'no-version'
    };
};

export const load = async ({ location, password }) => {
    if (window.sourcesRepo) {
        return await window.sourcesRepo.load({ location, password });
    }

    return {
        id: v4(),
        location,
        name: 'no-name',
        version: 'no-version'
    };
};

export const close = async (id) => {
    if (window.sourcesRepo) {
        await window.sourcesRepo.close(id);
    }
};
