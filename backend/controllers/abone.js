const Abone = require('../models/abone');

const createAbone = async (req, res) => {
    try {
        const {name, lastname, phone, email} = req.body;

        if (!name || !lastname || !phone || !email) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen tüm alanları doldurun'
            })
        }

        const newAbone = Abone.create({
            name,
            lastname,
            phone,
            email
        });

        res.status(201).json({
            success: true,
            message: 'Abone başarıyla oluşturuldu',
            abone: newAbone
        })


    } catch (error) {
        console.error('Abone oluşturulurken hata', error);

        res.status(500).json({
            success: false,
            message: "abone oluşturulurken hata !",
            error: error.message
        })
        
    }
}


const getAbones = async(req, res) => {
    try {
        const abones = await Abone.find();
        res.status(200).json({
            success: true,
            abones: abones,
        });
    } catch (error) {
        console.error('Aboneler getirilirken bir hata oldu.', error);
        res.status(500).json({
            success: false,
            message: 'Aboneler getirilirken hata oluştu.'
        });
    }
}




module.exports = { createAbone, getAbones }
















