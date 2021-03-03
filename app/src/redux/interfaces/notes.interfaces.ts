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
    createdAt: Date;
    updatedAt: Date;
}
