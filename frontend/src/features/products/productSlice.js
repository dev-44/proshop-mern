import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import productService from './productService'

const initialState = {
    products: [],
    product: {
        reviews: []
    },
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
    isDeleted: false
}

//Get All Products
export const getProducts = createAsyncThunk('products/getAll', async(_,thunkAPI) => {
    try {
        return await productService.getProducts()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Get a Single Product
export const getProductDetails = createAsyncThunk('product/get', async(id, thunkAPI) => {
    try {
        return await productService.getProductDetails(id)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Delete product
export const deleteProduct = createAsyncThunk('product/delete', async(id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token
        return await productService.deleteProduct(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        reset: (state) => initialState,
        resetDeleted: (state) => {state.isDeleted = false},
        resetMessage: (state) => {
            state.message = ''
            state.isError = false
            state.isSuccess = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.products = action.payload
            })
            .addCase(getProducts.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getProductDetails.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getProductDetails.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.product = action.payload
            })
            .addCase(getProductDetails.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteProduct.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isDeleted = true
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {reset, resetDeleted, resetMessage} = productSlice.actions
export default productSlice.reducer