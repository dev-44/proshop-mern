import axios from 'axios'

//Add an item to the cart
const addItem = async (id, qty, cartItems) => {
    console.log('This is cartService')
    console.log(id, qty)
    const response = await axios.get(`/api/products/${id}`)
    const { data } = response

    if(data){
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
    }

    return {
        product: data._id,
        name: data.name,
        image: data.image,
        price: data.price,
        countInStock: data.countInStock,
        qty
    }
}

const cartService = {
    addItem
}

export default cartService