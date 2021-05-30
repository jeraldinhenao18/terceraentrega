const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const cursosSchema = new Schema ({
	nombre : {
		type : String,
		required : true
	},
	id : {
		type : Number,
		required : true,
		trim : true
	},
	descripcion : {
		type : String,
		required : true
	},
	valor : {
		type : Number,
		trim: true
	},
    modalidad : {
		type : String,
		trim: true
	},
    duracion : {
		type : String,
		trim: true
	},
	estado : {
		type : String,
		trim: true,
		default:"habilitado"
	}	
});

const Curso = mongoose.model('Curso', cursosSchema);
module.exports = Curso
