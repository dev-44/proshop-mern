import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import cartService from './cartService'

//Get data from localStorage
const cartLS = JSON.parse(localStorage.getItem('cartItems'))
const addressLS = JSON.parse(localStorage.getItem('address'))
const payMethodLS = JSON.parse(localStorage.getItem('paymentMethod'))

const initialState = {
    cart: cartLS ? cartLS : [],
    shippingAddress: addressLS ? addressLS : {},
    itemsPrice: '',
    paymentMethod: payMethodLS ? payMethodLS : '',
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
}

//Add an item to the cart
export const addItem = createAsyncThunk('cart/item/add', async(data, thunkAPI) => {
    try {
        console.log('This is addItem from cartSlice')
        const {productData, qty} = data
        console.log(`Id: ${productData.id}, subid: ${productData.subid} and Qty: ${qty}`)
        const cart = thunkAPI.getState().cart.cart
        console.log(cart)
        return await cartService.addItem(productData, qty, cart)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Change Qty of Item in the Cart
export const changeQty = createAsyncThunk('cart/item/changeQty', async({subid, qty}, thunkAPI) => {
    try {
        let cart = thunkAPI.getState().cart.cart
        return await cartService.changeQty(subid, qty, cart)

    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})


//Remove Item from the Cart
export const removeItem = createAsyncThunk('/cart/item/remove', async(subid,thunkAPI) => {
    try {
        let cart = thunkAPI.getState().cart.cart
        return await cartService.removeItem(subid, cart)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Add Shipping Address
export const addShippingAddressCart = createAsyncThunk('/cart/shippingAddress/add', async(shippingAddressData, thunkAPI) => {
    try {
        localStorage.setItem('address', JSON.stringify(shippingAddressData))
        return shippingAddressData
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Add Payment Method
export const savePaymentMethod = createAsyncThunk('cart/paymentMethod/save', async(paymentMethod, thunkAPI) => {
    try {
        localStorage.setItem('paymentMethod', JSON.stringify(paymentMethod))
        return paymentMethod
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
        clearCart: (state) => {
            localStorage.removeItem('cartItems')
            state.cart = []
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(addItem.pending, (state) => {
            state.isLoading = true
        })
        .addCase(addItem.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.cart = action.payload
            
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
            state.cart = action.payload
        })
        .addCase(changeQty.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(removeItem.pending, (state) => {
            state.isLoading = true
        })
        .addCase(removeItem.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.cart = action.payload
        })
        .addCase(removeItem.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(addShippingAddressCart.pending, (state) => {
            state.isLoading = true
        })
        .addCase(addShippingAddressCart.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.shippingAddress = action.payload
            
        })
        .addCase(addShippingAddressCart.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
        .addCase(savePaymentMethod.pending, (state) => {
            state.isLoading = true
        })
        .addCase(savePaymentMethod.fulfilled, (state, action) => {
            state.isLoading = false
            state.isSuccess = true
            state.paymentMethod = action.payload
            
        })
        .addCase(savePaymentMethod.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload
        })
    }
})

export const {reset, clearCart} = cartSlice.actions
export default cartSlice.reducer