import React, { useEffect, useState } from "react";import { Link, useNavigate, useParams } from "react-router-dom";
import Starlogo from "../../../assets/img/logo.png";
import ProfileBar from "../ProfileBar";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";
import { Button } from "rsuite";
import Select from "react-select";
import { components } from "react-select";
const Option = (props) => {
  const { onChange, selectProps, data, ...rest } = props;

  if (data && data.isSelectAllOption) {
    return (
      <div onClick={() => document.getElementById("checkSelect").click()}>
        <components.Option {...rest}>
          <input
            type="checkbox"
            id="checkSelect"
            checked={props.isSelected}
            onChange={() =>
              selectProps.handleSelectAll(selectProps.options, onChange)
            }
          />
          <label className="mx-2">Select All</label>
        </components.Option>
      </div>
    );
  }

  return (
    <div>
      <components.Option {...props} className="d-flex ">
        <label className="mx-2 mt-1">{props.label}</label>
      </components.Option>
    </div>
  );
};

const ViewTradeStore = () => {
  const [sideBar, setSideBar] = useState(true);
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const cityApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/cityByState`;
  const generatePass = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/generateVendorPassword`;
  const inventorySearch = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/searchInventory`;
  const getVendorApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/viewVendor`;
  const editVendor = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/editVendor`;
  const editProduct = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/editVendorProduct/`;
  const addProducts = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/addVendorProduct`;
  const getProducts = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/singleProduct`;
  const getOrders = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getTradeOrders`;
  const getProductsVendor = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getVendorProducts`;
  const exportOrdersPdfs = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/exportToPDF`;
  const deleteProductsVendor = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/deleteVendorProduct/`;
  const [edited, setEdited] = useState();
  const [editedComment, setEditedComment] = useState();
  const [editedPrice, setEditedPrice] = useState();
  const [vendorProducts, setVendorProducts] = useState([]);
  const [product, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectEditOptions, setSelectEditOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [optionsFlavour, setOptionsFlavour] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [cities, setCities] = useState([]);
  const [vendorDetails, setVendorDetails] = useState([]);
  const [activeOrders, setActiveOrders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loader, setLoader] = useState(false);
  const [activePage2, setActivePage2] = useState(1);
  const [maxPage2, setMaxPage2] = useState(1);
  const [searchType, setSearchType] = useState("vendors");
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [selected, setSelected] = useState([]);

  const navigate = useNavigate();
  let { id } = useParams();
  const [formValues, setFormValues] = useState([
    {
      productName: [],
      flavour: [],
      Quantity: [],
      comment: "",
      listingPrice: "",
    },
  ]);
  const handleClickSelect = (e, productId, id) => {
    const { checked } = e.target;
    if (checked) {
      setSelected([...selected, { productId }]);
      setIsCheck([...isCheck, productId]);
    } else {
      setSelected(selected.filter((item) => item?.productId !== productId));
      setIsCheck(isCheck.filter((item) => item !== productId));
    }
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    GetProductVendor();
    GetOrdersVendor();
  }, [activePage2]);
  useEffect(() => {
    createOptions();
  }, [searchKey]);

  console.log(formValues, "kjkjk");

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

  const GetProductVendor = async () => {
    await axios.get(getProductsVendor + "/" + id).then((res) => {
      let data = res?.data?.results.products;
      setVendorProducts(data);
    });
  };
  const GetOrdersVendor = async (key) => {
    await axios
      .patch(getOrders + "/" + id, { search: key, page: activePage2 })
      .then((res) => {
        let data = res?.data?.results.orders?.data;
        setOrders(data);
        setMaxPage2(res?.data?.results.totalPages);
      });
  };


  const GeneratePassword = async () => {
    setLoader(true);
    await axios.get(generatePass + "/" + id).then((res) => {
      if (res?.data.message === "Password generated") {
        setLoader(false);
        Swal.fire({
          title: "Password Generated Successfully",
          text: "Email has been sent!",
          icon: "success",
          showCloseButton: true,
          timer: 2000,
        });
      } else {
        setLoader(false);
      }
    });
  };

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
          }));
          setOptions(optionList);
        }
      });
  };
  console.log(options, selectedProduct, "lkjlkjklj");

  const GetProducts = async (id, index) => {
    await axios.get(getProducts + "/" + id).then((res) => {
      let data = res?.data.results;
      const selectedFlavorIds = formValues
        ?.filter((itm) => itm?.productName?.value === id)
        .flatMap((itm) => itm?.flavour?.map((flavor) => flavor.value));

      const optionList = data?.type
        ?.filter((item) => !selectedFlavorIds?.includes(item._id))
        .map((item, index) => ({
          value: item?._id,
          label: item?.flavour,
        }));
      setOptionsFlavour(optionList);

      setProducts((p) => ({ ...p, [id]: data }));
    });
  };

  const handleChange2 = (selected, index) => {
    GetProducts(selected?.value, index);
    let newFormValues = [...formValues];
    newFormValues[index].productName = selected;
    setFormValues(newFormValues);
  };

  const handleInputChange = (inputValue) => {
    setSearchKey(inputValue);
  };
  let handleChangeEdited = (selected) => {
    setSelectEditOptions({
      optionSelected: selected,
    });
  };
  let handleChangeFlavour = (selected, i) => {
    let newFormValues = [...formValues];
    newFormValues[i].flavour = selected.filter(
      (option) => !option.isSelectAllOption
    );
    setFormValues(newFormValues);
  };

  const handleSelectAll = (options, onChange) => {
    onChange(options.filter((option) => !option.isSelectAllOption));
  };

  let handleChangeComment = (e, i) => {
    let val = e.target.value;
    let newFormValues = [...formValues];
    newFormValues[i].comment = val;
    setFormValues(newFormValues);
  };
  let handleChangePrice = (e, i) => {
    let val = e.target.value;
    let newFormValues = [...formValues];
    newFormValues[i].listingPrice = val;
    setFormValues(newFormValues);
  };

  const addFormFields = (e) => {
    setFormValues([
      ...formValues,
      {
        productName: [],
        flavour: [],
        Quantity: [],
      },
    ]);
  };

  const removeFormFields = (index) => {
    let newFormValues = [...formValues];
    newFormValues?.splice(index, 1);
    setFormValues(newFormValues);
  };

  // const handleInputChange = (inputValue) => {
  //   createOptions(inputValue);
  // };

  useEffect(() => {
    getVendor();
    GetOrdersVendor();
  }, []);

  const getVendor = async () => {
    await axios.get(getVendorApi + "/" + id).then((res) => {
      setVendorDetails(res?.data.results?.vendor);
      let data = res?.data.results?.vendor;
      let defaultValue = {};
      defaultValue.companyName = data?.companyName;
      defaultValue.address = data?.address;
      defaultValue.email = data?.email;
      defaultValue.representative = data?.repsresentative;

      defaultValue.zipcode = data?.zipcode;
      defaultValue.phoneNumber = data?.phoneNumber;
      reset({ ...defaultValue });
    });
  };

  console.log(files);

  const onSubmit = async (data) => {
    let formData = new FormData();
    formData.append("companyName", data?.companyName?.trim());
    formData.append("address", data?.address);
    formData.append("city", data?.city ?? vendorDetails?.city);
    formData.append("state", data?.state ?? vendorDetails?.state);
    formData.append("zipcode", data?.zipcode);
    formData.append("countryCode ", "+1");
    formData.append("email", data?.email?.trim());
    formData.append("phoneNumber", data?.phoneNumber?.trim());
    formData.append("password", data?.password?.trim());
    formData.append("image", files?.imageProfile);
    formData.append("repsresentative", data?.representative?.trim());

    await axios
      .put(editVendor + "/" + id, formData)
      .then((res) => {
        if (res?.data?.message === "Vendor edited") {
          getVendor();
          setFiles([]);
          // navigate("/Puller-Management");
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

  const saveProducts = async () => {
    let products = [];

    formValues?.map((itm) => {
      products.push({
        productId: itm?.productName.value,
        flavours: itm?.flavour?.map((items) => items?.value),
        promoComment: itm?.comment,
        listingPrice: itm?.listingPrice,
      });
    });

    await axios
      .post(addProducts, {
        vendorId: id,
        products: products,
      })
      .then((res) => {
        if (res?.data?.message === "Product added") {
          getVendor();
          GetProductVendor();
          setSelectedProduct([]);
          setFormValues([
            {
              productName: [],
              flavour: [],
              Quantity: [],
              comment: "",
            },
          ]);
          setFiles([]);
          // navigate("/Puller-Management");
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

  console.log(selectEditOptions);

  const deleteProd = async (pid) => {
    await axios
      .get(deleteProductsVendor + pid)
      .then((res) => {
        if (!res?.data?.error) {
          Swal.fire({
            title: res?.data.message,
            icon: "success",
            confirmButtonText: "okay",
            timer: 2000,
          });
          GetProductVendor();
        }
      })
      .catch((err) => {
        if (err) {
          Swal.fire({
            title: "Error",
            text: "",
            icon: "error",
            confirmButtonText: "ok",
            timer: 2000,
          });
        }
      });
  };
  const editVendorProd = async (e) => {
    e.preventDefault();

    await axios
      .patch(editProduct + edited?._id, {
        flavours: selectEditOptions?.optionSelected?.map(
          (items) => items?.value
        ),
        promoComment: editedComment,
        listingPrice: editedPrice,
      })
      .then((res) => {
        if (res?.data?.message === "Product added") {
          document.getElementById("modalP").click();
          getVendor();
          GetProductVendor();
          setSelectedProduct([]);
          setFormValues([
            {
              productName: [],
              flavour: [],
              Quantity: [],
              comment: "",
            },
          ]);
          setFiles([]);
          // navigate("/Puller-Management");
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

  const exportOrdersPdf = async (e) => {
    // e.preventDefault();
    if (selected?.length) {
      const { data } = await axios.patch(exportOrdersPdfs, {
        productIds: selected?.map((item) => item.productId),
      });
      if (!data.error) {
        // setOrderPdfData(data.results?.orders);
        navigate("/TradeOrderRequest/MultiplePdf", {
          state: data.results?.orders,
        });
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
                    className="bg-white"
                    to="/Puller-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-user-cog"
                    ></i>{" "}
                    Puller Management
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
                    to="/Admin/SubAdmin"
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
              <div className="col-12  d-flex align-items-stretch"></div>

              <div className="row mx-0">
                <div className="col-12 design_outter_comman recent_orders shadow">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2 className="main_headers">Store Details</h2>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 p-4 Pending-view-main">
                      <form
                        className="row py-2 form-design"
                        autoComplete="off"
                        onSubmit={handleSubmit(onSubmit)}
                      >
                        <div
                          className="col-4 text-center mb-4 bg-light p-3 border rounded"
                          style={{ height: "150px" }}
                        >
                          <div className="form-group col-auto">
                            <div className="account_profile position-relative d-inline-block">
                              <div className="mb-2 Pending-view_img">
                                <img
                                  className="UserImage"
                                  id="image"
                                  src={vendorDetails?.image}
                                  alt="Upload Image ........"
                                  width={100}
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
                        <div className="form-group col-4 mb-0 mb-4">
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
                              required: "Company Name is required!",
                            })}
                          />
                        </div>

                        <div className="form-group col-4 mb-0 mb-4">
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
                              required: "Vendor Name is required!",
                            })}
                          />
                        </div>
                        <div
                          className="form-group col-4 mb-5 
                    "
                        >
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

                        <div className="form-group col-4 mt-2">
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
                        <div className="form-group col-4 mt-2">
                          <label htmlFor="">
                            Set New Password{" "}
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

                        <div className="form-floating col-4 mb-4 mt-3 select_dropdown ">
                          <select
                            className={classNames(
                              "form-select border border-secondary signup_fields fw-bolder mt-1",
                              { "is-invalid": errors.state }
                            )}
                            id="floatingSelect1"
                            aria-label="Floating label select example"
                            name="state"
                            {...register("state", {
                              required: "State is Required*",
                              onChange: (e) => {
                                handleCities(e.target.value);
                              },
                            })}
                          >
                            <option value="">Select a state/province...</option>
                            <option value={vendorDetails?.state} selected>
                              {vendorDetails?.state}
                            </option>
                            <option value="Alabama">Alabama</option>
                            <option value="Alaska">Alaska</option>
                            <option value="American Samoa">
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
                            <option value="North Carolina">
                              North Carolina
                            </option>
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
                            <option value="South Carolina">
                              South Carolina
                            </option>
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
                            <option value="Virgin Islands">
                              Virgin Islands
                            </option>
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

                        <div className="form-floating col-4 mb-4 mt-3 select_dropdown ">
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
                            <option value={vendorDetails?.city} selected>
                              {vendorDetails?.city ?? "City not selected"}
                            </option>
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

                        <div className="form-group col-4">
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

                        <div className="form-group col-12">
                          <label htmlFor="">ShopLink </label>
                          <Link
                            className="text-primary"
                            target="_blank"
                            to={{
                              pathname: `/orderform/${vendorDetails?.email}`,
                            }}
                            onClick={() => {
                              localStorage.setItem("Vendorkey", "Verified");
                            }}
                          >
                            https://www.starimporters.com/orderform/
                            {vendorDetails?.email}
                          </Link>
                        </div>
                        <div className="col-12 text-center">
                          <Button
                            // loading={loader}
                            style={{
                              backgroundColor: "#eb3237",
                              fontSize: "20px",
                              position: "relative",
                              top: "-2px",
                            }}
                            appearance="primary"
                            className="comman_btn2 mx-2"
                            type="submit"
                          >
                            Save Changes
                          </Button>
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
                            onClick={() => GeneratePassword()}
                          >
                            Generate Password
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row mx-0">
                <div className="col-12 design_outter_comman recent_orders shadow">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2 className="main_headers">Store Products</h2>
                    </div>
                  </div>
                  <div className="row">
                    <div className=" p-4 Pending-view-main">
                      <form className=" ">
                        <div className="row flavour_box align-items-end mx-0 py-3 px-4">
                          {(formValues || [])?.map((item, index) => (
                            <div className="form-group mb-0 col-12 border rounded p-3 mb-2">
                              <div className="row" key={index}>
                                <div className="form-group col-3">
                                  <label htmlFor="">Select Product</label>
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
                                    placeholder="Type any keyword to Search Product"
                                  />
                                </div>
                                <div className="form-group col-3">
                                  <label htmlFor="">Select Flavors</label>
                                  <Select
                                    name="users"
                                    options={[
                                      {
                                        value: "selectAll",
                                        label: "Select All",
                                        isSelectAllOption: true,
                                      },
                                      ...optionsFlavour,
                                    ]}
                                    value={item?.flavour || ""}
                                    className="basic-multi-select z-3"
                                    classNamePrefix="select"
                                    onChange={(value) =>
                                      handleChangeFlavour(value, index)
                                    }
                                    // onInputChange={handleInputChange}
                                    isClearable
                                    components={{
                                      Option: (props) => (
                                        <Option
                                          {...props}
                                          onChange={(value) =>
                                            props.selectProps.onChange(value)
                                          }
                                          selectProps={{
                                            handleSelectAll,
                                            options: optionsFlavour,
                                          }}
                                        />
                                      ),
                                    }}
                                    allowSelectAll={true}
                                    required
                                    isMulti
                                    placeholder="Choose Flavors"
                                  />
                                </div>
                                <div className="form-group col-3">
                                  <label htmlFor="">Promotional Comment</label>
                                  <input
                                    type="text"
                                    className={classNames(
                                      "form-control border border-secondary"
                                    )}
                                    name="promotion"
                                    value={item?.comment || ""}
                                    placeholder="Enter Comment "
                                    onChange={(value) =>
                                      handleChangeComment(value, index)
                                    }
                                  />
                                </div>
                                <div className="form-group col-2">
                                  <label htmlFor="">Listing Price</label>
                                  <input
                                    type="text"
                                    className={classNames(
                                      "form-control border border-secondary"
                                    )}
                                    name="price"
                                    value={item?.listingPrice || ""}
                                    placeholder="$"
                                    onChange={(value) =>
                                      handleChangePrice(value, index)
                                    }
                                  />
                                </div>

                                <div className="form-group col-1  rmv_btn">
                                  <button
                                    className="comman_btn "
                                    type="button"
                                    disabled={
                                      formValues?.length <= 1 ? true : false
                                    }
                                    onClick={() => removeFormFields(index)}
                                  >
                                    <i className="fa fa-minus mt-1 mx-1" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="form-group  col-12 text-center mb-3 mb-0">
                            <button
                              className="comman_btn add_btn"
                              type="button"
                              onClick={() => addFormFields()}
                            >
                              <i className="fa fa-plus mt-1 mx-1" /> Add More
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="col-12 text-center mb-2">
                      <Button
                        // loading={loader}
                        style={{
                          backgroundColor: "#eb3237",
                          fontSize: "20px",
                          position: "relative",
                          top: "-2px",
                        }}
                        appearance="primary"
                        className="comman_btn2 mx-2"
                        onClick={() => saveProducts()}
                      >
                        Save Products
                      </Button>
                    </div>

                    <div className="col-12 design_outter_comman  shadow bg-light border">
                      <div className="row">
                        <div className="col-12 user-management-tabs px-0">
                          <div className="col-12 mb-4">
                            <div className="cart_table\s">
                              <div className="table-responsive">
                                <table className="table puller_table">
                                  <thead>
                                    <tr className="">
                                      <th>Image</th>
                                      <th>Product Name</th>
                                      <th>Flavors</th>
                                      <th>Promotions</th>
                                      <th>Listing Price</th>
                                      <th>ACTION</th>
                                    </tr>
                                  </thead>

                                  <tbody className="border">
                                    {vendorProducts?.map((itm, id) => (
                                      <tr className="border">
                                        <td className="text-center">
                                          <span className="cart_content border text-center mt-2">
                                            <img
                                              width={120}
                                              src={
                                                itm?.productId?.productImage
                                                  ?.length > 2
                                                  ? itm?.productId?.productImage
                                                  : require("../../../assets/img/product.jpg")
                                              }
                                              alt=""
                                            />
                                          </span>
                                        </td>
                                        <td className="border text-center  align-middle">
                                          {itm?.productId?.unitName}
                                        </td>
                                        <td className="border text-center  align-middle">
                                          <ol>
                                            {itm?.productId?.type?.map(
                                              (itms, id) => (
                                                <li>{itms?.flavour}</li>
                                              )
                                            )}
                                          </ol>
                                        </td>
                                        <td className="border text-center  align-middle">
                                          {itm?.promoComment}
                                        </td>
                                        <td className="border text-center  align-middle">
                                          {itm?.listingPrice}
                                        </td>
                                        <td className="border text-center  align-middle">
                                          <button
                                            className="comman_btn"
                                            data-bs-toggle="modal"
                                            data-bs-target="#staticBackdropAdmin"
                                            onClick={() => {
                                              setSelectEditOptions({
                                                optionSelected:
                                                  itm?.productId?.type?.map(
                                                    (item) => ({
                                                      label: item.flavour,
                                                      value: item._id,
                                                    })
                                                  ),
                                              });
                                              setEdited(itm);
                                              setEditedPrice(itm?.listingPrice);
                                              setEditedComment(
                                                itm?.promoComment
                                              );
                                              GetProducts(itm?.productId?._id);
                                            }}
                                          >
                                            Edit
                                          </button>

                                          <button
                                            className="comman_btn2 mx-2"
                                            onClick={() => {
                                              deleteProd(itm?._id);
                                            }}
                                          >
                                            Delete
                                          </button>
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

              <div className="row mx-0">
                <div className="col-12 design_outter_comman recent_orders shadow">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2 className="main_headers">Orders</h2>
                    </div>
                    <div className="col-6 text-end">
                      <form className="form-design" action="">
                        <div className="form-group mb-0 position-relative icons_set">
                          <div className="d-flex w-100">
                            <input
                              type="text"
                              className="form-control bg-white  mx-2"
                              placeholder="Search by Company Name"
                              name="name"
                              id="Search"
                              onChange={(e) => {
                                GetOrdersVendor(e.target.value);
                              }}
                            />

                            <a
                              className="comman_btn2 mx-1 d-flex "
                              onClick={() => exportOrdersPdf()}
                            >
                              .Pdf
                            </a>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-12 design_outter_comman  shadow">
                      <div className="row">
                        <div className="col-12 user-management-tabs px-0">
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
                                                <th>COMPANY NAME</th>
                                                <th>DATE & TIME</th>
                                                <th>EMAIL</th>
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
                                                    <td className="border text-center">
                                                      <div className="cart_content border text-center mt-2">
                                                        {item?.companyName}
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
                                                    <td className="border rounded ">
                                                      <span className="fs-5 text-secondary  p-2 px-3 rounded">
                                                        {item?.email}
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
                                                : setActivePage2(
                                                    activePage2 - 1
                                                  )
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
                                                : setActivePage2(
                                                    activePage2 + 1
                                                  )
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
      </div>

      <div
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
                Edit Products
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="modalP"
                aria-label="Close"
                onClick={() => {
                  document.getElementById("comment").value = "";
                  document.getElementById("Price").value = "";
                }}
              />
            </div>
            <div className="modal-body shadow">
              <form className="form-design row p-2" action="">
                <div className="form-group col-12"></div>
                {console.log(edited, "okajhh")}
                <div className="form-group col-12">
                  <label htmlFor="">Select Product</label>
                  <input
                    className="form-control"
                    id="selectedProdu"
                    defaultValue={edited?.productId?.unitName || ""}
                    disabled={true}
                  ></input>
                </div>
                {console.log(optionsFlavour, "k.k;k;")}
                <div className="form-group col-12">
                  <label htmlFor="">Select Flavors</label>
                  <Select
                    name="users"
                    options={optionsFlavour}
                    hideSelectedOptions={false}
                    // value={item?.flavour || ""}
                    className="basic-multi-select z-3"
                    classNamePrefix="select"
                    onChange={handleChangeEdited}
                    // onInputChange={handleInputChange}
                    isClearable
                    components={{
                      Option: (props) => (
                        <Option
                          {...props}
                          onChange={(value) =>
                            props.selectProps.onChange(value)
                          }
                          selectProps={{
                            handleSelectAll,
                            options: optionsFlavour,
                          }}
                        />
                      ),
                    }}
                    isMulti
                    allowSelectAll={true}
                    value={selectEditOptions?.optionSelected}
                  />
                </div>
                <div className="form-group col-12">
                  <label htmlFor="">Promotional Comment</label>
                  <input
                    key={edited}
                    id="comment"
                    type="text"
                    className={classNames(
                      "form-control border border-secondary"
                    )}
                    name="promotion"
                    value={editedComment}
                    placeholder="Enter Comment "
                    onChange={(e) => setEditedComment(e.target.value)}
                  />
                </div>
                <div className="form-group col-12">
                  <label htmlFor="">List Price</label>
                  <input
                    key={edited}
                    id="Price"
                    type="text"
                    className={classNames(
                      "form-control border border-secondary"
                    )}
                    name="price"
                    value={editedPrice}
                    placeholder="Enter Price "
                    onChange={(e) => setEditedPrice(e.target.value)}
                  />
                </div>
                <div className="form-group mb-0 col-12 text-center ">
                  <button
                    className="comman_btn2"
                    onClick={(e) => editVendorProd(e)}
                  >
                    Save
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

export default ViewTradeStore;
