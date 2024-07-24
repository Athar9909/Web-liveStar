import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import "../../../assets/css/adminMain.css";
import Starlogo from "../../../assets/img/logo.png";
import { useEffect } from "react";
import axios from "axios";
import classNames from "classnames";
import { FaFileDownload, FaFileUpload } from "react-icons/fa";
import ProfileBar from "../ProfileBar";
import { Button } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Swal from "sweetalert2";
import moment from "moment";

const EditSubAccount = () => {
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/viewSubAccounts`;
  //   const uploadImage = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/imageUpload`;
  const apiUrl2 = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/editSubUser/`;
  const [loader, setLoader] = useState(false);
  const [files, setFiles] = useState({
    federalTaxId: "",
    businessLicense: "",
    tobaccoLicence: "",
    salesTaxId: "",
    accountOwnerId: "",
  });
  const [newExpiry, setNewExpiry] = useState("");
  const [newExpiry2, setNewExpiry2] = useState();
  const [sideBar, setSideBar] = useState(true);
  const [user, setUser] = useState([]);
  const [prodImg, setProdImg] = useState();
  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");
  const objectId = localStorage.getItem("objectId");
  const navigate = useNavigate();
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const [cities, setCities] = useState([]);
  let { id } = useParams();

  const handleCities = async (state) => {
    const { data } = await axios.post(
      "https://countriesnow.space/api/v0.1/countries/state/cities",
      {
        country: "United States",
        state: state ? state : "Georgia",
      }
    );
    if (!data.error) {
      setCities(data?.data);
    }
  };

  useEffect(() => {
    handleCities();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onFileSelection = async (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  const onSubmit = async (data) => {
    setLoader(true);
    console.log(data?.city);
    const formData = new FormData();
    formData.append("companyName", data?.companyName?.trim());
    formData.append("dba", data?.dba?.trim());
    formData.append("addressLine1", data?.addressLine1?.trim());
    formData.append("addressLine2", data?.addressLine2?.trim());
    formData.append("city", data?.city ? data?.city : user?.city);
    formData.append("state", data?.state);
    formData.append("zipcode", data?.zipcode);
    formData.append("firstName", data?.firstName?.trim());
    formData.append("lastName", data?.lastName?.trim());
    formData.append("businessPhoneNumber", data?.businessNumber);
    formData.append("businessNumber", data?.businessNumber);
    formData.append("federalTaxId", files?.federalTaxId);
    formData.append("businessLicense", files?.businessLicense);
    formData.append("tobaccoLicence", files?.tobaccoLicence);
    formData.append("salesTaxId", files?.salesTaxId);
    formData.append("accountOwnerId", files?.accountOwnerId);
    formData.append("subAccount", id);
    formData.append("accountNumber", data?.accountNumber);

    formData.append(
      "istobaccoLicenceExpired",
      data?.License ? data?.License : user?.istobaccoLicenceExpired
    );
    formData.append(
      "tobaccoLicenceExpiry",
      newExpiry?.slice(0, 10) ||
        newExpiry2?.slice(0, 10) ||
        user?.tobaccoLicenceExpiry.replaceAll("/", "-")?.slice(0, 10)
    );

    await axios
      .post(apiUrl2 + objectId, formData)
      .then((res) => {
        if (res?.data.error) {
          Swal.fire({
            title: res.data.message,
            icon: "error",
            button: "Okay",
          });
          setLoader(false);
        }
        if (res?.data.message === "sub account created") {
          setLoader(false);
          navigate(-1);
        }
        if (res?.data.message === "Invalid file format") {
          setLoader(false);
          Swal.fire({
            title: "Invalid File Format!",
            text: "Only images/pdf/docs are allowed.",
            icon: "error",
            button: "Ok",
          });
          setFiles(null);
          getUser();
        }
        if (res?.data.message === "Email is already registered") {
          setLoader(false);
          Swal.fire({
            title: "Email is Already registered!",
            icon: "error",
            button: "Ok",
          });
        }
        if (res?.data.message === "Phone is already registered") {
          setLoader(false);
          Swal.fire({
            title: "Phone is already registered!",
            icon: "error",
            button: "Ok",
          });
        }
        if (res?.data.message === "Please provide proper date") {
          setLoader(false);
          Swal.fire({
            title: "Please provide proper date!",
            text: "Give further date from today",
            icon: "error",
            button: "Ok",
          });
        }
      })
      .catch((err) => {
        console.log(err);
        setLoader(false);
        if (err.response.data.error) {
          Swal.fire({
            title: "Error!",
            icon: "error",
            button: "Ok",
          });
        }
      });
  };

  useEffect(() => {
    getUser();

  }, []);

  const getUser = async () => {
    const res = await axios.post(apiUrl + "/" + objectId, {
      subAccount: id,
    });
    let date = res.data.results?.tobaccoLicenceExpiry;
    console.log(date);
    setUser(res.data.results.subUser);
    document.getElementById("expiryDate").defaultValue = date.slice(0, 10);
    return res.data;
  };

  const handleClick = () => {
    localStorage.removeItem("AdminData");
    localStorage.removeItem("AdminLogToken");
    localStorage.removeItem("AdminEmail");
  };
  const today = new Date().toISOString().split("T")[0];
  document.getElementById("expiryDate")?.setAttribute("min", today);

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
                    <h2 className="main_headers">Edit Details</h2>
                  </div>
                  <div className="col-auto">
                    <div className="Status_box">
                      Status: <strong>Active</strong>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 p-4 Pending-view-main">
                    <form
                      className="row py-2 form-design"
                      autoComplete="off"
                      onSubmit={handleSubmit(onSubmit)}>
                      <div className="col-12 text-center mb-4">
                        {/* <div className="form-group col-auto">
                          <div className="account_profile position-relative d-inline-block">
                            <div className="mb-2 Pending-view_img">
                              <img
                                className="UserImage"
                                src={prodImg ? prodImg : user?.profileImage}
                                alt="Upload Image ........"
                              />
                            </div>

                            <div className="p-image">
                              <i className="upload-iconIN fas fa-camera" />

                              <input
                                className="file-uploadIN"
                                type="file"
                                name="imageProfile"
                                accept="image/*"
                                {...register("imageProfile")}
                                onChange={(e) =>
                                  onProfileSelection(e, "imageProfile")
                                }
                              />
                            </div>
                          </div>
                        </div> */}
                      </div>
                      <div className="form-group col-4 mb-4">
                        <label htmlFor="" className="fw-bold fs-6">
                          Company
                        </label>
                        <input
                          type="text"
                          className={classNames(
                            "form-control  border border-secondary  signup_fields",
                            { "is-invalid": errors.email }
                          )}
                          defaultValue={user?.companyName}
                          name="companyName"
                          id="name"
                          {...register("companyName")}
                        />
                        {errors.companyName && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.companyName?.message}
                          </small>
                        )}
                      </div>
                      <div className="form-group col-4 mb-4">
                        <label htmlFor="" className="fw-bold fs-6">
                          Account Number
                        </label>
                        <input
                          type="text"
                          className={classNames(
                            "form-control  border border-secondary  signup_fields",
                            { "is-invalid": errors.email }
                          )}
                          defaultValue={user?.accountNumber}
                          name="accountNumber"
                          id="name"
                          {...register("accountNumber")}
                        />
                        {errors.accountNumber && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.accountNumber?.message}
                          </small>
                        )}
                      </div>
                      <div className="form-group col-4 mb-4">
                        <label htmlFor="DBA" className="fw-bold fs-6">
                          DBA
                        </label>
                        <input
                          type="text"
                          className={classNames(
                            "form-control  border border-secondary signup_fields",
                            { "is-invalid": errors.dba }
                          )}
                          name="dba"
                          defaultValue={user?.dba}
                          id="DBA"
                          {...register("dba")}
                        />
                        {errors.dba && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.dba?.message}
                          </small>
                        )}
                      </div>
                      <div className="form-group col-6 mb-4">
                        <label htmlFor="" className="fw-bold fs-6">
                          Company Address Line 1
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.addressLine1}
                          className={classNames(
                            "form-control  border border-secondary signup_fields"
                          )}
                          name="addressLine1"
                          id="name"
                          {...register("addressLine1")}
                        />
                      </div>
                      <div className="form-group col-6 mb-4">
                        <label htmlFor="" className="fw-bold fs-6">
                          Company Address Line 2
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          name="addressLine2"
                          defaultValue={user?.addressLine2}
                          id="addressLine2"
                          {...register("addressLine2")}
                        />
                      </div>

                      <div className="form-group col-4 mb-4">
                        <label htmlFor="" className="fw-bold fs-6">
                          State
                        </label>
                        <select
                          className={classNames(
                            " form-select border border-secondary",
                            { "is-invalid": errors.state }
                          )}
                          aria-label="Default select example"
                          name="state"
                          defaultValue={user?.state}
                          {...register("state", {
                            onChange: (e) => {
                              handleCities(e.target.value);
                            },
                          })}>
                          <option value="">{user?.state}</option>

                          <option value="Alabama">Alabama</option>
                          <option value="Alabama">Alabama</option>
                          <option value="Alaska">Alaska</option>
                          <option value="American Samoa">American Samoa</option>
                          <option value="Arizona">Arizona</option>
                          <option value="Arkansas">Arkansas</option>
                          <option value="California">California</option>
                          <option value="Colorado">Colorado</option>
                          <option value="Connecticut">Connecticut</option>
                          <option value="Delaware">Delaware</option>
                          <option value="District of Columbia">
                            District of Columbia
                          </option>
                          <option value="Federated States of Micronesia">
                            Federated States of Micronesia
                          </option>
                          <option value="Florida">Florida</option>
                          <option value="Georgia">Georgia</option>
                          <option value="Guam">Guam</option>
                          <option value="Hawaii">Hawaii</option>
                          <option value="Idaho">Idaho</option>
                          <option value="Illinois">Illinois</option>
                          <option value="Indiana">Indiana</option>
                          <option value="Iowa">Iowa</option>
                          <option value="Kansas">Kansas</option>
                          <option value="Kentucky">Kentucky</option>
                          <option value="Louisiana">Louisiana</option>
                          <option value="Maine">Maine</option>
                          <option value="Marshall Islands">
                            Marshall Islands
                          </option>
                          <option value="Maryland">Maryland</option>
                          <option value="Massachusetts">Massachusetts</option>
                          <option value="Michigan">Michigan</option>
                          <option value="Minnesota">Minnesota</option>
                          <option value="Mississippi">Mississippi</option>
                          <option value="Missouri">Missouri</option>
                          <option value="Montana">Montana</option>
                          <option value="Nebraska">Nebraska</option>
                          <option value="Nevada">Nevada</option>
                          <option value="New Hampshire">New Hampshire</option>
                          <option value="New Jersey">New Jersey</option>
                          <option value="New Mexico">New Mexico</option>
                          <option value="New York">New York</option>
                          <option value="North Carolina">North Carolina</option>
                          <option value="North Dakota">North Dakota</option>
                          <option value="Northern Mariana Islands">
                            Northern Mariana Islands
                          </option>
                          <option value="Ohio">Ohio</option>
                          <option value="Oklahoma">Oklahoma</option>
                          <option value="Oregon">Oregon</option>
                          <option value="Palau">Palau</option>
                          <option value="Pennsylvania">Pennsylvania</option>
                          <option value="Puerto Rico">Puerto Rico</option>
                          <option value="Rhode Island">Rhode Island</option>
                          <option value="South Carolina">South Carolina</option>
                          <option value="South Dakota">South Dakota</option>
                          <option value="Tennessee">Tennessee</option>
                          <option value="Texas">Texas</option>
                          <option value="Utah">Utah</option>
                          <option value="Vermont">Vermont</option>
                          <option value="Virginia">Virginia</option>
                          <option value="Washington">Washington</option>
                          <option value="West Virginia">West Virginia</option>
                          <option value="Wisconsin">Wisconsin</option>
                          <option value="Wyoming">Wyoming</option>
                          <option value="Virgin Islands">Virgin Islands</option>
                          <option value="Armed Forces Americas">
                            Armed Forces Americas
                          </option>
                          <option value="Armed Forces Europe">
                            Armed Forces Europe
                          </option>
                          <option value="Armed Forces Pacific">
                            Armed Forces Pacific
                          </option>
                        </select>
                        {errors.state && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.state?.message}
                          </small>
                        )}
                      </div>

                      <div className="form-group col-4 mb-4  ">
                        <label htmlFor="" className="mx-2 fw-bolder">
                          City
                        </label>
                        <select
                          className={classNames(
                            "form-select border border-secondary  fw-bolder",
                            { "is-invalid": errors.city }
                          )}
                          id=""
                          name="city"
                          defaultValue={user?.city}
                          disabled={cities?.length ? false : true}
                          {...register("city")}>
                          <option value={user?.city} selected>
                            {user?.city}
                          </option>
                          {(cities || [])?.map((item, ind) => (
                            <option value={item}>{item}</option>
                          ))}
                        </select>
                        {errors.city && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.city?.message}
                          </small>
                        )}
                      </div>

                      <div className="form-group col-4 mb-4">
                        <label htmlFor="" className="fw-bold fs-6">
                          Zip/Postal Code
                        </label>
                        <input
                          type="text"
                          className={classNames(
                            "form-control  border border-secondary signup_fields"
                          )}
                          name="zipcode"
                          id="name"
                          defaultValue={user?.zipcode}
                          {...register("zipcode")}
                        />
                        {errors.zipcode && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.zipcode?.message}
                          </small>
                        )}
                      </div>

                      <div className="col-md-3 mb-4 mt-2 d-flex align-items-stretch">
                        <div
                          className={
                            files?.federalTaxId || user?.federalTaxId
                              ? "row view-inner-box border  mx-0 w-100"
                              : "row view-inner-box border border-danger text-danger mx-0 w-100"
                          }>
                          <span className="fw-bold fs-6">Federal Tax ID:</span>
                          <div className="col img_box_show">
                            <input
                              className="d-none"
                              type="file"
                              id="file1"
                              name="federalTaxId"
                              accept="image/jpeg,image/png,application/pdf,image/x-eps"
                              {...register("federalTaxId")}
                              onChange={(e) =>
                                onFileSelection(e, "federalTaxId")
                              }
                            />
                            {errors.federalTaxId && (
                              <small className="errorText mx-1 fw-bold">
                                {errors.federalTaxId?.message}
                              </small>
                            )}

                            <label htmlFor="file1">
                              <div className="">
                                {files?.federalTaxId || user?.federalTaxId ? (
                                  <FaFileDownload size={25} />
                                ) : (
                                  <FaFileUpload size={25} />
                                )}

                                <p className="mt-2" style={{ fontSize: "9px" }}>
                                  {files?.federalTaxId?.name
                                    ? files?.federalTaxId?.name
                                    : user?.federalTaxId}
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 mt-2 d-flex align-items-stretch">
                        <div
                          className={
                            files?.tobaccoLicence || user?.tobaccoLicence
                              ? "row view-inner-box border  mx-0 w-100"
                              : "row view-inner-box border border-danger text-danger mx-0 w-100"
                          }>
                          <span className="fw-bold fs-6">Tobacco License:</span>
                          <div className="col img_box_show">
                            <input
                              className="d-none"
                              type="file"
                              id="file2"
                              accept="image/jpeg,image/png,application/pdf,image/x-eps"
                              name="file"
                              {...register("tobaccoLicence")}
                              onChange={(e) =>
                                onFileSelection(e, "tobaccoLicence")
                              }
                            />
                            {errors.tobaccoLicence && (
                              <small className="errorText mx-1 fw-bold">
                                {errors.tobaccoLicence?.message}
                              </small>
                            )}

                            <label htmlFor="file2">
                              <div className="">
                                {files?.tobaccoLicence ||
                                user?.tobaccoLicence ? (
                                  <FaFileDownload size={25} />
                                ) : (
                                  <FaFileUpload size={25} />
                                )}

                                <p className="mt-2" style={{ fontSize: "9px" }}>
                                  {files?.tobaccoLicence?.name
                                    ? files?.tobaccoLicence?.name
                                    : user?.tobaccoLicence}
                                </p>
                              </div>
                            </label>
                          </div>

                          <strong>
                            {" "}
                            Expires on :(mm-dd-yyyy)
                            <div>
                              {console.log(newExpiry, newExpiry2)}

                              <input
                                type="tel"
                                maxLength={10}
                                key={newExpiry}
                                defaultValue={
                                  newExpiry
                                    ? newExpiry
                                    : user?.tobaccoLicenceExpiry?.slice(0, 10)
                                }
                                className="form-control"
                                placeholder="mm/dd/yyyy"
                                onChange={(e) => {
                                  setNewExpiry2(e.target.value);
                                  setNewExpiry("");
                                }}></input>
                              <input
                                type="date"
                                id="expiryDate"
                                name="dateExpiry"
                                className="custom_date"
                                onChange={(e) => {
                                  let date = moment(e.target.value).format("L");
                                  console.log(date);
                                  setNewExpiry(date);
                                  setNewExpiry2("");
                                }}
                                value={newExpiry}></input>
                            </div>
                          </strong>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 mt-2 d-flex align-items-stretch">
                        <div
                          className={
                            files?.salesTaxId || user?.salesTaxId
                              ? "row view-inner-box border  mx-0 w-100"
                              : "row view-inner-box border border-danger text-danger mx-0 w-100"
                          }>
                          <span className="fw-bold fs-6">Sales Tax ID:</span>
                          <div className="col img_box_show">
                            <input
                              className="d-none"
                              type="file"
                              id="file3"
                              name="salesTaxId"
                              accept="image/jpeg,image/png,application/pdf,image/x-eps"
                              {...register("salesTaxId")}
                              onChange={(e) => onFileSelection(e, "salesTaxId")}
                            />
                            <label htmlFor="file3">
                              <div className="">
                                {files?.salesTaxId || user?.salesTaxId ? (
                                  <FaFileDownload size={25} />
                                ) : (
                                  <FaFileUpload size={25} />
                                )}

                                <p className="mt-2" style={{ fontSize: "9px" }}>
                                  {files?.salesTaxId?.name
                                    ? files?.salesTaxId?.name
                                    : user?.salesTaxId}
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 mt-2 d-flex align-items-stretch">
                        <div
                          className={
                            files?.businessLicense || user?.businessLicense
                              ? "row view-inner-box border  mx-0 w-100"
                              : "row view-inner-box border border-danger text-danger mx-0 w-100"
                          }>
                          <span className="fw-bold fs-6">
                            Business License:
                          </span>
                          <div className="col img_box_show">
                            <input
                              className="d-none"
                              type="file"
                              id="file4"
                              name="businessLicense"
                              accept="image/jpeg,image/png,application/pdf,image/x-eps"
                              {...register("businessLicense")}
                              onChange={(e) =>
                                onFileSelection(e, "businessLicense")
                              }
                            />
                            <label htmlFor="file4">
                              <div className="">
                                {files?.businessLicense ||
                                user?.businessLicense ? (
                                  <FaFileDownload size={25} />
                                ) : (
                                  <FaFileUpload size={25} />
                                )}

                                <p className="mt-2" style={{ fontSize: "9px" }}>
                                  {files?.businessLicense?.name
                                    ? files?.businessLicense?.name
                                    : user?.businessLicense}
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="form-group col-4 mb-4">
                        <label htmlFor="" className="fw-bold fs-6">
                          Contact First name
                        </label>
                        <input
                          type="text"
                          className={classNames(
                            "form-control  border border-secondary signup_fields",
                            { "is-invalid": errors.firstName }
                          )}
                          defaultValue={user?.firstName}
                          name="fisrtName"
                          id="name"
                          {...register("firstName")}
                        />
                      </div>

                      <div className="form-group col-4 mb-4">
                        <label htmlFor="LastName" className="fw-bold fs-6">
                          Contact Last name
                        </label>
                        <input
                          type="text"
                          className={classNames(
                            "form-control  border border-secondary signup_fields fw-bold",
                            { "is-invalid": errors.lastName }
                          )}
                          name="lastName"
                          id="LastName"
                          defaultValue={user?.lastName}
                          {...register("lastName")}
                        />
                      </div>

                      <div className="form-group col-4 mb-4">
                        <label htmlFor="" className="fw-bold fs-6">
                          Business Number
                        </label>
                        <input
                          type="text"
                          className={classNames(
                            "form-control  border border-secondary signup_fields ",
                            { "is-invalid": errors.businessNumber }
                          )}
                          name="businessNumber"
                          id="name"
                          defaultValue={user?.businessPhoneNumber}
                          {...register("businessNumber")}
                        />
                        {errors.businessNumber && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.businessNumber?.message}
                          </small>
                        )}
                      </div>

                      <div className="col-md-12 mb-4 mt-2 d-flex align-items-stretch">
                        <div
                          className={
                            files?.accountOwnerId || user?.accountOwnerId
                              ? "row view-inner-box border  mx-0 w-100"
                              : "row view-inner-box border border-danger text-danger mx-0 w-100"
                          }>
                          <span className="fw-bold fs-6">
                            Account Owner ID:
                          </span>
                          <div className="col img_box_show">
                            <input
                              className="d-none"
                              type="file"
                              id="file5"
                              accept="image/jpeg,image/png,application/pdf,image/x-eps"
                              name="accountOwnerId"
                              {...register("accountOwnerId")}
                              onChange={(e) =>
                                onFileSelection(e, "accountOwnerId")
                              }
                            />
                            {errors.accountOwnerId && (
                              <small className="errorText mx-1 fw-bold">
                                {errors.accountOwnerId?.message}
                              </small>
                            )}

                            <label htmlFor="file5">
                              <div className="">
                                {files?.accountOwnerId ||
                                user?.accountOwnerId ? (
                                  <FaFileDownload size={25} />
                                ) : (
                                  <FaFileUpload size={25} />
                                )}

                                <p className="mt-2" style={{ fontSize: "9px" }}>
                                  {files?.accountOwnerId?.name
                                    ? files?.accountOwnerId?.name
                                    : user?.accountOwnerId}
                                </p>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold fs-6">
                            Tobacco License :{" "}
                            {user?.istobaccoLicenceExpired
                              ? "Disabled"
                              : "Enabled"}
                          </span>
                          {user?.istobaccoLicenceExpired ? (
                            <div className="col-12 align-item-center ">
                              <p>
                                Do you want to{" "}
                                {user?.istobaccoLicenceExpired
                                  ? "Enable"
                                  : "Disable"}{" "}
                                Licence ?
                              </p>
                              <div>
                                <input
                                  type="checkbox"
                                  value="false"
                                  className="border check"
                                  name="License"
                                  {...register("License")}
                                />
                                <small className="fs-5 fw-bold mx-2">Yes</small>
                              </div>

                              <br />
                            </div>
                          ) : (
                            <div className="col-12 align-item-center ">
                              <p>
                                Do you want to{" "}
                                {user?.istobaccoLicenceExpired
                                  ? "Enable"
                                  : "Disable"}{" "}
                                Licence ?
                              </p>
                              <div>
                                <input
                                  type="checkbox"
                                  className="border check"
                                  name="License"
                                  value="true"
                                  {...register("License")}
                                />
                                <small className="fs-5 fw-bold mx-2">Yes</small>
                              </div>

                              <br />
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-12 text-center">
                        <Button
                          loading={loader}
                          style={{
                            backgroundColor: "#eb3237",
                            fontSize: "20px",
                            position: "relative",
                            top: "-2px",
                          }}
                          appearance="primary"
                          className="comman_btn2 mx-2"
                          type="submit">
                          Submit
                        </Button>
                      </div>
                    </form>
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

export default EditSubAccount;
