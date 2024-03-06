import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getDocs, addDoc, collection, query, where, doc, updateDoc } from "firebase/firestore";
import { useSelector } from "react-redux";
import { cartActions } from "./cartReducer";
import { UseDispatch } from "react-redux";
import { authSelector } from "./authReducer";
import db from "../firebaseinit";

const initialState = {

    loading: false,
    orders: [],
    error: null
}




//Action -> Get Orders From DB
export const getOrdersAsync = createAsyncThunk("order/fetchOrdersSuccess", async (data, thunkAPI) => {
    try {
         const {user} = data;
        const orderedItemsRef = collection(db, "orders");
        const q = query(
            orderedItemsRef,
            where("userEmail", "==", user)
        );
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {

            thunkAPI.dispatch(orderActions.fetchOrdersSuccess([]))

            return;
        }
        const temp = []
        querySnapshot.forEach((doc) => {
            temp.push({
                orderId: doc.id,
                ...doc.data(),
            });
        });

        thunkAPI.dispatch(orderActions.fetchOrdersSuccess(temp))
    }
    catch (error) {
        thunkAPI.dispatch(orderActions.error())
        console.log(error.message)
    }
})


//Action -> Create a new Order
export const createOrderAsync = createAsyncThunk("order/addOrder", async (data, thunkAPI) => {
    try {

       
        const { total, cart , user} = data;

        const now = new Date();
        const ref = await addDoc(collection(db, "orders"), {
            //adding the doc to the db also and creating cart
            date: `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`,
            total,
            products: cart,
            userEmail: user,
        });

        const cartItemsRef = collection(db, "cart");
        const q = query(
            cartItemsRef,
            where("userEmail", "==", user)
        );
        const querySnapshot = await getDocs(q);
        let id = "";
        querySnapshot.forEach((d) => {
            id = d.id;
        });

        const productRef = doc(db, "cart", id);
        await updateDoc(productRef, {
            items: [],
        });

        thunkAPI.dispatch(cartActions.fetchCartItems([]))

    }
    catch (error) {
        thunkAPI.dispatch(orderActions.error())
        console.log(error.message)
    }
})



const orderSlice = createSlice({

    name: "order",
    initialState,
    reducers: {

        fetchOrdersStart: (state) => {
            state.loading = true;
        },

        fetchOrdersSuccess: (state, action) => {
            state.loading = false;
            state.orders = action.payload;
        },


        addOrder: (state, action) => {
            state.orders = [...state.orders, action.payload]
        },

        error: (state) => {
            state.loading = false;
            state.error = "Something Went Wrong with Orders"
        }

    }

})


export const orderReducer = orderSlice.reducer;

export const orderActions = orderSlice.actions;

export const orderSelector = (state) => state.orderReducer;