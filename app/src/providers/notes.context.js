let counter = 0;
const incrementCounter = () => {
    return counter++;
};

export const create = async (databaseId, note) => {
    if (window.notesRepo) {
        return await window.notesRepo.create(databaseId, note);
    }

    return {
        ...note,
        id: incrementCounter()
    };
};

export const update = async (databaseId, noteId, update) => {
    if (window.notesRepo) {
        return await window.notesRepo.update(databaseId, noteId, update);
    }

    return {
        id: noteId,
        ...update
    };
};

export const destroy = async (databaseId, noteId) => {
    if (window.notesRepo) {
        await window.notesRepo.destroy(databaseId, noteId);
    }
};

export const getAll = async (databaseId) => {
    if (window.notesRepo) {
        return await window.notesRepo.getAll(databaseId);
    }

    return [];
};
