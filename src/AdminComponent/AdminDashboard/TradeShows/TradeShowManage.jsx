import React, { useEffect, useState } from "react";import { Link, useNavigate } from "react-router-dom";
import Starlogo from "../../../assets/img/logo.png";
import ProfileBar from "../ProfileBar";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { orderPdfData } from "../../../atom";
import { useSetRecoilState } from "recoil";

const TradeShowManage = () => {
  const [sideBar, setSideBar] = useState(true);
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const cityApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/cityByState`;
  const getVendorsApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getVendors`;
  const vendorStatusChange = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/vendorStatus`;
  const allStatusChange = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/changeAllVendorStatus `;
  const createVendor = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/addVendor`;
  const allOrders = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getAllTradeOrders`;
  const exportOrdersXls = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/exportTradeExcel`;
  const exportOrdersPdfs = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/exportToPDF`;
  const setOrderPdfData = useSetRecoilState(orderPdfData);
  const [allVendors, setAllVendors] = useState([]);
  const [allStatus, setAllStatus] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cities, setCities] = useState([]);
  const [maxPage, setMaxPage] = useState(1);
  const [maxPage2, setMaxPage2] = useState(1);
  const [files, setFiles] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [activePage2, setActivePage2] = useState(1);
  const [searchType, setSearchType] = useState("vendors");
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [selected, setSelected] = useState([]);
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onFileSelection = (e, key) => {
    let image = e.target.files[0];
    setFiles({ ...files, [key]: image });
  };

  const handleCities = async (state) => {
    const { data } = await axios.post(cityApi, {
      state: state,
    });
    if (!data.error) {
      setCities(data?.results?.states);
    }
  };

  useEffect(() => {
    getVendors();
    getAllOrders();
  }, [activePage, activePage2]);

  const getVendors = async (key) => {
    await axios
      .patch(getVendorsApi, {
        search: key,
        page: activePage,
      })
      .then((res) => {
        setAllVendors(res?.data.results.vendors?.data);
        setAllStatus(res?.data.results.status);
        setMaxPage(res?.data.results.totalPages);
      });
  };

  const getAllOrders = async (key) => {
    await axios
      .patch(allOrders, {
        search: key,
        page: activePage2,
      })
      .then((res) => {
        setOrders(res?.data.results.orders?.data);
        setMaxPage2(res?.data.results.totalPages);
      });
  };

  const onSubmit = async (data) => {
    console.log(data);
    let formData = new FormData();
    formData.append("companyName", data?.companyName?.trim());
    formData.append("repsresentative", data?.representative?.trim());
    formData.append("address", data?.address);
    formData.append("city", data?.city);
    formData.append("state", data?.state);
    formData.append("zipcode", data?.zipcode);
    formData.append("countryCode ", "+1");
    formData.append("email", data?.email?.trim());
    formData.append("phoneNumber", data?.phoneNumber?.trim());
    formData.append("password", data?.password?.trim());
    formData.append("image", files?.coverImage);
    await axios
      .post(createVendor, formData)
      .then((res) => {
        if (res?.data?.message === "Vendor added") {
          getVendors();
          setFiles([]);
          document.getElementById("resetF").click();
          Swal.fire({
            title: res?.data?.message,
            text: "New Vendor Created!",
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
    const { data } = await axios.get(vendorStatusChange + "/" + id);
    if (!data?.error) {
      getVendors();
      Swal.fire({
        title: "Vendor Status Changed!",
        icon: "success",
        confirmButtonText: "Okay",
      });
    }
  };
  const changeStatus = async (key) => {
    const { data } = await axios.patch(allStatusChange, {
      status: key,
    });
    if (!data?.error) {
      getVendors();
      Swal.fire({
        title: "Vendors Status Changed!",
        icon: "success",
        confirmButtonText: "Okay",
      });
    }
  };

  console.log(selected);

  const handleSelectAll = (e) => {
    const { checked } = e.target;
    // Toggle isCheckAll state
    setIsCheckAll(!isCheckAll);
    // If checked, add all item IDs to isCheck state and all product IDs to selected state
    if (checked) {
      const allItemIds = orders?.map((li) => li?._id) || [];
      setIsCheck(allItemIds);

      const allProductIds = (orders || []).map((val) => ({
        productId: val?._id,
      }));
      setSelected(allProductIds);
    } else {
      // Clear isCheck state if isCheckAll is true
      if (isCheckAll) {
        setIsCheck([]);
      }
      // Clear selected state
      setSelected([]);
    }
  };

  const handleClickSelect = (e, productId, id) => {
    const { checked } = e.target;
    // If checked, add product to selected state and add item ID to isCheck state
    if (checked) {
      setSelected([...selected, { productId }]);
      setIsCheck([...isCheck, productId]);
    } else {
      // Remove item from selected state and item ID from isCheck state
      setSelected(selected.filter((item) => item?.productId !== productId));
      setIsCheck(isCheck.filter((item) => item !== productId));
    }
  };

  const exportOrders = async (e) => {
    // e.preventDefault();
    if (selected?.length) {
      const { data } = await axios.patch(exportOrdersXls, {
        productIds: selected?.map((item) => item.productId),
      });
      if (!data.error) {
        setSelected([]);
        setIsCheck([]);
        setIsCheckAll([]);
        setSideBar([]);
        document.getElementById("selectAll").checked = false;
        const downloadLink = document.createElement("a");
        downloadLink.href = data.results.path ?? "";
        downloadLink.download = "doc";
        downloadLink.click();
      }
    } else {
      Swal.fire({
        text: "Please Select atleast One Order!",
        icon: "warning",
        confirmButtonText: "Okay",
        timer: 2000,
      });
    }
  };

  const exportOrdersPdf = async (e) => {
    // e.preventDefault();
    if (selected?.length) {
      const { data } = await axios.patch(exportOrdersPdfs, {
        productIds: selected?.map((item) => item.productId),
      });
      if (!data.error) {
        localStorage.setItem(
          "orderPdfData",
          JSON.stringify(data.results?.orders)
        );

        // Open in new tab
        const url = "/TradeOrderRequest/MultiplePdf";

        const newTab = window.open(`${url}`, "_blank");
        if (newTab) {
          newTab.focus();
        }
        setSelected([]);
        setIsCheck([]);
        setIsCheckAll([]);
        setSideBar([]);
        document.getElementById("selectAll").checked = false;
      }
    } else {
      Swal.fire({
        text: "Please Select atleast One Order!",
        icon: "warning",
        confirmButtonText: "Okay",
        timer: 2000,
      });
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
                    className=""
                    to="/Puller-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-user-cog"
                    ></i>{" "}
                    Puller Management
                  </Link>
                </li>
                <li className={User?.access?.includes("Trade") ? "" : "d-none"}>
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
                    className=""
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
                      setSideBar(!sideBar);
                    }}
                  >
                    <i className="fa fa-bars"></i>
                  </h1>
                </div>
              ) : (
                <div>
                  <h3 className="">
                    <button
                      onClick={(e) => {
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
          <div className="row inventory-management justify-content-center">
            <div className="col-12">
              <div className="row mx-0 ">
                <div className="col-12 design_outter_comman shadow mb-4">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2>Add Vendor Details</h2>
                    </div>
                  </div>

                  <form
                    className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between "
                    action=""
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="form-group mb-0 col-3 choose_fileAdmin position-relative mb-4">
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
                          required: false,
                          onChange: (e) => {
                            onFileSelection(e, "coverImage");
                          },
                        })}
                      />
                    </div>

                    <div className="form-group col-3 mb-0 mb-4">
                      <label htmlFor="puller">
                        Company Name{" "}
                        {errors.companyName && (
                          <small className="errorText mx-1 fw-bold">
                            *{errors.companyName?.message}
                          </small>
                        )}
                      </label>
                      <input
                        type="text"
                        id="puller"
                        className={classNames(
                          "form-control border border-secondary",
                          {
                            "is-invalid": errors.companyName,
                          }
                        )}
                        name="companyName"
                        placeholder="Enter Name"
                        {...register("companyName", {
                          required: false,
                        })}
                      />
                    </div>

                    <div className="form-group col-3 mb-0 mb-4">
                      <label htmlFor="puller">
                        Representative Name{" "}
                        {errors.representative && (
                          <small className="errorText mx-1 fw-bold">
                            *{errors.representative?.message}
                          </small>
                        )}
                      </label>
                      <input
                        type="text"
                        id="puller"
                        className={classNames(
                          "form-control border border-secondary",
                          {
                            "is-invalid": errors.representative,
                          }
                        )}
                        name="representative"
                        placeholder="Enter Name"
                        {...register("representative", {
                          required: false,
                        })}
                      />
                    </div>

                    <div className="form-group col-3">
                      <label htmlFor="">
                        Address{" "}
                        {errors.address && (
                          <small className="errorText mx-1 fw-bold">
                            *{errors.address?.message}
                          </small>
                        )}
                        <input
                          type="address"
                          className={classNames(
                            "form-control border border-secondary",
                            {
                              "is-invalid": errors.address,
                            }
                          )}
                          name="address"
                          placeholder="Enter address"
                          {...register("address", {
                            required: "Address is required!",
                          })}
                        />
                      </label>
                    </div>

                    <div className="form-group col-4 mb-5">
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
                          required: false,
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
                    <div className="form-group col-4 mb-5 mt-4">
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
                          required: "Email is required",
                          pattern: {
                            value:
                              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Invalid email address",
                          },
                        })}
                      />
                    </div>
                    <div className="form-group col-4 mb-5">
                      <label htmlFor="">
                        Zipcode{" "}
                        {errors.zipcode && (
                          <small className="errorText mx-1 fw-bold">
                            *{errors.zipcode?.message}
                          </small>
                        )}
                      </label>
                      <input
                        type="number"
                        className={classNames(
                          "form-control border border-secondary",
                          {
                            "is-invalid": errors.zipcode,
                          }
                        )}
                        name="zipcode"
                        placeholder="Enter Zipcode "
                        {...register("zipcode", {
                          required: false,
                          maxLength: {
                            value: 10,
                            message: "maximium 10 Charcarters",
                          },
                          minLength: {
                            value: 2,
                            message: "minimium 2 Charcarters",
                          },
                        })}
                      />
                    </div>

                    <div className="form-group col-4">
                      <label htmlFor="">
                        Password{" "}
                        {errors.password && (
                          <small className="errorText mx-1 fw-bold">
                            *{errors.password?.message}
                          </small>
                        )}
                        <input
                          type="text"
                          className={classNames(
                            "form-control border border-secondary",
                            {
                              "is-invalid": errors.password,
                            }
                          )}
                          name="password"
                          placeholder="Enter password"
                          {...register("password", {
                            required: false,
                          })}
                        />
                      </label>
                    </div>

                    <div className="form-floating col-4 mb-4 select_dropdown ">
                      <select
                        className={classNames(
                          "form-select border border-secondary signup_fields fw-bolder mt-1",
                          { "is-invalid": errors.state }
                        )}
                        id="floatingSelect1"
                        aria-label="Floating label select example"
                        name="state"
                        {...register("state", {
                          required: false,
                          onChange: (e) => {
                            handleCities(e.target.value);
                          },
                        })}
                      >
                        <option value="">Select a state/province...</option>
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

                      <label
                        htmlFor="floatingSelect1"
                        className="mx-2 fw-bolder mb-4"
                      >
                        State/Province
                      </label>
                    </div>

                    <div className="form-floating col-4 mb-4 select_dropdown ">
                      <select
                        className={classNames(
                          "form-select border border-secondary signup_fields fw-bolder mt-1",
                          { "is-invalid": errors.city }
                        )}
                        id="floatingSelect2"
                        aria-label="Floating label select example"
                        name="city"
                        disabled={cities?.length ? false : true}
                        {...register("city", {
                          required: false,
                        })}
                      >
                        <option value="">
                          {cities?.length > 0
                            ? "Select City"
                            : "No cities in selected State."}
                        </option>
                        {(cities || [])?.map((item, ind) => (
                          <option value={item?.city}>{item?.city}</option>
                        ))}
                      </select>
                      {errors.city && (
                        <small className="errorText mx-1 fw-bold">
                          {errors.city?.message}
                        </small>
                      )}

                      <label
                        htmlFor="floatingSelect2"
                        className="mx-2 fw-bolder mb-2"
                      >
                        City
                      </label>
                    </div>

                    <div className="form-group mb-0 col-12 text-center mt-3">
                      <button className="comman_btn" type="submit">
                        Save Details
                      </button>
                      <button
                        className="comman_btn d-none"
                        type="reset"
                        id="resetF"
                      >
                        Reset
                      </button>
                    </div>
                  </form>
                </div>

                <div className="col-12  recent_orders shadow px-0">
                  <div
                    className="row comman_header justify-content-between "
                    style={{
                      width: "99.8%",
                      marginLeft: ".1%",
                    }}
                  >
                    <div className="col-6">
                      <h2>Vendors Management</h2>
                    </div>
                    <div className="col-6 text-end">
                      <form className="form-design" action="">
                        <div className="form-group mb-0 position-relative icons_set">
                          {searchType === "vendors" ? (
                            <div className="d-flex w-100">
                              <input
                                type="search"
                                className="form-control bg-white "
                                placeholder="Search by Company / Email"
                                name="name"
                                id="Search"
                                onChange={(e) => {
                                  getVendors(e.target.value);
                                }}
                              />
                              {allStatus === "Enabled" ? (
                                <a
                                  className="comman_btn2 mx-2  w-50 text-center"
                                  onClick={() => changeStatus("Disable")}
                                >
                                  Disable all vendors
                                </a>
                              ) : (
                                <a
                                  className="comman_btn2 mx-2 text-center w-50"
                                  onClick={() => changeStatus("Enable")}
                                >
                                  Enable all vendors
                                </a>
                              )}
                            </div>
                          ) : (
                            <div className="d-flex w-100">
                              <input
                                type="text"
                                className="form-control bg-white  mx-2"
                                placeholder="Search by Company Name/Account/Address"
                                name="name"
                                id="Search"
                                onChange={(e) => {
                                  getAllOrders(e.target.value);
                                }}
                              />
                              <a
                                className="comman_btn2 mx-1 d-flex "
                                onClick={() => exportOrders()}
                              >
                                Xlsx{" "}
                                <i
                                  class="fa-solid fa-file-export"
                                  style={{
                                    position: "relative",
                                    top: "4px",
                                    left: "5px",
                                  }}
                                ></i>
                              </a>
                              <a
                                className="comman_btn2 mx-1 d-flex "
                                onClick={() => exportOrdersPdf()}
                              >
                                Pdf{" "}
                                <i
                                  class="fa-solid fa-file-export"
                                  style={{
                                    position: "relative",
                                    top: "4px",
                                    left: "5px",
                                  }}
                                ></i>
                              </a>
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="col-12 user-management-tabs px-0">
                    <nav>
                      <div className="nav nav-tabs" id="nav-tab" role="tablist">
                        <button
                          className="nav-link active"
                          style={{
                            width: "50%",
                          }}
                          id="nav-home-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-home"
                          type="button"
                          role="tab"
                          aria-controls="nav-home"
                          aria-selected="true"
                          onClick={() => {
                            document.getElementById("Search").value = "";
                            setSearchType("vendors");
                            getVendors();
                          }}
                        >
                          Vendors
                        </button>
                        <button
                          className="nav-link"
                          style={{
                            width: "50%",
                          }}
                          id="nav-profile-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#nav-profile"
                          type="button"
                          role="tab"
                          aria-controls="nav-profile"
                          aria-selected="false"
                          onClick={() => {
                            document.getElementById("Search").value = "";
                            setSearchType("orders");
                            getAllOrders();
                          }}
                        >
                          Orders
                        </button>
                      </div>
                    </nav>
                  </div>

                  <div
                    className="tab-content recent_orders_cate"
                    id="nav-tabContent"
                  >
                    <div
                      className="tab-pane fade show active"
                      id="nav-home"
                      role="tabpanel"
                      aria-labelledby="nav-home-tab"
                    >
                      <div className="row">
                        <div className="col-12 comman_table_design px-0">
                          <div className="table-responsive">
                            <div className="col-11 d-flex justify-content-between py-2 mx-5">
                              <span className="totalPage">
                                ( Total Pages : {maxPage} )
                              </span>
                              <ul id="pagination">
                                <li>
                                  <a
                                    class="fs-5"
                                    href="#"
                                    onClick={() =>
                                      activePage <= 1
                                        ? setActivePage(1)
                                        : setActivePage(activePage - 1)
                                    }
                                  >
                                    «
                                  </a>
                                </li>

                                <li>
                                  <a href="#" className="active">
                                    {activePage}
                                  </a>
                                </li>

                                <li>
                                  <a
                                    className="fs-5"
                                    href="#"
                                    onClick={() =>
                                      activePage === maxPage
                                        ? setActivePage(maxPage)
                                        : setActivePage(activePage + 1)
                                    }
                                  >
                                    »
                                  </a>
                                </li>
                              </ul>
                            </div>
                            <table className="table mb-0">
                              <thead>
                                <tr style={{ backgroundColor: "#f2f2f2" }}>
                                  <th>Date</th>
                                  <th>Company Name</th>
                                  <th>Representative Name</th>
                                  <th>Email</th>
                                  <th>Image</th>
                                  <th>Phone Number</th>
                                  <th>Status</th>
                                  <th>Action</th>
                                </tr>
                              </thead>
                              <tbody>
                                {(allVendors || [])?.map((item, index) => (
                                  <tr key={index} className="border ">
                                    <td className="border">
                                      {moment(
                                        item?.createdAt?.slice(0, 10)
                                      ).format("MM/DD/YYYY")}
                                    </td>
                                    <td className="border">
                                      {item?.companyName}
                                    </td>
                                    <td className="border">
                                      {item?.repsresentative}
                                    </td>
                                    <td className="border">{item?.email}</td>
                                    <td className="border">
                                      <img
                                        className="subCatImages"
                                        src={
                                          item?.image?.length > 4
                                            ? item?.image
                                            : require("../../../assets/img/product.jpg")
                                        }
                                        alt=""
                                      ></img>
                                    </td>
                                    <td className="border">
                                      {item?.phoneNumber}
                                    </td>

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
                                        to={`/admin/view-TradeStore/${item?._id}`}
                                      >
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

                      <div className="col-11 d-flex justify-content-between py-2 mx-5">
                        <span className="totalPage">
                          ( Total Pages : {maxPage} )
                        </span>
                        <ul id="pagination">
                          <li>
                            <a
                              class="fs-5"
                              href="#"
                              onClick={() =>
                                activePage <= 1
                                  ? setActivePage(1)
                                  : setActivePage(activePage - 1)
                              }
                            >
                              «
                            </a>
                          </li>

                          <li>
                            <a href="#" className="active">
                              {activePage}
                            </a>
                          </li>

                          <li>
                            <a
                              className="fs-5"
                              href="#"
                              onClick={() =>
                                activePage === maxPage
                                  ? setActivePage(maxPage)
                                  : setActivePage(activePage + 1)
                              }
                            >
                              »
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div
                      className="tab-pane fade recent_order"
                      id="nav-profile"
                      role="tabpanel"
                      aria-labelledby="nav-profile-tab"
                    >
                      <div className="row mx-0">
                        <div className="col-12">
                          <div className="row">
                            <div className="col-12 comman_table_design px-0">
                              <div className="table-responsive">
                                <div className="row">
                                  <div className="col-12 comman_table_design px-0">
                                    <div className="table-responsive">
                                      <table className="table mb-0">
                                        <thead>
                                          <tr
                                            style={{
                                              backgroundColor: "#f2f2f2",
                                            }}
                                          >
                                            <th>
                                              <input
                                                type="checkbox"
                                                name="selectAll"
                                                className="checkbox"
                                                id="selectAll"
                                                onChange={handleSelectAll}
                                                checked={
                                                  isCheckAll ? true : false
                                                }
                                                class=""
                                              />
                                              <span class="checkmark-all"></span>
                                              <span className="mx-1">
                                                Select All
                                              </span>
                                            </th>
                                            <th>ORDER ID</th>
                                            <th>DATE & TIME</th>
                                            <th>COMPANY NAME</th>
                                            <th>ACCOUNT NUMBER</th>
                                            <th>ADDRESS</th>
                                            <th>ORDER TYPE</th>
                                            <th>STATUS</th>
                                            <th>ACTION</th>
                                          </tr>
                                        </thead>
                                        <tbody>
                                          {(orders || [])?.map(
                                            (item, index) => (
                                              <tr className="border">
                                                <td className="border">
                                                  <input
                                                    type="checkbox"
                                                    className="check"
                                                    F
                                                    key={item?._id}
                                                    name={index}
                                                    id={item?._id}
                                                    onChange={(e) =>
                                                      handleClickSelect(
                                                        e,
                                                        item?._id,
                                                        index
                                                      )
                                                    }
                                                    checked={isCheck?.includes(
                                                      item?._id
                                                    )}
                                                    class="checkbox-in"
                                                  />
                                                </td>

                                                <td className="border text-center">
                                                  <div className="cart_content border text-center mt-2">
                                                    {item?.orderId}
                                                  </div>
                                                </td>

                                                <td>
                                                  <span className="ordertext my-2 d-block text-center ">
                                                    {moment(
                                                      item?.createdAt
                                                    ).format(
                                                      "MMMM Do YYYY, h:mm a"
                                                    )}
                                                  </span>
                                                </td>

                                                <td className="border text-center">
                                                  <div className="cart_content border text-center mt-2">
                                                    {item?.companyName}
                                                  </div>
                                                </td>
                                                <td className="border text-center">
                                                  <div className="cart_content border text-center mt-2">
                                                    {item?.account}
                                                  </div>
                                                </td>
                                                <td className="border rounded ">
                                                  <span className="fs-5 text-secondary  p-2 px-3 rounded">
                                                    {item?.address}
                                                  </span>
                                                </td>
                                                <td className="border text-center">
                                                  <div className="cart_content mt-2">
                                                    <h3 className="fs-6">
                                                      {item?.type}
                                                    </h3>
                                                  </div>
                                                </td>

                                                <td className="border rounded ">
                                                  <span className="fs-6 text-secondary  p-2 px-3 rounded">
                                                    {item?.status}
                                                  </span>
                                                </td>

                                                <td className="border text-center">
                                                  <span className="fs-5 rounded ">
                                                    <Link
                                                      to={`/admin/trade-show/viewTradeOrder/${item?._id}`}
                                                      className="comman_btn"
                                                    >
                                                      View
                                                    </Link>
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

                                <div className="col-11 d-flex justify-content-between py-2 mx-5">
                                  <span className="totalPage">
                                    ( Total Pages : {maxPage2} )
                                  </span>
                                  <ul id="pagination">
                                    <li>
                                      <a
                                        class="fs-5"
                                        href="#"
                                        onClick={() =>
                                          activePage2 <= 1
                                            ? setActivePage2(1)
                                            : setActivePage2(activePage2 - 1)
                                        }
                                      >
                                        «
                                      </a>
                                    </li>

                                    <li>
                                      <a href="#" className="active">
                                        {activePage2}
                                      </a>
                                    </li>

                                    <li>
                                      <a
                                        className="fs-5"
                                        href="#"
                                        onClick={() =>
                                          activePage2 === maxPage2
                                            ? setActivePage2(maxPage2)
                                            : setActivePage2(activePage2 + 1)
                                        }
                                      >
                                        »
                                      </a>
                                    </li>
                                  </ul>
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

export default TradeShowManage;
