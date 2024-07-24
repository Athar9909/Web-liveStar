import React from "react";
import { useState } from "react";
import { saveAs } from "file-saver";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/css/adminMain.css";
import { Button } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Starlogo from "../../../assets/img/logo.png";
import { useEffect } from "react";
import axios from "axios";
import { FaFileDownload, FaFileUpload } from "react-icons/fa";
import ProfileBar from "../ProfileBar";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

const PendingView = () => {
  const [loader, setLoader] = useState(false);
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getUser`;
  const approveUrl = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin//adminAuthorisedUser`;
  const rejectUrl = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/rejectUser`;
  const [sideBar, setSideBar] = useState(true);
  const [user, setUser] = useState([]);

  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");

  let User = JSON.parse(localStorage.getItem("AdminData"));
  const objectId = localStorage.getItem("objectId");
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { register: register2, handleSubmit: handleSubmit2 } = useForm();

  const onSubmit = async (data) => {
    await axios
      .post(rejectUrl + "/" + objectId, {
        companyName: data?.companyName,
        dba: data?.dba,
        addressLine1: data?.address1,
        addressLine2: data?.addressLine2,
        city: data?.city,
        state: data?.state,
        zipcode: data?.zipcode,
        firstName: data?.firstName,
        tobaccoLicence: data?.tobaccoId,
        federalTaxId: data?.federalId,
        accountOwnerId: data?.accountId,
        businessLicense: data?.businessId,
        salesTaxId: data?.salesId,
        rejectReason: data?.reason,
      })
      .then((res) => {
        if (res?.data.message === "Rejected") {
          document.getElementById("modal-close21").click();
          navigate("/UserManage");
        }
      });
  };

  const onSubmitApprove = async (data) => {
    console.log(data);
    await axios
      .post(approveUrl + "/" + objectId, {
        tobaccoLicence: data?.tobaccoId,
        federalTaxId: data?.federalId,
        accountOwnerId: data?.accountId,
        businessLicense: data?.businessId,
        salesTaxId: data?.salesId,
        comment: data?.reason,
      })
      .then((res) => {
        if (res?.data.message === "User approved Successfully") {
          // document.getElementById("modal-close21").click();
          navigate("/UserManage");
          window.location.reload();
        }
      });
  };

  useEffect(() => {
    const getUser = async () => {
      const res = await axios.post(apiUrl + "/" + objectId);
      setUser(res.data.results);
      return res.data;
    };
    getUser();
  }, []);

  const fileDownload = (url) => {
    saveAs(url);
  };

  const approveUser = async () => {
    setLoader(true);
    const res = await axios.post(approveUrl + "/" + objectId);
    if (res?.data.message === "User approved Successfully") {
      navigate("/UserManage");
    }
  };

  const preview = (id) => {
    if (id?.endsWith(".pdf")) {
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
                    <h2 className="main_headers">Pending Details</h2>
                  </div>
                  <div className="col-auto">
                    <div className="Status_box">
                      Status: <strong>Pending</strong>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 p-4 Pending-view-main">
                    <div className="row py-2">
                      <div className="col-12 text-center mb-4">
                        <div className="Pending-view_img">
                          <img src={Starlogo} alt="" />
                        </div>
                        <h4 className="user_name">{user?.firstName}</h4>
                      </div>
                      <div className="col-md-6 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">Company:</span>
                          <div className="col">
                            <strong>{user?.companyName}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">DBA:</span>
                          <div className="col">
                            <strong>{user?.dba}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">
                            Company Address Line 1:
                          </span>
                          <div className="col">
                            <strong>{user?.addressLine1}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">
                            Company Address Line 2:
                          </span>
                          <div className="col">
                            <strong>{user?.addressLine2}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">City:</span>
                          <div className="col">
                            <strong>{user?.city}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">State:</span>
                          <div className="col">
                            <strong>{user?.state}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-4 d-flex align-items-stretch">
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
                            user.federalTaxId
                              ? "row view-inner-box border  mx-0 w-100"
                              : "row view-inner-box border border-danger text-danger mx-0 w-100"
                          }>
                          <span className="fw-bold">Federal Tax ID:</span>
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
                                {user?.federalTaxId ? (
                                  <i
                                    class="fa fa-eye preview_icon"
                                    onClick={() =>
                                      preview(user?.federalTaxId)
                                    }></i>
                                ) : null}

                                <a
                                  // href={user?.federalTaxId}
                                  target="_blank "
                                  className="text-decoration-none"
                                  onClick={() => {
                                    fileDownload(user?.federalTaxId);
                                  }}>
                                  {user?.federalTaxId ? (
                                    <FaFileDownload size={25} color="black" />
                                  ) : (
                                    <FaFileUpload size={25} color="red" />
                                  )}
                                  <p className="" style={{ fontSize: "9px" }}>
                                    {user?.federalTaxId?.slice(0, 60)}
                                  </p>
                                </a>
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

                                <a
                                  // href={user?.tobaccoLicence}
                                  target="_blank"
                                  className="text-decoration-none"
                                  onClick={() => {
                                    fileDownload(user?.tobaccoLicence);
                                  }}>
                                  {user?.tobaccoLicence ? (
                                    <FaFileDownload size={25} color="black" />
                                  ) : (
                                    <FaFileUpload size={25} color="red" />
                                  )}
                                  <p className="" style={{ fontSize: "9px" }}>
                                    {user?.tobaccoLicence?.slice(0, 60)}
                                  </p>
                                </a>
                              </div>
                            </label>
                          </div>
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

                                <a
                                  // href={user?.salesTaxId}
                                  target="_blank"
                                  className="text-decoration-none"
                                  onClick={() => {
                                    fileDownload(user?.salesTaxId);
                                  }}>
                                  {user.salesTaxId ? (
                                    <FaFileDownload size={25} color="black" />
                                  ) : (
                                    <FaFileUpload size={25} color="red" />
                                  )}
                                  <p className="" style={{ fontSize: "9px" }}>
                                    {user?.salesTaxId?.slice(0, 60)}
                                  </p>
                                </a>
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
                                <a
                                  // href={user?.businessLicense}
                                  target="_blank"
                                  className="text-decoration-none"
                                  onClick={() => {
                                    fileDownload(user?.businessLicense);
                                  }}>
                                  {user?.businessLicense ? (
                                    <FaFileDownload size={25} color="black" />
                                  ) : (
                                    <FaFileUpload size={25} color="red" />
                                  )}
                                  <p className="" style={{ fontSize: "9px" }}>
                                    {user?.businessLicense?.slice(0, 60)}
                                  </p>
                                </a>
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
                          <span className="fw-bold">Phone Number:</span>
                          <div className="col">
                            <strong>{user?.phoneNumber}</strong>
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

                                <a
                                  // href={user?.accountOwnerId}
                                  target="_blank"
                                  className="text-decoration-none"
                                  onClick={() => {
                                    fileDownload(user?.accountOwnerId);
                                  }}>
                                  {user.accountOwnerId ? (
                                    <FaFileDownload size={25} color="black" />
                                  ) : (
                                    <FaFileUpload size={25} color="red" />
                                  )}

                                  <p style={{ fontSize: "9px" }}>
                                    {user?.accountOwnerId}
                                  </p>
                                </a>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">Email Address:</span>
                          <div className="col">
                            <strong>{user?.email}</strong>
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

                      <div className="col-md-4 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">
                            How did you hear about us?:
                          </span>
                          <div className="col">
                            <strong>{user?.heardAboutUs}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">
                            Wholesale Confirmation ?
                          </span>
                          <div className="col">
                            <strong>
                              {user?.wholesaleConfirmation ? "Yes" : "No"}
                            </strong>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">Comments</span>
                          <div className="col">
                            <strong>{user?.comments}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-4 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold">Multiple Users ?</span>
                          <div className="col">
                            <strong>{user?.multipleUsers ? "Yes" : "No"}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-12 text-center">
                        <Button
                          href="javascript:;"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop25"
                          className="comman_btn ms-2 text-decoration-none"
                          // loading={loader}
                          style={{
                            backgroundColor: "#eb3237",
                            color: "#fff",
                            fontWeight: "500",
                            borderRadius: "30px",
                          }}>
                          Approve
                        </Button>
                        <Button
                          style={{
                            backgroundColor: "#3e4093",
                            color: "#fff",
                            fontWeight: "500",
                            borderRadius: "30px",
                          }}
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop21"
                          className="comman_btn2 ms-2 text-decoration-none">
                          Decline
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade comman_modal"
        id="staticBackdrop25"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Approve Remarks*
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="modal-closed22"
              />
            </div>
            <div className="modal-body bg-light border rounded">
              <div className="container ">
                <div className="row justify-content-center ">
                  <form
                    className="p-2"
                    onSubmit={handleSubmit2(onSubmitApprove)}>
                    <h5 className="fw-bold">Enter Reason :</h5>

                    <textarea
                      className="w-100 fs-6 p-2"
                      style={{ height: "8rem" }}
                      name="reason"
                      {...register2("reason")}
                    />

                    <div className="row text-start mt-3 return_Reason">
                      <h6 className="mb-2">Choose Invalid Fields :</h6>

                      <div className="col-md-6">
                        <ul className="list-group">
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="federalId"
                                {...register2("federalId")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault">
                                Federal Tax Id
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="salesId"
                                {...register2("salesId")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault">
                                Sales Tax Id
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="tobaccoId"
                                {...register2("tobaccoId")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                htmlFor="flexCheckDefault">
                                Tobacco Licence
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="businessId"
                                {...register2("businessId")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault">
                                Business Licence
                              </label>
                            </div>
                          </li>

                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="accountId"
                                {...register2("accountId")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault">
                                Account Owner Id
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-12 text-center mt-4">
                        <button
                          className="comman_btn2 rounded"
                          onClick={approveUser}
                          type="submit">
                          Approve
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal fade comman_modal"
        id="staticBackdrop21"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Decline Reason
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="modal-close21"
              />
            </div>
            <div className="modal-body bg-light border rounded">
              <div className="container ">
                <div className="row justify-content-center ">
                  <form className="p-2" onSubmit={handleSubmit(onSubmit)}>
                    <h5 className="fw-bold">Enter Reason :</h5>

                    <textarea
                      className="w-100 fs-6 p-2"
                      style={{ height: "8rem" }}
                      defaultValue={
                        "Thank you for registering." +
                        "Your account is on hold for approval. Kindly update the required documents and resubmit the form or you can send the documents on" +" " + 
                        "websupport@starimporters.com."
                      }
                      name="reason"
                      {...register("reason")}
                    />

                    <div className="row text-start mt-3 return_Reason">
                      <h6 className="mb-2">Choose Invalid Fields :</h6>
                      <div className="col-md-6">
                        <ul className="list-group ">
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="companyName"
                                {...register("companyName")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault">
                                Company Name
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="dba"
                                {...register("dba")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault">
                                DBA
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="address"
                                {...register("address")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault">
                                Address Line
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="city"
                                {...register("city")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                htmlFor="flexCheckDefault">
                                City
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="state"
                                {...register("state")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault">
                                State
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="zipcode"
                                {...register("zipcode")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault">
                                Zipcode
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-6">
                        <ul className="list-group">
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="federalId"
                                {...register("federalId")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault">
                                Federal Tax Id
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="salesId"
                                {...register("salesId")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault">
                                Sales Tax Id
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="tobaccoId"
                                {...register("tobaccoId")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                htmlFor="flexCheckDefault">
                                Tobacco Licence
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="businessId"
                                {...register("businessId")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault">
                                Business Licence
                              </label>
                            </div>
                          </li>
                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="firstName"
                                {...register("firstName")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault">
                                First Name
                              </label>
                            </div>
                          </li>

                          <li className="list-group-item">
                            <div class="form-check">
                              <input
                                class="form-check-input"
                                type="checkbox"
                                name="accountId"
                                {...register("accountId")}
                                id="flexCheckDefault"
                              />
                              <label
                                class="form-check-label mx-1"
                                for="flexCheckDefault">
                                Account Owner Id
                              </label>
                            </div>
                          </li>
                        </ul>
                      </div>
                      <div className="col-md-12 text-center mt-4">
                        <button className="comman_btn2 rounded" type="submit">
                          Send To Email
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        class="btn btn-primary d-none"
        id="preview_modal"
        data-bs-toggle="modal"
        data-bs-target="#exampleModal">
        Launch demo modal
      </button>
      <div
        class="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-lg">
          <div class="modal-content">
            <div class="modal-header comman_modal">
              <h5 class="modal-title">Preview</h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <strong id="PdfHeader"></strong>
              <img
                src={user?.federalTaxId}
                type="application/pdf"
                className="preview_image"
                id="preview_images"></img>
            </div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal">
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PendingView;
