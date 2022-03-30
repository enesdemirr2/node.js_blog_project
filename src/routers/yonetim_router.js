const router = require('express').Router();
const yonetimController = require('../controllers/yonetim_controller');
const authMiddleware = require('../middlewares/auth_middleware')
const multerConfig = require('../../config/multer_config');

router.get('/', authMiddleware.oturumAcilmis, yonetimController.anaSayfayiGoster);
router.get('/profile', authMiddleware.oturumAcilmis, yonetimController.ProfilSayfasiniGoster);

router.post('/profile-guncelle', authMiddleware.oturumAcilmis, multerConfig.single('avatar'), yonetimController.profilGuncelle);




module.exports = router;