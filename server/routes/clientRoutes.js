const express = require('express');
const clientRoutes = express.Router();
const clientController = require('../controllers/clientController');
const validateToken = require('../middleware/validateToken'); // Middleware para proteger las rutas

// Ruta para buscar profesionales
clientRoutes.get('/search-professionals',validateToken, clientController.searchProfessionals);
clientRoutes.get('/professional/details/:id', validateToken, clientController.getProfessionalForClient)

module.exports = clientRoutes;
