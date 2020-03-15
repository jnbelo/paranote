import log from '../utils/logging';

const sources = [];

export const addSource = async (source) => {
    const index = sources.findIndex((s) => s.isSameAs(source));
    if (index > -1) {
        sources[index] = source;
    } else {
        sources.push(source);
    }

    log.info(`Added a new source [id: ${source.id}] [name: ${source.name}]`);
    return source;
};

export const removeSource = async (id) => {
    const index = sources.findIndex((n) => n.id === id);
    if (index > -1) {
        const source = sources[index];
        await source.cleanUp();
        sources.splice(index, 1);
        log.info(`Removed source [id: ${source.id}] [name: ${source.name}]`);
    } else {
        log.warn(`Unable to find source [id: ${id}]`);
    }
};

export const getSources = () => [...sources];

export const getSourcesOfType = (type) => sources.filter((s) => s.type === type);

export const getSource = (id) => {
    return sources.find((s) => s.id === id);
};

export const cleanUpSources = async () => {
    log.info('Cleaning up all sources');
    await Promise.all(
        sources.map(async (source) => {
            await source.cleanUp();
        })
    );
};

export const emptySources = () => {
    sources.splice(0, sources.length);
};
