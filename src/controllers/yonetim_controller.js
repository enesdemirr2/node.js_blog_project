const anaSayfayiGoster = function (req, res, next) {
    res.render('index', { layout: './layout/yonetim_layout.ejs', 
                user: req.user,
                isAuth: req.isAuthenticated()})

}

const ProfilSayfasiniGoster = function (req, res, next) {
    
    res.render('profile', { layout: './layout/yonetim_layout.ejs', 
                user: req.user,
                isAuth: req.isAuthenticated()})

}

module.exports = {
    anaSayfayiGoster,
    ProfilSayfasiniGoster
}