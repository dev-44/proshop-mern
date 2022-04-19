import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import userService from './userService'

//Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
    user: user ? user : null,
    orders: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    isMatch: false,
    isLoggedSuccess: false,
    isUpdated: false,
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
        console.log(userData)
        return await userService.updateUser(userData)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


//Check Current Password
export const checkPassword = createAsyncThunk('users/checkPassword', async(userData, thunkAPI) => {
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

//Add a Shipping Address
export const addShippingAddress = createAsyncThunk('users/shippingAddress/add', async(newAddress, thunkAPI) => {
    try {
        let user = thunkAPI.getState().user.user
        return await userService.addShippingAddress(newAddress, user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Edit Shipping Address
export const editShippingAddress = createAsyncThunk('users/shippingAddress/edit', async(editedAddress, thunkAPI) => {
    try {
        const user = thunkAPI.getState().user.user
        return await userService.editShippingAddress(editedAddress, user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)      
    }
})

//Delete Shipping Address
export const deleteShippingAddress = createAsyncThunk('users/shippingAddress/delete', async(idAddress, thunkAPI) => {
    try {
        const user = thunkAPI.getState().user.user
        return await userService.deleteShippingAddress(idAddress, user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)      
    }
})

//Get User Orders
export const getUserOrders = createAsyncThunk('users/orders/getAll', async(_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token
        return await userService.getUserOrders(token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)      
    }
})

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        reset: (state) => initialState,
        resetError: (state) => {
            state.message = ''
            state.isError = false
            state.isUpdated = false
    },
        resetLoggedSuccess: (state) => {state.isLoggedSuccess = false},
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
                state.isLoggedSuccess = true
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
                state.isUpdated = true
                state.user = action.payload
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(logout.fulfilled, (state, action) => {
                state.user = null
                state.isError = false
                state.isSuccess = false
                state.isLoading = false
                state.isMatch = false
                state.isLoggedSuccess = false
                state.message = null
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
            .addCase(addShippingAddress.pending, (state) => {
                state.isLoading = true
            })
            .addCase(addShippingAddress.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
                //state.user.shippingAddresses.push(action.payload)
            })
            .addCase(addShippingAddress.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(editShippingAddress.pending, (state) => {
                state.isLoading = true
            })
            .addCase(editShippingAddress.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(editShippingAddress.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteShippingAddress.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteShippingAddress.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.user = action.payload
            })
            .addCase(deleteShippingAddress.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getUserOrders.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getUserOrders.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.orders = action.payload
            })
            .addCase(getUserOrders.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {reset, resetError, resetLoggedSuccess} = userSlice.actions
export default userSlice.reducer