import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authSelector, loginUserAsyncThunk } from "../redux/authReducer";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

import { successMessage, failureMessage, ToastContainer } from "./toastAlert";
import Spinner from "./Spinner";
const Login = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const { loading } = useSelector(authSelector)

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const login = async (e) => {
    e.preventDefault();
    try {

      dispatch(loginUserAsyncThunk(data))
     
      navigate("/")

    } catch (error) {
      failureMessage("Wrong Credentials");

    }
  };

  return (
    <div className="container">
      <ToastContainer />

      <form className="form" onSubmit={(e) => login(e)}>
        <h3 className="mb-3">Login</h3>
        <div className="form-group">
          <input
            type="email"
            name="email"
            className="form-control"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            placeholder="Enter Email"
            required
          />
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            className="form-control"
            onChange={(e) => setData({ ...data, password: e.target.value })}
            placeholder="Enter Password"
            required
          />
        </div>

        <input type="submit" className="btn btn-success" value="Login" />
      </form>

      <Spinner loader={loading} />

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition="bounce"
      />
    </div>
  );
};

export default Login;
