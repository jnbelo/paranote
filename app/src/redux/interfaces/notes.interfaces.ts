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
