import { createSelector } from '@reduxjs/toolkit';
import { parseISO } from 'date-fns';
import { compareDate, compareString } from '../../utils/compare.helper';
import { Note } from '../interfaces/notes.interfaces';
import { RootState } from '../store';

export const selectSource = createSelector(
    (state: RootState) => state.ui.selectedSource,
    (state: RootState) => state.entities.sources,
    (selected, sources) => {
        if (!selected || !sources.byId || !(selected in sources.byId)) {
            return null;
        }

        return sources.byId[selected];
    }
);

export const selectNotes = createSelector(
    (state: RootState) => state.ui.selectedSource,
    (state: RootState) => state.entities.notes,
    (state: RootState) => state.ui.orderNotesBy,
    (selected, notes, orderBy) => {
        if (!selected) {
            return [];
        }

        return notes[selected].allIds
            .map((id) => notes[selected].byId[id])
            .sort((a, b) => {
                switch (orderBy) {
                    case 'createdAt':
                        return compareDate(parseISO(a.createdAt), parseISO(b.createdAt));
                    case 'updatedAt':
                        return compareDate(parseISO(a.updatedAt), parseISO(b.updatedAt));
                    case 'title':
                        return compareString(a.title, b.title);
                    default:
                        return 0;
                }
            });
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
