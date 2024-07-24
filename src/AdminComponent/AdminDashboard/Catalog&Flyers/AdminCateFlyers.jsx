import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/css/adminMain.css";
import Starlogo from "../../../assets/img/logo.png";
import axios from "axios";
import { useEffect } from "react";
import ProfileBar from "../ProfileBar";
import Swal from "sweetalert2";
import moment from "moment";
import Compressor from "compressorjs";
import { Button } from "rsuite";

const AdminCateFlyers = () => {
  const [sideBar, setSideBar] = useState(true);
  const [switches, setSwitches] = useState(false);
  const [pdfData, setPdfData] = useState([]);
  const [loader, setLoader] = useState(false);
  const allPdf = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getTemplates`;
  const allCatalogs = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getCatalog`;
  const addCatelog = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/createCatalog`;
  const addPdfCatelog = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/pdfToImage`;
  const deleteCate = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/deleteCatalog`;
  const status = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/changeCatalogStatus`;
  const [catelogueUrl, setCatelogueUrl] = useState("");
  const [catelogueTitle, setCatelogueTitle] = useState("");
  const [flyerUrl, setFlyerUrl] = useState("");
  const [flyerTitle, setFlyerTitle] = useState("");
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const [fDate, setFdate] = useState();
  const [files, setFiles] = useState([]);
  const [catalogs, setCatalogs] = useState([]);
  const [flyers, setFlyers] = useState([]);
  const [descCatalog, setDescCatalog] = useState();
  const [descFlyer, setDescFlyer] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    getCatalogs();
  }, []);

  const getCatalogs = async () => {
    const { data } = await axios.get(allPdf);
    if (!data.error) {
      setCatalogs(data?.results?.catalogs);
      setFlyers(data?.results?.catalogs);
    }
  };

  const onFileSelection = (e, key) => {
    let image = e.target.files[0];
    new Compressor(image, {
      success: (compressed) => {
        setFiles({ ...files, [key]: compressed });
      },
    });
  };

  const AddCate = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("title", catelogueTitle);
    formData.append("type", pdfData?.length ? "ByPDF" : "ByTemp");
    formData.append("description", descCatalog);
    formData.append("coverImage", files?.coverImageC ? files?.coverImageC : "");
    formData.append("catalogType", "Catalog");
    formData.append(
      "pdfFilePath",
      pdfData?.length ? pdfData[0]?.pdfFilePath : ""
    );

    pdfData?.length && formData.append("pdfImages", JSON.stringify(pdfData));

    const { data } = await axios.post(addCatelog, formData);
    if (!data.error) {
      pdfData?.length
        ? navigate(
            `/Catelog-Flyers/Create-New-pdf/${data?.results?.catalog?._id}`
          )
        : navigate(`/Catelog-Flyers/Create-New/${data?.results?.catalog?._id}`);
      document.getElementById("resetCatalog").click();
      setFiles([]);
      getCatalogs();
    } else {
      Swal.fire({
        title: data.message,
        icon: "error",
        timer: 2000,
      });
    }
  };

  const uploadPdf = async (e) => {
    e.preventDefault();
    setLoader(true);
    let formData = new FormData();
    formData.append("pdf", e.target.files[0]);
    const { data } = await axios.post(addPdfCatelog, formData);
    if (!data.error) {
      setPdfData(data?.results?.imageUrls);
      setLoader(false);
    } else {
      Swal.fire({
        title: data.message,
        icon: "error",
        timer: 2000,
      });
      setLoader(false);
    }
  };

  const AddCatePdf = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("title", catelogueTitle);
    formData.append("description", descCatalog);
    formData.append("pdf", e.target.files[0]);
    formData.append("coverImage", files?.coverImageC ? files?.coverImageC : "");
    const { data } = await axios.post(addPdfCatelog, formData);
    if (!data.error) {
      navigate(`/Catelog-Flyers/Create-New-pdf/${data?.results?.catalog?._id}`);
      document.getElementById("resetCatalog").click();
      setFiles([]);
      getCatalogs();
    } else {
      Swal.fire({
        title: data.message,
        icon: "error",
        timer: 2000,
      });
    }
  };

  const AddFlyer = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("title", flyerTitle);
    formData.append("type", pdfData?.length ? "ByPDF" : "ByTemp");

    formData.append("flyerDate", fDate ? fDate : "");
    formData.append("coverImage", files?.coverImageF ? files?.coverImageF : "");
    formData.append("catalogType", "Flyer");
    formData.append(
      "pdfFilePath",
      pdfData?.length ? pdfData[0]?.pdfFilePath : ""
    );
    pdfData?.length && formData.append("pdfImages", JSON.stringify(pdfData));

    const { data } = await axios.post(addCatelog, formData);

    if (!data.error) {
      Swal.fire({
        title: "Flyer Uploaded Successfully!",
        icon: "success",
        timer: 2000,
      });
      setFiles([]);
      // document.getElementById("resetFlyer").click();
      pdfData?.length
        ? navigate(
            `/Catelog-Flyers/Create-Flyer-pdf/${data?.results?.catalog?._id}`
          )
        : navigate(
            `/Catelog-Flyers/Create-Flyer/${data?.results?.catalog?._id}`
          );
      document.getElementById("resetCatalog").click();
      getCatalogs();
    } else {
      Swal.fire({
        title: data.message,
        icon: "error",
        timer: 2000,
      });
    }
  };

  const deleteCatalog = async (type, id) => {
    const { data } = await axios.get(deleteCate + "/" + id);
    if (!data.error) {
      getCatalogs();
    }
  };

  const catalogStatus = async (id) => {
    await axios.get(status + "/" + id).then((res) => {
      if (!res?.data.error) {
        Swal.fire({
          title: res?.data.message,
          icon: "success",
          confirmButtonText: "Okay",
          timer: 2000,
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
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
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
                    className="bg-white"
                    to="/Catelog-Flyers"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
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
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
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
                    to="/admin/Tradeshow-manage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
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
                    className="bg-white"
                    to="/Catelog-Flyers"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
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
          <div className="row category_management justify-content-center">
            <div className="col-12">
              <div className="d-flex comman_header justify-content-between px-2">
                <div className="col-6">
                  <h2 className="main_headers fs-4">Catalogs</h2>
                </div>
                <div className="col-6  d-flex justify-content-end"></div>
              </div>
              <div className="row mx-0">
                <div className="col-12 design_outter_comman  shadow">
                  <div className="row">
                    <div className="col-12 user-management-tabs px-0">
                      <div className="">
                        <nav>
                          <div
                            className="nav nav-tabs"
                            id="nav-tab"
                            role="tablist"
                          >
                            <button
                              className="nav-link active"
                              id="nav-home-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-home"
                              type="button"
                              role="tab"
                              aria-controls="nav-home"
                              aria-selected="true"
                            >
                              Catalogs
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
                            >
                              Monthly Flyers
                            </button>
                          </div>
                        </nav>
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
                            <div className="row mx-0 ">
                              <div className="col-12 pt-2">
                                <form
                                  className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                                  action=""
                                >
                                  <div className="form-group mb-0 col-4">
                                    <span>Enter Catalog Title</span>{" "}
                                    <label htmlFor="upload_video"></label>
                                    <input
                                      type="text"
                                      className="form-control shadow-none"
                                      defaultValue=""
                                      name="catelogue"
                                      onChange={(e) =>
                                        setCatelogueTitle(e.target.value)
                                      }
                                    />
                                  </div>

                                  <div className="form-group mb-0 col-4 choose_fileAdmin position-relative">
                                    <span>Cover Image</span>{" "}
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
                                      onChange={(e) =>
                                        onFileSelection(e, "coverImageC")
                                      }
                                    />
                                  </div>

                                  <div className="form-group mb-0 col-4">
                                    <span>Enter Catalog Description</span>{" "}
                                    <label htmlFor="upload_video"></label>
                                    <input
                                      type="text"
                                      className="form-control shadow-none"
                                      defaultValue=""
                                      name="catelogue"
                                      onChange={(e) =>
                                        setDescCatalog(e.target.value)
                                      }
                                    />
                                  </div>

                                  {switches && (
                                    <div className="form-group mb-0 col-4 choose_fileAdmin position-relative mt-2">
                                      <span>Upload Pdf</span>{" "}
                                      <label htmlFor="catalogPdf">
                                        <i class="fa fa-camera me-1"></i>
                                        Choose File
                                      </label>{" "}
                                      <input
                                        type="file"
                                        className="form-control shadow-none "
                                        defaultValue=""
                                        id="catalogPdf"
                                        accept="application/pdf"
                                        onChange={(e) => uploadPdf(e)}
                                      />
                                    </div>
                                  )}
                                  {switches ? (
                                    <div className="form-group mb-0 col-12 text-center mt-4">
                                      <Button
                                        loading={loader}
                                        className="comman_btn2"
                                        onClick={AddCate}
                                      >
                                        Save
                                      </Button>

                                      <a
                                        className="comman_btn2 mx-2"
                                        onClick={() => setSwitches(!switches)}
                                      >
                                        Cancel
                                      </a>

                                      <button
                                        className="comman_btn d-none"
                                        id="resetCatalog"
                                        type="reset"
                                      >
                                        Reset
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="form-group mb-0 col-12 text-center mt-4">
                                      <button
                                        className="comman_btn2"
                                        onClick={AddCate}
                                      >
                                        Create a Catalog
                                      </button>
                                      <span className="mx-2">Or</span>
                                      <a
                                        className="comman_btn2"
                                        onClick={() => setSwitches(true)}
                                      >
                                        Upload a Pdf
                                      </a>

                                      <button
                                        className="comman_btn d-none"
                                        id="resetCatalog"
                                        type="reset"
                                      >
                                        Reset
                                      </button>
                                    </div>
                                  )}
                                </form>

                                <div className="row ">
                                  <div className="col-12 comman_table_design px-0">
                                    <div className="table-responsive border">
                                      <table className="table mb-0">
                                        <thead>
                                          <tr
                                            style={{
                                              backgroundColor: "#f2f2f2",
                                            }}
                                          >
                                            <th>Date</th>
                                            <th>Title</th>
                                            <th>Type</th>
                                            <th>Cover Image</th>
                                            <th>Description</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                          </tr>
                                        </thead>
                                        <tbody className="recent_orders_cate">
                                          {catalogs
                                            ?.filter(
                                              (itm) =>
                                                itm?.catalogType === "Catalog"
                                            )
                                            ?.map((item, index) => (
                                              <tr>
                                                <td className="border">
                                                  {" "}
                                                  {moment(
                                                    item?.updatedAt
                                                  ).format("MM/DD/YYYY")}
                                                </td>
                                                <td className="border">
                                                  {item?.title}
                                                </td>
                                                <td className="border">
                                                  {item?.type}
                                                </td>
                                                <td className="border">
                                                  <img
                                                    className="subCatImages"
                                                    src={
                                                      item?.coverImage
                                                        ? item?.coverImage
                                                        : require("../../../assets/img/product.jpg")
                                                    }
                                                  ></img>
                                                </td>
                                                <td className="border desc_box">
                                                  {item?.description}
                                                </td>
                                                <td className="border">
                                                  {" "}
                                                  <div
                                                    className=""
                                                    //   key={item?._id}
                                                  >
                                                    <label class="switchUser">
                                                      <input
                                                        type="checkbox"
                                                        id={item?._id}
                                                        defaultChecked={
                                                          item?.status
                                                        }
                                                        onClick={() => {
                                                          catalogStatus(
                                                            item?._id
                                                          );
                                                        }}
                                                      />
                                                      <span class="sliderUser round"></span>
                                                    </label>
                                                  </div>
                                                </td>

                                                <td className="border">
                                                  <a
                                                    className="comman_btn text-white text-decoration-none mx-1"
                                                    onClick={() => {
                                                      item?.type === "ByPDF"
                                                        ? navigate(
                                                            `/Catelog-Flyers/Create-New-pdf/${item?._id}`
                                                          )
                                                        : navigate(
                                                            `/Catelog-Flyers/EditCatalog/${item?._id}`
                                                          );
                                                    }}
                                                  >
                                                    Edit
                                                  </a>
                                                  <a
                                                    className="comman_btn2 text-white text-decoration-none"
                                                    onClick={() => {
                                                      item?.type === "ByPDF"
                                                        ? navigate(
                                                            `/Catelog-Flyers/Preview-Catalog-pdf/${item?._id}`
                                                          )
                                                        : navigate(
                                                            `/Catelog-Flyers/Preview-Catalog/${item?._id}`
                                                          );
                                                    }}
                                                  >
                                                    View
                                                  </a>
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
                          <div
                            className="tab-pane fade recent_order"
                            id="nav-profile"
                            role="tabpanel"
                            aria-labelledby="nav-profile-tab"
                          >
                            <div className="row mx-0 ">
                              <div className="col-12 pt-2">
                                <form
                                  className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                                  action=""
                                >
                                  <div className="form-group mb-0 col-4">
                                    <span>Flyer Title</span>{" "}
                                    <input
                                      type="text"
                                      className="form-control shadow-none"
                                      defaultValue=""
                                      name="flyerTitle"
                                      onChange={(e) =>
                                        setFlyerTitle(e.target.value)
                                      }
                                    />
                                  </div>

                                  <div className="form-group mb-0 col-4 choose_fileAdmin position-relative">
                                    <span>Cover Image</span>{" "}
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
                                      onChange={(e) =>
                                        onFileSelection(e, "coverImageF")
                                      }
                                    />
                                  </div>

                                  <div className="form-group mb-0 col-4">
                                    <label htmlFor="">Choose Date </label>
                                    <input
                                      type="date"
                                      className="form-control"
                                      id="dateF"
                                      name="expiry"
                                      value={fDate}
                                      onChange={(e) => setFdate(e.target.value)}
                                    ></input>
                                  </div>

                                  {switches && (
                                    <div className="form-group mb-0 col-4 choose_fileAdmin position-relative mt-2">
                                      <span>Upload Pdf</span>{" "}
                                      <label htmlFor="catalogPdf">
                                        <i class="fa fa-camera me-1"></i>
                                        Choose File
                                      </label>{" "}
                                      <input
                                        type="file"
                                        className="form-control shadow-none "
                                        defaultValue=""
                                        id="catalogPdf"
                                        accept="application/pdf"
                                        onChange={(e) => uploadPdf(e)}
                                      />
                                    </div>
                                  )}
                                  {switches ? (
                                    <div className="form-group mb-0 col-12 text-center mt-4">
                                      <Button
                                        loading={loader}
                                        className="comman_btn2"
                                        onClick={AddFlyer}
                                      >
                                        Save
                                      </Button>

                                      <a
                                        className="comman_btn2 mx-2"
                                        onClick={() => setSwitches(!switches)}
                                      >
                                        Cancel
                                      </a>

                                      <button
                                        className="comman_btn d-none"
                                        id="resetCatalog"
                                        type="reset"
                                      >
                                        Reset
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="form-group mb-0 col-12 text-center mt-4">
                                      <button
                                        className="comman_btn2"
                                        onClick={AddFlyer}
                                      >
                                        Create a Flyer
                                      </button>
                                      <span className="mx-2">Or</span>
                                      <a
                                        className="comman_btn2"
                                        onClick={() => setSwitches(true)}
                                      >
                                        Upload a Pdf
                                      </a>

                                      <button
                                        className="comman_btn d-none"
                                        id="resetCatalog"
                                        type="reset"
                                      >
                                        Reset
                                      </button>
                                    </div>
                                  )}
                                </form>

                                <div className="row ">
                                  <div className="col-12 comman_table_design px-0">
                                    <div className="table-responsive border">
                                      <table className="table mb-0">
                                        <thead>
                                          <tr
                                            style={{
                                              backgroundColor: "#f2f2f2",
                                            }}
                                          >
                                            <th>Date</th>
                                            <th>Title</th>
                                            <th>Type</th>

                                            <th>Cover Image</th>
                                            <th>Status</th>
                                            <th>Action</th>
                                          </tr>
                                        </thead>
                                        <tbody className="recent_orders_cate">
                                          {flyers
                                            ?.filter(
                                              (itm) =>
                                                itm?.catalogType === "Flyer"
                                            )
                                            ?.map((item, index) => (
                                              <tr>
                                                <td className="border">
                                                  {moment(
                                                    item?.updatedAt
                                                  ).format("MM/DD/YYYY")}
                                                </td>
                                                <td className="border">
                                                  {item?.title}
                                                </td>
                                                <td className="border">
                                                  {item?.type}
                                                </td>
                                                <td className="border">
                                                  <img
                                                    className="subCatImages"
                                                    src={
                                                      item?.coverImage
                                                        ? item?.coverImage
                                                        : require("../../../assets/img/product.jpg")
                                                    }
                                                  ></img>
                                                </td>

                                                <td className="border">
                                                  {" "}
                                                  <div
                                                    className=""
                                                    key={item?._id}
                                                  >
                                                    <label class="switchUser">
                                                      <input
                                                        type="checkbox"
                                                        id={item?._id}
                                                        defaultChecked={
                                                          item?.status
                                                        }
                                                        onClick={() => {
                                                          catalogStatus(
                                                            item?._id
                                                          );
                                                        }}
                                                      />
                                                      <span class="sliderUser round"></span>
                                                    </label>
                                                  </div>
                                                </td>

                                                <td className="border">
                                                  <a
                                                    className="comman_btn text-white text-decoration-none mx-1"
                                                    onClick={() => {
                                                      item?.type === "ByPDF"
                                                        ? navigate(
                                                            `/Catelog-Flyers/Create-Flyer-pdf/${item?._id}`
                                                          )
                                                        : navigate(
                                                            `/Catelog-Flyers/EditFlyers/${item?._id}`
                                                          );
                                                    }}
                                                  >
                                                    Edit
                                                  </a>
                                                  <a
                                                    className="comman_btn2 text-white text-decoration-none"
                                                    onClick={() => {
                                                      item?.type === "ByPDF"
                                                        ? navigate(
                                                            `/Catelog-Flyers/Preview-Catalog-pdf/${item?._id}`
                                                          )
                                                        : navigate(
                                                            `/Catelog-Flyers/Preview-Catalog/${item?._id}`
                                                          );
                                                    }}
                                                  >
                                                    View
                                                  </a>
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
      <></>
    </div>
  );
};

export default AdminCateFlyers;
