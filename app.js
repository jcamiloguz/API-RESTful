const express = require('express');
const app = express();
const port = 3000;
app.use(express.json());

// Variables empleadas para el funcionamiento de la API
var nextSensorId = 0;
var nextMeasurementId = 0;
var sensors = new Array();

// Valores de referencia para el ejemplo de objeto sensor con sus medidas
var temperatureMax = 19;
var temperatureMin = 36;



// Ejemplo de objeto sensor
var sensorExample = {
	"id": nextSensorId,
	"nombre": "Sensor de Temperatura - UAO - InfoLab",
	"mediciones": [{
        	"id": nextMeasurementId++,
        	"momento": new Date(),
        	"valor": (Math.random() * (temperatureMax - temperatureMin) + temperatureMin).toFixed(1),
        	"unidad": "ºC"
    	},
    	{
        	"id": nextMeasurementId++,
        	"momento": new Date(),
        	"valor": (Math.random() * (temperatureMax - temperatureMin) + temperatureMin).toFixed(1),
        	"unidad": "ºC"
    	}
	]
};



// Agrega el objeto sensor al arreglo de sensores en la posición 0, que coincide con su id
sensors[nextSensorId++] = sensorExample;

// GET leer todos los sensores
app.get('/sensores', (req, res) => {
	res.status(200).send(sensors);
});

// POST almacena un nuevo sensor
app.post('/sensores', (req, res) => {
	let sensor = req.body;
	sensor.id = nextSensorId;
	sensors[nextSensorId++] = sensor;
	res.status(201).send(sensor);
});

//GET Retorna el sensor especificado
app.get('/sensores/:sensorId', (req, res) => {
	let sensorId = req.params.sensorId;
	let sensor = sensors[sensorId];

	if (sensor !== undefined) {
    	res.status(200).send(sensor);
	} else {
    	res.status(404).send(`El sensor con id: ${sensorId} no existe`);
	}
});

//PUT Actualiza sensor especificado
app.put(`/sensores/:sensorId`,(req,res)=>{
	let sensorid= req.params.sensorId;
	let sensor=sensors[sensorid];
	if (sensor !== undefined) {	
		let data=req.body;
		data.id=sensorid;
		name=data.nombre;
		sensor.id=data.id;
		sensor.nombre=name;
		res.status(200).send(sensor);
    }else {
    	res.status(404).send(`El sensor con id: ${sensorid} no existe`);
	}
});
//DELETE Elimina el sensor especificado
app.delete('/sensores/:sensorid',(req,res)=>{
    let sensorid =  req.params.sensorid;
	sensor=sensors[sensorid]
    if (sensor !== undefined) {
		sensors.splice(sensorid,1);

		res.status(201).send('Sensor Eliminado');
    }else {
    	res.status(404).send(`El sensor con id: ${sensorid} no existe`);
	}
	
});
//GET Lee todas las mediciones de un sensor en especifico
app.get('/sensores/:sensorId/mediciones', (req, res) => {
	let sensorid =  req.params.sensorId;
	let sensor=sensors[sensorid];
	let mediciones=sensor.mediciones;
    if (sensor !== undefined) {	
		
		res.status(201).send(mediciones);
    }else {
    	res.status(404).send(`El sensor con id: ${sensorid} no existe`);
	}
});
//POST Almacena una nueva medición
app.post('/sensores/:sensorId/mediciones', (req, res) => {
	let sensorId = req.params.sensorId;
	let sensor = sensors[sensorId];

	if (sensor !== undefined) {
    	let measurement = req.body;
    	measurement.id = nextMeasurementId++;
    	if (sensor.mediciones === undefined) {
        	sensor.mediciones = new Array();
    	}
    	sensor.mediciones.push(measurement);
    	res.status(201).send(measurement);
	} else {
    	res.status(404).send(`El sensor con id: ${sensorId} no existe`);
	}
});


//GET Lee una medicion especifica de un sensor especifico
app.get('/sensores/:sensorId/mediciones/:medicionid', (req, res) => {
	let sensorid =  req.params.sensorId;
	let medicionid =  req.params.medicionid;
	let sensor=sensors[sensorid];
    if (sensor !== undefined) {
		if (sensor.mediciones !==undefined){
			let medicion=sensor.mediciones[medicionid];
			res.status(202).send(medicion);
		}else{
			res.status(404).send(`La medicion con id: ${medicionid} no existe`);
		}
		
    }else {
    	res.status(404).send(`El sensor con id: ${sensorid} no existe`);
	}
	
});

//PUT Actualiza una medicion especifica de un sensor especifico
app.put(`/sensores/:sensorId/mediciones/:medicionId`,(req,res)=>{
	let sensorid= req.params.sensorId;
	let sensor=sensors[sensorid];
	let medicionid= req.params.medicionId;
	let medicion =sensor.mediciones[medicionid];
	if (sensor !== undefined) {	
		if (medicion !== undefined){
			let data=req.body;
			medicion=data;
			sensor.mediciones[medicionid]=medicion;
			res.status(201).send(medicion);
    	}else{
		res.status(404).send(`la medicion ${medicionid} del sensor con id:${sensorid} no existe`);
	}
	}else {
    	res.status(404).send(`El sensor con id: ${sensorid} no existe`);
	}
});
//DELETE Elimina una medicion
app.delete('/sensores/:sensorid/:medicionid',(req,res)=>{
	let sensorid =  req.params.sensorid;
	let medicionid =  req.params.medicionid;
	sensor=sensors[sensorid];
	medicion=sensor.mediciones[medicionid];
	sensor.mediciones
    if (sensor !== undefined) {
		if (medicion !==undefined){
			sensor.mediciones.splice(medicionid,1);
			res.status(201).send('Medicion Eliminada');
		}else{
			res.status(404).send(`La medicion con id: ${medicionid} no existe`);
		}
		
    }else {
    	res.status(404).send(`El sensor con id: ${sensorid} no existe`);
	}
	
});


// Inicializa el servidor para que escuche en el puerto determinado
app.listen(port, () => {
	console.log(`Servidor escuchando en el puerto: ${port}`);
});