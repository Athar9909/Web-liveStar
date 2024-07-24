import React, { useRef } from "react";
import Footer from "../Footer/Footer";
import Navbar from "./Navbar";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, FreeMode, Grid } from "swiper";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/grid";
import "../../assets/css/main.css";
import AgeVerification from "../AgeVerification";
import { useEffect } from "react";
import axios from "axios";
import { useState } from "react";
import DOMPurify from "dompurify";
// import Fade from "react-reveal/Fade";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import "owl.carousel/dist/assets/owl.theme.default.css";
import image from "../../assets/img/starBgg.jpg";
import { useSetRecoilState } from "recoil";
import {
  pageBrand,
  pageCategory,
  pageCategoryData,
  pageSubCategory,
  pageSubCategoryData,
} from "../../atom";
import Swal from "sweetalert2";
import { Modal, Loader } from "rsuite";
import LoginPOP from "./loginPOP";
import moment from "moment";

const Homepage = () => {
  const width = window.innerWidth;
  const [isMuted, setIsMuted] = useState(true);
  const [NState, setNState] = useState(false);
  const [allSlides, setAllSlides] = useState([]);
  const [allHeaders, setAllHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const slidesApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/homeBanner/getSlides`;
  const HeadersApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/homeBanner/getHeaders`;
  const categoryApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/category/getCategory`;
  const brandApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/brands/getBrands`;
  const allProd = `${process.env.REACT_APP_APIENDPOINTNEW}user/products/getAllProducts`;
  const getVideoSlides = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/cms/getVideoSlides`;
  const getPromotionProd = `${process.env.REACT_APP_APIENDPOINTNEW}user/getPromotion`;
  const addCart = `${process.env.REACT_APP_APIENDPOINTNEW}user/addProducts`;
  const addFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/addToFav`;
  const rmvFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/removeFav`;
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState([]);
  const [brands, setBrands] = useState([]);
  const setPage = useSetRecoilState(pageCategory);
  const setPage2 = useSetRecoilState(pageSubCategory);
  const setPage3 = useSetRecoilState(pageBrand);
  const setData = useSetRecoilState(pageCategoryData);
  const setData2 = useSetRecoilState(pageSubCategoryData);
  const [activePage, setActivePage] = useState(1);
  const ModalClose = document.getElementById("age_close");
  const navigate = useNavigate();
  axios.defaults.headers.common["x-auth-token-user"] =
    localStorage.getItem("token-user");

  let token = localStorage.getItem("token-user");
  let NewUser = sessionStorage.getItem("new");
  const [hotSell, setHotSell] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [NewArrival, setNewArrival] = useState([]);
  const [closeOut, setCloseOut] = useState([]);
  const [monthly, setMonthly] = useState([]);
  const [change, setChange] = useState(false);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(0);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEntered = () => {
    setTimeout(() => setRows(80), 2000);
  };

  const pagination = {
    clickable: true,
  };

  const getLoginCnfirm = (data) => {
    if (data?.length > 1) {
      setOpen(false);
      window.location.reload(false);
    }
  };

  useEffect(() => {
    if (!token) {
      if (!NewUser) {
        setTimeout(() => {
          navigate("/app/verify");
        }, 2000);
      }
    }
    VideoSlidesGet();
    getSlides();
    getPromotions();
    getPromotionsClose();
    getPromotionsFeatured();
    getPromotionsMonthly();
    getPromotionsNewArrival();
    getCategory();
    getHeaders();
    getBrands();
    setPage(1);
    setPage2(1);
    setPage3(1);
    setData([]);
    setData2([]);
    setTimeout(() => {
      setLoading(false);
    }, 8000);
  }, []);

  const addToFav = async (id, flavour) => {
    await axios
      .post(addFav, {
        productId: id,
        flavour: flavour,
      })
      .then((res) => {
        if (!res.error) {
          setChange(!change);
          Swal.fire({
            title: "Product Added to Wishlist.",
            icon: "success",
            text: "You can see your favorite products on My Wishlist.",
            confirmButtonText: "Okay",
            timer: 2000,
          });
        }
      })
      .catch((err) => {
        if (err) {
          setOpen(true);
        }
      });
  };

  const AddtoCart = async (id, flavour, slug, price) => {
    await axios
      .post(addCart, {
        productId: id,
        quantity: 1,
        flavour: flavour,
      })
      .then((res) => {
        console.log(res, "kkkj");

        if (!res.data.error) {
          setNState(!NState);
          Swal.fire({
            title: "Product Added to Cart",
            icon: "success",
            showCloseButton: true,
            showCancelButton: true,
            timer: 1000,
            focusConfirm: false,
            confirmButtonText: '<i class="fa fa-shopping-cart"></i> Cart!',
            confirmButtonAriaLabel: "Thumbs up, Okay!",
            cancelButtonText: "Close",
          }).then((res) => {
            if (res.isConfirmed) {
              navigate("/app/cart", { state: "jii" });
            }
          });
        }
        if (res.data?.message === "Not available in your State!") {
          Swal.fire({
            title: "This Product is not available in your State!",
            icon: "warning",
            focusConfirm: false,
            timer: 1000,
          });
        }
        if (
          res?.data.message === "Flavour is not available!" ||
          res?.data.message === "Please provide flavour!"
        ) {
          Swal.fire({
            title: "Please select a Flavour!",
            text: "Click Below button to view All Flavours.",
            icon: "error",
            confirmButtonText: "View",
          }).then((res) => {
            console.log(res);
            navigate(`/AllProducts/Product/${slug}`, {
              state: {
                offer: price,
              },
            });
          });
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
        if (err.response.data.error) {
          setOpen(true);
        }
      });
  };

  const VideoSlidesGet = async () => {
    await axios.get(getVideoSlides).then((res) => {
      setVideos(res?.data.results?.videoSlide);
    });
  };

  const getSlides = async () => {
    await axios.get(slidesApi).then((res) => {
      localStorage.setItem("slides", JSON.stringify(res?.data.results));
      setAllSlides(res?.data.results);
      setAllSlides(
        JSON.parse(localStorage.getItem("slides"))
          ? JSON.parse(localStorage.getItem("slides"))
          : res?.data.results
      );
      var background =
        document.getElementById("bottom-image")?.style.backgroundImage;
      if (image) {
        background = `url(${image?.bottomImage})`;
      }
    });
  };

  const getPromotionsByType = async (type, setData) => {
    try {
      const { data } = await axios.post(getPromotionProd, { type });

      if (!data.error) {
        setData(data?.results.promotion?.products);
      }
    } catch (error) {
      console.error(`Error fetching promotions for type ${type}`, error);
    }
  };

  const getPromotions = async () => {
    await getPromotionsByType("HotSelling", setHotSell);
  };

  const getPromotionsFeatured = async () => {
    await getPromotionsByType("Featured", setFeatured);
  };

  const getPromotionsClose = async () => {
    await getPromotionsByType("CloseOut", setCloseOut);
  };

  const getPromotionsMonthly = async () => {
    await getPromotionsByType("MonthlyDeals", setMonthly);
  };

  const getPromotionsNewArrival = async () => {
    await getPromotionsByType("NewArrivals", setNewArrival);
  };

  const getHeaders = async () => {
    await axios.get(HeadersApi).then((res) => {
      setAllHeaders(res?.data.results?.headers[0]);
      localStorage.setItem(
        "imageBg",
        JSON.stringify(res?.data.results?.headers[0])
      );
    });
  };

  const getCategory = async () => {
    await axios
      .post(categoryApi, {
        page: 1,
      })
      .then((res) => {
        localStorage.setItem(
          "categories",
          JSON.stringify(res?.data.results?.categories)
        );
        if (!res.data.error) {
          setLoading(false);
          setCategory(res?.data.results?.categories);
        }
      });
  };

  const getBrands = async () => {
    await axios.post(brandApi, { page: 1 }).then((res) => {
      let data = res?.data.results?.brands;
      let newData = data?.filter((itm, idx) => !(idx > 14));
      setBrands(newData);
      if (!res.data.error) {
        setLoading(false);
      }
    });
  };

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  return (
    <div className="home_page">
      <Navbar NState={NState} />
      {loading ? (
        <div className="load_position">
          <div className="loader_new"></div>
        </div>
      ) : (
        <div>
          <OwlCarousel
            className="banner_slider"
            autoplay={true}
            autoplayHoverPause={true}
            autoplayTimeout={8000}
            rewind={true}
            loop={true}
            dots={false}
            nav={true}
            lazyLoad={true}
            items={1}
          >
            <div
              className="banner_section item"
              onClick={() => {
                window.location.href = allSlides[1]?.url
                  ? allSlides[1]?.url
                  : "https://starimporters.com/app/home";
              }}
            >
              <img
                src={
                  allSlides[1]?.banner
                    ? allSlides[1]?.banner
                    : require("../../assets/img/staticBg.png")
                }
                className="d-block w-100"
                alt="Loading...."
              />
              <div
                className={
                  (allSlides[1]?.position === "One" &&
                    "carousel-caption mt-5") ||
                  (allSlides[1]?.position === "Two" &&
                    "carousel-caption banner-titles mx-3 mt-5") ||
                  (allSlides[1]?.position === "Three" &&
                    "carousel-caption bannerTitle2")
                }
              >
                <h5
                  className={
                    (allSlides[1]?.position === "One" &&
                      "text-start bannerTxt") ||
                    (allSlides[1]?.position === "Two" &&
                      " text-center  Bannertext") ||
                    (allSlides[1]?.position === "Three" &&
                      " text-end bannerTxt")
                  }
                  dangerouslySetInnerHTML={createMarkup(allSlides[1]?.title)}
                ></h5>
                <p
                  className={
                    (allSlides[1]?.position === "One" &&
                      " text-start fs-6 bannerTxt") ||
                    (allSlides[1]?.position === "Two" &&
                      "d-flex text-center fs-6 bannerTxt") ||
                    (allSlides[1]?.position === "Three" &&
                      "d-flex text-end fs-6 bannerTxt")
                  }
                  dangerouslySetInnerHTML={createMarkup(
                    allSlides[1]?.description
                  )}
                ></p>
              </div>
            </div>

            <div
              className="banner_section item"
              onClick={() => {
                window.location.href = videos[0]?.url
                  ? videos[0]?.url
                  : "https://starimporters.com/app/home";
              }}
            >
              <video
                muted={isMuted ? true : false}
                id="frameOne"
                className="main_video bg-dark"
                autoPlay
                loop
                preload="auto"
              >
                <source src={videos[0]?.video} />
              </video>
            </div>

            <div
              className="banner_section item"
              onClick={() => {
                window.location.href = videos[1]?.url
                  ? videos[1]?.url
                  : "https://starimporters.com/app/home";
              }}
            >
              <video
                id="frameTwo"
                className="main_video bg-dark"
                autoPlay
                loop
                muted={true}
                preload="auto"
              >
                <source src={videos[1]?.video} />
              </video>
            </div>

            <div
              className="banner_section item"
              onClick={() => {
                window.location.href = videos[2]?.url
                  ? videos[2]?.url
                  : "https://starimporters.com/app/home";
              }}
            >
              <video
                id="frameThree"
                className="main_video bg-dark"
                autoPlay
                loop
                muted={true}
                preload="auto"
              >
                <source src={videos[2]?.video} />
              </video>
            </div>

            <div
              className="banner_section item"
              onClick={() => {
                window.location.href = videos[3]?.url
                  ? videos[3]?.url
                  : "https://starimporters.com/app/home";
              }}
            >
              <video
                id="frameFour"
                className="main_video bg-dark"
                autoPlay
                loop
                oncanplay="this.muted=true"
                muted={true}
                preload="auto"
              >
                <source src={videos[3]?.video} />
              </video>
            </div>

            <div
              className="banner_section item "
              onClick={() => {
                window.location.href = allSlides[2]?.url
                  ? allSlides[2]?.url
                  : "https://starimporters.com/app/home";
              }}
            >
              <img
                src={
                  allSlides[2]?.banner
                    ? allSlides[2]?.banner
                    : require("../../assets/img/staticBg.png")
                }
                className="d-block w-100 "
                alt="Loading..."
              />
            </div>

            <div
              className="banner_section item"
              onClick={() => {
                window.location.href = allSlides[3]?.url
                  ? allSlides[3]?.url
                  : "https://starimporters.com/app/home";
              }}
            >
              <img
                src={
                  allSlides[3]?.banner
                    ? allSlides[3]?.banner
                    : require("../../assets/img/staticBg.png")
                }
                className="d-block w-100 "
                alt="Loading..."
              />
            </div>

            <div
              className="banner_section item "
              onClick={() => {
                window.location.href = allSlides[4]?.url
                  ? allSlides[4]?.url
                  : "https://starimporters.com/app/home";
              }}
            >
              <img
                src={
                  allSlides[4]?.banner
                    ? allSlides[4]?.banner
                    : require("../../assets/img/staticBg.png")
                }
                className="d-block w-100 "
                alt="Loading..."
              />
            </div>

            <div
              className="banner_section item"
              onClick={() => {
                window.location.href = allSlides[5]?.url
                  ? allSlides[5]?.url
                  : "https://starimporters.com/app/home";
              }}
            >
              <img
                src={
                  allSlides[5]?.banner
                    ? allSlides[5]?.banner
                    : require("../../assets/img/staticBg.png")
                }
                className="d-block w-100 "
                alt="Loading..."
              />
            </div>
          </OwlCarousel>

          {NewArrival?.length > 0 && (
            <section className="featuredproduct shadow bg-light mt-5">
              <div className="container">
                <div className="row featuredproduct_slider">
                  <a
                    className="view_all "
                    onClick={() =>
                      navigate("/app/new-arrivals-products", { state: "hii" })
                    }
                  >
                    View All{" "}
                    <img
                      style={{
                        height: "21px",
                      }}
                      class="ms-2"
                      src={require("../../assets/img/arrow_colr.png")}
                      alt=""
                    ></img>
                  </a>
                  <div className="col-12 mb-1">
                    <div className="comn_heads mb-5">
                      {/* <h2
                      dangerouslySetInnerHTML={createMarkup(
                        allHeaders?.featuredTitle
                      )}></h2> */}
                      <h2>New Arrivals</h2>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <Swiper
                      slidesPerView={width <= 1400 ? 3 : 4}
                      spaceBetween={30}
                      // navigation={true}
                      pagination={pagination}
                      autoplay={{
                        delay: 4000,
                        disableOnInteraction: true,
                        reverseDirection: true,
                        waitForTransition: true,
                      }}
                      loop={true}
                      modules={[FreeMode, Pagination, Autoplay, Navigation]}
                      className="mySwiper"
                    >
                      {(NewArrival || [])?.map((item, index) => (
                        <SwiperSlide key={index} className="pb-5">
                          <div className=" mb-3">
                            <div className="product-grid ">
                              <div
                                className="product-image border mt-1
                          "
                              >
                                <a
                                  className="image
                            
                            "
                                  onClick={() => {
                                    navigate(
                                      `/AllProducts/Product/${item?.productId?.slug}`,
                                      {
                                        state: {
                                          type: item?.productId?.type,
                                          offer: item?.price,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  <img
                                    className="pic-1"
                                    src={
                                      item?.productId?.productImage
                                        ? item?.productId?.productImage
                                        : require("../../assets/img/product.jpg")
                                    }
                                  />
                                  <img
                                    className="pic-2"
                                    src={
                                      item?.productId?.type?.flavourImage
                                        ? item?.productId?.type?.flavourImage
                                        : item?.productId?.productImage ||
                                          require("../../assets/img/product.jpg")
                                    }
                                  />
                                </a>
                                <span
                                  className={
                                    item?.price
                                      ? "product-Featured-label"
                                      : "d-none"
                                  }
                                >
                                  Price - {item?.price ? "$" + item.price : ""}
                                </span>
                                <ul className="product-links">
                                  <li>
                                    <a
                                      data-tip="Add to Wishlist"
                                      onClick={() => {
                                        addToFav(
                                          item?.productId?._id,
                                          item?.productId?.type
                                        );
                                      }}
                                    >
                                      <i className="far fa-heart" />
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      data-tip="Add to Cart"
                                      onClick={() => {
                                        AddtoCart(
                                          item?.productId?._id,
                                          item?.productId?.type,
                                          item?.productId?.slug,
                                          item?.price
                                        );
                                      }}
                                    >
                                      {" "}
                                      <i className="fas fa-shopping-cart" />
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      data-tip="Quick View"
                                      onClick={() => {
                                        navigate(
                                          `/AllProducts/Product/${item?.productId?.slug}`,
                                          {
                                            state: {
                                              type: item?.productId?.type,
                                              offer: item?.price,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      <i className="fa fa-search" />
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div className="product-content ">
                                <a
                                  className="add-to-cart text-decoration-none"
                                  onClick={() => {
                                    navigate(
                                      `/AllProducts/Product/${item?.productId?.slug}`,
                                      {
                                        state: {
                                          type: item?.productId?.type,
                                          offer: item?.price,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  <small
                                    style={{
                                      fontSize: "12px",
                                    }}
                                  >
                                    {item?.productId?.type?.flavour
                                      ? item?.productId?.type?.flavour
                                      : item?.productId?.unitName}
                                  </small>
                                </a>
                                <h3 className="title ">
                                  <a className="text-decoration-none">
                                    {item?.productId?.unitName}
                                  </a>
                                </h3>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>
            </section>
          )}

          {monthly?.length > 0 && (
            <section className="p-4 container ">
              <div className=" ">
                <div className="row featuredproduct_slider">
                  <div className="col-12 mb-2 mt-5 ">
                    <div className="comn_heads mb-5">
                      <h2>Monthly Deals</h2>
                      <a
                        className="view_all "
                        onClick={() =>
                          navigate("/app/monthly-products", { state: "hii" })
                        }
                      >
                        View All{" "}
                        <img
                          class="ms-2"
                          src={require("../../assets/img/arrow_colr.png")}
                          alt=""
                        ></img>
                      </a>
                    </div>
                  </div>
                  <div className="">
                    <Swiper
                      slidesPerView={width <= 1400 ? 3 : 4}
                      spaceBetween={30}
                      navigation={true}
                      autoplay={{
                        delay: 5000,
                        disableOnInteraction: true,
                        reverseDirection: true,
                        waitForTransition: true,
                      }}
                      loop={true}
                      style={{ padding: "30px" }}
                      modules={[FreeMode, Pagination, Autoplay, Navigation]}
                      className="mySwiper pt-5"
                    >
                      {(monthly || [])?.map((item, index) => (
                        <SwiperSlide key={index} className="px-3 main_hot">
                          <div className="col-md-12 col-lg-12 px-2">
                            <div className="card_hot shadow">
                              <div
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
                                  maxHeight: "15rem",
                                  position: "relative",
                                  top: "2.8rem",
                                }}
                              >
                                <span className="offer2">
                                  Ends on :{moment(item?.expireIn).format("L")}
                                  {/* <Countdown
                                date={new Date(item?.expireIn)}
                                renderer={renderer}
                              /> */}
                                </span>
                                <div
                                  className="item-image p-4 mt-2 pt-5"
                                  onClick={() => {
                                    navigate(
                                      `/AllProducts/Product/${item?.productId?.slug}`,
                                      {
                                        state: {
                                          type: item?.productId?.type,
                                          offer: item?.price,
                                        },
                                      }
                                    );
                                  }}
                                ></div>
                              </div>
                              <div className="item-content text-center mt-4 fw-bold">
                                <h3
                                  className="fw-bold"
                                  onClick={() => {
                                    navigate(
                                      `/AllProducts/Product/${item?.productId?.slug}`,
                                      {
                                        state: {
                                          type: item?.productId?.type,
                                          offer: item?.price,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {" "}
                                  {item?.productId?.unitName?.slice(0, 35)}
                                </h3>{" "}
                                <p className="mb-4">
                                  {" "}
                                  {item?.price ? "Offer price:" : ""}
                                  <span className=" mx-1 text-danger  fs-6 fw-bolder">
                                    {item?.price ? "$" + item.price : ""}
                                  </span>
                                </p>{" "}
                              </div>
                            </div>
                            <div className="product-action">
                              {" "}
                              <div className="product-action-style">
                                {" "}
                                <a
                                  onClick={() => {
                                    navigate(
                                      `/AllProducts/Product/${item?.productId?.slug}`,
                                      {
                                        state: {
                                          type: item?.productId?.type,
                                          offer: item?.price,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {" "}
                                  <i className="fas fa-eye" />
                                </a>{" "}
                                <a
                                  onClick={() => {
                                    addToFav(
                                      item?.productId?._id,
                                      item?.productId?.type
                                    );
                                  }}
                                >
                                  {" "}
                                  <i className="fas fa-heart" />
                                </a>{" "}
                                <a
                                  onClick={() => {
                                    AddtoCart(
                                      item?.productId?._id,
                                      item?.productId?.type,
                                      item?.productId?.slug,
                                      item?.price
                                    );
                                  }}
                                >
                                  {" "}
                                  <i className="fas fa-shopping-cart" />
                                </a>{" "}
                              </div>{" "}
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>
            </section>
          )}

          {closeOut?.length > 0 && (
            <section className="p-4 container">
              <div className=" ">
                <div className="row featuredproduct_slider">
                  <div className="col-12 mb-2 mt-5 ">
                    <div className="comn_heads mb-5">
                      <h2>Closing Out deals</h2>
                      <a
                        className="view_all "
                        onClick={() =>
                          navigate("/app/CloseOut-products", { state: "hii" })
                        }
                      >
                        View All{" "}
                        <img
                          class="ms-2"
                          src={require("../../assets/img/arrow_colr.png")}
                          alt=""
                        ></img>
                      </a>
                    </div>
                  </div>
                  <div className="">
                    <Swiper
                      slidesPerView={width <= 1400 ? 3 : 4}
                      spaceBetween={30}
                      navigation={true}
                      autoplay={{
                        delay: 5000,
                        disableOnInteraction: true,
                        reverseDirection: true,
                        waitForTransition: true,
                      }}
                      loop={true}
                      style={{ padding: "30px" }}
                      modules={[FreeMode, Pagination, Autoplay, Navigation]}
                      className="mySwiper pt-5"
                    >
                      {(closeOut || [])?.map((item, index) => (
                        <SwiperSlide key={index} className="px-3 main_hot">
                          <div className="col-md-12 col-lg-12 px-2">
                            <div className="card_hot shadow">
                              <div
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
                                  maxHeight: "15rem",
                                  position: "relative",
                                  top: "2.8rem",
                                }}
                              >
                                <span className="offer2">
                                  Ends on :{moment(item?.expireIn).format("L")}
                                  {/* <Countdown
                                date={new Date(item?.expireIn)}
                                renderer={renderer}
                              /> */}
                                </span>
                                <div
                                  className="item-image  "
                                  onClick={() => {
                                    navigate(
                                      `/AllProducts/Product/${item?.productId?.slug}`,
                                      {
                                        state: {
                                          type: item?.productId?.type,
                                          offer: item?.price,
                                        },
                                      }
                                    );
                                  }}
                                ></div>
                              </div>
                              <div className="item-content text-center mt-4  fw-bold">
                                <h3 className="fw-bold">
                                  {" "}
                                  {item?.productId?.unitName?.slice(
                                    0,
                                    26
                                  )} -{" "}
                                  {/* <strong className="fs-6">
                                    {item?.productId?.type?.flavour?.slice(
                                      0,
                                      30
                                    )}
                                    ..
                                  </strong> */}
                                </h3>{" "}
                                <p className="mb-4">
                                  {" "}
                                  {item?.price ? "Offer price:" : ""}
                                  <span className=" mx-1 text-danger  fs-6 fw-bolder">
                                    {item?.price ? "$" + item.price : ""}
                                  </span>
                                </p>{" "}
                              </div>
                            </div>
                            <div className="product-action">
                              {" "}
                              <div className="product-action-style">
                                {" "}
                                <a
                                  onClick={() => {
                                    navigate(
                                      `/AllProducts/Product/${item?.productId?.slug}`,
                                      {
                                        state: {
                                          type: item?.productId?.type,
                                          offer: item?.price,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  {" "}
                                  <i className="fas fa-eye" />
                                </a>{" "}
                                <a
                                  onClick={() => {
                                    addToFav(
                                      item?.productId?._id,
                                      item?.productId?.type
                                    );
                                  }}
                                >
                                  {" "}
                                  <i className="fas fa-heart" />
                                </a>{" "}
                                <a
                                  onClick={() => {
                                    AddtoCart(
                                      item?.productId?._id,
                                      item?.productId?.type,
                                      item?.productId?.slug,
                                      item?.price
                                    );
                                  }}
                                >
                                  {" "}
                                  <i className="fas fa-shopping-cart" />
                                </a>{" "}
                              </div>{" "}
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>
            </section>
          )}

          {featured?.length > 0 && (
            <section className="featuredproduct shadow bg-light">
              <div className="container">
                <div className="row featuredproduct_slider">
                  <a
                    className="view_all "
                    onClick={() =>
                      navigate("/app/featured-products", { state: "hii" })
                    }
                  >
                    View All{" "}
                    <img
                      style={{
                        height: "21px",
                      }}
                      class="ms-2"
                      src={require("../../assets/img/arrow_colr.png")}
                      alt=""
                    ></img>
                  </a>
                  <div className="col-12 mb-1">
                    <div className="comn_heads mb-5">
                      {/* <h2
                      dangerouslySetInnerHTML={createMarkup(
                        allHeaders?.featuredTitle
                      )}></h2> */}
                      <h2>Featured Products</h2>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <Swiper
                      slidesPerView={width <= 1400 ? 3 : 4}
                      spaceBetween={30}
                      // navigation={true}
                      pagination={pagination}
                      autoplay={{
                        delay: 4000,
                        disableOnInteraction: true,
                        reverseDirection: true,
                        waitForTransition: true,
                      }}
                      loop={true}
                      modules={[FreeMode, Pagination, Autoplay, Navigation]}
                      className="mySwiper"
                    >
                      {(featured || [])?.map((item, index) => (
                        <SwiperSlide key={index} className="pb-5">
                          <div className=" mb-3">
                            <div className="product-grid ">
                              <div
                                className="product-image
                          "
                              >
                                <a
                                  className="image
                            
                            "
                                  onClick={() => {
                                    navigate(
                                      `/AllProducts/Product/${item?.productId?.slug}`,
                                      {
                                        state: {
                                          type: item?.productId?.type,
                                          offer: item?.price,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  <img
                                    className="pic-1"
                                    src={
                                      item?.productId?.productImage
                                        ? item?.productId?.productImage
                                        : require("../../assets/img/product.jpg")
                                    }
                                  />
                                  <img
                                    className="pic-2"
                                    src={
                                      item?.productId?.type?.flavourImage
                                        ? item?.productId?.type?.flavourImage
                                        : item?.productId?.productImage ||
                                          require("../../assets/img/product.jpg")
                                    }
                                  />
                                </a>
                                {item?.price?.lenghh > 1 && (
                                  <span className="product-hot-label">
                                    <span className=" mx-1  fs-5 fw-bold">
                                      {item?.price ? "$" + item.price : ""}
                                    </span>
                                  </span>
                                )}
                                <ul className="product-links">
                                  <li>
                                    <a
                                      data-tip="Add to Wishlist"
                                      onClick={() => {
                                        addToFav(
                                          item?.productId?._id,
                                          item?.productId?.type
                                        );
                                      }}
                                    >
                                      <i className="far fa-heart" />
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      data-tip="Add to Cart"
                                      onClick={() => {
                                        AddtoCart(
                                          item?.productId?._id,
                                          item?.productId?.type,
                                          item?.productId?.slug,
                                          item?.price
                                        );
                                      }}
                                    >
                                      {" "}
                                      <i className="fas fa-shopping-cart" />
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      data-tip="Quick View"
                                      onClick={() => {
                                        navigate(
                                          `/AllProducts/Product/${item?.productId?.slug}`,
                                          {
                                            state: {
                                              type: item?.productId?.type,
                                              offer: item?.price,
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      <i className="fa fa-search" />
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <div className="product-content ">
                                <a
                                  className="add-to-cart text-decoration-none"
                                  onClick={() => {
                                    navigate(
                                      `/AllProducts/Product/${item?.productId?.slug}`,
                                      {
                                        state: {
                                          type: item?.productId?.type,
                                          offer: item?.price,
                                        },
                                      }
                                    );
                                  }}
                                >
                                  <small
                                    style={{
                                      fontSize: "0.9rem",
                                    }}
                                  >
                                    {item?.productId?.type?.flavour
                                      ? item?.productId?.type?.flavour
                                      : item?.productId?.unitName?.slice(0, 30)}
                                    ..
                                  </small>
                                </a>
                                <h3 className="title ">
                                  <a className="text-decoration-none">
                                    {item?.productId?.unitName?.slice(0, 30)}...
                                  </a>
                                </h3>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section
            className="product_show_home"
            id="bottom-image"
            style={{
              backgroundImage: `url(${
                allHeaders?.bottomImage ? allHeaders?.bottomImage : image
              })`,
            }}
          >
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-12">
                  <div className="w-100 mb-5">
                    <img
                      className="border rounded b"
                      src={
                        allHeaders?.foreground ??
                        require("../../assets/img/logo.png")
                      }
                      alt=""
                    />
                  </div>
                  <Link
                    className="comman_btn2"
                    to={`/app/ProductSearch/${"sugar" + " " + "daddy"}`}
                    state={"loo"}
                    targe=""
                  >
                    Shop Now
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {hotSell?.length > 0 && (
            <section className="p-4 container ">
              <div className=" ">
                <div className="row featuredproduct_slider">
                  <div className="col-12 mb-2 mt-4">
                    <div className="comn_heads mb-5">
                      <h2>Hot selling products</h2>

                      <a
                        className="view_all mb-5"
                        onClick={() =>
                          navigate("/app/HotSelling-products", { state: "hii" })
                        }
                      >
                        View All
                        <img
                          class="ms-2"
                          src={require("../../assets/img/arrow_colr.png")}
                          alt=""
                        ></img>
                      </a>
                    </div>
                  </div>
                  <div className="">
                    <Swiper
                      slidesPerView={width <= 1400 ? 3 : 4}
                      spaceBetween={30}
                      navigation={true}
                      autoplay={{
                        delay: 5000,
                        disableOnInteraction: true,
                        reverseDirection: true,
                        waitForTransition: true,
                      }}
                      loop={true}
                      style={{ padding: "30px" }}
                      modules={[FreeMode, Pagination, Autoplay, Navigation]}
                      className="mySwiper pt-5"
                    >
                      {(hotSell || [])?.map((item, index) => (
                        <SwiperSlide key={index} className="px-3 main_hot">
                          <div className="col-md-12 col-lg-12 px-2">
                            <div className="card_hot shadow">
                              <div
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
                                  maxHeight: "18rem",
                                  height: "14rem",
                                  position: "relative",
                                  top: "1rem",
                                }}
                              >
                                <div
                                  className="item-image"
                                  onClick={() => {
                                    navigate(
                                      `/AllProducts/Product/${item?.productId?.slug}`,
                                      {
                                        state: {
                                          type: item?.productId?.type,
                                          offer: item?.price,
                                        },
                                      }
                                    );
                                  }}
                                ></div>
                              </div>
                              <div className="item-content text-center mt-0 fw-bold">
                                <h3 className="fw-bold">
                                  {" "}
                                  {item?.productId?.unitName?.slice(0, 35)}
                                  {/* <p className="">
                                  {item?.productId?.type?.flavour?.slice(0, 30)}
                                  ..
                                </p> */}
                                </h3>{" "}
                                <p className="mb-4">
                                  {" "}
                                  {item?.price ? "Offer price:" : ""}
                                  <span className=" mx-1 text-danger  fs-6 fw-bolder">
                                    {item?.price ? "$" + item.price : ""}
                                  </span>
                                </p>{" "}
                              </div>
                            </div>
                            <div className="product-action">
                              {" "}
                              <div className="product-action-style">
                                {" "}
                                <a
                                  onClick={() =>
                                    navigate(
                                      `/AllProducts/Product/${item?.productId?.slug}`,
                                      {
                                        state: {
                                          type: item?.productId?.type,
                                          offer: item?.price,
                                        },
                                      }
                                    )
                                  }
                                >
                                  {" "}
                                  <i className="fas fa-eye" />
                                </a>{" "}
                                <a
                                  onClick={() => {
                                    addToFav(
                                      item?.productId?._id,
                                      item?.productId?.type
                                    );
                                  }}
                                >
                                  <i className="fas fa-heart" />
                                </a>
                                <a
                                  onClick={() => {
                                    AddtoCart(
                                      item?.productId?._id,
                                      item?.productId?.type,
                                      item?.productId?.slug,
                                      item?.price
                                    );
                                  }}
                                >
                                  {" "}
                                  <i className="fas fa-shopping-cart" />
                                </a>{" "}
                              </div>{" "}
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                </div>
              </div>
            </section>
          )}

          {brands?.length > 0 && (
            <section className="category_newdesign">
              <div className="container">
                <div className="row newdesign_main bg-white">
                  <a
                    className="view_all"
                    onClick={() => navigate("/app/brands", { state: "hii" })}
                  >
                    View All{" "}
                    <img
                      style={{
                        height: "21px",
                      }}
                      class="ms-2"
                      src={require("../../assets/img/arrow_colr.png")}
                      alt=""
                    ></img>
                  </a>

                  <div className="col-12 mb-3">
                    <div className="comn_heads mb-5">
                      <h2
                        dangerouslySetInnerHTML={createMarkup(
                          allHeaders?.brandTitle
                        )}
                      ></h2>
                    </div>
                  </div>
                  <Swiper
                    slidesPerView={4}
                    spaceBetween={30}
                    navigation={true}
                    autoplay={true}
                    loop={true}
                    modules={[FreeMode, Pagination, Autoplay, Navigation]}
                    className="mySwiper px-4 py-2"
                  >
                    {(brands || [])?.map((item, index) => (
                      <SwiperSlide key={index}>
                        <div className="col-12 px-4">
                          <div className="categorynew_slider sliderbtns_design">
                            <a className="categorynew_box">
                              <div className="categorynew_img p-2">
                                <Link
                                  to={`/app/productBrands/${item?.slug}`}
                                  state={{ name: item?.brandName }}
                                >
                                  <img
                                    src={
                                      item?.brandImage
                                        ? item?.brandImage
                                        : require("./../../assets/img/product.jpg")
                                    }
                                    alt=""
                                  />
                                </Link>
                              </div>
                              <span> {item?.brandName}</span>
                            </a>
                          </div>
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>
            </section>
          )}
          <Footer />

          <button
            type="button"
            id="age_modal"
            className="btn btn-primary d-none"
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
          >
            Launch demo modal
          </button>

          <div
            className="modal "
            id="exampleModal"
            // tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog  modal-fullscreen">
              <div className="modal-content">
                <div className="modal-header modalHeadBg">
                  <h2 className="fw-bold mt-1 mx-2">
                    <img
                      src={require("../../assets/img/logo.png")}
                      width="170"
                      height="80"
                      alt="Brand"
                    ></img>
                  </h2>

                  <button
                    type="button"
                    className="btn-close fs-2 bg-white mx-0 d-none"
                    id="age_close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modalContent">
                  <AgeVerification ModalClose={ModalClose} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Modal
        open={open}
        onClose={handleClose}
        onEntered={handleEntered}
        onExited={() => {
          setRows(0);
        }}
        size="lg"
        position="center"
      >
        <Modal.Header>
          {/* <Modal.Title>Modal Title</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          {rows ? (
            <div>
              <LoginPOP getLoginCnfirm={getLoginCnfirm} />
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Loader size="md" />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Homepage;
