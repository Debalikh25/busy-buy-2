import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { authSelector } from "../redux/authReducer";
import { getAuth } from "firebase/auth";
import { ToastContainer } from "./toastAlert";



const Navbar = () => {

  //Getting loggedIn flag from auth state to change nav links after login
  const { user, loggedIn } = useSelector(authSelector)


  return (

    <>

      <nav className="navbar navbar-expand-sm  navbar-dark nav-custom">
        <div className="container">
          <NavLink className="navbar-brand" to="/">
            Buy Busy
          </NavLink>

          <ul className="navbar-nav ml-auto">
            {loggedIn ? (
              <>
                <li className="nav-item">
                  <NavLink to="/" className="nav-link">
                    Home
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/cart" className="nav-link">
                    Cart
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/orders" className="nav-link">
                    Orders
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink to="/logout" className="nav-link">
                    Logout
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink to="/login" className="nav-link">
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink to="/sign-up" className="nav-link">
                    Sign Up
                  </NavLink>


                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      <ToastContainer />
      <Outlet />

    </>

  );
};

export default Navbar;
