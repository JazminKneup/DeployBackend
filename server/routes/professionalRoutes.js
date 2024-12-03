const express = require('express');
const professionalRoutes = express.Router();
const ProfessionalController = require('../controllers/professionalController');
const validateToken = require('../middleware/validateToken'); // Middleware para proteger las rutas
const upload = require('../uploadSetting/uploadSetting');

// Rutas para los pasos de creación del perfil profesional

// Paso 1: Registrar información profesional (profesión, número de licencia y descripción)
professionalRoutes.post('/add-professional-info',validateToken, ProfessionalController.addProfessionalInfo);

// Paso 2: Subir foto de perfil, agregar teléfono y WhatsApp
professionalRoutes.post('/add-contact-info', validateToken, upload.single('profilePicture'), ProfessionalController.addContactInfo);

// Paso 3: Agregar ubicación (país, estado, ciudad, código postal)
professionalRoutes.post('/add-location-info', validateToken, ProfessionalController.addLocationInfo);

// Paso 4: Agregar método de pago
// professionalRoutes.post('/add-payment-method', ProfessionalController.addPaymentMethod);

// Ver perfil completo
professionalRoutes.get('/view-profile', validateToken, ProfessionalController.viewProfile);

// Editar perfil completo
professionalRoutes.put('/edit-profile',validateToken, upload.single('profilePicture'), ProfessionalController.editProfile);

module.exports = professionalRoutes;
