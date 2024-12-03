const jwt = require('jsonwebtoken');
const clave = "this_is_secret";

const validateToken = (req, res, next) => {
    // Obtener el token del encabezado
    const token_user = req.headers.token_user;

    if (!token_user) {
        return res.status(401).json({ message: "Token is required." });
    }

    jwt.verify(token_user, clave, (error, decoded) => {
        if (error) {
            return res.status(401).json({ message: "Invalid token." });
        }

        // Almacenar la información del usuario en la solicitud
        req.infoUser = {
            _id: decoded._id,
            name: decoded.name,
            lastName: decoded.lastName,
            email: decoded.email
        };

        next();
    });
};

module.exports = validateToken;
