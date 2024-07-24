import React, { useEffect, useState } from "react";import logo from "../../../assets/img/star_logo.png";
import print from "../../../assets/img/printer-line.svg";
import leftLine from "../../../assets/img/skip-left-line.svg";
import full from "../../../assets/img/fullscreen-exit-line.svg";
import rightLine from "../../../assets/img/skip-right-line.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../../assets/css/flip.css";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const PreviewCate = () => {
  const getTemp = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/viewTemplate/`;
  const [flipKey, setFlipKey] = useState(Math.random());
  const [zoom, setZoom] = useState(1); // Initial zoom level

  let { id } = useParams();
  const [templatePreview, setTemplatePreview] = useState([]);
  const [pageS, setPageS] = useState(0);
  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");

  const navigate = useNavigate();
  useEffect(() => {
    GetTemplates();
  }, []);
  console.log(pageS, "ola");

  var pages = document.getElementsByClassName("page");

  const GetTemplates = async () => {
    await axios.get(getTemp + id).then((res) => {
      let data = res?.data.results?.catalog?.pages;
      setTemplatePreview(data);
      setFlipKey(Math.random());

      for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        if (i % 2 === 0) {
          page.style.zIndex = pages.length - i;
        }
      }

      for (var i = 0; i < pages.length; i++) {
        pages[i].pageNum = i + 1;
        console.log(pages[i], "ll");

        pages[i].onclick = function () {
          if (this.pageNum % 2 === 0) {
            setPageS(this.pageNum);
            this.classList.remove("flipped");
            this.previousElementSibling.classList.remove("flipped");
          } else {
            console.log(this.pageNum, "okayN");
            this.classList.add("flipped");
            this.nextElementSibling.classList.add("flipped");
          }
        };
      }
    });
  };

  const handleNext = () => {
    document.getElementById(pageS).click();
    setPageS(pageS + 2);
  };

  const handlePrev = () => {
    document.getElementById(pageS - 1).click();
    setPageS(pageS - 2);
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom * 1.4); // Increase zoom level by 20%
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => (prevZoom > 0.2 ? prevZoom * 0.8 : prevZoom)); // Decrease zoom level by 20%, with a minimum of 20%
  };

  let handle = useFullScreenHandle();
  return (
    <div key={flipKey}>
      <div className="star_catalog bg-white">
        <div className="star_header border-bottom">
          <div className="row align-items-center">
            <div className="col-lg-2 col-md-auto">
              <div className="star_logo">
                <img src={logo} alt="" />
              </div>
              <button onClick={() => handleZoomIn()}>
                <i class="icon-zoom-in"></i>{" "}
              </button>
              <button onClick={() => handleZoomOut()}>
                <i class="icon-zoom-in"></i>{" "}
              </button>
            </div>
            <div className="col">
              <div className="star_catalog_menus">
                <div className="catalog_menus_inner">
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Print"
                    className="meeenus"
                    onClick={() =>
                      navigate(`/Catelog-Flyers/PreviewPrint-Catalog/${id}`)
                    }
                  >
                    <img src={print} alt="" />
                  </a>
                </div>
                <div className="catalog_pagination">
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Click this button to view this previous page"
                    onClick={() => handlePrev()}
                  >
                    <img src={leftLine} alt="" />
                  </a>
                  <div className="form-group mt-3" key={pageS}>
                    <input
                      className="form-control"
                      type="text"
                      value={`${pageS}-${pageS + 1}`}
                      disabled
                    />
                  </div>
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    onClick={() => handleNext()}
                    title="Click this button to view this Next page"
                  >
                    <img src={rightLine} alt="" />
                  </a>
                </div>
                <div className="catalog_menus_inner">
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Full Screen"
                    className="meeenus"
                    onClick={handle.enter}
                  >
                    <img src={full} alt="" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-auto">
              <div className="full_screen text-end"></div>
            </div>
          </div>
        </div>

        <div className="star_catalog bg-white">
          <FullScreen handle={handle}>
            <div className="star_catalog_inner position-relative">
              <div className="book ">
                <div id="pages" className="pages">
                  {templatePreview?.map((item, index) => (
                    <>
                      {(item?.type === "Intro" && (
                        <div className="page shadow" key={index}>
                          <button id={index} className="d-none">
                            <img className="rightLine" src={rightLine} alt="" />
                          </button>

                          <div className="first_page">
                            <img
                              className="bg_img"
                              src={item?.backgroundImage}
                              alt=""
                            />
                            <img
                              className="qr_img"
                              src={item?.qrImage}
                              alt=""
                            />
                          </div>
                        </div>
                      )) ||
                        (item?.type === "ProductListing" && (
                          <div className="page shadow text-center">
                            <button id={index} className="d-none">
                              <img
                                className="rightLine"
                                src={rightLine}
                                alt=""
                              />
                            </button>

                            <div
                              className="comman_inner_bg"
                              style={{
                                backgroundImage: `url(${item?.backgroundImage})`,
                              }}
                            >
                              {console.log(
                                item?.products,
                                typeof item?.products
                              )}
                              <div className="comman_head">
                                <h2>
                                  {item?.pageTitle === "undefined"
                                    ? ""
                                    : item?.pageTitle}
                                </h2>
                              </div>
                              <div className="product_main mx-2">
                                {item?.products
                                  ?.filter((item, ind) => ind < 20)
                                  ?.map((itm, id) => (
                                    <div className="product_box">
                                      <Link
                                        className="main_products"
                                        to={`/AllProducts/Product/${itm?.productId?.slug}`}
                                        target="_blank"
                                      >
                                        <div className="product_img">
                                          <img
                                            src={
                                              itm?.productId?.productImage
                                                ? itm?.productId?.productImage
                                                : require("../../../assets/img/product.jpg")
                                            }
                                            alt=""
                                          />
                                        </div>
                                        <h2>
                                          {itm?.productId?.unitName?.slice(
                                            0,
                                            20
                                          )}
                                        </h2>
                                      </Link>
                                    </div>
                                  ))}
                              </div>
                              <div className="bottom_line text-center">
                                {item?.footer === "undefined"
                                  ? ""
                                  : item?.footer}
                              </div>
                            </div>
                          </div>
                        )) ||
                        (item?.type === "Banner" && (
                          <div className="page shadow">
                            <button id={index} className="d-none">
                              <img
                                className="rightLine"
                                src={rightLine}
                                alt=""
                              />
                            </button>

                            <div
                              className="comman_inner_bg"
                              style={{
                                backgroundImage: `url(${item?.backgroundImage})`,
                              }}
                            >
                              <div className="comman_head">
                                <h2>
                                  {item?.pageTitle == "undefined"
                                    ? ""
                                    : item?.pageTitle}
                                </h2>
                              </div>
                              <div className="wholesale_main text-center">
                                <Link
                                  to={item?.bannerURL1}
                                  className="wholesale_img"
                                >
                                  <img src={item?.banners[0]} alt="" />
                                </Link>
                                <Link
                                  to={item?.bannerURL1}
                                  className="wholesale_img"
                                >
                                  <img src={item?.banners[1]} alt="" />
                                </Link>
                                <Link
                                  to={item?.bannerURL1}
                                  className="wholesale_img"
                                >
                                  <img src={item?.banners[2]} alt="" />
                                </Link>

                                <div className="bottom_line text-center">
                                  {item?.footer === "undefined"
                                    ? ""
                                    : item?.footer}
                                </div>
                              </div>
                            </div>
                          </div>
                        )) ||
                        (item?.type === "ProductDetail" && (
                          <div className="page shadow">
                            <button id={index} className="d-none">
                              <img
                                className="rightLine"
                                src={rightLine}
                                alt=""
                              />
                            </button>

                            <div
                              className="comman_inner_bg"
                              style={{
                                backgroundImage: `url(${item?.backgroundImage})`,
                              }}
                            >
                              <div className="comman_head">
                                <h2>
                                  {item?.pageTitle == "undefined"
                                    ? ""
                                    : item?.pageTitle}
                                </h2>
                              </div>

                              <div className="product_shooww text-center">
                                <div className="row justify-content-center text-center">
                                  <div className="col-12 ">
                                    <Link
                                      to={`/AllProducts/Product/${item?.productId?.slug}`}
                                      target="_blank"
                                    >
                                      <img
                                        className="product_logo_img"
                                        src={item?.productLogo ?? ""}
                                        alt=""
                                      />
                                    </Link>
                                  </div>
                                </div>
                                <div className="row products_div">
                                  <div className="col-6">
                                    <div className="row">
                                      {item?.productId?.type
                                        ?.filter((val, id) => id < 4)
                                        ?.map((itm, ind) => (
                                          <div className="col-md-6">
                                            <Link
                                              to={`/AllProducts/Product/${item?.productId?.slug}`}
                                              state={{
                                                type: itm,
                                              }}
                                              target="_blank"
                                              className="product_shooww_img text-center"
                                            >
                                              <img
                                                src={itm?.flavourImage}
                                                alt=""
                                              />
                                              {/* <div className="show_details_flav">
                                                {itm?.flavour} <br />{" "}
                                              </div> */}
                                            </Link>
                                          </div>
                                        ))}
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <Link
                                      to={`/AllProducts/Product/${item?.productId?.slug}`}
                                      target="_blank"
                                      className="product_logo"
                                    >
                                      <img
                                        src={item?.productId?.productImage}
                                        alt=""
                                      />
                                      <div className=" mt-2 fs-4 text-center">
                                        {item?.productId?.unitName} <br />
                                      </div>
                                    </Link>
                                  </div>
                                </div>
                                <div className="bottom_line text-center">
                                  {item?.footer === "undefined"
                                    ? ""
                                    : item?.footer}
                                </div>
                              </div>
                            </div>
                          </div>
                        )) ||
                        (item?.type === "Summary" && (
                          <div className="page shadow">
                            <button id={index} className="d-none">
                              <img
                                className="rightLine"
                                src={rightLine}
                                alt=""
                              />
                            </button>

                            <div
                              className="comman_inner_bg"
                              style={{
                                backgroundImage: `url(${item?.backgroundImage})`,
                              }}
                            >
                              <div className="comman_head">
                                <h2>
                                  {item?.pageTitle == "undefined"
                                    ? ""
                                    : item?.pageTitle}
                                </h2>
                              </div>
                              <div className="wholesale_main_summary text-center">
                                <Link to={item?.bannerURL1} className="d-none">
                                  <video
                                    className="main_video_summary "
                                    autoPlay
                                    loop
                                    oncanplay="this.muted=true"
                                    muted={true}
                                    preload="auto"
                                  >
                                    <source
                                      src={
                                        "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                                      }
                                    />
                                  </video>
                                </Link>

                                <Link
                                  to={item?.bannerURL1}
                                  className="wholesale_img"
                                >
                                  <img src={item?.banners[0]} alt="" />
                                </Link>

                                <Link
                                  to={item?.bannerURL2}
                                  className="wholesale_img"
                                >
                                  <img src={item?.banners[1]} alt="" />
                                </Link>

                                <Link
                                  to={item?.bannerURL3}
                                  className="wholesale_img"
                                >
                                  <img src={item?.banners[2]} alt="" />
                                </Link>

                                <div className="bottom_line text-center">
                                  {item?.footer === "undefined"
                                    ? ""
                                    : item?.footer}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </>
                  ))}
                  <div className="page shadow bg-white"></div>
                </div>
              </div>
              <div>
                <a className="arrow_btn  next_btn" onClick={() => handleNext()}>
                  <img src={rightLine} alt="" />
                </a>
                <a className=" arrow_btn prev_btn" onClick={() => handlePrev()}>
                  <img src={leftLine} alt="" />
                </a>
              </div>
            </div>
          </FullScreen>
        </div>
      </div>
    </div>
  );
};

export default PreviewCate;
