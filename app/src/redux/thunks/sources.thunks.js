import { createAsyncThunk } from '@reduxjs/toolkit';
import * as sourcesContext from '../../providers/sources.context';
import * as notesContext from '../../providers/notes.context';

export const createSource = createAsyncThunk(
    'sources/createSource',
    async ({ location, password, name }, { getState }) => {
        const { byId } = getState().entities.sources;

        for (const source in byId) {
            if (location === source.location) {
                throw new Error(`Source in ${location} is already open`);
            }
        }

        const source = await sourcesContext.create({ location, password, name });
        return {
            ...source,
            notes: []
        };
    }
);

export const loadSource = createAsyncThunk(
    'sources/loadSource',
    async ({ location, password }, { getState }) => {
        const { byId } = getState().entities.sources;

        for (const source in byId) {
            if (location === source.location) {
                throw new Error(`Source in ${location} is already open`);
            }
        }

        const source = await sourcesContext.load({ location, password });
        const notes = await notesContext.getAll(source.id);

        return { ...source, notes };
    }
);

export const removeSource = createAsyncThunk('sources/removeSource', async ({ id }) => {
    await await sourcesContext.close(id);
    return id;
});
