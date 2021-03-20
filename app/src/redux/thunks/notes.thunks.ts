import { createAsyncThunk } from '@reduxjs/toolkit';
import * as notesContext from '../../providers/notes.context';
import * as logger from '../../providers/logging.context';
import { Note, NoteDelete, NoteUpdate } from '../interfaces/notes.interfaces';

export const createNote = createAsyncThunk<Note, string>('notes/createNote', async (sourceId) => {
    logger.info(`Creating new note for source ${sourceId}`);
    const { id, createdAt, updatedAt, title, content } = await notesContext.create(sourceId, {
        title: '(Untitled Note)',
        content: ''
    });
    return {
        id,
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
        title,
        content,
        sourceId
    };
});

export const deleteNote = createAsyncThunk<NoteDelete, NoteDelete>(
    'notes/deleteNote',
    async ({ sourceId, noteId }) => {
        logger.info(`Deleting note ${noteId} from source ${sourceId}`);
        await notesContext.destroy(sourceId, noteId);
        return { sourceId, noteId };
    }
);

export const updateNote = createAsyncThunk<Note, NoteUpdate>(
    'notes/updateNote',
    async ({ sourceId, id, title: newTitle, content: newContent }) => {
        logger.info(`Updating note ${id} in source ${sourceId}`);
        const { createdAt, updatedAt, content, title } = await notesContext.update(sourceId, id, {
            title: newTitle,
            content: newContent
        });
        return {
            id,
            createdAt: createdAt.toISOString(),
            updatedAt: updatedAt.toISOString(),
            title,
            content,
            sourceId
        };
    }
);
