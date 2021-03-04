import { createAsyncThunk } from '@reduxjs/toolkit';
import * as notesContext from '../../providers/notes.context';
import { Note, NoteDelete, NoteUpdate } from '../interfaces/notes.interfaces';

export const createNote = createAsyncThunk<Note, string>('notes/createNote', async (sourceId) => {
    const { id, createdAt, updatedAt, title, content } = await notesContext.create(sourceId, {
        title: '(Untitled Note)'
    });
    return {
        id,
        createdAt,
        updatedAt,
        title,
        content,
        sourceId
    };
});

export const deleteNote = createAsyncThunk<NoteDelete, NoteDelete>(
    'notes/deleteNote',
    async ({ sourceId, noteId }) => {
        await notesContext.destroy(sourceId, noteId);
        return { sourceId, noteId };
    }
);

export const updateNote = createAsyncThunk<Note, NoteUpdate>(
    'notes/updateNote',
    async ({ sourceId, id, title: newTitle, content: newContent }) => {
        const { createdAt, updatedAt, content, title } = await notesContext.update(sourceId, id, {
            title: newTitle,
            content: newContent
        });
        return {
            id,
            createdAt,
            updatedAt,
            title,
            content,
            sourceId
        };
    }
);
