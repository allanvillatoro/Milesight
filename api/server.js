var express = require('express');
var app = express();

//Configuración JSON e Index
var path = require('path');
var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend/build'))); //Es necesario antes ejecutar en el frontend: npm run build

////////MongoDB///////////
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/milesight', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('conectado a la BD');
});
var models = require('./models/MedicionLuz')(mongoose);

//MQTT Broker
var mqttbroker = require('./MqttBroker.js');

//Router
var LuminosidadRoute = require('./routes/MedicionesLuz');
var ControlLuzRoute = require('./routes/ControlLuz');
app.use('/api/medicionesluz', LuminosidadRoute);
app.use('/api/controlluz', ControlLuzRoute);

app.listen(3000, function () {
	console.log('App escuchando en puerto 3000!');
});

app.get( ['/','/ControlLuz'], function (req, res) {
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.use(function(req, res, next) {
  res.status(404).send('La página solicitada no existe!');
});