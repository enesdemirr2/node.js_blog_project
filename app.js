const dotenv = require('dotenv').config();
const express = require('express');
const app = express();

//db bağlantısı 
require('./database.js')

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

app.get('/login', (req,res) => {
    res.render('login', { layout: './layout/auth_layout.ejs'})
})

app.get('/register', (req,res) => {
    res.render('register', { layout: './layout/auth_layout.ejs'})
})

app.get('/forget-password', (req,res) => {
    res.render('forget_password', { layout: './layout/auth_layout.ejs'})
})

app.listen(process.env.PORT, () => {
    console.log(`Server ${process.env.PORT} portundan ayaklandı`);
})