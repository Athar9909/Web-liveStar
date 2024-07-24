import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { addToCart } from "../httpServices/homeHttpService/homeHttpService";
import AppFooter from "./appFooter";
import AppHeader from "./appHeader";
import { browserName } from "react-device-detect";

function AppWishlist() {
  const allFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/allFav`;
  const rmvFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/removeFav`;
  const [products, setProducts] = useState();
  const [cartCount, setCartCount] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    getFavourites();
  }, []);

  const getFavourites = async () => {
    await axios.get(allFav).then((res) => {
      console.log(res);
      setProducts(res?.data?.results);
    });
  };
  const rmvFromFav = async (index) => {
    await axios
      .post(rmvFav, {
        productId: products[index]?.productId?._id,
        flavour: products[index]?.flavour,
      })
      .then((res) => {
        Swal.fire({
          title: res?.data.message,
          icon: "error",
          button: "ok",
        });
      });
    getFavourites();
  };
  const addToCartt = async (id, index) => {
    const formData = {
      productId: id,
      quantity: 1,
      flavour: products[index]?.productId.type[0],
    };
    console.log(formData);
    const { data } = await addToCart(formData);
    Swal.fire({
      title: "Added to Cart!",
      text: "Product added to Cart.",
      confirmButtonText: '<i class="fa fa-thumbs-up"></i> Great!',
      confirmButtonAriaLabel: "Thumbs up, Okay!",
    });
    if (!data.error) {
      await axios
        .post(rmvFav, {
          productId: id,
        })
        .then((res) => {
          if (!res.error) {
            setCartCount(!cartCount);
            getFavourites();
          }
        });
    }
  };
  return (
    <>
      <div className="star_imp_app">
        <AppHeader cartCount={cartCount} />
        <div className="page-content-wrapper">
          <div className="py-3">
            <div className="container">
              <div className="section-heading d-flex align-items-center justify-content-between rtl-flex-d-row-r mb-4">
                <h6>Wishlist Items - {products?.length}</h6>
              </div>
              {browserName === "WebKit" || browserName === "Chrome WebView" ? (
                <div className="row mt-0">
                  {(products || [])
                    ?.filter(
                      (itm, idx) => itm.productId.isTobaccoProduct !== true
                    )
                    .map((item, index) => (
                      <div className="col-12 mb-3" key={index}>
                        <div className="horizontal-product-card">
                          <div className="d-flex align-items-center">
                            <div className="product-thumbnail-side">
                              <Link
                                className="product-thumbnail shadow-sm d-block"
                                to={`/app/product-detail/${item?.productId?.slug}`}
                                state={{ type: item?.flavour }}
                              >
                                <img
                                  src={
                                    item?.flavour
                                      ? item?.flavour?.flavourImage ||
                                        require("../../assets/img/product.jpg")
                                      : item?.productId?.productImage ||
                                        require("../../assets/img/product.jpg")
                                  }
                                  alt=""
                                />
                              </Link>
                            </div>

                            <div className="">
                              <Link
                                className="product-title d-block fs-5 mb-3"
                                to={`/app/product-detail/${item?.productId?.slug}`}
                                state={{ type: item?.flavour }}
                              >
                                {item?.productId?.unitName}
                                {item?.flavour?.flavour
                                  ? "-" + item?.flavour?.flavour
                                  : null}
                              </Link>

                              <div className=" d-flex">
                                <Link
                                  class="cart_bttn"
                                  to=""
                                  onClick={() =>
                                    addToCartt(item?.productId?._id, index)
                                  }
                                >
                                  <i class="fa-light fa-plus"></i>
                                </Link>
                                <a
                                  className="delete_btn mx-3 mt-2"
                                  onClick={() => rmvFromFav(index)}
                                >
                                  <i className="fa-solid fa-trash-can"></i>
                                </a>
                              </div>
                              <div class="col-auto"></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  <div className="col-12">
                    <Link to="/app/cart" className="comman_btn">
                      Go to Cart
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="row mt-0">
                  {(products || [])?.map((item, index) => (
                    <div className="col-12 mb-3" key={index}>
                      <div className="horizontal-product-card">
                        <div className="d-flex align-items-center">
                          <div className="product-thumbnail-side">
                            <Link
                              className="product-thumbnail shadow-sm d-block"
                              to={`/app/product-detail/${item?.productId?.slug}`}
                              state={{ type: item?.flavour }}
                            >
                              <img
                                src={
                                  item?.flavour
                                    ? item?.flavour?.flavourImage ||
                                      require("../../assets/img/product.jpg")
                                    : item?.productId?.productImage ||
                                      require("../../assets/img/product.jpg")
                                }
                                alt=""
                              />
                            </Link>
                          </div>

                          <div className="">
                            <Link
                              className="product-title d-block fs-5 mb-3"
                              to={`/app/product-detail/${item?.productId?.slug}`}
                              state={{ type: item?.flavour }}
                            >
                              {item?.productId?.unitName}
                              {item?.flavour?.flavour
                                ? "-" + item?.flavour?.flavour
                                : null}
                            </Link>

                            <div className=" d-flex">
                              <Link
                                class="cart_bttn"
                                to=""
                                onClick={() =>
                                  addToCartt(item?.productId?._id, index)
                                }
                              >
                                <i class="fa-light fa-plus"></i>
                              </Link>
                              <a
                                className="delete_btn mx-3 mt-2"
                                onClick={() => rmvFromFav(index)}
                              >
                                <i className="fa-solid fa-trash-can"></i>
                              </a>
                            </div>
                            <div class="col-auto"></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  <div className="col-12">
                    <Link to="/app/cart" className="comman_btn">
                      Go to Cart
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        <AppFooter />
      </div>
    </>
  );
}

export default AppWishlist;
