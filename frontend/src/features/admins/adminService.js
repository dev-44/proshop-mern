import axios from "axios"

//Get All Users
const getUsers = async(token) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const {data} = await axios.get('/api/users', config)
    return data
}

//Delete User
const deleteUser = async(id, token) => {

    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    console.log('This is adminService')
    const {data} = await axios.delete(`/api/users/${id}`, config)
    return data
}

//Make user an ADMIN
const makeAdmin = async(id, token) => {

    console.log(token)
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const {data} = await axios.put(`/api/users/${id}`, {}, config)
    return data
}

//Get All Orders
const getOrders = async(token) => {

    console.log(token)
    const config = {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }

    const {data} = await axios.get(`/api/orders`, config)
    return data
}



const adminService = {
    getUsers,
    deleteUser,
    makeAdmin,
    getOrders
}

export default adminService