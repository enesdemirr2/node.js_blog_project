const {validationResult} = require('express-validator');

const loginFormunuGoster = (req, res, next) => {
    res.render('login', { layout: './layout/auth_layout.ejs'})

}

const login = (req, res, next) => {
    console.log(req.body);
    res.render('login', { layout: './layout/auth_layout.ejs'})

}

const registerFormunuGoster = (req, res, next) => {
    //console.log(req.flash('validation_error'));
    res.render('register', { layout: './layout/auth_layout.ejs'})

}

const register = (req, res, next) => {

    const hatalar = validationResult(req);
    //console.log(hatalarDizisi);
    if (!hatalar.isEmpty()) {

        req.flash('validation_error', hatalar.array());
        req.flash('email', req.body.email);
        req.flash('ad', req.body.ad);
        req.flash('soyad', req.body.soyad);
        req.flash('sifre', req.body.sifre);
        req.flash('resifre', req.body.resifre);

        res.redirect('/register');
        // res.render('register', { layout: './layout/auth_layout.ejs', hatalar: hatalar.array()});
    }
}

const forgetPasswordFormunuGoster = (req, res, next) => {
    res.render('forget_password', { layout: './layout/auth_layout.ejs'})

}

const forgetPassword = (req, res, next) => {
    console.log(req.body);
    res.render('forget_password', { layout: './layout/auth_layout.ejs'})

}

module.exports = {
    loginFormunuGoster,
    registerFormunuGoster,
    forgetPasswordFormunuGoster,
    register,
    login,
    forgetPassword
};