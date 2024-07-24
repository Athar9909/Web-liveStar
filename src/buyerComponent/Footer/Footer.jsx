import React, { useState } from "react";
import "../../assets/css/main.css";
import { AiFillTwitterCircle } from "react-icons/ai";
import { AiFillLinkedin } from "react-icons/ai";
import { IconContext } from "react-icons";
import { Link, useNavigate } from "react-router-dom";
import ScrollToTop from "react-scroll-to-top";

const Footer = () => {
  const [state, setState] = useState(false);
  const navigate = useNavigate();
  <IconContext.Provider value={{ color: "red" }}>
    <AiFillLinkedin />
    <AiFillTwitterCircle />
  </IconContext.Provider>;

  let Nstate = localStorage?.getItem("letter");
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("letter", state);
    window.location.reload(false);
  };
  
  return (
    <div>
      {Nstate ? null : (
        <section className="section newsletter_section">
          <div className="container">
            <div className="row align-items-center">
              {Nstate ? null : (
                <div className="col-md-6">
                  <div className="news_leter_heading">
                    <h3>Subscribe Our Newsletter</h3>
                  </div>
                </div>
              )}

              <div className="col-md-6">
                {Nstate ? (
                  <div className="news_leter_heading">
                    <h3> &#10003; Thank you for Subscribing our newsletter.</h3>
                    <small className="" style={{ marginLeft: "35px" }}>
                      You will get all our notifications on your email.
                    </small>
                  </div>
                ) : (
                  <div className="newsletter_form">
                    <form
                      className="form-design d-flex"
                      onSubmit={handleSubmit}
                    >
                      <input
                        type="email"
                        className="form-control rounded-0 shadow-none"
                        placeholder="Enter Email Address"
                        required
                      />
                      <button
                        type="submit"
                        className="btn btn-dark rounded-0"
                        name="submit"
                        value="Submit"
                        onClick={() => setState(!state)}
                      >
                        Subscribe
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="footer_dark">
        <div className="footer_top">
          <div className="container">
            <div className="row">
              <div className="col-lg-4 col-md-12 text-white text-lg-start text-md-center">
                <div className="widget">
                  <div className="mb-2">
                    <Link className="text-decoration-none" to="">
                      <img
                        src={require("../../assets/img/logo.png")}
                        width={150}
                        alt="logo"
                      />
                    </Link>
                  </div>
                  <p>
                    Thank you for visiting Star Importers. We look forward to
                    serve you best and helping your business.
                  </p>
                </div>
              </div>
              <div className="col-lg-4 col-md-4 col-sm-6 text-white">
                <div className="widget">
                  <h6 className="widget_title">Useful Links</h6>
                  <ul className="widget_links">
                    
                    <li>
                      <Link
                        className="text-decoration-none"
                        to={"/app/home"}
                        state={"JII"}
                      >
                        Home{" "}
                      </Link>
                    </li>

                    <li>
                      <Link
                        className="text-decoration-none"
                        to="/app/Gallery"
                        state={"JII"}
                      >
                        News and Events{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-decoration-none"
                        to="/app/events/catelog&flyer"
                        state={"JII55"}
                      >
                        Catalog and Flyers
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-decoration-none"
                        to="/app/brands"
                        state={"JII"}
                      >
                        Brands{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-decoration-none"
                        to="/Terms&Condition"
                        state={"hissds"}
                      >
                        Terms & Conditions{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-decoration-none"
                        to="/PrivacyPolicies"
                        state={"hidsds"}
                      >
                        Privacy Policies{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-decoration-none"
                        to="/AboutUs"
                        state={"hisads"}
                      >
                        About Us{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-decoration-none"
                        to="/Contact"
                        state={"hidss"}
                      >
                        Contact Us{" "}
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-decoration-none"
                        to="/app/consent-form"
                        state={"hidss"}
                      >
                        Consent Form{" "}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="col-lg-4 col-md-4 col-sm-6 text-white">
                <div className="widget">
                  <h6 className="widget_title">Contact Info</h6>
                  <ul className="contact_info contact_info_light">
                    <li>
                      <i className="fas fa-map-signs" />
                      <p>
                        {" "}
                        2166 Mountain Industrial Blvd, Tucker, GA 30084, United
                        States
                      </p>
                    </li>

                    <li>
                      <i className="fas fa-phone-alt" />
                      <p>+1 770-908-0404</p>
                    </li>
                    <li>
                      <i className="fa fa-envelope" />
                      <p>websupport@starimporters.com</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bottom_footer border-top-tran text-white">
          <div className="container">
            <div className="row justify-content-between">
              <div className="col-md-8">
                <p className="mb-md-0 text-center text-md-start">
                  ©2022 All Rights Reserved by Star Importers
                </p>
              </div>

              <div className="col-md-4 d-flex ">
                <div className="col-auto mx-2">
                  <a
                    className="appdownload_btn"
                    target="_blank"
                    href="https://play.google.com/store/apps/details?id=com.star_importers"
                  >
                    <img
                      src={require("../../assets/img/play-store.png")}
                      alt=""
                    />
                  </a>
                </div>
                <div className="col-auto">
                  <a
                    className="appdownload_btn"
                    target="_blank"
                    href="https://apps.apple.com/app/star-importers-wholesalers/id6447689704"
                  >
                    <img
                      src={require("../../assets/img/app-store.png")}
                      alt=""
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ScrollToTop
        smooth
        color="#fff"
        top={1000}
        style={{
          background: "#eb3237",
          borderRadius: "50%",
          height: "40px",
          width: "45px",
          zIndex: "999",
        }}
      />
    </div>
  );
};

export default Footer;
