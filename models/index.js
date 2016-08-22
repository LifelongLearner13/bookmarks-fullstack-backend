var config = require('../config/database')
var Sequelize = require('sequelize')

if (!global.hasOwnProperty('db')) {
  var sequelize = new Sequelize(config.CONNECT_URL)


  global.db = {
    Sequelize: Sequelize,
    sequelize: sequelize,
    User:      sequelize.import(__dirname + '/user'),
    Folder:    sequelize.import(__dirname + '/folder'),
    Bookmark:  sequelize.import(__dirname + '/bookmark')
  }

}

module.exports = global.db
