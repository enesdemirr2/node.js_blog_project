const {body} = require('express-validator');



const validateNewUser = () => {
    return[
        body('email')
            .trim()
            .isEmail().withMessage('Geçerli bir mail giriniz'),

        body('password').trim()
            .isLength({ min: 6 }).withMessage('Şifre en az 6 karakter olmalı')
            .isLength({ max: 20 }).withMessage('Şifre en fazla 20 karakter olmalı'),

        body('full_name').trim()
            .isLength({ min: 2 }).withMessage('Isim bilgisi en az 2 karakter olmalı')
            .isLength({ max: 30 }).withMessage('Isim bilgisi en fazla 30 karakter olmalı'),

        body('user_name').trim()
            .isLength({ min: 2 }).withMessage('Kullanıcı adı en az 2 karakter olmalı')
            .isLength({ max: 30 }).withMessage('Kullanıcı adı en fazla 30 karakter olmalı'),

        body('repassword').trim().custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Şifreler aynı değil')
            }
            return true;
        })

    ];
}

module.exports = {
    validateNewUser
}