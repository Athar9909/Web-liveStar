import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Homepage/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Profile from "./Profile";
import axios from "axios";
import Swal from "sweetalert2";

const Favourites = () => {
  const [users, setUsers] = useState();
  const allFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/allFav`;
  const addFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/addToFav`;
  const rmvFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/removeFav`;
  const [heart, setHeart] = useState();
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  let token = localStorage.getItem("token-user");

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("UserData"));
    setUsers(data);
    getFavourites();
  }, []);

  const getFavourites = async () => {
    await axios.get(allFav).then((res) => {
      console.log(res);
      setProducts(res?.data?.results);
    });
  };

  const addToFav = async (index) => {
    await axios
      .post(addFav, {
        productId: products[index]?.products?._id,
        flavour: products[index]?.products?.type[0],
      })
      .then((res) => {
        if (!res.error) {
          setHeart(!heart);
          getFavourites();
          Swal.fire({
            title: "Product Added to Wishlist.",
            icon: "success",
            text: "You can see your favourite products on My Wishlist.",
            confirmButtonText: "Ok",
          });
        }
      });
  };
  const rmvFromFav = async (id, type) => {
    await axios
      .post(rmvFav, {
        productId: id,
        flavour: type,
      })
      .then((res) => {
        if (!res.error) {
          setHeart(!heart);
          getFavourites();
          Swal.fire({
            title: "Product Removed from Wishlist.",
            icon: "success",
            confirmButtonText: "Okay",
          });
        }
      });
  };

  return (
    <div className="main_myaccount">
      <div className="row myfavourites">
        {(products || [])?.map((item, index) => (
          <div className="col-md-4 mb-2" key={index}>
            <div className="border rounded br-2 px-4 pt-2 shadow">
              {token?.length ? (
                <a class="wishlist-btn">
                  {item?.favourite ? (
                    <i
                      class="fa fa-heart"
                      onClick={() => {
                        rmvFromFav(item?.productId?._id, item?.type);
                      }}
                      style={{ color: "#3e4093 " }}
                    />
                  ) : (
                    <i
                      class="fa fa-heart"
                      onClick={() => {
                        addToFav(index);
                      }}
                      style={{ color: "#E1E1E1 " }}
                    />
                  )}
                </a>
              ) : null}

              <div
                className="partsproduct_img"
                onClick={() => {
                  navigate(`/AllProducts/Product/${item?.productId?.slug}`, {
                    state: {
                      id: item?.productId?.slug,
                    },
                  });
                }}
              >
                <img src={item?.productId?.productImage} alt="Product" />
              </div>
              <div
                className="product_content mt-3 text-center mb-0"
                onClick={() => {
                  navigate(`/AllProducts/Product/${item?.productId?.slug}`, {
                    state: {
                      id: item?.productId?.slug,
                    },
                  });
                }}
              >
                <Link to="" className="text-decoration-none">
                  {item?.productId?.unitName}
                </Link>

                <a className="fav_btn change_btn" href="javscript:;" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Favourites;
