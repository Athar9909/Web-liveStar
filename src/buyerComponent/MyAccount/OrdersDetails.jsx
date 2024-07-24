import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Homepage/Navbar";
import { Link, useLocation, useParams } from "react-router-dom";
import "../../assets/css/main.css";
import axios from "axios";
import Profile from "./Profile";
import moment from "moment";
import { Steps } from "rsuite";
import TaskIcon from "@rsuite/icons/Task";
import DoingRoundIcon from "@rsuite/icons/DoingRound";
import BookIcon from "@rsuite/icons/legacy/Book";
import CheckRoundIcon from "@rsuite/icons/CheckRound";
import RemindRoundIcon from "@rsuite/icons/RemindRound";
import DocPassIcon from "@rsuite/icons/DocPass";
const OrderDetails = () => {
  const [users, setUsers] = useState([]);
  const userApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/getUserProfile`;
  const getOrderDetails = `${process.env.REACT_APP_APIENDPOINTNEW}user/order/viewOrder`;
  const [orderDetails, setOrderDetails] = useState([]);
  axios.defaults.headers.common["x-auth-token-user"] =
    localStorage.getItem("loginToken");

  let location = useLocation();
  let id = useParams();

  useEffect(() => {
    const GetOrder = async () => {
      await axios.get(getOrderDetails + "/" + id?.id).then((res) => {
        setOrderDetails(res?.data.results?.orders);
      });
    };
    GetOrder();
    getUser();
  }, []);

  const getUser = async () => {
    await axios.get(userApi).then((res) => {
      setUsers(res?.data.results);
    });
  };

  const currentScore = () => {
    switch (orderDetails?.status) {
      case "PROCESSING":
        return 1;
      case "SHIPPED":
        return 2;
      case "DELIVERED":
        return 3;
      default:
        return 0;
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
                        My Account <span className="arrow mx-1">&#9679;</span>
                      </Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      <Link
                        to=""
                        style={{ position: "relative", left: "-12px" }}
                        className="text-decoration-none text-white fs-6 ">
                        My Orders
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
                          <div
                            className="tab-pane fade show active"
                            id="nav-home"
                            role="tabpanel"
                            aria-labelledby="nav-home-tab">
                            <div className="row">
                              <div className="col-12 mb-3">
                                <div className="order_heading">
                                  <h2>Order Details :</h2>
                                </div>
                              </div>
                              <div className="col-12 mt-3 mb-4">
                                <div className="row mx-0 border rounded pt-4 p-3 position-relative">
                                  <span className="small_header">
                                    Order Details
                                  </span>
                                  <div className="col-3">
                                    <div className="row">
                                      <div className="col-12 d-flex">
                                        <span className="data_main">
                                          Order Date :{" "}
                                          {moment(
                                            orderDetails?.createdAt
                                          )?.format("MM/DD/YYYY") +
                                            " -" +
                                            moment(
                                              orderDetails?.createdAt
                                            ).format("h:mm a")}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-3">
                                    <div className="row">
                                      <div className="col-12 d-flex">
                                        <span className="data_main">
                                          Order Type : {orderDetails?.type}
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-3">
                                    <div className="row">
                                      <div className="col-12 d-flex">
                                        <span className="data_main">
                                          Order Id : {orderDetails?.orderId}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-3">
                                    <div className="row">
                                      <div className="col-12 text-center">
                                        <span className="data_main">
                                          Total Products :{" "}
                                          {orderDetails?.products?.length}
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
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {(orderDetails?.products || [])?.map(
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
                                                        {item?.flavour?.barcode
                                                          ?.filter(
                                                            (itm, id) => id < 4
                                                          )
                                                          .map((item) => (
                                                            <li>{item}</li>
                                                          ))}
                                                      </p>
                                                     
                                                    </div>
                                                  </div>
                                                </div>
                                              </td>
                                              <td>
                                                <span className="quantity_text">
                                                  {item?.quantity}
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

                              <div className="col-12 mt-3 mb-4">
                                <div className="row mx-0 border  rounded pt-5 p-3 position-relative">
                                  <span className="small_header">
                                    Track Your Order
                                  </span>
                                  {orderDetails?.status === "CANCEL" ? (
                                    <Steps current={1}>
                                      <Steps.Item
                                        title="Order Cancelled"
                                        icon={
                                          <RemindRoundIcon
                                            className="text-danger"
                                            style={{
                                              fontSize: 25,
                                            }}
                                          />
                                        }
                                      />
                                    </Steps>
                                  ) : (
                                    <Steps current={currentScore()}>
                                      <Steps.Item
                                        title="Order Placed"
                                        icon={
                                          <TaskIcon
                                            className={
                                              (orderDetails?.status ===
                                                "ORDER PLACED" &&
                                                "colorRed") ||
                                              (orderDetails?.status ===
                                                "SHIPPED" &&
                                                "colorRed") ||
                                              (orderDetails?.status ===
                                                "DELIVERED" &&
                                                "colorRed") ||
                                              (orderDetails?.status ===
                                                "Picked-Up" &&
                                                "colorRed")
                                            }
                                            style={{
                                              fontSize: 28,
                                            }}
                                          />
                                        }
                                      />
                                      <Steps.Item
                                        title="Processing"
                                        icon={
                                          <DoingRoundIcon
                                            className={
                                              (orderDetails?.status ===
                                                "SHIPPED" &&
                                                "colorRed") ||
                                              (orderDetails?.status ===
                                                "DELIVERED" &&
                                                "colorRed") ||
                                              (orderDetails?.status ===
                                                "Picked-Up" &&
                                                "colorRed")
                                            }
                                            style={{
                                              fontSize: 28,
                                            }}
                                          />
                                        }
                                      />
                                      <Steps.Item
                                        title="Picked-Up"
                                        icon={
                                          <DocPassIcon
                                            className={
                                              (orderDetails?.status ===
                                                "Picked-Up" &&
                                                "colorRed") ||
                                              (orderDetails?.status ===
                                                "DELIVERED" &&
                                                "colorRed")
                                            }
                                            style={{
                                              fontSize: 28,
                                            }}
                                          />
                                        }
                                      />

                                      <Steps.Item
                                        title="Shipped"
                                        icon={
                                          <BookIcon
                                            className={
                                              (orderDetails?.status ===
                                                "SHIPPED" &&
                                                "colorRed") ||
                                              (orderDetails?.status ===
                                                "DELIVERED" &&
                                                "colorRed")
                                            }
                                            style={{
                                              fontSize: 28,
                                            }}
                                          />
                                        }
                                      />
                                      <Steps.Item
                                        title="Delivered"
                                        icon={
                                          <CheckRoundIcon
                                            className={
                                              orderDetails?.status ===
                                                "DELIVERED" && "colorRed"
                                            }
                                            style={{
                                              fontSize: 28,
                                            }}
                                          />
                                        }
                                      />
                                    </Steps>
                                  )}
                                  {/* {orderDetails?.status === "CANCEL" ? (
                                    <ul className="track_order list-unstyled mb-0">
                                      <li className="fs-4 text-danger">
                                        YOUR ORDER HAS BEEN CANCELED!
                                      </li>
                                    </ul>
                                  ) : (
                                    <ul className="track_order list-unstyled mb-0">
                                      <li
                                        className={
                                          orderDetails?.status ===
                                            "PROCESSING" ||
                                          orderDetails?.status === "SHIPPED" ||
                                          orderDetails?.status === "DELIVERED"
                                            ? "active"
                                            : ""
                                        }
                                      >
                                        <span className="track_circle" />
                                        Order Placed
                                      </li>
                                      <li
                                        className={
                                          orderDetails?.status === "SHIPPED" ||
                                          orderDetails?.status === "DELIVERED"
                                            ? "active"
                                            : ""
                                        }
                                      >
                                        <span className="track_circle" />
                                        Order Processing
                                      </li>
                               

                                      <li
                                       className={
                                        orderDetails?.status === "DELIVERED"
                                          ? "active"
                                          : ""
                                      }
                                      >
                                        <span
                                          className={
                                            orderDetails?.status === "SHIPPED"
                                              ? "track_circle fw-bold text-success"
                                              : "track_circle"
                                          }
                                        />
                                        SHIPPED
                                      </li>


                                      <li>
                                        <span
                                          className={
                                            orderDetails?.status === "DELIVERED"
                                              ? "track_circle fw-bold text-success"
                                              : "track_circle"
                                          }
                                        />
                                        Delivered
                                      </li>
                                    </ul>
                                  )} */}
                                </div>
                              </div>

                              <div className="col-12 mb-4">
                                <div className="row mx-0 border rounded pt-4 p-3 position-relative">
                                  <span className="small_header">Comment:</span>
                                  <div className="col-6 mb-2">
                                    <div className="row">
                                      <div className="col-6">
                                        <span className="data_main">
                                          Admin Comment :
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        <span className="data_submain">
                                          {orderDetails?.statusComment
                                            ? orderDetails?.statusComment
                                            : "No Comments."}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              <div className="col-12 mb-4">
                                <div className="row mx-0 border rounded pt-4 p-3 position-relative">
                                  <span className="small_header">
                                    Shipment Details -{" "}
                                    {orderDetails?.orderedBy === "SubAcc" &&
                                      "Sub-Account"}
                                  </span>
                                  <div className="col-6 mb-2">
                                    <div className="row">
                                      <div className="col-6">
                                        <span className="data_main">
                                          Buyer Name :
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        <span className="data_submain">
                                          {orderDetails?.userId?.firstName +
                                            " " +
                                            orderDetails?.userId?.lastName}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-6 mb-2">
                                    <div className="row">
                                      <div className="col-6">
                                        <span className="data_main">
                                          Email :
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        <span className="data_submain">
                                          {orderDetails?.userId?.email}
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
                                          {orderDetails?.userId?.phoneNumber}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-6">
                                    <div className="row">
                                      <div className="col-6">
                                        <span className="data_main">
                                          Shipment Location :
                                        </span>
                                      </div>
                                      <div className="col-6">
                                        <span className="data_submain">
                                          {orderDetails?.userId?.addressLine1}
                                        </span>
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
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default OrderDetails;
