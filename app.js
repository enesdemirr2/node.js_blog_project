const dotenv = require('dotenv').config();
const express = require('express');
const app = express();
const session = require('express-session');
const flash = require('connect-flash')

//db bağlantısı 
const database = require('./database')
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
    res.locals.email = req.flash('email');
    res.locals.ad = req.flash('ad');
    res.locals.soyad = req.flash('soyad')
    res.locals.sifre = req.flash('sifre')
    res.locals.resifre = req.flash('resfire')

    next();
});

//routerlar include edilir.
const authRouter = require('./src/routers/auth_router');

//formdan gelen değerlerin okunabilmesi için
app.use(express.urlencoded({extended: true}))

//template engine ayarları
const ejs = require('ejs');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');

app.use(express.static('public')); //erişmek için önce açtık
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, './src/views'));

let sayac = 0;

app.get('/', (req, res) => {
    if (req.session.sayac) {
        req.session.sayac++;
    } else {
        req.session.sayac = 1;
    }
    res.json({mesaj: 'merhaba', sayacim: req.session.sayac});
})

app.use('/', authRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server ${process.env.PORT} portundan ayaklandı`);
})