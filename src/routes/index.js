const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
// require('./../helpers/helpers')
// const funciones = require('./../funciones')  
const dirViews = path.join(__dirname, "../../template/views")
const dirPartials = path.join(__dirname, '../../template/partials')
const Estudiante = require('./../models/estudiantes')
const Curso = require('./../models/cursos')

//hbs
app.set('view engine', 'hbs');
app.set('views', dirViews);
hbs.registerPartials(dirPartials)

//Pagina inicio
app.get('/', (req, res) => {
    Curso.find({}, (err, resultado) => {
        if (err) return (err)
        cursosDisponibles = [];
        resultado.forEach(curso => {
            if (curso.estado == "habilitado") {
                cursosDisponibles.push(curso)
            }
        });
        res.render('index', {
            titulo: 'Campus virtual',
            cursos: resultado,
            cursosD: cursosDisponibles,
            usuario:req.session.usuario
        })
    })
})
app.post('/ingresar', (req, res) => {
    Estudiante.findOne({ nombre: req.body.usuario }, (err, resultado) => {
        var texto = "";
        var pagina = "index";
        if (resultado) {
            if (resultado.contrasena == req.body.contrasena) {
                req.session.usuario = resultado
                res.redirect('/sesion')
            } else {
                texto = "CREDENCIALES ERRONEAS"
            }
        } else {
            texto = "CREDENCIALES ERRONEAS"
        }
        Curso.find({}, (err, resultado) => {
            if (err) return (err)

            res.render(pagina, {
                titulo: 'Campus virtual',
                cursos: resultado,
                respuesta: texto
            })
        })
    })
})

//pagina del usuario
app.get('/sesion', (req, res) => {
    Estudiante.findById(req.session.usuario._id).populate('cursos').exec(function (err, estudiante) {
        if (err) return (err)
        cursos = estudiante.cursos;
        res.render('sesion', {
            titulo: 'Iniciar sesion',
            respuesta: `Bienvenid@ ${req.session.usuario.nombre}`,
            cedula: req.session.usuario.cedula,
            misCursos: cursos
        })
    })
})

//crear curso
app.post('/crear', (req, res) => {
    if (req.body.idCurso) {

        let curso = new Curso({
            nombre: req.body.nombreCurso,
            id: req.body.idCurso,
            descripcion: req.body.descripcion,
            valor: req.body.valor,
            modalidad: req.body.modalidadCurso,
            duracion: req.body.duracion
        })

        curso.save((err, result) => {
            if (err) return (err)

            res.render('crear', {
                titulo: 'Crear Curso',
                respuesta: `<div class="alert alert-success alert-dismissible fade show" role="alert"> Nuevo curso creado
                          <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`,
                cursos: result
            })

        })
    }

})
app.get('/crear', (req, res) => {
    Curso.find({}, (err, resultado) => {
        if (err) return (err)
        res.render('crear', {
            titulo: 'Crear Curso',
            cursos: resultado,
            respuesta: " "
        })
    });
})

//registrar un estudiante
app.post('/matricular', (req, res) => {
    if (req.body.nombreEst) {
        Estudiante.findOne({ cedula: req.body.cedulaEst }, (err, resultado) => {
            if (resultado) {
                otrosCursos = resultado.cursos
                // console.log(otrosCursos);
                let repetido = otrosCursos.forEach(curso => curso._id == req.body.idCurso)
                if (repetido) {
                    Curso.find({}, (err, resultado) => {
                        if (err) return (err)
                        cursosDisponibles = [];
                        resultado.forEach(curso => {
                            if (curso.estado == "habilitado") {
                                cursosDisponibles.push(curso)
                            }
                        });
                        res.render('index', {
                            titulo: 'Campus virtual',
                            cursos: resultado,
                            cursosD: cursosDisponibles,
                            titulo: 'Campus Virtual',
                            respuesta: `<div class="alert alert-danger alert-dismissible fade show" role="alert">Ya te encuentras matriculado a este curso
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
                        })
                    })
                } else {
                    Estudiante.findOneAndUpdate({ cedula: req.body.cedulaEst }, { "$push": { cursos: req.body.idCurso } }, { new: true }, (err, result) => {
                        if (err) return (err)
                        Curso.find({}, (err, resultado) => {
                            if (err) return (err)
                            cursosDisponibles = [];
                            resultado.forEach(curso => {
                                if (curso.estado == "habilitado") {
                                    cursosDisponibles.push(curso)
                                }
                            });
                            res.render('index', {
                                titulo: 'Campus virtual',
                                cursos: resultado,
                                cursosD: cursosDisponibles,
                                titulo: 'Campus Virtual',
                                respuesta: `<div class="alert alert-success alert-dismissible fade show" role="alert"> Un curso más agregado
                                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
                            })
                        })
                    })
                }
            } else {
                let estudiante = new Estudiante({
                    nombre: req.body.nombreEst,
                    cedula: req.body.cedulaEst,
                    contrasena: req.body.password,
                    pais: req.body.paisEst,
                    cursos: [req.body.idCurso]
                })

                estudiante.save((err, resul) => {
                    if (err) return (err)
                    Curso.find({}, (err, resultado) => {
                        if (err) return (err)
                        cursosDisponibles = [];
                        resultado.forEach(curso => {
                            if (curso.estado == "habilitado") {
                                cursosDisponibles.push(curso)
                            }
                        });
                        res.render('index', {
                            titulo: 'Campus virtual',
                            cursos: resultado,
                            cursosD: cursosDisponibles,
                            titulo: 'Campus Virtual',
                            respuesta: `<div class="alert alert-success alert-dismissible fade show" role="alert"> Matriculado
                            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
                        })
                    })
                })
            }
        })

    }
})
app.get('/registrar', (req, res) => {
    res.render('registrar', {
        titulo: 'Crear registrado'
    });
});

//modificar estado o eliminar un curso
app.post('/update', (req, res) => {
    cursoUp = req.body.idUpdate;
    opcion = req.body.opcionesDeCursos;
    if (opcion == "cambiarEstado") {
        var mostrar = ""
        Curso.findOne({ _id: cursoUp }, (err, curso) => {
            if (err) return (err);
            if (curso.estado == "habilitado") {
                Curso.findOneAndUpdate({ _id: curso._id }, { estado: "deshabilitado" }, { new: true }, (err, resultado) => {
                    if (err) return (err)
                    mostrar = `<div class="alert alert-success alert-dismissible fade show" role="alert"> CURSO DESHABILITADO
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
                    Curso.find({}, (err, resultado) => {
                        if (err) return (err)
                        res.render('crear', {
                            titulo: 'Crear Curso',
                            cursos: resultado,
                            respuesta: mostrar
                        })
                    });
                });
            } else if (curso.estado == "deshabilitado") {
                Curso.findOneAndUpdate({ _id: curso._id }, { estado: "habilitado" }, { new: true }, (err, resultado) => {
                    if (err) return (err)
                    mostrar = `<div class="alert alert-success alert-dismissible fade show" role="alert"> CURSO HABILITADO
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
                    Curso.find({}, (err, resultado) => {
                        if (err) return (err)
                        res.render('crear', {
                            titulo: 'Crear Curso',
                            cursos: resultado,
                            respuesta: mostrar
                        })
                    });
                });
            }
        })

    }
    else if (opcion == "eliminar") {
        Curso.findOneAndDelete({ _id: cursoUp }, (err, result) => {
            mostrar = `<div class="alert alert-success alert-dismissible fade show" role="alert"> CURSO ELIMINADO
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`
        });
        Curso.find({}, (err, resultado) => {
            if (err) return (err)
            res.render('crear', {
                titulo: 'Crear Curso',
                cursos: resultado,
                respuesta: mostrar
            })
        });
    }
})

//ver estudiantes de un curso
app.post('/verEstudiantes', (req, res) => {
    Estudiante.find({ cursos: req.body.idCursoVer }).populate('cursos').exec(function (err, lista) {
        if (err) return (err)

        Curso.find({}, (err, resultado) => {
            if (err) return (err)
            res.render('crear', {
                titulo: 'Crear Curso',
                cursos: resultado,
                respuesta: "",
                estudiantes: lista,
                cursoDEst: req.body.idCursoVer
            });
        });
    })
})
//eliminar un estudiante
app.post('/eliminarEstudiante', (req, res) => {
    Estudiante.findOneAndUpdate({ _id: req.body.idEstDelete }, { "$pull": { cursos: req.body.idCurD } }, (err, resul) => {
        if (err) return (err)
        console.log(resul)
        Estudiante.find({ cursos: req.body.idEstDelete }).populate('cursos').exec(function (err, lista) {
            if (err) return (err)
            Curso.find({}, (err, resultado) => {
                if (err) return (err)
                res.render('crear', {
                    titulo: 'Crear Curso',
                    cursos: resultado,
                    respuesta: `<div class="alert alert-success alert-dismissible fade show" role="alert"> Estudiante eliminado
                    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>` ,
                    estudiantes: lista,
                    cursoDEst: req.body.idEstDelete
                });
            });
        })
    })
})

app.get('/actualizar', (req, res) => {
    res.render('actualiza', {
        titulo: 'Actualizar curso',
    })
})

app.post('/actualizar', (req, res) => {
    funciones.actualizar(
        req.body.cedula,
        req.body.nombre,
        req.body.pais,
        req.body.id,
        req.body.nombreCurso,
        req.body.costo
    )
    res.redirect('/ver')
})

app.post('/eliminar', (req, res) => {
    res.render('eliminar', {
        titulo: 'Eliminar curso',
        cedula: req.body.cedula,
        id: req.body.id
    })
})

app.get('/salir', (req, res) => {
    req.session.destroy((err) => {
        if (err) return (err)
    })
    res.redirect('/')
})

//error 404
app.get('*', function (req, res) {
    res.render('error', {
        titulo: 'Error 404'
    })
})

module.exports = app