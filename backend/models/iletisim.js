const mongoose = require('mongoose');

const İletisimSchema = mongoose.Schema({
    ad : {
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
        trim: true
    },

    number: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    date: {
        type: Date,
        default: new Date()
    },

});


module.exports = mongoose.model('iletisim', İletisimSchema)