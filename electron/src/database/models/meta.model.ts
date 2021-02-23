import { DataTypes, Model, ModelCtor, Optional, Sequelize } from 'sequelize/types';

export interface MetaAttributes {
    id: number;
    name: string;
    version: string;
}

export interface MetaCreationAttributes extends Optional<MetaAttributes, 'id'> {}

export class Meta extends Model<MetaAttributes, MetaCreationAttributes> implements MetaAttributes {
    public id!: number;
    public name!: string;
    public version!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
}

export const initMetaModel = (sequelize: Sequelize): ModelCtor<Meta> => {
    return sequelize.define<Meta>(
        'Meta',
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                autoIncrement: true,
                primaryKey: true
            },
            name: {
                type: new DataTypes.TEXT(),
                allowNull: false
            },
            version: {
                type: new DataTypes.STRING(32),
                allowNull: true
            }
        },
        {
            timestamps: true,
            tableName: 'meta',
            underscored: true
        }
    );
};
