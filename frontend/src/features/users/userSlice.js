import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from './userService'

//Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    isMatch: false,
    isLoggedIn: false,
    message: ''
}

//Register User
export const register = createAsyncThunk('users/register', async(userData, thunkAPI) => {
    try {
        return await userService.register(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
}) 

//Login User
export const login = createAsyncThunk('users/login', async(userData, thunkAPI) => {
    try {
        return await userService.login(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
}) 

//Logout User
export const logout = createAsyncThunk('users/logout', async() => {
    userService.logout()
})

//Update User
export const updateUser = createAsyncThunk('users/update', async(userData, thunkAPI) => {
    try {
        return await userService.updateUser(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Clear Error Message
export const clearMsg = createAsyncThunk('users/clear-message', async() => {
    return
})

//Check Current Password
export const checkPassword = createAsyncThunk('users/check-password', async(userData, thunkAPI) => {
    try {
        let {oldPassword} = userData
        let currUser = thunkAPI.getState().user.user
        let {email, token} = currUser

        const userDataToSend ={
            email, token, oldPassword
        }

        console.log(userDataToSend)
        return await userService.checkPassword(userDataToSend)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetUser: (state) => initialState
    },
    extraReducers: (builder) =>{
        builder
            .addCase(register.pending, (state) => {
                state.isLoading = true
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
                state.user = null
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
                state.isLoggedIn = true
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(updateUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.user = null
            })
            .addCase(clearMsg.fulfilled, (state) => {
                state.message = ''
            })
            .addCase(checkPassword.pending, (state) => {
                state.isLoading = true
            })
            .addCase(checkPassword.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isMatch = true
            })
            .addCase(checkPassword.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {resetUser} = userSlice.actions
export default userSlice.reducer