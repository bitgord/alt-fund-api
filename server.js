var express = require('express');
var bodyParser = require('body-parser');

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
	var matchedAsset;

	assets.forEach(function (asset) {
		if (assetId === asset.id) {
			matchedAsset = asset;
		}
	});

	if (matchedAsset) {
		res.json(matchedAsset);
	} else {
		res.status(404).send();
	}
});

// POST /assets
app.post('/assets', function (req, res) {
	var body = req.body;

	console.log('description');

	res.json(body);
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT);
});