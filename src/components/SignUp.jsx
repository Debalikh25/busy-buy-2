import { useState } from "react"
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from "react-router-dom";
import { authSelector, createUserAsyncThunk } from "../redux/authReducer";
import { useSelector } from "react-redux";
import { authActions } from "../redux/authReducer";
import { useDispatch } from "react-redux";
import Spinner from "./Spinner";
import { successMessage, failureMessage, ToastContainer } from "./toastAlert";
const SignUp = () => {


    const [data, setData] = useState({
        email: "",
        password: ""
    })




    const { loading } = useSelector(authSelector)

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const register = async (e) => {
        e.preventDefault()
        try {
            dispatch(authActions.authStart())

            dispatch(createUserAsyncThunk(data))

            navigate("/login")

        }
        catch (error) {
            failureMessage(`Something went wrong: ${error.message}`)
        }
    }

    return (

        <div className="container">
            <ToastContainer />
            
              <Spinner loader={loading}/>

            <form className="form" onSubmit={(e) => register(e)}>
                <h3 className="mb-3" >Register</h3>
                <div className="form-group">
                    <input type="email" name="email" className="form-control" onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="Enter Email" required />
                </div>

                <div className="form-group">
                    <input type="password" name="password" className="form-control" onChange={(e) => setData({ ...data, password: e.target.value })} placeholder="Enter Password" required />
                </div>





                <input type="submit" className="btn btn-primary" value="Sign Up" />

            </form>

        </div>


    )

}

export default SignUp;