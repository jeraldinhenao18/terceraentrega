const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const estudiantesSchema = new Schema ({
	nombre : {
		type : String,
		required : true
	},
	cedula : {
		type : Number,
		required : true,
		trim : true
	},
	contrasena : {
		type : String,
		required : true
	},
	pais : {
		type : String,
		trim: true
	},
	cursos : [{
		type : Schema.Types.ObjectId,
		ref: 'Curso' 
	}]
});

const Estudiante = mongoose.model('Estudiante', estudiantesSchema);
module.exports = Estudiante
