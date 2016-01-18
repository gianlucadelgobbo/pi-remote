var express 	= require('express');
var bodyParser	= require("body-parser");
var config 	= require('getconfig');
var app 	= express();

app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.render('index', { title: 'PI Remote', message: 'Hello there!', description:"bella"});
});
app.post('/', function (req, res) {
	if (req.body.login==config.login && req.body.password==config.password) {
		var Gpio = require('onoff').Gpio;		// Constructor function for Gpio objects.
		var relay = new Gpio(14, 'out');			// Export GPIO #14 as an output.
		relay.read(function (err, value) { // Asynchronous read.
			console.log("Start: "+value);
			if (err) {
				console.log(err);
				throw err;
			}
		
			relay.write(1, function (err) { // Asynchronous write.
				console.log("First: "+1);
				if (err) {
					console.log(err);
					throw err;
				}
				relay.write(0, function (err) { // Asynchronous write.
					console.log("Second: "+0);
					if (err) {
						console.log(err);
						throw err;
					}
					res.render('index', { title: 'PI Remote', message: 'Hello there!', res:req.body, result:true});
				});
			});
		});
	} else {
		res.render('index', { title: 'PI Remote', message: 'Login failed', res:req.body, result:false});	
	}
});
	
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('Example app listening at http://%s:%s', host, port);
});
