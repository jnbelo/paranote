export default function defineMetaModel(sequelize, DataTypes) {
    return sequelize.define(
        'Meta',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            name: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            version: {
                type: DataTypes.TEXT,
                allowNull: false
            }
        },
        {
            timestamps: true,
            tableName: 'meta',
            underscored: true
        }
    );
}
