import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppFooter from "./appFooter";
import "owl.carousel/dist/assets/owl.carousel.css";
import {
  addToCart,
  getAllProducts,
  getByCategory,
} from "../httpServices/homeHttpService/homeHttpService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import WebHeader2 from "./webHeader2";
import Swal from "sweetalert2";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { charSearchKey } from "../../selecter";
import Search from "./search";
import { browserName } from "react-device-detect";

function AppMonthlyList() {
  const addFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/addToFav`;
  const rmvFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/removeFav`;
  const getBrands = `${process.env.REACT_APP_APIENDPOINTNEW}user/brands/getBrands`;
  const getPromotionProd = `${process.env.REACT_APP_APIENDPOINTNEW}user/getPromotion`;
  const userData = `${process.env.REACT_APP_APIENDPOINTNEW}user/getUserProfile`;
  const [userDetail, setUserDetail] = useState([]);
  const [product, setProduct] = useState([]);
  const [heart, setHeart] = useState(false);
  const navigate = useNavigate();
  let ref = useRef();
  let token = localStorage.getItem("token-user");
  const searchKey = useRecoilValue(charSearchKey);
  console.log(searchKey);

  useEffect(() => {
    getProductList();
    userInfo();
  }, []);

  const userInfo = async () => {
    await axios.get(userData).then((res) => {
      setUserDetail(res?.data?.results);
    });
  };

  const getProductList = async () => {
    const { data } = await axios.post(getPromotionProd, {
      type: "MonthlyDeals",
    });

    if (!data.error) {
      setProduct(data?.results.promotion?.products);
    }
  };

  const addToCartt = async (id, index, itm, slug, price) => {
    if (itm?.category?.isTobacco || itm?.subCategory?.isTobacco) {
      if (!userDetail?.istobaccoLicenceExpired) {
        const formData = {
          productId: id,
          quantity: 1,
          flavour: itm?.productId?.type,
        };
        const { data } = await addToCart(formData);
        if (!data.error) {
          navigate("/app/cart");
        } else if (data?.message === "Flavour is not available!") {
          Swal.fire({
            title: "Please Select a Flavour!",
            text: "Click view to all flavours.",
            icon: "warning",
            confirmButtonText: "Okay",
          }).then((res) => {
            navigate(`/app/product-detail/${slug}`, {
              state: {
                offer: price,
              },
            });
          });
        } else if (data?.message === "Please provide flavour!") {
          Swal.fire({
            title: "Please Select a Flavour!",
            text: "Click view to all flavours.",
            icon: "warning",
            confirmButtonText: "Okay",
          }).then((res) => {
            navigate(`/app/product-detail/${slug}`, {
              state: {
                offer: price,
              },
            });
          });
        }
      } else {
        Swal.fire({
          title: "Your Tobacco licence is Expired/Invalid!",
          text: "*Licence is Required for this product.",
          icon: "warning",
          confirmButtonText: "Okay",
        });
      }
    } else {
      const formData = {
        productId: id,
        quantity: 1,
        flavour: itm?.productId?.type,
      };
      const { data } = await addToCart(formData);
      if (!data.error) {
        navigate("/app/cart");
      }
      if (data?.message === "Flavour is not available!") {
        Swal.fire({
          title: "Please Select a Flavour!",
          text: "Click view to all flavours.",
          icon: "warning",
          confirmButtonText: "Okay",
        }).then((res) => {
          navigate(`/app/product-detail/${slug}`, {
            state: {
              offer: price,
            },
          });
        });
      } else if (data?.message === "Please provide flavour!") {
        Swal.fire({
          title: "Please Select a Flavour!",
          text: "Click view to all flavours.",
          icon: "warning",
          confirmButtonText: "Okay",
        }).then((res) => {
          navigate(`/app/product-detail/${slug}`, {
            state: {
              offer: price,
            },
          });
        });
      }
      // if (data?.error) {
      //   navigate("/app/login");
      // }
    }
  };

  const addToFav = async (index, itm) => {
    await axios
      .post(addFav, {
        productId: itm?.productId?._id,
        flavour: itm?.productId?.type,
      })
      .catch((err) => {
        // toast.success(res?.data?.message);
        if (err) {
          Swal.fire({
            title: "Please Login To Continue",
            icon: "error",
            button: "ok",
          });
        }
      });
    getProductList();
    setHeart(!heart);
  };
  const rmvFromFav = async (index, itm) => {
    await axios
      .post(rmvFav, {
        productId: itm?.productId?._id,
        flavour: itm?.productId?.type,
      })
      .then((res) => {
        if (!res.error) {
          setHeart(!heart);
        }
      });
    getProductList();
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () =>
      document.removeEventListener("click", handleOutsideClick, true);
  }, []);
  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      document.getElementById("closeModal").click();
    }
  };
  return (
    <>
      <div className="star_imp_app ">
        <div class="header-area" id="headerArea" ref={ref}>
          <div class="container h-100 d-flex align-items-center justify-content-between rtl-flex-d-row-r">
            <div class="back-button me-2">
              <Link to="/app/home">
                <i className="fa-solid fa-house"></i>
              </Link>
            </div>

            <div class="page-heading">
              <h6 class="mb-0">MONHTLY DEALS PRODUCTS</h6>
            </div>

            <div
              class="suha-navbar-toggler ms-2"
              data-bs-toggle="offcanvas"
              data-bs-target="#suhaOffcanvas"
              aria-controls="suhaOffcanvas"
            >
              <div>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <WebHeader2 />

        <div class="page-content-wrapper2 bg-white">
          <Search />
          <div>
            {browserName === "WebKit" || browserName === "Chrome WebView" ? (
              <div>
                {searchKey?.length ? null : (
                  <div className="row p-3">
                    {/* .filter( (itm, idx) => itm.category !==
                    "639a042ff2f72167b43774de" && itm.category !==
                    "639a7617f2f72167b4377754" &&
                    itm?.productId?.isTobaccoProduct !== true ) */}
                    {(product || [])?.map((item, index) => (
                      <div class="col-6 mb-3">
                        <div class="card product-card w-100">
                          <div class="card-body">
                            <div class="col-auto">
                              <Link
                                class="cart_bttn text-decoration-none"
                                to=""
                                onClick={() =>
                                  addToCartt(
                                    item?.productId?._id,
                                    index,
                                    item,
                                    item?.productId?.slug
                                  )
                                }
                              >
                                <i class="fa-light fa-plus "></i>
                              </Link>
                            </div>
                            {token?.length ? (
                              <a class="wishlist-btn">
                                {item?.productId?.favourite ? (
                                  <i
                                    class="fa fa-heart"
                                    onClick={() => {
                                      rmvFromFav(index, item);
                                    }}
                                    style={{ color: "#3e4093 " }}
                                  />
                                ) : (
                                  <i
                                    class="fa fa-heart"
                                    onClick={() => {
                                      addToFav(index, item);
                                    }}
                                    style={{ color: "#E1E1E1 " }}
                                  />
                                )}
                              </a>
                            ) : null}

                            <Link
                              class="product-thumbnail d-block"
                              to={`/app/product-detail/${item?.productId?.slug}`}
                              state={{ type: item?.productId?.type }}
                            >
                              <img
                                class="mb-2"
                                src={
                                  item?.productId?.type?.flavourImage
                                    ? item?.productId?.type?.flavourImage
                                    : item?.productId?.productImage ||
                                      require("../../assets/img/product.jpg")
                                }
                                alt="Product Image not updated"
                              />
                            </Link>
                            <div class="row mt-1 d-flex align-items-center justify-content-between">
                              <div class="col-auto">
                                <Link
                                  class="product-title"
                                  to={`/app/product-detail/${item?.productId?.slug}`}
                                  state={{ type: item?.productId?.type }}
                                >
                                  {item?.productId?.unitName}
                                  <span>-{item?.productId?.type?.flavour}</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {searchKey?.length ? null : (
                  <div className="row p-3 ">
                    {(product || []).map((item, index) => (
                      <div class="col-6 mb-3">
                        <div class="card product-card w-100">
                          <div class="card-body">
                            <div class="col-auto">
                              <Link
                                class="cart_bttn text-decoration-none"
                                to=""
                                onClick={() =>
                                  addToCartt(
                                    item?.productId?._id,
                                    index,
                                    item,
                                    item?.productId?.slug,
                                    item?.price
                                  )
                                }
                              >
                                <i class="fa-light fa-plus "></i>
                              </Link>
                            </div>
                            {token?.length ? (
                              <a class="wishlist-btn">
                                {item?.productId?.favourite ? (
                                  <i
                                    class="fa fa-heart"
                                    onClick={() => {
                                      rmvFromFav(index, item);
                                    }}
                                    style={{ color: "#3e4093 " }}
                                  />
                                ) : (
                                  <i
                                    class="fa fa-heart"
                                    onClick={() => {
                                      addToFav(index, item);
                                    }}
                                    style={{ color: "#E1E1E1 " }}
                                  />
                                )}
                              </a>
                            ) : null}

                            <Link
                              class="product-thumbnail d-block"
                              to={`/app/product-detail/${item?.productId?.slug}`}
                              state={{
                                type: item?.productId?.type,
                                offer: item?.price,
                              }}
                            >
                              <img
                                class="mb-2"
                                src={
                                  item?.productId?.type?.flavourImage
                                    ? item?.productId?.type?.flavourImage
                                    : item?.productId?.productImage ||
                                      require("../../assets/img/product.jpg")
                                }
                                alt="Product Image not updated"
                              />
                            </Link>
                            <div class="row mt-1 d-flex align-items-center justify-content-between">
                              <div class="col-auto">
                                <Link
                                  class="product-title"
                                  style={{
                                    fontSize: "11px",
                                  }}
                                  to={`/app/product-detail/${item?.productId?.slug}`}
                                  state={{
                                    type: item?.productId?.type,
                                    offer: item?.price,
                                  }}
                                >
                                  {item?.productId?.unitName?.slice(0, 30)}
                                  {item?.price > 0 && (
                                    <span className="text-danger fw-bold">
                                      {" "}
                                      : ${item?.price}
                                    </span>
                                  )}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <AppFooter />
      </div>
    </>
  );
}

export default AppMonthlyList;
