import { AsyncThunk, createAsyncThunk } from '@reduxjs/toolkit';
import * as notesContext from '../../providers/notes.context';
import * as sourcesContext from '../../providers/sources.context';
import {
    SourceCreate,
    SourceLoad,
    SourcesState,
    SourceWithNotes
} from '../interfaces/sources.interfaces';
import { RootState } from '../store';
import * as logger from '../../providers/logging.context';
import { Note } from '../interfaces/notes.interfaces';

export const createSource: AsyncThunk<
    SourceWithNotes,
    SourceCreate,
    { state: RootState }
> = createAsyncThunk('sources/createSource', async ({ location, password, name }, { getState }) => {
    logger.info(`Creating a new source ${name} in ${location}`);
    const { byId } = getState().entities.sources as SourcesState;

    for (const id in byId) {
        if (!Object.prototype.hasOwnProperty.call(byId, id)) {
            if (location === byId[id].location) {
                throw new Error(`Source in ${location} is already open`);
            }
        }
    }

    const source = await sourcesContext.create({ location, password, name });
    const notes: Note[] = [];
    return {
        id: source.id,
        name: source.name,
        location: source.location,
        notes
    };
});

export const loadSource: AsyncThunk<
    SourceWithNotes,
    SourceLoad,
    { state: RootState }
> = createAsyncThunk('sources/loadSource', async ({ location, password }, { getState }) => {
    logger.info(`Loading an existing source from ${location}`);
    const { byId } = getState().entities.sources;

    for (const id in byId) {
        if (!Object.prototype.hasOwnProperty.call(byId, id)) {
            if (location === byId[id].location) {
                throw new Error(`Source in ${location} is already open`);
            }
        }
    }

    const source = await sourcesContext.load({ location, password });
    const notes: Note[] = (await notesContext.getAll(source.id)).map((note) => ({
        ...note,
        createdAt: note.createdAt.toISOString(),
        updatedAt: note.updatedAt.toISOString(),
        sourceId: source.id
    }));

    return {
        id: source.id,
        name: source.name,
        location: source.location,
        notes
    };
});

export const removeSource = createAsyncThunk<string, string>(
    'sources/removeSource',
    async (id: string) => {
        logger.info(`Removing the existing source ${id}`);
        await await sourcesContext.close(id);
        return id;
    }
);
