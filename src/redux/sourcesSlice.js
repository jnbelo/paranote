import { createSlice, createAsyncThunk, createSelector } from '@reduxjs/toolkit';
import * as databases from '../providers/database';
import log from '../utils/logging';

const CURRENT_VERSION = 0.1;

export const createSource = createAsyncThunk(
    'sources/createSource',
    async ({ location, password, name }, { getState }) => {
        const { byId } = getState().entities.sources;

        for (const source in byId) {
            if (location === source.location) {
                throw new Error(`Source in ${location} is already open`);
            }
        }

        const database = await databases.create({ location, password });
        const meta = await database.Meta.create({ name, version: `${CURRENT_VERSION}` });
        return {
            id: database.id,
            location,
            name,
            version: meta.version,
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

        const database = await databases.open({ location, password });
        const meta = await database.Meta.findOne();

        if (!meta) {
            throw new Error('Unable to find meta-information');
        }

        if (!meta.name || !meta.createdAt || !meta.updatedAt) {
            throw new Error('Database has invalid meta-information');
        }

        const notes = (await database.Note.findAll()).map(
            ({ id, title, createdAt, updatedAt, content }) => ({
                id,
                createdAt,
                updatedAt,
                title,
                content
            })
        );

        return {
            id: database.id,
            location,
            name: meta.name,
            version: meta.version,
            notes
        };
    }
);

export const removeSource = createAsyncThunk('sources/removeSource', async ({ id }) => {
    await databases.close(id);
    return id;
});

export const selectSources = createSelector(
    (state) => state.entities.sources.allIds,
    (state) => state.entities.sources.byId,
    (allIds, byId) => allIds.map((id) => byId[id])
);

export const selectSourcesError = (state) => state.sources.error;

export const sourcesSlice = createSlice({
    name: 'sources',
    initialState: {
        loading: false,
        error: null,
        byId: {},
        allIds: []
    },
    reducers: {},
    extraReducers: {
        [createSource.pending]: (state) => {
            state.loading = true;
        },
        [createSource.fulfilled]: (state, { payload }) => {
            log.info(
                `Created source '${payload.name}' with id '${payload.id}' in '${payload.location}'`
            );
            state.loading = false;
            state.byId[payload.id] = payload;
            state.allIds.push(payload.id);
        },
        [createSource.rejected]: (state, action) => {
            log.error(`Error creating source: ${action.error.message}`);
            state.loading = false;
            state.error = action.error.message;
        },
        [loadSource.pending]: (state) => {
            state.loading = true;
        },
        [loadSource.fulfilled]: (state, { payload }) => {
            log.info(
                `Loaded source '${payload.name}' with id '${payload.id}' in '${payload.location}'`
            );
            state.loading = false;
            state.byId[payload.id] = {
                ...payload,
                notes: payload.notes.map(({ id }) => generateNoteId(payload.id, id))
            };
            state.allIds.push(payload.id);
        },
        [loadSource.rejected]: (state, action) => {
            log.error(`Error loading source: ${action.error.message}`);
            state.loading = false;
            state.error = action.error.message;
        },
        [removeSource.pending]: (state) => {
            state.loading = true;
        },
        [removeSource.fulfilled]: (state, { payload }) => {
            log.info(`Closed source with id '${payload}'`);
            state.loading = false;
            delete state.byId[payload.id];
            state.allIds = state.allIds.filter((id) => id !== payload);
        },
        [removeSource.rejected]: (state, { error }) => {
            log.error(`Error closing source: ${error.message}`);
            state.loading = false;
            state.error = error.message;
        }
    }
});

export default sourcesSlice.reducer;
