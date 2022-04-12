import express from "express"
const router = express.Router()
import {getProducts, 
        getProductById, 
        deleteProduct,
        updateProduct,
        createProduct
} from '../controllers/productController.js'
import {protect, isAdmin} from '../middleware/authMiddleware.js'

//  /api/products
router.route('/')
    .get(getProducts)
    .post(protect, isAdmin, createProduct)

//  /api/products/:id
router.route('/:id')
    .get(getProductById)
    .delete(protect, isAdmin, deleteProduct)
    .put(protect, isAdmin, updateProduct)

export default router