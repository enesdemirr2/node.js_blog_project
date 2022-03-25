const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

module.exports = function(passport) {

    const options = {
        usernameField: 'email',
        passwordField: 'password'
    }

    passport.use(new LocalStrategy(options, async (email, password, done) => {


        try {
            const _bulunanUser = await User.findOne({
                where: {
                    email: email
                }
            })

            if (!_bulunanUser) {
                return done(null, false, { message: 'User bulunamadı'});
            }

            if (_bulunanUser.password !== password) {
                return done(null, false, {message: 'Şifre hatalı'});
            } else {
                return done(null, _bulunanUser);
            }

        } catch (err) {
            return done(err)
        }
    }));

    passport.serializeUser(function (user, done) {
        console.log("Sessiona kaydedildi" + user.id);
        done(null, user.id);
    });

    passport.deserializeUser(async function(id, done) {
        console.log("Sessiona kaydedilen id veritabanında arandı ve bulundu");
        const user = await User.findOne({
            where: {
                id: id
            }
        });
        console.log(user);
        done(null, user);
    });
}