import express from "express"
const router = express.Router()
import {authUser, getUserProfile, registerUser, updateUserProfile, checkCurrentPassword} from '../controllers/userController.js'
import {protect} from '../middleware/authMiddleware.js'

router.post('/', registerUser)
router.post('/login', authUser)
router.post('/check-password', protect, checkCurrentPassword)
router.route('/profile/:id')
    //.get(protect, getUserProfile)
    .put(protect, updateUserProfile)

export default router