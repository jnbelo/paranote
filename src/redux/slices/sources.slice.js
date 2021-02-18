import { createSelector, createSlice } from '@reduxjs/toolkit';
import log from '../../utils/logging';
import { createNote, deleteNote } from '../thunks/notes.thunks';
import { createSource, loadSource, removeSource } from '../thunks/sources.thunks';

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
            const { notes, ...source } = payload;
            state.loading = false;
            state.byId[source.id] = source;
            state.allIds.push(source.id);
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
            const { notes, ...source } = payload;
            state.loading = false;
            state.byId[source.id] = source;
            state.allIds.push(source.id);
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
