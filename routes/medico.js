const express = require('express');
const Medico = require('../models/medico');
const mdAuth = require('../middlewares/autenticacion');

const app = express();

// ===================================
// Obtener todos los medicos
// ===================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec(
            (err, medicos) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'DB_Error cargando medicos',
                        errors: err
                    });
                }

                Medico.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        medicos,
                        total: conteo
                    });
                });
            });
});

// ===================================
// Crear nuevo medico
// ===================================
app.post('/', mdAuth.verifikaToken, (req, res) => {
    let body = req.body;
    let medico = new Medico({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'DB_Error al crear medico',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });

    });

});

// ===================================
// Actualizar nuevo medico
// ===================================
app.put('/:id', mdAuth.verifikaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Medico.findById(id, (err, medico) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'DB_Error al buscar medico',
                errors: err
            });
        }

        if (!medico) {
            return res.status(400).json({
                ok: false,
                mensaje: 'DB_Error el medico no existe',
                errors: { message: 'El medico no existe' }
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'DB_Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });
    });
});

// ===================================
// Borrar medico
// ===================================
app.delete('/:id', mdAuth.verifikaToken, (req, res) => {
    let id = req.params.id;

    Medico.findOneAndDelete(id, (err, medicoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'DB_Error al borrar medico',
                errors: err
            });
        }

        if (!medicoBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'DB_Error el medico no existe',
                errors: { message: 'El medico no existe' }
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});


module.exports = app;