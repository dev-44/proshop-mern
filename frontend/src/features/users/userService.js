import axios from "axios"

const API_URL = 'api/users'

//Register User
export const register = async(userData) => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const {data} = await axios.post(API_URL, userData, config)
    console.log(data)

    if(data){
        localStorage.setItem('user', JSON.stringify(data))
    }

    return data
}


//Login User
export const login = async(userData) => {

    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const {data} = await axios.post(API_URL + '/login', userData, config)
    console.log(data)

    if(data){
        localStorage.setItem('user', JSON.stringify(data))
    }

    return data
}

//Logout User
const logout = () => {
    localStorage.removeItem('user')
}

//Update User
export const updateUser = async(userData) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData.token}`
        }
    }

    const {data} = await axios.put(API_URL + `/profile/${userData._id}`, userData, config)

    console.log(data)
 
    if(data){
        localStorage.setItem('user', JSON.stringify(data))
    }

    return data
}

//Check Current Password
const checkPassword = async(userData) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData.token}`
        }
    }

    const { email, oldPassword } = userData
    const userDataToSend = {
        email,
        password: oldPassword
    }

    const {data} = await axios.post(API_URL + '/check-password', userDataToSend, config)
    return data
}

//Add a Shipping Address
const addShippingAddress = async (newAddress, user) => {

    const {_id, token} = user

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const {data} = await axios.post(`api/users/profile/${_id}/shipping`, newAddress, config)
    localStorage.setItem('user', JSON.stringify(data))
    return data
}

//Edit Shipping Address
const editShippingAddress = async(address, user) => {

    const {_id, token} = user

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const {data} = await axios.put(`api/users/profile/${_id}/shipping`, address, config)
    localStorage.setItem('user', JSON.stringify(data))
    return data
}

//Delete Shipping Address
const deleteShippingAddress = async(idAddress, user) => {

    const {_id, token} = user

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const {data} = await axios.delete(`api/users/profile/${_id}/shipping/${idAddress}`, config)
    console.log('Data returned from the backend')
    console.log(data)
    localStorage.setItem('user', JSON.stringify(data))
    return data
}

//Get user Orders
const getUserOrders = async(token) => {

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const {data} = await axios.get('api/orders/myorders', config)
    return data
}


const userService = {
    register,
    login,
    logout,
    updateUser,
    checkPassword,
    addShippingAddress,
    editShippingAddress,
    deleteShippingAddress,
    getUserOrders
}

export default userService