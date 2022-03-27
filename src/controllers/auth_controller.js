const {validationResult} = require('express-validator');
const User = require('../models/user')
const passport = require('passport');
require('../../config/passport_local')(passport);
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');


const loginFormunuGoster = (req, res, next) => {
    res.render('login', { layout: './layout/auth_layout.ejs'})

}

const login = (req, res, next) => {
    
    //Logine post isteği geldiğinde
    const hatalar = validationResult(req);
    //console.log(hatalarDizisi);
    req.flash('email', req.body.email);
    req.flash('password', req.body.password);

    if (!hatalar.isEmpty()) {

        req.flash('validation_error', hatalar.array());
        

        res.redirect('/login');
        // res.render('register', { layout: './layout/auth_layout.ejs', hatalar: hatalar.array()});
    } 
    else {
        passport.authenticate('local', {
            successRedirect: '/yonetim', //Başarılı giriş olursa buraya yönlendir
            failureRedirect: '/login',
            failureFlash: true
        })(req, res, next);
    }
    //res.render('login', { layout: './layout/auth_layout.ejs'})

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

            if(_user && _user.emailAktif == true) {
                req.flash('validation_error',[{msg: "Bu mail kullanılıyor"}])
                req.flash('email', req.body.email);
                req.flash('full_name', req.body.full_name);
                req.flash('user_name', req.body.user_name);
                req.flash('password', req.body.password);
                req.flash('repassword', req.body.repassword);

                res.redirect('/register');
            } else if( (_user && _user.emailAktif == false) || _user == null) {

                if (_user) {
                    await User.findByIdAndRemove({
                        where: {
                            id: _user.id}
                    })
                }
                const newUser = new User ({
                    email:req.body.email,
                    full_name:req.body.full_name,
                    user_name:req.body.user_name,
                    //Şifre hashleme yapıldı
                    password: await bcrypt.hash(req.body.password, 10),
                });
                //Yeni kullanıcının veri tabanına kayıt olması 
                await newUser.save();
                console.log("Kullanıcı Kaydedildi");
                
                
                req.flash('success_message', [{msg: "Lutfen mail kutunuzu kontrol edin"}])

                
                //jwt işlemleri

                const jwtBilgileri = {
                    id: newUser.id,
                    mail: newUser.email
                };

                const jwtToken = jwt.sign(jwtBilgileri, process.env.CONFIRM_MAIL_JWT_SECRET, {
                    expiresIn:'1d'});
                    console.log(jwtToken);


                    //Mail GÖnderme İşlemleri



                res.redirect('/login');
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

const logout = (req, res, next) => {
    req.logout();// Sessionda bulunan id değerini siler
    req.session.destroy((error) => { // Çıkış yaptıktan sonra sessionu  siler
        res.clearCookie('connect.sid'); //Git bunu temizle
        //req.flash('success_message', [{msg: 'Basariyla çikis yapildi'}]) //Sesion silindiği için bu yapıyı kullanamadık
        res.render('login', { layout: './layout/auth_layout.ejs', success_message:[{msg: 'Basariyla çikis yapildi'}] })
        //res.redirect('/login');
        //res.send('Çıkış Yapıldı');
    });

}

module.exports = {
    loginFormunuGoster,
    registerFormunuGoster,
    forgetPasswordFormunuGoster,
    register,
    login,
    forgetPassword, logout
};