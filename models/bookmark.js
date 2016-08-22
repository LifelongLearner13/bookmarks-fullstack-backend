/*
CREATE TABLE "bookmark"(
  url VARCHAR(100) NOT NULL,
  title VARCHAR(100) NOT NULL,
  description TEXT DEFAULT '',
  folderid INTEGER REFERENCES "folder" (folderid),
  screenshot VARCHAR(100) DEFAULT 'http://placekitten.com/200/300',
  bookmarkid SERIAL PRIMARY KEY,
  userid INTEGER REFERENCES "user" (userid)
);
*/
// var folder = require('./folder');
// var user = require('./user');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('bookmark', {
        bookmarkid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        url: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        description: DataTypes.TEXT,
        folderid: {
            type: DataTypes.INTEGER,
            references: {
                // This is a reference to another model
                model: 'folder',

                // This is the column name of the referenced model
                key: 'folderid'
            }
        },
        screenshot: {
            type: DataTypes.STRING,
            defaultValue: 'http://placekitten.com/200/300'
        },
        userid: {
            type: DataTypes.INTEGER,
            references: {
                // This is a reference to another model
                model: 'user',

                // This is the column name of the referenced model
                key: 'userid'
            }
        }
    }, {
        freezeTableName: true
    })
}
