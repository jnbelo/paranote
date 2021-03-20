import { ModelCtor, Sequelize } from 'sequelize/types';
import { Meta } from '../models/meta.model';
import { Note } from '../models/note.model';

export interface CreateDatabase {
    location: string;
    password?: string;
}

export interface Database {
    id: string;
    sequelize: Sequelize;
    Meta: ModelCtor<Meta>;
    Note: ModelCtor<Note>;
}
