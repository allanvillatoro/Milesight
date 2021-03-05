var mongoose = require('mongoose');
var MedicionLuz  = mongoose.model('MedicionLuz');

var express = require('express');
var router = express.Router();

router.get('/', function (req, res) {
    MedicionLuz.find()
	.sort({time: -1})
	.limit(100)
	.then(mediciones => {
			res.status(200).json(mediciones);
	})
	.catch(error => {
		console.err(error);
		res.status(500).send('Error en la base de datos');
	});
});

router.get('/ultimo', function (req, res) {
	MedicionLuz.find()
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

router.post('/', function (req, res) {
	const medicion = new MedicionLuz(
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

module.exports = router;