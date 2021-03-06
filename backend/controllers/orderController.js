import Order from '../models/orderModel.js'
import Product from '../models/productModel.js'
import asyncHandler from 'express-async-handler'

//@description      Create new order
//@route            POST api/orders
//@access           Private
const AddOrderItems = asyncHandler(async(req, res) => {

    const { orderItems, shippingAddress, paymentMethod, itemsPrice, taxPrice, shippingPrice, totalPrice } = req.body

    if(orderItems && orderItems.length === 0) {
        res.status(400)
        throw new Error('No order items')
    } else {
        const order = new Order({
            user: req.user._id,
            orderItems,
            shippingAddress, 
            paymentMethod, 
            itemsPrice, 
            taxPrice, 
            shippingPrice, 
            totalPrice
        })


        try {
            const createdOrder = await order.save()

            orderItems.map(async(item) => {
                var quantity = item.qty
                var product = await Product.findById(item.id)
                var current = product.countInStock
                product.countInStock = current - quantity
                await product.save()
            })

            res.status(201).json(createdOrder)
        } catch (error) {
            console.log(error)
        }
    }
})

//@description      Get order by id
//@route            GET api/orders/:id
//@access           Private
const getOrderById = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'name email')

    if(order) {
        res.json(order)
    } else {
        res.status(404)
        throw new Error('Order not Found')
    }
})

//@description      Update Order to Paid
//@route            GET api/orders/:id/paid
//@access           Private
const updateOrderToPaid = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)

    //If PayPal
    if(order) {
        order.isPaid = true
        order.paidAt = Date.now()
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email: req.body.payer.email_address
        }

        try {
            const updatedOrder = await order.save()
            res.json(updatedOrder)
        } catch (error) {
            console.log('Error while saving in the DB'.red.inverse)
            console.log(error)
        }
    } else {
        res.status(404)
        throw new Error('Order not Found')
    }
})

//@description      Get all user orders
//@route            GET api/orders/myorders
//@access           Private
const getUserOrders = asyncHandler(async(req, res) => {
    
    const orders = await Order.find({user: req.user._id})
    res.json(orders)
})

//@description      Get all orders
//@route            GET api/orders
//@access           Private/Admin
const getOrders = asyncHandler(async(req, res) => {
    
    const orders = await Order.find({}).populate('user', 'id name')
    res.json(orders)
})

//@description      Update Order to Delivered
//@route            GET api/orders/:id/deliver
//@access           Private/Admin
const updateOrderToDelivered = asyncHandler(async(req, res) => {
    const order = await Order.findById(req.params.id)

    if(order) {
        order.isDelivered = true
        order.deliveredAt = Date.now()

        try {
            const updatedOrder = await order.save()
            res.json(updatedOrder)
        } catch (error) {
            console.log('Error while saving in the DB'.red.inverse)
            console.log(error)
        }
    } else {
        res.status(404)
        throw new Error('Order not Found')
    }
})

export {
    AddOrderItems, 
    getOrderById, 
    updateOrderToPaid,
    getUserOrders,
    getOrders,
    updateOrderToDelivered
}