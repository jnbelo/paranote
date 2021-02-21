const { contextBridge } = require('electron');
const logger = require('electron-log');
const databases = require('../database/database');

contextBridge.exposeInMainWorld('notesRepo', {
    create: async (databaseId, note) => {
        logger.debug('Context bridge: Creating new note');
        const database = databases.get(databaseId);
        const { id, title, createdAt, updatedAt, content } = await database.Note.create(note);
        return { id, title, createdAt, updatedAt, content };
    },
    update: async (databaseId, noteId, update) => {
        logger.debug('Context bridge: Updating an existing note');
        const database = databases.get(databaseId);
        const existing = await database.Note.findByPk(noteId);
        Object.assign(existing, update);
        await existing.save();
        const { id, title, createdAt, updatedAt, content } = existing;
        return { id, title, createdAt, updatedAt, content };
    },
    destroy: async (databaseId, noteId) => {
        logger.debug('Context bridge: Deleting an existing note');
        const database = databases.get(databaseId);
        await database.Note.destroy({ where: { id: noteId } });
    },
    getAll: async (databaseId) => {
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
