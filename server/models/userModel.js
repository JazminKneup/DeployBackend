// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide the first name.'],
        minLength: [3, 'First name must be at least 3 characters long.']
    },
    lastName: {
        type: String,
        required: [true, 'Please provide the last name.'],
        minLength: [3, 'Last name must be at least 3 characters long.']
    },
    email: {
        type: String,
        required: [true, 'Please provide the email address.'],
        unique: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address.']
    },
    password: {
        type: String,
        required: [true, 'Please provide the password.']
    },
    role: {
        type: String,
        enum: ['professional', 'client'],
        required: true
    },
    profile: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: 'role', // Relaciona con el modelo basado en el rol
    },
    state: {
        type: String,
        required: function () {
            return this.role === 'client';
        },
    },
    city: {
        type: String,
        required: function () {
            return this.role === 'client';
        },
    }
},
{ timestamps: true });


const UserRegistration = mongoose.model('UserRegistration', userSchema);

module.exports = UserRegistration;
