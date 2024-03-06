import { configureStore } from "@reduxjs/toolkit"
import { productReducer } from "./redux/productReducer"
import { authReducer } from "./redux/authReducer"
import { cartActions, cartReducer } from "./redux/cartReducer"
import { orderReducer } from "./redux/orderReducer"

export const store = configureStore({
    reducer: {
        productReducer,
        authReducer,
        cartReducer,
        orderReducer,

    },
   
     middleware : (getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck : false
     })

})






