const mongoose = require('mongoose');
const UserRegistration = require('../models/userModel');


const addressSchema = new mongoose.Schema({
    country: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    zipCode: {
        type: String,
        required: true,
    },
});

const professionalProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserRegistration',
        required: true,
    },
    profession: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    location: {
        type: addressSchema,
       required: false,  // Esto indica que la dirección es obligatoria
    },
    profilePicture: {
        type: String,
    },
    phoneNumber: {
        type: String,
    },
    whatsappNumber: {
        type: String,
    },
    paymentMethod: {
        type: String,
    },
});

const ProfessionalProfile = mongoose.model('ProfessionalProfile', professionalProfileSchema);

module.exports = ProfessionalProfile;
