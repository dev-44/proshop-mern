import axios from 'axios'

//Create an Order
 const createOrder = async(order, user) => {
    const {token} = user

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const {data} = await axios.post('/api/orders', order, config)
    console.log(data)
    return data
 }

 //Get Order Details
 const getOrder = async(id, token) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const {data} = await axios.get(`/api/orders/${id}`, config)
    return data
 }

const orderService = {
    createOrder,
    getOrder
}

export default orderService