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

//Delete product
const deleteProduct = async(id, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const {data} = await axios.delete(API_URL + '/' + id, config)
    return data
}

//Create product
const createProduct = async(product, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const {data} = await axios.post(API_URL, product, config)   //In case of not sending data ('URL, {}, config)
    return data
}

//Update product
const updateProduct = async(product, token) => {
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    console.log('Product ID')
    console.log(product.id)

    const {data} = await axios.put(`/api/products/${product.id}`, product, config)
    return data
}

const productService = {
    getProducts,
    getProductDetails,
    deleteProduct,
    createProduct,
    updateProduct
}

export default productService