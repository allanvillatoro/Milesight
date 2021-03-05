////////MOSCA////////
var mosca = require('mosca');
var mongoose = require('mongoose');
var MedicionLuz = mongoose.model('MedicionLuz');
var LightSensorDecoder = require('./decoders/LightSensorDecoder');
var CO2SensorDecoder = require('./decoders/CO2SensorDecoder');

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

//Guarda la medición en la base de datos
function guardarMedicionLuz(devEUI1,data1,light1,time1){
	const medicion = new MedicionLuz(
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
				var decoded = LightSensorDecoder(bufferTest,85);
				guardarMedicionLuz(json.devEUI, json.data, decoded.light, json.time);
			}
			else if (json.devEUI == '24e124126a233225')
			{
				var bufferTest = Buffer.from(json.data, 'base64');
				var decoded = CO2SensorDecoder(bufferTest,85);
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

module.exports.server = server;