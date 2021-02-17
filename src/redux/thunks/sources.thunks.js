import { createAsyncThunk } from '@reduxjs/toolkit';
import * as databases from '../../providers/database';

const CURRENT_VERSION = 0.1;

export const createSource = createAsyncThunk(
    'sources/createSource',
    async ({ location, password, name }, { getState }) => {
        const { byId } = getState().entities.sources;

        for (const source in byId) {
            if (location === source.location) {
                throw new Error(`Source in ${location} is already open`);
            }
        }

        const database = await databases.create({ location, password });
        const meta = await database.Meta.create({ name, version: `${CURRENT_VERSION}` });
        return {
            id: database.id,
            location,
            name,
            version: meta.version,
            notes: []
        };
    }
);

export const loadSource = createAsyncThunk(
    'sources/loadSource',
    async ({ location, password }, { getState }) => {
        const { byId } = getState().entities.sources;

        for (const source in byId) {
            if (location === source.location) {
                throw new Error(`Source in ${location} is already open`);
            }
        }

        const database = await databases.open({ location, password });
        const meta = await database.Meta.findOne();

        if (!meta) {
            throw new Error('Unable to find meta-information');
        }

        if (!meta.name || !meta.createdAt || !meta.updatedAt) {
            throw new Error('Database has invalid meta-information');
        }

        const notes = (await database.Note.findAll()).map(
            ({ id, title, createdAt, updatedAt, content }) => ({
                id,
                createdAt,
                updatedAt,
                title,
                content
            })
        );

        return {
            id: database.id,
            location,
            name: meta.name,
            version: meta.version,
            notes
        };
    }
);

export const removeSource = createAsyncThunk('sources/removeSource', async ({ id }) => {
    await databases.close(id);
    return id;
});
