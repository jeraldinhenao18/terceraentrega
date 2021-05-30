const hbs = require('hbs')
const funciones = require('./../funciones') 
hbs.registerHelper('listarCursos', ()=>{
   try {
       return funciones.listarTodosLosCursos();
   } catch(err) {
        return "No hay cursos";
   }
}) 

hbs.registerHelper('listarMisCursos', (cedula)=>{
    if(cedula){
        try {
            return funciones.listarSoloMisCursos(cedula);
        } catch(err) {
            return "No tienes cursos aun";
        }
    }
})

hbs.registerHelper('actulizarCursos', (idCurUpd, accion)=>{
    if(idCurUpd){
    
        if(accion=="cambiarEstado"){
            try {
                return funciones.actualizarEstado(idCurUpd);
            } catch(err) {
                return "No se pudo actualizar el curso";
            }
        }else if(accion=="eliminar"){
            try {
                return funciones.eliminarCurso(idCurUpd);
            } catch(err) {
                return "No se pudo eliminar el curso";
            }
        }
    }
})

hbs.registerHelper('listarEstudiantes', (idCurVer)=>{
    if(idCurVer){
        try {
            return funciones.listarEstudiantesC(idCurVer);
        } catch(err) {
            return "No se pudo listar los estudiantes";
        }
    }
})

hbs.registerHelper('deleteEst', (idEstDel, idCurDelete)=>{
    console.log(idCurDelete)
    if(idEstDel){
        try {
            return funciones.eliminarEst(idEstDel, idCurDelete);
        } catch(err) {
            return "No se pudo eliminar estudiantes";
        }
    }
})

hbs.registerHelper('listarC', ()=>{
    try {
        return funciones.listarC();
    } catch(err) {
        return "No hay curso";
    }
 })
 
