const mongoose = require('mongoose');

const AboneSchema = new mongoose.Schema({

    name: {
        type: String,
        trim: true,
        required: true
    },

    lastname: {
        type: String,
        trim: true,
        required: true
    },

    phone: {
        type: String,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    createdDate: {
        type: Date,
        default: new Date()
    }
});


module.exports = mongoose.model('abone', AboneSchema);