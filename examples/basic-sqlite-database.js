var Sequelize = require('Sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Asset = sequelize.define('asset', {
	name: {
		type: Sequelize.STRING
	},
	symbol: {
		type: Sequelize.STRING
	},
	amount: {
		type: Sequelize.STRING
	},
	price: {
		type: Sequelize.STRING
	},
	description: {
		type: Sequelize.STRING
	},
	holding: {
		type: Sequelize.BOOLEAN
	}
})

sequelize.sync().then(function () {
	console.log('Everything is synced');

	Asset.create({
		 "name": "Bitcoin",
	    "symbol": "BTC",
	    "amount": "100",
	    "price": "1000",
	    "description": "#1 digi currency",
	    "holding": true
	}).then(function (asset) {
		console.log('Finished');
		console.log(asset);
	});

});