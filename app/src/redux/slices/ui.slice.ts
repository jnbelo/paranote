import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as logger from '../../providers/logging.context';
import { UiState } from '../interfaces/ui.interfaces';
import { deleteNote } from '../thunks/notes.thunks';

const initialState: UiState = {};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        selectSource(state, { payload }: PayloadAction<string>) {
            logger.info(`Selecting source ${payload}`);
            state.selectedSource = payload;
            delete state.selectedNote;
        },
        selectNote(state, { payload }: PayloadAction<number>) {
            logger.info(`Selecting note ${payload}`);
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
