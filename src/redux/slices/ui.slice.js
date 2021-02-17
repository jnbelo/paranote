import { createSelector, createSlice } from '@reduxjs/toolkit';
import { deleteNote } from '../thunks/notes.thunks';
import log from '../../utils/logging';

export const selectNotes = createSelector(
    (state) => state.ui.selectedSource,
    (state) => state.entities.sources.byId,
    (state) => state.entities.notes.byId,
    (selected, sourcesById, notesById) => {
        if (!selected) {
            return [];
        }

        const source = sourcesById[selected.id];
        return source.notes.filter((id) => id in notesById).map((id) => notesById[id]);
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
            if (state.selectedNote && state.selectedNote.id === payload.note.id) {
                state.selectedNote = null;
            }
        }
    }
});

export const { sourceSelected, noteSelected } = uiSlice.actions;

export default uiSlice.reducer;
