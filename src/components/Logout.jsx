import { useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { successMessage } from "./toastAlert";
import { authActions } from "../redux/authReducer";
import { useDispatch } from "react-redux";


const Logout = () => {

  const auth = getAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const logout = (flag) => {
    if (flag) {
      signOut(auth).then(() => {
       
        dispatch(authActions.logout())

        localStorage.removeItem("user");
        successMessage("Logged out !!");

    
        navigate("/");
      });
    } else {
      navigate("/");
    }
  };

  return (
    <div className="container mt-4">
      <h1>Sure you want to logout ? All Changes will be lost</h1>

      <span>
        <button onClick={() => logout(true)} className="btn btn-danger">
          Yes
        </button>
      </span>

      <span>
        <button onClick={() => logout(false)} className="btn btn-success ml-4">
          No
        </button>
      </span>
    </div>
  );
};

export default Logout;
