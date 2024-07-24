import React, { useEffect, useState } from "react";import rightLine from "../../../assets/img/skip-right-line.svg";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import "../../../assets/css/flip.css";
const PreviewPrint = () => {
  const getTemp = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/viewTemplate/`;
  let { id } = useParams();
  const [templatePreview, setTemplatePreview] = useState([]);
  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");

  useEffect(() => {
    GetTemplates();
  }, []);

  const GetTemplates = async () => {
    await axios.get(getTemp + id).then((res) => {
      let data = res?.data.results?.catalog?.pages;
      setTemplatePreview(data);
    });
  };

 

  return (
    <div>
      <div className="star_catalog bg-white">
        <div className="star_catalog bg-white">
          <div className="star_catalog_inner position-relative">
            <div className="Print_main">

            {/* <button>Generate PDF</button> */}
              <div className="pagesPrint"  id="pdfContent">
                {templatePreview?.map((item, index) => (
                  <>
                    {(item?.type === "Intro" && (
                      <div className="print_page shadow" key={index}>
                        <button id={index} className="d-none">
                          <img className="rightLine" src={rightLine} alt="" />
                        </button>

                        <div className="first_page">
                          <img
                            className="bg_img"
                            src={item?.backgroundImage}
                            alt=""
                          />
                          <img className="qr_img" src={item?.qrImage} alt="" />
                        </div>
                      </div>
                    )) ||
                      (item?.type === "ProductListing" && (
                        <div className="  print_pageshadow text-center">
                          <button id={index} className="d-none">
                            <img className="rightLine" src={rightLine} alt="" />
                          </button>

                          <div
                            className="comman_inner_bg"
                            style={{
                              backgroundImage: `url(${item?.backgroundImage})`,
                            }}
                          >
                            {console.log(item?.products, typeof item?.products)}
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
                                        {itm?.productId?.unitName?.slice(0, 20)}
                                      </h2>
                                    </Link>
                                  </div>
                                ))}
                            </div>
                            <div className="bottom_line text-center">
                              {item?.footer === "undefined" ? "" : item?.footer}
                            </div>
                          </div>
                        </div>
                      )) ||
                      (item?.type === "Banner" && (
                        <div className="  print_pageshadow">
                          <button id={index} className="d-none">
                            <img className="rightLine" src={rightLine} alt="" />
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
                        <div className="  print_pageshadow">
                          <button id={index} className="d-none">
                            <img className="rightLine" src={rightLine} alt="" />
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
                        <div className="  print_pageshadow">
                          <button id={index} className="d-none">
                            <img className="rightLine" src={rightLine} alt="" />
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewPrint;
