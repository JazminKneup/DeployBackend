const UserRegistration = require('../models/userModel');
const ProfessionalProfile = require('../models/professionalModel');
const jwt = require('jsonwebtoken');
const clave = "this_is_secret"; // Clave secreta para firmar el token
const mongoose = require("mongoose");
// Controlador para manejar los pasos de creación del perfil profesional

// Paso 1: Registrar profesión, número de licencia y descripción
module.exports.addProfessionalInfo = async (req, res) => {
    const { profession, licenseNumber, description } = req.body;
    const userId = req.infoUser._id;

    try {
        // Verificar si ya existe un perfil profesional
        const existingProfile = await ProfessionalProfile.findOne({ user: userId });
        if (existingProfile) {
            return res.status(400).json({ message: "Profile already exists." });
        }

        // Crear un nuevo perfil
        const professionalProfile = new ProfessionalProfile({
            user: userId,
            profession,
            licenseNumber,
            description,
        });

        await professionalProfile.save();
        res.status(201).json({ message: "Profile created successfully", profileId: professionalProfile._id });
    } catch (error) {
        res.status(500).json({ message: "Error creating profile", error });
    }
};


// Paso 2: Subir foto de perfil y agregar números de contacto
module.exports.addContactInfo = async (req, res) => {
    console.log('Request body:', req.body);
    console.log('File info:', req.file);

    const { profileId, phoneNumber, whatsappNumber } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    try {
        // Buscar el perfil profesional
        const professionalProfile = await ProfessionalProfile.findById(profileId);
        if (!professionalProfile) {
            return res.status(404).json({ message: 'Professional profile not found.' });
        }

        // Actualizar los datos de contacto y la imagen de perfil
        professionalProfile.phoneNumber = phoneNumber;
        professionalProfile.whatsappNumber = whatsappNumber;
        professionalProfile.profilePicture = imageUrl;

        await professionalProfile.save();
        res.status(200).json({ message: 'Contact info added successfully.' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding contact info.', error });
    }
};

  


// Paso 3: Agregar ubicación (país, estado, ciudad, código postal)
module.exports.addLocationInfo = async (req, res) => {
    const { profileId, country, state, city, zipCode } = req.body;

    try {
        const professionalProfile = await ProfessionalProfile.findById(profileId);
        if (!professionalProfile) {
            return res.status(404).json({ message: 'Professional profile not found.' });
        }

        // Agregar ubicación al perfil
        professionalProfile.location = { country, state, city, zipCode };
        await professionalProfile.save();

        res.status(200).json({ message: 'Location info added. Proceed to next step.' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding location info.', error });
    }
};


// Paso 4: Agregar método de pago
// module.exports.addPaymentMethod = async (req, res) => {
//     const { profileId, paymentMethod } = req.body;

//     try {
//         const professionalProfile = await ProfessionalProfile.findById(profileId);
//         if (!professionalProfile) {
//             return res.status(404).json({ message: 'Professional profile not found.' });
//         }

//         // Agregar método de pago al perfil
//         professionalProfile.paymentMethod = paymentMethod;
//         await professionalProfile.save();

//         res.status(200).json({ message: 'Payment method added. Profile completed.' });
//     } catch (error) {
//         res.status(500).json({ message: 'Error adding payment method.', error });
//     }
// };

// Controlador para ver el perfil profesional completo
module.exports.viewProfile = async (req, res) => {
    try {
      const userId = req.infoUser._id; // ID del usuario autenticado extraído del token
  
      // Buscar el perfil asociado al usuario autenticado y popular los datos del usuario
      const professionalProfile = await ProfessionalProfile.findOne({ user: userId })
        .populate("user", "firstName lastName email"); // Asegúrate de incluir "email" aquí
  
      if (!professionalProfile) {
        return res.status(404).json({ message: "Professional profile not found." });
      }
  
      res.status(200).json(professionalProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error retrieving profile.", error });
    }
  };
  



// Controlador para editar el perfil profesional
module.exports.editProfile = async (req, res) => {
    const userId = req.infoUser._id; // Extraer el userId desde el token
    const updates = req.body; // Datos enviados en la solicitud
    const profilePicture = req.file ? `/uploads/${req.file.filename}` : null; // Manejar imagen cargada

    try {
        // Buscar el perfil profesional asociado al usuario
        const professionalProfile = await ProfessionalProfile.findOne({ user: userId });
        if (!professionalProfile) {
            return res.status(404).json({ message: 'Professional profile not found.' });
        }

        // Verificar y actualizar los campos básicos
        if (updates.profession) professionalProfile.profession = updates.profession;
        if (updates.licenseNumber) professionalProfile.licenseNumber = updates.licenseNumber;
        if (updates.description) professionalProfile.description = updates.description;
        if (updates.phoneNumber) professionalProfile.phoneNumber = updates.phoneNumber;
        if (updates.whatsappNumber) professionalProfile.whatsappNumber = updates.whatsappNumber;

        // Actualizar la ubicación (subdocumento)
        if (updates.location) {
            try {
                const location = JSON.parse(updates.location); // Parsear la ubicación si llega como string JSON
                professionalProfile.location = location;
            } catch (err) {
                return res.status(400).json({ message: 'Invalid location format.' });
            }
        }

        // Actualizar la imagen de perfil si existe
        if (profilePicture) {
            professionalProfile.profilePicture = profilePicture;
        }

        // Guardar cambios
        const updatedProfile = await professionalProfile.save();

        res.status(200).json({ message: 'Profile updated successfully.', updatedProfile });
    } catch (error) {
        console.error("Error updating profile:", error);
        res.status(500).json({ message: 'Error updating profile.', error });
    }
};
