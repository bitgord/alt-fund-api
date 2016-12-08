var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;

var assets = [{
	id: 1,
	company: 'Google',
	ticker: 'GOOG',
	amount: '100',
	price: '100'
}, {
	id: 2,
	company: 'Bitcoin',
	ticker: 'BTC',
	amount: '100',
	price: '1000'
}, {
	id: 3,
	company: 'Ethereum',
	ticker: 'Eth',
	amount: '1000',
	price: '10'
}]

app.get('/', function (req, res) {
	res.send('AltFund API Root');
});

// GET /assets
app.get('/assets', function (req, res) {
	res.json(assets);
});

// GET /assets/:id
app.get('/assets/:id', function (req, res) {
	res.send('Asking for todo with id of ' + req.params.id)
});

app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT);
});