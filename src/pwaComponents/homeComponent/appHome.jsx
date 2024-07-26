import React, { useEffect, useRef, useState } from "react";
import AppHeader from "./appHeader";
import AppFooter from "./appFooter";
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
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  appBrandProd,
  appCateProd,
  appFeaturedProd,
  appSubProd,
  searchKeyRemove,
} from "../../atom";
import PullToRefresh from "react-simple-pull-to-refresh";
import Skeleton from "react-loading-skeleton";
import { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import AppClosingOut from "./appClosingOut";
import AppHotDeals from "./appHotDeal";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, FreeMode, Grid } from "swiper";
import { Carousel } from "react-responsive-carousel";
import Search from "./search";
import AppMonthly from "./appMonthly";
import AppNewArrivals from "./appNewArrivals";

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
  const setData = useSetRecoilState(appCateProd);
  const setData2 = useSetRecoilState(appSubProd);
  const setData3 = useSetRecoilState(appBrandProd);
  const setData4 = useSetRecoilState(appFeaturedProd);
  const searchKey = useRecoilValue(searchKeyRemove);
  const setSearchKeyRemove = useSetRecoilState(searchKeyRemove);
  const [relateCate, setRelateCate] = useState([]);

  let image5 = require("../../assets/img/viewAll.png");

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

  const redirectToWeb = async (url) => {
    await window.flutter_inappwebview.callHandler("External_Page", url);
  };

  const microphoneSearch = async () => {
    setSearch("");
    if (window.flutter_inappwebview) {
      let Dd = await window.flutter_inappwebview.callHandler("micSearch");
      console.log(Dd, "hyiioioio");
      if (Dd?.length) {
        navigate("/app/product-by-search", { state: { search: Dd } });
      } else {
        window.location.reload(false);
      }
    }
  };

  const handleOutsideClick = (event) => {
    if (ref.current.contains(event.target)) {
      setSearch(null);
      document.getElementById("resetBtn").click();
    }
  };

  const handleRefresh = () => {
    setTimeout(() => {
      window.location.reload(false);
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
      }, [1000]);
    }, [500]);
  };

  const getSearch = (data) => {
    setSearch(data);
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
        }
      >
        <div className="bg-white mt-0 ">
          {loading ? (
            <div className="">
              <div className=" mt-0 ">
                <div>
                  <AppHeader />
                </div>

                <SkeletonTheme>
                  <div className="page-content-wrapper mt-0">
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
            <div className="page-content-wrapper2 mb-5 mt-0 bg-white">
              <div>
                <AppHeader />
              </div>
              <Search/>
              {!search?.length && (
                <div>
                  <div>
                    <div className="hero-wrapper bg-white">
                      <div className="container">
                        {browserName === "WebKit" ||
                        browserName === "Chrome WebView" ? (
                          <div className="pt-1 px-0 mb-1">
                            <Carousel
                              showThumbs={false}
                              showIndicators={false}
                              // onChange={onHoverMain}
                              autoFocus={false}
                              autoPlay={true}
                              showStatus={false}

                              // selectedItem={itemNo}
                            >
                              {banner
                                ?.filter((itm, id) => id != 0 && id < 6)
                                ?.map((item) => (
                                  <div
                                    className=" item slider_image"
                                    onClick={() => {
                                      item?.isExternalURL
                                        ? redirectToWeb(item?.url)
                                        : navigate("/" + item?.url?.slice(26));
                                    }}
                                  >
                                    <img
                                      className="banner_slider_img"
                                      src={
                                        item?.banner
                                          ? item?.banner
                                          : require("../../assets/img/staticBg.png")
                                      }
                                      alt=""
                                    />
                                  </div>
                                ))}
                            </Carousel>
                          </div>
                        ) : (
                          <div className="pt-1 px-0 mb-1">
                            <Carousel
                              showThumbs={false}
                              showIndicators={false}
                              // onChange={onHoverMain}
                              autoFocus={false}
                              autoPlay={true}
                              showStatus={false}

                              // selectedItem={itemNo}
                            >
                              {banner
                                ?.filter((itm, id) => id != 0 && id < 6)
                                ?.map((item) => (
                                  <div
                                    className=" item slider_image"
                                    onClick={() => {
                                      window.location.href = item?.url;
                                    }}
                                  >
                                    <img
                                      className="banner_slider_img"
                                      src={
                                        item?.banner
                                          ? item?.banner
                                          : require("../../assets/img/staticBg.png")
                                      }
                                      alt=""
                                    />
                                  </div>
                                ))}
                            </Carousel>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="product-catagories-wrapper py-1 pb-3  mt-4">
                      <div className="container">
                        <div className=" d-flex align-items-center justify-content-between dir-rtl  mb-2">
                          <h2 className="fs-6 fw-bold text-dark">
                            Top Categories
                          </h2>
                          <Link
                            className="btn p-0 text-white"
                            to="/app/Categories"
                          >
                            View All
                            <i className="ms-1 fa-solid fa-arrow-right-long"></i>
                          </Link>
                        </div>
                        <div className="row g-2 rtl-flex-d-row-r">
                          {category
                            ?.filter((itm, idx) =>
                              browserName === "WebKit" ||
                              browserName === "Chrome WebView"
                                ? itm && idx < 7
                                : itm && idx < 7
                            )
                            ?.map((item, index) => {
                              return (
                                <div className="col-3  justify-content-center">
                                  <div
                                    className="catagory-card"
                                    onClick={() => {
                                      navigate(
                                        `/app/Sub-Categories/${item._id}`
                                      );
                                    }}
                                    style={{
                                      backgroundImage: `url(${item?.categoryImage})`,
                                      backgroundPosition: "center",
                                      opacity: "unset",
                                      backgroundSize: "cover",
                                    }}
                                  ></div>

                                  <div className="text-start">
                                    <span
                                      style={{
                                        marginTop: "4px",
                                        marginLeft: "3px",
                                        fontSize: "11px",
                                        lineHeight: "15px",
                                        display: "block",
                                      }}
                                    >
                                      {item?.categoryName}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          <div className="col-3 justify-content-center ">
                            <div
                              className="catagory-card"
                              onClick={() => {
                                navigate("/app/Categories");
                              }}
                              style={{
                                backgroundImage: `url(${image5})`,
                                backgroundPosition: "center",
                                opacity: "unset",
                                backgroundSize: "cover",
                              }}
                            ></div>
                            <div className="text-center">
                              <span
                                style={{
                                  marginTop: "4px",
                                  marginLeft: "-30%",
                                  fontSize: "11px",
                                  lineHeight: "15px",
                                  display: "block",
                                }}
                              >
                                {" "}
                                View All{"    "}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className=" py-2">
                      <AppNewArrivals />
                    </div>
                    <AppMonthly />

                    <AppClosingOut />

                    <div className=" py-2">
                      <TopProduct />
                    </div>

                    <AppHotDeals />
                    <div className="flash-sale-wrapper py-2  pb-3  shadow mb-0">
                      <div className="container">
                        <div className="d-flex align-items-center justify-content-between rtl-flex-d-row-r mt-2 mb-3">
                          <h6 className="fs-6 fw-bold">Popular Brands</h6>
                          <Link
                            className="btn p-0"
                            to="/app/brands"
                            state={{ ki: "kjh" }}
                          >
                            View All
                            <i className="ms-1 fa-solid fa-arrow-right-long"></i>
                          </Link>
                        </div>

                        {brand?.length ? (
                          <Swiper
                            slidesPerView={4}
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
                            className="mySwiper"
                          >
                            {console.log(browserName)}
                            {(brand || [])
                              ?.filter((itm, idx) =>
                                browserName === "WebKit" ||
                                browserName === "Chrome WebView"
                                  ? itm
                                  : itm
                              )
                              ?.map((item, index) => (
                                <SwiperSlide key={index} className="main_hot">
                                  <div class="">
                                    <div
                                      onClick={() => {
                                        navigate("/app/brands", {
                                          state: "kjh",
                                        });
                                      }}
                                      class="catagory-card w-100"
                                      style={{
                                        backgroundImage: `url(${
                                          item?.brandImage
                                            ? item?.brandImage
                                            : require("../../assets/img/product.jpg")
                                        })`,
                                        backgroundPosition: "center",
                                        opacity: "unset",
                                        backgroundSize: "cover",
                                      }}
                                    ></div>
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
                </div>
              )}
            </div>
          )}

          <div
            ref={ref}
            style={{ opacity: `${hideF.opacity}` }}
            className="mt-0"
          >
            <AppFooter />
          </div>

          <div
            class="modal "
            id="staticBackdrop"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            tabindex="-1"
            aria-labelledby="staticBackdropLabel"
            aria-hidden="true"
          >
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
                    id="modalCloseRD"
                  ></button>
                </div>
                <div class="modal-body">Open website in External Browser.</div>
                <div class="modal-footer">
                  <button
                    type="button"
                    class="btn btn-secondary"
                    data-bs-dismiss="modal"
                    id="modalCLose"
                  >
                    Close
                  </button>
                  <Link
                    // to={}

                    class="btn btn-primary"
                  >
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
