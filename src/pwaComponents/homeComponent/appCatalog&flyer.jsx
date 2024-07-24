import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Animate from "../../Animate";
import {
  deleteCart,
  deleteQuote,
  getCart,
  getQuotes,
  updateCart,
  updateQuote,
} from "../httpServices/homeHttpService/homeHttpService";
import AppFooter from "./appFooter";
import WebHeader2 from "./webHeader2";

function AppCatalogFlyer() {
  let ref = useRef();

  const allPdf = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getCatalog`;
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const [flyers, setFlyers] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [change, setChange] = useState(true);

  useEffect(() => {
    getCatalogs();
    getFLyers();
  }, []);

  const getCatalogs = async () => {
    const { data } = await axios.post(allPdf, {
      type: "catalog",
    });
    console.log(data);
    if (!data.error) {
      setCatalogs(data?.results?.catalog);
    }
  };

  const getFLyers = async () => {
    const { data } = await axios.post(allPdf, {
      type: "flyer",
    });
    console.log(data);
    if (!data.error) {
      setFlyers(data?.results?.catalog);
    }
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
      <div className="star_imp_app">
        <div class="header-area" id="headerArea" ref={ref}>
          <div class="container h-100 d-flex align-items-center justify-content-between rtl-flex-d-row-r">
            <div class="back-button me-2 me-2">
              <Link to="/app/home">
                <i className="fa-solid fa-house"></i>
              </Link>
            </div>

            <div id="container">
              <div class="inner-container">
                {change ? (
                  <>
                    <div
                      class="toggle"
                      style={{ backgroundColor: "#eb3237" }}
                      onClick={() => {
                        setChange(true);
                      }}>
                      <p className="text-white fw-bold">Catalogs</p>
                    </div>
                    <div
                      class="toggle"
                      onClick={() => {
                        setChange(false);
                      }}>
                      <p className="text-dark fw-bold">Flyers</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div
                      class="toggle"
                      onClick={() => {
                        setChange(true);
                      }}>
                      <p className="text-dark fw-bold">Catalogs</p>
                    </div>
                    <div
                      class="toggle"
                      style={{ backgroundColor: "#eb3237" }}
                      onClick={() => {
                        setChange(false);
                      }}>
                      <p className="text-white fw-bold">Flyers</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div
              class="suha-navbar-toggler ms-2"
              data-bs-toggle="offcanvas"
              data-bs-target="#suhaOffcanvas"
              aria-controls="suhaOffcanvas">
              <div>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <WebHeader2 />
        <div className="page-content-wrapper2">
          <div className="container">
            <div className="cart-wrapper-area py-3">
              {(change ? catalogs : flyers)?.length > 0 ? (
                <div className="row mx-0 justify-content-center mb-3 ">
                  {(change ? catalogs : flyers || [])?.map((item, ind) => (
                    <div className="col-sm-5 col-md-5 col-5 mb-2 p-2 m-2 brands_box shadow">
                      <Link
                        to={`/app/webView`}
                        target="_blank"
                        state={item?.url}
                        className="text-center mt-4">
                        <div>
                          <img
                            loading="lazy"
                            src={
                              item?.coverImage
                                ? item?.coverImage
                                : require("../../assets/img/iconCata.png")
                            }
                            alt=""
                          />
                        </div>
                        <p
                          className="text-center mt-2"
                          style={{ fontSize: "13px" }}>
                          {item?.title}
                        </p>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  <div className="row mx-0 justify-content-center mb-3 ">
                    <div className="col-sm-6 col-md-12 col-12 mb-2 p-2 m-2 brands_box shadow">
                      No Data Found!
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>{" "}
        <AppFooter />
      </div>
    </>
  );
}

export default AppCatalogFlyer;
