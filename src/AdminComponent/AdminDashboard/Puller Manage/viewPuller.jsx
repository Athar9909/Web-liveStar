import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Starlogo from "../../../assets/img/logo.png";
import ProfileBar from "../ProfileBar";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { Button } from "rsuite";
import LinearProgress from "@mui/material/LinearProgress";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "70%", mr: 1, ml: 2 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}
const ViewPuller = () => {
  const [sideBar, setSideBar] = useState(true);
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const [pullerId, setPullerId] = useState();
  const getPullerApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getPuller`;
  const editPuller = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/editPuller`;
  const activeOrdersApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getActiveOrders`;
  const [pullerDetails, setPullerDetails] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  let { id } = useParams();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [progress, setProgress] = useState(10);

  const onFileSelection = (e, key) => {
    let image = e.target.files[0];
    setFiles({ ...files, [key]: image });
  };

  useEffect(() => {
    getPuller();
    getOrderActive();
  }, []);

  const getPuller = async () => {
    await axios.get(getPullerApi + "/" + id).then((res) => {
      setPullerDetails(res?.data.results?.puller[0]);
    });
  };

  const getOrderActive = async () => {
    await axios.get(activeOrdersApi + "/" + id).then((res) => {
      setActiveOrders(res?.data.results?.orders);
    });
  };

  const onSubmit = async (data) => {
    let formData = new FormData();
    formData.append("fullName", data?.puller_name?.trim());
    formData.append("email", data?.email?.trim());
    formData.append("password", data?.password?.trim());
    formData.append("image", files?.imageProfile);
    await axios
      .post(editPuller + "/" + id, formData)
      .then((res) => {
        if (res?.data?.message === "Puller updated") {
          getPuller();
          setFiles([]);
          navigate("/Puller-Management");
          Swal.fire({
            title: res?.data?.message,
            text: "Successfully Updated!",
            icon: "success",
            timer: 1000,
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

  document.getElementById("image_up")?.addEventListener("change", function () {
    if (this.files[0]) {
      var picture = new FileReader();
      picture.readAsDataURL(this.files[0]);
      picture.addEventListener("load", function (event) {
        document
          .getElementById("image")
          .setAttribute("src", event.target.result);
      });
    }
  });

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
              <div className="row ms-3 mb-5 justify-content-center">
                <div className="col-3 mb-4 d-flex align-items-stretch">
                  <Link
                    to="/admin/clinician-management"
                    className="row dashboard_box box_design me-3 w-100">
                    <div className="col-auto px-0">
                      <span className="dashboard_icon">
                        <i class="fa-solid fa-clipboard-list"></i>
                      </span>
                    </div>
                    <div className="col pe-0">
                      <div className="dashboard_boxcontent">
                        <h2>Total Orders</h2>
                        <span>{pullerDetails?.TotalOrders}</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-3 mb-4 d-flex align-items-stretch">
                  <Link
                    to="/admin/clinician-management"
                    className="row dashboard_box box_design me-3 w-100">
                    <div className="col-auto px-0">
                      <span className="dashboard_icon">
                        <i class="fa-solid fa-spinner"></i>
                      </span>
                    </div>
                    <div className="col pe-0">
                      <div className="dashboard_boxcontent">
                        <h2>Assigned Orders</h2>
                        <span>{pullerDetails?.AssignedOrdersCount}</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-3 mb-4 d-flex align-items-stretch">
                  <Link
                    to="/admin/clinician-management"
                    className="row dashboard_box box_design me-3 w-100">
                    <div className="col-auto px-0">
                      <span className="dashboard_icon">
                        <i class="fa-solid fa-hourglass-half"></i>
                      </span>
                    </div>
                    <div className="col pe-0">
                      <div className="dashboard_boxcontent">
                        <h2>Pending Orders</h2>
                        <span>{pullerDetails?.InProgressOrdersCount}</span>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="col-3 mb-4 d-flex align-items-stretch">
                  <Link
                    to="/admin/clinician-management"
                    className="row dashboard_box box_design me-3 w-100">
                    <div className="col-auto px-0">
                      <span className="dashboard_icon">
                        <i class="fa-solid fa-list-check"></i>
                      </span>
                    </div>
                    <div className="col pe-0">
                      <div className="dashboard_boxcontent">
                        <h2>Completed Orders</h2>
                        <span>{pullerDetails?.CompletedOrdersCount}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>

              <div className="col-12 mb-4 d-flex align-items-stretch"></div>

              <div className="row mx-0">
                <div className="col-12 design_outter_comman recent_orders shadow">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2 className="main_headers">Puller Details</h2>
                    </div>
                    <div className="col-auto">
                      <div className="Status_box">
                        Status:{" "}
                        <strong>
                          {pullerDetails?.status ? "Active" : "In-active"}
                        </strong>
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
                          <div className="form-group col-auto">
                            <div className="account_profile position-relative d-inline-block">
                              <div className="mb-2 Pending-view_img">
                                <img
                                  className="UserImage"
                                  id="image"
                                  src={pullerDetails?.image}
                                  alt="Upload Image ........"
                                />
                              </div>

                              <div className="p-image">
                                <i className="upload-iconIN fas fa-camera" />

                                <input
                                  className="file-uploadIN"
                                  id="image_up"
                                  type="file"
                                  name="imageProfile"
                                  accept="image/*"
                                  {...register("imageProfile")}
                                  onChange={(e) =>
                                    onFileSelection(e, "imageProfile")
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-group col-6 mb-4">
                          <label htmlFor="" className="fw-bold fs-6">
                            Puller Name
                          </label>
                          <input
                            type="text"
                            className={classNames(
                              "form-control  border border-secondary  signup_fields",
                              { "is-invalid": errors.puller_name }
                            )}
                            defaultValue={pullerDetails?.fullName}
                            name="puller_name"
                            id="name"
                            {...register("puller_name")}
                          />
                          {errors.puller_name && (
                            <small className="errorText mx-1 fw-bold">
                              {errors.puller_name?.message}
                            </small>
                          )}
                        </div>

                        <div className="form-group col-6 mb-4">
                          <label htmlFor="" className="fw-bold fs-6">
                            Email Address
                          </label>
                          <input
                            type="text"
                            className={classNames(
                              "form-control  border border-secondary signup_fields ",
                              { "is-invalid": errors.email }
                            )}
                            defaultValue={pullerDetails?.email}
                            name="email"
                            id="name"
                            {...register("email", {
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
                        </div>
                        <div className="form-group col-6 mb-4">
                          <label htmlFor="" className="fw-bold fs-6">
                            Set New Password
                          </label>
                          <input
                            type="text"
                            className={classNames(
                              "form-control border border-secondary",
                              {
                                "is-invalid": errors.password,
                              }
                            )}
                            name="password"
                            placeholder="************"
                            {...register("password", {
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

                          {errors.password && (
                            <small className="errorText mx-1 fw-bold">
                              {errors.password?.message}
                            </small>
                          )}
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
                            Save Changes
                          </Button>
                        </div>
                      </form>
                    </div>

                    <div className="col-12 design_outter_comman  shadow">
                      <div className="row">
                        <div className="col-12 user-management-tabs px-0">
                          <nav>
                            <div
                              className="nav nav-tabs"
                              id="nav-tab"
                              role="tablist">
                              <button
                                style={{
                                  width: "33.33%",
                                }}
                                className="nav-link active"
                                id="nav-home-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-home"
                                type="button"
                                role="tab"
                                aria-controls="nav-home"
                                aria-selected="true">
                                Active Orders
                              </button>
                              <button
                                className="nav-link"
                                style={{
                                  width: "33.33%",
                                }}
                                id="nav-profile-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-profile"
                                type="button"
                                role="tab"
                                aria-controls="nav-profile"
                                aria-selected="false">
                                Pending Orders
                              </button>
                              <button
                                style={{
                                  width: "33.33%",
                                }}
                                className="nav-link"
                                id="nav-help-tab"
                                data-bs-toggle="tab"
                                data-bs-target="#nav-help"
                                type="button"
                                role="tab"
                                aria-controls="nav-help"
                                aria-selected="false">
                                Completed Orders
                              </button>
                            </div>
                          </nav>
                          <div className="tab-content" id="nav-tabContent">
                            <div
                              className="tab-pane fade show active"
                              id="nav-home"
                              role="tabpanel"
                              aria-labelledby="nav-home-tab">
                              <div className="row mx-0">
                                <div className="col-12 mb-4">
                                  <div className="cart_table\s">
                                    <div className="table-responsive">
                                      <table className="table puller_table">
                                        <thead>
                                          <tr className="">
                                            <th>ORDER ID</th>
                                            <th>ORDER TYPE</th>
                                            <th>START DATE</th>
                                            <th>PULL STATUS</th>
                                            <th>ACTION</th>
                                          </tr>
                                        </thead>

                                        <tbody className="border">
                                          {(activeOrders || [])?.map(
                                            (item, index) => (
                                              <tr className="border">
                                                <td className="border text-center">
                                                  <div className="cart_content border text-center mt-2">
                                                    {item?.orderId}
                                                  </div>
                                                </td>
                                                <td className="border text-center">
                                                  <div className="cart_content mt-2">
                                                    <h3 className="fs-6">
                                                      {item?.type}
                                                    </h3>
                                                  </div>
                                                </td>
                                                <td>
                                                  <span className="ordertext my-2 d-block text-center ">
                                                    {item?.startTime?.slice(
                                                      0,
                                                      10
                                                    )}
                                                  </span>
                                                </td>

                                                <td className="border rounded ">
                                                  <span className="fs-5 text-secondary  p-2 px-3 rounded">
                                                    {item?.pullStatus}
                                                    <Box sx={{ width: "100%" }}>
                                                      <LinearProgressWithLabel
                                                        color="success"
                                                        value={
                                                          item?.scannedPercentage
                                                        }
                                                      />
                                                    </Box>
                                                  </span>
                                                </td>

                                                <td className="border text-center">
                                                  <span className="fs-5 rounded ">
                                                    <button
                                                      className="comman_btn"
                                                      onClick={() =>
                                                        navigate(
                                                          `/OrderRequest/ViewOrder/${item?._id}`
                                                        )
                                                      }>
                                                      View
                                                    </button>
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
                              </div>
                            </div>
                            <div
                              className="tab-pane fade"
                              id="nav-profile"
                              role="tabpanel"
                              aria-labelledby="nav-profile-tab">
                              <div className="row mx-0 ">
                                <div className="col-12 mb-4">
                                  <div className="cart_table\s">
                                    <div className="table-responsive">
                                      <table className="table puller_table">
                                        <thead>
                                          <tr className="">
                                            <th>ORDER ID</th>
                                            <th>ORDER TYPE</th>
                                            <th>ORDER DATE</th>
                                            <th>PULL STATUS</th>
                                            <th>ACTION</th>
                                          </tr>
                                        </thead>
                                        <tbody className="border">
                                          {(
                                            pullerDetails?.inProgress || []
                                          )?.map((item, index) => (
                                            <tr className="border">
                                              <td className="border text-center">
                                                <div className="cart_content border text-center mt-2">
                                                  {item?.orderId}
                                                </div>
                                              </td>
                                              <td className="border text-center">
                                                <div className="cart_content mt-2">
                                                  <h3 className="fs-6">
                                                    {item?.type}
                                                  </h3>
                                                </div>
                                              </td>
                                              <td>
                                                <span className="ordertext my-2 d-block text-center ">
                                                  Ordered On:{" "}
                                                  {item?.createdAt?.slice(
                                                    0,
                                                    10
                                                  )}
                                                </span>
                                              </td>

                                              <td className="border rounded">
                                                <span className="fs-5 text-secondary  p-2 px-3 rounded">
                                                  {item?.pullStatus}
                                                </span>
                                              </td>

                                              <td className="border text-center">
                                                <span className="fs-5 rounded ">
                                                  <button
                                                    className="comman_btn"
                                                    onClick={() =>
                                                      navigate(
                                                        `/OrderRequest/ViewOrder/${item?._id}`
                                                      )
                                                    }>
                                                    View
                                                  </button>
                                                </span>
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
                            <div
                              className="tab-pane fade"
                              id="nav-help"
                              role="tabpanel"
                              aria-labelledby="nav-help-tab">
                              <div className="row mx-0 ">
                                <div className="col-12 mb-4">
                                  <div className="cart_table\s">
                                    <div className="table-responsive">
                                      <table className="table puller_table">
                                        <thead>
                                          <tr className="">
                                            <th>ORDER ID</th>
                                            <th>ORDER TYPE</th>
                                            <th>ORDER DATE</th>
                                            <th>PULL STATUS</th>
                                            <th>ACTION</th>
                                          </tr>
                                        </thead>
                                        <tbody className="border">
                                          {(
                                            pullerDetails?.completed || []
                                          )?.map((item, index) => (
                                            <tr className="border">
                                              <td className="border text-center">
                                                <div className="cart_content border text-center mt-2">
                                                  {item?.orderId}
                                                </div>
                                              </td>
                                              <td className="border text-center">
                                                <div className="cart_content mt-2">
                                                  <h3 className="fs-6">
                                                    {item?.type}
                                                  </h3>
                                                </div>
                                              </td>
                                              <td>
                                                <span className="ordertext my-2 d-block text-center ">
                                                  Ordered On:{" "}
                                                  {item?.createdAt?.slice(
                                                    0,
                                                    10
                                                  )}
                                                </span>
                                              </td>

                                              <td className="border rounded">
                                                <span className="fs-5 text-secondary  p-2 px-3 rounded">
                                                  {item?.pullStatus}
                                                </span>
                                              </td>

                                              <td className="border text-center">
                                                <span className="fs-5 rounded ">
                                                  <button
                                                    className="comman_btn"
                                                    onClick={() =>
                                                      navigate(
                                                        `/OrderRequest/ViewOrder/${item?._id}`
                                                      )
                                                    }>
                                                    View
                                                  </button>
                                                </span>
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

export default ViewPuller;
