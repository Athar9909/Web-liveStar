import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppFooter from "./appFooter";
import AppHeader from "./appHeader";
import moment from "moment";
import DocPassIcon from "@rsuite/icons/DocPass";

function AppOrderDetail() {
  const getOrderDetails = `${process.env.REACT_APP_APIENDPOINTNEW}user/order/viewOrder`;
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  let id = useParams();

  useEffect(() => {
    OrderDetails();
  }, []);

  const OrderDetails = async () => {
    await axios.get(getOrderDetails + "/" + id?.id).then((res) => {
      setOrders(res?.data.results?.orders);
    });
  };

  return (
    <>
      <div className="star_imp_app">
        <AppHeader />
        <div className="my_order_new">
          <div className="container">
            <div className="row">
              <div className="col-12 mb-3">
                <div className="row mx-0 border rounded py-3 px-1 position-relative bg-white shadow">
                  <span className="small_header">Order Details:</span>
                  <div className="col-12 mb-1">
                    <div className="row">
                      <div className="col-6">
                        <span className="data_main">Order Date :</span>
                      </div>
                      <div className="col-6">
                        <span className="data_submain">
                          {moment(orders?.createdAt?.slice(0, 10)).format(
                            "MM/DD/YYYY"
                          ) +
                            "-" +
                            moment(orders?.createdAt).format("h:mm a")}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mb-1">
                    <div className="row">
                      <div className="col-6">
                        <span className="data_main">Order Id :</span>
                      </div>
                      <div className="col-6">
                        <span className="data_submain">{orders?.orderId}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mb-1">
                    <div className="row">
                      <div className="col-6">
                        <span className="data_main">Ordered By :</span>
                      </div>
                      <div className="col-6">
                        <span className="data_submain">
                          {orders?.orderedBy === "SubAcc" && "Sub-Acccount"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mb-1">
                    <div className="row">
                      <div className="col-6">
                        <span className="data_main">Order Type:</span>
                      </div>
                      <div className="col-6">
                        <span className="data_submain">{orders?.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mb-1">
                    <div className="row">
                      <div className="col-6">
                        <span className="data_main">Total Products :</span>
                      </div>
                      <div className="col-6">
                        <span className="data_submain">
                          {orders?.products?.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* {browserName === "WebKit" || browserName === "Chrome WebView" ? (
                <div className="col-12 mb-3">
                  <div className="row mx-0 border rounded position-relative bg-white shadow cart-table">
                    <div className="table-responsive card-body">
                      <table className="table mb-0">
                        <tbody>
                          {(orders?.products || [])?.map((item, index) => (
                            <tr
                              key={index}
                              className={
                                item?.productId?.isTobaccoProduct
                                  ? "filter"
                                  : ""
                              }>
                              <td>
                                <div className="cart_icon">
                                  <img
                                    className=""
                                    src={item?.flavour?.flavourImage}
                                    alt=""
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="order_items">
                                  <Link
                                    to={`/app/product-detail/${item?.productId?.slug}`}
                                    state={{ type: item?.flavour }}>
                                    {item?.productId?.unitName +
                                      "-" +
                                      item?.flavour.flavour}
                                  </Link>

                                  <div className="bar_code mt-1"></div>
                                </div>
                              </td>
                              <td>
                                <div className="quantity">
                                  <input
                                    className="qty-text"
                                    type="text"
                                    disabled
                                    value={item?.quantity}
                                  />
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : ( */}
              <div className="col-12 mb-3">
                <div className="row mx-0 border rounded position-relative bg-white shadow cart-table">
                  <div className="table-responsive card-body">
                    <table className="table mb-0">
                      <tbody>
                        {(orders?.products || [])?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="cart_icon">
                                <img
                                  className=""
                                  src={item?.flavour?.flavourImage}
                                  alt=""
                                />
                              </div>
                            </td>
                            <td>
                              <div className="order_items">
                                <Link
                                  to={`/app/product-detail/${item?.productId?.slug}`}
                                  state={{ type: item?.flavour }}>
                                  {item?.productId?.unitName +
                                    "-" +
                                    item?.flavour.flavour}
                                </Link>

                                <div className="bar_code mt-1"></div>
                              </div>
                            </td>
                            <td>
                              <div className="quantity">
                                <input
                                  className="qty-text"
                                  type="text"
                                  disabled
                                  value={item?.quantity}
                                />
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              {/* )} */}

              <div className="col-12 mb-3">
                <div className="card border rounded py-3 px-1 position-relative bg-white shadow">
                  <div className="card-body px-3 py-1">
                    <div className="single-order-status active">
                      <div className="order-icon">
                        <i className="fa-solid fa-bag-shopping"></i>
                      </div>
                      <div className="order-text">
                        <h6>Order placed</h6>
                        <span>{orders?.createdAt?.slice(0, 10)}</span>
                      </div>
                      <div className="order-status">
                        <i className="fa-solid fa-circle-check"></i>
                      </div>
                    </div>

                    <div
                      className={
                        orders?.status === "CANCEL"
                          ? "single-order-status active"
                          : "d-none"
                      }>
                      <div className="order-icon text-dark">
                        <i className="fa-solid fa-bag-shopping"></i>
                      </div>
                      <div className="order-text ">
                        <h6 className="text-danger fw-bold">Order Canceled</h6>
                        <span className="text-danger ">
                          {orders?.createdAt?.slice(0, 10)}
                        </span>
                      </div>
                      <div className="order-status">
                        <i className="fa-solid fa-circle-check text-danger "></i>
                      </div>
                    </div>
                    {orders?.status === "CANCEL" ? null : (
                      <div>
                        <div
                          className={
                            orders?.status === "PROCESSING" ||
                            orders?.status === "SHIPPED" ||
                            orders?.status === "DELIVERED" ||
                            orders?.status === "Picked-Up"
                              ? "single-order-status active"
                              : "single-order-status"
                          }>
                          <div className="order-icon">
                            <i className="fa-solid fa-box-open"></i>
                          </div>
                          <div className="order-text">
                            <h6>Order Processing</h6>
                          </div>
                          <div className="order-status">
                            <i className="fa-solid fa-circle-check"></i>
                          </div>
                        </div>

                        <div
                          className={
                            orders?.status === "PROCESSING" ||
                            orders?.status === "SHIPPED" ||
                            orders?.status === "DELIVERED" ||
                            orders?.status === "Picked-Up"
                              ? "single-order-status active"
                              : "single-order-status"
                          }>
                          <div className="order-icon">
                            <DocPassIcon
                            className="p-1"
                              style={{
                                fontSize: 28,
                              }}
                            />
                          </div>
                          <div className="order-text">
                            <h6>Picked-Up</h6>
                          </div>
                          <div className="order-status">
                            <i className="fa-solid fa-circle-check"></i>
                          </div>
                        </div>

                        <div
                          className={
                            orders?.status === "SHIPPED" ||
                            orders?.status === "DELIVERED"
                              ? "single-order-status active"
                              : "single-order-status"
                          }>
                          <div className="order-icon">
                            <i className="fa-solid fa-truck"></i>
                          </div>
                          <div className="order-text">
                            <h6>Shipped</h6>
                          </div>
                          <div className="order-status">
                            <i className="fa-solid fa-circle-check"></i>
                          </div>
                        </div>

                        <div
                          className={
                            orders?.status === "DELIVERED"
                              ? "single-order-status active"
                              : "single-order-status"
                          }>
                          <div className="order-icon">
                            <i className="fa-solid fa-truck-fast"></i>
                          </div>
                          <div className="order-text">
                            <h6> Delivered</h6>
                          </div>
                          <div className="order-status">
                            <i className="fa-solid fa-circle-check"></i>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="col-12 mb-3">
                <div className="row mx-0 border rounded py-3 px-1 position-relative bg-white shadow">
                  <span className="small_header">Comments:</span>
                  <div className="col-12 mb-1">
                    <div className="row">
                      <div className="col-12 d-flex">
                        <span className="data_main">Admin Comments:</span>
                        <span className="data_submain mx-2">
                          {orders?.statusComment
                            ? orders?.statusComment
                            : "No Comments!"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-12 mb-3">
                <div className="row mx-0 border rounded py-3 px-1 position-relative bg-white shadow">
                  <span className="small_header">Shipment Details:</span>
                  <div className="col-12 mb-1">
                    <div className="row">
                      <div className="col-12 d-flex">
                        <span className="data_main">Buyer Name :</span>
                        <span className="data_submain mx-2">
                          {orders?.userId?.firstName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mb-1">
                    <div className="row">
                      <div className="col-12 d-flex">
                        <span className="data_main">Email: </span>
                        <span className="data_submain mx-2">
                          {orders?.userId?.email}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mb-1">
                    <div className="row">
                      <div className="col-12 d-flex">
                        <span className="data_main">Mobile Number:</span>
                        <span className="data_submain mx-2  ">
                          {orders?.userId?.phoneNumber}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="col-12 mb-1">
                    <div className="row">
                      <div className="col-12 d-flex">
                        <span className="data_main">Shipment Location:</span>
                        <span className="data_submain mx-2">
                          {orders?.userId?.addressLine1 +
                            "-" +
                            orders?.userId?.state +
                            "-" +
                            orders?.userId?.city +
                            "-" +
                            orders?.userId?.zipcode}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mb-1">
                    <div className="row">
                      <div className="col-12 d-flex">
                        <span className="data_main">Comments:</span>
                        <span className="data_submain mx-2">
                          {orders?.comments}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <AppFooter />
      </div>
    </>
  );
}

export default AppOrderDetail;
