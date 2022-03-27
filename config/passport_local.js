const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const bcrypt = require('bcrypt')

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
                return done(null, false, { message: 'User bulunamadi'});
            }

            const sifreKontrol = await bcrypt.compare(password, _bulunanUser.password);
            if (!sifreKontrol) {
                return done(null, false, {message: 'Sifre hatali'});
            } else {

                if (_bulunanUser && _bulunanUser.emailAktif == false) {
                    return done(null, false, { message: 'Lutfen emailinizi onaylayın'});
                } else
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
        //console.log("Sessiona kaydedilen id veritabanında arandı ve bulundu");
        const user = await User.findOne({
            where: {
                id: id
            }
        });
        //console.log(user);
        done(null, user);
    });
}