import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import adminService from './adminService'

const initialState = {
    users: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: ''
}

//Get all users
export const getUsers = createAsyncThunk('admin/user/getAll', async(_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token
        return await adminService.getUsers(token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Delete user
export const deleteUser = createAsyncThunk('admin/user/delete', async(id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token
        return await adminService.deleteUser(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

//Make user an Admin
export const makeAdmin = createAsyncThunk('admin/user/update', async(id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().user.user.token
        console.log(token)
        return await adminService.makeAdmin(id, token)
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

export const adminSlice = createSlice({
    name: 'admin',
    initialState,
    reducers: {
        reset: (state) => initialState
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUsers.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.users = action.payload
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(deleteUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.users = action.payload
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
            .addCase(makeAdmin.pending, (state) => {
                state.isLoading = true
            })
            .addCase(makeAdmin.fulfilled, (state, action) => {
                state.isLoading = false
                state.isSuccess = true
                state.users = action.payload
            })
            .addCase(makeAdmin.rejected, (state, action) => {
                state.isLoading = false
                state.isError = true
                state.message = action.payload
            })
    }
})

export const {reset} = adminSlice.actions
export default adminSlice.reducer