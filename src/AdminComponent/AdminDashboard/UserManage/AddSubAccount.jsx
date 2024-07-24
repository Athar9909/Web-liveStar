import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import "../../../assets/css/adminMain.css";
import Starlogo from "../../../assets/img/logo.png";
import { useEffect } from "react";
import axios from "axios";
import classNames from "classnames";
import { FaFileUpload } from "react-icons/fa";
import ProfileBar from "../ProfileBar";
import { Button } from "rsuite";
import Swal from "sweetalert2";

const AddSubAccount = () => {
  const [files, setFiles] = useState([]);
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/addSubUser/`;
  const navigate = useNavigate();
  const [emailErr, setEmailErr] = useState("");
  const [loader, setLoader] = useState("");
  const [sideBar, setSideBar] = useState(true);
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
    watch,
    formState: { errors },
    trigger,
  } = useForm();

  const onFileSelection = (e, key) => {
    console.log(e);
    setFiles({ ...files, [key]: e.target.files[0] });
  };
  const onSubmit = async (data) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("companyName", data?.companyName.trim());
    formData.append("dba", data?.dba.trim());
    formData.append("addressLine1", data?.addressLine1.trim());
    formData.append("addressLine2", data?.addressLine2.trim());
    formData.append("businessPhoneNumber", data?.businessNumber);
    formData.append("city", data?.city.trim());
    formData.append("state", data?.state);
    formData.append("zipcode", data?.zipcode.trim());
    formData.append("firstName", data?.firstName.trim());
    formData.append("lastName", data?.lastName.trim());
    formData.append("federalTaxId", files?.federalTaxId);
    formData.append("businessLicense", files?.businessLicense);
    formData.append("tobaccoLicence", files?.tobaccoLicence);
    formData.append("salesTaxId", files?.salesTaxId);
    formData.append("accountOwnerId", files?.accountOwnerId);
    formData.append("accountNumber", data?.account);


    await axios.post(apiUrl + id, formData).then((res) => {
      console.log(res);
      if (res?.data.message === "sub account created") {
        setLoader(false);
        navigate(-1);
        Swal.fire({
          title: "Sub-account Created",
          icon: "success",
          button: "Okay",
          timer: 2000,
        });
      }
      if (res?.data.message === "Invalid file format") {
        setLoader(false);
        Swal.fire({
          title: "Invalid File Format!",
          text: "Only images/pdf/docs are allowed.",
          icon: "error",
          button: "Ok",
        });
      }
      if (res?.data.message === "Email is already registered") {
        setLoader(false);
        Swal.fire({
          title: "Email is Already registered!",
          icon: "error",
          button: "Ok",
        });
        setEmailErr("Email is already registered");
      }
      if (res?.data.message === "Phone is already registered") {
        setLoader(false);

        Swal.fire({
          title: "Phone is already registered!",
          icon: "error",
          button: "Ok",
        });
      }
      if (res?.data.message === "Email is already registered") {
        setLoader(false);

        setEmailErr("Email is already registered");
      }
      if (res?.data.error) {
        setLoader(false);
        Swal.fire({
          title: res?.data.message,
          icon: "error",
          button: "Ok",
        });
      }
    });
    setTimeout(() => {
      setLoader(false);
    }, [4000]);
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
          <div className=" text-end">
            <button
              className="comman_btn2 mb-2"
              onClick={() => {
                navigate(-1);
              }}>
                
              Go Back
            </button>
            <div className="row mx-0">
              <div className="col-12 design_outter_comman recent_orders shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-auto">
                    <h2 className="main_headers">Add New Sub-Account</h2>
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
                      onSubmit={handleSubmit(onSubmit)}>

                 

                      <div className="form-group col-3 mb-0">
                        <label htmlFor="" className="fw-bold fs-6">
                          Company
                        </label>
                        <input
                          type="text"
                          className={classNames(
                            "form-control  border border-secondary  signup_fields",
                            { "is-invalid": errors.companyName }
                          )}
                          name="companyName"
                          id="name"
                          {...register("companyName", {
                            required: "Company Name is Required*",
                            pattern: {
                              value: /^[^*|\":<>[\]{}`\\()';@&$]+$/,
                              message: "Special Character not allowed",
                            },

                            minLength: {
                              value: 4,
                              message:
                                "Minimium 4 letters Should be in Company Name", // JS only: <p>error message</p> TS only support string
                            },
                          })}
                        />
                        {errors.companyName && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.companyName?.message}
                          </small>
                        )}
                      </div>


                      <div className="form-group col-3 mb-0">
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
                          id="DBA"
                          {...register("dba")}
                        />
                      </div>

                      <div className="form-group col-3 mb-0">
                        <label htmlFor="" className="fw-bold fs-6">
                          Zip/Postal Code
                        </label>
                        <input
                          type="number"
                          className={classNames(
                            "form-control  border border-secondary signup_fields",
                            { "is-invalid": errors.zipcode }
                          )}
                          name="zipcode"
                          id="name"
                          {...register("zipcode", {
                            required: "Required and max-length is 10",
                            maxLength: 10,
                          })}
                        />
                        {errors.zipcode && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.zipcode?.message}
                          </small>
                        )}
                      </div>

                      

                      <div className="form-group col-3 mb-5">
                        <label htmlFor="address" className="fw-bold fs-6">
                          Company Address Line 1
                        </label>
                        <input
                          type="text"
                          className={classNames(
                            "form-control  border border-secondary signup_fields",
                            { "is-invalid": errors.addressLine1 }
                          )}
                          name="addressLine1"
                          id="address"
                          {...register("addressLine1", {
                            required: "Company Address Line1 is Required*",
                            pattern: {
                              value: /^[^*|\":<>[\]{}`\\()';@&$]+$/,
                              message: "Special Character not allowed",
                            },

                            minLength: {
                              value: 5,
                              message:
                                "Minimium 4 letters Should be in Address Line", // JS only: <p>error message</p> TS only support string
                            },
                          })}
                        />
                        {errors.addressLine1 && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.addressLine1?.message}
                          </small>
                        )}
                      </div>



                      <div className="form-group col-3 mb-4">
                        <label htmlFor="" className="fw-bold fs-6">
                        Account Number
                        </label>
                        <input
                          type="text"
                          className="form-control border border-secondary "
                          name="account"
                          id="account"
                          {...register("account")}
                        />
                      </div>


                      
                      <div className="form-group col-3 mb-4">
                        <label htmlFor="" className="fw-bold fs-6">
                          Company Address Line 2
                        </label>
                        <input
                          type="text"
                          className="form-control border border-secondary "
                          name="addressLine2"
                          id="addressLine2"
                          {...register("addressLine2")}
                        />
                      </div>


                      <div className="form-group col-3 mb-4">
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
                          {...register("state", {
                            required: "State is Required*",
                            onChange: (e) => {
                              handleCities(e.target.value);
                            },
                          })}>
                          <option value="">Select a state/province...</option>
                          <option value="Alabama">Alabama</option>
                          <option value="Alabama">Alabama</option>
                          <option value="Alaska">Alaska</option>
                          <option selected="" value="American Samoa">
                            American Samoa
                          </option>
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
                          <option value="Georgia" selected>
                            Georgia
                          </option>
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

                      <div className="form-group col-3 mb-4  ">
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
                          disabled={cities?.length ? false : true}
                          {...register("city", {
                            required: "City is Required*",
                          })}>
                          <option value="">Select City</option>
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

                      <div className="col-md-3 mb-4 mt-2 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold fs-6">Federal Tax ID:</span>
                          <div className="col img_box_show">
                            <input
                              className={classNames(
                                "d-none  border border-secondary signup_fields",
                                { "is-invalid": errors.federalTaxId }
                              )}
                              type="file"
                              id="file1"
                              accept="image/jpeg,image/png,application/pdf,image/x-eps"
                              name="federalTaxId"
                              {...register("federalTaxId")}
                              onChange={(e) =>
                                onFileSelection(e, "federalTaxId")
                              }
                            />

                            <label htmlFor="file1" className="mt-3">
                              <div className="">
                                <FaFileUpload size={26} />
                                <h1 className=" fs-6 mt-2 text-secondary">
                                  {files.federalTaxId?.name}
                                </h1>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 mt-2 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold fs-6">Tobacco License:</span>
                          <div className="col img_box_show">
                            <input
                              className={classNames(
                                " d-none form-control border border-secondary signup_fields",
                                { "is-invalid": errors.tobaccoLicence }
                              )}
                              type="file"
                              id="file2"
                              accept="image/jpeg,image/png,application/pdf,image/x-eps"
                              name="tobaccoLicence"
                              {...register("tobaccoLicence")}
                              onChange={(e) =>
                                onFileSelection(e, "tobaccoLicence")
                              }
                            />

                            <label htmlFor="file2" className="mt-3">
                              <div className="">
                                <FaFileUpload size={25} />
                                <h1 className=" fs-6 mt-2 text-secondary">
                                  {files.tobaccoLicence?.name}
                                </h1>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="col-md-3 mb-4 mt-2 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold fs-6">Sales Tax ID:</span>
                          <div className="col img_box_show">
                            <input
                              className={classNames(
                                "d-none form-control  border border-secondary signup_fields",
                                { "is-invalid": errors.salesTaxId }
                              )}
                              type="file"
                              id="file3"
                              accept="image/jpeg,image/png,application/pdf,image/x-eps"
                              name="salesTaxId"
                              {...register("salesTaxId")}
                              onChange={(e) => onFileSelection(e, "salesTaxId")}
                            />

                            <label htmlFor="file3" className="mt-3">
                              <div className="">
                                <FaFileUpload size={25} />
                                <h1 className=" fs-6 mt-2 text-secondary">
                                  {files.salesTaxId?.name}
                                </h1>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-3 mb-4 mt-2 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold fs-6">
                            Business License:
                          </span>
                          <div className="col img_box_show">
                            <input
                              className={classNames(
                                "d-none form-control  border border-secondary signup_fields",
                                { "is-invalid": errors.businessLicense }
                              )}
                              type="file"
                              id="file4"
                              accept="image/jpeg,image/png,application/pdf,image/x-eps"
                              name="businessLicense"
                              {...register("businessLicense")}
                              onChange={(e) =>
                                onFileSelection(e, "businessLicense")
                              }
                            />

                            <label htmlFor="file4" className="mt-3">
                              <div className="">
                                <FaFileUpload size={25} />
                                <h1 className=" fs-6 mt-2 text-secondary">
                                  {files.businessLicense?.name}
                                </h1>
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
                          name="fisrtName"
                          id="name"
                          {...register("firstName", {
                            required: "Enter Your First Name*",
                            pattern: {
                              value: /^[^*|\":<>[\]{}`\\()';%@&$]+$/,
                              message: "Special Character not allowed",
                            },
                          })}
                        />
                        {errors.firstName && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.firstName?.message}
                          </small>
                        )}
                      </div>
                      <div className="form-group col-4 mb-4">
                        <label htmlFor="" className="fw-bold fs-6">
                          Contact Last name
                        </label>
                        <input
                          type="text"
                          className={classNames(
                            "form-control  border border-secondary signup_fields fw-bold",
                            { "is-invalid": errors.lastName }
                          )}
                          name="lastName"
                          id="name"
                          {...register("lastName", {
                            pattern: {
                              value: /^[^*|\":<>[\]{}`\\()';%!#@&$]+$/,
                              message: "Special Character not allowed",
                            },
                          })}
                        />
                        {errors.lastName && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.lastName?.message}
                          </small>
                        )}
                      </div>
                      <div className="form-group col-4 mb-4">
                        <label htmlFor="" className="fw-bold fs-6">
                          Business Number
                        </label>
                        <input
                          type="number"
                          className={classNames(
                            "form-control  border border-secondary signup_fields ",
                            { "is-invalid": errors.businessNumber }
                          )}
                          name="businessNumber"
                          id="name"
                          {...register("businessNumber", {
                            maxLength: {
                              value: 10,
                              message: "maximium 10 Characters",
                            },
                            minLength: 10,
                          })}
                        />
                        {errors.businessNumber && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.businessNumber?.message}
                          </small>
                        )}
                      </div>
                      {/* <div className="form-group col-4 mb-4">
                        <label htmlFor="" className="fw-bold fs-6">
                          Phone Number
                        </label>
                        <input
                          type="number"
                          className={classNames(
                            "form-control  border border-secondary signup_fields ",
                            { "is-invalid": errors.phoneNumber }
                          )}
                          name="phoneNumber"
                          id="name"
                          {...register("phoneNumber", {
                            required: "Phone Number is Required*",

                            maxLength: {
                              value: 10,
                              message: "maximium 10 Characters",
                            },
                            minLength: 10,
                          })}
                        />
                        {errors.phoneNumber && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.phoneNumber?.message}
                          </small>
                        )}
                      </div> */}
                      <div className="col-md-12 mb-4 mt-2 d-flex align-items-stretch">
                        <div className="row view-inner-box border mx-0 w-100">
                          <span className="fw-bold fs-6">
                            Account Owner ID:
                          </span>
                          <div className="col img_box_show">
                            <input
                              className={classNames(
                                "d-none form-control  border border-secondary signup_fields",
                                { "is-invalid": errors.accountOwnerId }
                              )}
                              type="file"
                              id="file5"
                              accept="image/jpeg,image/png,application/pdf,image/x-eps"
                              name="accountOwnerId"
                              {...register("accountOwnerId")}
                              onChange={(e) =>
                                onFileSelection(e, "accountOwnerId")
                              }
                            />

                            <label htmlFor="file5" className="mt-2">
                              <div className="">
                                <FaFileUpload size={25} />
                                <h1 className=" fs-6 mt-2 text-secondary">
                                  {files.accountOwnerId?.name}
                                </h1>
                              </div>
                            </label>
                          </div>
                        </div>
                      </div>

                      {/* <div className="form-group col-4 mb-4">
                        <label htmlFor="" className="fw-bold fs-6">
                          Email Address
                        </label>
                        <input
                          type="text"
                          className={classNames(
                            "form-control  border border-secondary signup_fields ",
                            { "is-invalid": errors.email }
                          )}
                          name="email"
                          id="name"
                          {...register("email", {
                            required: "Email is Required*",

                            pattern: {
                              value:
                                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                              message: "Invalid email address",
                            },
                          })}
                        />
                        {errors.email && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.email?.message}
                          </small>
                        )}
                        {emailErr}
                      </div> */}

                      {/* <div className="form-group col-4 mb-4">
                        <label htmlFor="reference" className="fw-bold fs-6">
                          How do you know about us?
                        </label>
                        <select
                          className={classNames(
                            "form-control  border border-secondary signup_fields ",
                            { "is-invalid": errors.heardAboutUs }
                          )}
                          name="heardAboutUs"
                          id="reference"
                          {...register("heardAboutUs", {
                            required: "This field is Required",
                          })}>
                          {errors.heardAboutUs && (
                            <small className="errorText mx-1 fw-bold">
                              {errors.heardAboutUs?.message}
                            </small>
                          )}
                          <option selected="" value="Email Flyer">
                            Email Flyer
                          </option>
                          <option value="Search Engine (Google, Yahoo, Bing, Etc.)">
                            Search Engine (Google, Yahoo, Bing, Etc.)
                          </option>
                          <option value="SMS">SMS</option>
                          <option value="Referral">Referral</option>
                          <option value="Instagram">Instagram</option>
                        </select>
                      </div> */}
                      <div className="col-12 text-center mt-4">
                        <Button
                          loading={loader}
                          className="comman_btn mx-2"
                          style={{ backgroundColor: "#eb3237", color: "#FFF" }}
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

export default AddSubAccount;
