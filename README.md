# Milesight IoT Sensor App

Esta aplicación de IoT recibe los datos por medio del protocolo MQTT usando un broker integrado. Permite ver las mediciones de luz y controlarla desde una web app.

Los equipos utilizados son:
1. Sensor de Luz Milesight IoT
2. Remote IO de Milesight IoT

Para completar las dependencias:
```bash
$ npm install
```

Para ejecutar la aplicación:
```bash
$ node server.js
```

Cualquier cambio en el frontend de React, se debe ejecutar nuevamente:
```bash
$ npm run build
```