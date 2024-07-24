import React, { useEffect, useRef, useState } from "react";
import AppHeader from "./appHeader";
import AppFooter from "./appFooter";
import OwlCarousel from "react-owl-carousel";
import "owl.carousel/dist/assets/owl.carousel.css";
import { Link } from "react-router-dom";
import {
  getAllProducts,
  getBrands,
  getCategory,
  homeBanner,
  homeSearch,
  searchByBarcode,
} from "../httpServices/homeHttpService/homeHttpService";
import TopProduct from "./appTopProductComponent";
import { useNavigate } from "react-router-dom";
import { browserName } from "react-device-detect";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  appBrandProd,
  appCateProd,
  appFeaturedProd,
  appSubProd,
  searchKeyRemove,
} from "../../atom";
import Swal from "sweetalert2";
import PullToRefresh from "react-simple-pull-to-refresh";
import Skeleton from "react-loading-skeleton";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AppClosingOut from "./appClosingOut";
import AppHotDeals from "./appHotDeal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, FreeMode, Grid } from "swiper";

function AppHome() {

  const [banner, setBanner] = useState([]);
  const [category, setCategory] = useState([]);
  const [product, setProduct] = useState([]);
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState([]);
  const navigate = useNavigate();
  const [activePage, setActivePage] = useState(1);
  const [hideF, setHideF] = useState({ opacity: "1" });
  const TempToken = `${process.env.REACT_APP_APIENDPOINTNEW}user/newAuthToken`;
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const [tokenWeb, setTokenWeb] = useState(
    "6245268ah78a79a98da98da977d9d98d9898ad9d8ad"
  );
  const setData = useSetRecoilState(appCateProd);
  const setData2 = useSetRecoilState(appSubProd);
  const setData3 = useSetRecoilState(appBrandProd);
  const setData4 = useSetRecoilState(appFeaturedProd);
  const searchKey = useRecoilValue(searchKeyRemove);
  const setSearchKeyRemove = useSetRecoilState(searchKeyRemove);
  const [relateCate, setRelateCate] = useState([]);

  let image = require("../../assets/img/cate1.jpg");
  let image2 = require("../../assets/img/close2.jpg");
  let image3 = require("../../assets/img/featured.jpg");
  let image4 = require("../../assets/img/hot1.jpg");

  useEffect(() => {
    getBanner();
    getCategoryList();
    getTopProductList();
    getBrandList();
    setData([{ page: 1, sortBy: 1 }]);
    setData2([{ page: 1, sortBy: 1 }]);
    setData3([{ page: 1, sortBy: 1 }]);
    setData4([{ page: 1, sortBy: 1 }]);
    setTimeout(() => {
      setLoading(false);
    }, [5000]);
  }, []);


  useEffect(() => {
    getProductList();
  }, [search]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () =>
      document.removeEventListener("click", handleOutsideClick, true);
  }, []);

  const getProductList = async () => {
    const { data } = await homeSearch({
      search: search?.trim(),
      limit: 8,
    });
    if (!data.error) {
      setProduct(data.results.products);
      setRelateCate(data?.results?.subCategories);
    }
  };

  const getBanner = async () => {
    const { data } = await homeBanner();
    if (!data.error) {
      localStorage.setItem("banners", JSON.stringify(data?.results));
      setBanner(data.results);
      setBanner(JSON.parse(localStorage.getItem("banners")));
    }
  };

  const getCategoryList = async () => {
    const { data } = await getCategory(activePage);
    if (!data.error) {
      localStorage.setItem(
        "categories",
        JSON.stringify(data?.results?.categories)
      );
      setCategory(data.results?.categories);
      setCategory(JSON.parse(localStorage.getItem("categories")));
    }
  };

  const getTopProductList = async () => {
    const { data } = await getAllProducts();
    if (!data.error) {
      localStorage.setItem(
        "products",
        JSON?.stringify(data.results.slice(0, 4))
      );
      setProduct(data.results.slice(0, 4));
      setProduct(JSON.parse(localStorage.getItem("products")));
    }
  };

  const getBrandList = async () => {
    const { data } = await getBrands({
      page: 1,
    });
    if (!data.error) {
      let dataSS = data.results?.brands;
      let newData = dataSS?.filter((itm, idx) => !(idx > 20));
      setBrand(newData);
      setLoading(false);
    }
  };

  const searchProduct = async (e) => {
    console.log("njkjk");
    e.preventDefault();
    navigate("/app/product-by-search", { state: { search: search } });
  };

  const cameraScan = async () => {
    console.log("Clicked");
    if (window.flutter_inappwebview) {
      let Dd = await window.flutter_inappwebview.callHandler("scanBarcode");
      console.log(Dd, "barcode");
      if (Dd?.length) {
        const { data } = await searchByBarcode({
          barcode: Dd,
        });
        if (!data.error) {
          if (data?.results?.length)
            navigate(`/app/product-detail/${data?.results[0]?.slug}`, {
              state: {
                type: data.results[0]?.type,
              },
            });
          console.log(data);
        }
      }
    }
  };

  const microphoneSearch = async () => {
    setSearch("");
    if (window.flutter_inappwebview) {
      let Dd = await window.flutter_inappwebview.callHandler("micSearch");
      console.log(Dd, "hyiioioio");
      if (Dd?.length) {
        navigate("/app/product-by-search", { state: { search: Dd } });
      } else {
        Swal.fire({
          title: "Trouble in fetching product!",
          icon: "error",
          timer: 1000,
          confirmButtonText: "okay",
        });
      }
    }
  };
  const handleOutsideClick = (event) => {
    if (ref.current.contains(event.target)) {
      setSearch(null);
      document.getElementById("resetBtn").click();
    }
  };


  const redirectToWeb = async (token) => {
    console.log("testing");
    try {
      await window.flutter_inappwebview.callHandler(
        "openExternalBrowser",
        `https://starimporters.com/app/redirect/constantRedirect99/${
          tokenWeb || token
        }`
      );
    } catch (err) {
      console.log(err);
    }
    document.getElementById("modalCloseRD").click();
  };

  const genToken = async () => {
    const token = await axios.post(TempToken);
    console.log(token.data.results.token);
    setTokenWeb(token.data.results.token);
    if (token?.data.results.token) {
      redirectToWeb(token?.data.results.token);
    }
  };

 
  // const onFileSelection = async (event) => {
  //   let file = event[0];
  //   let formData = new FormData();
  //   formData.append("file", file);
  //   fetch("http://api.qrserver.com/v1/read-qr-code/", {
  //     method: "POST",
  //     body: formData,
  //   })
  //     .then((res) => res.json())
  //     .then((result) => {
  //       console.log(result);
  //     });
  // };

  const handleRefresh = () => {
    setTimeout(() => {
      window.location.reload(false);
    }, [500]);
  };
  return (
    <>
      <PullToRefresh
        className="mb-0 pb-0"
        onRefresh={handleRefresh}
        pullDownThreshold={60}
        maxPullDownDistance={110}
        pullingContent={
          <div className="text-center mt-2">
            {" "}
            <i class="fa-solid fa-arrow-down mx-2 mt-1"></i>Pull Down to Refresh
          </div>
        }
        resistance={7}
        refreshingContent={
          <div className=" pt-4">
            <div class="lds-roller ">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
        }>
        <div className="star_imp_app mt-0 ">
          <div>
            <AppHeader />
          </div>
          {loading ? (
            <div className="">
              <div className=" mt-0 ">
                <div>
                  <AppHeader />
                </div>
                <SkeletonTheme>
                  <div className="page-content-wrapper">
                    <div className="container ">
                      <div className=" pt-3 ">
                        <Skeleton height={28} />

                        <div className="alternative-search-options" />
                      </div>
                      {browserName === "WebKit" ||
                        (browserName === "Chrome WebView" && (
                          <div className="mt-2">
                            <Skeleton height={28} count={2} />
                          </div>
                        ))}
                    </div>
                    <div>
                      <div>
                        <div className="hero-wrapper">
                          <div className="container">
                            <div className="pt-3">
                              <Skeleton height={130} />
                            </div>
                          </div>
                        </div>
                        <div className="product-catagories-wrapper py-3">
                          <div className="container">
                            <div className=" d-flex align-items-center justify-content-between dir-rtl mt-3 mb-2">
                              <h2 className="fs-5">Top Categories</h2>
                              <a className="btn p-0" href="/app/Categories">
                                View All
                                <i className="ms-1 fa-solid fa-arrow-right-long" />
                              </a>
                            </div>
                            <div className="row g-2 rtl-flex-d-row-r">
                              <div className="col-4 ">
                                <Skeleton height={120} />
                              </div>
                              <div className="col-4 ">
                                <Skeleton height={120} />
                              </div>
                              <div className="col-4 ">
                                <Skeleton height={120} />
                              </div>
                              <div className="col-4 ">
                                <Skeleton height={120} />
                              </div>
                              <div className="col-4 ">
                                <Skeleton height={120} />
                              </div>
                              <div className="col-4 ">
                                <Skeleton height={120} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SkeletonTheme>
              </div>
            </div>
          ) : (
            <div className="page-content-wrapper">
              <div className="container ">
                <div
                  className={
                    browserName === "WebKit" || browserName === "Chrome WebView"
                      ? "search-form pt-3 "
                      : "search-new pt-3 "
                  }>
                  <form className="" style={{ width: "100%" }}>
                    <input
                      className="form-control"
                      type="search"
                      defaultValue={search}
                      placeholder={"   " + "Search in Star Importers"}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setSearchKeyRemove(false);
                      }}
                    />

                    <button onClick={searchProduct} className="me-5">
                      <i className="fa-solid fa-magnifying-glass"></i>
                    </button>
                    <button type="reset" id="resetBtn" className="d-none">
                      reset
                    </button>
                  </form>

                  {browserName === "WebKit" ||
                  browserName === "Chrome WebView" ? (
                    <div className="alternative-search-options">
                      <Link
                        className="comman_btn text-white ms-1"
                        to=""
                        onClick={microphoneSearch}>
                        <i className="fa-solid fa-microphone"></i>
                      </Link>
                      <a
                        className="comman_btn2 ms-1"
                        onClick={() => cameraScan()}>
                        <i className="fa fa-qrcode"></i>
                      </a>
                    </div>
                  ) : (
                    <div className="alternative-search-options"></div>
                  )}
                </div>
              </div>
              {/* {browserName === "WebKit" || browserName === "Chrome WebView" ? (
                <div>
                  {search?.length || relateCate?.length >= 1 ? (
                    <div className="top-products-area py-1">
                      <div className="container">
                        <div className="section-heading d-flex align-items-center justify-content-between dir-rtl mb-1">
                          <p className="mt-0 mb-4">
                            Showing results for "{search}"
                          </p>
                        </div>

                        {search === "Tobacco" ||
                        search === "Tobacco " ||
                        search === "tobacco" ||
                        search === "Tobacc " ||
                        search === "Tobacc " ||
                        search === "tobaco" ||
                        search === "tobacco " ||
                        search === "tobac" ||
                        search === "tobacc" ||
                        search === "smoke" ||
                        search === "cigars" ||
                        search === "Cigerettes" ||
                        search === "vapes" ? (
                          <div className="text-center">
                            <img
                              src={require("../../assets/img/noitem.png")}></img>
                            <a className="fw-bold mx-2" onClick={genToken}>
                              Click Here
                            </a>
                            to buy Tobacco & Vapes related Products from our
                            website.
                          </div>
                        ) : null}

                        {relateCate?.length >= 1 ? (
                          <>
                            Related Sub-Categories
                            <div className=" mb-2">
                              {relateCate
                                ?.filter(
                                  (itm, idx) =>
                                    itm.categoryName !=
                                      "639a042ff2f72167b43774de" &&
                                    itm.categoryName !=
                                      "639a7617f2f72167b4377754" &&
                                    itm.isTobacco != true
                                )
                                .map((itm, ind) => (
                                  <span
                                    className=" text-primary  fw-bold"
                                    style={{
                                      fontSize: "12px",
                                    }}
                                    onClick={() => {
                                      navigate(
                                        `/app/product-subCategory/${itm?.subCategoryName}`,
                                        {}
                                      );
                                    }}>
                                    {itm?.subCategoryName &&
                                      itm?.subCategoryName}{" "}
                                    ,
                                  </span>
                                ))}
                            </div>
                          </>
                        ) : (
                          ""
                        )}

                        {product?.length ? (
                          <div className="row g-2">
                            {(product || [])
                              ?.filter(
                                (itm, idx) =>
                                  itm.category != "639a042ff2f72167b43774de" &&
                                  idx < 10 &&
                                  itm.category != "639a7617f2f72167b4377754" &&
                                  itm.isTobaccoProduct != true
                              )
                              .map((item, index) => {
                                return (
                                  <div className="col-6 col-md-4" key={index}>
                                    <div className="card product-card">
                                      <div className="card-body">
                                        <Link
                                          className="product-thumbnail d-block"
                                          to={`/app/product-detail/${item?.slug}`}
                                          state={{ type: item?.type }}>
                                          <img
                                            className="mb-2"
                                            src={
                                          
                                              item?.productImage ||
                                              require("../../assets/img/product.jpg")
                                            }
                                            alt=""
                                          />
                                        </Link>

                                        <Link
                                          className="product-title"
                                          to={`/app/product-detail/${item.slug}`}
                                          state={{ type: item?.type }}>
                                         
                                          {item?.unitName}
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        ) : (
                          <div>
                            <img
                              className="no-data"
                              src={require("../../assets/img/no-data.gif")}
                            />
                            <h1 className="text-center"> No Product Results</h1>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="hero-wrapper">
                        <div className="container">
                          {browserName === "WebKit" ||
                          browserName === "Chrome WebView" ? (
                            <div
                              class="marquee text-center mb-0"
                              onClick={genToken}>
                              <div class="marquee__inner mb-0">
                                <p class=" mt-2">
                                  <strong className="text-primary">
                                    Click here
                                  </strong>{" "}
                                  to buy Tobacco & Vapes related Products from
                                  our website.
                                </p>
                              </div>
                            </div>
                          ) : null}
                          <div className="hero-wrapper">
                            <OwlCarousel
                              className=" hero-slides "
                              autoplay={true}
                              autoplayHoverPause={false}
                              autoplayTimeout={5000}
                              dots={true}
                              loop={true}
                              nav={false}
                              fade={true}
                              items={1}>
                              <div className="single-hero-slide item">
                                <img
                                  src={
                                    banner[1]?.banner
                                      ? banner[1]?.banner
                                      : require("../../assets/img/staticBg.png")
                                  }></img>
                                <div className="slide-content h-100 d-flex align-items-center"></div>
                              </div>

                              {banner
                                ?.filter(
                                  (itm, idx) =>
                                    idx !== 1 &&
                                    idx !== 0 &&
                                    idx !== 7 &&
                                    idx !== 6
                                )
                                .map((item) => {
                                  return (
                                    <div className="single-hero-slide item">
                                      <img src={item?.banner}></img>
                                      <div className="slide-content h-100 d-flex align-items-center">
                                      </div>
                                    </div>
                                  );
                                })}
                            </OwlCarousel>
                          </div>
                        </div>
                      </div>

                      <div
                        className="product-catagories-wrapper py-1 pb-3  mt-4"
                        style={{
                          backgroundImage: `url(${image})`,
                          opacity: "unset",
                        }}>
                        <div className="container">
                          <div className=" d-flex align-items-center justify-content-between dir-rtl mt-3 mb-2">
                            <h2 className="fs-5 fw-bold text-white">
                              Top Categories
                            </h2>
                            <Link
                              className="btn p-0 text-white"
                              to="/app/Categories">
                              View All
                              <i className="ms-1 fa-solid fa-arrow-right-long"></i>
                            </Link>
                          </div>
                          <div className="row g-2 rtl-flex-d-row-r">
                            {category
                              .filter(
                                (itm, idx) =>
                                  itm._id != "639a042ff2f72167b43774de" &&
                                  idx < 8 &&
                                  itm._id != "639a7617f2f72167b4377754" &&
                                  itm.isTobacco != true
                              )
                              .map((item, index) => {
                                return (
                                  <div className="col-4 d-flex align-items-stretch">
                                    <div className="card catagory-card w-100">
                                      <div className="card-body px-2">
                                        <Link
                                          to={`/app/Sub-Categories/${item._id}`}>
                                          <img
                                            src={item?.categoryImage}
                                            alt=""
                                          />
                                          <span>{item?.categoryName}</span>
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      </div>

                      <div
                        className="mt-1 py-2"
                        style={{
                          backgroundImage: `url(${image4})`,
                          backgroundPosition: "center",
                          opacity: "unset",
                          backgroundSize: "cover",
                        }}>
                        <AppHotDeals />
                      </div>

                      <div
                        className="mt-1 py-2"
                        style={{
                          backgroundImage: `url(${image2})`,
                          backgroundPosition: "center",
                          opacity: "unset",
                          backgroundSize: "cover",
                        }}>
                        <AppClosingOut />
                      </div>
                      <div
                        className="mt-1 py-2"
                        style={{
                          backgroundImage: `url(${image3})`,
                          backgroundPosition: "center",
                          opacity: "unset",
                          backgroundSize: "cover",
                        }}>
                        <TopProduct />
                      </div>

                      <div className="flash-sale-wrapper mt-3">
                        <div className="container">
                          <div className="d-flex align-items-center justify-content-between rtl-flex-d-row-r mt-2 mb-3">
                            <h6 className="fs-5">Popular Brands</h6>
                            <Link className="btn p-0" to="/app/brands">
                              View All
                              <i className="ms-1 fa-solid fa-arrow-right-long"></i>
                            </Link>
                          </div>
                          {brand?.length ? (
                            <Swiper
                              slidesPerView={3}
                              spaceBetween={6}
                              autoplay={{
                                delay: 3000,
                                disableOnInteraction: true,
                                reverseDirection: true,
                                waitForTransition: true,
                              }}
                              loop={true}
                              modules={[
                                FreeMode,
                                Pagination,
                                Autoplay,
                                Navigation,
                              ]}
                              className="mySwiper">
                              {(brand || [])
                                ?.filter((itm, idx) => itm.isTobacco != true)
                                .map((item, index) => (
                                  <SwiperSlide key={index} className="main_hot">
                                    <div class="">
                                      <div class="card product-card w-100">
                                        <div class="card-body">
                                          <Link
                                            class="product-thumbnail d-block"
                                            to="/app/brands">
                                            <img
                                              class="mb-2"
                                              style={{
                                                height: "4rem",
                                              }}
                                              src={
                                                item?.brandImage
                                                  ? item?.brandImage
                                                  : require("../../assets/img/product.jpg")
                                              }
                                              alt="Product Image not updated"
                                            />
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </SwiperSlide>
                                ))}
                            </Swiper>
                          ) : (
                            ""
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : ( */}
              
              <div>
                {search?.length || relateCate?.length >= 1 ? (
                  <div className="top-products-area py-1">
                    <div className="container">
                      {relateCate?.length >= 1 ? (
                        <>
                          Related Sub-Categories
                          <div className=" mb-2">
                            {relateCate?.map((itm, ind) => (
                              <span
                                className=" text-primary  fw-bold"
                                style={{
                                  fontSize: "12px",
                                }}
                                onClick={() => {
                                  navigate(
                                    `/app/product-subCategory/${itm?.subCategoryName}`,
                                    {}
                                  );
                                }}>
                                {itm?.subCategoryName && itm?.subCategoryName} ,
                              </span>
                            ))}
                          </div>
                        </>
                      ) : (
                        ""
                      )}

                      {product?.length ? (
                        <div className="row g-2">
                          {(product || [])?.map((item, index) => {
                            return (
                              <div className="col-6 col-md-4" key={index}>
                                <div className="card product-card">
                                  <div className="card-body">
                                    <Link
                                      className="product-thumbnail d-block"
                                      to={`/app/product-detail/${item.slug}`}
                                      state={{ type: item?.type }}>
                                      <img
                                        className="mb-2"
                                        src={
                                          // item?.type.flavourImage
                                          //   ? item?.type.flavourImage
                                          //   :
                                          item?.productImage ||
                                          require("../../assets/img/product.jpg")
                                        }
                                        alt=""
                                      />
                                    </Link>

                                    <Link
                                      className="product-title"
                                      to={`/app/product-detail/${item?.slug}`}
                                      state={{ type: item?.type }}>
                                      {/* {item.unitName + "-" + item?.type.flavour} */}
                                      {item?.unitName}
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div>
                          <img
                            className="no-data"
                            src={require("../../assets/img/no-data.gif")}
                          />
                          <h1 className="text-center"> No Product Results</h1>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="hero-wrapper">
                      <div className="container">
                        <div className="pt-3 px-0">
                          <OwlCarousel
                            className=" hero-slides "
                            autoplay={true}
                            autoplayHoverPause={false}
                            autoplayTimeout={5000}
                            dots={true}
                            loop={true}
                            nav={false}
                            fade={false}
                            items={1}>
                            <div className="single-hero-slide item">
                              <img
                                src={
                                  banner[1]?.banner
                                    ? banner[1]?.banner
                                    : require("../../assets/img/staticBg.png")
                                }></img>
                            </div>
                            <div className="single-hero-slide item">
                              <img
                                src={
                                  banner[2]?.banner
                                    ? banner[2]?.banner
                                    : require("../../assets/img/staticBg.png")
                                }></img>
                            </div>
                            <div className="single-hero-slide item">
                              <img
                                src={
                                  banner[3]?.banner
                                    ? banner[3]?.banner
                                    : require("../../assets/img/staticBg.png")
                                }></img>
                            </div>
                            <div className="single-hero-slide item">
                              <img
                                src={
                                  banner[4]?.banner
                                    ? banner[4]?.banner
                                    : require("../../assets/img/staticBg.png")
                                }></img>
                            </div>
                            <div className="single-hero-slide item">
                              <img
                                src={
                                  banner[5]?.banner
                                    ? banner[5]?.banner
                                    : require("../../assets/img/staticBg.png")
                                }></img>
                            </div>
                          </OwlCarousel>
                        </div>
                      </div>
                    </div>

                    <div
                      className="product-catagories-wrapper py-1 pb-3  mt-4"
                      style={{
                        backgroundImage: `url(${image})`,
                        opacity: "unset",
                      }}>
                      <div className="container">
                        <div className=" d-flex align-items-center justify-content-between dir-rtl mt-3 mb-2">
                          <h2 className="fs-5 fw-bold text-white">
                            Top Categories
                          </h2>
                          <Link
                            className="btn p-0 text-white"
                            to="/app/Categories">
                            View All
                            <i className="ms-1 fa-solid fa-arrow-right-long"></i>
                          </Link>
                        </div>
                        <div className="row g-2 rtl-flex-d-row-r">
                          {category
                            .filter((itm, idx) => idx < 6)
                            .map((item, index) => {
                              return (
                                <div className="col-4 d-flex align-items-stretch">
                                  <div className="card catagory-card w-100">
                                    <div className="card-body px-2">
                                      <Link
                                        to={`/app/Sub-Categories/${item._id}`}>
                                        <img src={item?.categoryImage} alt="" />
                                        <span>{item?.categoryName}</span>
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    </div>

                    <div
                      className="mt-1 py-2"
                      style={{
                        backgroundImage: `url(${image4})`,
                        backgroundPosition: "center",
                        opacity: "unset",
                        backgroundSize: "cover",
                      }}>
                      <AppHotDeals />
                    </div>

                    <div
                      className="mt-1 py-2"
                      style={{
                        backgroundImage: `url(${image2})`,
                        backgroundPosition: "center",
                        opacity: "unset",
                        backgroundSize: "cover",
                      }}>
                      <AppClosingOut />
                    </div>
                    <div
                      className="mt-1 py-2"
                      style={{
                        backgroundImage: `url(${image3})`,
                        backgroundPosition: "center",
                        opacity: "unset",
                        backgroundSize: "cover",
                      }}>
                      <TopProduct />
                    </div>

                    <div className="flash-sale-wrapper py-2  pb-3 shadow">
                      <div className="container">
                        <div className="d-flex align-items-center justify-content-between rtl-flex-d-row-r mt-2 mb-3">
                          <h6 className="fs-5">Popular Brands</h6>
                          <Link className="btn p-0" to="/app/brands">
                            View All
                            <i className="ms-1 fa-solid fa-arrow-right-long"></i>
                          </Link>
                        </div>

                        {brand?.length ? (
                          <Swiper
                            slidesPerView={3}
                            spaceBetween={6}
                            autoplay={{
                              delay: 3000,
                              disableOnInteraction: true,
                              reverseDirection: true,
                              waitForTransition: true,
                            }}
                            loop={true}
                            modules={[
                              FreeMode,
                              Pagination,
                              Autoplay,
                              Navigation,
                            ]}
                            className="mySwiper">
                            {(brand || [])?.map((item, index) => (
                              <SwiperSlide key={index} className="main_hot">
                                <div class="">
                                  <div class="card product-card w-100">
                                    <div class="card-body">
                                      <Link
                                        class="product-thumbnail d-block"
                                        to="/app/brands">
                                        <img
                                          class="mb-2"
                                          style={{
                                            height: "4rem",
                                          }}
                                          src={
                                            item?.brandImage
                                              ? item?.brandImage
                                              : require("../../assets/img/product.jpg")
                                          }
                                          alt="Product Image not updated"
                                        />
                                      </Link>
                                    </div>
                                  </div>
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        ) : (
                          ""
                        )}
                      </div>
                      {/* <small>{deviceId}</small> */}
                    </div>
                  </div>
                )}
              </div>
              {/* )} */}
            </div>
          )}

          <div ref={ref} style={{ opacity: `${hideF.opacity}` }}>
            <AppFooter />
          </div>

          <div
            class="modal "
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="staticBackdropLabel">
                    Please Confirm !
                  </h5>
                  <button
                    type="button"
                    class="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    id="modalCloseRD"></button>
                </div>
                <div class="modal-body">Open website in External Browser.</div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    id="modalCLose">
                    Close
                  </button>
                  <Link
                    // to={}

                    class="btn btn-primary">
                    Confirm
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </PullToRefresh>
    </>
  );
}

export default AppHome;
