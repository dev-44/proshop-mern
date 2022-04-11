import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'
import asyncHandler from 'express-async-handler'

//@description      Fetch all products
//@route            GET api/products
//@access           Public
const getProducts = asyncHandler(async(req, res) => {
    const products = await Product.find({})
    res.json(products)
})

//@description      Get a single product
//@route            GET api/products/:id
//@access           Public
const getProductById = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    if(product){
        res.json(product)
    } else {
        //res.status(404).json({message: 'Product not found'})
        res.status(404)
        throw new Error('Product not found')
    }
})

//@description      Delete a product
//@route            DELETE api/products/:id
//@access           Private/Admin
const deleteProduct = asyncHandler(async(req, res) => {
    const product = await Product.findById(req.params.id)
    const orders = await Order.find({})

    orders.map(myFunction)

    function myFunction(order) {
        var exists = order.orderItems.filter(item => item._id === req.params.id)
        console.log(exists)
    }

   
    /*
    orders.map(order => order.orderItems.filter(item => item._id === req.params.id, () => {
        console.log('We found it')
    }))
    */

    /*
    if() {
        res.status(404)
        throw new Error('Exists orders with that product. Cant Delete')
    } else {
        await product.remove()
        res.json({message: 'Product removed'})
    }
    */
})

export {
    getProducts,
    getProductById,
    deleteProduct
}