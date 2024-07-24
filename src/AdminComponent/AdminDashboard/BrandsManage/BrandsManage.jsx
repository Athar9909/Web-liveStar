import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/css/adminMain.css";
import { useForm } from "react-hook-form";
import Starlogo from "../../../assets/img/logo.png";
import { useState } from "react";
import axios from "axios";
import ProfileBar from "../ProfileBar";
import Swal from "sweetalert2";
import { Button } from "rsuite";
import moment from "moment";

const BrandsManage = () => {
  const brandsApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/brands/getBrands`;
  const editBrands = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/brands/editBrand`;
  const addBrands = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/brands/addBrand`;
  const ViewBrand = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/brands/viewBrands`;
  const TobaccoBrands = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/brands/tobaccoBrand`;
  const BraSearch = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/brands/searchBrand`;
  const [searchTerm, setSearchTerm] = useState("");
  const [editBrandName, setEditBrandName] = useState("");
  const [change, setChange] = useState("");
  const [allBrands, setAllBrands] = useState([]);
  const [EditBrand, setEditBrand] = useState([]);
  const [brandName, setBrandName] = useState();
  const [brandId, setBrandId] = useState();
  const [files, setFiles] = useState([]);
  const [sideBar, setSideBar] = useState(true);
  const [loader, setLoader] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");
  let User = JSON.parse(localStorage.getItem("AdminData"));

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    getBrands();
  }, [change, activePage]);
  const getBrands = async () => {
    await axios
      .post(brandsApi, {
        page: activePage,
      })
      .then((res) => {
        setAllBrands(res?.data.results?.brands);
        setMaxPage(res?.data.results.totalPages);

        return res.data;
      });
  };

  const BrandSearch = async (e) => {
    let string = e.target.value;
    setSearchTerm(e.target.value);
    if (string !== "") {
      await axios
        .post(BraSearch, {
          search: e.target.value,
        })
        .then((res) => {
          if (!res.error) {
            setAllBrands(res?.data.results?.brand);
          }
        });
    } else {
      getBrands();
    }
  };

  const onFileSelection = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };
  const saveBrands = async (e) => {
    e.preventDefault();
    if (!files?.brandImg) {
      Swal.fire({
        title: "Choose Brand Image!",
        icon: "warning",
        timer: 1000,
        confirmButtonText: "ok",
      });
    } else {
      const formData = new FormData();
      formData.append("brandImage", files?.brandImg);
      formData.append("brandName", brandName.trim());

      await axios
        .post(addBrands, formData)
        .then((res) => {
          if (res?.data.message === "Brand Added Successfully") {
            document.getElementById("resetBrand").click();
            setChange(!change);
          }
          if (res?.data.message === "Invalid Image format") {
            Swal.fire({
              title: "Choose Valid Image!",
              icon: "warning",
              confirmButtonText: "ok",
            });
            document.getElementById("resetSubCat").click();
          }
          if (res?.data.message === "Please provide brand name") {
            setLoader(false);
            Swal.fire({
              title: "Please provide brand name",
              icon: "error",
              focusConfirm: false,
            });
          }
          if (res?.data.message === "Error in adding brand") {
            setLoader(false);
            Swal.fire({
              title: "Error in adding brand",
              icon: "error",
              focusConfirm: false,
            });
          }
        })
        .catch((error) => {
          if (error) {
            Swal.fire({
              title: "Error in adding brand",
              icon: "error",
              focusConfirm: false,
            });
          }
        });
    }
  };

  const onEditBrands = async (id) => {
    await axios.post(ViewBrand + "/" + id).then((res) => {
      setEditBrand(res?.data.results.brand);
    });
    setBrandId(id);
  };

  // const brandSearch = async (e) => {
  //   let string = e.target.value;
  //   string !== ""
  //     ? await axios
  //         .post(inventorySearch, {
  //           search: e.target.value,
  //         })
  //         .then((res) => {
  //           if (!res.error) {
  //             setAllProducts(res?.data.results.results);
  //           }
  //         })
  //     : GetProducts();
  // };
  const onSubmit = async (data) => {
    setLoader(true);
    const formData = new FormData();
    formData.append("brandImage", files?.newBrandImg);
    formData.append("brandName", editBrandName);
    await axios.post(editBrands + "/" + brandId, formData).then((res) => {
      if (res?.data.message === "Modified Successfullt") {
        // window.location.reload(false);
        setChange(!change);
        setLoader(false);
        setBrandName("");
        document.getElementById("closeModal").click();
        document.getElementById("brandImg").setAttribute("src", null);
        Swal.fire({
          title: "Successfully Modified!",
          icon: "success",
          confirmButtonText: "ok",
        });
        setFiles(null);
      }
      if (res?.data.message === "Invalid Image format") {
        setLoader(false);
        Swal.fire({
          title: "Invalid Image format!",
          icon: "warning",
          confirmButtonText: "ok",
        });
        document.getElementById("resetSubCat").click();
      }
    });
  };
  document.getElementById("brandUp")?.addEventListener("change", function () {
    if (this.files[0]) {
      var picture = new FileReader();
      picture.readAsDataURL(this.files[0]);
      picture.addEventListener("load", function (event) {
        document
          .getElementById("brandImg")
          .setAttribute("src", event.target.result);
      });
    }
  });

  const brandTobaccoStatus = async (id) => {
    await axios.post(TobaccoBrands + "/" + id).then((res) => {
      if (!res?.data.error) {
        Swal.fire({
          title: "Tobacco Status Modified!",
          icon: "success",
          confirmButtonText: "Okay",
        });
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
                    User?.access?.includes("Visitor Management") ? "" : "d-none"
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
                    className="bg-white"
                    to="/brandsManage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}
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
                      class="fas fa-users-"
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
                    className="bg-white"
                    to="/brandsManage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}
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
          <div className="col-12 design_outter_comman border ">
            <div className="row comman_header justify-content-between">
              <div className="col-auto">
                <h2 className="main_headers">Brands Management</h2>
              </div>
              <div className="col-3">
                <div className="form-design" action="">
                  <div className="form-group mb-0 position-relative icons_set">
                    <input
                      type="text"
                      className="form-control bg-white"
                      placeholder="Search"
                      name="name"
                      id="name"
                      onChange={(e) => {
                        BrandSearch(e);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row category_management justify-content-center recent_orders_cate shadow">
              <div className="col-12 design_outter_comman recent_orders shadow">
                <div className="row">
                  <div className="col-12 user-management-tabs px-0">
                    <div className="row mx-0">
                      <div className="col-12">
                        <form
                          className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                          action=""
                        >
                          <div className="form-group mb-0 col-5">
                            <label htmlFor="">Brand Name</label>
                            <input
                              type="text"
                              className="form-control"
                              name="Brand"
                              onChange={(e) => {
                                setBrandName(e.target.value);
                              }}
                            />
                          </div>
                          <div className="form-group mb-0 col choose_fileAdmin position-relative">
                            <span>Brand Image </span>{" "}
                            <label htmlFor="upload_video">
                              <i class="fa fa-camera me-1"></i>
                              Choose File
                            </label>{" "}
                            <input
                              type="file"
                              className="form-control "
                              defaultValue=""
                              accept="image/*"
                              name="brandImg"
                              id="upload_video"
                              onChange={(e) => onFileSelection(e, "brandImg")}
                            />
                          </div>
                          <div className="form-group mb-0 col-auto">
                            <Button
                              loading={loader}
                              appearance="primary"
                              style={{
                                backgroundColor: "#eb3237",
                                fontSize: "20px",
                                position: "relative",
                                top: "-2px",
                              }}
                              className="comman_btn"
                              onClick={saveBrands}
                            >
                              Save
                            </Button>
                            <button
                              className="comman_btn d-none"
                              id="resetBrand"
                              type="reset"
                            >
                              Reset
                            </button>
                          </div>
                        </form>
                        <div className="row">
                          <div className="col-12 comman_table_design px-0 ">
                            <div className="table-responsive">
                              <table className="table mb-0">
                                <thead>
                                  <tr
                                    style={{
                                      backgroundColor: "#f2f2f2",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    <th>S.No.</th>
                                    <th>Date</th>
                                    <th>Brand Name</th>
                                    <th>Media</th>
                                    <th>Tobacco</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {(allBrands || [])
                                    .filter((item) => {
                                      if (searchTerm == "") {
                                        return item;
                                      } else if (
                                        item?.brandName
                                          .toLowerCase()
                                          .includes(searchTerm.toLowerCase())
                                      ) {
                                        return item;
                                      }
                                    })
                                    .map((item, index) => (
                                      <tr className="" key={index}>
                                        <td>
                                          {" "}
                                          {(activePage - 1) * 15 + (index + 1)}.
                                        </td>
                                        <td>
                                          {moment(
                                            item?.updatedAt?.slice(0, 10)
                                          ).format("MM/DD/YYYY")}
                                        </td>
                                        <td>{item?.brandName}</td>
                                        <td>
                                          <img
                                            className="subCatImages"
                                            height={55}
                                            src={
                                              item?.brandImage
                                                ? item?.brandImage
                                                : require("../../../assets/img/product.jpg")
                                            }
                                          ></img>
                                        </td>
                                        <td>
                                          {" "}
                                          <div className="" key={item?._id}>
                                            <label class="switchUser">
                                              <input
                                                type="checkbox"
                                                id={item?._id}
                                                defaultChecked={item?.isTobacco}
                                                onClick={() => {
                                                  brandTobaccoStatus(item?._id);
                                                }}
                                              />
                                              <span class="sliderUser round"></span>
                                            </label>
                                          </div>
                                        </td>
                                        <td>
                                          <Link
                                            className="comman_btn2 text-white text-decoration-none"
                                            data-bs-toggle="modal"
                                            data-bs-target="#staticBackdrop"
                                            key={index}
                                            onClick={() => {
                                              onEditBrands(item?._id);
                                            }}
                                          >
                                            Edit
                                          </Link>
                                        </td>
                                      </tr>
                                    ))}
                                </tbody>
                              </table>
                              {searchTerm?.length >= 1 ? (
                                ""
                              ) : (
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
                              )}
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
      <div
        className="modal fade comman_modal "
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Edit Brand
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="closeModal"
                onClick={() => {
                  getBrands();
                  document.getElementById("brandImg").setAttribute("src", null);
                }}
              />
            </div>
            <div className="modal-body">
              <form
                className="form-design px-3 py-2 help-support-form row align-items-end justify-content-center"
                action=""
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="form-group col-auto">
                  <label htmlFor="">Brand Image</label>
                  <div className="account_profile position-relative border h-50">
                    <div className="circle">
                      <img
                        className="profile-pic subCatImages2"
                        id="brandImg"
                        src={EditBrand?.brandImage}
                      />
                    </div>
                    <div className="p-image">
                      <i className="uploadFile fa fa-camera" />
                      <input
                        className="file-uploads"
                        type="file"
                        id="brandUp"
                        accept="image/*"
                        name="newBrandImg"
                        {...register("newBrandImg")}
                        onChange={(e) => onFileSelection(e, "newBrandImg")}
                      />
                    </div>
                  </div>
                </div>
                <div className="form-group col-12" key={EditBrand?.brandName}>
                  <label htmlFor="">Brand Name</label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={EditBrand?.brandName}
                    name="BrandName"
                    onChange={(e) => {
                      setEditBrandName(e.target.value);
                    }}
                  />
                </div>
                <div className="form-group mb-0 col-auto mt-3">
                  <Button
                    loading={loader}
                    appearance="primary"
                    style={{
                      backgroundColor: "#eb3237",
                      fontSize: "20px",
                      position: "relative",
                      top: "-2px",
                    }}
                    className="comman_btn"
                    type="submit"
                  >
                    Save
                  </Button>
                  <button type="reset" className="d-none">
                    reset
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandsManage;
