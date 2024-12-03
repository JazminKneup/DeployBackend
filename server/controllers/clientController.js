const ClientFilter = require('../models/client');


const ProfessionalProfile = require('../models/professionalModel');

// Controlador para buscar profesionales según filtros proporcionados
module.exports.searchProfessionals = async (req, res) => {
    const { profession, country, state, city, zipcode } = req.query;

    try {
        // Construir el filtro dinámico basado en los parámetros de consulta
        const filter = {};
        if (profession) filter.profession = profession;
        if (country) filter['location.country'] = country;
        if (state) filter['location.state'] = state;
        if (city) filter['location.city'] = city;
        if (zipcode) filter['location.zipcode'] = zipcode;

        // Realizar la búsqueda en la base de datos y popular los datos del usuario
        const professionals = await ProfessionalProfile.find(filter)
            .populate("user", "firstName lastName email"); // Incluye solo los campos necesarios

        if (professionals.length === 0) {
            return res.status(404).json({ message: 'No professionals found for the selected filters.' });
        }

        res.status(200).json({ professionals });
    } catch (error) {
        console.error("Error during professional search:", error);
        res.status(500).json({ message: 'Server error.', error });
    }
};


module.exports.getProfessionalForClient = async (req, res) => {
    const { id } = req.params; // Este `id` es el `user._id`

    try {
        console.log("User ID received in request:", id);

        // Buscar el perfil profesional basado en el user._id
        const professional = await ProfessionalProfile.findOne({ user: id }).populate(
            'user',
            'firstName lastName email'
        );

        if (!professional) {
            return res.status(404).json({ message: 'Professional not found for this user ID.' });
        }

        console.log("Professional found:", professional);

        res.status(200).json(professional);
    } catch (error) {
        console.error('Error fetching professional details:', error);
        res.status(500).json({ message: 'Server error.', error });
    }
};


  
  
