import { CreateNote, CreateSource, LoadSource, Note, Source, UpdateNote } from '@paranote/common';
import { remove } from 'lodash';
import { v4 } from 'uuid';

let index = 0;
const sources: { [location: string]: Source } = {};
const notes: { [sourceId: string]: Note[] } = {};

export function mockCreateSource({ location, password, name }: CreateSource): Source {
    const source: Source = {
        id: v4(),
        location,
        name,
        version: 'no-version'
    };

    sources[location] = source;
    return source;
}

export function mockLoadSource({ location, password }: LoadSource): Source {
    const source = sources[location];
    if (!source) {
        throw new Error(`Source in '${location}' was not found`);
    }

    return source;
}

export function mockCreateNote(sourceId: string, noteData: CreateNote): Note {
    if (!(sourceId in notes)) {
        notes[sourceId] = [];
    }

    const newNote = {
        ...noteData,
        createdAt: new Date(),
        updatedAt: new Date(),
        id: ++index
    };

    notes[sourceId].push(newNote);

    return newNote;
}

export function mockUpdateNote(sourceId: string, noteId: number, noteData: UpdateNote): Note {
    if (!(sourceId in notes)) {
        throw new Error(`Source '${sourceId}' was not found`);
    }

    const note = notes[sourceId].find((n) => n.id === noteId);

    if (!note) {
        throw new Error(`Note ${noteId} was not found in source ${sourceId}`);
    }

    note.title = noteData.title;
    note.content = noteData.content;
    note.updatedAt = new Date();

    return note;
}

export function mockDeleteNote(sourceId: string, noteId: number): void {
    if (!(sourceId in notes)) {
        throw new Error(`Source '${sourceId}' was not found`);
    }

    remove(notes[sourceId], (n) => n.id === noteId);
}

export function mockGetAllNotes(sourceId: string): Note[] {
    if (!(sourceId in notes)) {
        throw new Error(`Source '${sourceId}' was not found`);
    }

    return notes[sourceId];
}
