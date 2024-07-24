import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Homepage/Navbar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import "../../assets/css/main.css";
import axios from "axios";
import Profile from "./Profile";
import moment from "moment";

const ViewStore = () => {
  const [users, setUsers] = useState([]);
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}user/getSubAccounts`;
  const getOrderDetails = `${process.env.REACT_APP_APIENDPOINTNEW}user/order/viewOrder`;
  const [orderDetails, setOrderDetails] = useState([]);
  axios.defaults.headers.common["x-auth-token-user"] =
    localStorage.getItem("loginToken");
  let location = useLocation();
  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    const res = await axios.get(apiUrl + "/" + id);
    setUsers(res?.data.results.subUser);
    setOrderDetails(res?.data.results?.orders);
  };
  
  return (
    <div className="main_myaccount">
      <Navbar />
      <section className="comman_banner _banner marginTop">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <h1>My Store</h1>
              <div className="breadcrumbs mt-2">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
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
                        className="text-decoration-none text-white fs-6 ">
                        My Store
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
        <div className="container-lg position-relative">
          <Profile />
        </div>
        <div className="container container-sm">
          <div className="row mt-5 justify-content-center">
            <div className="col-xl-12 col-md-12 col-sm-9 ">
              <div className="bg-white p-4 ">
                <div className="tab-content" id="nav-tabContent">
                  <div
                    className="tab-pane fade show active"
                    id="nav-home"
                    role="tabpanel"
                    aria-labelledby="nav-home-tab">
                    <div className="col-xl-12 justify content center">
                      <div className="bg-white p-4">
                        <div className="tab-content" id="nav-tabContent">
                          <div className="row">
                            <div className="col-12 mb-3">
                              <div className="order_heading">
                                <h2>Store Details :</h2>
                              </div>
                            </div>
                            <div className="col-12 mb-4">
                              <div className="row mx-0 border rounded pt-4 p-3 position-relative">
                                <span className="small_header">
                                  Account Details
                                </span>
                                <div className="col-6 mb-2">
                                  <div className="row">
                                    <div className="col-6">
                                      <span className="data_main">
                                        User Name :
                                      </span>
                                    </div>
                                    <div className="col-6">
                                      <span className="data_submain">
                                        {users?.firstName +
                                          " " +
                                          users?.lastName}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6 mb-2">
                                  <div className="row">
                                    <div className="col-6">
                                      <span className="data_main">
                                        Company Name
                                      </span>
                                    </div>
                                    <div className="col-6">
                                      <span className="data_submain">
                                        {users?.companyName}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="row">
                                    <div className="col-6">
                                      <span className="data_main">
                                        Mobile Number :
                                      </span>
                                    </div>
                                    <div className="col-6">
                                      <span className="data_submain">
                                        {users?.businessPhoneNumber}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-6">
                                  <div className="row">
                                    <div className="col-6">
                                      <span className="data_main">
                                        Address :
                                      </span>
                                    </div>
                                    <div className="col-6">
                                      <span className="data_submain">
                                        <strong>{users?.addressLine1}</strong>
                                        <strong>-{users?.addressLine2}</strong>
                                        <strong>-{users?.city}</strong>
                                        <strong>-{users?.state}</strong>
                                        <strong>-{users?.zipcode}</strong>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="col-12 mb-4">
                              <div className="row mx-0 border rounded pt-4 p-3 position-relative">
                                <span className="small_header">All Orders</span>
                                {(orderDetails || [])?.map((item, index) => (
                                  <div class="col-md-6 mb-4">
                                    <div
                                      class="order-new-box"
                                      onClick={() =>
                                        navigate(
                                          `/app/order-detail/${item?._id}`
                                        )
                                      }
                                      // state={{ id: item?._id }}
                                    >
                                      <div class="row">
                                        <div class="col-6 mb-1 pe-0">
                                          <div class="orderID">
                                            Order ID:{" "}
                                            <strong>{item?.orderId}</strong>
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
                                          {(item?.products || []).map(
                                            (item, ind) => (
                                              <ul className="list-unstyled mb-0">
                                                <li key={ind}>
                                                  <strong>
                                                    {item?.flavour?._id
                                                      ? item?.productId
                                                          ?.unitName +
                                                        "-" +
                                                        item?.flavour?.flavour
                                                      : item?.productId
                                                          ?.unitName}
                                                  </strong>
                                                </li>
                                              </ul>
                                            )
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
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

export default ViewStore;
