require('./config');
const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
const mongoose = require ('mongoose')
mongoose.set('useFindAndModify', false);
// require('./helpers/helpers')
const session = require('express-session')
var MemoryStore = require('memorystore')(session)

const directorio_public = path.join(__dirname, '../public' )
const directorio_views = path.join(__dirname, '../template/views' )
const directorio_partials = path.join(__dirname, '../template/partials' )

app.use(session({
	cookie: { maxAge: 86400000 },
 	store: new MemoryStore({
      	checkPeriod: 86400000 
    	}),
  	secret: 'keyboard cat',
  	resave: true,
  	saveUninitialized: true
}))

app.use((req, res, next) =>{
	if(req.session.usuario){		
		res.locals.sesion = true
		res.locals.nombre = req.session.nombre
	}	
	next()
})

//BodyParser
app.use(bodyParser.urlencoded({extended : false}))

//hbs y Views
app.set('view engine', 'hbs')
app.use(express.static(directorio_public))
app.set('views', directorio_views)
hbs.registerPartials(directorio_partials)

app.use(require('./routes/index.js'))

/*
mongoose.connect(urlDB ='mongodb://localhost:27017/clientes', {useNewUrlParser: true, useUnifiedTopology: true}, (err, resultado)=>{
	if (err) {
		console.log("error al conectar")
	}
	console.log("conectado a la BD")
});
*/

mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useUnifiedTopology: true}, (err, resultado) => {
	if (err){
		return (err)
	}
	console.log("conectado a la base de datos")
});

app.listen(process.env.PORT, () => {
	console.log ('Servidor en el puerto' + process.env.PORT)
})