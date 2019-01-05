const express = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const mdAuth = require('../middlewares/autenticacion');

const app = express();

// ===================================
// Obtener todos los usuarios
// ===================================
app.get('/', (req, res, next) => {
    Usuario.find({}, 'nombre email img role').exec(
        (err, usuarios) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'DB_Error cargando usuarios',
                    errors: err
                });
            }
            res.status(200).json({
                ok: true,
                usuarios
            });
        });
});

// ===================================
// Crear nuevo usuarios
// ===================================
app.post('/', mdAuth.verifikaToken, (req, res) => {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'DB_Error al guardar usuarios',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    });

});

// ===================================
// Actualizar nuevo usuarios
// ===================================
app.put('/:id', mdAuth.verifikaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'DB_Error al buscar usuario',
                errors: err
            });
        }

        if (!usuario) {
            return res.status(400).json({
                ok: false,
                mensaje: 'DB_Error el usuario no existe',
                errors: { message: 'El usuario no existe' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'DB_Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });
    });
});

// ===================================
// Borrar usuario
// ===================================
app.delete('/:id', mdAuth.verifikaToken, (req, res) => {
    let id = req.params.id;

    Usuario.findOneAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'DB_Error al borrar usuarios',
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'DB_Error el usuario no existe',
                errors: { message: 'El usuario no existe' }
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});


module.exports = app;