const UserRegistration = require('../models/userModel');
const ProfessionalProfile = require('../models/professionalModel')
const jwt = require('jsonwebtoken');
const clave = "this_is_secret"; // Clave secreta para firmar el token

// Controlador para registrar un nuevo usuario
module.exports.createUser = async (req, res) => {
    const { email, role, state, city } = req.body;

    // Validar que el rol sea válido
    if (!role || !['client', 'professional'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role specified.' });
    }

    try {
        // Verificar si el usuario ya existe
        const existingUser = await UserRegistration.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        // Validaciones específicas para clientes
        if (role === 'client') {
            if (!state || !city) {
                return res.status(400).json({ message: 'State and city are required for clients.' });
            }
        }

        // Crear el usuario
        const newUser = await UserRegistration.create(req.body);

        // Generar el token
        const infoInToken = {
            _id: newUser._id,
            name: newUser.firstName,
            lastName: newUser.lastName,
            email: newUser.email,
            role: newUser.role,
        };

        jwt.sign(infoInToken, clave, { expiresIn: '45m' }, (error, token) => {
            if (error) {
                return res.status(400).json({ message: 'Error generating the token.' });
            }
            return res.status(200).json({ token });
        });
    } catch (error) {
        console.error("Error during user registration:", error);
        return res.status(500).json({ message: 'Server error.', error });
    }
};



// Controlador para iniciar sesión
module.exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Buscar al usuario por email y contraseña
        const userFound = await UserRegistration.findOne({ email, password });

        if (!userFound) {
            return res.status(404).json({ message: 'Incorrect credentials.' });
        }

        let hasProfile = false;

        // Si el usuario es profesional, verifica si tiene un perfil completo
        if (userFound.role === 'professional') {
            console.log("Checking profile for user:", userFound._id);
            const profile = await ProfessionalProfile.findOne({ user: userFound._id });
            console.log("Profile found:", profile);
            hasProfile = !!profile; // Será true si el perfil existe
        }

        const infoInToken = {
            _id: userFound._id,
            name: userFound.firstName,
            lastName: userFound.lastName,
            email: userFound.email,
            role: userFound.role, // Incluye el rol en el token
        };

        // Generar el token
        jwt.sign(infoInToken, clave, { expiresIn: '45m' }, (error, token) => {
            if (error) {
                return res.status(400).json({ message: 'Error generating the token.' });
            }

            // Devolver el token, el usuario y el estado de hasProfile
            return res.status(200).json({ token, user: userFound, hasProfile });
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ message: 'Internal server error', error });
    }
};