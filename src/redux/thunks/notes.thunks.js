import { createAsyncThunk } from '@reduxjs/toolkit';
import * as databases from '../../providers/database';

export const createNote = createAsyncThunk('notes/createNote', async ({ source }) => {
    const database = databases.get(source.id);
    const { id, createdAt, updatedAt, title, content } = await database.Note.create({
        title: '(Untitled Note)'
    });
    return {
        sourceId: source.id,
        note: {
            id,
            createdAt,
            updatedAt,
            title,
            content
        }
    };
});

export const deleteNote = createAsyncThunk('notes/deleteNote', async ({ source, note }) => {
    const database = databases.get(source.id);
    await database.Note.destroy({ where: { id: note.id } });
    return {
        sourceId: source.id,
        noteId: note.id
    };
});

export const updateNote = createAsyncThunk(
    'notes/updateNote',
    async ({ sourceId, noteId, noteUpdate }) => {
        const database = databases.get(sourceId);
        const existing = await database.Note.findByPk(noteId);
        existing.title = noteUpdate.title;
        existing.content = noteUpdate.content;
        await existing.save();

        const { id, createdAt, updatedAt, content, title } = existing;
        return {
            sourceId,
            note: {
                id,
                createdAt,
                updatedAt,
                title,
                content
            }
        };
    }
);
