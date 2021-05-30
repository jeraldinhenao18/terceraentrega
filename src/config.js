process.env.PORT = process.env.PORT || 3000;
process.env.NODE_ENV = process.env.NODE_ENV || 'local';


let urlDB
if (process.env.NODE_ENV === 'local'){
	urlDB = 'mongodb://localhost:27017/educacionContinua';
}
else {
	urlDB = 'mongodb+srv://tdea123:tdea123@tdeal3.4iuq7.mongodb.net/clientes?retryWrites=true&w=majority'
}

process.env.URLDB = urlDB