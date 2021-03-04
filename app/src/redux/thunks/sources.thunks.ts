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

export const createSource: AsyncThunk<
    SourceWithNotes,
    SourceCreate,
    { state: RootState }
> = createAsyncThunk('sources/createSource', async ({ location, password, name }, { getState }) => {
    const { byId } = getState().entities.sources as SourcesState;

    for (const id in byId) {
        if (!Object.prototype.hasOwnProperty.call(byId, id)) {
            if (location === byId[id].location) {
                throw new Error(`Source in ${location} is already open`);
            }
        }
    }

    const source = await sourcesContext.create({ location, password, name });
    return {
        ...source,
        notes: []
    };
});

export const loadSource: AsyncThunk<
    SourceWithNotes,
    SourceLoad,
    { state: RootState }
> = createAsyncThunk('sources/loadSource', async ({ location, password }, { getState }) => {
    const { byId } = getState().entities.sources;

    for (const id in byId) {
        if (!Object.prototype.hasOwnProperty.call(byId, id)) {
            if (location === byId[id].location) {
                throw new Error(`Source in ${location} is already open`);
            }
        }
    }

    const source = await sourcesContext.load({ location, password });
    const notes = await notesContext.getAll(source.id);

    return { ...source, notes };
});

export const removeSource = createAsyncThunk<string, string>(
    'sources/removeSource',
    async (id: string) => {
        await await sourcesContext.close(id);
        return id;
    }
);
