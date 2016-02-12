var express 	= require('express');
var bodyParser	= require("body-parser");
var config 		= require('getconfig');
var app 		= express();

var myTimer;

var Gpio = require('onoff').Gpio;		// Constructor function for Gpio objects.
var relay = new Gpio(config.myGpio, 'out');			// Export GPIO #14 as an output.

app.set('view engine', 'jade');
app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function (req, res) {
	res.render('index', { title: 'PI Remote', message: 'Hello there!', description:"bella"});
});
function logStatus(fnc,relay) {
	relay.read(function (err, value) { // Asynchronous read.
		console.log(fnc+": "+value);
	});
}
function on(relay, callback) {
	//logStatus("on",relay);
	relay.write(1, callback);
}
function off(relay, callback) {
	//logStatus("off",relay);
	if (myTimer) clearTimeout(myTimer);
	relay.write(0, callback);
}
function onoff(relay, callback) {
	logStatus("onoff",relay);
	if (myTimer) clearTimeout(myTimer);
	on(relay, function () {
		//off(relay, callback);
		myTimer = setTimeout(off, config.delay, relay, callback);	
	});
}
app.post('/', function (req, res) {
	if (req.body.login==config.login && req.body.password==config.password) {
		relay.read(function (err, value) { // Asynchronous read.
			logStatus("post",relay);
			if (err) {
				console.log(err);
				throw err;
			} else {
				onoff(relay, function () {
					//logStatus("DONE",relay);
					res.render('index', { title: 'PI Remote', message: 'Hello there!', res:req.body, result:true});
				});
			}
		});
	} else {
		res.render('index', { title: 'PI Remote', message: 'Maybe you are not welcome?', res:req.body, result:false});	
	}
});
	
var server = app.listen(3000, function () {
	var host = server.address().address;
	var port = server.address().port;
	
	console.log('App PI Remote listening at http://%s:%s', host, port);
});
