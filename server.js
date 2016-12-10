var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;

var assets = [];
var assetNextId = 1;

app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.send('AltFund API Root');
});

// GET /assets
app.get('/assets', function (req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('holding') && query.completed === 'true') {
		where.holding = true;
	} else if (query.hasOwnProperty('holding') && query.holding === 'false') {
		where.holding = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.name = {
			$like: '%' + query.q + '%'
		};
	}

	db.asset.findAll({where: where}).then(function (assets) {
		res.json(assets);
	}, function (e) {
		res.status(500).send();
	});

	// var filteredAssets = assets;

	// if (queryParams.hasOwnProperty('holding') && queryParams.holding === 'true') {
	// 	filteredAssets = _.where(filteredAssets, {holding: true});
	// } else if (queryParams.hasOwnProperty('holding') && queryParams.holding === 'false') {
	// 	filteredAssets = _.where(filteredAssets, {holding: false});
	// }

	// if (queryParams.hasOwnProperty('q') && queryParams.q.length >0) {
	// 	filteredAssets = _.filter(filteredAssets, function (asset) {
	// 		return asset.name.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
	// 	});
	// }

	// res.json(filteredAssets);
});

// GET /assets/:id
app.get('/assets/:id', function (req, res) {
	var assetId = parseInt(req.params.id, 10);
	
	db.asset.findById(assetId).then(function (asset) {
		if (!!asset) {
			res.json(asset.toJSON());
		} else {
			res.status(404).send();
		}
	}, function (e) {
		res.status(500).send();
	});

	// var matchedAsset = _.findWhere(assets, {id: assetId});

	// if (matchedAsset) {
	// 	res.json(matchedAsset);
	// } else {
	// 	res.status(404).send();
	// }
});

// POST /assets
app.post('/assets', function (req, res) {
	var body = _.pick(req.body, 'name', 'symbol', 'amount', 'price', 'description', 'holding');

	// call create on db.asset
	//		respond with 200 and todo
	//		res.status(400).json.(e)
	db.asset.create(body).then(function (asset) {
		res.json(asset.toJSON());
	}, function (e) {
		res.status(400).json(e);
	});


	// if (!_.isString(body.name) || !_.isString(body.symbol) || !_.isString(body.amount) || !_.isString(body.price) || body.description.trim().length === 0 || !_.isBoolean(body.holding)) {
	// 	return res.status(400).send();
	// }

	// // set body.description to be trimmed value
	// body.description = body.description.trim();

	// // add id field
	// body.id = assetNextId++;
	// // push body into array
	// assets.push(body);

	// res.json(body);
});

// DELETE /assets/:id
app.delete('/assets/:id', function (req, res) {
	var assetId = parseInt(req.params.id, 10);
	
	db.asset.destroy({
		where: {
			id: assetId
		}
	}).then(function (rowsDeleted) {
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No asset with id'
			});
		} else {
			res.status(204).send();
		}
	}, function () {
		res.status(500).send();
	});

	// var matchedAsset = _.findWhere(assets, {id: assetId});

	// if (!matchedAsset) {
	// 	res.status(404).json({"error": "no asset found with that id"});
	// } else {
	// 	assets = _.without(assets, matchedAsset);
	// 	res.json(matchedAsset);
	// }
});

// PUT /assets/:id
app.put('/assets/:id', function (req, res) {
	var assetId = parseInt(req.params.id, 10);
	var body = _.pick(req.body, 'name', 'symbol', 'amount', 'price', 'description', 'holding');
	var attributes = {};

	if (body.hasOwnProperty('name')) {
		attributes.name = body.name;
	}

	if (body.hasOwnProperty('symbol')) {
		attributes.symbol = body.symbol;
	}

	if (body.hasOwnProperty('amount')) {
		attributes.amount = body.amount;
	}

	if (body.hasOwnProperty('price')) {
		attributes.price = body.price;
	}

	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}

	if (body.hasOwnProperty('holding')) {
		attributes.holding = body.holding;
	}

	db.asset.findById(assetId).then(function (asset) {
		if (asset) {
			asset.update(attributes).then(function(asset) {
				res.json(asset.toJSON());
			}, function(e) {
				res.status(400).json(e);
			});
		} else {
			res.status(404).send();
		}
	}, function () {
		res.status(500).send();
	});
});

// POST /users
app.post('/users', function(req, res) {
	var body = _.pick(req.body, 'email', 'password');

	db.user.create(body).then(function (user) {
		res.json(user.toPublicJSON());
	}, function (e) {
		res.status(400).json(e);
	});
});

// POST /users/login
app.post('/users/login', function (req, res) {
	var body = _.pick(req.body, 'email', 'password');

	if (typeof body.email !== 'string' || typeof body.password !== 'string') {
		return res.status(400).send();
	}

	db.user.findOne({
		where: {
			email: body.email
		}
	}).then(function (user) {
		if (!user) {
			return res.status(401).send();
		}

		res.json(user.toJSON());
	}, function (e) {
		res.status(500).send();
	});
});

db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
		console.log('Express listening on port ' + PORT);
	});
});
