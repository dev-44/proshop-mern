import axios from 'axios'

//Add an item to the cart
const addItem = async (id, qty, cartItems) => {
    console.log('This is cartService')
    console.log(id, qty)
    const response = await axios.get(`/api/products/${id}`)
    const data = response.data

    const item = {
            product: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        }

    const existItem = cartItems.find(x => x.product === item.product)

    if(existItem){
        console.log('The item already exists')
        //Replace
        cartItems = cartItems.map(x => x.product === existItem.product ? item : x)
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        return cartItems
    } else {
        console.log('The item doesnt exists')
        cartItems = [...cartItems, item]
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        return cartItems
    }

    
}

const cartService = {
    addItem
}

export default cartService