import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/css/adminMain.css";
import Starlogo from "../../../assets/img/logo.png";
import axios from "axios";
import { useEffect } from "react";
import ProfileBar from "../ProfileBar";
import Swal from "sweetalert2";
import { Button } from "rsuite";
import moment from "moment";

const CategorySub = () => {
  const addCategory = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/category/addCategory`;
  const addSubCategory = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/subCategory/addSubCategory`;
  const categoryApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/category/getCategories`;
  const SubCategoryApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/subCategory/getSubCategories`;
  const editCategory = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/category/editCategory`;
  const editSubCategory = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/subCategory/editSubCategory`;
  const disableCategory = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/category/categoryStatus`;
  const TobaccoCategory = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/category/tobaccoCategoryStatus`;
  const TobaccoSubCategory = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/subCategory/subCategoryTobacco`;
  const deleteSubImg = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/subCategory/deleteSubCatImage`;
  const deleteCatImg = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/category/deleteCatImage`;
  const deleteBackImg = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/category/deleteCatImage`;
  const ViewCat = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/category/viewCategories`;
  const ViewSubCat = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/subCategory/viewSubCategories`;
  const catSearch = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/category/searchCategory`;
  const subCatSearch = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/subCategory/searchSubCategory`;
  const [sideBar, setSideBar] = useState(true);
  const [change, setChange] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [EditCategories, setEditCategories] = useState([]);
  const [allSubCategories, setAllSubCategories] = useState([]);
  const [EditSubCategories, setEditSubCategories] = useState([]);
  const [files, setFiles] = useState([]);
  const [categoryId, setCategoryId] = useState();
  const [subCategoryId, setSubCategoryId] = useState();
  const [editCateName, setEditCateName] = useState("");
  const [editSubCateName, setEditSubCateName] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [category, setCategory] = useState("");
  const [categoryIndex, setCategoryIndex] = useState();
  const [subCategoryIndex, setSubCategoryIndex] = useState();
  const [loader, setLoader] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [activePage2, setActivePage2] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [maxPage2, setMaxPage2] = useState(1);
  const [order, setOrder] = useState("");
  useEffect(() => {
    getCategories();
    getSubCategories();
  }, [change, activePage2]);

  let User = JSON.parse(localStorage.getItem("AdminData"));

  const onFileSelection = (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };

  const saveCategory = async (e) => {
    setLoader(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("categoryImage", files?.cateImg);
    formData.append("background", files?.background);
    formData.append("categoryName", categoryName.trim());

    await axios.post(addCategory, formData).then((res) => {
      if (!res.error) {
        setChange(!change);
        setLoader(false);
        Swal.fire({
          title: "New Category Added!",
          icon: "success",
          confirmButtonText: "okay",
          timer: 2000,
        });
        document.getElementById("resetCat").click();
      }
      if (res?.data.message === "Invalid Image format") {
        setLoader(false);
        Swal.fire({
          title: "Invalid Image format!",
          text: "Only Images are allowed",
          icon: "warning",
          confirmButtonText: "ok",
        });
        document.getElementById("resetCat").click();
      }
      if (res?.data.message === "Category is already added") {
        setLoader(false);
        Swal.fire({
          title: "Category is already added!",
          icon: "error",
          button: "Ok",
        });
      }
      if (res?.data.message === "Please provide category name") {
        setLoader(false);
        Swal.fire({
          title: "Please provide category name",
          icon: "error",
          button: "Ok",
        });
      }
      if (res?.data.message === "Please provide category Image") {
        setLoader(false);
        Swal.fire({
          title: "Please provide category Image",
          icon: "error",
          button: "Ok",
        });
      }
    });
  };

  const saveSubCategory = async (e) => {
    setLoader(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("subCategoryImage", files?.subCateImg);
    formData.append("subCategoryName", subCategory.trim());
    formData.append("categoryName", category.trim());
    await axios.post(addSubCategory, formData).then((res) => {
      console.log(res);
      if (res?.data.message === "Sub Category added") {
        Swal.fire({
          title: "New Sub-Category Added!",
          icon: "success",
          confirmButtonText: "okay",
          timer: 2000,
        });
        setLoader(false);
        setChange(!change);
        document.getElementById("resetSubCat").click();
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
      if (res?.data.message === "Sub Category is already exist") {
        setLoader(false);
        Swal.fire({
          title: "Sub Category is already added!",
          icon: "error",
          button: "Ok",
        });
      }
      if (res?.data.message === "Please provide category name") {
        setLoader(false);
        Swal.fire({
          title: "Please provide category name",
          icon: "error",
          button: "Ok",
        });
      }
      if (res?.data.message === "Please provide Sub category name") {
        setLoader(false);
        Swal.fire({
          title: "Please provide Sub category name",
          icon: "error",
          button: "Ok",
        });
      }
    });
  };

  const getCategories = async () => {
    await axios.post(categoryApi).then((res) => {
      console.log(res);
      setAllCategories(res?.data.results?.categories);
      setMaxPage(res?.data.results.totalPages);
    });
  };

  const getSubCategories = async () => {
    await axios
      .post(SubCategoryApi, {
        page: activePage2,
      })
      .then((res) => {
        setAllSubCategories(res?.data.results?.subCategories);
        setMaxPage2(res?.data.results.totalPages);
      });
  };
  const sorting = async (i) => {
    await axios
      .post(categoryApi, {
        page: activePage,
        sortBy: i,
      })
      .then((res) => {
        let data = res?.data.results.categories;
        setAllCategories(data);
        setMaxPage(res?.data.results.allPages);
      });
    await axios
      .post(SubCategoryApi, {
        page: activePage,
        sortBy: i,
      })
      .then((res) => {
        let data = res?.data.results.subCategories;
        setAllSubCategories(data);
        setMaxPage(res?.data.results.allPages);
      });
  };
  const EditCategory = async (id) => {
    await axios.post(ViewCat + "/" + id).then((res) => {
      setEditCategories(res?.data.results.category);
      setCategoryId(id);
    });
  };

  const EditSubCategory = async (id) => {
    await axios.post(ViewSubCat + "/" + id).then((res) => {
      setEditSubCategories(res?.data.results.subCategory);
      setSubCategoryId(id);
    });
  };

  const onEditSaveCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("categoryImage", files?.newCategoryImg);
    formData.append("background", files?.background);
    formData.append("categoryName", editCateName.trim());
    formData.append("listingOrder", order);

    await axios.post(editCategory + "/" + categoryId, formData).then((res) => {
      console.log(res);
      if (res?.data.message === "Modified Successfully") {
        getCategories();
        document.getElementById("cateModal").click();
        setEditCateName("");
        setFiles([]);
        document.getElementById("ResetCat").click();
        Swal.fire({
          title: "Category Modified Successfully!",
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
      if (res?.data.message === "Invalid Image format") {
        setLoader(false);
        Swal.fire({
          title: "Invalid Image format!",
          text: "Only Images are allowed",
          icon: "warning",
          confirmButtonText: "ok",
        });
        document.getElementById("resetCat").click();
      }
    });
  };

  const onEditSaveSubCategory = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("subCategoryImage", files?.newSubCategoryImg);
    formData.append("subCategoryName", editSubCateName);
    formData.append("categoryName", category);
    await axios
      .post(editSubCategory + "/" + subCategoryId, formData)
      .then((res) => {
        console.log(res);
        if (res?.data.message === "Sub Category Modified") {
          setChange(!change);
          document.getElementById("subCateModal").click();
          setEditSubCateName("");
          setCategory("");
          setFiles([]);
          document.getElementById("ResetSub").click();
          Swal.fire({
            title: "Sub-Category Modified Successfully!",
            icon: "success",
            confirmButtonText: "Okay",
          });
        }
        if (res?.data.message === "Invalid Image format") {
          setLoader(false);
          Swal.fire({
            title: "Invalid Image format!",
            text: "Only Images are allowed",
            icon: "warning",
            confirmButtonText: "ok",
          });
          document.getElementById("resetCat").click();
        }
      });
  };

  const handleClick = () => {
    localStorage.removeItem("AdminData");
    localStorage.removeItem("AdminLogToken");
    localStorage.removeItem("AdminEmail");
  };

  const CategoryStatus = async (id) => {
    await axios.post(disableCategory + "/" + id).then((res) => {
      if (!res?.data.error) {
        Swal.fire({
          title: res?.data.message,
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    });
  };
  const CategoryTobaccoStatus = async (id) => {
    await axios.post(TobaccoCategory + "/" + id).then((res) => {
      if (!res?.data.error) {
        Swal.fire({
          title: res?.data.message,
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    });
  };

  const SubCategoryTobaccoStatus = async (id) => {
    await axios.post(TobaccoSubCategory + "/" + id).then((res) => {
      if (!res?.data.error) {
        Swal.fire({
          title: res?.data.message,
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    });
  };
  const deleteSubImage = async (id) => {
    await axios.post(deleteSubImg + "/" + id).then((res) => {
      getSubCategories();
    });
  };

  const CategorySearch = async (e) => {
    let string = e.target.value;
    if (string !== "") {
      await axios
        .post(catSearch, {
          search: e.target.value,
        })
        .then((res) => {
          if (!res.error) {
            setAllCategories(res?.data.results.categories);
          }
        });
      await axios
        .post(subCatSearch, {
          search: e.target.value,
        })
        .then((res) => {
          if (!res.error) {
            setAllSubCategories(res?.data.results.subCategories);
          }
        });
    } else {
      getCategories();
      getSubCategories();
    }
  };

  const deleteCatImage = async () => {
    await axios
      .post(deleteCatImg + "/" + allCategories[categoryIndex]?._id, {
        categoryImage: true,
      })
      .then((res) => {
        getCategories();
      });
  };

  const deleteBackImage = async (id) => {
    await axios
      .post(deleteBackImg + "/" + id, {
        background: true,
      })
      .then((res) => {
        getCategories();
      });
  };
  // instant image preview //

  document
    .getElementById("subCatUpImg")
    ?.addEventListener("change", function () {
      if (this.files[0]) {
        var picture = new FileReader();
        picture.readAsDataURL(this.files[0]);
        picture.addEventListener("load", function (event) {
          document
            .getElementById("subCatImg")
            .setAttribute("src", event.target.result);
        });
      }
    });
  document.getElementById("backUpImg")?.addEventListener("change", function () {
    if (this.files[0]) {
      var picture = new FileReader();
      picture.readAsDataURL(this.files[0]);
      picture.addEventListener("load", function (event) {
        document
          .getElementById("backImg")
          .setAttribute("src", event.target.result);
      });
    }
  });

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
                    className="bg-white"
                    to="/CategorySub"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}>
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
                    className=" ata"
                    to="/Puller-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-users-gear"></i>{" "}
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
                    className="bg-white"
                    to="/CategorySub"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}>
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
                    className=""
                    to="/Puller-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
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

        <div className="admin_panel_data height_adjust">
          <div className="row category_management justify-content-center">
            <div className="col-12">
              <div className="d-flex comman_header justify-content-between px-2">
                <div className="col-6">
                  <h2 className="main_headers">Categories Management</h2>
                </div>

                <div className="col-6 form-design d-flex justify-content-end">
                  {/* <form className="form-design" action=""> */}

                  <div className="form-group mb-0 position-relative icons_set">
                    <input
                      type="text"
                      className="form-control bg-white py-0"
                      placeholder="Search   "
                      name="name"
                      id="Search"
                      onChange={(e) => {
                        CategorySearch(e);
                      }}
                    />
                  </div>
                  {/* </form> */}
                  <div className="dropdown  mt-1">
                    <div>
                      <div class="dropdown_sort">
                        <button class="dropdown-btn_sort">
                          <img
                            src={require("../../../assets/img/iconSort.png")}
                            width={23}
                            height={23}
                            className="mx-3 mt-2"></img>
                        </button>
                        <div class="dropdown-content_sort">
                          <a>
                            <Link
                              className="text-decoration-none "
                              onClick={() => sorting(1)}>
                              A to Z
                            </Link>
                          </a>
                          <a>
                            <Link
                              className="text-decoration-none"
                              onClick={() => sorting(-1)}>
                              Z to A
                            </Link>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row mx-0">
                <div className="col-12 design_outter_comman  shadow">
                  <div className="row">
                    <div className="col-12 user-management-tabs px-0">
                      <nav>
                        <div
                          className="nav nav-tabs"
                          id="nav-tab"
                          role="tablist">
                          <button
                            className="nav-link active"
                            id="nav-home-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-home"
                            type="button"
                            role="tab"
                            aria-controls="nav-home"
                            aria-selected="true"
                            onClick={() => {
                              document.getElementById("Search").value = "";
                              getCategories();
                            }}>
                            Category
                          </button>
                          <button
                            className="nav-link"
                            id="nav-profile-tab"
                            data-bs-toggle="tab"
                            data-bs-target="#nav-profile"
                            type="button"
                            role="tab"
                            aria-controls="nav-profile"
                            aria-selected="false"
                            onClick={() => {
                              document.getElementById("Search").value = "";
                              getSubCategories();
                            }}>
                            Sub Category
                          </button>
                        </div>
                      </nav>
                      <div
                        className="tab-content recent_orders_cate"
                        id="nav-tabContent">
                        <div
                          className="tab-pane fade show active"
                          id="nav-home"
                          role="tabpanel"
                          aria-labelledby="nav-home-tab">
                          <div className="row mx-0">
                            <div className="col-12">
                              <form
                                className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                                action="">
                                <div
                                  className="form-group mb-0 col-4"
                                  key={category}>
                                  <label htmlFor="">Category Name</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="category"
                                    onChange={(e) => {
                                      setCategoryName(e.target.value);
                                    }}
                                  />
                                </div>
                                <div className="form-group mb-0 col choose_fileAdmin position-relative">
                                  <span>Category Image </span>{" "}
                                  <label htmlFor="upload_video">
                                    <i class="fa fa-camera me-1"></i>
                                    Choose File
                                  </label>{" "}
                                  <input
                                    type="file"
                                    className="form-control shadow-none"
                                    defaultValue=""
                                    accept="image/*"
                                    name="cateImg"
                                    id="upload_video"
                                    onChange={(e) =>
                                      onFileSelection(e, "cateImg")
                                    }
                                  />
                                </div>
                                <div className="form-group mb-0 col choose_fileAdmin position-relative">
                                  <span>Category Background </span>{" "}
                                  <label htmlFor="upload_video">
                                    <i class="fa fa-camera me-1"></i>
                                    Choose File
                                  </label>{" "}
                                  <input
                                    type="file"
                                    className="form-control shadow-none"
                                    defaultValue=""
                                    accept="image/*"
                                    name="background"
                                    id="upload_video"
                                    onChange={(e) =>
                                      onFileSelection(e, "background")
                                    }
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
                                    onClick={saveCategory}>
                                    Save
                                  </Button>
                                  <button
                                    className="comman_btn d-none"
                                    id="resetCat"
                                    type="reset">
                                    Reset
                                  </button>
                                </div>
                              </form>
                              <div className="row">
                                <div className="col-12 comman_table_design px-0">
                                  <div className="table-responsive border">
                                    <table className="table mb-0">
                                      <thead>
                                        <tr
                                          style={{
                                            backgroundColor: "#f2f2f2",
                                          }}>
                                          <th>S.No.</th>
                                          <th>Date</th>
                                          <th>Category Name</th>
                                          <th>Category Image</th>
                                          <th>Background Image</th>
                                          <th>Status</th>
                                          <th>Tobacco</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {(allCategories || []).map(
                                          (item, index) => (
                                            <tr className="" key={index}>
                                              <td className="border">
                                                {" "}
                                                {(activePage - 1) * 15 +
                                                  (index + 1)}
                                                .
                                              </td>
                                              <td className="border">
                                                {moment(
                                                  item?.updatedAt?.slice(0, 10)
                                                ).format("MM/DD/YYYY")}
                                              </td>
                                              <td className="border">
                                                {item?.categoryName}
                                              </td>

                                              <td className="border">
                                                <img
                                                  className="subCatImages"
                                                  src={
                                                    item?.categoryImage
                                                      ? item?.categoryImage
                                                      : require("../../../assets/img/product.jpg")
                                                  }></img>
                                              </td>
                                              <td className="border">
                                                <img
                                                  className="subCatImages"
                                                  src={
                                                    item?.background
                                                      ? item?.background
                                                      : require("../../../assets/img/product.jpg")
                                                  }></img>
                                              </td>
                                              <td className="border">
                                                {" "}
                                                <div
                                                  className=""
                                                  key={item?._id}>
                                                  <label class="switchUser">
                                                    <input
                                                      type="checkbox"
                                                      id={item?.unitName}
                                                      defaultChecked={
                                                        item?.status
                                                      }
                                                      onClick={() => {
                                                        CategoryStatus(
                                                          item?._id
                                                        );
                                                      }}
                                                    />
                                                    <span class="sliderUser round"></span>
                                                  </label>
                                                </div>
                                              </td>
                                              <td className="border">
                                                {" "}
                                                <div
                                                  className=""
                                                  key={item?._id}>
                                                  <label class="switchUser">
                                                    <input
                                                      type="checkbox"
                                                      id={item?._id}
                                                      defaultChecked={
                                                        item?.isTobacco
                                                      }
                                                      onClick={() => {
                                                        CategoryTobaccoStatus(
                                                          item?._id
                                                        );
                                                      }}
                                                    />
                                                    <span class="sliderUser round"></span>
                                                  </label>
                                                </div>
                                              </td>
                                              <td>
                                                <Link
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#staticBackdrop"
                                                  className="comman_btn2 text-white text-decoration-none"
                                                  key={index}
                                                  onClick={() => {
                                                    EditCategory(item?._id);
                                                  }}>
                                                  Edit
                                                </Link>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                    {/* <div className="col-11 d-flex justify-content-between py-2 mx-5">
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
                                    </div> */}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          className="tab-pane fade recent_order"
                          id="nav-profile"
                          role="tabpanel"
                          aria-labelledby="nav-profile-tab">
                          <div className="row mx-0">
                            <div className="col-12">
                              <form
                                className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                                action="">
                                <div className="form-group col mb-0">
                                  <label htmlFor="">Category</label>
                                  <select
                                    className="form-select form-control"
                                    aria-label="Default select example"
                                    onChange={(e) => {
                                      setCategory(e.target.value);
                                    }}>
                                    <option selected="">Select Category</option>
                                    {(allCategories || [])?.map(
                                      (item, index) => (
                                        <option key={index} value={item?._id}>
                                          {item?.categoryName}
                                        </option>
                                      )
                                    )}
                                  </select>
                                </div>
                                <div className="form-group mb-0 col">
                                  <label htmlFor="">Sub Category Name</label>
                                  <input
                                    type="text"
                                    className="form-select form-control"
                                    name="subCategory"
                                    onChange={(e) => {
                                      setSubCategory(e.target.value);
                                    }}
                                  />
                                </div>
                                <div className="form-group mb-0 col choose_fileAdmin position-relative">
                                  <span>Sub Category Image </span>{" "}
                                  <label htmlFor="upload_video">
                                    <i class="fa fa-camera me-1"></i>
                                    Choose File
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control shadow-none"
                                    defaultValue=""
                                    accept="image/*"
                                    name="subCateImg"
                                    id="upload_video"
                                    onChange={(e) =>
                                      onFileSelection(e, "subCateImg")
                                    }
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
                                    onClick={saveSubCategory}>
                                    Save
                                  </Button>
                                  <button
                                    className="comman_btn d-none"
                                    id="resetSubCat"
                                    type="reset">
                                    Reset
                                  </button>
                                </div>
                              </form>
                              <div className="row">
                                <div className="col-12 comman_table_design px-0">
                                  <div className="table-responsive">
                                    <table className="table mb-0">
                                      <thead>
                                        <tr
                                          style={{
                                            backgroundColor: "#f2f2f2",
                                          }}>
                                          <th>S.No.</th>
                                          <th>Date</th>
                                          <th>Category Name</th>
                                          <th>Sub Category Name</th>
                                          <th>Sub Category Image</th>
                                          <th>Tobacco</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {(allSubCategories || []).map(
                                          (item, index) => (
                                            <tr className="" key={index}>
                                              <td className="border">
                                                {(activePage2 - 1) * 15 +
                                                  (index + 1)}
                                                .
                                              </td>
                                              <td className="border">
                                                {moment(
                                                  item?.updatedAt?.slice(0, 10)
                                                ).format("MM/DD/YYYY")}
                                              </td>
                                              <td className="border">
                                                {item?.category?.categoryName
                                                  ? item?.category?.categoryName
                                                  : item?.categoryName
                                                      ?.categoryName}
                                              </td>
                                              <td className="border">
                                                {item?.subCategoryName}
                                              </td>
                                              <td className="border">
                                                <img
                                                  className="subCatImages"
                                                  src={
                                                    item?.subCategoryImage
                                                      ? item?.subCategoryImage
                                                      : require("../../../assets/img/product.jpg")
                                                  }></img>
                                              </td>
                                              <td className="border">
                                                {" "}
                                                <div
                                                  className=""
                                                  key={item?._id}>
                                                  <label class="switchUser">
                                                    <input
                                                      type="checkbox"
                                                      id={item?._id}
                                                      defaultChecked={
                                                        item?.isTobacco
                                                      }
                                                      onClick={() => {
                                                        SubCategoryTobaccoStatus(
                                                          item?._id
                                                        );
                                                      }}
                                                    />
                                                    <span class="sliderUser round"></span>
                                                  </label>
                                                </div>
                                              </td>
                                              <td className="border">
                                                <Link
                                                  data-bs-toggle="modal"
                                                  data-bs-target="#staticBackdrop2"
                                                  className="comman_btn2 text-white text-decoration-none"
                                                  key={index}
                                                  onClick={() => {
                                                    EditSubCategory(item?._id);
                                                  }}>
                                                  Edit
                                                </Link>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
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
                                                : setActivePage2(
                                                    activePage2 - 1
                                                  )
                                            }>
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
                                                : setActivePage2(
                                                    activePage2 + 1
                                                  )
                                            }>
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
      </div>
      <>
        <div
          className="modal fade comman_modal"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  Edit Category
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="cateModal"
                  aria-label="Close"
                  onClick={() =>
                    document
                      .getElementById("catImg")
                      .setAttribute("src", EditCategories?.categoryImage)
                  }
                />
              </div>

              <div className="modal-body shadow">
                <form
                  className="form-design px- py-2 help-support-form row align-items-end justify-content-center"
                  action="">
                  <div className="form-group col-6 p-3">
                    <label htmlFor="" className="mx-3">
                      Category Image
                    </label>

                    <div className="account_profile position-relative">
                      <div className="circle">
                        <img
                          className="profile-pic subCatImages2"
                          id="catImg"
                          src={
                            EditCategories?.categoryImage
                              ? EditCategories?.categoryImage
                              : require("../../../assets/img/product.jpg")
                          }
                        />
                      </div>
                      <div className="p-image">
                        <i className="uploadFile fa fa-camera" />
                        <input
                          className="file-uploads"
                          type="file"
                          id="catUpImg"
                          accept="image/*"
                          name="newCategoryImg"
                          onChange={(e) => onFileSelection(e, "newCategoryImg")}
                        />
                      </div>
                    </div>
                    {EditCategories?.categoryImage ? (
                      <i
                        class="fa fa-trash mx-2 text-danger deleteBtnCat"
                        aria-hidden="true"
                        onClick={deleteCatImage}></i>
                    ) : null}
                  </div>

                  <div className="form-group col-6 p-3">
                    <label htmlFor="" className="mx-3">
                      Background Image
                    </label>

                    <div className="account_profile position-relative ">
                      <div className="circle ">
                        <img
                          className="profile-pic subCatImages2"
                          id="backImg"
                          src={
                            EditCategories?.background
                              ? EditCategories?.background
                              : require("../../../assets/img/product.jpg")
                          }
                        />
                      </div>
                      <div className="p-image">
                        <i className="uploadFile fa fa-camera" />
                        <input
                          className="file-uploads"
                          type="file"
                          id="backUpImg"
                          accept="image/*"
                          name="background"
                          onChange={(e) => onFileSelection(e, "background")}
                        />
                      </div>
                    </div>
                    {EditCategories?.categoryImage ? (
                      <i
                        class="fa fa-trash mx-2 text-danger deleteBtnCat"
                        aria-hidden="true"
                        onClick={() =>
                          deleteBackImage(EditCategories?._id)
                        }></i>
                    ) : null}
                  </div>
                  <div className="form-group col-6">
                    <label htmlFor="">Category Name</label>
                    <input
                      type="text"
                      defaultValue={EditCategories?.categoryName}
                      className="form-control"
                      onChange={(e) => {
                        setEditCateName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group col-6 mb-4">
                    <label htmlFor="">Listing order</label>
                    <select
                      key={EditCategories?.listingOrder}
                      className="form-select form-control"
                      aria-label="Default select example"
                      onChange={(e) => {
                        setOrder(e.target.value);
                      }}>
                      <option selected value={EditCategories?.listingOrder}>
                        {EditCategories?.listingOrder
                          ? EditCategories?.listingOrder
                          : 0 + 1}
                      </option>
                      <option value="0">1</option>
                      <option value="1">2</option>
                      <option value="2">3</option>
                      <option value="3">4</option>
                      <option value="4">5</option>
                      <option value="5">6</option>
                      <option value="6">7</option>
                      <option value="7">8</option>
                      <option value="8">9</option>
                      <option value="9">10</option>
                      <option value="10">11</option>
                    </select>
                  </div>
                  <div className="form-group mb-0 col-auto mt-3">
                    <button className="comman_btn" onClick={onEditSaveCategory}>
                      Save
                    </button>
                    <button
                      className="comman_btn d-none"
                      type="reset"
                      id="ResetCat">
                      reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div
          className="modal fade comman_modal"
          id="staticBackdrop2"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  Edit Sub Category
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  id="subCateModal"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={() =>
                    document
                      .getElementById("subCatImg")
                      .setAttribute("src", EditSubCategories?.subCategoryImage)
                  }
                />
              </div>
              <div className="modal-body shadow">
                <form
                  className="form-design px-3  help-support-form row align-items-end justify-content-center"
                  action="">
                  <div className="form-group col-12 p-1">
                    <label htmlFor="" className="">
                      Sub Category Image
                    </label>

                    <div className="account_profile position-relative border h-50">
                      {EditSubCategories?.subCategoryImage ? (
                        <i
                          class="fa fa-trash mx-2 text-danger "
                          aria-hidden="true"
                          onClick={() =>
                            deleteSubImage(EditSubCategories?._id)
                          }></i>
                      ) : null}
                      <div
                        className="text-center mt-0 mb-5 "
                        key={subCategoryIndex}>
                        <img
                          className="profile-pic subCatImages2"
                          id="subCatImg"
                          src={
                            EditSubCategories?.subCategoryImage
                              ? EditSubCategories?.subCategoryImage
                              : require("../../../assets/img/product.jpg")
                          }
                        />
                      </div>
                      <div className="p-image">
                        <i className="uploadFile fa fa-camera" />
                        <input
                          className="file-uploads"
                          type="file"
                          id="subCatUpImg"
                          accept="image/*"
                          name="newSubCategoryImg"
                          onChange={(e) =>
                            onFileSelection(e, "newSubCategoryImg")
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="form-group col-6 mb-4">
                    <label htmlFor="">Category</label>
                    <select
                      key={EditSubCategories?.subCategoryName}
                      className="form-select form-control"
                      aria-label="Default select example"
                      onChange={(e) => {
                        setCategory(e.target.value);
                      }}>
                      <option selected="">
                        {EditSubCategories?.categoryName?.categoryName}
                      </option>
                      {(allCategories || [])?.map((item, index) => (
                        <option key={index} value={item?._id}>
                          {item?.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    className="form-group col-6"
                    key={EditSubCategories?.subCategoryName}>
                    <label htmlFor="">Sub Category Name</label>
                    <input
                      type="text"
                      defaultValue={EditSubCategories?.subCategoryName}
                      className="form-control"
                      onChange={(e) => {
                        setEditSubCateName(e.target.value);
                      }}
                    />
                  </div>

                  <div className="form-group mb-0 col-auto mt-3">
                    <button
                      className="comman_btn"
                      onClick={onEditSaveSubCategory}>
                      Save
                    </button>
                    <button
                      className="comman_btn d-none"
                      type="reset"
                      id="ResetSub">
                      reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    </div>
  );
};

export default CategorySub;
