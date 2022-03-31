const multer = require('multer');
const path = require('path');

const myStorage = multer.diskStorage({ //Multerın dosyaları aktardığı yer
    destination:(req, file, cb) => {
        cb(null, path.join( __dirname,"../src/uploads/avatars")); //Buraya dosyaların yüklenmesi gerektiğini söyledik.
    },

    filename: (req, file, cb) => {
        console.log(req.user.email);
        cb(null, req.user.email+ "" + path.extname(file.originalname)); //Dosya adını oluşturma
    }
}); 

const resimFileFilter = (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg') {
        cb(null, true);
    } else {
        cb(null, false)
    }
}

const uploadResim = multer({storage: myStorage, fileFilter:resimFileFilter});

module.exports = {
    uploadResim
}