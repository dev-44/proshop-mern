import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import shippingService from './shippingService'

const initialState = {
    addresses: [],
    isSuccess: false,
    isLoading: false,
    isError: false,
    message: ''
}

//Get All Shipping Addresses from a User
export const getShippingAddresses = createAsyncThunk('shipping/getAll', async(_,thunkAPI) => {
    
})

export const shippingSlice = createSlice({
    name: 'shipping',
    initialState,
    reducers:{
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        
    }
})

export const {reset} = shippingSlice.actions
export default shippingSlice.reducer