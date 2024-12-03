const mongoose = require('mongoose');

const professions = [
    'Engineer', 'Designer', 'Developer', 'Consultant',
    'Doctor', 'Teacher', 'Nurse', 'Accountant', 'Other'
];

const clientFilterSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserRegistration', // Relación con el usuario cliente
        required: true,
    },
    preferredProfession: { 
        type: String, 
        enum: professions, // Opciones limitadas
        default: '',
    },
    location: {
        country: { type: String, default: '' },
        state: { type: String, default: '' },
        city: { type: String, default: '' },
        zipCode: { type: String, default: '' },
    },
    budgetRange: {
        min: { type: Number, min: 0, default: 0 },
        max: { type: Number, min: 0, default: 0 },
    },
}, { timestamps: true });

const ClientFilter = mongoose.model('ClientFilter', clientFilterSchema);

module.exports = ClientFilter;
