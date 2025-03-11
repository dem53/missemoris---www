const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'post',
        required: true
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

favoriteSchema.index({user: 1, product: 1}, {unique: true});

module.exports = mongoose.model('favorite', favoriteSchema);