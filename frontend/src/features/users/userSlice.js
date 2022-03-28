import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from './userService'

//Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''

}

//Login User
export const login = createAsyncThunk('users/login', async(userData, thunkAPI) => {
    try {
        console.log('This is userSlice')
        console.log(userData)
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

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) =>{
        builder
            .addCase(login.pending, (state) => {
                state.isLoading = true
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.user = null
            })
    }
})

export const {reset} = userSlice.actions
export default userSlice.reducer