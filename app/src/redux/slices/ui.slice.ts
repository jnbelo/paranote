import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as logger from '../../providers/logging.context';
import { SortBy, UiState } from '../interfaces/ui.interfaces';
import { deleteNote } from '../thunks/notes.thunks';

const initialState: UiState = {
    sortNotesBy: 'createdAt'
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        selectSource(state, { payload }: PayloadAction<string | null | undefined>) {
            logger.info(`Selecting source ${payload}`);
            state.selectedSource = payload;
            delete state.selectedNote;
        },
        selectNote(state, { payload }: PayloadAction<number | null | undefined>) {
            logger.info(`Selecting note ${payload}`);
            state.selectedNote = payload;
        },
        sortNotesBy(state, { payload }: PayloadAction<SortBy>) {
            logger.info(`Ordering notes by ${payload}`);
            state.sortNotesBy = payload;
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

export const { selectSource, selectNote, sortNotesBy } = uiSlice.actions;

export default uiSlice.reducer;
