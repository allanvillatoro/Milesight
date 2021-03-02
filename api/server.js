var express = require('express');
var path = require('path');
var app = express();
var lightSensor = require('./EM500-LGT');
var co2Sensor = require('./EM500-CO2');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Es necesario antes ejecutar en el frontend: npm run build
app.use(express.static(path.join(__dirname, '../frontend/build')));

////////MOSCA////////
var mosca = require('mosca');

var pubsubsettings = {
  //using ascoltatore
  type: 'mongo',		
  url: 'mongodb://localhost:27017/mqtt',
  pubsubCollection: 'ascoltatori',
  mongo: {}
};

var moscaSettings = {
  port: 1883,
  backend: pubsubsettings
};

var server = new mosca.Server(moscaSettings);	//here we start mosca
server.on('ready', setup);	//on init it fires up setup()

// fired when the mqtt server is ready
function setup() {
	console.log('Mosca server is up and running');
}

/////DOWNLINK REMOTE IO//////
//Digital Output 1 as High
//HEX: 09 01 00 ff
//BASE64: CQEA/w==

//Digital Output 1 as Low
//HEX: 09 00 00 ff
//BASE64: CQAA/w==

function generarMensajeDownlink (encender)
{
	var mensaje;
	if (encender){
		mensaje = '{"confirmed": true,"fport": 85,"data": "CQEA/w=="}';		
	}
	else {
		mensaje = '{"confirmed": true,"fport": 85,"data": "CQAA/w=="}';
	}
	var message = {
		topic: '/ursalink/downlink/24e124116a157307',
		payload: mensaje, // or a Buffer
		qos: 2, // 0, 1, or 2
		retain: false // or true
	};
	return message;
}

function guardarMedicionLuz(devEUI1,data1,light1,time1){
	const medicion = new Luminosidad(
	{
			devEUI: devEUI1,
			data: data1,
			light: light1,
			time: time1
	});
	medicion.save(function (err, medicion1) {
		if (err) {
			console.err(err);
		}
		else {
			console.log('Agregado exitosamente a la BD');
		}
	});
}

//////////////////////
// fired when a message is published
server.on('published', function(packet, client) {
	//console.log('Published: ', packet);
	//console.log('Client', client);
	if (packet.topic == '/ursalink/uplink')
	{
		var stringBuf = packet.payload.toString('utf-8')
		try {
			var json = JSON.parse(stringBuf);
			
			if (json.devEUI == '24e124126a230185')
			{
				var bufferTest = Buffer.from(json.data, 'base64');
				var decoded = lightSensor(bufferTest,85);
				console.log('');
				console.log("DevEUI: " + json.devEUI );
				console.log("Payload: " + json.data);
				console.log("Time: " + json.time);
				console.log('Light: ' + decoded.light + " lux");
				guardarMedicionLuz(json.devEUI, json.data, decoded.light, json.time);
			}
			else if (json.devEUI == '24e124126a233225')
			{
				var bufferTest = Buffer.from(json.data, 'base64');
				var decoded = co2Sensor(bufferTest,85);
				console.log(decoded);
			}
		} catch (e) {
			console.log( stringBuf );
		}
	}
});
// fired when a client connects
server.on('clientConnected', function(client) {
	//console.log('Client Connected:', client.id);
});

// fired when a client disconnects
server.on('clientDisconnected', function(client) {
	//console.log('Client Disconnected:', client.id);
});

////////APP///////////
mongoose.connect('mongodb://localhost:27017/milesight', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('conectado a la BD');
});
const lightSchema = new mongoose.Schema({
  devEUI: String,
  data : String,
  light : Number, 
  time: Date
});
const Luminosidad = mongoose.model('Luminosidad', lightSchema);

app.listen(3000, function () {
  console.log('App escuchando en puerto 3000!');
});

app.get('/', function (req, res) {
    res.send("Inicio");
});

app.get('/api/luminosidad', function (req, res) {
    Luminosidad.find(function (err, mediciones) {
        if (err)
            res.status(500).send('Error en la base de datos');
        else
            res.status(200).json(mediciones);
    });
});

app.get('/api/luminosidad/ultimo', function (req, res) {
	Luminosidad.find()
	.sort({time: -1})
	.limit(1)
	.then(mediciones => {
		if (mediciones.length > 0)
			res.status(200).json(mediciones[0]);
		else
			res.status(500).send('No hay datos agregados.');
	})
	.catch(error => {
		console.err(error);
		res.status(500).send('Error en la base de datos');
	});
});

app.post('/api/luminosidad', function (req, res) {
	const medicion = new Luminosidad(
		{
			devEUI: req.body.devEUI,
			data: req.body.data,
			light: req.body.light,
			time: Date.now()
	});
	medicion.save(function (err, medicion1) {
		if (err) {
			res.status(500).send('No se ha podido agregar.');
		}
		else {
			res.status(200).json('Agregado exitosamente');
		}
	});
});

app.post('/api/control', function (req, res) {
	var message;
	var encendido = req.body.encendido;	
	if (encendido)
		message = generarMensajeDownlink(true);
	else
		message = generarMensajeDownlink(false);

	server.publish(message, function() {
  		res.status(200).json({estado : 1});
  	},function(e){
  		console.error(e);
  		res.status(500).send({estado : -1});
  	});
});

