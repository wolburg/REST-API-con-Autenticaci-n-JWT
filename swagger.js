const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API de E-comerce',
            version: '1.0.0',
            description: 'Api de e-comerce de futbolistas con autenticacion',
        },
    },
    apis: ['./users.js', './products.js', './orders.js'],
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = { swaggerSpec, swaggerUi };