module.exports = function defineNoteModel(sequelize, DataTypes) {
    return sequelize.define(
        'Note',
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            title: {
                type: DataTypes.TEXT,
                allowNull: false
            },
            content: {
                type: DataTypes.TEXT
            }
        },
        {
            timestamps: true,
            underscored: true
        }
    );
};
