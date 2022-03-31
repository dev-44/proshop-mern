import mongoose from "mongoose"

const shipAddressSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    address: {type: String, required: true},
    city: {type: String, required: true},
    postalCode: {type: String, required: true},
    country: {type: String, required: true},
}, {
    timestamps: true
})

const shipAddress = mongoose.model('shipAddress', shipAddressSchema)
export default shipAddress