const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db.js');
const Auth = require('./routes/auth.js');
const Post = require('./routes/post.js');
const Card = require('./routes/card.js');
const Order = require('./routes/orderRoutes.js');
const Havale = require('./routes/havaleRoutes.js');
const Favorite = require('./routes/favoriteRoutes.js');
const Payment = require('./routes/paymentRoutes.js');
const Abone = require('./routes/abone.js');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


// Swagger entegrasyonu
const { swaggerUi, swaggerSpec } = require('./swagger');
const abone = require('./models/abone.js');

// DIŞ BAĞLANTILARIM 
dotenv.config();

// SERVER && APP
const app = express();

// DATABASE 
db();

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://missemoris.com',
        'https://sandbox-api.iyzipay.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'DELETE', 'PATCH', 'PUT'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));


// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Swagger UI'yi "/api-docs" yoluna bağla
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Multer ayarları
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

// Route'lar
app.use('/', Auth);
app.use('/', Post);
app.use('/', Card);
app.use('/', Order);
app.use('/', Havale);
app.use('/', Favorite);
app.use('/', Payment);
app.use('/', Abone);


// Sunucuya başlama
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Sunucu ${PORT} portunda çalışıyor...`);
});
