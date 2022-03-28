const {validationResult} = require('express-validator');
const User = require('../models/user')
const passport = require('passport');
require('../../config/passport_local')(passport);
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const e = require('connect-flash');


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
                req.flash('validation_error',[{msg: "Bu mail kullaniliyor"}])
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
                
                

                
                //jwt işlemleri

                const jwtBilgileri = {
                    id: newUser.id,
                    mail: newUser.email
                };

                const jwtToken = jwt.sign(jwtBilgileri, process.env.CONFIRM_MAIL_JWT_SECRET, {
                    expiresIn:'1d'});
                    console.log(jwtToken);


                    //Mail GÖnderme İşlemleri
                    const url = process.env.WEB_SITE_URL + 'verify?id=' + jwtToken;
                    console.log("Gidilecek url:" + url);

                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.GMAIL_USER,
                            pass: process.env.GMAIL_SIFRE
                        }
                    });

                    await transporter.sendMail({

                        from:'Nodejs Uygulaması <info@nodejskursu.com>',
                        to: newUser.email,
                        subject: "Emailinizi Lütfen Onaylayin ",
                        text:"Emailinizi onaylamak icin lütfen şu linke tiklayin " + url
                    }, (error, info) => {
                        if (error) {
                            console.log("Bir hata var" + error);
                        }
                        console.log("Mail Gonderildi");
                        console.log(info);
                        transporter.close();
                    });

                req.flash('success_message', [{msg: "Lutfen mail kutunuzu kontrol edin "}])
                res.redirect('/login');
            }

        } catch(err) {
            console.log("User kaydedilirken hata çıktı" + err);
        }

    }
}

const forgetPasswordFormunuGoster = (req, res, next) => {
    res.render('forget_password', { layout: './layout/auth_layout.ejs'})

}

const forgetPassword = async (req, res, next) => {

    const hatalar = validationResult(req);

    if (!hatalar.isEmpty()) {

        req.flash('validation_error', hatalar.array());
        req.flash('email', req.body.email);

        res.redirect('/forget-password');

    } 
    //Burası çalışıyorsa  kullanıcı düzgün bir mail girmiştir
    else {
        
        try {
            const _user = await User.findOne({
                where : {
                    email : req.body.email, emailAktif: true}
                });

                if (_user) {
                    //Kullanıcıya şifre sıfırlama maili atılabilir.
                    const jwtBilgileri = {
                        id: _user.id,
                        mail: _user.mail
                    };
                    const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _user.password;
                    const jwtToken = jwt.sign(jwtBilgileri, secret, { expiresIn:'1d'});

                    
                    //Mail GÖnderme İşlemleri
                    const url = process.env.WEB_SITE_URL + 'reset-password/'+_user.id +"/"+ jwtToken;
                    

                    let transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.GMAIL_USER,
                            pass: process.env.GMAIL_SIFRE
                        }
                    });

                    await transporter.sendMail({

                        from:'Nodejs Uygulaması <info@nodejskursu.com>',
                        to: _user.email,
                        subject: "Şifre Güncelleme ",
                        text:"Sifrenizi oluşturmak için lütfen şu linke tiklayin " + url

                    }, (error, info) => {
                        if (error) {
                            console.log("Bir hata var" + error);
                        }
                        console.log("Mail Gonderildi");
                        console.log(info);
                        transporter.close();
                    });

                    req.flash('success_message', [{msg: "Lutfen mail kutunuzu kontrol edin "}])
                    res.redirect('/login');

                } else {
                    req.flash('validation_error',[{msg: "Bu mail kayitli degil veya Kullanici pasif "}])
                    req.flash('email', req.body.email);
                    res.redirect('/forget-password');
                } 

            } catch(err) {
            console.log("User kaydedilirken hata çıktı " + err);
        }
    }

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

const verifyMail = (req, res, next) => {

    const token = req.query.id; //Tokeni aldık
    if (token) {

        try {
            jwt.verify(token, process.env.CONFIRM_MAIL_JWT_SECRET, async (e, decoded) => {

                if (e) {
                    req.flash('error', 'Kod Hatali Veya Süresi Dolmus');
                    res.redirect('/login');
                } else {

                    const idInToken = decoded.id;
                    
                    const sonuc = await User.update(
                        { emailAktif : true },
                        { where : { id : idInToken}}
                        
                    )

                        if (sonuc) {
                            req.flash("success_message", [{ msg: 'Basariyla mail onaylandi'}]);
                            res.redirect('/login');
                        } else {
                            req.flash("error", 'Lutfen tekrar kullanici olusturun');
                            res.redirect('/login');
                        }
                }
            })
            
        } catch (err) {
            
        }

    } else {
        req.flash("error", 'Token Yok veya Geçersiz');
        res.redirect('/login');
    }
} 

const yeniSifreFormuGoster = async (req, res, next) => {
    //Linkin içerisindeki parametreleri almak için #params metodunu kullanırız. Çünkü #body formdan gelir
    const linktekiID = req.params.id;
    const linktekiToken = req.params.token;

    if (linktekiID && linktekiToken) {

        const _bulunanUser = await User.findOne({where : { id : linktekiID}})

        const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _bulunanUser.password;

        try {
            jwt.verify(linktekiToken, secret, async (e, decoded) => {

                if (e) {
                    req.flash('error', 'Kod Hatali Veya Süresi Dolmus');
                    res.redirect('/forget-password');
                } else {

                    res.render('new_password', { id:linktekiID, token:linktekiToken, layout: './layout/auth_layout.ejs'})

                    //Token içindeki ID değeri
                    /*const idInToken = decoded.id;
                    
                    const sonuc = await User.update(
                        { emailAktif : true },
                        { where : { id : idInToken}}
                        
                    )

                        if (sonuc) {
                            req.flash("success_message", [{ msg: 'Basariyla mail onaylandi'}]);
                            res.redirect('/login');
                        } else {
                            req.flash("error", 'Lutfen tekrar kullanici olusturun');
                            res.redirect('/login');
                        }*/
                }
            });
            
        } catch (err) {
            
        }

    } else {
        req.flash('validation_error',[{msg: "Lutfen Maildeki Linke Tiklayin. Token Bulunamadi"}]);
        res.redirect('/forget-password');
        
    }
}

const yeniSifreyiKaydet = async  (req, res, next) => {

    const hatalar = validationResult(req);

    if (!hatalar.isEmpty()) {

        req.flash('validation_error', hatalar.array());
        req.flash('password', req.body.password);
        req.flash('repassword', req.body.repassword);

        console.log("Formdan gelen değerler");
        console.log(req.body);

        res.redirect('/reset-password/'+req.body.id+"/"+req.body.token);

    } else {

        const _bulunanUser = await User.findOne({where : { id : req.body.id, emailAktif:true}})

        const secret = process.env.RESET_PASSWORD_JWT_SECRET + "-" + _bulunanUser.password;

        try {
            jwt.verify(req.body.token, secret, async (e, decoded) => {

                if (e) {
                    req.flash('error', 'Kod Hatali Veya Süresi Dolmus');
                    res.redirect('/forget-password');
                } else {

                     //Yeni şifreyi kaydet
                    const hashedPassword = await bcrypt.hash(req.body.password,10)
                    const sonuc = await User.update(
                                { password : hashedPassword },
                                { where : { id : req.body.id}}
            
                    )

                    if (sonuc) {
                    req.flash("success_message", [{ msg: 'Basariyla sifre guncellendi'}]);
                    res.redirect('/login');
                    } else {
                    req.flash("error", 'Lutfen tekrar sifre sifirlama adımlarini uygulayin');
                    res.redirect('/login');
                    }
                }
            });  
        } catch (err) {
            console.log("Hata çıktı"+err);
        } 
    }
}

module.exports = {
    loginFormunuGoster,
    registerFormunuGoster,
    forgetPasswordFormunuGoster,
    register,
    login,
    forgetPassword, 
    logout,
    verifyMail,
    yeniSifreFormuGoster,
    yeniSifreyiKaydet
};