var express = require('express');
var mqttbroker = require('../MqttBroker.js');
var router = express.Router(); //es para crear una miniaplicacion

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

router.post('/', function (req, res) {
	var message;
	var encendido = req.body.encendido;	
	if (encendido)
		message = generarMensajeDownlink(true);
	else
		message = generarMensajeDownlink(false);

	mqttbroker.server.publish(message, function() {
  		res.status(200).json({estado : 1});
  	},function(e){
  		console.error(e);
  		res.status(500).send({estado : -1});
  	});
});

module.exports = router;