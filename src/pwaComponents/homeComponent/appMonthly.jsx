import React, { useEffect, useState } from "react";
import "owl.carousel/dist/assets/owl.carousel.css";
import { Link } from "react-router-dom";
import {
  addToCart,
  getFeaturedProd,
} from "../httpServices/homeHttpService/homeHttpService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { browserName } from "react-device-detect";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, FreeMode, Grid } from "swiper";

function AppMonthly() {
  const addFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/addToFav`;
  const rmvFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/removeFav`;
  const userData = `${process.env.REACT_APP_APIENDPOINTNEW}user/getUserProfile`;
  const getPromotionProd = `${process.env.REACT_APP_APIENDPOINTNEW}user/getPromotion`;
  const [product, setProduct] = useState([]);
  const [heart, setHeart] = useState(false);
  const [userDetail, setUserDetail] = useState([]);
  let { id } = useParams();
  const navigate = useNavigate();
  let image4 = require("../../assets/img/hotDealBg.png");
  let image8 = require("../../assets/img/monthly.png");

  useEffect(() => {
    getProductList();
    userInfo();
  }, []);
  let token = localStorage.getItem("token-user");

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

  return (
    <>
      {product?.length > 0 && (
        <div
          className="mt-1 "
          style={{
            backgroundImage: `url(${image4})`,
            backgroundPosition: "center",
            opacity: "unset",
            backgroundSize: "cover",
          }}
        >
          <img className="w-100" src={image8} />
          <div className="top-products-area pb-3 ">
            <div className="container">
              {/* <div className=" d-flex align-items-center justify-content-between dir-rtl mt-2 mb-3">
            <h6 className="fs-5 fw-bold text-danger">CLOSING OUT DEALS</h6>
          </div> */}

              <div className="row px-3 mt-3">
                <Swiper
                  slidesPerView={2.3}
                  spaceBetween={8}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: true,
                    reverseDirection: false,
                    waitForTransition: true,
                  }}
                  loop={true}
                  modules={[FreeMode, Pagination, Autoplay, Navigation]}
                  className=""
                >
                  {(product || [])
                    ?.filter((itm, idx) =>
                      browserName === "WebKit" ||
                      browserName === "Chrome WebView"
                        ? itm
                        : itm
                    )
                    .map((item, index) => (
                      <SwiperSlide key={index} className="">
                        <div class="hotMain">
                          <div class="w-100">
                            <div class="col-auto">
                              <Link
                                class="cart_bttn2 text-decoration-none"
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
                            <div className=" d-flex justify-content-center">
                              <div
                                onClick={() => {
                                  navigate(
                                    `/app/product-detail/${item?.productId?.slug}`,
                                    {
                                      state: {
                                        type: item?.productId?.type,
                                        offer: item?.price,
                                      },
                                    }
                                  );
                                }}
                                class="card-body-hot p-2 text-center"
                                style={{
                                  backgroundImage: `url(${
                                    item?.productId?.type?.flavourImage
                                      ? item?.productId?.type?.flavourImage
                                      : item?.productId?.productImage ||
                                        require("../../assets/img/product.jpg")
                                  })`,
                                  backgroundPosition: "center",
                                  opacity: "unset",
                                  backgroundSize: "cover",
                                  width: "8rem",
                                  maxHeight: "8.4rem",
                                  position: "relative",
                                  top: "-6px",
                                }}
                              ></div>
                            </div>

                            <div class="row  product-title_new ">
                              <div class="col-auto">
                                <Link
                                  class="name d-flex"
                                  to={`/app/product-detail/${item?.productId?.slug}`}
                                  state={{
                                    type: item?.productId?.type,
                                    offer: item?.price,
                                  }}
                                >
                                  {item?.productId?.unitName?.slice(0, 28)}..{" "}
                                  {item?.price ? (
                                    <p className="mb-0 price-size text-start">
                                      <span className="  text-danger fw-bold mb-0">
                                        {item?.price ? "$" + item.price : ""}
                                      </span>
                                    </p>
                                  ) : (
                                    ""
                                  )}
                                  {/* <span>
                              {item?.productId?.type
                                ? item?.productId?.type?.flavour?.slice(0, 8)
                                : ""}
                            </span>
                            .. */}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                </Swiper>
              </div>
              <div className="text-center">
                <Link
                  className="btn p-0 text-white  mt-2"
                  to="/app/product-list/Monthly"
                  state={{ ki: "kjh" }}
                >
                  View All<i className="ms-1 fa-solid fa-arrow-right-long"></i>
                </Link>
              </div>

              {/* )} */}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AppMonthly;
