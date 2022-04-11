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
    deleteShippingAddress,
    getUsers,
    deleteUser,
    makeAdmin
} from '../controllers/userController.js'
import {protect, isAdmin} from '../middleware/authMiddleware.js'

router.route('/')
    .post(registerUser)
    .get(protect, isAdmin, getUsers)
router.route('/:id')
    .put(protect, isAdmin, makeAdmin)
    .delete(protect, isAdmin, deleteUser)
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