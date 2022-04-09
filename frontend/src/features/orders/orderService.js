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
    console.log('Get Order Data')
    console.log(data)
    return data
 }

 //Pay Order
 const payOrder = async(orderId, paymentResult, token) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const {data} = await axios.put(`/api/orders/${orderId}/pay`, paymentResult, config)
    return data
 }

const orderService = {
    createOrder,
    getOrder,
    payOrder
}

export default orderService