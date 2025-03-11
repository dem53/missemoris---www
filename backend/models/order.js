const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: false }, 
    sessionId: { type: String, required: false }, 
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: 'post', required: true }, 
            quantity: { type: Number, default: 1 }, 
            price: { type: Number, required: true }
        }
    ],
    totalAmount: { type: Number, required: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    shippingAddress: { type: String, required: true }, 
    email: { type: String, required: false },
    phone: { type: String, required: false, maxlength: 11 }, 
    country: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    tcIdentityNumber: { type: String, required: false, minlength: 11, maxlength: 11 },
    paymentMethod: { type: String, enum: ['credit_card', 'bank_transfer'], required: true },
    status: {
        type: String,
        enum: ['pending', 'success', 'iade', 'red', 'kargo'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now }
});

// Middleware to set updatedAt before saving
orderSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

orderSchema.pre('save', function(next) {
    if (this.userId) {
        this.email = this.email || '';
    } else {
        this.sessionId = this.sessionId || '';
    }
    next();
});

module.exports = mongoose.model('order', orderSchema);