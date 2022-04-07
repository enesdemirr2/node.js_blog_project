const User = require('../models/user')


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

/*const profilGuncelle = async (req, res, next) => {
    if (req.file) {
        const fileResult = await User.update({
            
            avatar : req.file.filename 
        },
        {where : {id : req.user.id}}
        )

        console.log('file calıştı)

        const result = await User.update({
            user_name : req.body.username,
            full_name : req.body.full_name
        },
        {where : {id : req.user.id}},
        )
        if (result) {
            console.log('Güncelleme başarili');
           res.redirect('profile')
    
        } else {
            console.log('başarısız');
            res.redirect('/profile')
        }
    }else{
        const result = await User.update({
            full_name : req.body.full_name,
            user_name : req.body.user_name
        },
        {where : {id : req.user.id}}
        )
        if (result) {
            console.log('güncelleme başarili');
           res.redirect('profile')
    
        } else {
            console.log('başarısız');
        }
    }

}*/

const profilGuncelle = async function (req, res, next) {

   try { 

    //console.log(req.file);//Multer sayesinde o an upload edilen dosyanın bilgilerine erişebileceğiz

    if (req.file) {
        const fileResult = await User.update(
            {
                avatar : req.file.filename
            },
            { where : {id: req.user.id}},
        )

        console.log('file calıştı');
    }
        const result = await User.update(
            { user_name : req.body.user_name,
              full_name : req.body.full_name
            },
            { where : {id : req.user.id}},
        )

        if (result) {
            console.log("Guncelleme işlemi başarılı");
            req.flash('success_message_black',[{msg  :'Bilgiler başarılı bir şekilde güncellendi'}])
            res.redirect('/yonetim/profile')
            
        } else {
            console.log("Guncelleme Başarısız");
            res.redirect('/yonetim/profile')
        }

   } catch (error) {
       console.log(error);
   }
}

module.exports = {
    anaSayfayiGoster,
    ProfilSayfasiniGoster,
    profilGuncelle
}