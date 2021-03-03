import { createSlice } from '@reduxjs/toolkit';
import log from '../../utils/logging';
import { NotesState } from '../interfaces/notes.interfaces';
import { createNote, deleteNote, updateNote } from '../thunks/notes.thunks';
import { loadSource, removeSource } from '../thunks/sources.thunks';

const initialState: NotesState = {};

export const notesSlice = createSlice({
    name: 'notes',
    initialState,
    reducers: {},
    extraReducers: {
        [loadSource.fulfilled]: (state, { payload }) => {
            log.info(`Loading saved ${payload.notes.length} notes for source ${payload.id}`);
            state[payload.id] = payload.notes.reduce(
                (source, note) => {
                    source.byId[note.id] = note;
                    source.allIds.push(note.id);
                    return source;
                },
                { byId: {}, allIds: [] }
            );
        },
        [removeSource.fulfilled]: (state, { payload }) => {
            log.info(`Removing saved notes for source ${payload.id}`);
            delete state[payload.id];
        },
        [createNote.fulfilled]: (state, { payload }) => {
            const { sourceId, note } = payload;
            log.info(`Saving note ${note.title} in source ${sourceId}`);
            state[sourceId].byId[note.id] = note;
            state[sourceId].allIds.push(note.id);
        },
        [deleteNote.fulfilled]: (state, { payload }) => {
            const { sourceId, noteId } = payload;
            log.info(`Deleting note ${noteId} in source ${sourceId}`);
            delete state[sourceId].byId[noteId];
            state[sourceId].allIds = state[sourceId].allIds.filter((id) => id !== noteId);
        },
        [updateNote.fulfilled]: (state, { payload }) => {
            const { sourceId, note } = payload;
            log.info(`Updating note ${note.id} in source ${sourceId}`);
            state[sourceId].byId[note.id] = note;
        },
        [updateNote.rejected]: (state, { error }) => {
            log.error(`Error updating message: ${error.message}`);
        }
    }
});

export default notesSlice.reducer;
