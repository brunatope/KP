var app = require('./app_config.js');

var validator = require('validator');

app.get('/', function(req, res) {

	res.end('Servidor ON!');
});


app.get('/clientes', function(req, res) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.json( require( "./listaCliente.json" ));
});
