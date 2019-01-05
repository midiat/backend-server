// Requires
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Inicializar variables
const app = express();

// Body-parser
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Importacion de utas
const appRoutes = require('./routes/app');
const usuarioRoutes = require('./routes/usuario');
const loginRoutes = require('./routes/login');

// Conexion a DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {
    if (err) throw err;

    console.log('DataBase: \x1b[32m %s \x1b[0m', 'online');

});

// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/login', loginRoutes);
app.use('/', appRoutes);


//Escuchar peticiones
app.listen(8080, () => {
    console.log('Server 3000: \x1b[32m %s \x1b[0m', 'online');

});