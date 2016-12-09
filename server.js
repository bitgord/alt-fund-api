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
	var queryParams = req.query;
	var filteredAssets = assets;

	if (queryParams.hasOwnProperty('holding') && queryParams.holding === 'true') {
		filteredAssets = _.where(filteredAssets, {holding: true});
	} else if (queryParams.hasOwnProperty('holding') && queryParams.holding === 'false') {
		filteredAssets = _.where(filteredAssets, {holding: false});
	}

	if (queryParams.hasOwnProperty('q') && queryParams.q.length >0) {
		filteredAssets = _.filter(filteredAssets, function (asset) {
			return asset.name.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1;
		});
	}

	res.json(filteredAssets);
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
	var matchedAsset = _.findWhere(assets, {id: assetId});

	if (!matchedAsset) {
		res.status(404).json({"error": "no asset found with that id"});
	} else {
		assets = _.without(assets, matchedAsset);
		res.json(matchedAsset);
	}
});

// PUT /assets/:id
app.put('/assets/:id', function (req, res) {
	var assetId = parseInt(req.params.id, 10);
	var matchedAsset = _.findWhere(assets, {id: assetId});
	var body = _.pick(req.body, 'name', 'symbol', 'amount', 'price', 'description', 'holding');
	var validAttributes = {};

	if (!matchedAsset) {
		return res.status(404).send();
	}

	if (body.hasOwnProperty('name') && _.isString(body.name)) {
		validAttributes.name = body.name;
	} else if (body.hasOwnProperty('name')) {
		// Bad
		return res.status(400).send();
	}

	if (body.hasOwnProperty('symbol') && _.isString(body.symbol)) {
		validAttributes.symbol = body.symbol;
	} else if (body.hasOwnProperty('symbol')) {
		// Bad
		return res.status(400).send();
	}

	if (body.hasOwnProperty('amount') && _.isString(body.amount)) {
		validAttributes.amount = body.amount;
	} else if (body.hasOwnProperty('amount')) {
		// Bad
		return res.status(400).send();
	}

	if (body.hasOwnProperty('price') && _.isString(body.price)) {
		validAttributes.price = body.price;
	} else if (body.hasOwnProperty('price')) {
		// Bad
		return res.status(400).send();
	}

	if (body.hasOwnProperty('description') && _.isString(body.description)) {
		validAttributes.description = body.description;
	} else if (body.hasOwnProperty('description')) {
		// Bad
		return res.status(400).send();
	}

	if (body.hasOwnProperty('holding') && _.isBoolean(body.holding)) {
		validAttributes.holding = body.holding;
	} else if (body.hasOwnProperty('holding')) {
		// Bad
		return res.status(400).send();
	}

	_.extend(matchedAsset, validAttributes);
	res.json(matchedAsset);

});
db.sequelize.sync().then(function () {
	app.listen(PORT, function () {
		console.log('Express listening on port ' + PORT);
	});
});
