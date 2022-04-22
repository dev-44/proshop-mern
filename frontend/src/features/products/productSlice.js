import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import productService from './productService'

//Get products from localStorage
const productsLS = JSON.parse(localStorage.getItem('products'))

const initialState = {
    products: productsLS ? productsLS : [],
    product: {},
    topRated: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    isLoaded: false,
    isLoadingCarousel: false,
    message: '',
    isDeleted: false,
    isCreated: false,
    isUpdated: false,
    isImage: false,
    image: false,
    isLoadingReview: false,
    reviewCreated: false,
    pages: 0,
    page: 0,
    pageSize: 0
}

//Get All Products
export const getProducts = createAsyncThunk('products/get-all', async(params,thunkAPI) => {
    try {
        const {keyword, pageNumber} = params
        return await productService.getProducts(keyword, pageNumber)
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

//Create Product
export const createProduct = createAsyncThunk('product/create', async(productData, thunkAPI) => {
    try {
        console.log(productData)
        const token = thunkAPI.getState().user.user.token
        return await productService.createProduct(productData, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Update Product
//Falta actualizar la imagen
export const updateProduct = createAsyncThunk('product/update', async(productData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token
        return await productService.updateProduct(productData, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Create a new Review
export const createProductReview = createAsyncThunk('product/review/create', async(reviewData, thunkAPI) => {
    try {
        const {id, rating, comment} = reviewData
        const newReview = {rating, comment}
        const token = thunkAPI.getState().user.user.token
        await productService.createProductReview(id, newReview, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Get Top Products for the Carousel
export const getTopProducts = createAsyncThunk('products/top', async(_, thunkAPI) => {
    try {
        return await productService.getTopProducts()
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

/*
//Insert Image
export const createImage = createAsyncThunk('product/image/create', async(image, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token
        return await productService.createImage(image, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})
*/


export const productSlice = createSlice({
    name: 'product',
    initialState,
    reducers: {
        reset: (state) => initialState,
        resetDeleted: (state) => {state.isDeleted = false},
        resetError: (state) => {
            state.isError = false
            state.message = ''
        },
        resetCrud: (state) => {
            state.isCreated = false
            state.isUpdated = false
            state.isDeleted = false
            state.isLoaded = false
        },
        resetMessage: (state) => {
            state.message = ''
            state.isError = false
            state.isSuccess = false
            state.isUpdated = false
            state.isCreated = false
            state.isImage = false
            state.reviewCreated = false
        },
        resetReviewCreated: (state) => {state.reviewCreated = false},
    },
    extraReducers: (builder) => {
        builder
            .addCase(getProducts.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getProducts.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.products = action.payload.products
                state.pages = action.payload.pages
                state.page = action.payload.page
                state.pageSize = action.payload.pageSize
                state.isLoaded = true
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
                localStorage.setItem('products', JSON.stringify(state.products))
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(createProduct.pending, (state) => {
                state.isLoading = true
            })
            .addCase(createProduct.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isCreated = true
                state.products.push(action.payload)
                localStorage.setItem('products', JSON.stringify(state.products))
            })
            .addCase(createProduct.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(updateProduct.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.isUpdated = true
                state.products = action.payload
                localStorage.setItem('products', JSON.stringify(state.products))
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(createProductReview.pending, (state) => {
                state.isLoadingReview = true
            })
            .addCase(createProductReview.fulfilled, (state) => {
                state.isLoadingReview = false
                state.isSuccess = true
                state.reviewCreated = true
            })
            .addCase(createProductReview.rejected, (state, action) => {
                state.isLoadingReview = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(getTopProducts.pending, (state) => {
                state.isLoadingCarousel = true
            })
            .addCase(getTopProducts.fulfilled, (state, action) => {
                state.isLoadingCarousel = false
                state.isSuccess = true
                state.topRated = action.payload
            })
            .addCase(getTopProducts.rejected, (state, action) => {
                state.isLoadingCarousel = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {reset, resetDeleted, resetMessage, resetReviewCreated, resetError, resetCrud} = productSlice.actions
export default productSlice.reducer