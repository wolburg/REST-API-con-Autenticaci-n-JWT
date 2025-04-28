const express = require("express")
const mongoose = require("mongoose")
const { swaggerSpec, swaggerUi } = require('./swagger');
const userRoutes = require("./users")
const productRoutes = require("./products")
const orderRoutes = require("./orders")
const { authenticate } = require('./auth');

const app = express();
app.use(express.json());

//Especificamos las rutas del api
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders',authenticate,orderRoutes)

//La doc de swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Conectar a mongo
mongoose.connect('mongodb://localhost/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('COnectar a la base de datos'))
.catch(err => console.log(err));

//Iniciar con puerto
app.listen(3000, () => console.log('Corriendo en el puertoo 3000'));
