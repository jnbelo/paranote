import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectSources = createSelector(
    (state: RootState) => state.entities.sources.allIds,
    (state: RootState) => state.entities.sources.byId,
    (allIds, byId) => allIds.map((id) => byId[id])
);

export const selectSourcesError = (state: RootState): string | undefined =>
    state.entities.sources.error;
