const mongoose = require('mongoose');

//Datos que le vamos a pedir al usu
const userSchema = new mongoose.Schema({
    name: {type: String, require:true},
    email: {type: String, require:true, unique: true},
    password: {type: String, require:true},
    role: {type: String,enum:['admin', 'cliente'] ,require:true},
});

//Guardar y exportar el usuario
const User = mongoose.model('User', userSchema)
module.exports = User; 