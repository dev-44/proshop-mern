import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import orderService from './orderService'

const initialState = {
    order: {},
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
}

//Create an Order
export const createOrder = createAsyncThunk('orders/create', async(order, thunkAPI) => {
    try {
        const user = thunkAPI.getState().user.user
        return await orderService.createOrder(order, user)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)  
    }
})

//Get Order Details
export const getOrder = createAsyncThunk('orders/getSingleOrder', async(id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token
        return await orderService.getOrder(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message) 
    }
})

export const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
        .addCase(createOrder.pending, (state) => {
            state.isLoading = true
        })
        .addCase(createOrder.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.order = action.payload
            
        })
        .addCase(createOrder.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(getOrder.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getOrder.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.order = action.payload
            
        })
        .addCase(getOrder.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset} = orderSlice.actions
export default orderSlice.reducer