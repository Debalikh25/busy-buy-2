import { useEffect, useState } from "react";
import { orderActions  , orderSelector  , getOrdersAsync } from "../redux/orderReducer";
import { useDispatch } from "react-redux";
import Spinner from "./Spinner";
import { useSelector } from "react-redux";
import { authSelector } from "../redux/authReducer";

const Orders = () => {

    const {loading , orders ,error} = useSelector(orderSelector);
    const {user} = useSelector(authSelector)
    const dispatch = useDispatch();

  useEffect(() => {
      
       if(orders.length == 0){
        dispatch(orderActions.fetchOrdersStart());
        dispatch(getOrdersAsync({user}))
       }
  }, []);



  return (
    <div className="container">
        
         <Spinner loader={loading} />
         
      {orders.length == 0 ? (
        <h3 className="mt-4" >No Orders Found</h3>
      ) : (
        <div className="orders">
              
          {orders.map((order) => {
            
            return (
              <div className="single-order" key={order.orderId}>
                  <div className="order">
                      <h5>Order Id : {order.orderId}</h5>
                      <h5>Ordered on: {order.date}</h5>
                    </div>
                <table className="table table-hover table-bordered">
                  <thead>
                    <tr>
                    <th>Title</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total Price</th>
                    </tr>
                   
                   
                  </thead>

                  <tbody>
                    {order.products.map((o , index) => (
                      <tr key={index}>
                        <td>{o.name}</td>
                        <td>₹ {o.price}</td>
                        <td>{o.qty}</td>
                        <td>₹ {o.qty * o.price}</td>
                       
                      </tr>
                      
                    ))}
                  </tbody>
                    
                </table>
                <div className="order-total-price">
                    <h5>Total Price :₹ {order.total}</h5>
                    </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Orders;
