import { createAsyncThunk } from '@reduxjs/toolkit';
import * as databases from '../../providers/database';

export const createNote = createAsyncThunk('notes/createNote', async ({ source }) => {
    const database = databases.get(source.id);
    const note = await database.Note.create({ title: '(Untitled Note)' });
    return {
        source,
        note
    };
});

export const deleteNote = createAsyncThunk('notes/deleteNote', async ({ source, note }) => {
    const database = databases.get(source.id);
    await database.Note.destroy({ where: { id: note.id } });
    return {
        source,
        note
    };
});

export const updateNote = createAsyncThunk(
    'notes/deleteNote',
    async ({ source, note, noteUpdate }) => {
        const database = databases.get(source.id);
        const updated = await database.Note.update(
            { ...noteUpdate },
            {
                where: {
                    id: note.id
                }
            }
        );

        return {
            source,
            updated
        };
    }
);
