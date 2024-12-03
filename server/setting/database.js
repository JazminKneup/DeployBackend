const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://jazminkneup:<CodeSprinters>@cluster0.uw7ysyf.mongodb.net/professionalFinder_db') 
    .then(() => {
        console.log("Successful connection to the database 'professionalsFinder_db'"); 
    })
    .catch((error) => {
        console.log(`There was an error connecting to the database: ${error}`);
    });