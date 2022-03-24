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

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        reset: (state) => initialState
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

            /*
            //Check if the item is already in the Cart
            const item = action.payload
            const existItem = state.cartItems.find(x => x.product === item.product)

            if(existItem){
                return {
                    ...state,
                    cartItems: state.cartItems.map(x => x.product === existItem.product ? item : x)
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item]
                }
            }
            */
            
        })
        .addCase(addItem.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset} = cartSlice.actions
export default cartSlice.reducer