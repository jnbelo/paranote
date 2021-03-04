import { createSlice } from '@reduxjs/toolkit';
import log from '../../utils/logging';
import { SourcesState } from '../interfaces/sources.interfaces';
import { createSource, loadSource, removeSource } from '../thunks/sources.thunks';

const initialState: SourcesState = {
    loading: false,
    byId: {},
    allIds: []
};

export const sourcesSlice = createSlice({
    name: 'sources',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(createSource.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(createSource.fulfilled, (state, { payload }) => {
            log.info(
                `Created source '${payload.name}' with id '${payload.id}' in '${payload.location}'`
            );
            const { notes, ...source } = payload;
            state.loading = false;
            state.byId[source.id] = source;
            state.allIds.push(source.id);
        });
        builder.addCase(createSource.rejected, (state, action) => {
            log.error(`Error creating source: ${action.error.message}`);
            state.loading = false;
            state.error = action.error.message;
        });
        builder.addCase(loadSource.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(loadSource.fulfilled, (state, { payload }) => {
            log.info(
                `Loaded source '${payload.name}' with id '${payload.id}' in '${payload.location}'`
            );
            const { notes, ...source } = payload;
            state.loading = false;
            state.byId[source.id] = source;
            state.allIds.push(source.id);
        });
        builder.addCase(loadSource.rejected, (state, action) => {
            log.error(`Error loading source: ${action.error.message}`);
            state.loading = false;
            state.error = action.error.message;
        });
        builder.addCase(removeSource.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(removeSource.fulfilled, (state, { payload }) => {
            log.info(`Closed source with id '${payload}'`);
            state.loading = false;
            delete state.byId[payload];
            state.allIds = state.allIds.filter((id) => id !== payload);
        });
        builder.addCase(removeSource.rejected, (state, { error }) => {
            log.error(`Error closing source: ${error.message}`);
            state.loading = false;
            state.error = error.message;
        });
    }
});

export default sourcesSlice.reducer;
