import { CreateNote, UpdateNote, Note } from '@paranote/common/src';

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

let counter = 0;
const incrementCounter = () => {
    return counter++;
};

export const create = async (databaseId: string, note: CreateNote): Promise<Note> => {
    if (window.notesRepo) {
        return await window.notesRepo.create(databaseId, note);
    }

    return {
        ...note,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: incrementCounter()
    };
};

export const update = async (
    databaseId: string,
    noteId: number,
    note: UpdateNote
): Promise<Note> => {
    if (window.notesRepo) {
        return await window.notesRepo.update(databaseId, noteId, note);
    }

    return {
        id: noteId,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...note
    };
};

export const destroy = async (databaseId: string, noteId: number): Promise<void> => {
    if (window.notesRepo) {
        await window.notesRepo.destroy(databaseId, noteId);
    }
};

export const getAll = async (databaseId: string): Promise<Note[]> => {
    if (window.notesRepo) {
        return await window.notesRepo.getAll(databaseId);
    }

    return [];
};
