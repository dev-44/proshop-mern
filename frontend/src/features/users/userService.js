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

    console.log('This is userService')

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
    console.log('Bandera userService')
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

//Edit Shipping Address
const editShippingAddressUser = async(address, user) => {
    console.log('This is UserService')
    const {_id, token} = user

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        }
    }

    const {data} = await axios.put(`api/users/profile/${_id}/shipping`, address, config)
    return data
}


const userService = {
    register,
    login,
    logout,
    updateUser,
    checkPassword,
    editShippingAddressUser
}

export default userService