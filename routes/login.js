const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const SEED = require('../config/config').SEED;
const Usuario = require('../models/usuario');
const app = express();

app.post('/', (req, res) => {

    let body = req.body;

    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'DB_Error al buscar usuario',
                errors: err
            });
        }

        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'DB_Error credenciales incorrectas',
                errors: err
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje: 'DB_Error credenciales incorrectas',
                errors: err
            });
        }

        // Crear un token
        usuarioDB.password = ':)';
        let token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4hrs

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            id: usuarioDB._id,
            token
        });
    });


});
module.exports = app;