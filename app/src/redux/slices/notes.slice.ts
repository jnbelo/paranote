import { createSlice } from '@reduxjs/toolkit';
import log from '../../utils/logging';
import { NotesBySource, NotesState } from '../interfaces/notes.interfaces';
import { createNote, deleteNote, updateNote } from '../thunks/notes.thunks';
import { loadSource, removeSource } from '../thunks/sources.thunks';

const initialState: NotesState = {};

export const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(loadSource.fulfilled, (state, { payload }) => {
            log.info(`Loading saved ${payload.notes.length} notes for source ${payload.id}`);
            const notesBySource: NotesBySource = { byId: {}, allIds: [] };

            state[payload.id] = payload.notes.reduce((source, note) => {
                source.byId[note.id] = note;
                source.allIds.push(note.id);
                return source;
            }, notesBySource);
        });
        builder.addCase(removeSource.fulfilled, (state, { payload }) => {
            log.info(`Removing saved notes for source ${payload}`);
            delete state[payload];
        });
        builder.addCase(createNote.fulfilled, (state, { payload }) => {
            log.info(`Saving note ${payload.title} in source ${payload.sourceId}`);
            state[payload.sourceId].byId[payload.id] = payload;
            state[payload.sourceId].allIds.push(payload.id);
        });
        builder.addCase(deleteNote.fulfilled, (state, { payload }) => {
            const { sourceId, noteId } = payload;
            log.info(`Deleting note ${noteId} in source ${sourceId}`);
            delete state[sourceId].byId[noteId];
            state[sourceId].allIds = state[sourceId].allIds.filter((id) => id !== noteId);
        });
        builder.addCase(updateNote.fulfilled, (state, { payload }) => {
            log.info(`Updating note ${payload.id} in source ${payload.sourceId}`);
            state[payload.sourceId].byId[payload.id] = payload;
        });
        builder.addCase(updateNote.rejected, (_state, { error }) => {
            log.error(`Error updating message: ${error.message}`);
        });
    }
});

export default notesSlice.reducer;
