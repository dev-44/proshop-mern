import mongoose from "mongoose"
 
var imageSchema = new mongoose.Schema({
    img:
    {
        contentType: String,
        data: Buffer,
    }
});
 

const Image = mongoose.model('Image', imageSchema)

export default Image