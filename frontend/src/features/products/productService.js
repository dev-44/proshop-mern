import axios from 'axios'

const API_URL = '/api/products'

//Get All Products
const getProducts = async() => {
    const response = await axios.get(API_URL)
    return response.data
}

const getProductDetails = async(id) => {
    const response = await axios.get(API_URL + '/' + id)
    return response.data
}

const productService = {
    getProducts,
    getProductDetails
}

export default productService