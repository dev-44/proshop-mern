import mongoose from "mongoose"
 
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
})
 

const SubProduct = mongoose.model('SubProduct', subProductSchema)

export default SubProduct