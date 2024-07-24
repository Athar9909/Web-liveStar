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
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Button } from "rsuite";

const GalleryMain = () => {
  const addCollection = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/addCollection`;
  const allCollection = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/allGalleries`;
  const allPdf = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getCatalog`;
  const editCollection = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/editCollection`;
  const viewCollection = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/gallery`;
  const status = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/galleryStatus/`;
  const pdfToImage = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/pdfToImage`;
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const [open, setOpen] = useState(false);
  const [loader, setLoader] = useState(false);
  const [sideBar, setSideBar] = useState(true);
  const [allVideos, setAllVideos] = useState();
  const [pdf, setPdf] = useState([]);
  const [files, setFiles] = useState([]);
  const [video, setVideo] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [galleries, setGalleries] = useState([]);
  const [slide, setSlide] = useState([]);
  const [editGalleryData, setEditGalleryData] = useState([]);
  const [editGalleryName, setEditGalleryName] = useState("");
  const [images, setImages] = useState();
  const [id, setId] = useState();
  const [allPdfs, setAllPdfs] = useState([]);
  useEffect(() => {
    getCollection();
  }, []);

  const addGallery = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("title", title);
    formData.append("coverImage", files?.coverImage);
    formData.append("videos", video?.video);
    multipleFiles?.dataImg?.map((item) => {
      formData.append("images", item?.images);
    });

    await axios.post(addCollection, formData).then((res) => {
      getCollection();
      setTitle("");
      if (!res.data.error) {
        document.getElementById("resetCatss").click();
        setFiles([]);
        setMultipleFiles([]);
        Swal.fire({
          title: "New Gallery Added!",
          icon: "success",
          confirmButtonText: "Okay",
        });
      } else {
        Swal.fire({
          title: res?.data.message,
          text: "Please fill all fields with valid Data.",
          icon: "error",
          timer: 2000,
          confirmButtonText: "Okay",
        });
      }
    });
  };

  const saveCollection = async (e) => {
    e.preventDefault();
    setLoader(true);
    // if(editGalleryName != "" || )
    let formData = new FormData();
    formData.append("title", editGalleryName);
    formData.append("coverImage", files?.editCoverImage);
    formData.append("videos", video?.videoEdit);
    multipleFiles?.dataImg?.map((item) => {
      formData.append("images", item?.gallery_images);
    });
    await axios.post(editCollection + "/" + id, formData).then((res) => {
      getCollection();
      document.getElementById("gallery_cat").click();
      if (!res.data.error) {
        Swal.fire({
          title: "Gallery Modified Successfully!",
          icon: "success",
          confirmButtonText: "Okay",
        });
        setFiles();
        setVideo();
        setLoader(false);
        onEditGallery(id);
        // window.location.reload(false);
      } else {
        Swal.fire({
          title: "Enter Valid Details!",
          icon: "error",
          confirmButtonText: "Okay",
        });
        setLoader(false);
      }
    });
  };

  const deleteImage = async (i, img, key) => {
    console.log(img, "delete");
    // images?.splice(i, 1);
    let formData = new FormData();
    formData.append(key, img);
    formData.append("removeVideo", true);
    await axios.post(editCollection + "/" + id, formData).then((res) => {
      console.log(res);
    });
    onEditGallery(id);
  };

  const onEditGallery = async (id) => {
    setId(id);
    const { data } = await axios.get(viewCollection + "/" + id);
    if (!data.error) {
      setEditGalleryData(data?.results?.gallery);
      setImages(data?.results?.gallery?.images);
      setAllVideos(data?.results?.gallery?.videos);
    }
  };

  const getCollection = async () => {
    const { data } = await axios.get(allCollection);
    console.log(data);
    if (!data.error) {
      setGalleries(data?.results.galleries);
    }
  };

  // instant image preview //

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

  const onFileSelection = (e, key) => {
    let image = e.target.files[0];
    new Compressor(image, {
      success: (compressed) => {
        setFiles({ ...files, [key]: compressed });
      },
    });
  };

  const onFileSelectionVideo = (e, key) => {
    let video = e.target.files[0];
    setVideo({ ...files, [key]: video });
  };

  console.log(video, "vieo");

  const onFileSelection2 = (e, key) => {
    let image = [e.target.files];
    console.log(image);
    let dataImg = [];
    (image || [])?.map((item) => {
      Object.values(item)?.map((img) => {
        new Compressor(img, {
          success: (compressed) => {
            dataImg.push({ [key]: compressed });
          },
        });
      });
    });
    setMultipleFiles({ dataImg });
  };

  const onFileSelectionPdf = (e, key) => {
    setPdf({ ...pdf, [key]: e.target.files[0] });
  };

  console.log(pdf?.pdf, "jjhj");

  const AddPdf = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("pdf", pdf?.pdf);
    const { data } = await axios.post(pdfToImage, formData);
    if (!data.error) {
      Swal.fire({
        title: "Pdf Uploaded Successfully!",
        icon: "success",
        timer: 2000,
      });
    } else {
      Swal.fire({
        title: data.message,
        icon: "error",
        timer: 2000,
      });
    }
  };

  const getSlides = (img) => {
    let Slide = [];
    img?.map((item) => {
      if (item) {
        Slide?.push({ src: item });
      }
    });
    setSlide(Slide);
    setOpen(true);
  };
  const GalleryStatus = async (id) => {
    await axios.post(status + id).then((res) => {
      if (!res?.data.error) {
        Swal.fire({
          title: res?.data.message,
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    });
  };

  const searchGallery = async (e) => {
    let string = e.target.value;
    console.log(string);
    if (string === "") {
      const { data } = await axios.get(allCollection);
      console.log(data);
      if (!data.error) {
        setGalleries(data?.results.galleries);
      }
    } else {
      let data = galleries?.filter((item) => {
        return item?.title.toLowerCase().includes(string.toLowerCase());
      });
      setGalleries(data);
    }
  };
  console.log(files, multipleFiles, "ijj");
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
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
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
                    className="bg-white"
                    to="/Gallery-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
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
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
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
                    className="bg-white"
                    to="/Gallery-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
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
                  <h2 className="main_headers">Gallery Management</h2>
                </div>
                <div className="col-6  d-flex justify-content-end">
                  <form className="form-design" action="">
                    <div className="form-group mb-0 position-relative icons_set">
                      <input
                        type="search"
                        className="form-control bg-white h-50"
                        placeholder="Search"
                        name="name"
                        id="Search"
                        onChange={searchGallery}
                      />
                    </div>
                  </form>
                </div>
              </div>
              <div className="row mx-0">
                <div className="col-12 design_outter_comman  shadow">
                  <div className="row">
                    <div className="col-12 user-management-tabs px-0">
                      <div className="">
                        <div
                          className="tab-pane fade show active"
                          id="nav-home"
                          role="tabpanel"
                          aria-labelledby="nav-home-tab">
                          <div className="row mx-0 ">
                            <div className="col-12">
                              <form
                                className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                                action="">
                                <div className="form-group mb-0 col-3">
                                  <label htmlFor="">Title</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="Title"
                                    onChange={(e) => {
                                      setTitle(e.target.value);
                                    }}
                                  />
                                </div>
                                <div className="form-group mb-0 col-3 choose_fileAdmin position-relative">
                                  <span>Cover Image</span>{" "}
                                  <label htmlFor="uploadCover">
                                    <i class="fa fa-camera me-1"></i>
                                    Choose File
                                  </label>{" "}
                                  <input
                                    type="file"
                                    className="form-control shadow-none"
                                    defaultValue=""
                                    id="uploadCover"
                                    accept="image/*"
                                    name="coverImage"
                                    onChange={(e) =>
                                      onFileSelection(e, "coverImage")
                                    }
                                  />
                                </div>
                                <div className="form-group mb-0 col-3 choose_fileAdmin position-relative">
                                  <span>Gallery Images</span>{" "}
                                  <label htmlFor="uploadImage">
                                    <i class="fa fa-camera me-1"></i>
                                    Choose File
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control shadow-none"
                                    defaultValue=""
                                    id="uploadImage"
                                    accept="image/*"
                                    name="images"
                                    onChange={(e) =>
                                      onFileSelection2(e, "images")
                                    }
                                    multiple
                                  />
                                </div>

                                <div className="form-group mb-0 col-3 choose_fileAdmin position-relative">
                                  <span>Add Video</span>{" "}
                                  <label htmlFor="upload_video">
                                    <i class="fa fa-camera me-1"></i>
                                    Choose File
                                  </label>
                                  <input
                                    type="file"
                                    className="form-control shadow-none"
                                    defaultValue=""
                                    id="upload_video"
                                    accept="video/*"
                                    name="images"
                                    onChange={(e) =>
                                      onFileSelectionVideo(e, "video")
                                    }
                                  />
                                </div>

                                <div className="form-group mb-0 col-12 text-center mt-4">
                                  <button
                                    className="comman_btn2"
                                    onClick={addGallery}>
                                    Save Collection
                                  </button>
                                  <button
                                    className="comman_btn d-none"
                                    id="resetCatss"
                                    type="reset">
                                    Reset
                                  </button>
                                </div>
                              </form>

                              <div className="row ">
                                <div className="col-12 comman_table_design px-0">
                                  <div className="table-responsive border">
                                    <table className="table mb-0">
                                      <thead>
                                        <tr
                                          style={{
                                            backgroundColor: "#f2f2f2",
                                          }}>
                                          <th>Date</th>
                                          <th>Title</th>
                                          <th>Cover Image</th>
                                          <th>Gallery Images</th>
                                          <th>Status</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody className="recent_orders_cate">
                                        {galleries?.map((item, index) => (
                                          <tr>
                                            <td className="border">
                                              {" "}
                                              {moment(item?.updatedAt).format(
                                                "MM/DD/YYYY"
                                              )}
                                            </td>
                                            <td className="border">
                                              {item?.title}
                                            </td>
                                            <td className="border">
                                              <img
                                                className="subCatImages"
                                                src={
                                                  item?.coverImage
                                                    ? item?.coverImage
                                                    : require("../../../assets/img/product.jpg")
                                                }></img>
                                            </td>
                                            <td className="border">
                                              <img
                                                onClick={() =>
                                                  getSlides(item?.images)
                                                }
                                                className="previewImages"
                                                src={require("../../../assets/img/preview2.png")}></img>
                                              <br />
                                              <small>CLick to preview</small>
                                            </td>
                                            <td className="border">
                                              {" "}
                                              <div className="" key={item?._id}>
                                                <label class="switchUser">
                                                  <input
                                                    type="checkbox"
                                                    id={item?._id}
                                                    defaultChecked={
                                                      item?.status
                                                    }
                                                    onClick={() => {
                                                      GalleryStatus(item?._id);
                                                    }}
                                                  />
                                                  <span class="sliderUser round"></span>
                                                </label>
                                              </div>
                                            </td>

                                            <td className="border">
                                              <a
                                                data-bs-toggle="modal"
                                                data-bs-target="#staticBackdrop"
                                                className="comman_btn2   text-white text-decoration-none"
                                                style={{
                                                  backgroundColor: "#eb3237",
                                                  fontSize: "22px",
                                                  position: "relative",
                                                  top: "-2px",
                                                }}
                                                key={index}
                                                onClick={() => {
                                                  onEditGallery(item?._id);
                                                }}>
                                                Edit
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
      <>
        <div
          className="modal fade comman_modal"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-xl ">
            <div className="modal-content border-0">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  Edit Gallery
                </h5>
                <Button
                  appearance="primary"
                  loading={loader}
                  style={{
                    backgroundColor: "#eb3237",
                    fontSize: "20px",
                    position: "relative",
                    top: "-2px",
                  }}
                  className="comman_btn mx-4"
                  onClick={saveCollection}>
                  Save
                </Button>

                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="Modal_gallery"
                  aria-label="Close"
                  onClick={() => {
                    document.getElementById("gallery_cat").click();
                  }}
                />
              </div>

              <div className="modal-body shadow">
                <form
                  className="form-design px-2 py-2 help-support-form  row  justify-content-center"
                  action="">
                  <div
                    className="form-group col-2 mt-2"
                    key={editGalleryData?.title}>
                    <label htmlFor="">Title</label>
                    <input
                      type="text"
                      defaultValue={editGalleryData?.title}
                      className="form-control"
                      onChange={(e) => {
                        setEditGalleryName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group mb-0 col choose_fileAdmin position-relative mt-2">
                    <span>Add Gallery Images</span>{" "}
                    <label htmlFor="uploadImg">
                      <i class="fa fa-camera me-1"></i>
                      Choose File
                    </label>{" "}
                    <input
                      type="file"
                      className="form-control shadow-none"
                      defaultValue=""
                      id="uploadImg"
                      accept="image/*"
                      name="gallery_images"
                      onChange={(e) => onFileSelection2(e, "gallery_images")}
                      multiple
                    />
                  </div>

                  <div className="form-group mb-0 col choose_fileAdmin position-relative mt-2">
                    <span>Add Video</span>{" "}
                    <label htmlFor="upload_videoEdit">
                      <i class="fa fa-camera me-1"></i>
                      Choose File
                    </label>
                    <input
                      type="file"
                      className="form-control shadow-none"
                      defaultValue=""
                      id="upload_videoEdit"
                      accept="video/*"
                      name="videoEdit"
                      onChange={(e) => onFileSelectionVideo(e, "videoEdit")}
                    />
                  </div>
                  <div className="form-group col-4 p-2 ">
                    <label htmlFor="" className="mx-3">
                      Cover Image
                    </label>
                    <div className="border pb-5 rounded">
                      <div className="account_profile position-relative">
                        <div className="circle">
                          <img
                            className="profile-pic subCatImages2"
                            id="image"
                            src={
                              editGalleryData?.coverImage
                                ? editGalleryData?.coverImage
                                : require("../../../assets/img/product.jpg")
                            }
                          />
                        </div>
                        <div className="p-image">
                          <i className="uploadFile fa fa-camera" />
                          <input
                            className="file-uploads"
                            type="file"
                            id="image_up"
                            accept="image/*"
                            name="editCoverImage"
                            onChange={(e) =>
                              onFileSelection(e, "editCoverImage")
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button
                        className="nav-link active"
                        id="SlideImg-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#SlideImg"
                        type="button"
                        role="tab"
                        aria-controls="SlideImg"
                        aria-selected="false">
                        All Images
                      </button>
                      <button
                        className="nav-link "
                        id="SlideVid-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#SlideVid"
                        type="button"
                        role="tab"
                        aria-controls="SlideVid"
                        aria-selected="false">
                        All Videos
                      </button>
                    </div>
                  </nav>
                  <div
                    className="tab-content recent_orders_cate"
                    id="nav-tabContent">
                    <div
                      className="tab-pane fade show  active"
                      id="SlideImg"
                      role="tabpanel"
                      aria-labelledby="SlideImg-tab">
                      <div className="row align-items-start px-0 p-2 border rounded edit_galllery p-3">
                        {images?.map((item, ind) => (
                          <div className="col-3 mb-3" key={ind}>
                            <div className="image_box">
                              <i
                                className="fas fa-close closeIcon"
                                onClick={() =>
                                  deleteImage(ind, item, "imageKey")
                                }></i>
                              <img
                                className="gallery_uploads"
                                src={
                                  item
                                    ? item
                                    : require("../../../assets/img/product.jpg")
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div
                      className="tab-pane fade  show"
                      id="SlideVid"
                      role="tabpanel"
                      aria-labelledby="SlideVid-tab">
                      <div className="row align-items-start px-0 p-2 border rounded edit_galllery">
                        {allVideos?.map((item, ind) => (
                          <div className="col-3 mb-3" key={ind}>
                            <div className="image_box">
                              <i
                                className="fas fa-close closeIcon"
                                onClick={() =>
                                  deleteImage(ind, item, "videoKey")
                                }></i>
                              <video
                                id="frameOne"
                                className="gallery_uploads"
                                autoPlay
                                loop
                                muted
                                allowfullscreen="">
                                <source
                                  src={
                                    item
                                      ? item
                                      : require("../../../assets/img/product.jpg")
                                  }
                                />
                              </video>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-0 col-auto mt-3">
                    <button
                      className="comman_btn d-none"
                      type="reset"
                      id="gallery_cat">
                      reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
      <Lightbox open={open} close={() => setOpen(false)} slides={slide} />
    </div>
  );
};

export default GalleryMain;
