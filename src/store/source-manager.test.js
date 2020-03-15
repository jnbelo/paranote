import {
    addSource,
    getSources,
    emptySources,
    removeSource,
    getSourcesOfType,
    getSource,
    cleanUpSources
} from './source-manager';

beforeEach(() => {
    emptySources();
});

afterEach(() => {
    emptySources();
});

const createSource = (id, name, type, isSameAs) => {
    return {
        id,
        name,
        type,
        isSameAs: isSameAs ? isSameAs : () => false,
        cleanUp: jest.fn()
    };
};

it('should add a new source', async () => {
    const source = createSource('source_id', 'source_name');
    const added = await addSource(source);

    expect(added.id).toBe(source.id);
    expect(getSources()).toHaveLength(1);
    expect(getSources()).toEqual([source]);
});

it('should replace a new source', async () => {
    const source = createSource('source_id_1', 'source_name_1', 'source_type', () => true);
    const added = await addSource(source);

    const newSource = createSource('source_id_2', 'source_name_2', 'source_type', () => true);
    const readded = await addSource(newSource);

    expect(added.id).not.toBe(readded.id);
    expect(getSources()).toHaveLength(1);
    expect(getSources()).toEqual([newSource]);
});

it('should remove an existing source', async () => {
    const source = createSource('source_id', 'source_name');

    await addSource(source);
    expect(getSources()).toHaveLength(1);

    await removeSource(source.id);
    expect(getSources()).toHaveLength(0);
});

it('should not remove an existing source if not found', async () => {
    const source = createSource('source_id', 'source_name');

    await addSource(source);
    expect(getSources()).toHaveLength(1);

    await removeSource('invalid_id');
    expect(getSources()).toHaveLength(1);
});

it('should get all sources of type', async () => {
    const source1 = createSource('source_id_1', 'source_name_1', 'source_type_1');
    const source2 = createSource('source_id_2', 'source_name_2', 'source_type_2');

    await addSource(source1);
    await addSource(source2);
    expect(getSources()).toHaveLength(2);

    const result = getSourcesOfType('source_type_2');
    expect(result).toHaveLength(1);
    expect(result).toEqual([source2]);
});

it('should get source from id', async () => {
    const source = createSource('source_id', 'source_name');
    await addSource(source);

    const fetched = await getSource(source.id);
    expect(fetched).toBe(source);
});

it('should not get source from id when id is not found', async () => {
    const source = createSource('source_id', 'source_name');
    await addSource(source);

    const fetched = await getSource('invalid_id');
    expect(fetched).toBeUndefined();
});

it('should clean up all sources', async () => {
    const source = createSource('source_id', 'source_name');
    await addSource(source);

    await cleanUpSources();
    expect(source.cleanUp).toHaveBeenCalledTimes(1);
});
