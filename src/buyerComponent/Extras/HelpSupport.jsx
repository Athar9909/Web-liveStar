import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Homepage/Navbar";
import axios from "axios";
import image from "../../assets/img/starBgg.jpg";
import Starlogo from "../../assets/img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Carousel from "react-grid-carousel";
import moment from "moment";
import Footer from "../Footer/Footer";


const HelpSupport = () => {
  const allContent = `${process.env.REACT_APP_APIENDPOINTNEW}user/getAllContent`;
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [flyers, setFlyers] = useState([]);
  const [contents, setContents] = useState([]);

  useEffect(() => {
    getContent();
  }, []);

  const getContent = async () => {
    const { data } = await axios.get(allContent);
    console.log(data);
    if (!data.error) {
      setContents(data?.results?.help);
    }
  };

  return (
    <div>
      <div className="">
        <Navbar />

        <section
          className="marginTop bg-white"
          style={{
            backgroundImage: `url(${require("../../assets/img/10173.jpg")})`,
            // backgroundPosition: "center",
            backgroundSize: "350% 200%",
          }}>
          <>
            {loader ? (
              <div id="loader-wrapper">
                <div id="loader" />
                <div className="loader-section section-left" />
                <div className="loader-section section-right" />
              </div>
            ) : (
              <div>
                <>
                  <section
                    className="comman_banner"
                    style={{
                      backgroundImage: "url(assets/images/product_bg.png)",
                    }}>
                    <div className="container">
                      <div className="row">
                        <div className="col-12">
                          <h1>Hello, what can we help you find? </h1>
                          <div className="breadcrumbs mt-2">
                            <nav aria-label="breadcrumb">
                              <ol className="breadcrumb mb-0">
                                <li className="breadcrumb-item">
                                  <a href="javscript:;">Home</a>
                                </li>
                                <li
                                  className="breadcrumb-item active"
                                  aria-current="page">
                                  Help
                                </li>
                              </ol>
                            </nav>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                  <section className="help_support py-5">
                    <div className="container">
                      <div className="row">
                        {contents?.map((item, index) => (
                          <section className="mt-2">
                            {(item?.type === "PDF" && (
                              <div className="col-md-6 mb-4">
                                <div className="row comman_divvision px-md-5 px-4 mx-0">
                                  <div className="col-12">
                                    <div className="comn_heads mb-5">
                                      <h2>Review our Website ?</h2>
                                    </div>
                                  </div>
                                  <div className="col-12">
                                    <div className="help_boxx">
                                      <div className="help_boxx_img">
                                        <img
                                          src={require("../../assets/img/pdf.png")}
                                          alt=""
                                        />
                                      </div>
                                      <h3>Download Instruction PDF</h3>
                                      <p>Fooloeosfdfldkfdlfkldlkjfladfkldsjf</p>
                                      <div className="row mt-4">
                                        <div className="col-md-6">
                                          <a
                                            className="download_btn"
                                            href="javascript:;">
                                            Download Pdf
                                          </a>
                                        </div>
                                        <div className="col-md-6">
                                          <a
                                            className="download_btn1"
                                            href="javascript:;">
                                            View Tutorial
                                          </a>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )) ||
                              (index % 2 == 0 && (
                                <div className="col-md-12 mb-4">
                                  <div className="row comman_divvision mx-0 support_box px-md-5 px-4 align-items-center">
                                    <div className="col-md-4">
                                      <div className="videoimg">
                                        {item?.type === "VIDEO" ? (
                                          <video
                                            id="frameFour"
                                            className="main_video bg-dark"
                                            autoPlay
                                            loop
                                            controls={true}
                                            oncanplay="this.muted=true"
                                            muted={true}
                                            preload="auto">
                                            <source src={item?.content} />
                                          </video>
                                        ) : (
                                          <img
                                            src={
                                              item?.content
                                                ? item?.content
                                                : require("../../assets/img/bg2.jpg")
                                            }
                                            alt="website template image"
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-8">
                                      <div className="comn_heads text-start ps-md-5">
                                        <h2>
                                          How to Subscribe our newsletter ?
                                        </h2>
                                        <p>
                                          Step 2 : dolor sit amet consectetur
                                          adipisicing elit. Corrupti dolorem eum
                                          consequuntur ipsam repellat dolor
                                          soluta aliquid laborum, eius odit
                                          consectetur vel quasi in quidem,
                                          eveniet ab est corporis tempore.
                                        </p>
                                        <a href="javascript:;">Read More</a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )) ||
                              (index % 2 != 0 && (
                                <div className="col-md-12 mb-4">
                                  <div className="row comman_divvision mx-0 support_box px-md-5 px-4 align-items-center">
                                    <div className="col-md-4">
                                      <div className="videoimg">
                                        {item?.type === "VIDEO" ? (
                                          <video
                                            id="frameFour"
                                            className="main_video bg-dark"
                                            autoPlay
                                            loop
                                            controls={true}
                                            oncanplay="this.muted=true"
                                            muted={true}
                                            preload="auto">
                                            <source src={item?.content} />
                                          </video>
                                        ) : (
                                          <img
                                            src={
                                              item?.content
                                                ? item?.content
                                                : require("../../assets/img/bg2.jpg")
                                            }
                                            alt="website template image"
                                          />
                                        )}
                                      </div>
                                    </div>
                                    <div className="col-md-8">
                                      <div className="comn_heads text-start ps-md-5">
                                        <h2>How to login ? </h2>
                                        <p>
                                          Step 2 : dolor sit amet consectetur
                                          adipisicing elit. Corrupti dolorem eum
                                          consequuntur ipsam repellat dolor
                                          soluta aliquid laborum, eius odit
                                          consectetur vel quasi in quidem,
                                          eveniet ab est corporis tempore.{" "}
                                        </p>
                                        <a href="javascript:;">Read More</a>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </section>
                        ))}
                      </div>
                    </div>
                  </section>
                </>

                <Footer />
              </div>
            )}
          </>
        </section>
      </div>

      {/* <section class="">
        <div className="">
          <header class="site-header shadow">
            <div class="site-identity">
              <Link className="bg-white" to="/app/home">
                <img
                  style={{
                    width: "8rem",
                    height: "4rem",
                  }}
                  src={Starlogo}
                  alt="Site Name"
                />
              </Link>
              <h1>Star Importers & Wholesalers</h1>
            </div>
            <nav class="site-navigation">
              <ul class="nav">
              <li>
                  <Link className="text-decoration-none text-dark" to="/app/events/catelog&flyer">Home</Link>
                </li>
                <li>
                  <Link className="text-decoration-none text-dark" to="/app/events/catelog&flyer/All-Catalogs">Catalogs</Link>
                </li>
                <li>
                  <Link className="text-decoration-none text-dark" to="/app/events/catelog&flyer/All-Flyers">Monthly Flyers</Link>
                </li>
                <li>
                  <Link className="text-decoration-none text-dark" to="/app/about-us">About Us</Link>
                </li>
              </ul>
            </nav>
          </header>
          <div className="bg-white">
            <iframe
              src="https://8f920893-trial.flowpaper.com/fileexamplePDF500kB/"
              width="100%"
              height="630"
              allowFullScreen></iframe>
          </div>
        </div>
  
      </section> */}
    </div>
  );
};

export default HelpSupport;
