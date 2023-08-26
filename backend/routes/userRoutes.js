import express from "express";
import checkAuth from '../middleware/checkAuth.js'
import { newUser, auth, userConfirm, recoveryPass, verifyToken, newPassword, userProfile } from '../controllers/userController.js'

const router = express.Router();



//Auntenticación , registro y confirmacion de usuarios

router.post('/', newUser)
router.post('/login', auth)
router.get('/confirm-account/:token', userConfirm)
router.post('/recovery-password', recoveryPass)
router.get('/recovery-password/:token', verifyToken)
router.post('/recovery-password/:token', newPassword)

router.get('/profile', checkAuth, userProfile)








export default router;