import Product from '../models/productModel.js'
import Order from '../models/orderModel.js'
import asyncHandler from 'express-async-handler'
import path from 'path'


//This is a comment

//@description      Fetch all products
//@route            GET api/products
//@access           Public
const getProducts = asyncHandler(async(req, res) => {

    const pageSize = 3
    const page = Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}

    const count = await Product.countDocuments({...keyword})
    const products = await Product.find({...keyword}, '-picture').limit(pageSize).skip(pageSize * (page - 1))
    res.json({products, page, pages: Math.ceil(count / pageSize)})
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
    
    let items = []
    orders.map(order => order.orderItems.map(item => items.push(item)))
    //console.log(items)
    //console.log('-----------------------')
    //console.log(req.params.id)
    items.map(item => console.log(item.id.valueOf()))
    let match = items.filter(item => item.id.valueOf() === req.params.id)
    //console.log(match)
    //console.log(match.length)

    if(match.length > 0) {
        res.status(404)
        throw new Error('Exists orders with that product. Cant Delete')
    } else {
        await product.remove()
        res.json({message: 'Product removed'})
    }
})

//@description      Create a product
//@route            POST api/products/:id
//@access           Private/Admin
const createProduct = asyncHandler(async(req, res) => {


    const product = new Product({
        user: req.user._id,
        name: req.body.name,
        image: req.body.image,
        brand: req.body.brand,
        category: req.body.category,
        description: req.body.description,
        price: req.body.price,
        countInStock: req.body.countInStock,
        //numReviews: req.body.numReviews,
    })


    try {
        const newProduct = await product.save()
        res.status(201).json(newProduct)
    } catch (error) {
        console.log(error)
        res.status(404)
        throw new Error('Cannot create the product')
    }
})

//@description      Update a product
//@route            PUT api/products/:id
//@access           Private/Admin
const updateProduct = asyncHandler(async(req, res) => {

    const {name, price, description, image, brand, category, countInStock} = req.body

    var product = await Product.findById(req.params.id)

    if(product) {
        product.name = name
        product.price = price
        product.description = description
        product.image = image
        product.brand = brand
        product.category = category
        product.countInStock = countInStock

        try {
            await product.save()
            const products = await Product.find()
            res.json(products)
        } catch (error) {
            console.log(error)
        }
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

//@description      Create a new Review
//@route            POST api/products/:id/review
//@access           Private
const createProductReview = asyncHandler(async(req, res) => {

    const {rating, comment} = req.body

    var product = await Product.findById(req.params.id)

    if(product) {
        const alreadyReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

        if(alreadyReviewed) {
            res.status(400)
            throw new Error('Product already reviewed')
        }

        const newReview = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id
        }

        product.reviews.push(newReview)
        product.numReviews = product.reviews.length
        product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

        try {
            await product.save()
            res.status(201).json({message: 'Review Added'})
        } catch (error) {
            console.log(error)
        }
    } else {
        res.status(404)
        throw new Error('Product not found')
    }
})

export {
    getProducts,
    getProductById,
    deleteProduct,
    createProduct,
    updateProduct,
    createProductReview
}