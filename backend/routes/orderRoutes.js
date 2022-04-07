import express from "express"
const router = express.Router()
import {
    AddOrderItems
} from '../controllers/orderController.js'
import {protect} from '../middleware/authMiddleware.js'

router.route('/').post(protect, AddOrderItems)

export default router