import mongoose from "mongoose"
import shipAddress from "./shipAddressModel"

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
    shippingAddreses: [shipAddress.shipAddressSchema]
}, {
    timestamps: true
})

const User = mongoose.model('User', userSchema)

export default User