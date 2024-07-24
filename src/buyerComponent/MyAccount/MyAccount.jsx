import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Homepage/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/main.css";
import axios from "axios";
import Profile from "./Profile";
import moment from "moment";

import RequestOrders from "./RequestOrder";
import Address from "./Address";
import Account from "./Account";
import Favourites from "./Favourites";
import BuyAgain from "./BuyAgain";

const MyAccount = () => {
  const [users, setUsers] = useState([]);
  const userApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/getUserProfile`;
  const getOrder = `${process.env.REACT_APP_APIENDPOINTNEW}user/order/getOrder`;
  const [orderDetails, setOrderDetails] = useState([]);
  axios.defaults.headers.common["x-auth-token-user"] =
    localStorage.getItem("loginToken");
  let token = localStorage.getItem("token-user");
  const navigate = useNavigate();
  useEffect(() => {
    const GetOrders = async () => {
      await axios.get(getOrder).then((res) => {
        setOrderDetails(res?.data.results?.orders);
      });
    };
    GetOrders();
    getUser();
  }, []);

  const getUser = async () => {
    await axios.get(userApi).then((res) => {
      setUsers(res?.data.results);
    });
  };
  console.log(users);
  return (
    <div className="main_myaccount">
      <Navbar />

      <section
        class="comman_banner _banner marginTop"
        // style="background-image: url(assets/images/product_bg.png);"
      >
        <div class="container">
          <div class="row">
            <div class="col-12">
              <h1>My Account</h1>
              <div class="breadcrumbs mt-2">
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

      <div className="myacctnew-page mb-4 ">
        <div className="container">
          <Profile />
        </div>
        <div className="container">
          <div className="row flex-lg-nowrap myacct_main align-items-start">
            <div className="col-md-3 widht_mng ">
              <div class="account-tabss">
                <div
                  class="nav flex-column nav-pills"
                  id="v-pills-tab"
                  role="tablist"
                  aria-orientation="vertical">
                  <button
                    class="nav-link active"
                    id="v-pills-home-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-home"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-home"
                    aria-selected="true">
                    <div class="tab_img">
                      <img
                        src={require("../../assets/img/order-approve.png")}
                        alt=""
                      />
                    </div>{" "}
                    My Order
                  </button>

                  {users?.multipleUsers ? (
                    <button
                      class="nav-link"
                      id="store-pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#store-pills-profile"
                      type="button"
                      role="tab"
                      aria-controls="store-pills-profile"
                      aria-selected="false">
                      <div class="tab_img">
                        <i class="fa fa-store"></i>
                      </div>
                      My Stores
                    </button>
                  ) : null}

                  {users?.quotation ? (
                    <button
                      class="nav-link"
                      id="v-pills-profile-tab"
                      data-bs-toggle="pill"
                      data-bs-target="#v-pills-profile"
                      type="button"
                      role="tab"
                      aria-controls="v-pills-profile"
                      aria-selected="false">
                      <div class="tab_img">
                        <img
                          src={require("../../assets/img/question-answer.png")}
                          alt=""
                        />
                      </div>
                      My Quotation
                    </button>
                  ) : null}

                  <button
                    class="nav-link"
                    id="v-pills-messages-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-messages"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-messages"
                    aria-selected="false">
                    <div class="tab_img">
                      <img
                        src={require("../../assets/img/address-book.png")}
                        alt=""
                      />
                    </div>{" "}
                    Address Book
                  </button>

                  <button
                    class="nav-link"
                    id="v-pills-settings-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-settings"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-settings"
                    aria-selected="false">
                    <div class="tab_img">
                      <img
                        src={require("../../assets/img/settings.png")}
                        alt=""
                      />
                    </div>
                    Account Settings
                  </button>

                  <button
                    class="nav-link"
                    id="v-pills-fav-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-fav"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-fav"
                    aria-selected="false">
                    <div class="tab_img">
                      <img
                        src={require("../../assets/img/cards-playing.png")}
                        alt=""
                      />
                    </div>{" "}
                    My Favorites
                  </button>

                  <button
                    class="nav-link"
                    id="v-pills-buy-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#v-pills-buy"
                    type="button"
                    role="tab"
                    aria-controls="v-pills-buy"
                    aria-selected="false">
                    <div class="tab_img">
                      <img src={require("../../assets/img/buy.png")} alt="" />
                    </div>
                    Buy Again
                  </button>

                </div>
              </div>
            </div>
            <div className="col-md-9 widht_mng_r">
              {token ? (
                <div className="myacct_data">
                  <div className="tab-content" id="nav-tabContent">
                    <div
                      class="tab-pane fade show active"
                      id="v-pills-home"
                      role="tabpanel"
                      aria-labelledby="v-pills-home-tab">
                      <div class="myacct_data_inner">
                        <div class="row">
                          <div class="col-12 data_head mb-4">
                            <h2>My order</h2>
                          </div>
                          {(orderDetails || [])?.map((item, index) => (
                            <div class="col-md-6 mb-4">
                              <div
                                class="order-new-box"
                                onClick={() =>
                                  navigate(`/app/order-detail/${item?._id}`)
                                }
                                // state={{ id: item?._id }}
                              >
                                <div class="row">
                                  <div class="col-6 mb-1 pe-0">
                                    <div class="orderID">
                                      Order ID: <strong>{item?.orderId}</strong>
                                    </div>
                                  </div>
                                  <div class="col-6 mb-1">
                                    <div class="status-box">
                                      Status: <span>{item?.status}</span>
                                    </div>
                                  </div>
                                  <div class="col-12 mb-2">
                                    <div class="datee_part">
                                      {moment(
                                        item?.createdAt?.slice(0, 10)
                                      ).format("MM/DD/YYYY")}
                                    </div>
                                  </div>
                                  <div class="col-12 items_part">
                                    <div class="items_head">Items:</div>
                                    {(item?.products || []).map((item, ind) => (
                                      <ul className="list-unstyled mb-0">
                                        <li key={ind}>
                                          <strong>
                                            {item?.flavour?._id
                                              ? item?.productId?.unitName +
                                                "-" +
                                                item?.flavour?.flavour
                                              : item?.productId?.unitName}
                                          </strong>
                                        </li>
                                      </ul>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div
                      class="tab-pane fade show"
                      id="store-pills-profile"
                      role="tabpanel"
                      aria-labelledby="store-pills-profile-tab">
                      <div class="myacct_data_inner">
                        <div class="row">
                          <div class="col-12 data_head mb-4">
                            <h2>My Stores</h2>
                          </div>
                          {(users?.subAccounts || [])?.map((item, index) => (
                            <div
                              class="col-md-6 mb-4"
                              onClick={() => {
                                navigate(`/Account/Store/View/${item?._id}`, {
                                  state: users?._id,
                                });
                              }}>
                              <div
                                class="order-new-box"

                                // state={{ id: item?._id }}
                              >
                                <div class="row">
                                  <div class="col-12 mb-1 pe-0">
                                    <div class="orderID fw-bold">
                                      Company Name:{" "}
                                      <strong>{item?.companyName}</strong>
                                    </div>
                                  </div>

                                  <div class="col-8  ">
                                    <div class="orderID fw-bold">
                                      User Name :
                                      <strong>
                                        {" "}
                                        {item?.firstName + " " + item?.lastName}
                                      </strong>
                                    </div>
                                  </div>
                                  <div class="col-4  ">
                                    <div class="orderID fw-bold">
                                      <i class="fa-solid fa-phone"></i>:
                                      <strong>
                                        {item?.businessPhoneNumber}
                                      </strong>
                                    </div>
                                  </div>
                                  <div class="col-12  mt-2 ">
                                    <div class="orderID fw-bold">
                                      Address :
                                      <strong>{item?.addressLine1}</strong>
                                      <strong>-{item?.addressLine2}</strong>
                                      <strong>-{item?.city}</strong>
                                      <strong>-{item?.state}</strong>
                                      <strong>-{item?.zipcode}</strong>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div
                      class="tab-pane fade"
                      id="v-pills-profile"
                      role="tabpanel"
                      aria-labelledby="v-pills-profile-tab">
                      <RequestOrders />
                    </div>
                    <div
                      class="tab-pane fade"
                      id="v-pills-messages"
                      role="tabpanel"
                      aria-labelledby="v-pills-messages-tab">
                      <Address />
                    </div>
                    <div
                      class="tab-pane fade"
                      id="v-pills-settings"
                      role="tabpanel"
                      aria-labelledby="v-pills-settings-tab">
                      <Account />
                    </div>

                    <div
                      class="tab-pane fade"
                      id="v-pills-fav"
                      role="tabpanel"
                      aria-labelledby="v-pills-fav-tab">
                      <div class="myacct_data_inner">
                        <div class="row">
                          <div class="col-12 data_head mb-4">
                            <h2>My Favorites</h2>
                          </div>
                          <Favourites />
                        </div>
                      </div>
                    </div>

                    <div
                      class="tab-pane fade"
                      id="v-pills-buy"
                      role="tabpanel"
                      aria-labelledby="v-pills-buy-tab">
                      <BuyAgain />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <p>Please Login to see details...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MyAccount;
