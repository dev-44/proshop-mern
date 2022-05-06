import mongoose from "mongoose"

const reviewSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    user : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
}, {
    timestamps: true
})


var subProductSchema = new mongoose.Schema({
    images: [String],
    size: {
         type: String,
         enum: ["xp", "p", "m", "G", "XG", "XXG"]
    },
    color: String,
    countInStock: {
         type: Number,
         required: true,
         default: 0
    }
}, {
    timestamps: true
})


const productSchema = mongoose.Schema({
    user : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    imageCover: {
        type: String,
        required: true
    },
    products: [subProductSchema],
    brand: {
        type: String,
        required: true
    },    
    category: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    views: {
        type: Number,
        default: 0
    },
    reviews : [reviewSchema],
    rating: {
        type: Number,
        required: true,
        default: 0
    },
    numReviews: {
        type: Number,
        required: true,
        default: 0
    },
 
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)

export default Product