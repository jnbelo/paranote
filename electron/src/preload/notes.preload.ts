import { contextBridge } from 'electron';
import { CreateNote, UpdateNote, Note } from '@paranote/common/src';
import logger from 'electron-log';
import * as databases from '../database/databases';

contextBridge.exposeInMainWorld('notesRepo', {
    create: async (databaseId: string, note: CreateNote): Promise<Note> => {
        logger.debug('Context bridge: Creating new note');
        const database = databases.get(databaseId);
        const { id, title, createdAt, updatedAt, content } = await database.Note.create(note);
        return { id, title, createdAt, updatedAt, content };
    },
    update: async (databaseId: string, noteId: number, update: UpdateNote): Promise<Note> => {
        logger.debug('Context bridge: Updating an existing note');
        const database = databases.get(databaseId);
        const existing = await database.Note.findByPk(noteId);
        if (!existing) {
            throw new Error(`Note ${noteId} was not found in source ${databaseId}`);
        }
        Object.assign(existing, update);
        await existing.save();
        const { id, title, createdAt, updatedAt, content } = existing;
        return { id, title, createdAt, updatedAt, content };
    },
    destroy: async (databaseId: string, noteId: number): Promise<void> => {
        logger.debug('Context bridge: Deleting an existing note');
        const database = databases.get(databaseId);
        await database.Note.destroy({ where: { id: noteId } });
    },
    getAll: async (databaseId: string): Promise<Note[]> => {
        logger.debug("Context bridge: Getting all database's notes ");
        const database = databases.get(databaseId);
        return (await database.Note.findAll()).map(
            ({ id, title, createdAt, updatedAt, content }) => ({
                id,
                createdAt,
                updatedAt,
                title,
                content
            })
        );
    }
});
