import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import log from '../../utils/logging';
import { UiState } from '../interfaces/ui.interfaces';
import { deleteNote } from '../thunks/notes.thunks';

const initialState: UiState = {};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        selectSource(state, { payload }: PayloadAction<string>) {
            log.info(`Selecting source ${payload}`);
            state.selectedSource = payload;
            delete state.selectedNote;
        },
        selectNote(state, { payload }: PayloadAction<number>) {
            log.info(`Selecting note ${payload}`);
            state.selectedNote = payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(deleteNote.fulfilled, (state, { payload }) => {
            if (state.selectedNote === payload.noteId) {
                delete state.selectedNote;
            }
        });
    }
});

export const { selectSource, selectNote } = uiSlice.actions;

export default uiSlice.reducer;
