/*
CREATE TABLE "folder"(
  folderid SERIAL PRIMARY KEY,
  foldername VARCHAR(20) NOT NULL UNIQUE
);
*/

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('folder', {
        folderid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        foldername: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        }
    }, {
        freezeTableName: true
    })
}
