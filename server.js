var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

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
	res.json(assets);
});

// GET /assets/:id
app.get('/assets/:id', function (req, res) {
	var assetId = parseInt(req.params.id, 10);
	var matchedAsset = _.findWhere(assets, {id: assetId});

	if (matchedAsset) {
		res.json(matchedAsset);
	} else {
		res.status(404).send();
	}
});

// POST /assets
app.post('/assets', function (req, res) {
	var body = _.pick(req.body, 'name', 'symbol', 'amount', 'price', 'description');

	if (!_.isString(body.name) || !_.isString(body.symbol) || !_.isString(body.amount) || !_.isString(body.price) || body.description.trim().length === 0) {
		return res.status(400).send();
	}

	// set body.description to be trimmed value
	body.description = body.description.trim();

	// add id field
	body.id = assetNextId++;
	// push body into array
	assets.push(body);

	res.json(body);
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT);
});