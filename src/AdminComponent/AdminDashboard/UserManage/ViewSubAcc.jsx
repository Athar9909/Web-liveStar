import React from "react";
import { useState } from "react";
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import "../../../assets/css/adminMain.css";
import { FaFileUpload } from "react-icons/fa";
import { saveAs } from "file-saver";
import Starlogo from "../../../assets/img/logo.png";
import { useEffect } from "react";
import axios from "axios";
import { FaFileDownload } from "react-icons/fa";
import ProfileBar from "../ProfileBar";
import { Button } from "rsuite";
import moment from "moment";
import "rsuite/dist/rsuite.min.css";
import Swal from "sweetalert2";
import { MDBDataTable } from "mdbreact";

const ViewSubAcc = () => {
  const [sideBar, setSideBar] = useState(true);
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/viewSubAccounts`;
  const [user, setUser] = useState();
  const [editText, setEditText] = useState("Edit");
  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const objectId = localStorage.getItem("objectId");
  const navigate = useNavigate();
  let { id } = useParams();
  let location = useLocation();

  const [orderHistory, setOrderHistory] = useState({
    columns: [
      {
        label: "DATE",
        field: "date",
        sort: "asc",
        width: 150,
      },

      {
        label: "ORDER ID",
        field: "id",
        sort: "asc",
        width: 100,
      },
      {
        label: "ORDER STATUS",
        field: "status",
        sort: "asc",
        width: 100,
      },
      {
        label: "ORDER TYPE",
        field: "type",
        sort: "asc",
        width: 100,
      },
      {
        label: "PULLER STATUS",
        field: "pull",
        sort: "asc",
        width: 100,
      },

      {
        label: "ORDER DETAILS",
        field: "details",
        sort: "asc",
        width: 100,
      },
    ],
    rows: [],
  });

  useEffect(() => {
    getSubUser();
  }, []);

  const getSubUser = async () => {
    const res = await axios.post(apiUrl + "/" + objectId, {
      subAccount: id,
    });
    setUser(res?.data.results.subUser);
    if (!res?.data.error) {
      const newRows = [];
      let values = res?.data.results.orders;
      values?.map((list, index) => {
        const returnData = {};
        returnData.id = list?.orderId;
        returnData.status = list?.status;
        returnData.type = list?.type;
        returnData.pull = list?.pullStatus;
        returnData.date = moment(list?.createdAt).format("MM/DD/YYYY");
        returnData.details = (
          <>
            <button
              className="comman_btn table_viewbtn"
              onClick={() => {
                navigate(`/OrderRequest/ViewOrder/${list?._id}`, {
                  state: {
                    id: list?._id,
                  },
                });
              }}>
              View
            </button>
          </>
        );
        newRows.push(returnData);
      });

      setOrders({ ...orders, rows: newRows });
    }
  };

  const fileDownload = (url) => {
    saveAs(url);
  };

  console.log(user);
  const [orders, setOrders] = useState({
    columns: [
      {
        label: "DATE",
        field: "date",
        sort: "asc",
        width: 150,
      },

      {
        label: "ORDER ID",
        field: "id",
        sort: "asc",
        width: 100,
      },
      {
        label: "ORDER STATUS",
        field: "status",
        sort: "asc",
        width: 100,
      },
      {
        label: "ORDER TYPE",
        field: "type",
        sort: "asc",
        width: 100,
      },
      {
        label: "PULLER STATUS",
        field: "pull",
        sort: "asc",
        width: 100,
      },

      {
        label: "ORDER DETAILS",
        field: "details",
        sort: "asc",
        width: 100,
      },
    ],
    rows: [],
  });

  const [quote, setQuote] = useState({
    columns: [
      {
        label: "DATE",
        field: "date",
        sort: "asc",
        width: 150,
      },
      {
        label: "COMPANY NAME",
        field: "name",
        sort: "asc",
        width: 150,
      },

      {
        label: "REQUEST ID",
        field: "id",
        sort: "asc",
        width: 100,
      },

      {
        label: "STATUS",
        field: "status",
        sort: "asc",
        width: 100,
      },
      {
        label: "REQUEST DETAILS",
        field: "details",
        sort: "asc",
        width: 100,
      },
    ],
    rows: [],
  });

  const preview = (id) => {
    if (id.endsWith(".pdf")) {
      window.location.href = id;
      Swal.fire({
        title: "Preview Not Available!",
        text: "Pdf cannot be shown! Try download and open.",
        icon: "error",
      });
    } else {
      document.getElementById("preview_modal").click();
      document.getElementById("preview_images").src = id;
    }
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
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "2px",
                      }}
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
                    className="bg-white"
                    to="/UserManage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}
                  >
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
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
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
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
                      style={{
                        position: "relative",
                        left: "6px",
                        top: "3px",
                      }}
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
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
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
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fas fa-user-cog"
                    ></i>{" "}
                    Sub-Admin Management
                  </Link>
                </li>

                <li
                  className={User?.access?.includes("Puller") ? "" : "d-none"}
                >
                  <Link
                    className=" ata"
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

                <li className={User?.access?.includes("Trade") ? "" : "d-none"}>
                  <Link
                    className=""
                    to="/admin/Tradeshow-manage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-calendar-check"
                    ></i>{" "}
                    Trade Show Management
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
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
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
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
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
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
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
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "2px",
                      }}
                      className="fa fa-home"
                    ></i>{" "}
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    className="bg-white"
                    to="/UserManage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}
                  >
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
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
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
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
                      style={{
                        position: "relative",
                        left: "6px",
                        top: "3px",
                      }}
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
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
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
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fas fa-user-cog"
                    ></i>{" "}
                    Sub-Admin Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=" ata"
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
                    className=""
                    to="/admin/Tradeshow-manage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-calendar-check"
                    ></i>{" "}
                    TradeShow Management
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
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
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
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
                      class="fa fa-cog"
                    ></i>{" "}
                    Content Management
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
                      style={{
                        position: "relative",
                        left: "4px",
                        top: "3px",
                      }}
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
                    }}>
                    <i className="fa fa-bars"></i>
                  </h1>
                </div>
              ) : (
                <div>
                  <h3 className="">
                    <button
                      onClick={(e) => {
                        console.log(e);
                        setSideBar(!sideBar);
                      }}>
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
      </div>
      <div className="admin_panel_data height_adjust">
        <div className="row Pending-view justify-content-center">
          <div className="col-12">
            <div className="row mx-0">
              <div className="col-12 design_outter_comman recent_orders shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2 className="main_headers">Sub-User Details</h2>
                  </div>
                  <div className="col-auto d-flex">
                    <div className="Status_box mx-4 mt-2">
                      Status: <strong>Active</strong>
                    </div>
                  </div>
                </div>
                <div className="row ">
                  <div className="col-12 p-4 Pending-view-main">
                    <div className="row py-2">
                      <div className="col-md-3 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">Company:</span>
                          <div className="col">
                            <strong>{user?.companyName}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">Account Number:</span>
                          <div className="col">
                            <strong>{user?.accountNumber}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">DBA:</span>
                          <div className="col">
                            <strong>{user?.dba}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">
                            Company Address Line 1:
                          </span>
                          <div className="col">
                            <strong>{user?.addressLine1}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">
                            Company Address Line 2:
                          </span>
                          <div className="col">
                            <strong>{user?.addressLine2}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-3 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">State:</span>
                          <div className="col">
                            <strong>{user?.state}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">City:</span>
                          <div className="col">
                            <strong>{user?.city}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">Zip/Postal Code:</span>
                          <div className="col">
                            <strong>{user?.zipcode}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 d-flex align-items-stretch">
                        <div
                          className={
                            user?.federalTaxId
                              ? "row view-inner-box border  mx-0 w-100"
                              : "row view-inner-box border border-danger text-danger mx-0 w-100"
                          }>
                          <span className="fw-bold">Federal Tax ID:</span>
                          <div className="col img_box_show ">
                            <input
                              className="d-none"
                              type="file"
                              id="file1"
                              name="file"
                              disabled
                            />
                            <label htmlFor="file1">
                              <div className="">
                                {user?.federalTaxId ? (
                                  <i
                                    class="fa fa-eye preview_icon"
                                    onClick={() =>
                                      preview(user?.federalTaxId)
                                    }></i>
                                ) : null}
                                <Link className="text-decoration-none">
                                  {user?.federalTaxId ? (
                                    <FaFileDownload
                                      onClick={() => {
                                        fileDownload(user?.federalTaxId);
                                      }}
                                      size={25}
                                      color="black"
                                    />
                                  ) : (
                                    <FaFileUpload size={25} color="red" />
                                  )}
                                  <p
                                    onClick={() => {
                                      fileDownload(user?.federalTaxId);
                                    }}
                                    className="mt-2"
                                    style={{ fontSize: "9px" }}>
                                    {user?.federalTaxId?.slice(0, 40)}
                                  </p>
                                </Link>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 d-flex align-items-stretch">
                        <div
                          className={
                            user?.tobaccoLicence
                              ? "row view-inner-box border  mx-0 w-100"
                              : "row view-inner-box border border-danger text-danger mx-0 w-100"
                          }>
                          <span className="fw-bold">Tobacco License:</span>
                          <div className="col img_box_show">
                            <input
                              className="d-none"
                              type="file"
                              id="file1"
                              name="file"
                              disabled
                            />
                            <label htmlFor="file1">
                              <div className="">
                                {user?.tobaccoLicence ? (
                                  <i
                                    class="fa fa-eye preview_icon"
                                    onClick={() =>
                                      preview(user?.tobaccoLicence)
                                    }></i>
                                ) : null}
                                <Link className="text-decoration-none">
                                  {user?.tobaccoLicence ? (
                                    <FaFileDownload
                                      onClick={() => {
                                        fileDownload(user?.tobaccoLicence);
                                      }}
                                      size={25}
                                      color="black"
                                    />
                                  ) : (
                                    <FaFileUpload size={25} color="red" />
                                  )}
                                  <p
                                    className="mt-2"
                                    onClick={() => {
                                      fileDownload(user?.tobaccoLicence);
                                    }}
                                    style={{ fontSize: "9px" }}>
                                    {user?.tobaccoLicence?.slice(0, 40)}
                                  </p>
                                </Link>
                              </div>
                            </label>
                          </div>

                          <strong>
                            {" "}
                            Expires on :{" "}
                            {user?.tobaccoLicenceExpiry?.slice(0, 10)}
                          </strong>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 d-flex align-items-stretch">
                        <div
                          className={
                            user?.salesTaxId
                              ? "row view-inner-box border  mx-0 w-100"
                              : "row view-inner-box border border-danger text-danger mx-0 w-100"
                          }>
                          <span className="fw-bold">Sales Tax ID:</span>
                          <div className="col img_box_show">
                            <input
                              className="d-none"
                              type="file"
                              id="file1"
                              name="file"
                              disabled
                            />
                            <label htmlFor="file1">
                              <div className="">
                                {user?.salesTaxId ? (
                                  <i
                                    class="fa fa-eye preview_icon"
                                    onClick={() =>
                                      preview(user?.salesTaxId)
                                    }></i>
                                ) : null}
                                <Link className="text-decoration-none">
                                  {user?.salesTaxId ? (
                                    <FaFileDownload
                                      onClick={() => {
                                        fileDownload(user?.salesTaxId);
                                      }}
                                      size={25}
                                      color="black"
                                    />
                                  ) : (
                                    <FaFileUpload size={25} color="red" />
                                  )}
                                  <p
                                    onClick={() => {
                                      fileDownload(user?.salesTaxId);
                                    }}
                                    className="mt-2"
                                    style={{ fontSize: "9px" }}>
                                    {user?.salesTaxId?.slice(0, 40)}
                                  </p>
                                </Link>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 d-flex align-items-stretch">
                        <div
                          className={
                            user?.businessLicense
                              ? "row view-inner-box border  mx-0 w-100"
                              : "row view-inner-box border border-danger text-danger mx-0 w-100"
                          }>
                          <span className="fw-bold">Business License:</span>
                          <div className="col img_box_show">
                            <input
                              className="d-none"
                              type="file"
                              id="file1"
                              name="file"
                              disabled
                            />
                            <label htmlFor="file1">
                              <div className="">
                                {user?.businessLicense ? (
                                  <i
                                    class="fa fa-eye preview_icon"
                                    onClick={() =>
                                      preview(user?.businessLicense)
                                    }></i>
                                ) : null}
                                <Link className="text-decoration-none">
                                  {user?.businessLicense ? (
                                    <FaFileDownload
                                      onClick={() => {
                                        fileDownload(user?.businessLicense);
                                      }}
                                      size={25}
                                      color="black"
                                    />
                                  ) : (
                                    <FaFileUpload size={25} color="red" />
                                  )}
                                  <p
                                    onClick={() => {
                                      fileDownload(user?.businessLicense);
                                    }}
                                    className="mt-2"
                                    style={{ fontSize: "9px" }}>
                                    {user?.businessLicense?.slice(0, 40)}
                                  </p>
                                </Link>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">Contact First name:</span>
                          <div className="col">
                            <strong> {user?.firstName}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">Contact Last name:</span>
                          <div className="col">
                            <strong> {user?.lastName}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">Business Number:</span>
                          <div className="col">
                            <strong>{user?.businessPhoneNumber}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-12 mb-4 d-flex align-items-stretch">
                        <div
                          className={
                            user?.accountOwnerId
                              ? "row view-inner-box border  mx-0 w-100"
                              : "row view-inner-box border border-danger text-danger mx-0 w-100"
                          }>
                          <span className="fw-bold">Account Owner ID:</span>
                          <div className="col img_box_show">
                            <input
                              className="d-none"
                              type="file"
                              id="file1"
                              name="file"
                              disabled
                            />
                            <label htmlFor="file1">
                              <div className="">
                                {user?.accountOwnerId ? (
                                  <i
                                    class="fa fa-eye preview_icon2"
                                    onClick={() =>
                                      preview(user?.accountOwnerId)
                                    }></i>
                                ) : null}

                                <Link className="text-decoration-none">
                                  {user?.accountOwnerId ? (
                                    <FaFileDownload
                                      onClick={() => {
                                        fileDownload(user?.accountOwnerId);
                                      }}
                                      size={25}
                                      color="black"
                                    />
                                  ) : (
                                    <FaFileUpload size={25} color="red" />
                                  )}
                                  <p
                                    onClick={() => {
                                      fileDownload(user?.accountOwnerId);
                                    }}
                                    className="mt-2"
                                    style={{ fontSize: "9px" }}>
                                    {user?.accountOwnerId?.slice(0, 40)}
                                  </p>
                                </Link>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold fs-6">Tobacco License:</span>
                          <div className="col">
                            <div className="action_filter filter_check">
                              <input
                                className="d-none"
                                type="radio"
                                id="license"
                                checked={
                                  user?.istobaccoLicenceExpired ? false : true
                                }
                                name="license"
                                disabled
                              />
                              <label htmlFor="vii">Enabled</label>
                            </div>
                          </div>
                          <div className="col">
                            <div className="action_filter filter_check">
                              <input
                                className="d-none"
                                type="radio"
                                id="d_license"
                                name="license"
                                checked={
                                  user?.istobaccoLicenceExpired ? true : false
                                }
                                disabled
                              />
                              <label htmlFor="sh">Disabled </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="col-12 text-center">
                        <Link
                          to={`/UserManage/User/Sub-account/Edit/${user?._id}`}
                          className="comman_btn2 text-decoration-none">
                          {editText}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="row mx-0 mt-4">
              <div className="col-12 design_outter_comman recent_orders shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2 className="main_headers">Order History</h2>
                  </div>
                  <div className="col-auto d-flex"></div>
                </div>

                <div className="row">
                  <div className="col-12 px-3 Pending-view-main">
                    <div className="row py-2">
                      <div className="col-12 user-management-tabs px-0">
                        <div className="tab-content" id="nav-tabContent">
                          <div
                            className="tab-pane fade show active"
                            id="nav-home"
                            role="tabpanel"
                            aria-labelledby="nav-home-tab">
                            <div className="row mx-0">
                              <div className="col-12">
                                <div className="row ">
                                  <div className="col-12 comman_table_design px-0">
                                    <div className="table-responsive p-0">
                                      <MDBDataTable
                                        bordered
                                        displayEntries={false}
                                        className="categoryTable"
                                        hover
                                        data={orders}
                                        noBottomColumns
                                        sortable
                                      />
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
  );
};

export default ViewSubAcc;
