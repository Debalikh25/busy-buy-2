import { useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { productActions, productSelector } from "../redux/productReducer";
import { authReducer, authSelector } from "../redux/authReducer";
import { getProductsAsyncThunk } from "../redux/productReducer";
import { cartSelector } from "../redux/cartReducer";
import { addProductToCartAsync } from "../redux/cartReducer";
import { useNavigate, Outlet } from "react-router-dom";
import Spinner from "./Spinner";
import ProductItem from "./ProductItem";
import { successMessage } from "./toastAlert";

const Home = () => {
  // const [products, setProducts] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [showFilteredList, setShowFilteredList] = useState(false);


  const navigate = useNavigate();



  const { loading, products, error } = useSelector(productSelector)
  const { cart } = useSelector(cartSelector);
  const { user, loggedIn } = useSelector(authSelector)

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(productActions.fetchStart())

    dispatch(getProductsAsyncThunk())
  }, []);






  // Logic to add product inside cart. Passing this function as a context to children of this component.Product qty is set here.
  const addToCart = async (product) => {
    try {

      if (loggedIn) {
        dispatch(addProductToCartAsync({
          cart,
          product,
          user
        }))
        
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const filterList = (e, type) => {
  //   setShowFilteredList(true);
  //   let filtered = [];
  //   if (e.target.type == "checkbox") {
  //     if (e.target.checked) {
  //       filtered = products.filter((p) => p.category == e.target.value);
  //     } else {
  //       console.log("executed 2");
  //       filtered = filteredList.filter((p) => p.category != e.target.value);
  //     }
  //   }

  //   if (e.target.type == "range") {
  //     filtered = products.filter((p) => p.price < e.target.value);
  //   }

  //   if (e.target.type == "text") {
  //     if (e.target.value == "") {
  //       return;
  //     }
  //     filtered = products.filter((p) => p.name.includes(e.target.value));
  //   }

  //   console.log(filtered);

  //   if (filterList.length == 0 && filtered.length == 0) {
  //     setShowFilteredList(false);
  //     return;
  //   }

  //   const mergedList = [...filteredList, ...filtered];



  //   let map1 = new Map();
  //   mergedList.forEach((p) => {
  //     map1.set(p.id, p);
  //   });

  //   let finalList = [];

  //   map1.forEach((value, key) => {
  //     finalList.push(value);
  //   });
  //   console.log('Executed');
  //   setFilteredList(finalList);
  // };

  return (
    <>
      <div className="container mt-4">
        <input
          type="text"
          placeholder="Search"
          // onChange={(e) => filterList(e, "search")}
          className="form-control search-input"
        />

        <div className="row">
          <div className="col-md-3">
            <div className="card filter-box">
              <h4>Filter</h4>
              <div className="form-group">
                <input
                  // onChange={(e) => filterList(e, "range")}
                  type="range"
                  min="0"
                  max="100000"
                />
              </div>

              <div className="form-group">
                <input
                  // onChange={(e) => filterList(e, "checkbox")}
                  type="checkbox"
                  value="electronics"
                />{" "}
                Electronics
              </div>
              <div className="form-group">
                <input
                  // onChange={(e) => filterList(e, "checkbox")}
                  type="checkbox"
                  value="clothing"
                />{" "}
                Clothing
              </div>
              <div className="form-group">
                <input
                  // onChange={(e) => filterList(e, "checkbox")}
                  type="checkbox"
                  value="food"
                />{" "}
                Food
              </div>
              <div className="form-group">
                <input
                  // onChange={(e) => filterList(e, "checkbox")}
                  type="checkbox"
                  value="books"
                />{" "}
                Books
              </div>
              <div className="form-group">
                <input
                  // onChange={(e) => filterList(e, "checkbox")}
                  type="checkbox"
                  value="kitchen"
                />{" "}
                Kitchen
              </div>
              <div className="form-group">
                <input
                  // onChange={(e) => filterList(e, "checkbox")}
                  type="checkbox"
                  value="shoes"
                />{" "}
                Shoes
              </div>
              <div className="form-group">
                <input
                  // onChange={(e) => filterList(e)}
                  type="checkbox"
                  value="health"
                />{" "}
                Health
              </div>
            </div>
          </div>

          <div className="col-md-9">
            <h3>Products : </h3>
            <div className="row">
              <Spinner loader={loading} />
              {showFilteredList == true
                ? filteredList.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={{ ...product, addToCart }}
                  />
                ))
                : products.map((product) => (
                  <ProductItem
                    key={product.id}
                    product={{ ...product, addToCart }}
                  />
                ))}
            </div>
          </div>
        </div>
      </div>
      <Outlet />
    </>
  );
};

export default Home;
