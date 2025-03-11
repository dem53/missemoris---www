const mongoose = require('mongoose');

const db = () => {
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("MongoDB bağlantı başarılı...");
    }).catch((err) => {
        console.log(err, 'MongoDB bağlantısı başarısız!!!');
    })
}


module.exports = db;