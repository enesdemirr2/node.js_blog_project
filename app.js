const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

//db bağlantısı 
require('./database.js')

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

app.get('/', (req, res) => {
    res.json({mesaj: 'merhaba'});
})

app.use('/', authRouter);


app.listen(process.env.PORT, () => {
    console.log(`Server ${process.env.PORT} portundan ayaklandı`);
})