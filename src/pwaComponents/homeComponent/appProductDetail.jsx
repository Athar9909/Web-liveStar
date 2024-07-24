import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import AppFooter from "./appFooter";
import AppHeader from "./appHeader";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import {
  addToCart,
  addToQuote,
  getProductDetaill,
} from "../httpServices/homeHttpService/homeHttpService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import WebHeader2 from "./webHeader2";
import SimlarProduct from "./appSimilarProductComponent";
import axios from "axios";
import Swal from "sweetalert2";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styled from "styled-components";
import ScrollToTop from "react-scroll-to-top";

function AppProductDetail() {
  const addFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/addToFav`;
  const rmvFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/removeFav`;
  const userData = `${process.env.REACT_APP_APIENDPOINTNEW}user/getUserProfile`;
  const [heart, setHeart] = useState(false);
  const [userDetail, setUserDetail] = useState([]);
  const [productDetail, setProductDetail] = useState("");
  const [FInd, setFInd] = useState();
  const [quantity, setQuantity] = useState(1);
  const [categoryName, setCategoryName] = useState();
  const [flavour, setFlavour] = useState();
  let { id } = useParams();
  const navigate = useNavigate();
  const [objectId, setObjectID] = useState();
  let token = localStorage.getItem("token-user");
  const [itemNo, setItemNo] = useState();
  let location = useLocation();
  let ref = useRef();
  const [cartCount, setCartCount] = useState(false);
  const [offerPrice, setOfferPrice] = useState(location?.state?.offer);
  const ScrollContainer = styled.div`
    height: 10.6rem;
    overflow-y: scroll;
    overflow-x: hidden;
    &::-webkit-scrollbar {
      width: 8px;
    }
    &::-webkit-scrollbar-track {
      border-radius: 10px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #3e4093 !important;
      border-radius: 30px;
      cursor: pointer !important;
    }
  `;

  if (objectId !== id) {
    setObjectID(id);
    setFlavour(location?.state?.type);
    setItemNo(0);
    document.getElementById("buttn")?.click();
  }

  useEffect(() => {
    getProductDetail();
    userInfo();
  }, [id]);

  const userInfo = async () => {
    await axios.get(userData).then((res) => {
      setUserDetail(res?.data?.results);
    });
  };
  const getProductDetail = async () => {
    const { data } = await getProductDetaill(id);
    if (!data.error) {
      setProductDetail(data.results);
      setCategoryName(data?.results?.category?.categoryName);
    }
  };

  const addToCartt = async () => {
    if (
      productDetail?.category?.isTobacco ||
      productDetail?.subCategory?.isTobacco
    ) {
      if (!userDetail?.istobaccoLicenceExpired) {
        if (flavour) {
          const formData = {
            productId: productDetail?._id,
            quantity: quantity,
            flavour: flavour ? flavour : {},
          };
          console.log(formData);
          const { data } = await addToCart(formData);
          if (!data.error) {
            setCartCount(!cartCount);
            Swal.fire({
              title: "Product Added to Cart",
              icon: "success",
              timer: 2000,
              showCloseButton: true,
              showCancelButton: true,
              focusConfirm: false,
              confirmButtonText: '<i class="fa fa-shopping-cart"></i> Cart!',
              confirmButtonAriaLabel: "Thumbs up, Okay!",
              cancelButtonText: "Close",
            }).then((res) => {
              if (res.isConfirmed) {
                navigate("/app/cart");
              }
            });
          }
        } else {
          Swal.fire({
            title: "Select Any Flavour/Packsize!",
            icon: "error",
            button: "Ok",
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
      if (flavour) {
        const formData = {
          productId: productDetail?._id,
          quantity: quantity,
          flavour: flavour ? flavour : {},
        };
        console.log(formData);
        const { data } = await addToCart(formData);
        if (!data.error) {
          setCartCount(!cartCount);
          Swal.fire({
            title: "Product Added to Cart",
            icon: "success",
            timer: 2000,
            showCloseButton: true,
            showCancelButton: true,
            focusConfirm: false,
            confirmButtonText: '<i class="fa fa-shopping-cart"></i> Cart!',
            confirmButtonAriaLabel: "Thumbs up, Okay!",
            cancelButtonText: "Close",
          }).then((res) => {
            if (res.isConfirmed) {
              navigate("/app/cart");
            }
          });
        }
      } else {
        Swal.fire({
          title: "Select Any Flavour/Packsize!",
          icon: "error",
          button: "Ok",
        });
      }
    }
  };

  const addToFav = async () => {
    await axios
      .post(addFav, {
        productId: productDetail?._id,
        flavour: flavour?._id,
      })
      .then((res) => {
        Swal.fire({
          title: res?.data.message,
          button: "ok",
        });
      });
    getProductDetail();
    setHeart(!heart);
  };

  const rmvFromFav = async () => {
    await axios
      .post(rmvFav, {
        productId: productDetail._id,
        flavour: flavour?._id,
      })
      .then((res) => {
        Swal.fire({
          title: res?.data.message,
          button: "ok",
        });
      });
    getProductDetail();
    setHeart(!heart);
  };
  console.log(flavour);
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
  const onHoverMain = (ind) => {
    setFlavour(productDetail.type[ind - 1]);
    setQuantity(1);
    setOfferPrice();
  };
  return (
    <>
      <div className="star_imp_app">
        <AppHeader cartCount={cartCount} />

        <div className="page-content-wrapper2 mb-5 mt-0 bg-light">
          <div className="" key={itemNo}>
            {productDetail ? (
              <Carousel
                showThumbs={false}
                showIndicators={false}
                onChange={onHoverMain}
                autoFocus={false}
                selectedItem={itemNo}>
                <div className="single-product-slide item">
                  <img
                    src={
                      flavour?.flavourImage
                        ? flavour?.flavourImage
                        : productDetail?.productImage
                    }
                    className
                    id="product-image"
                  />
                </div>
                {productDetail?.type
                  ?.filter((itm, idx) => itm?.flavourStatus === true)
                  .map((item) => (
                    <div className="single-product-slide item">
                      <img
                        src={item?.flavourImage ? item?.flavourImage : null}
                        alt=""
                      />
                    </div>
                  ))}
              </Carousel>
            ) : (
              ""
            )}
          </div>

          <div className="pb-3">
            <div className="product-title-meta-data bg-white ">
              <div className="container-fluid  d-flex justify-content-between rtl-flex-d-row-r">
                <div className="p-title-price mb-0 ">
                  <h4 className="fs-5">{productDetail?.unitName}</h4>
                </div>
                {token?.length ? (
                  <div className="p-wishlist-share">
                    <Link>
                      {productDetail?.favourite ? (
                        <i
                          class="fa fa-heart"
                          onClick={() => {
                            rmvFromFav();
                          }}
                          style={{ color: "#3e4093 " }}
                        />
                      ) : (
                        <i
                          class="fa fa-heart"
                          onClick={() => {
                            addToFav();
                          }}
                          style={{ color: "#E1E1E1 " }}
                        />
                      )}
                    </Link>
                  </div>
                ) : null}
              </div>
              <div className="product-ratings mt-1">
                <div className="container d-flex flex-wrap align-items-center justify-content-between rtl-flex-d-row-r">
                  <div className="col-12 d-flex justify-content-between ">
                    {flavour?.flavour ? (
                      <p className="fw-bold">
                        {flavour?.flavourPriceStatus
                          ? "Price : $" + flavour?.flavourPrice
                          : null}
                      </p>
                    ) : null}
                    {offerPrice !== 0 && offerPrice !== undefined && (
                      <div className="choose-color-wrapper">
                        <p className="mb-1 fw-bold">
                          Offer Price :
                          <span className="text-danger fw-bolder">
                            $ {offerPrice}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                  {console.log(offerPrice)}
                  <div className="row">
                    <div className="col-6">
                      <form className="cart-form w-100" action="#" method="">
                        <div className="order-plus-minus d-flex align-items-center">
                          <span
                            className="quantity-button-handler"
                            key={quantity}
                            onClick={() => {
                              if (quantity > 1) setQuantity(quantity - 1);
                            }}>
                            -
                          </span>
                          <input
                            className="cart-quantity-input text-center"
                            type="number"
                            id="quanInput"
                            name="quantity"
                            max="9999"
                            value={quantity}
                            onChange={(e) => setQuantity(e.target.value)}
                          />
                          <span
                            className="quantity-button-handler"
                            onClick={() => {
                              document.getElementById("quanInput").stepUp(1);
                              setQuantity(+quantity + 1);
                            }}>
                            +
                          </span>
                        </div>
                      </form>
                    </div>
                    <div className="col-6">
                      <div className="">
                        {token ? (
                          <button
                            className="comman_btn mb-2 new_btn_prod"
                            type="submit"
                            onClick={() => addToCartt()}>
                            Add to Cart
                          </button>
                        ) : (
                          <Link className="comman_btn mb-2" to="/app/login">
                            Please Login.
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="selection-panel bg-white mb-3 py-3">
              <div className="container">
                <div className="choose-color-wrapper">
                  <p className="mb-1 fw-bold">
                    Flavor:{" "}
                    <span className="text-primary  fw-normal">
                      {flavour?.flavour ? flavour?.flavour : ""}
                    </span>
                  </p>
                  {flavour?.caseQty && (
                    <div className="choose-color-wrapper">
                      <p className="mb-1 fw-bold">
                        Case Size :
                        <span className="text-primary fw-normal">
                          {" "}
                          {flavour?.caseQty ? flavour?.caseQty : ""}
                        </span>
                      </p>
                    </div>
                  )}

                  <div className="row ">
                    <ScrollContainer className="flavour_box">
                      {productDetail?.type
                        ?.filter((itm, idx) => itm?.flavourStatus === true)
                        .map((item, index) =>
                          flavour?.flavour === item?.flavour ? (
                            <Link
                              className="text-white col-12"
                              style={{
                                cursor: "pointer",
                                backgroundColor: "#3e4093",
                              }}
                              onClick={(e) => {
                                e.preventDefault();
                                setFlavour(item);
                                setFInd(index);
                                setOfferPrice();
                                setQuantity(1);
                                setItemNo(index + 1);
                                document.getElementById("product-image").src =
                                  item?.flavourImage;
                              }}>
                              <span>
                                <img
                                  className="border rounded mx-2"
                                  width={30}
                                  src={item?.flavourImage}></img>
                              </span>{" "}
                              {item?.flavour}
                            </Link>
                          ) : (
                            <Link
                              className="col-12"
                              onClick={(e) => {
                                e.preventDefault();
                                setFlavour(item);
                                setFInd(index);
                                setQuantity(1);
                                setOfferPrice();
                                setItemNo(index + 1);
                                document.getElementById("product-image").src =
                                  item?.flavourImage;
                              }}>
                              <span>
                                <img
                                  className="border rounded mx-2"
                                  width={30}
                                  src={item?.flavourImage}></img>
                              </span>{" "}
                              {item?.flavour}
                            </Link>
                          )
                        )}
                    </ScrollContainer>
                  </div>
                </div>
              </div>
            </div>

            <div className="selection-panel bg-white mb-3 py-3">
              <div className="container">
                <div className="choose-color-wrapper">
                  <p className="mb-1 font-weight-bold">Product Description :</p>
                  <div className="row offers_box_main">
                    <div className="col-12 flavour_box py-2">
                      <p>
                        {flavour?.flavour
                          ? flavour?.description
                          : "Please select any flavour to see details"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <SimlarProduct categoryName={categoryName} />
            </div>
          </div>
        </div>

        <AppFooter />
        <ScrollToTop
          id="buttn"
          smooth
          color="#fff"
          top={1000}
          style={{
            background: "#eb3237",
            borderRadius: "50%",
            display: "none",
            height: "40px",
            width: "45px",
            zIndex: "999",
          }}
        />
      </div>
    </>
  );
}

export default AppProductDetail;
