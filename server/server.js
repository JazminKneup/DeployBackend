const express = require('express');
const app = express();
const cors = require('cors');
const path = require('path');

const userRoutes = require('./routes/userRoutes')
const professionalRoutes = require('./routes/professionalRoutes')
const clientRoutes = require ('./routes/clientRoutes');


require('./setting/database') 

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use('/user', userRoutes);
// Rutas para el perfil del profesional
app.use('/professional', professionalRoutes);

// Rutas para el cliente (búsqueda de profesionales)
app.use('/client', clientRoutes);

app.listen(8080, () => {
  console.log('The server is already running on port 8080.');
}); 