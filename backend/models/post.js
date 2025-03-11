const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    
    name: {
        type: String,
        required: [true, 'Ürün adı zorunludur'],
        trim: true
    },

    description: {
        type: String,
        required: [true, 'Ürün açıklaması zorunludur'],
        trim: true
    },

    stock: {
        type: Number,
        required: [true, 'Stok miktarı zorunludur'],
        min: [0, 'Stok miktarı 0\'dan küçük olamaz']
    },

    date: {
        type: Date,
        default: Date.now
    },

    imageUrls: [{
        type: String,
        required: [true, 'Ürün görseli zorunludur'],
    }],

    category: [{
        type: String,
        enum: {
            values: ['Giyim', 'Ayakkabı', 'Çanta', 'Aksesuar'],
            message: '{VALUE} geçerli bir kategori değil'
        },
        required: [true, 'Kategori seçimi zorunludur']
    }],

    tags: [{
        type: String,
        enum: {
            values: ['Yeni', 'Tercih Edilen', 'İndirimli', 'Sinirli Stok', 'Kampanya'],
            message: '{VALUE} geçerli bir etiket değil'
        },
        required: [true, 'Etiket seçimi zorunludur']
    }],

    size: [{
        type: String,
        enum: {
            values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
            message: '{VALUE} geçerli bir beden değil'
        },
        required: [true, 'Beden seçimi zorunludur']
    }],

    price: {
        type: Number,
        required: [true, 'Fiyat bilgisi zorunludur'],
        min: [0, 'Fiyat 0\'dan küçük olamaz']
    },

    brand: {
        type: String,
        required: [true, 'Marka bilgisi zorunludur'],
        trim: true
    },

    color: {
        type: String,
        required: [true, 'Renk bilgisi zorunludur'],
        trim: true
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('post', PostSchema);