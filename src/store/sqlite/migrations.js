import log from '../../utils/logging';

export const createSchema = async (database) => {
    log.info('Creating (or basic upgrade) database schema');

    await database.run(
        `CREATE TABLE IF NOT EXISTS meta (
                        id INTEGER PRIMARY KEY, 
                        name TEXT, 
                        created_at TEXT, 
                        updated_at TEXT,
                        version TEXT
                        )`
    );
    await database.run(
        `CREATE TABLE IF NOT EXISTS notes (
                        id INTEGER PRIMARY KEY AUTOINCREMENT, 
                        title TEXT, 
                        created_at TEXT, 
                        updated_at TEXT,
                        content TEXT
                        )`
    );

    await database.run(
        `CREATE TRIGGER IF NOT EXISTS meta_update AFTER UPDATE ON meta 
            BEGIN
                UPDATE meta SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = 1;
            END;`
    );

    await database.run(
        `CREATE TRIGGER IF NOT EXISTS notes_insert AFTER INSERT ON notes 
            BEGIN
                UPDATE meta SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = 1;
            END;`
    );

    await database.run(
        `CREATE TRIGGER IF NOT EXISTS notes_update AFTER UPDATE ON notes 
            BEGIN
                UPDATE meta SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = 1;
            END;`
    );

    await database.run(
        `CREATE TRIGGER IF NOT EXISTS notes_delete AFTER DELETE ON notes 
            BEGIN
                UPDATE meta SET updated_at = strftime('%Y-%m-%dT%H:%M:%fZ', 'now') WHERE id = 1;
            END;`
    );

    log.info('Database schema created');
};
