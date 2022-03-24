import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import cartService from './cartService'

//Get user from localStorage
const cartItemsLS = JSON.parse(localStorage.getItem('cartItems'))

const initialState = {
    cartItems: cartItemsLS ? cartItemsLS : [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: ''
}

//Add an item to the cart
export const addItem = createAsyncThunk('cart/item/add', async({id, qty}, thunkAPI) => {
    try {
        console.log('This is addItem from cartSlice')
        console.log(`Id: ${id} and Qty: ${qty}`)
        const cartItems = thunkAPI.getState().cart.cartItems
        console.log(cartItems)
        return await cartService.addItem(id, qty, cartItems)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Change Qty of Item in the Cart
export const changeQty = createAsyncThunk('cart/item/changeQty', async({id, qty}, thunkAPI) => {
    try {
        
        let cartItems = thunkAPI.getState().cart.cartItems
        return await cartService.changeQty(id, qty, cartItems)

    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        reset: (state) => initialState,
    },
    extraReducers: (builder) => {
        builder
        .addCase(addItem.pending, (state) => {
            state.isLoading = true
        })
        .addCase(addItem.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.cartItems = action.payload
            
        })
        .addCase(addItem.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(changeQty.pending, (state) => {
            state.isLoading = true
        })
        .addCase(changeQty.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.cartItems = action.payload
        })
        .addCase(changeQty.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset} = cartSlice.actions
export default cartSlice.reducer