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
    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userData.token}`
        }
    }

    const {data} = await axios.get(API_URL, userData, config)
    console.log(data)

    if(data){
        localStorage.setItem('user', JSON.stringify(data))
    }

    return data
}

const userService = {
    register,
    login,
    logout
}

export default userService