const mongoose = require('mongoose');

const AuthSchema = new mongoose.Schema({
    
    ad: {
        type: String,
        required: true,
        trim: true
    },

    soyad: {
        type: String,
        required: true,
        trim: true
    },
    
    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    
    number: {
        type: String,
        required: true,
        unique: true
    },

    isAdmin: {
        type: Boolean,
        default: false
    },
    
    date: {
        type: Date,
        default: new Date()
    },
    

});

module.exports = mongoose.model('user', AuthSchema);
