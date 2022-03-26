const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
//session işlemleri için gereken paket
const session = require('express-session');
//render edilen sayfalarda mesaj göstermek için kullanılan
//ve de çalışmak için seesion paketi isteyen yardımcı paket
const flash = require('connect-flash')

const passport = require('passport');

//Sesiondan öncesine taşıdık.Artık bu static dosyalara get isteğinde bulunulduğunda seesion yapısı çalışmayacak
//template engine ayarları
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

app.use(express.static('public')); //erişmek için önce açtık
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src/views'));

//db bağlantısı 
const database = require('./config/database')
const SequelizeStore = require("connect-session-sequelize")(session.Store);

const myStore = new SequelizeStore({
	db: database,
});

//session ve flash message
app.use(session(
    {
      secret: process.env.SESSION_SECRET,
      resave : false,
      saveUninitialized: true,
      cookie: {
          maxAge:1000 * 60 * 60 * 24
      },
      store: myStore
    }
));
// veritabanı tablosu oluştur
myStore.sync();


app.use(flash());

app.use((req, res, next) => {
    res.locals.validation_error = req.flash('validation_error');
    res.locals.success_message = req.flash('success_message')
    res.locals.email = req.flash('email');
    res.locals.full_name = req.flash('full_name');
    res.locals.user_name = req.flash('user_name')
    res.locals.password = req.flash('password')
    res.locals.repassword = req.flash('repassword')

    res.locals.login_error = req.flash('error');

    next();
});

//passport-local için atama yaparız
app.use(passport.initialize());
app.use(passport.session());


//routerlar include edilir.
const authRouter = require('./src/routers/auth_router');
const yonetimRouter = require('./src/routers/yonetim_router');

//formdan gelen değerlerin okunabilmesi için
app.use(express.urlencoded({extended: true}))

let sayac = 0;

app.get('/', (req, res) => {
    if (req.session.sayac) {
        req.session.sayac++;
    } else {
        req.session.sayac = 1;
    }
    res.json({mesaj: 'merhaba', sayacim: req.session.sayac, kulanici: req.user});
})

app.use('/', authRouter);
app.use('/yonetim', yonetimRouter);

 
app.listen(process.env.PORT, () => {
    console.log(`Server ${process.env.PORT} portundan ayaklandı`);
})