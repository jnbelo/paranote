import fs from 'fs';
import path from 'path';
import SQL from 'sql-template-strings';
import { delay } from '../../utils/time';
import { createSource, CURRENT_VERSION, loadSource } from './database';

const testDir = './tmp';
const testDb = path.join(testDir, 'test.parax');

const createTestSource = async (name, location, password) => {
    const source = await createSource(name, location, password);
    await source.database.close();
};

beforeAll(() => {
    if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir);
    }
});

beforeEach(() => {
    const files = fs.readdirSync(testDir);
    for (const file of files) {
        fs.unlinkSync(path.join(testDir, file));
    }
});

let source;

afterEach(async () => {
    if (source) {
        try {
            await source.database.close();
        } catch (e) {}
    }
});

it('should create a new database source', async () => {
    source = await createSource('test_db', testDb);
    const tables = await source.database.all(
        SQL`SELECT name FROM sqlite_master WHERE type='table'`
    );
    const triggers = await source.database.all(
        SQL`SELECT name FROM sqlite_master WHERE type='trigger'`
    );

    expect(source.type).toBe('database');
    expect(source.name).toBe('test_db');
    expect(source.version).toBe(CURRENT_VERSION.toString());
    expect(tables).toEqual(expect.arrayContaining([{ name: 'meta' }, { name: 'notes' }]));
    expect(triggers).toEqual(
        expect.arrayContaining([
            { name: 'notes_insert' },
            { name: 'notes_update' },
            { name: 'notes_delete' },
            { name: 'meta_update' }
        ])
    );
});

it('should create a new database source with password', async () => {
    source = await createSource('test_db', testDb, 'test_password');
    const tables = await source.database.all(
        SQL`SELECT name FROM sqlite_master WHERE type='table'`
    );
    const triggers = await source.database.all(
        SQL`SELECT name FROM sqlite_master WHERE type='trigger'`
    );

    expect(source.type).toBe('database');
    expect(source.name).toBe('test_db');
    expect(source.version).toBe(CURRENT_VERSION.toString());
    expect(tables).toEqual(expect.arrayContaining([{ name: 'meta' }, { name: 'notes' }]));
    expect(triggers).toEqual(
        expect.arrayContaining([
            { name: 'notes_insert' },
            { name: 'notes_update' },
            { name: 'notes_delete' },
            { name: 'meta_update' }
        ])
    );
});

it('should load an existing database source', async () => {
    await createTestSource('test_db', testDb);
    source = await loadSource(testDb);

    expect(source.type).toBe('database');
    expect(source.name).toBe('test_db');
    expect(source.version).toBe(CURRENT_VERSION.toString());

    const tables = await source.database.all(
        SQL`SELECT name FROM sqlite_master WHERE type='table'`
    );
    const triggers = await source.database.all(
        SQL`SELECT name FROM sqlite_master WHERE type='trigger'`
    );

    expect(tables).toEqual(expect.arrayContaining([{ name: 'meta' }, { name: 'notes' }]));
    expect(triggers).toEqual(
        expect.arrayContaining([
            { name: 'notes_insert' },
            { name: 'notes_update' },
            { name: 'notes_delete' },
            { name: 'meta_update' }
        ])
    );
});

it('should load an existing password-protected source', async () => {
    await createTestSource('test_db', testDb, 'password');
    source = await loadSource(testDb, 'password');

    expect(source.type).toBe('database');
    expect(source.name).toBe('test_db');
    expect(source.version).toBe(CURRENT_VERSION.toString());
});

it('should not load an existing password-protected source when password is incorrect', async () => {
    await createTestSource('test_db', testDb, 'password');

    const stmt = async () => {
        source = await loadSource(testDb, 'password2');
    };

    await expect(stmt()).rejects.toThrowError('Invalid password or file');
});

it('should create a new note', async () => {
    const newNote = { title: 'note_title', content: 'note_content' };

    source = await createSource('test_db', testDb);
    const created = await source.createNote(newNote);

    expect(created.id).toBeDefined();
    expect(created.createdAt).toBeDefined();
    expect(created.updatedAt).toBeDefined();
    expect(created.title).toBe(newNote.title);
    expect(created.content).toBe(newNote.content);
});

it('should update an existing note', async () => {
    const newNote = { title: 'note_title', content: 'note_content' };

    source = await createSource('test_db', testDb);
    const created = await source.createNote(newNote);

    await delay(100);
    const updatedNote = { id: created.id, title: 'new_note_title', content: 'new_note_content' };
    const updated = await source.updateNote(updatedNote);

    expect(updated.id).toBeDefined();
    expect(updated.createdAt).toBeDefined();
    expect(updated.updatedAt).toBeDefined();
    expect(updated.updatedAt).not.toEqual(updated.createdAt);
    expect(updated.title).toBe(updatedNote.title);
    expect(updated.content).toBe(updatedNote.content);
});

it('should get an existing note', async () => {
    const newNote = { title: 'note_title', content: 'note_content' };

    source = await createSource('test_db', testDb);
    const created = await source.createNote(newNote);
    const fetched = await source.getNote(created.id);

    expect(fetched.id).toEqual(created.id);
    expect(fetched.createdAt).toEqual(created.createdAt);
    expect(fetched.updatedAt).toEqual(created.updatedAt);
    expect(fetched.title).toBe(newNote.title);
    expect(fetched.content).toBe(newNote.content);
});

it('should delete an existing note', async () => {
    const newNote = { title: 'note_title', content: 'note_content' };

    source = await createSource('test_db', testDb);
    const created = await source.createNote(newNote);
    await source.removeNote(created.id);

    const stmt = async () => {
        await source.getNote(created.id);
    };

    await expect(stmt()).rejects.toThrowError(`Unable to find note ${created.id}`);
});

it('should get all notes', async () => {
    const newNote = { title: 'note_title', content: 'note_content' };
    const newNote2 = { title: 'note_title_2', content: 'note_content_2' };
    const newNote3 = { title: 'note_title_3', content: 'note_content_3' };

    source = await createSource('test_db', testDb);
    const created = await source.createNote(newNote);
    const created2 = await source.createNote(newNote2);
    const created3 = await source.createNote(newNote3);

    const fetched = await source.getNotes();

    expect(fetched).toEqual(expect.arrayContaining([created, created2, created3]));
});

it('should clean up source', async () => {
    source = await createSource('test_db', testDb);

    await source.cleanUp();

    const stmt = async () => {
        await source.database.get(SQL`SELECT * FROM meta`);
    };

    await expect(stmt()).rejects.toThrowError('SQLITE_MISUSE: Database is closed');
});
