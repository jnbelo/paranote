import { createSelector, createSlice } from '@reduxjs/toolkit';

export const selectNotes = createSelector(
    (state) => state.ui.selectedSource,
    (state) => state.entities.sources.byId,
    (state) => state.entities.notes.byId,
    (selected, sourcesById, notesById) => {
        if (!selected) {
            return [];
        }

        const source = sourcesById[selected];
        return source.notes.map((id) => notesById[id]);
    }
);

export const uiSlice = createSlice({
    name: 'ui',
    initialState: {
        selectedSource: null,
        selectedNote: null
    },
    reducers: {
        sourceSelected(state, action) {
            state.selectedSource = action.payload;
            state.selectedNote = null;
        },
        noteSelected(state, action) {
            state.selectedNote = action.payload;
        }
    }
});

export const { sourceSelected, noteSelected } = uiSlice.actions;

export default uiSlice.reducer;
