import { createSelector, createSlice } from '@reduxjs/toolkit';
import { deleteNote } from '../thunks/notes.thunks';
import log from '../../utils/logging';

export const selectNotes = createSelector(
    (state) => state.ui.selectedSource,
    (state) => state.entities.notes,
    (selected, notes) => {
        if (!selected) {
            return [];
        }

        return notes[selected.id].allIds.map((id) => notes[selected.id].byId[id]);
    }
);

export const selectNote = createSelector(
    (state) => state.ui.selectedSource,
    (state) => state.ui.selectedNote,
    (state) => state.entities.notes,
    (selectedSource, selectedNote, notes) => {
        if (!selectedSource || !selectedNote) {
            return null;
        }

        return notes[selectedSource.id].byId[selectedNote.id];
    }
);

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        selectedSource: null,
        selectedNote: null
    },
    reducers: {
        sourceSelected(state, { payload }) {
            log.info(`Selecting source ${payload}`);
            state.selectedSource = payload;
            state.selectedNote = null;
        },
        noteSelected(state, { payload }) {
            log.info(`Selecting note ${payload}`);
            state.selectedNote = payload;
        }
    },
    extraReducers: {
        [deleteNote.fulfilled]: (state, { payload }) => {
            if (state.selectedNote && state.selectedNote.id === payload.noteId) {
                state.selectedNote = null;
            }
        }
    }
});

export const { sourceSelected, noteSelected } = uiSlice.actions;

export default uiSlice.reducer;
