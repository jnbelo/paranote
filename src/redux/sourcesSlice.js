import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as databases from '../providers/database';
import log from '../utils/logging';

const CURRENT_VERSION = 0.1;

export const createSource = createAsyncThunk(
    'sources/createSource',
    async ({ location, password, name }, { getState }) => {
        const { sources } = getState().sources;
        if (sources.find((source) => location === source.location)) {
            throw new Error(`Source in ${location} is already open`);
        }

        const database = await databases.create({ location, password });
        const meta = await database.Meta.create({ name, version: `${CURRENT_VERSION}` });
        return {
            id: database.id,
            location,
            name,
            version: meta.version
        };
    }
);

export const loadSource = createAsyncThunk(
    'sources/loadSource',
    async ({ location, password }, { getState }) => {
        const { sources } = getState().sources;
        if (sources.find((source) => location === source.location)) {
            throw new Error(`Source in ${location} is already open`);
        }

        const database = await databases.open({ location, password });
        const meta = await database.Meta.findOne();

        if (!meta) {
            throw new Error('Unable to find meta-information');
        }

        if (!meta.name || !meta.createdAt || !meta.updatedAt) {
            throw new Error('Database has invalid meta-information');
        }

        return {
            id: database.id,
            location,
            name: meta.name,
            version: meta.version
        };
    }
);

export const removeSource = createAsyncThunk('sources/removeSource', async ({ id }) => {
    await databases.close(id);
    return id;
});

export const selectSources = (state) => state.sources.sources;

export const selectSourcesError = (state) => state.sources.error;

export const sourcesSlice = createSlice({
    name: 'sources',
    initialState: {
        status: null,
        error: null,
        sources: []
    },
    reducers: {},
    extraReducers: {
        [createSource.pending]: (state) => {
            state.status = 'saving';
        },
        [createSource.fulfilled]: (state, { payload }) => {
            log.info(
                `Created source '${payload.name}' with id '${payload.id}' in '${payload.location}'`
            );
            state.status = 'saved';
            state.sources.push(payload);
        },
        [createSource.rejected]: (state, action) => {
            log.error(`Error creating source: ${action.error.message}`);
            state.status = 'failed';
            state.error = action.error.message;
        },
        [loadSource.pending]: (state) => {
            state.status = 'saving';
        },
        [loadSource.fulfilled]: (state, { payload }) => {
            log.info(
                `Loaded source '${payload.name}' with id '${payload.id}' in '${payload.location}'`
            );
            state.status = 'saved';
            state.sources.push(payload);
        },
        [loadSource.rejected]: (state, action) => {
            log.error(`Error loading source: ${action.error.message}`);
            state.status = 'failed';
            state.error = action.error.message;
        },
        [removeSource.pending]: (state) => {
            state.status = 'saving';
        },
        [removeSource.fulfilled]: (state, { payload }) => {
            log.info(`Closed source with id '${payload}'`);
            state.status = 'saved';
            state.sources = state.sources.filter(({ id }) => id !== payload);
        },
        [removeSource.rejected]: (state, { error }) => {
            log.error(`Error closing source: ${error.message}`);
            state.status = 'failed';
            state.error = error.message;
        }
    }
});

export default sourcesSlice.reducer;
