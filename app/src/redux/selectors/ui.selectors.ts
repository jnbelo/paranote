import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

export const selectNotes = createSelector(
    (state: RootState) => state.ui.selectedSource,
    (state: RootState) => state.entities.notes,
    (selected, notes) => {
        if (!selected) {
            return [];
        }

        return notes[selected].allIds.map((id) => notes[selected].byId[id]);
    }
);

export const selectNote = createSelector(
    (state: RootState) => state.ui.selectedSource,
    (state: RootState) => state.ui.selectedNote,
    (state: RootState) => state.entities.notes,
    (selectedSource, selectedNote, notes) => {
        if (!selectedSource || !selectedNote) {
            return null;
        }

        return notes[selectedSource].byId[selectedNote];
    }
);
