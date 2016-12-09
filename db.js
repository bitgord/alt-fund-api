var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/data/dev-investment-fund-api.sqlite'
});
var db = {};

db.asset = sequelize.import(__dirname + '/models/asset.js');
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;