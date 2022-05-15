import axios from 'axios'

//Add an item to the cart
const addItem = async (data, qty, cartItems) => {
    console.log('This is cartService')
    //const response = await axios.get(`/api/products/${id}/subproduct/${subid}`)
    //const data = response.data



    let item = {
        id: data._id,
        name: data.name,
        price: data.price,
        subid: data.subid,
        image: data.image,
        size: data.size,
        color: data.color,
        countInStock: data.countInStock,
        qty,
    }

    const existItem = cartItems.find(x => x.subid === item.subid)

    if(existItem){
        console.log('The item already exists')
        //Replace
        cartItems = cartItems.map(x => x.subid === existItem.subid ? item : x)
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
const changeQty = (subid, qty, cartItems) => {
    //console.log(`Id: ${id} and Qty: ${qty}`)
    let updItem = cartItems.find(x => x.subid === subid)
    updItem = {...updItem, qty}
    cartItems = cartItems.map(x => x.subid === subid ? updItem : x)
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
    return cartItems
}

//Remove item from the Cart
const removeItem = (subid, cartItems) => {
    cartItems = cartItems.filter((item) => item.subid !== subid)
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
    return cartItems 
}


const cartService = {
    addItem,
    changeQty,
    removeItem,
}

export default cartService