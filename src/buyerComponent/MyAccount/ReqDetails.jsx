import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Homepage/Navbar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "../../assets/css/main.css";
import axios from "axios";
import moment from "moment";
import Swal from "sweetalert2";

const RequestDetails = () => {
  const getQuoteDetails = `${process.env.REACT_APP_APIENDPOINTNEW}user/quotes/singleRequest`;
  const addInCart = `${process.env.REACT_APP_APIENDPOINTNEW}user/quotes/quoteToCart`;
  const placeOrder = `${process.env.REACT_APP_APIENDPOINTNEW}/user/quotes/quoteToCart/`;
  const [quoteDetails, setQuoteDetails] = useState([]);
  let location = useLocation();
  let navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    const GetQuote = async () => {
      await axios
        .post(getQuoteDetails, {
          quoteId: id,
        })
        .then((res) => {
          setQuoteDetails(res?.data.results?.quotes);
        });
    };
    GetQuote();
  }, []);

  const addToCart = async () => {
    const { data } = await axios.get(addInCart + "/" + quoteDetails?._id);
    if (!data.error) {
      navigate("/app/cart");
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
  };

  return (
    <div className="main_myaccount">
      <Navbar />
      <section className="comman_banner _banner marginTop">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1>My Account</h1>
              <div className="breadcrumbs mt-2">
                <nav aria-label="breadcrumb">
                  <ol class="breadcrumb mb-0">
                    <li className="item_nanner">
                      <Link
                        to=""
                        className="text-decoration-none text-white fs-6  ">
                        Home <span className="arrow mx-1">&#9679;</span>{" "}
                      </Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      <Link
                        to=""
                        className="text-decoration-none text-white fs-6 mx-1">
                        My Account
                      </Link>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="myaccount mb-4 ">
        <div className="container container-sm ">
          <div className="row mt-5  justify-content-center ">
            <div className="col-xl-12 col-md-12 col-sm-9 ">
              <div className="col-12  justify-content-between mb-3">
                <Link
                  className="comman_btn2 text-decoration-none fs-6"
                  to="/app/checkout"
                  state={{ type: "quote", id: quoteDetails?._id }}>
                  Place your Order
                </Link>

                <a>
                  <Link
                    className="comman_btn2 text-decoration-none mx-2 fs-6"
                    onClick={addToCart}>
                    Add to Cart
                  </Link>
                </a>
              </div>
              <div className="bg-white p-4 shadow">
                <div className="tab-content" id="nav-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="nav-home"
                    role="tabpanel"
                    aria-labelledby="nav-home-tab">
                    <div className="col-xl-12 justify content center">
                      <div className="bg-white p-4">
                        <div className="tab-content" id="nav-tabContent">
                          <div
                            className="tab-pane fade show active"
                            id="nav-home"
                            role="tabpanel"
                            aria-labelledby="nav-home-tab">
                            <div className="row">
                              <div className="col-12 mb-3">
                                <div className="order_heading">
                                  <h2>
                                    Request Details : {quoteDetails?.status}
                                  </h2>
                                </div>
                              </div>
                              <div class="col-12 mt-3 mb-4">
                                <div class="row mx-0 border rounded pt-4 p-3 position-relative">
                                  <span class="small_header">
                                    Request Details
                                  </span>
                                  <div class="col-4 ">
                                    <div class="row">
                                      <div class="col-6">
                                        <span class="data_main">
                                          Request Date:{" "}
                                          {moment(
                                            quoteDetails?.createdAt?.slice(
                                              0,
                                              10
                                            )
                                          ).format("MM/DD/YYYY")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="col-4">
                                    <div class="row">
                                      <div class="col-6">
                                        <span class="data_main">
                                          Request Id : {quoteDetails?.quoteId}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div class="col-4">
                                    <div class="row">
                                      <div class="col text-center">
                                        <span class="data_main">
                                          Total Products :{" "}
                                          {quoteDetails?.products?.length}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="col-12 mb-2">
                                <div className="cart_table">
                                  <div className="table-responsive">
                                    <table className="table">
                                      <thead>
                                        <tr>
                                          <th>
                                            Items{" "}
                                            <a
                                              className="filter_table"
                                              href="javscript:;"
                                            />
                                          </th>
                                          <th>Quantity</th>
                                          <th>Total(Usd)</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {(quoteDetails?.products || [])?.map(
                                          (item, index) => (
                                            <tr key={index}>
                                              <td>
                                                <div className="row align-items-center flex-lg-wrap flex-md-nowrap flex-nowrap">
                                                  <div className="col-auto">
                                                    <span className="cart_product">
                                                      <img
                                                        src={
                                                          item?.flavour?._id
                                                            ? item?.flavour
                                                                ?.flavourImage
                                                            : item?.productId
                                                                ?.productImage
                                                        }
                                                        alt=""
                                                      />
                                                    </span>
                                                  </div>
                                                  <div className="col">
                                                    <div className="cart_content">
                                                      <h3>
                                                        {item?.flavour?._id
                                                          ? item?.productId
                                                              ?.unitName +
                                                            "-" +
                                                            item?.flavour
                                                              ?.flavour
                                                          : item?.productId
                                                              ?.unitName}
                                                      </h3>
                                                      <p>
                                                        Bar Code:{" "}
                                                        {item?.flavour?.barcode.map(
                                                          (item) => (
                                                            <li>{item}</li>
                                                          )
                                                        )}
                                                      </p>
                                                      <span className="ordertext my-2 d-block ">
                                                        Price : ${item?.price}
                                                      </span>
                                                    </div>
                                                  </div>
                                                </div>
                                              </td>
                                              <td>
                                                <span className="quantity_text">
                                                  {item?.quantity}
                                                </span>
                                              </td>
                                              <td>
                                                <span className="quantity_text">
                                                  $
                                                  {item?.price * item?.quantity}
                                                </span>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RequestDetails;
