import { createSelector } from '@reduxjs/toolkit';
import { parseISO } from 'date-fns';
import { compareDate, compareString } from '../../utils/compare.helper';
import { Note } from '../interfaces/notes.interfaces';
import { SortBy } from '../interfaces/ui.interfaces';
import { RootState } from '../store';

export const selectSelectedSource = createSelector(
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

export const selectSelectedSourceNotes = createSelector(
    (state: RootState) => state.ui.selectedSource,
    (state: RootState) => state.entities.notes,
    (state: RootState) => state.ui.sortNotesBy,
    (selectedSource, notes, sortBy) => {
        if (selectedSource === undefined || selectedSource === null) {
            return [];
        }

        const unsortedNotes =
            notes[selectedSource]?.allIds.map((id) => notes[selectedSource].byId[id]) || [];

        if (sortBy && unsortedNotes.length) {
            return unsortedNotes.sort(compare(sortBy));
        }

        return unsortedNotes;
    }
);

export const selectSelectedNote = createSelector(
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

const compare = (sortBy: SortBy) => {
    switch (sortBy) {
        case 'createdAt':
        case 'updatedAt':
            return (a: Note, b: Note) => compareDate(parseISO(a[sortBy]), parseISO(b[sortBy]));
        case 'title':
            return (a: Note, b: Note) => compareString(a.title, b.title);
    }
};
