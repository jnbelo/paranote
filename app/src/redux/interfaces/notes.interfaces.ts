export interface NotesState {
    [key: string]: NotesBySource;
}

export interface NotesBySource {
    byId: { [key: number]: Note };
    allIds: number[];
}

export interface Note {
    id: number;
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    sourceId: string;
}

export interface NoteDelete {
    sourceId: string;
    noteId: number;
}

export interface NoteUpdate {
    id: number;
    title: string;
    content: string;
    sourceId: string;
}

export function areSameNotes(
    note1: Note | undefined | null,
    note2: Note | undefined | null
): boolean {
    if (note1 === note2) {
        return true;
    }

    if (note1 && note2) {
        return note1.id === note2.id && note1.sourceId === note2.sourceId;
    }

    return false;
}
