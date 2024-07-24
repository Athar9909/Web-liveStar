import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Starlogo from "../../../assets/img/logo.png";
import ProfileBar from "../ProfileBar";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";

const PullerManagement = () => {
  const [sideBar, setSideBar] = useState(true);
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const [pullerCounts, setPullerCounts] = useState([]);
  const getPullerApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/allPullers`;
  const pullerStatusChange = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/changeStatus`;
  const createPuller = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/createPuller`;
  const dashCount = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/pullerDasboard`;
  const [allPullers, setAllPullers] = useState();
  const [maxPage, setMaxPage] = useState(1);
  const [files, setFiles] = useState([]);
  const [activePage, setActivePage] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const onFileSelection = (e, key) => {
    let image = e.target.files[0];
    setFiles({ ...files, [key]: image });
  };
  useEffect(() => {
    getPullers();
    getPullersDashCount();
  }, []);
  const getPullers = async () => {
    await axios.get(getPullerApi).then((res) => {
      setAllPullers(res?.data.results.pullers);
      setMaxPage(res?.data.results.totalPages);
    });
  };
  const getPullersDashCount = async () => {
    await axios.get(dashCount).then((res) => {
      setPullerCounts(res?.data.results.puller[0]);
    });
  };

  const onSubmit = async (data) => {
    let formData = new FormData();
    formData.append("fullName", data?.puller_name?.trim());
    formData.append("email", data?.email?.trim());
    formData.append("password", data?.password?.trim());
    formData.append("phoneNumber", data?.phoneNumber?.trim());
    formData.append("image", files?.coverImage);
    await axios
      .post(createPuller, formData)
      .then((res) => {
        if (res?.data?.message === "Pullers created") {
          getPullers();
          setFiles([]);
          document.getElementById("resetF").click();
          Swal.fire({
            title: res?.data?.message,
            text: "New Puller Created!",
            icon: "success",
            timer: 2000,
            confirmButtonText: "okay",
          });
        }
        if (res?.data?.error) {
          Swal.fire({
            title: res?.data.message,
            icon: "error",
            confirmButtonText: "okay",
          });
        }
      })
      .catch((err) => {
        if (err) {
          Swal.fire({
            title: err.response?.data?.message,
            text: "",
            icon: "error",
            confirmButtonText: "ok",
          });
        }
      });
  };

  const PullerStatus = async (id) => {
    const { data } = await axios.get(pullerStatusChange + "/" + id);
    if (!data?.error) {
      getPullers();
      Swal.fire({
        title: "Puller Status Changed!",
        icon: "success",
        confirmButtonText: "Okay",
      });
    }
  };

  const togglePassword = () => {
    let x = document.getElementById("floatingPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
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
                  }>
                  <Link
                    className=""
                    to="/AdminDashboard"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "2px" }}
                      className="fa fa-home"></i>{" "}
                    Dashboard
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("User Management") ? "" : "d-none"
                  }>
                  <Link
                    className=""
                    to="/UserManage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-user"></i>{" "}
                    User Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("Category Sub-Category Management")
                      ? ""
                      : "d-none"
                  }>
                  <Link
                    className=""
                    to="/CategorySub"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-layer-group"></i>{" "}
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
                  }>
                  <Link
                    className=""
                    to="/Inventory"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "6px", top: "3px" }}
                      class="far fa-building"></i>{" "}
                    Inventory Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("Brands Management") ? "" : "d-none"
                  }>
                  <Link
                    className=""
                    to="/brandsManage"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-ship"></i>{" "}
                    Brands Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("Sub-Admin") ? "" : "d-none"
                  }>
                  <Link
                    className=""
                    to="/Admin/SubAdmin"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-user-cog"></i>{" "}
                    Sub-Admin Management
                  </Link>
                </li>
                <li
                  className={User?.access?.includes("Puller") ? "" : "d-none"}>
                  <Link
                    className="bg-white"
                    to="/Puller-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-user-cog"></i>{" "}
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
                  className={User?.access?.includes("Gallery") ? "" : "d-none"}>
                  <Link
                    className=""
                    to="/Gallery-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-image"></i>{" "}
                    Gallery Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("catalogFlyers") ? "" : "d-none"
                  }>
                  <Link
                    className=""
                    to="/Catelog-Flyers"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-book"></i>{" "}
                    Catalog & Flyers
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("Orders Management") ? "" : "d-none"
                  }>
                  <Link
                    className=""
                    to="/OrderRequest"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-layer-group"></i>{" "}
                    Order Management
                  </Link>
                </li>
                <li className={User?.access?.includes("CMS") ? "" : "d-none"}>
                  <Link
                    className=""
                    to="/Cms"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-cog"></i>{" "}
                    Content Management
                  </Link>
                </li>
                <li
                  className={User?.access?.includes("Contact") ? "" : "d-none"}>
                  <Link
                    className=""
                    to="/Contact&Support"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-handshake-angle"></i>{" "}
                    Contact & Support
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/AdminLogin"
                    onClick={handleClick}
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-sign-out-alt"></i>
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
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "2px" }}
                      className="fa fa-home"></i>{" "}
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/UserManage"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-user"></i>{" "}
                    User Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/CategorySub"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-layer-group"></i>{" "}
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
                    }}>
                    <i
                      style={{ position: "relative", left: "6px", top: "3px" }}
                      class="far fa-building"></i>{" "}
                    Inventory Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/brandsManage"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-ship"></i>{" "}
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
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-user-cog"></i>{" "}
                    Sub-Admin Management
                  </Link>
                </li>
                <li>
                  <Link
                    className="bg-white"
                    to="/Admin/SubAdmin"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-users-gear"></i>{" "}
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
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-image"></i>{" "}
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
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-image"></i>{" "}
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
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-book"></i>{" "}
                    Catalog & Flyers
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/OrderRequest"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-layer-group"></i>{" "}
                    Order Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Cms"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-cog"></i>{" "}
                    Content Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Contact&Support"
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-handshake-angle"></i>{" "}
                    Contact & Support
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/AdminLogin"
                    onClick={handleClick}
                    style={{ textDecoration: "none", fontSize: "18px" }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-sign-out-alt"></i>
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

        <div className="admin_panel_data height_adjust">
          <div className="row inventory-management justify-content-center">
            <div className="col-12">
              <div className="row ms-3 mb-4 justify-content-center">
                <div className="col-3 mb-3 d-flex align-items-stretch">
                  <Link
                    to="/Puller-Management/LiveDashboard"
                    className="row dashboard_box box_design me-3 w-100">
                    <div className="col-auto px-0">
                      <span className="dashboard_icon">
                        <i
                          class="fa-regular fa-circle-dot"
                          style={{ color: "red" }}></i>
                      </span>
                    </div>
                    <div className="col pe-0">
                      <div className="dashboard_boxcontent">
                        <h2>Live Orders</h2>
                        <span>{pullerCounts?.liveOrders}</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-3 mb-3 d-flex align-items-stretch">
                  <Link
                    to="#"
                    className="row dashboard_box box_design me-3 w-100">
                    <div className="col-auto px-0">
                      <span className="dashboard_icon">
                        <i class="fa-solid fa-clipboard-list"></i>
                      </span>
                    </div>
                    <div className="col pe-0">
                      <div className="dashboard_boxcontent">
                        <h2>Total Pullers</h2>
                        <span>{pullerCounts?.pullers}</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-3 mb-3 d-flex align-items-stretch">
                  <Link
                    to="#"
                    className="row dashboard_box box_design me-3 w-100">
                    <div className="col-auto px-0">
                      <span className="dashboard_icon">
                        <i class="fa-solid fa-spinner"></i>
                      </span>
                    </div>
                    <div className="col pe-0">
                      <div className="dashboard_boxcontent">
                        <h2>Assigned Pullers</h2>
                        <span>{pullerCounts?.assigned}</span>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="col-3 mb-3 d-flex align-items-stretch">
                  <Link
                    to="#"
                    className="row dashboard_box box_design me-3 w-100">
                    <div className="col-auto px-0">
                      <span className="dashboard_icon">
                        <i class="fa-solid fa-list-check"></i>
                      </span>
                    </div>
                    <div className="col pe-0">
                      <div className="dashboard_boxcontent">
                        <h2>Completed Orders</h2>
                        <span>{pullerCounts?.completed}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="row mx-0 ">
                <div className="col-12 design_outter_comman shadow mb-4">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2> Add Puller</h2>
                    </div>
                  </div>

                  <form
                    className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between "
                    action=""
                    onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group mb-0 col-6 choose_fileAdmin position-relative">
                      <span>
                        Cover Image:{" "}
                        {errors.coverImage && (
                          <small className="errorText mx-1 fw-bold">
                            *{errors.coverImage?.message}
                          </small>
                        )}
                      </span>{" "}
                      <label htmlFor="upload_video">
                        <i class="fa fa-camera me-1"></i>
                        Choose File
                      </label>{" "}
                      <input
                        type="file"
                        className="form-control shadow-none"
                        defaultValue=""
                        accept="image/*"
                        name="coverImage"
                        {...register("coverImage", {
                          required: "Image is Required",
                          onChange: (e) => {
                            onFileSelection(e, "coverImage");
                          },
                        })}
                      />
                    </div>

                    <div className="form-group col-6 mb-0">
                      <label htmlFor="puller">
                        Puller Name{" "}
                        {errors.puller_name && (
                          <small className="errorText mx-1 fw-bold">
                            *{errors.puller_name?.message}
                          </small>
                        )}
                      </label>
                      <input
                        type="text"
                        id="puller"
                        className={classNames(
                          "form-control border border-secondary",
                          {
                            "is-invalid": errors.puller_name,
                          }
                        )}
                        name="puller_name"
                        placeholder="Enter Name"
                        {...register("puller_name", {
                          required: "Puller Name is required!",
                          pattern: {
                            value: /^[^*|\":<>[\]{}`\\()'0-9;@"&$#]+$/,
                            message: "Special Character not allowed",
                          },
                        })}
                      />
                    </div>

                    <div
                      className="form-group col-4 mb-5
                    ">
                      <label htmlFor="">
                        Email Address{" "}
                        {errors.email && (
                          <small className="errorText mx-1 fw-bold">
                            *{errors.email?.message}
                          </small>
                        )}
                      </label>
                      <input
                        type="email"
                        className={classNames(
                          "form-control border border-secondary",
                          {
                            "is-invalid": errors.email,
                          }
                        )}
                        name="email"
                        placeholder="Enter email address"
                        {...register("email", {
                          required: "Email is required!",
                          pattern: {
                            value:
                              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Invalid email address",
                          },
                        })}
                      />
                    </div>
                    <div
                      className="form-group col-4 mb-5
                    ">
                      <label htmlFor="">
                        Phone Number{" "}
                        {errors.phoneNumber && (
                          <small className="errorText mx-1 fw-bold">
                            *{errors.phoneNumber?.message}
                          </small>
                        )}
                      </label>
                      <input
                        type="number"
                        className={classNames(
                          "form-control border border-secondary",
                          {
                            "is-invalid": errors.phoneNumber,
                          }
                        )}
                        name="phoneNumber"
                        placeholder="Enter Phone Number "
                        {...register("phoneNumber", {
                          required: "Phone Number is required!",
                          maxLength: {
                            value: 10,
                            message: "maximium 10 Charcarters",
                          },
                          minLength: {
                            value: 8,
                            message: "minimium 8 Charcarters",
                          },
                        })}
                      />
                    </div>
                    <div className="form-group col-4 pt-4">
                      <label htmlFor="">
                        Set Password{" "}
                        {errors.password && (
                          <small className="errorText mx-1 fw-bold">
                            *{errors.password?.message}
                          </small>
                        )}
                      </label>
                      <input
                        type="password"
                        className={classNames(
                          "form-control border border-secondary",
                          {
                            "is-invalid": errors.password,
                          }
                        )}
                        name="password"
                        id="floatingPassword"
                        placeholder="************"
                        {...register("password", {
                          required: "Password is required!",
                          maxLength: {
                            value: 15,
                            message: "Cannot be more than 15 Characters",
                          },
                          // pattern: {
                          //   value:
                          //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                          //   message:
                          //     "Password must be 8 characters including one uppercase letter, one special character and alphanumeric characters (ex:Starlove12@)",
                          // },
                        })}
                      />
                      <span
                        onClick={togglePassword}
                        className="fa fa-fw fa-eye field-icon toggle-password3"
                      />
                    </div>
                    <div className="form-group mb-0 col-12 text-center mt-3">
                      <button className="comman_btn" type="submit">
                        Save Puller
                      </button>
                      <button
                        className="comman_btn d-none"
                        type="reset"
                        id="resetF">
                        Reset
                      </button>
                    </div>
                  </form>
                </div>
                
                <div className="col-12 design_outter_comman recent_orders shadow">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2>Puller Management</h2>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 comman_table_design px-0">
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <thead>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                              <th>S.No.</th>
                              <th>Date</th>
                              <th>Image</th>
                              <th>Puller Name</th>
                              <th>Phone Number</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(allPullers || [])?.map((item, index) => (
                              <tr key={index} className="border ">
                                <td>{index + 1}</td>
                                <td className="border">
                                  {moment(item?.createdAt?.slice(0, 10)).format(
                                    "MM/DD/YYYY"
                                  )}
                                </td>
                                <td className="border">
                                  <img
                                    className="subCatImages"
                                    src={
                                      item?.image
                                        ? item?.image
                                        : require("../../../assets/img/product.jpg")
                                    }></img>
                                </td>
                                <td className="border">{item?.fullName}</td>
                                <td className="border">{item?.phoneNumber}</td>

                                <td className=" border" key={item?.status}>
                                  {" "}
                                  <div className="">
                                    <label class="switchUser">
                                      <input
                                        type="checkbox"
                                        id={index + 1}
                                        defaultChecked={item?.status}
                                        onClick={() => {
                                          PullerStatus(item?._id);
                                        }}
                                      />
                                      <span class="sliderUser round"></span>
                                    </label>
                                  </div>
                                </td>

                                <td>
                                  <Link
                                    className="comman_btn2 text-white text-decoration-none"
                                    key={index}
                                    to={`/Puller-Management/Puller-details/${item?._id}`}>
                                    View
                                  </Link>
                                </td>
                              </tr>
                            ))}
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
      {/* <div
        className="modal fade comman_modal"
        id="staticBackdropAdmin"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Edit Sub-Admin
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="Modal"
                aria-label="Close"
                onClick={() => setSelectEditOptions(null)}
              />
            </div>
            <div className="modal-body shadow" key={EditView?.fullName}>
              <form className="form-design row p-2" action="">
                <div className="form-group col-6 w-50 ">
                  <label htmlFor="">Sub-Admin Name </label>
                  <input
                    type="text"
                    className="form-control-sub border border-secondary"
                    name="Epuller_name"
                    defaultValue={EditView?.fullName}
                    placeholder="Enter Name"
                    onChange={(e) => setEdit({ name: e.target.value })}
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Select Module</label>
                  <ReactSelect
                    options={colourOptions}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={handleChangeEdit}
                    allowSelectAll={true}
                    value={selectEditOptions?.optionSelected}
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Email Address </label>
                  <input
                    type="email"
                    className="form-control-sub border border-secondary"
                    name="Eemail"
                    defaultValue={EditView?.email}
                    placeholder="Enter Product Name"
                    onChange={(e) => setEdit({ email: e.target.value })}
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="EditPass">Sub-Admin Password </label>
                  <input
                    type="password"
                    className="form-control-sub border border-secondary"
                    id="EditPass"
                    defaultValue={EditView?.password}
                    name="Epassword"
                    disabled
                    placeholder="********"
                    onChange={(e) => setEdit({ password: e.target.value })}
                  />
                </div>
                <div className="form-group mb-0 col-12 text-center ">
                  <button className="comman_btn2" onClick={onEditSave}>
                    Save
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default PullerManagement;
