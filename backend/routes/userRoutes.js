import express from "express"
const router = express.Router()
import {
    authUser, 
    getUserProfile, 
    registerUser, 
    updateUserProfile, 
    checkCurrentPassword,
    addShippingAddress,
    editShippingAddress,
    deleteShippingAddress
} from '../controllers/userController.js'
import {protect} from '../middleware/authMiddleware.js'

router.post('/', registerUser)
router.post('/login', authUser)
router.post('/check-password', protect, checkCurrentPassword)
router.route('/profile/:id')
    //.get(protect, getUserProfile)
    .put(protect, updateUserProfile)
router.route('/profile/:id/shipping')
    .post(protect, addShippingAddress)
    .put(protect, editShippingAddress)
router.delete('/profile/:id/shipping/:idaddress', protect, deleteShippingAddress)

export default router