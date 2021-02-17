import { createSlice } from '@reduxjs/toolkit';
import log from '../../utils/logging';
import { createNote, deleteNote, updateNote } from '../thunks/notes.thunks';
import { loadSource } from '../thunks/sources.thunks';
import { generateNoteId } from '../utils';

export const notesSlice = createSlice({
    name: 'notes',
    initialState: {
        byId: {},
        allIds: []
    },
    reducers: {},
    extraReducers: {
        [loadSource.fulfilled]: (state, { payload }) => {
            log.info(`Loading saved ${payload.notes.length} notes for source ${payload.id}`);
            payload.notes.forEach((note) => {
                const noteId = generateNoteId(payload.id, note.id);
                state.byId[noteId] = note;
                state.allIds.push(noteId);
            });
        },
        [createNote.fulfilled]: (state, { payload }) => {
            const { source, note } = payload;
            log.info(`Saving note ${note.title} in source ${source.id}`);
            const noteId = generateNoteId(source.id, note.id);
            state.byId[noteId] = note;
            state.allIds.push(noteId);
        },
        [deleteNote.fulfilled]: (state, { payload }) => {
            const { source, note } = payload;
            log.info(`Deleting note ${note.title} in source ${source.id}`);
            const noteId = generateNoteId(source.id, note.id);
            delete state.byId[noteId];
            state.allIds = state.allIds.filter((id) => id !== noteId);
        },
        [updateNote.fulfilled]: (state, { payload }) => {
            const { source, note } = payload;
            log.info(`Updating note ${note.id} in source ${source.id}`);
            const noteId = generateNoteId(source.id, note.id);
            state.byId[noteId] = note;
        }
    }
});

export default notesSlice.reducer;
