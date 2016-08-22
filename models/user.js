var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('user', {
        userid: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        localemail: {
            type: DataTypes.STRING,
            unique: true
        },
        localpassword: DataTypes.STRING,
        facebookid: DataTypes.STRING,
        facebooktoken: DataTypes.STRING,
        facebookemail: DataTypes.STRING,
        facebookname: DataTypes.STRING,
        googleid: DataTypes.STRING,
        googletoken: DataTypes.STRING,
        googleemail: DataTypes.STRING,
        googlename: DataTypes.STRING
    }, {
        freezeTableName: true,
        classMethods: {
            generateHash: function(password) {
                return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            }
        },
        instanceMethods: {
            validPassword: function(password) {
                return bcrypt.compareSync(password, this.localpassword);
            }
        }
    });
}
