const express = require('express');
const Hospital = require('../models/hospital');
const mdAuth = require('../middlewares/autenticacion');

const app = express();

// ===================================
// Obtener todos los hospitales
// ===================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .populate('usuario', 'nombre email')
        .exec(
            (err, hospitales) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'DB_Error cargando hospitales',
                        errors: err
                    });
                }

                Hospital.countDocuments({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        hospitales,
                        total: conteo
                    });
                });

            });
});

// ===================================
// Crear nuevo hospital
// ===================================
app.post('/', mdAuth.verifikaToken, (req, res) => {
    let body = req.body;
    let hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'DB_Error al crear hospital',
                errors: err
            });
        }
        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    });

});

// ===================================
// Actualizar nuevo hospital
// ===================================
app.put('/:id', mdAuth.verifikaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Hospital.findById(id, (err, hospital) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'DB_Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'DB_Error el hospital no existe',
                errors: { message: 'El hospital no existe' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'DB_Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });
    });
});

// ===================================
// Borrar hospital
// ===================================
app.delete('/:id', mdAuth.verifikaToken, (req, res) => {
    let id = req.params.id;

    Hospital.findOneAndDelete(id, (err, hospitalBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'DB_Error al borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'DB_Error el hospital no existe',
                errors: { message: 'El hospital no existe' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

});


module.exports = app;