import axios from "axios";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Starlogo from "../../../assets/img/logo.png";
import ProfileBar from "../ProfileBar";
import { components } from "react-select";
import moment from "moment";
import Select from "react-select";
import { Box, LinearProgress, Typography } from "@mui/material";

const Option = (props) => {
  return (
    <div>
      <components.Option {...props} className="d-flex ">
        <input
          type="checkbox"
          className="border border-secondary"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label className="mx-2 mt-1">{props.label}</label>
      </components.Option>
    </div>
  );
};

const ViewTradeOrder = () => {
  const [sideBar, setSideBar] = useState(true);
  const orderView = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/viewTradeOrders`;
  const updateOrder = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/changeTradeOrderStatus/`;
  const orderExportXls = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/exportTradeCSV/`;
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState();
  const [statusComment, setStatusComment] = useState("");
  let User = JSON.parse(localStorage.getItem("AdminData"));
  let { id } = useParams();
  const fileDownload = (url, name) => {
    saveAs(url, name);
  };

  useEffect(() => {
    OrderDetails();
  }, []);

  const OrderDetails = async (status, sort, scanType) => {
    await axios.get(orderView + "/" + id).then((res) => {
      setOrders(res?.data.results.order);
    });
  };

  const UpdateOrderStatus = async (e) => {
    e.preventDefault();
    await axios
      .patch(updateOrder + orders?._id, {
        status: orderStatus ? orderStatus : orders?.order?.status,
        statusComment: statusComment,
      })
      .then((res) => {
        if (!res?.error) {
          Swal.fire({
            title: "Order Updated!",
            icon: "success",
            button: "Okay",
          });
        }
      });
  };

  const exportOrderXls = async (e) => {
    e.preventDefault();
    await axios.get(orderExportXls + id).then((res) => {
      if (!res?.error) {
        fileDownload(res?.data.results?.path, orders?.orderId);
      }
    });
  };

  const handleClick = () => {
    localStorage.removeItem("AdminData");
    localStorage.removeItem("AdminLogToken");
    localStorage.removeItem("AdminEmail");
  };

  return (
    <div className={sideBar ? "admin_main" : "expanded_main"}>
      <div className={sideBar ? "siderbar_section" : "d-none"}>
        <div className="siderbar_inner">
          <div className="sidebar_logo">
            <Link to="" className="">
              <img src={Starlogo} alt="Logo" />{" "}
            </Link>
          </div>
          <div className="sidebar_menus">
            {User?.type === "SubAdmin" ? (
              <ul className="list-unstyled ps-1 m-0">
                <li
                  className={
                    User?.access?.includes("Dashboard") ? "" : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/AdminDashboard"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "2px" }}
                      className="fa fa-home"
                    ></i>{" "}
                    Dashboard
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("User Management") ? "" : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/UserManage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-user"
                    ></i>{" "}
                    User Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("Category Sub-Category Management")
                      ? ""
                      : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/CategorySub"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-layer-group"
                    ></i>{" "}
                    Category &amp; Sub Category
                  </Link>
                </li>

                <li
                  className={
                    User?.access?.includes("Visitor Management")
                      ? ""
                      : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/VisitorPanel"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-layer-group"
                    ></i>{" "}
                   Visitor Management
                  </Link>
                </li>

                <li
                  className={
                    User?.access?.includes("Inventory Management")
                      ? ""
                      : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/Inventory"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "6px", top: "3px" }}
                      class="far fa-building"
                    ></i>{" "}
                    Inventory Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("Brands Management") ? "" : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/brandsManage"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-ship"
                    ></i>{" "}
                    Brands Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("Sub-Admin") ? "" : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/Admin/SubAdmin"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-user-cog"
                    ></i>{" "}
                    Sub-Admin Management
                  </Link>
                </li>

                <li
                  className={User?.access?.includes("Puller") ? "" : "d-none"}
                >
                  <Link
                    className="d-none ata"
                    to="/Puller-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-users-gear"
                    ></i>{" "}
                    Puller Management
                  </Link>
                </li>
                <li
                  className={User?.access?.includes("Gallery") ? "" : "d-none"}
                >
                  <Link
                    className=""
                    to="/Gallery-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-image"
                    ></i>{" "}
                    Gallery Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("catalogFlyers") ? "" : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/Catelog-Flyers"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-book"
                    ></i>{" "}
                    Catalog & Flyers
                  </Link>
                </li>

                <li
                  className={
                    User?.access?.includes("Orders Management") ? "" : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/OrderRequest"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-layer-group"
                    ></i>{" "}
                    Order Management
                  </Link>
                </li>
                <li className={User?.access?.includes("CMS") ? "" : "d-none"}>
                  <Link
                    className=""
                    to="/Cms"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-cog"
                    ></i>{" "}
                    Content Management
                  </Link>
                </li>
                <li
                  className={User?.access?.includes("Contact") ? "" : "d-none"}
                >
                  <Link
                    className=""
                    to="/Contact&Support"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-handshake-angle"
                    ></i>{" "}
                    Contact & Support
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/AdminLogin"
                    onClick={handleClick}
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-sign-out-alt"
                    ></i>
                    Logout
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="list-unstyled ps-1 m-0">
                <li>
                  <Link
                    className=""
                    to="/AdminDashboard"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "2px" }}
                      className="fa fa-home"
                    ></i>{" "}
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/UserManage"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-user"
                    ></i>{" "}
                    User Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/CategorySub"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-layer-group"
                    ></i>{" "}
                    Category &amp; Sub Category
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/VisitorPanel"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-users"
                    ></i>{" "}
                    Visitor Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Inventory"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "6px", top: "3px" }}
                      class="far fa-building"
                    ></i>{" "}
                    Inventory Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/brandsManage"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-ship"
                    ></i>{" "}
                    Brands Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Admin/SubAdmin"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-user-cog"
                    ></i>{" "}
                    Sub-Admin Management
                  </Link>
                </li>
                <li>
                  <Link
                    className="d-none ata"
                    to="/Puller-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-users-gear"
                    ></i>{" "}
                    Puller Management
                  </Link>
                </li>

                <li>
                  <Link
                    className="bg-white"
                    to="/admin/Tradeshow-manage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-image"
                    ></i>{" "}
                    Trade Show Management
                  </Link>
                </li>

                <li>
                  <Link
                    className=""
                    to="/Gallery-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-image"
                    ></i>{" "}
                    Gallery Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Catelog-Flyers"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-book"
                    ></i>{" "}
                    Catalog & Flyers
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/OrderRequest"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-layer-group"
                    ></i>{" "}
                    Order Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Cms"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-cog"
                    ></i>{" "}
                    Content Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Contact&Support"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-handshake-angle"
                    ></i>{" "}
                    Contact & Support
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/AdminLogin"
                    onClick={handleClick}
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-sign-out-alt"
                    ></i>
                    Logout
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="admin_main_inner">
        <div className="admin_header shadow">
          <div className="row align-items-center mx-0 justify-content-between w-100">
            <div className="col">
              {sideBar ? (
                <div>
                  <h1
                    className="mt-2 text-white"
                    onClick={() => {
                      console.log("yello");
                      setSideBar(!sideBar);
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "4px" }}
                      className="fa fa-bars"
                    ></i>
                  </h1>
                </div>
              ) : (
                <div>
                  <h3 className="">
                    <button
                      onClick={(e) => {
                        console.log(e);
                        setSideBar(!sideBar);
                      }}
                    >
                      X
                    </button>
                  </h3>
                </div>
              )}
            </div>
            <div className="col-auto d-flex ml-5">
              <ProfileBar />
            </div>
          </div>
        </div>
        <div className="admin_panel_data height_adjust">
          <div className="row category_management justify-content-center">
            <div className="col-12">
              <div className="row mx-0 ">
                <div className="col-12 design_outter_comman  shadow">
                  <div className="row comman_header justify-content-between ">
                    <div className="col-auto">
                      <h2>Trade Order Details</h2>
                    </div>
                    {/* <div className="col-auto"></div> */}
                    <div className="col-auto">
                      {/* {orders?.pullStatus === "Assigned" ? (
                        <button
                          class="dropdown-btns comman_btn mx-1"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdropAdmin"
                        >
                          Puller: {orders?.puller?.fullName}{" "}
                          <i class="fas fa-user-gear"></i>
                        </button>
                      ) : (
                        <button
                          class="dropdown-btns comman_btn2 mx-1"
                          data-bs-toggle="modal"
                          onClick={() => {
                            createOptions();
                          }}
                          data-bs-target="#staticBackdropAdmin"
                        >
                          Assign Puller <i class="fas fa-user-gear"></i>
                        </button>
                      )}

                      <button
                        class="dropdown-btns comman_btn2 mx-2"
                        onClick={() =>
                          navigate("/OrderRequest/ViewOrder/Edit", {
                            state: { id: id },
                          })
                        }
                      >
                        Edit <i class="fa fa-edit"></i>
                      </button> */}
                      <div class="dropdowns">
                        <button class="dropdown-btns comman_btn2 ">
                          Export <i class="fa fa-download"></i>
                        </button>
                        <div class="dropdown-contents border rounded">
                          <a className="" href="#">
                            <Link
                              className="text-decoration-none text-dark dropdown-item"
                              onClick={exportOrderXls}
                            >
                              Export .Xlsx
                            </Link>
                          </a>

                          <a href="#">
                            <Link
                              className="text-decoration-none text-dark dropdown-item"
                              to={`/TradeOrderRequest/Pdf/${id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Export .pdf
                            </Link>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row p-4 py-5 recent_orders_new  ">
                    <div className="col-12 mb-4 ">
                      <div className="row mx-0 border rounded py-4 px-3 position-relative">
                        <span className="small_header">Order Details</span>
                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Order Date - Time</span>

                            <div className="col">
                              <strong>
                                {" "}
                                {moment(
                                  orders?.order?.createdAt?.slice(0, 10)
                                ).format("MM/DD/YYYY") +
                                  "-" +
                                  moment(orders?.order?.createdAt).format(
                                    "h:mm a"
                                  )}
                              </strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Order Id:</span>
                            <div className="col">
                              <strong>{orders?.order?.orderId}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Total Products:</span>
                            <div className="col">
                              <strong>{orders?.products?.length}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="row mx-0 border rounded pt-4 p-3 position-relative">
                        <span className="small_header">Buyer Details</span>

                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Company Name:</span>
                            <div className="col">
                              <strong>{orders?.order?.companyName}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Account :</span>
                            <div className="col">
                              <strong>{orders?.order?.account}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Full Name :</span>
                            <div className="col">
                              <strong>{orders?.order?.fullName}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Email:</span>
                            <div className="col">
                              <strong>{orders?.order?.email}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Mobile Number:</span>
                            <div className="col">
                              <strong>{orders?.order?.phoneNumber}</strong>
                            </div>
                          </div>
                        </div>
                        {/* <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Company Name:</span>
                            <div className="col">
                              <strong>{orders?.order?.companyName}</strong>
                            </div>
                          </div>
                        </div> */}
                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Shipment Location:</span>
                            <div className="col">
                              <strong>{orders?.order?.address}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Order Comments(if any):</span>
                            <div className="col">
                              <strong
                                dangerouslySetInnerHTML={{
                                  __html: orders?.order?.comments.replace(
                                    /\n/g,
                                    "<br>"
                                  ),
                                }}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 my-3 d-flex align-items-stretch ">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Order Type:</span>
                            <div className="col">
                              <strong>{orders?.order?.type}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 mb-5 mt-3">
                      <div className="row mx-0 border rounded pt-4 p-3 position-relative">
                        <span className="small_header">
                          Customer Notification Status
                        </span>

                        <div className="col-12 Change_staus">
                          <form
                            className="form-design row align-items-end"
                            action=""
                          >
                            <div className="form-group mb-0 col">
                              <label htmlFor="">Order Status</label>
                              <select
                                className="form-select form-control"
                                aria-label="Default select example"
                                onChange={(e) => {
                                  setOrderStatus(e.target.value);
                                }}
                              >
                                <option selected="">
                                  {orders?.order?.status + "-" + "selected"}
                                </option>
                                <option value="ORDER PLACED">
                                  Order Placed
                                </option>
                                <option value="PROCESSING">Processing</option>
                                <option value="Picked-Up">Picked-Up</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="CANCEL">Canceled</option>
                              </select>
                            </div>
                            {orders?.status === "SHIPPED" ||
                            orderStatus === "SHIPPED" ? (
                              <div className="form-group mb-0 col">
                                <label htmlFor="">Comment if(any)</label>
                                <textarea
                                  type="text"
                                  name="statusComment"
                                  defaultValue={orders?.statusComment}
                                  placeholder="Add your comment here."
                                  className="form-control"
                                  onChange={(e) => {
                                    setStatusComment(e.target.value);
                                  }}
                                />
                              </div>
                            ) : (
                              ""
                            )}

                            <div className="form-group mb-0 col-auto">
                              <button
                                className="comman_btn"
                                onClick={UpdateOrderStatus}
                              >
                                Save
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 mb-4">
                      <div className="cart_table_2">
                        <div className="">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Image</th>
                                <th>Name</th>
                                <th>Qty(in units)</th>
                                <th>Promotion</th>
                                <th>Product Comment</th>
                              </tr>
                            </thead>
                            {orders?.products?.length < 1 ? (
                              <tbody className="border">
                                <tr
                                  className="border"
                                  style={{
                                    width: "20rem",
                                  }}
                                >
                                  <td className="border rounded">
                                    <span className="fs-5 bg-light p-2 px-3 rounded">
                                      No Results
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            ) : (
                              <tbody className="border">
                                {(orders?.products || [])?.map(
                                  (item, index) => (
                                    <tr className="border text-center">
                                      <td className="border rounded">
                                        <div className="col-auto">
                                          <span className=" mb-3">
                                            <img
                                              width={100}
                                              src={
                                                item?.flavour?._id
                                                  ? item?.flavour?.flavourImage
                                                  : item?.productId
                                                      ?.productImage
                                              }
                                              alt=""
                                            />
                                          </span>
                                        </div>
                                      </td>
                                      <td>
                                        <div className="row align-items-center flex-lg-wrap flex-md-nowrap flex-nowrap">
                                          <div className="col">
                                            <div className="cart_content ">
                                              <h3 className="fs-5 mt-5">
                                                {item?.productId?.unitName +
                                                  "-" +
                                                  item?.productId?.type
                                                    ?.flavour}
                                              </h3>
                                              <p>
                                                Barcodes:
                                                {item?.productId?.type?.barcode
                                                  ?.filter((itm, id) => id == 1)
                                                  .map((item) => (
                                                    <li>{item}</li>
                                                  ))}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="border rounded ">
                                        <p className="fs-5 fw-bold bg-light p-2 px-3 rounded ">
                                          {item?.quantity}
                                        </p>
                                      </td>
                                      <td className="border rounded ">
                                        <p className="fs-6 bg-light p-2 px-3 rounded">
                                          {item?.promotionalComment}
                                        </p>
                                      </td>
                                      <td className="border rounded ">
                                        <p className="fs-6 bg-light p-2 px-3 rounded">
                                          {item?.productComment}
                                        </p>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            )}
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
  );
};

export default ViewTradeOrder;
