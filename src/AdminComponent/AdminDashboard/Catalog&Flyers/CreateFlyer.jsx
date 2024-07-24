

import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import "../../../assets/css/adminMain.css";
import Starlogo from "../../../assets/img/logo.png";
import { useEffect } from "react";
import axios from "axios";
import ProfileBar from "../ProfileBar";
import { Button } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Select from "react-select";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, FreeMode, Grid } from "swiper";
import "swiper/css";
import Intro1 from "./Intro1";
import ListingPage from "./ListingPage";
import BannerDisplay1 from "./BannerDisplay1";
import ProductDetails1 from "./ProductDetails1";
import Swal from "sweetalert2";
import Compressor from "compressorjs";

const CreateFlyer = () => {
  const getProducts = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/singleProduct`;
  const inventorySearch = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/searchInventory`;
  const temp1 = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/createIntroPage`;
  const temp2 = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/productListingPage`;
  const temp3 = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/bannerPage`;
  const temp4 = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/productDetailPage`;
  const temp5 = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/summaryPage`;
  const temp6 = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/onlyImagePage`;
  const getTemp = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/viewTemplate/`;
  const [product, setProducts] = useState({});
  const [template, setTemplate] = useState(1);
  const [options, setOptions] = useState([]);
  const [flavours, setFlavours] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [sideBar, setSideBar] = useState(true);
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const [loader, setLoader] = useState(false);
  const [templatePreview, setTemplatePreview] = useState([]);
  const navigate = useNavigate();
  let { id } = useParams();
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [formValues, setFormValues] = useState([
    {
      page: 1,
      images: [],
      staticImages: [],
      Banners: [],
      Headers: [],
      flavours2: [],
    },
  ]);

  useEffect(() => {
    GetTemplates();
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  let handleCollapsed = (i, key) => {
    let newFormValues = [...formValues];
    newFormValues[i]["isHide"] = key;
    setFormValues(newFormValues);
  };

  const AddPage = async (e, i, template) => {
    e.preventDefault();
    let page = i + 1;
    // console.log(page, template);
    if (template === 1) {
      let formData = new FormData();
      formData.append("page", page);
      formData.append("catalogId", id);

      formData.append("bgImage", formValues[i]?.t1ImgBack);
      formData.append("qrCode", formValues[i]?.t1ImgQr);
      formData.append("pageTitle", formValues[i]?.t1Title);
      formData.append("catalogType", "Flyers");

      const { data } = await axios.post(temp1, formData);
      if (!data?.error) {
        Swal.fire({
          title: data?.message,
          timer: 2000,
          icon: "success",
        });
        handleCollapsed(i, "hide");
      } else if (data?.error) {
        Swal.fire({
          title: data?.message,
          timer: 2000,
          icon: "warning",
        });
      }
    } else if (template === 2) {
      let products = formValues[i]?.productName?.map((itm, id) => ({
        productId: itm?.value,
      }));
      let formData = new FormData();
      formData.append("page", page);
      formData.append("catalogId", id);

      formData.append("bgImage", formValues[i]?.t2ImgBack);
      formData.append("pageTitle", formValues[i]?.t2Title);
      formData.append("footer", formValues[i]?.t2Footer);
      formData.append("products", JSON.stringify(products));

      const { data } = await axios.patch(temp2, formData);
      if (!data?.error) {
        Swal.fire({
          title: data?.message,
          timer: 2000,
          icon: "success",
        });
        handleCollapsed(i, "hide");
      } else if (data?.error) {
        Swal.fire({
          title: data?.message,
          timer: 2000,
          icon: "warning",
        });
      }
      console.log("kokofdfd");
    } else if (template === 3) {
      let formData = new FormData();
      formData.append("page", page);
      formData.append("catalogId", id);
      formData.append("bgImage", formValues[i]?.t3ImgBack);
      formValues[i]?.t3ImgBanners?.map((item) => {
        formData.append("banner", item?.t3ImgBanners);
      });
      formData.append("pageTitle", formValues[i]?.t3Header);
      formData.append("footer", formValues[i]?.t3Footer);
      formData.append("bannerURL1", formValues[i]?.t3BannerUrl1);
      formData.append("bannerURL2", formValues[i]?.t3BannerUrl2);
      formData.append("bannerURL3", formValues[i]?.t3BannerUrl3);

      const { data } = await axios.patch(temp3, formData);
      if (!data?.error) {
        Swal.fire({
          title: data?.message,
          timer: 2000,
          icon: "success",
        });
        handleCollapsed(i, "hide");
      } else if (data?.error) {
        Swal.fire({
          title: data?.message,
          timer: 2000,
          icon: "warning",
        });
      }
    } else if (template === 4) {
      let products = formValues[i]?.productName2?.value;
      let flavours = formValues[i]?.flavours2?.map((itm, id) => itm?.value);
      let formData = new FormData();
      formData.append("page", page);
      formData.append("catalogId", id);
      formData.append("bgImage", formValues[i]?.t4ImgBack);
      formData.append("pageTitle", formValues[i]?.t4Header);
      formData.append("footer", formValues[i]?.t4Footer);
      formData.append("productLogo", formValues[i]?.t4LogoImg);
      formData.append("productId", products);
      formData.append("flavourId", JSON.stringify(flavours));

      const { data } = await axios.patch(temp4, formData);

      if (!data?.error) {
        Swal.fire({
          title: data?.message,
          timer: 2000,
          icon: "success",
        });
        handleCollapsed(i, "hide");
      } else if (data?.error) {
        Swal.fire({
          title: data?.message,
          timer: 2000,
          icon: "warning",
        });
      }
    } else if (template === 5) {
      let formData = new FormData();
      formData.append("page", page);
      formData.append("catalogId", id);
      formData.append("bgImage", formValues[i]?.t5ImgBack);
      formData.append("banner", formValues[i]?.t5BannersImg);
      formData.append("banner", formValues[i]?.t5BannersImg2);
      formData.append("video", formValues[i]?.t5BannersImg2);
      formData.append("pageTitle", formValues[i]?.t5Header);
      formData.append("footer", formValues[i]?.t5Footer);
      formData.append("bannerURL1", formValues[i]?.t5BannerUrl1);
      formData.append("bannerURL2", formValues[i]?.t5BannerUrl2);

      const { data } = await axios.patch(temp5, formData);
      if (!data?.error) {
        Swal.fire({
          title: data?.message,
          timer: 2000,
          icon: "success",
        });
        handleCollapsed(i, "hide");
      } else if (data?.error) {
        Swal.fire({
          title: data?.message,
          timer: 2000,
          icon: "warning",
        });
      }
    } else if (template === 6) {
      let formData = new FormData();
      formData.append("page", page);
      formData.append("catalogId", id);
      formData.append("bgImage", formValues[i]?.t6ImgBack);
      formData.append("bannerURL1", formValues[i]?.t6BannerUrl1);

      const { data } = await axios.patch(temp6, formData);
      if (!data?.error) {
        Swal.fire({
          title: data?.message,
          timer: 2000,
          icon: "success",
        });
        handleCollapsed(i, "hide");
      } else if (data?.error) {
        Swal.fire({
          title: data?.message,
          timer: 2000,
          icon: "warning",
        });
      }
    }
  };

  const onMultipleSelections = (e, key, index) => {
    let image = [e.target.files];
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

    let newFormValues = [...formValues];
    newFormValues[index][e.target.name] = dataImg;
    setFormValues(newFormValues);

    // setMultipleFiles({ dataImg });
  };

  const onFileSelectionImages = (e, key, index) => {
    let newFormValues = [...formValues];
    newFormValues[index][e.target.name] = e.target.files[0];
    setFormValues(newFormValues);
    // setFiles({ ...files, [key]: e.target.files[0] });
  };

  console.log(formValues, multipleFiles);

  const addFormFields = (e) => {
    setFormValues([
      ...formValues,
      {
        page: formValues?.length + 1,
        images: [],
        staticImages: [],
        Banners: [],
        Headers: [],
      },
    ]);
    window.scrollTo(0, document.body.scrollHeight);
  };

  useEffect(() => {
    createOptions();
  }, [searchKey]);

  const createOptions = async () => {
    await axios
      .post(inventorySearch, {
        search: searchKey,
      })
      .then((res) => {
        if (!res.error) {
          let data = res?.data.results.results;
          // setProducts(data);
          const optionList = data?.map((item, index) => ({
            value: item?._id,
            label: item?.unitName,
            image: item?.productImage,
          }));
          setOptions(optionList);
        }
      });
  };

  let handleChangeFlavour = (selected, i) => {
    let newFormValues = [...formValues];
    newFormValues[i].flavours2 = selected;
    setFormValues(newFormValues);
  };

  const GetProducts = async (id) => {
    await axios.get(getProducts + "/" + id).then((res) => {
      let data = res?.data.results;
      setProducts((p) => ({ ...p, [id]: data }));
      const optionList = data?.type.map((item, index) => ({
        value: item?._id,
        label: item?.flavour,
        image: item?.flavourImage,
      }));
      console.log(optionList, "kkl");
      setFlavours(optionList);
    });
  };

  const GetTemplates = async (id) => {
    await axios.get(getTemp + id).then((res) => {
      let data = res?.data.results?.catalog;
      setTemplatePreview(data);
    });
  };

  const handleChange2 = (selected, index) => {
    GetProducts(selected?.value);
    let newFormValues = [...formValues];
    newFormValues[index].productName = selected;
    setFormValues(newFormValues);
  };
  const handleChange3 = (selected, index) => {
    GetProducts(selected?.value);
    let newFormValues = [...formValues];
    newFormValues[index].productName2 = selected;
    setFormValues(newFormValues);
  };
  const handleTemplate = (temp, index) => {
    let newFormValues = [...formValues];
    newFormValues[index].template = temp;
    setFormValues(newFormValues);
  };

  const handleInputChange = (inputValue) => {
    setSearchKey(inputValue);
  };

  const removeFormFields = (index) => {
    let newFormValues = [...formValues];
    newFormValues?.splice(index, 1);
    setFormValues(newFormValues);
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
        <div className="col-12 ">
          <button onClick={() => addFormFields()} className="comman_btn ">
            + Add Page
          </button>
          <Link
            to={`/Catelog-Flyers/Preview-Catalog/${id}`}
            target="_blank"
            className="comman_btn mx-2">
            Preview Flyer
          </Link>
        </div>

        {(formValues || [])?.map((item, index) => (
          <div className="row Pending-view justify-content-center">
            <div className="col-12">
              <div className="row mx-0">
                <div className="col-12 design_outter_comman recent_orders shadow ">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2 className="main_headers">
                        Flyer - Page {index + 1}
                      </h2>
                    </div>
                    <div className="col-auto">
                      {console.log(`staticBackdrop${index}`, "LLL")}

                      {item?.isHide === "hide" ? (
                        <button
                          className="comman_btn mx-1"
                          type="button"
                          onClick={() => handleCollapsed(index, "show")}>
                          View
                        </button>
                      ) : (
                        <button
                          className="comman_btn mx-1"
                          type="button"
                          onClick={() => handleCollapsed(index, "hide")}>
                          Hide
                        </button>
                      )}
                      <button
                        className="comman_btn "
                        type="button"
                        disabled={formValues?.length <= 1 ? true : false}
                        onClick={() => removeFormFields(index)}>
                        <i className="fa fa-minus mt-1 mx-1" />
                      </button>
                    </div>
                  </div>
                  <div className={item?.isHide === "hide" ? "d-none" : "row"}>
                    <div className="col-12 p-4 Pending-view-main">
                      <form className="row py-2 form-design" autoComplete="off">
                        <label className="fw-bold fs-6 mb-2">
                          Page Templates : Choose one
                        </label>

                        <div className="row text-start mb-4">
                          <Swiper
                            slidesPerView={4}
                            spaceBetween={30}
                            navigation={true}
                            loop={true}
                            modules={[
                              FreeMode,
                              Pagination,
                              Autoplay,
                              Navigation,
                            ]}
                            className="mySwiper px-5 py-2">
                            <SwiperSlide key={index}>
                              <div className="form-group col-auto">
                                <div className=" position-relative d-inline-block">
                                  <div className="mb-2 ">
                                    <img
                                      className={
                                        item?.template === 1
                                          ? "borderTemp_img"
                                          : "Template_img"
                                      }
                                      onClick={() =>
                                        document
                                          .getElementById(`check${item?.page}`)
                                          .click()
                                      }
                                      src={require("../../../assets/img/tempIntro.png")}
                                      alt="Upload Image ........"
                                    />
                                  </div>
                                  <div class="form-check">
                                    <input
                                      class="form-check-input"
                                      type="radio"
                                      value=""
                                      defaultChecked={true}
                                      id={`check${item?.page}`}
                                      onClick={() => {
                                        setTemplate(1);
                                        handleTemplate(1, index);
                                      }}
                                      name="tempRadio"
                                    />
                                    <label
                                      class="form-check-label"
                                      for={`check${item?.page}`}>
                                      Intro Page
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                            <SwiperSlide key={index}>
                              <div className="form-group col-auto">
                                <div className=" position-relative d-inline-block">
                                  <div className="mb-2 ">
                                    <img
                                      onClick={() =>
                                        document
                                          .getElementById(`check2${item?.page}`)
                                          .click()
                                      }
                                      className={
                                        item?.template === 2
                                          ? "borderTemp_img"
                                          : "Template_img"
                                      }
                                      src={require("../../../assets/img/Temp1.png")}
                                      alt="Upload Image ........"
                                    />
                                  </div>
                                  <div class="form-check">
                                    <input
                                      class="form-check-input"
                                      type="radio"
                                      value=""
                                      onClick={() => {
                                        setTemplate(2);
                                        handleTemplate(2, index);
                                      }}
                                      id={`check2${item?.page}`}
                                      name="tempRadio"
                                    />
                                    <label
                                      class="form-check-label"
                                      for={`check2${item?.page}`}>
                                      Product Listing Page
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                            <SwiperSlide key={index}>
                              <div className="form-group col-auto">
                                <div className=" position-relative d-inline-block">
                                  <div className="mb-2 ">
                                    <img
                                      onClick={() =>
                                        document
                                          .getElementById(`check3${item?.page}`)
                                          .click()
                                      }
                                      className={
                                        item?.template === 3
                                          ? "borderTemp_img"
                                          : "Template_img"
                                      }
                                      src={require("../../../assets/img/Temp2.png")}
                                      alt="Upload Image ........"
                                    />
                                  </div>
                                  <div class="form-check">
                                    <input
                                      class="form-check-input"
                                      type="radio"
                                      value=""
                                      onClick={() => {
                                        setTemplate(3);
                                        handleTemplate(3, index);
                                      }}
                                      id={`check3${item?.page}`}
                                      name="tempRadio"
                                    />
                                    <label
                                      class="form-check-label"
                                      for={`check3${item?.page}`}>
                                      Banner Display
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                            <SwiperSlide key={index}>
                              <div className="form-group col-auto">
                                <div className=" position-relative d-inline-block">
                                  <div className="mb-2 ">
                                    <img
                                      onClick={() =>
                                        document
                                          .getElementById(`check4${item?.page}`)
                                          .click()
                                      }
                                      className={
                                        item?.template === 4
                                          ? "borderTemp_img"
                                          : "Template_img"
                                      }
                                      src={require("../../../assets/img/temp3.png")}
                                      alt="Upload Image ........"
                                    />
                                  </div>
                                  <div class="form-check">
                                    <input
                                      class="form-check-input"
                                      type="radio"
                                      value=""
                                      onClick={() => {
                                        setTemplate(4);
                                        handleTemplate(4, index);
                                      }}
                                      id={`check4${item?.page}`}
                                      name="tempRadio"
                                    />
                                    <label
                                      class="form-check-label"
                                      for={`check4${item?.page}`}>
                                      Product Details
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                            <SwiperSlide key={index}>
                              <div className="form-group col-auto">
                                <div className=" position-relative d-inline-block">
                                  <div className="mb-2 ">
                                    <img
                                      className={
                                        item?.template === 5
                                          ? "borderTemp_img"
                                          : "Template_img"
                                      }
                                      onClick={() =>
                                        document
                                          .getElementById(`check5${item?.page}`)
                                          .click()
                                      }
                                      src={require("../../../assets/img/temp4.png")}
                                      alt="Upload Image ........"
                                    />
                                  </div>
                                  <div class="form-check">
                                    <input
                                      class="form-check-input"
                                      type="radio"
                                      value=""
                                      onClick={() => {
                                        setTemplate(5);
                                        handleTemplate(5, index);
                                      }}
                                      id={`check5${item?.page}`}
                                      name="tempRadio"
                                    />
                                    <label
                                      class="form-check-label"
                                      for={`check5${item?.page}`}>
                                      Summary Page
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                            <SwiperSlide key={index}>
                              <div className="form-group col-auto">
                                <div className=" position-relative d-inline-block">
                                  <div className="mb-2 ">
                                    <img
                                      onClick={() =>
                                        document
                                          .getElementById(`check6${item?.page}`)
                                          .click()
                                      }
                                      className={
                                        item?.template === 6
                                          ? "borderTemp_img"
                                          : "Template_img"
                                      }
                                      src={require("../../../assets/img/product.jpg")}
                                      alt="Upload Image ........"
                                    />
                                  </div>
                                  <div class="form-check">
                                    <input
                                      class="form-check-input"
                                      type="radio"
                                      value=""
                                      onClick={() => {
                                        setTemplate(6);
                                        handleTemplate(6, index);
                                      }}
                                      id={`check6${item?.page}`}
                                      name="tempRadio"
                                    />
                                    <label
                                      class="form-check-label"
                                      for={`check6${item?.page}`}>
                                      Image Only
                                    </label>
                                  </div>
                                </div>
                              </div>
                            </SwiperSlide>
                          </Swiper>
                        </div>

                        {(() => {
                          switch (item?.template) {
                            case 1:
                              return (
                                <div className=" row border rounded p-2 mx-1">
                                  <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Background Image (size:2480 x 3508){" "}
                                    </span>
                                    <label
                                      htmlFor="upload_video"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      id="t1BackImg"
                                      accept="image/*"
                                      className="form-control  border border-secondary px-4"
                                      defaultValue=""
                                      name="t1ImgBack"
                                      capture
                                      onChange={(e) =>
                                        onFileSelectionImages(
                                          e,
                                          "t1BackImg",
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      QR Image{" "}
                                    </span>
                                    <label
                                      htmlFor="t1QrImg"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      id="t1QrImg"
                                      accept="image/*"
                                      className="form-control  border border-secondary px-4"
                                      defaultValue=""
                                      name="t1ImgQr"
                                      capture
                                      onChange={(e) =>
                                        onFileSelectionImages(
                                          e,
                                          "t1ImgQr",
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="form-group col-4 mb-4">
                                    <label className="fw-bold fs-6">
                                      Page Title
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control  border border-secondary signup_fields"
                                      name="t1Title"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>
                                </div>
                              );

                            case 2:
                              return (
                                <div className=" row border rounded p-2 mx-1">
                                  <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Background Image (size:2480 x 3508){" "}
                                    </span>
                                    <label
                                      htmlFor="t2BackImg"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      id="t2BackImg"
                                      accept="image/*"
                                      className="form-control  border border-secondary px-4"
                                      defaultValue=""
                                      name="t2ImgBack"
                                      capture
                                      onChange={(e) =>
                                        onFileSelectionImages(
                                          e,
                                          "t2BackImg",
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                  {console.log(formValues)}
                                  <div className="form-group col-8 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Select Products (25 Products)
                                    </span>
                                    <Select
                                      name="users"
                                      options={options}
                                      value={item?.productName || ""}
                                      className="basic-multi-select z-3"
                                      classNamePrefix="select"
                                      onChange={(value) =>
                                        handleChange2(value, index)
                                      }
                                      onInputChange={handleInputChange}
                                      isClearable
                                      required
                                      isMulti
                                      placeholder="Type any keyword to Search Product"
                                    />
                                  </div>

                                  <div className="form-group col-4 mb-4">
                                    <label
                                      htmlFor="DBA"
                                      className="fw-bold fs-6">
                                      Page Title
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control  border border-secondary signup_fields"
                                      name="t2Title"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>

                                  <div className="form-group col-4 mb-4">
                                    <label
                                      htmlFor="DBA"
                                      className="fw-bold fs-6">
                                      Page Footer
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control  border border-secondary signup_fields"
                                      name="t2Footer"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            case 3:
                              return (
                                <div className=" row border rounded p-2 mx-1">
                                  <div className="form-group col-6 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Background Image (size:2480 x 3508){" "}
                                    </span>
                                    <label
                                      htmlFor="t3BackImg"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      id="t3BackImg"
                                      accept="image/*"
                                      className="form-control  border border-secondary px-4"
                                      defaultValue=""
                                      name="t3ImgBack"
                                      capture
                                      onChange={(e) =>
                                        onFileSelectionImages(
                                          e,
                                          "t3ImgBack",
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="form-group col-6 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Uplaod Banners (3 Banners)
                                    </span>
                                    <label
                                      htmlFor="t3Banners"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      id="t3Banners"
                                      accept="image/*"
                                      className="form-control  border border-secondary px-4"
                                      defaultValue=""
                                      name="t3ImgBanners"
                                      multiple
                                      capture
                                      onChange={(e) =>
                                        onMultipleSelections(
                                          e,
                                          "t3ImgBanners",
                                          index
                                        )
                                      }
                                    />
                                  </div>

                                  <div className="form-group col-4 mb-4">
                                    <label className="fw-bold fs-6">
                                      Banner 1 Url
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control border border-secondary signup_fields"
                                      name="t3BannerUrl1"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>

                                  <div className="form-group col-4 mb-4">
                                    <label className="fw-bold fs-6">
                                      Banner 2 Url
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control border border-secondary signup_fields"
                                      name="t3BannerUrl2"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>
                                  <div className="form-group col-4 mb-4">
                                    <label className="fw-bold fs-6">
                                      Banner 3 Url
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control border border-secondary signup_fields"
                                      name="t3BannerUrl3"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>

                                  <div className="form-group col-4 mb-4">
                                    <label className="fw-bold fs-6">
                                      Page header
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control border border-secondary signup_fields"
                                      name="t3Header"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>
                                  <div className="form-group col-4 mb-4">
                                    <label className="fw-bold fs-6">
                                      Page Footer
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control border border-secondary signup_fields"
                                      name="t3Footer"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>
                                </div>
                              );

                            case 4:
                              return (
                                <div className=" row border rounded p-2 mx-1">
                                  <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Background Image (size:2480 x 3508){" "}
                                    </span>
                                    <label
                                      htmlFor="t4BackImg"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      id="t4BackImg"
                                      accept="image/*"
                                      className="form-control  border border-secondary px-4"
                                      defaultValue=""
                                      name="t4ImgBack"
                                      capture
                                      onChange={(e) =>
                                        onFileSelectionImages(
                                          e,
                                          "t4ImgBack",
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Product Logo (size:2480 x 3508){" "}
                                    </span>
                                    <label
                                      htmlFor="t4Logo"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      id="t4Logo"
                                      accept="image/*"
                                      className="form-control  border border-secondary px-4"
                                      defaultValue=""
                                      name="t4LogoImg"
                                      capture
                                      onChange={(e) =>
                                        onFileSelectionImages(
                                          e,
                                          "t4LogoImg",
                                          index
                                        )
                                      }
                                    />
                                  </div>

                                  <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Select Product
                                    </span>
                                    <Select
                                      name="users"
                                      options={options}
                                      value={item?.productName2 || ""}
                                      className="basic-multi-select z-3"
                                      classNamePrefix="select"
                                      onChange={(value) =>
                                        handleChange3(value, index)
                                      }
                                      onInputChange={handleInputChange}
                                      isClearable
                                      required
                                      placeholder="Type any keyword to Search Product"
                                    />
                                  </div>

                                  <div className="form-group col-4">
                                    <label htmlFor="">Select Flavour</label>
                                    <Select
                                      name="flavours"
                                      options={flavours}
                                      value={item?.flavours2 || ""}
                                      className="basic-multi-select z-3"
                                      classNamePrefix="select"
                                      onChange={(value) =>
                                        handleChangeFlavour(value, index)
                                      }
                                      isMulti
                                      isClearable
                                      required
                                      placeholder="Select 4 Flavours"
                                    />
                                  </div>

                                  <div className="form-group col-4 mb-4">
                                    <label
                                      htmlFor="DBA"
                                      className="fw-bold fs-6">
                                      Page Title
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control border border-secondary signup_fields"
                                      name="t4Header"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>

                                  <div className="form-group col-4 mb-4">
                                    <label
                                      htmlFor="DBA"
                                      className="fw-bold fs-6">
                                      Page Footer
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control border border-secondary signup_fields"
                                      name="t4Footer"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>
                                </div>
                              );
                            case 5:
                              return (
                                <div className=" row border rounded p-2 mx-1">
                                  <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Background Image (size:2480 x 3508){" "}
                                    </span>
                                    <label
                                      htmlFor="t5BackImg"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      id="t5BackImg"
                                      accept="image/*"
                                      className="form-control  border border-secondary px-4"
                                      defaultValue=""
                                      name="t5ImgBack"
                                      capture
                                      onChange={(e) =>
                                        onFileSelectionImages(
                                          e,
                                          "t5ImgBack",
                                          index
                                        )
                                      }
                                    />
                                  </div>

                                  {/* <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Uplaod Video{" "}
                                    </span>
                                    <label
                                      htmlFor="upload_video"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className={classNames(
                                        "form-control  border border-secondary px-4",
                                        { "is-invalid": errors.productImage }
                                      )}
                                      defaultValue=""
                                      name="productImage"
                                      capture
                                      {...register("productImage", {
                                        required: "Enter Product Name",
                                      })}
                                      // onChange={(e) => productImageSelection(e)}
                                    />
                                  </div>
                                  <div className="form-group col-4 mb-4">
                                    <label
                                      htmlFor="DBA"
                                      className="fw-bold fs-6">
                                      Video Url
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
                                    {errors.dba && (
                                      <small className="errorText mx-1 fw-bold">
                                        {errors.dba?.message}
                                      </small>
                                    )}
                                  </div> */}

                                  <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Uplaod Banner Image 1{" "}
                                    </span>
                                    <label
                                      htmlFor="t5Banners"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      id="t5Banners"
                                      accept="image/*"
                                      className="form-control  border border-secondary px-4"
                                      defaultValue=""
                                      name="t5BannersImg"
                                      capture
                                      onChange={(e) =>
                                        onFileSelectionImages(
                                          e,
                                          "t5BannersImg",
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="form-group col-4 mb-4">
                                    <label
                                      htmlFor="DBA"
                                      className="fw-bold fs-6">
                                      Banner 1 Url
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control border border-secondary signup_fields"
                                      name="t5BannerUrl1"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>

                                  <div className="form-group col-4 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Uplaod Banner Image 2{" "}
                                    </span>
                                    <label
                                      htmlFor="t5Banners2"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      id="t5Banners2"
                                      accept="image/*"
                                      className="form-control border border-secondary px-4"
                                      defaultValue=""
                                      name="t5BannersImg2"
                                      capture
                                      onChange={(e) =>
                                        onFileSelectionImages(
                                          e,
                                          "t5BannersImg2",
                                          index
                                        )
                                      }
                                    />
                                  </div>
                                  <div className="form-group col-4 mb-4">
                                    <label
                                      htmlFor="DBA"
                                      className="fw-bold fs-6">
                                      Banner 2 Url
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control border border-secondary signup_fields"
                                      name="t5BannersUrl2"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>

                                  <div className="form-group col-4 mb-4">
                                    <label
                                      htmlFor="DBA"
                                      className="fw-bold fs-6">
                                      Page header
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control border border-secondary signup_fields"
                                      name="t5Header"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>
                                  <div className="form-group col-4 mb-4">
                                    <label
                                      htmlFor="DBA"
                                      className="fw-bold fs-6">
                                      Page Footer
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control border border-secondary signup_fields"
                                      name="t5Footer"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>
                                </div>
                              );

                            case 6:
                              return (
                                <div className=" row border rounded p-2 mx-1">
                                  <div className="form-group col-6 choose_fileInvent position-relative mt-2">
                                    <span className="fw-bold me-2">
                                      Page Image (size:2480 x 3508){" "}
                                    </span>
                                    <label
                                      htmlFor="t6BackImg"
                                      className="inputText ms-2">
                                      <i className="fa fa-camera me-1" />
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      id="t6BackImg"
                                      accept="image/*"
                                      className="form-control  border border-secondary px-4"
                                      defaultValue=""
                                      name="t6ImgBack"
                                      capture
                                      onChange={(e) =>
                                        onFileSelectionImages(
                                          e,
                                          "t6ImgBack",
                                          index
                                        )
                                      }
                                    />
                                  </div>

                                  <div className="form-group col-6 mb-4">
                                    <label
                                      htmlFor="DBA"
                                      className="fw-bold fs-6">
                                      Page Url
                                    </label>
                                    <input
                                      type="text"
                                      className="form-control border border-secondary signup_fields"
                                      name="t6BannersUrl1"
                                      onChange={(e) => {
                                        handleChange(index, e);
                                      }}
                                    />
                                  </div>
                                </div>
                              );

                            default:
                              return null;
                          }
                        })()}

                        <div className="col-12 text-center mt-3">
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
                            type="submit"
                            onClick={(e) => {
                              AddPage(e, index, item?.template);
                            }}>
                            Submit
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="modal fade comman_modal"
              id={`staticBackdrop${index}`}
              data-bs-backdrop="static"
              data-bs-keyboard="false"
              tabIndex={-1}
              aria-labelledby="staticBackdropLabel"
              aria-hidden="true">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0">
                  <div className="modal-header">
                    <h5 className="modal-title" id="staticBackdropLabel">
                      Selected Template
                    </h5>
                    <button
                      type="button"
                      className="btn-close"
                      data-bs-dismiss="modal"
                      id="cateModal"
                      aria-label="Close"
                    />
                  </div>

                  <div className="modal-body shadow">
                    <div>
                      {(() => {
                        switch (item?.template) {
                          case 1:
                            return (
                              <Intro1
                                backImg={item?.t1ImgBack}
                                QrImage={item?.t1ImgQr}
                                header={item?.t1Title}
                              />
                            );
                          case 2:
                            return <ListingPage />;
                          case 3:
                            return <BannerDisplay1 />;
                          case 4:
                            return <ProductDetails1 />;
                          case 5:
                            return <Intro1 />;
                          case 6:
                            return <Intro1 />;

                          default:
                            return (
                              <div className=" row border rounded p-2 mx-1 text-center">
                                <label>Please Select A Template</label>
                              </div>
                            );
                        }
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CreateFlyer;
