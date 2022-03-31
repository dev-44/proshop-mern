import mongoose from "mongoose"

const shipAddressSchema = mongoose.Schema({
    address: {type: String, required: true},
    city: {type: String, required: true},
    postalCode: {type: String, required: true},
    country: {type: String, required: true},
}, {
    timestamps: true
})


const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },    
    password: {
        type: String,
        required: true
    },    
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    shippingAddresses: [shipAddressSchema],
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)
const ShipAddress = mongoose.model('ShipAddress', shipAddressSchema)

export {
    User, 
    ShipAddress
}