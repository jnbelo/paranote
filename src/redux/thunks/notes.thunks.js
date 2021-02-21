import { createAsyncThunk } from '@reduxjs/toolkit';
import * as notesContext from '../../providers/notes.context';

export const createNote = createAsyncThunk('notes/createNote', async ({ source }) => {
    const { id, createdAt, updatedAt, title, content } = await notesContext.create(source.id, {
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
    await notesContext.destroy(source.id, note.id);
    return {
        sourceId: source.id,
        noteId: note.id
    };
});

export const updateNote = createAsyncThunk(
    'notes/updateNote',
    async ({ sourceId, noteId, noteUpdate }) => {
        const { id, createdAt, updatedAt, content, title } = await notesContext.update(
            sourceId,
            noteId,
            noteUpdate
        );
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
