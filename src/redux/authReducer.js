import { createSlice } from "@reduxjs/toolkit";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { failureMessage, successMessage } from "../components/toastAlert";

const initialState = {

    user: null,
    loggedIn: false,
    loading: false,
    error: null,
    message: null

}

const auth = getAuth();


//Action -> Register User
export const createUserAsyncThunk = createAsyncThunk("auth/register", async (data, thunkAPI) => {
    try {
        const { email, password } = data;
        await createUserWithEmailAndPassword(auth, email, password)
        thunkAPI.dispatch(authActions.register(email))
    }
    catch (error) {
        thunkAPI.dispatch(authActions.error())
    }
})


//Action -> Login User
export const loginUserAsyncThunk = createAsyncThunk("auth/login", async (data, thunkAPI) => {

    try {

        const loginUser = await signInWithEmailAndPassword(
            auth,
            data.email,
            data.password
        );

        localStorage.setItem("user", loginUser.user.email)

        successMessage("Logged In Successfull")
       
        thunkAPI.dispatch(authActions.login(loginUser.user.email.toString()))

        

    }
    catch (error) {
        thunkAPI.dispatch(authActions.error())
         failureMessage(error.message)
    }

})


const authSlice = createSlice({
    name: "auth",
    initialState: initialState,
    reducers: {

        authStart: (state) => {
            state.loading = true;
        },

        register: (state) => {
            state.loading = false
            state.message = "User Registered Successfully"
        },

        login: (state, action) => {
            state.loading = false;
            state.loggedIn = true;
            state.user = action.payload
            state.message = "User Sign In Successfull"
            
        },


        error: (state) => {
            state.loading = false;
            state.error = "Something went wrong"
        }
        ,

        logout: (state) => {
            state.loading = false;
            state.user = null
            state.loggedIn = false
            state.message = "User Logged Out !!"
        }



    }
})

export const authReducer = authSlice.reducer;

export const authActions = authSlice.actions;

export const authSelector = (state) => state.authReducer;