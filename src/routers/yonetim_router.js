const router = require('express').Router();
const yonetimController = require('../controllers/yonetim_controller');
const authMiddleware = require('../middlewares/auth_middleware')

router.get('/', authMiddleware.oturumAcilmis, yonetimController.anaSayfayiGoster);
router.get('/profile', authMiddleware.oturumAcilmis, yonetimController.ProfilSayfasiniGoster);




module.exports = router;