import axios from 'axios'

//Add an item to the cart
const addItem = async (id, qty, cartItems) => {
    console.log('This is cartService')
    console.log(id, qty)
    const response = await axios.get(`/api/products/${id}`)
    const data = response.data

    let item = {
            id: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            countInStock: data.countInStock,
            qty
        }

    const existItem = cartItems.find(x => x.id === item.id)

    if(existItem){
        console.log('The item already exists')
        //Replace
        cartItems = cartItems.map(x => x.id === existItem.id ? item : x)
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        return cartItems
    } else {
        console.log('The item doesnt exists')
        cartItems = [...cartItems, item]
        localStorage.setItem('cartItems', JSON.stringify(cartItems))
        return cartItems
    }

    
}

//Change quantity of the Item in the Cart
const changeQty = (id, qty, cartItems) => {
    //console.log(`Id: ${id} and Qty: ${qty}`)
    let updItem = cartItems.find(x => x.id === id)
    updItem = {...updItem, qty}
    cartItems = cartItems.map(x => x.id === id ? updItem : x)
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
    return cartItems
}

//Remove item from the Cart
const removeItem = (id, cartItems) => {
    cartItems = cartItems.filter((item) => item.id !== id)
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
    return cartItems 
}


const cartService = {
    addItem,
    changeQty,
    removeItem,
}

export default cartService