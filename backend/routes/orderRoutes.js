import express from "express"
const router = express.Router()
import { AddOrderItems, getOrderById, updateOrderToPaid, getUserOrders, getOrders, updateOrderToDelivered } from '../controllers/orderController.js'
import {protect, isAdmin} from '../middleware/authMiddleware.js'

router.route('/')
    .get(protect, isAdmin, getOrders)
    .post(protect, AddOrderItems)
router.route('/myorders').get(protect, getUserOrders)
router.route('/:id').get(protect, getOrderById)               //:id at the bottom
router.route('/:id/pay').put(protect, updateOrderToPaid)
router.route('/:id/deliver').put(protect, isAdmin, updateOrderToDelivered)

export default router