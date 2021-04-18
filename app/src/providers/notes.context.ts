import { CreateNote, Note, UpdateNote } from '@paranote/common/src';
import { mockCreateNote, mockDeleteNote, mockGetAllNotes, mockUpdateNote } from './storage.mock';

declare global {
    interface Window {
        notesRepo?: {
            create: (databaseId: string, note: CreateNote) => Promise<Note>;
            update: (databaseId: string, noteId: number, note: UpdateNote) => Promise<Note>;
            destroy: (databaseId: string, noteId: number) => Promise<void>;
            getAll: (databaseId: string) => Promise<Note[]>;
        };
    }
}

export const create = async (databaseId: string, note: CreateNote): Promise<Note> => {
    if (window.notesRepo) {
        return await window.notesRepo.create(databaseId, note);
    } else {
        return mockCreateNote(databaseId, note);
    }
};

export const update = async (
    databaseId: string,
    noteId: number,
    note: UpdateNote
): Promise<Note> => {
    if (window.notesRepo) {
        return await window.notesRepo.update(databaseId, noteId, note);
    } else {
        return mockUpdateNote(databaseId, noteId, note);
    }
};

export const destroy = async (databaseId: string, noteId: number): Promise<void> => {
    if (window.notesRepo) {
        await window.notesRepo.destroy(databaseId, noteId);
    } else {
        mockDeleteNote(databaseId, noteId);
    }
};

export const getAll = async (databaseId: string): Promise<Note[]> => {
    if (window.notesRepo) {
        return await window.notesRepo.getAll(databaseId);
    } else {
        return mockGetAllNotes(databaseId);
    }
};
