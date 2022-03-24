const {validationResult} = require('express-validator');
const User = require('../models/user')


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

const register = async(req, res, next) => {

    const hatalar = validationResult(req);
    //console.log(hatalarDizisi);
    if (!hatalar.isEmpty()) {

        req.flash('validation_error', hatalar.array());
        req.flash('email', req.body.email);
        req.flash('full_name', req.body.full_name);
        req.flash('user_name', req.body.user_name);
        req.flash('password', req.body.password);
        req.flash('repassword', req.body.repassword);

        res.redirect('/register');
        // res.render('register', { layout: './layout/auth_layout.ejs', hatalar: hatalar.array()});
    } else {

        try {
            const _user = await User.findOne({
                where : {
                    email : req.body.email}
                });

            if(_user) {
                req.flash('validation_error',[{msg: "Bu mail kullanılıyor"}])
                req.flash('email', req.body.email);
                req.flash('full_name', req.body.full_name);
                req.flash('user_name', req.body.user_name);
                req.flash('password', req.body.password);
                req.flash('repassword', req.body.repassword);

                res.redirect('/register');
            } else {
                const newUser = new User ({
                    email:req.body.email,
                    full_name:req.body.full_name,
                    user_name:req.body.user_name,
                    password:req.body.password,
                });
                //Yeni kullanıcının veri tabanına kayıt olması 
                await newUser.save();
                console.log("Kullanıcı Kaydedildi");
                
                res.redirect('/login');
                req.flash('success_message', [{msg: "Giriş yapabilirsiniz"}])
            }

        } catch(err) {

        }

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