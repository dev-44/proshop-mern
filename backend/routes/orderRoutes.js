import express from "express"
const router = express.Router()
import { AddOrderItems, getOrderById, updateOrderToPaid } from '../controllers/orderController.js'
import {protect} from '../middleware/authMiddleware.js'

router.route('/').post(protect, AddOrderItems)
router.route('/:id').get(protect, getOrderById)               //:id at the bottom
router.route('/:id/pay').put(protect, updateOrderToPaid)

export default router