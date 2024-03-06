import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import db from "../firebaseinit";
import { getDocs, collection } from "firebase/firestore";

//Action -> Get Products
export const getProductsAsyncThunk = createAsyncThunk("product/fetchSuccess", async (args, thunkAPI) => {

    try {
        const temp = [];

        const querySnapshot = await getDocs(collection(db, "products"));
        querySnapshot.forEach((doc) => {
            temp.push({
                id: doc.id,
                ...doc.data(),
            });
        });
        thunkAPI.dispatch(productActions.fetchSuccess(temp))
    }
    catch (error) {
        thunkAPI.dispatch(productActions.fetchError("Error in Retrieving Products From Server"))
    }

})

const initialState = {

    products: [],
    loading: false,
    error: null
}


const productSlice = createSlice({

    name: "product",
    initialState,
    reducers: {

        fetchStart: (state) => {
            state.loading = true;
        },

        fetchSuccess: (state, action) => {

            state.loading = false;
            state.products = action.payload;

        },

        fetchError: (state, action) => {
            state.loading = false;
            state.error = action.payload
        }



    }

})

export const productReducer = productSlice.reducer;

export const productActions = productSlice.actions;

export const productSelector = (state) => state.productReducer
