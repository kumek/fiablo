var http = require('http');
var express = require('express');
var color = require('colors');
var path = require('path');

var app = express();

const PORT = 3000;

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', function(req, res) {
	res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(PORT, function() {
	console.log('App has started'.green);
});
