const {validationResult} = require('express-validator');

const loginFormunuGoster = (req, res, next) => {
    res.render('login', { layout: './layout/auth_layout.ejs'})

}

const login = (req, res, next) => {
    console.log(req.body);
    res.render('login', { layout: './layout/auth_layout.ejs'})

}

const registerFormunuGoster = (req, res, next) => {
    res.render('register', { layout: './layout/auth_layout.ejs'})

}

const register = (req, res, next) => {

    const hatalar = validationResult(req);
    //console.log(hatalarDizisi);
    if (!hatalar.isEmpty()) {
        res.render('register', { layout: './layout/auth_layout.ejs', hatalar: hatalar.array()});
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