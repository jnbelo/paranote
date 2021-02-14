import { createSlice } from '@reduxjs/toolkit';
import { loadSource } from './sourcesSlice';
import { generateNoteId } from './utils';
import log from '../utils/logging';

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
        }
    }
});

export default notesSlice.reducer;
