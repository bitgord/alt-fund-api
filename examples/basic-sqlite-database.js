var Sequelize = require('Sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	'dialect': 'sqlite',
	'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Asset = sequelize.define('asset', {
	name: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1,15]
		}
	},
	symbol: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1,10]
		}
	},
	amount: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1,100],
			isNumeric: true 
		}
	},
	price: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1,15],
			isNumeric: true 
		}
	},
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			len: [1,100]
		}
	},
	holding: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false,
		validate: {
		}
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
	}).catch(function (e) {
		console.log(e);
	});
});