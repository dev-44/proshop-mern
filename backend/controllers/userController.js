import {User} from '../models/userModel.js'
import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

//@description      Auth user and get token
//@route            POST api/users/login
//@access           Public
const authUser = asyncHandler(async(req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if(user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            shippingAddresses: user.shippingAddresses,
            token: generateToken(user._id)
        })
    } else {
        res.status(401)
        throw new Error('Invalid Credentials')
    }
})

//@description      Register a new user
//@route            POST api/users
//@access           Public
const registerUser = asyncHandler(async(req, res) => {
    const { name, email, password } = req.body

    const userExists = await User.findOne({ email })

    if(userExists){
        res.status(400)
        throw new Error('User already Exists')
    }

    //Hash password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const user = await User.create({
        name,
        email,
        password: hashedPassword
    })

    if(user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            shippingAddresses: user.shippingAddresses,
            token: generateToken(user._id)
        })
    } else {
        res.status(400)
        throw new Error('Invalidad User Data')

    }
})

//@description      Get user profile
//@route            POST api/users/profile
//@access           Private
const getUserProfile = asyncHandler(async(req, res) => {
    const user = await User.findById(req.user._id)

    if(user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            shippingAddresses: user.shippingAddresses,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

//@description      Update user profile
//@route            PUT api/users/profile
//@access           Private
const updateUserProfile = asyncHandler(async(req, res) => {
    
    const user = await User.findById(req.params.id)

    if(user) {
        user.name = req.body.name || user.name
        user.email = req.body.email || user.email
        
        if(req.body.password) {
            //Hash password
            const salt = await bcrypt.genSalt(10)
            const hashedPassword = await bcrypt.hash(req.body.password, salt)
            user.password = hashedPassword
        }
        const updatedUser = await user.save()

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            shippingAddresses: updatedUser.shippingAddresses,
            token: generateToken(updatedUser._id)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

//@description      Check current password
//@route            POST api/users/check-password
//@access           Private
const checkCurrentPassword = asyncHandler(async(req, res) => {
    const { email, password } = req.body

    const user = await User.findOne({ email })

    if(user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({status: 'verified'})
    } else {
        res.status(401)
        throw new Error('Current Password is incorrect')
    }
})

//@description      Add a new shipping address
//@route            POST api/users/:id/shipping 
//@access           Private
const addShippingAddress = asyncHandler(async(req, res) => {
    const user = await User.findById(req.params.id)
    console.log(req.headers.authorization)

    if(user) {
        console.log(req.body)
        user.shippingAddresses.push(req.body)
        const updatedUser = await user.save()
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            shippingAddresses: updatedUser.shippingAddresses,
            token: generateToken(updatedUser._id)
        })
        //Return the last object added to the array
        //const length = updatedUser.shippingAddresses.length
        //res.json(updatedUser.shippingAddresses[length - 1])
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

//@description      Update a shipping address
//@route            PUT api/users/:id/shipping 
//@access           Private
const editShippingAddress = asyncHandler(async(req, res) => {
    console.log('Edit Shipping Address userController')
    const newAddress = req.body
    const addressId = newAddress.id
    const userId = req.params.id

    
    console.log(newAddress)
    console.log('userId: ' + userId)
    console.log('addressId: ' + addressId)

    //Find a document a SubDocument
    //const docSub = await User.findOne({ "_id": userId, "shippingAddresses._id": newAddress.id})

    try {
        let user = await User.findOneAndUpdate(
            { "_id": userId, "shippingAddresses._id": addressId},
            { 
                "$set": {
                    "shippingAddresses.$.address": newAddress.address,
                    "shippingAddresses.$.city": newAddress.city,
                    "shippingAddresses.$.postalCode": newAddress.postalCode,
                    "shippingAddresses.$.country": newAddress.country,
                    "shippingAddress.$.updateAt": new Date()
                },
                
            }, {new: true, timestamps:{createdAt:false, updatedAt:true}}
                
        )

        console.log('This is doc')
        console.log(user)
    
        if (user) {
            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                isAdmin: user.isAdmin,
                shippingAddresses: user.shippingAddresses,
                token: generateToken(user._id)
            })
        } else {
            res.status(404)
            throw new Error('User not found')
        }
    } catch (error) {
        console.log('Somo error $$$$$$$$$$')
        console.log(error)
    }
})

//@description      Delete a shipping address
//@route            DELETE api/users/:id/shipping 
//@access           Private
const deleteShippingAddress = asyncHandler(async(req, res) => {
    
    const userId = req.params.id
    const addressId = req.params.idaddress

    const user = await User.findById(userId)
    await user.shippingAddresses.id(addressId).remove()
    await user.save((err) => {
        if (err) return console.log(err)
        console.log('The address was deleted');
    })

    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            shippingAddresses: user.shippingAddresses,
            token: generateToken(user._id)
        })
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})


//Generate Token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '30d' //days
    })
}

export {
    authUser, 
    getUserProfile, 
    registerUser, 
    updateUserProfile, 
    checkCurrentPassword,
    addShippingAddress,
    editShippingAddress,
    deleteShippingAddress
}