import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectedSourceSelector = createSelector(
    (state: RootState) => state.ui.selectedSource,
    (state: RootState) => state.entities.sources,
    (selectedSource, sources) => {
        if (
            selectedSource === undefined ||
            selectedSource === null ||
            !sources.byId ||
            !(selectedSource in sources.byId)
        ) {
            return null;
        }

        return sources.byId[selectedSource];
    }
);

export const selectNotes = createSelector(
    (state: RootState) => state.ui.selectedSource,
    (state: RootState) => state.entities.notes,
    (selectedSource, notes) => {
        if (selectedSource === undefined || selectedSource === null) {
            return [];
        }

        return notes[selectedSource]?.allIds.map((id) => notes[selectedSource].byId[id]) || [];
    }
);

export const selectNote = createSelector(
    (state: RootState) => state.ui.selectedSource,
    (state: RootState) => state.ui.selectedNote,
    (state: RootState) => state.entities.notes,
    (selectedSource, selectedNote, notes) => {
        if (
            selectedSource === undefined ||
            selectedSource === null ||
            selectedNote === undefined ||
            selectedNote === null
        ) {
            return null;
        }

        return notes[selectedSource].byId[selectedNote];
    }
);
