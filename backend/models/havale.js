const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const havaleSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'user', required: false }, 
    sessionId: { type: String, required: false }, 
    orderId: { type: Schema.Types.ObjectId, ref: 'order', required: true },
    firstName: {type : String, required: true},
    lastName: {type: String, required: true},
    bankName: { type: String, required: true }, 
    accountNumber: { type: String, required: true }, 
    transactionReference: { type: String, required: false },
    amount: { type: Number, required: true }, 
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['pending', 'success', 'red'],
        default: 'pending'
    },
});
havaleSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Havale', havaleSchema);