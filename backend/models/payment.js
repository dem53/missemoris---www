const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: false,
    },
    sessionId: {
        type: String,
        required: false,
    },
    orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'order',
        required: false,
    },
    conversationId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true
    },
    paidPrice: {
        type: Number,
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['SUCCESS', 'FAILED', 'PENDING'],
        required: true
    },
    paymentDate: {
        type: Date,
        default: Date.now
    },
    iyzicoPaymentId: {
        type: String,
        required: true
    },
    basketItems: [{
        id: String,
        name: String,
        category1: String,
        category2: String,
        itemType: String,
        price: Number,
        currency: String,
        quantity: Number
    }]
}, {
    timestamps: true
});


module.exports = mongoose.model('Payment', paymentSchema);
