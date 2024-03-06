import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import db from "./firebaseinit"
import './App.css';
import Navbar from './components/Navbar';
import SignUp from "./components/SignUp"
import Home from "./components/Home"
import Cart from './components/Cart';
import Orders from './components/Orders';
import Login from "./components/Login"
import Logout from "./components/Logout";
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { useSelector } from "react-redux";
import { authActions, authSelector } from "./redux/authReducer";
import { useDispatch } from "react-redux";








const ProtectedComponent = ({ children }) => {

  const { loggedIn } = useSelector(authSelector)


  if (!loggedIn) {
    return <Login />
  } else {
    return children;
  }
}


function App() {

  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem("user")) {
      dispatch(authActions.login(localStorage.getItem("user").toString()))
    }
  },[])


  const router = createBrowserRouter([
    {
      path: "/", element: <Navbar />, children: [
        {
          path: "/", element: <Home />
        },

        {
          path: "login", element: <Login />
        },
        {
          path: "sign-up", element: <SignUp />
        },

        {
          path: "cart", element: <ProtectedComponent>  <Cart /> </ProtectedComponent>
        },
        {
          path: "orders", element: <ProtectedComponent> <Orders /> </ProtectedComponent>
        },
        {
          path: "logout", element: <Logout />
        }
      ]
    }
  ])

  return (
    <>

      <RouterProvider router={router} />
    </>

  );
}

export default App;
