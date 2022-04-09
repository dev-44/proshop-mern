import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import orderService from './orderService'

const initialState = {
    order: {},
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
    isPaid: false,
    isLoadingPay: false,
    isPlaced: false
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

//Pay Order
export const payOrder = createAsyncThunk('orders/pay', async(paymentResult, thunkAPI) => {
    try {
        const orderId = thunkAPI.getState().order.order._id
        const token = thunkAPI.getState().user.user.token
        return await orderService.payOrder(orderId, paymentResult, token)
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
        resetPay: (state) => {
            state.isLoadingPay = false
            state.isPaid = false
        },
        resetIsPlaced: (state) => {
            state.isPlaced = false
        }
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
            state.isPlaced = true
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
        .addCase(payOrder.pending, (state) => {
            state.isLoadingPay = true
        })
        .addCase(payOrder.fulfilled, (state, action) => {
            state.isLoadingPay = false
            state.isSuccess = true
            state.isPaid = true
            state.order = action.payload
            
        })
        .addCase(payOrder.rejected, (state, action) => {
            state.isLoadingPay = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset, resetPay, resetIsPlaced} = orderSlice.actions
export default orderSlice.reducer