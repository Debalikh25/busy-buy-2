import { useEffect, useState } from "react";
import { failureMessage, successMessage } from "./toastAlert";
import { useNavigate } from "react-router-dom";
import { cartActions, getCartItemsForUserAsync, incrementProductQtyInCart, decrementProductQtyInCart, removeProductFromCartAsync, cartSelector } from "../redux/cartReducer";
import { createOrderAsync } from "../redux/orderReducer";
import { authSelector } from "../redux/authReducer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import Spinner from "./Spinner";


const Cart = () => {
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  const { loading, cart, error } = useSelector(cartSelector);
  const {user}  = useSelector(authSelector);
  const dispatch = useDispatch();


  useEffect(() => {
    if (cart.length == 0) {
      dispatch(cartActions.fetchCartStart())
      dispatch(getCartItemsForUserAsync({user }))
    }
  }, []);

  useEffect(() => {
    if (cart.length == 0) {
      return;
    }

    calculateTotal();
  }, [total, cart]);

  // Funtion -> To calculate Cart price.
  const calculateTotal = () => {
    let total = 0;

    cart.forEach((p) => {
      let sum = p.price * p.qty;
      total += sum;
    });

    setTotal(total);
  };



  const orderItems = async () => {
    try {
      dispatch(createOrderAsync({
        cart,
        total,
        user
      }))
      setTotal(0)
    } catch (err) {
      console.log(err);
    }
  };


  //increments the quantity of product
  const incrementQty = async (product) => {
    try {

        
      
      dispatch(incrementProductQtyInCart({
        cart,
        calculateTotal,
        product,
        user
      }))
    } catch (error) {
      console.log(error.message);
    }
  };
  //decrements the quantity of product or removes it if quantity is 1
  const decrementQty = async (product, index) => {
    try {
      dispatch(decrementProductQtyInCart({
        cart, product, calculateTotal, index,user
      }))

    } catch (error) {
      console.log(error.message);
    }
  };

  //Removes a product from cart
  const removeProduct = async (product) => {
    try {

      const filtered = cart.filter((p) => product.id !== p.id);

      dispatch(removeProductFromCartAsync({ filtered , user }));


      setTotal(total - (product.price * product.qty));
      successMessage("Product removed from cart");
    } catch (error) {
      failureMessage("Unable to Remove Product From DB");
      console.log(error.message);
    }
  };

  return (
    <>
      <div className="container mt-2">
        <Spinner loader={loading} />

        {loading == false ? (
          <div className="col-md-3">
            {total > 0 && cart.length != 0 ? (
              <>
                <h3>Total :₹ {total}</h3>
                <button onClick={orderItems} className="btn btn-info">
                  Order
                </button>
              </>
            ) : (
              <h4 className="mt-4">Cart is empty</h4>
            )}
          </div>
        ) : undefined}

        <div className="col-md-9">
          {cart.length > 0 ? (
            <div className="container">
              {cart.map((p, index) => {
                return (
                  <div key={index} className="row cart-item">
                    <div className="col-md-3">
                      <p>{p.name}</p>
                    </div>

                    <div className="col-md-2">
                      <p>
                        <strong>X {p.qty}</strong>
                      </p>
                    </div>

                    <div className="col-md-2">
                      <p>₹ {p.price}</p>
                    </div>

                    <div className="col-md-2">
                      <span>
                        <button
                          onClick={() => incrementQty(p)}
                          className="btn btn-success"
                        >
                          +
                        </button>
                        <button
                          onClick={() => decrementQty(p, index)}
                          className="btn btn-danger ml-2"
                        >
                          -
                        </button>
                      </span>
                    </div>

                    <div className="col-md-3">
                      <span>
                        <button
                          onClick={() => removeProduct(p)}
                          className="btn btn-warning"
                        >
                          Remove
                        </button>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <h2></h2>
          )}
        </div>
      </div>
    </>
  );
};

export default Cart;
