import axios from 'axios'

 const createOrder = async(order, user) => {
    const {token} = user

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const {data} = axios.post('/api/orders', order, config)
    return data
 }

const orderService = {
    createOrder
}

export default orderService