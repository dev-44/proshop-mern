import axios from "axios"

const API_URL = 'api/users'

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

const userService = {
    login,
    logout
}

export default userService