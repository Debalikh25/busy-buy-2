import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import db from "../firebaseinit";
import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    updateDoc,
    doc,
} from "firebase/firestore";





const initialState = {
    cart: [],
    loading: false,
    error: null,

}


//Function -> Get Reference Of Product using logged in user from DB
const getProductRefFromDB = async (user) => {
    try {
        
        const cartItemsRef = collection(db, "cart");
        const q = query(
            cartItemsRef,
            where("userEmail", "==", user)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return -1;
        }
        let id = "";
        querySnapshot.forEach((d) => {
            id = d.id;
        });

        const productRef = doc(db, "cart", id);
        return productRef;
    } catch (error) {
        console.log(error.message);
    }
};

//Action -> Fetch User's cart items from DB and update state.
export const getCartItemsForUserAsync = createAsyncThunk("cart/fetchCartItems", async (data, thunkAPI) => {
    try {
        const { user } = data
        
            //write query here to get user's cart items
            const cartItemsRef = collection(db, "cart");
            const q = query(
                cartItemsRef,
                where("userEmail", "==", user)
            );
            const querySnapshot = await getDocs(q);
            if (querySnapshot.size == 0) {
                thunkAPI.dispatch(cartActions.fetchCartItems([]))
            } else {
                querySnapshot.forEach((d) => {
                    thunkAPI.dispatch(cartActions.fetchCartItems(d.data().items))
                });
            }
        

    }
    catch (error) {
        thunkAPI.dispatch(cartActions.error())
        console.log(error.message);
    }
})

//Action -> Remove Product From Cart.
export const removeProductFromCartAsync = createAsyncThunk("cart/removeFromCart", async (data, thunkAPI) => {
    try {

        const { filtered  , user} = data
        const productRef = await getProductRefFromDB(user);
        await updateDoc(productRef, {
            items: filtered,
        });
        thunkAPI.dispatch(cartActions.removeFromCart(filtered))
    }
    catch (error) {
        thunkAPI.dispatch(cartActions.error())
        console.log(error.message);
    }
})

//Action -> Add Product to Cart
export const addProductToCartAsync = createAsyncThunk("cart/addToCart", async (data, thunkAPI) => {
    try {
      
        const { product, cart , user } = data;
        // finding cartId of user
        let cartId = undefined;
        const cartItemsRef = collection(db, "cart");
        const q = query(
            cartItemsRef,
            where("userEmail", "==", user)
        );
        const querySnapshot = await getDocs(q);

        //cart not created yet for the user(scenario 1)

        if (cart.length == 0 && querySnapshot.empty) {


            await addDoc(collection(db, "cart"), {
                //adding the doc to the db creating cart
                userEmail: user,
                items: [
                    {
                        ...product,
                        qty: 1,
                    },
                ],
            });

            thunkAPI.dispatch(cartActions.addToCart({
                ...product,
                qty: 1
            }))

            return;
        }

        //cart exist both in local and database but is empty(scenario 2)
        querySnapshot.forEach((d) => {
            cartId = d.id;
        });

        const productRef = doc(db, "cart", cartId);
        if (cart.length == 0 && cartId != undefined) {

            await updateDoc(productRef, {
                items: [{
                    ...product,
                    qty: 1
                }],
            });

            thunkAPI.dispatch(cartActions.addToCart({
                ...product,
                qty: 1
            }))

            return;
        }

        //cart contain the same product both in local and database(scenario 3)
        const index = cart.findIndex((p) => p.id == product.id);
        if (index != -1) {
              
             thunkAPI.dispatch(cartActions.addToCart({
                product , 
                productRef
             }))

           
            return;
        }


        await updateDoc(productRef, {
            items: [...cart, { ...product, qty: 1 }],
        });

        thunkAPI.dispatch(cartActions.addToCart({
            ...product,
            qty: 1
        }))

        return;


    }
    catch (error) {
        thunkAPI.dispatch(cartActions.error())
        console.log(error);
    }
})

//Action -> Increment Product Quantity in Cart
export const incrementProductQtyInCart = createAsyncThunk("cart/incrementProductQty", async (data, thunkAPI) => {
    try {
      
       
        const { cart, calculateTotal , product , user } = data;
           
         

        const productRef = await getProductRefFromDB(user);

       
         thunkAPI.dispatch(cartActions.incrementProductQty({product  , productRef}));
         
       
        calculateTotal();



    }
    catch (error) {
        thunkAPI.dispatch(cartActions.error())
        console.log(error.message);
    }
})

//Action -> Decrement Product Qty in Cart or remove it if exist only 1 product
export const decrementProductQtyInCart = createAsyncThunk("cart/decrementProductQty", async (data, thunkAPI) => {
    try {
       
       
         const {product , cart , calculateTotal , index , user} = data;

        if (product.qty == 1) {
            
            const filtered = cart.filter((p) => product.id !== p.id);
            
            thunkAPI.dispatch(removeProductFromCartAsync({filtered , user}));
            return ;
          }

          const productRef = await getProductRefFromDB(user);
        
           
          thunkAPI.dispatch(cartActions.decrementProductQty({product , productRef}));
           
          calculateTotal();
      
    }
    catch (error) {
        thunkAPI.dispatch(cartActions.error())
        console.log(error.message);
    }
})





const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {

        fetchCartStart: (state, action) => {
            state.loading = true;
        },

        fetchCartItems: (state, action) => {
            state.cart = action.payload;
            state.loading = false;
        },


        addToCart: (state, action) => {
              
              let found  = false;
             state.cart.forEach(p=>{
                if(p.id == action.payload.id){
                    found = true;
                    ++ p.qty;
                }
             })

             if(!found){
                state.cart = [...state.cart, action.payload]
             }

              updateDoc(action.payload.productRef, {
                items: state.cart
            });

           
        },

        removeFromCart: (state, action) => {
            state.cart = action.payload;
        },

        incrementProductQty:  (state, action) => {
            
                state.cart.forEach(p=>{
                    if(p.id == action.payload.product.id){
                         ++ p.qty ;
                    }
                })

                updateDoc(action.payload.productRef, {
                    items: state.cart,
                  });
        },

        decrementProductQty:  (state, action) => {

            state.cart.forEach(p=>{
                if(p.id == action.payload.product.id){
                     -- p.qty ;
                }
            })

          updateDoc(action.payload.productRef, {
                items: state.cart,
              });
        },

        error: (state, action) => {
            state.loading = false;
            state.error = "Something went wrong"
        }

    }
})

export const cartReducer = cartSlice.reducer;
export const cartActions = cartSlice.actions;
export const cartSelector = (state) => state.cartReducer;

