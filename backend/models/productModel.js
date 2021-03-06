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

/*
var subProductSchema = new mongoose.Schema({
    images: [String],
    size: {
         type: String,
         enum: ["xs", "sm", "md", "lg", "xl"]
    },
    colorOrStyle: String,
    countInStock: {
         type: Number,
         required: true,
         default: 0
    }
}, {
    timestamps: true
})
*/

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
    //produts: [subProductSchema],
    
    images: [String],
/*     image: {
        type: String,
        required: true
    },    
    picture: {
        data: Buffer,
        contentType: String
    }, */
    
    brand: {
        type: String,
        required: true
    },    
    category: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
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
    price: {
        type: Number,
        required: true,
        default: 0
    },
    
    countInStock: {
        type: Number,
        required: true,
        default: 0
    },
    
}, {
    timestamps: true
})

const Product = mongoose.model('Product', productSchema)

export default Product