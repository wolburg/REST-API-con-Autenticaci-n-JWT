const User = require('./user');
const jwt = require('jwt-simple'); 
const bcrypt = require('bcryptjs'); 
const secret = 'your-secret-key';  

const createUser = async (req, res) => {
    //Datos del usuario
    const { name, email, password, role } = req.body;
    //Escondemos la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    //Crer usuar
    const newUser = new User({name, email, password: hashedPassword, role});
    //Guardar y avisar que se guardo
    await newUser.save();
    res.status(201).json(newUser)
};

//El login del usuario

const loginUser = async (req, res) => {
    //Jalamos los datos de la soli
    const { email, password } = req.body;  
    //Buscamos el correo
    const user = await User.findOne({ email }); 
    //Verificamos que exists
    if (!user) return res.status(404).send('Usuario no encontrado');  
    //Hay que ver que conicdan las paswords
    const match = await bcrypt.compare(password, user.password);  
    //Si no coincide es error
    if (!match) return res.status(400).send('Contraseña incorrecta');  

    const payload = { 
        userId: user._id.toString(), 
        role: user.role 
    };

    //Hacemos token
    const token = jwt.encode(payload, secret);  
    res.json({ token }); 
  };

  //Export las funciones
  module.exports = {createUser, loginUser};