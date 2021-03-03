import { DataTypes, Model, ModelCtor, Optional, Sequelize } from 'sequelize';

export interface NoteAttributes {
    id: number;
    title: string;
    content: string;
}

export interface NoteCreationAttributes extends Optional<NoteAttributes, 'id'> {}

export class Note extends Model<NoteAttributes, NoteCreationAttributes> implements NoteAttributes {
    public id!: number;
    public title!: string;
    public content!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initNoteModel = (sequelize: Sequelize): ModelCtor<Note> => {
    return sequelize.define<Note>(
        'Note',
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            title: {
                type: new DataTypes.TEXT(),
                allowNull: false
            },
            content: {
                type: new DataTypes.TEXT(),
                allowNull: true
            }
        },
        {
            timestamps: true,
            tableName: 'notes',
            underscored: true
        }
    );
};
