const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017'; 

mongoose.set('strictQuery', true);

mongoose.connect(MONGO_URI,{
    autoIndex: true
}).then(()=> {
    console.log('connected to Mongo');
}).catch((error) =>{
    console.error('MongoDB connection to error:', error);
});
module.exports = mongoose;