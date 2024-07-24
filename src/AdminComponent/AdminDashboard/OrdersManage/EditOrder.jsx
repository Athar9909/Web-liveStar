import axios from "axios";import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Starlogo from "../../../assets/img/logo.png";
import ProfileBar from "../ProfileBar";
import Select from "react-select";
import Swal from "sweetalert2";
import { Button, InputNumber, Loader } from "rsuite";
import moment from "moment";

const EditOrder = () => {
  const [sideBar, setSideBar] = useState(true);
  let location = useLocation();
  const orderView = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/order/getOrderDetail`;
  const getProducts = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/singleProduct`;
  const inventorySearch = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/searchInventory`;
  const inventoryEdit = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/order/editOrder`;
  const editQuantity = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/order/editOrderItem`;
  const [editDetails, setEditDetails] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [product, setProducts] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [flavour, setFlavour] = useState();
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const [load, setLoad] = useState(false);
  const [loader, setLoader] = useState(false);
  let User = JSON.parse(localStorage.getItem("AdminData"));
  let id = location?.state?.id;
  const [options, setOptions] = useState([]);

  console.log(flavour);
  useEffect(() => {
    OrderDetails();
  }, []);

  useEffect(() => {
    createOptions();
  }, [searchKey]);

  const OrderDetails = async () => {
    await axios.post(orderView + "/" + id).then((res) => {
      setOrders(res?.data.results);
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
          setProducts(data);
          const optionList = data?.map((item, index) => ({
            value: item?._id,
            label: item?.unitName,
          }));
          setOptions(optionList);
        }
      });
  };

  const handleChange = async (i, e) => {
    setLoad(true);
    let val = e.target.value;
    console.log(orders.products[i]);
    await axios
      .post(editQuantity + "/" + id, {
        itemId: orders.products[i]._id,
        quantity: val,
      })
      .then((res) => {
        console.log(res);
        setLoad(false);
      });
  };
  const deleteChange = async (i) => {
    await axios
      .post(editQuantity + "/" + id, {
        deleteId: orders.products[i]._id,
      })
      .then((res) => {
        console.log(res);
        OrderDetails();
      });
  };

  const handleChange2 = (selected) => {
    setSelectedProduct({
      usersSelected: selected,
    });
    GetProducts(selected?.value);
  };

  const GetProducts = async (id) => {
    await axios.get(getProducts + "/" + id).then((res) => {
      console.log(res);
      setProducts(res?.data.results);
    });
  };

  console.log(flavour);
  const handleInputChange = (inputValue) => {
    setSearchKey(inputValue);
  };

  const handleEditDetails = (e, key) => {
    setEditDetails({ ...editDetails, [key]: e.target.value });
  };
  console.log(editDetails);

  const AddProduct = async (e) => {
    e.preventDefault();
    await axios
      .post(inventoryEdit + "/" + id, {
        productId: selectedProduct?.usersSelected?.value,
        quantity: quantity,
        flavour: JSON.parse(flavour),
      })
      .then((res) => {
        if (!res.data.error) {
          Swal.fire({
            title: "New Product Added!",
            icon: "success",
            confirmButtonText: "Ok",
            timer: 1000,
          });
          OrderDetails();
          setSelectedProduct({ usersSelected: null });
          setProducts([]);
          setQuantity(1);
        }
      });
  };

  const saveShipment = async () => {
    setLoader(true);
    await axios
      .post(editQuantity + "/" + id, {
        type: editDetails?.orderType,
        status: editDetails?.status,
      })
      .then((res) => {
        OrderDetails();
        setLoader(false);
        navigate(`/OrderRequest/ViewOrder/${id}`, {
          state: {
            id: id,
          },
        });
        if (!res.data.error) {
          Swal.fire({
            title: "Shipment Details Updated!",
            icon: "success",
            confirmButtonText: "Ok",
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
                    className="bg-white"
                    to="/OrderRequest"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}
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
                    className="bg-white"
                    to="/OrderRequest"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}
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
                    <i
                      style={{ position: "relative", left: "4px", top: "4px" }}
                      className="fa fa-bars"
                    ></i>
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
              <div className="row mx-0">
                <div className="col-12 design_outter_comman  shadow">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2>Edit Order Details</h2>
                    </div>

                    <div className="col-auto">
                      <button
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop65"
                        className="comman_btn2 mx-4 rounded "
                      >
                        Add More
                      </button>
                      <button
                        class="dropdown-btns comman_btn2 p-2 rounded"
                        title="Close"
                        onClick={() =>
                          navigate(`/OrderRequest/ViewOrder/${id}`, {
                            state: { id: id },
                          })
                        }
                      >
                        <i class="fa fa-close fs-5"></i>
                      </button>
                    </div>
                  </div>
                  <div className="row p-4 py-5 recent_orders_new">
                    <div className="col-12 mb-4">
                      <div className="row mx-0 border rounded py-4 px-3 position-relative border rounded mt-2">
                        <span className="small_header">Order Details</span>
                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Order Date:</span>
                            <div className="col">
                              <strong>
                                {moment(orders?.craetedAt?.slice(0, 10)).format(
                                  "MM/DD/YYYY"
                                )}
                              </strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Order Id:</span>
                            <div className="col">
                              <strong>{orders?.orderId}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Total Products:</span>
                            <div className="col">
                              <strong>{orders?.products?.length}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="col-12">
                      <form
                        className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                        action=""
                        // onSubmit={handleSubmit(onSubmit)}
                      >
                        <div className="row mx-0 border rounded pt-4 p-3 position-relative">
                          <span className="small_header">Shipment Details</span>

                          <div className="col-md-6 my-3 d-flex align-items-stretch">
                            <div className="row view-inner-box border mx-0 w-100">
                              <span>Order Type:</span>
                              <div className="col">
                                <select
                                  type="select"
                                  className="form-select"
                                  name="orderType"
                                  onChange={(e) =>
                                    handleEditDetails(e, "orderType")
                                  }
                                >
                                  <option selected="" value="">
                                    {orders?.type}-(Selected)
                                  </option>
                                  <option value="Shipment">Shipment</option>
                                  <option value="Delivery">Delivery</option>
                                  <option value="In-Store Pickup">
                                    In-Store Pickup
                                  </option>
                                  <option value="UPS">UPS</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 my-3 d-flex align-items-stretch">
                            <div className="row view-inner-box border mx-0 w-100">
                              <span>Order Status:</span>
                              <div className="col">
                                <select
                                  type="select"
                                  className="form-select"
                                  name="orderType"
                                  onChange={(e) =>
                                    handleEditDetails(e, "status")
                                  }
                                >
                                  <option selected="">
                                    {orders?.status}-(Selected)
                                  </option>
                                  <option value="ORDER PLACED">
                                    Order Placed
                                  </option>
                                  <option value="PROCESSING">Processing</option>
                                  <option value="SHIPPED">Shipped</option>
                                  <option value="DELIVERED">Delivered</option>
                                  <option value="CANCEL">Canceled</option>
                                </select>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-start">
                            <Button
                              loading={loader}
                              appearance="primary"
                              color="red"
                              className="comman_btn2 rounded "
                              onClick={saveShipment}
                            >
                              Save Details
                            </Button>
                          </div>
                        </div>
                      </form>
                    </div>

                    <div className="col-12 mb-4 ">
                      <div className="cart_table_web">
                        <div className="table-responsive border rounded">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>
                                  Items{" "}
                                  <a
                                    className="filter_table"
                                    href="javscript:;"
                                  />
                                </th>
                                <th>
                                  {load ? <Loader color="red" /> : "Quantity"}
                                </th>
                              </tr>
                            </thead>
                            <tbody className="">
                              {(orders?.products || [])?.map((item, index) => (
                                <tr className="border">
                                  <td>
                                    <div className="row align-items-center flex-lg-wrap flex-md-nowrap flex-nowrap">
                                      <div className="col-auto">
                                        <span className="cart_product">
                                          <img
                                            src={
                                              item?.flavour?._id
                                                ? item?.flavour?.flavourImage
                                                : item?.productId?.productImage
                                            }
                                            alt=""
                                          />
                                        </span>
                                      </div>
                                      <div className="col">
                                        <div className="cart_content ">
                                          <h3 className="fs-5">
                                            {item?.flavour?._id
                                              ? item?.productId?.unitName +
                                                "-" +
                                                item?.flavour?.flavour
                                              : item?.productId?.unitName}
                                          </h3>
                                          <p>
                                            Barcodes:{" "}
                                            {item?.flavour?.barcode
                                              ?.filter((itm, id) => id == 1)
                                              .map((item) => (
                                                <li>{item}</li>
                                              ))}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                    {orders?.products?.length > 1 && (
                                      <button
                                        className=" mx-4 mt-2 text-center text-danger fs-6 fw-bold bg-white"
                                        onClick={() => deleteChange(index)}
                                      >
                                        <i className="fa fa-trash"></i> Remove
                                      </button>
                                    )}
                                  </td>

                                  <td className="border rounded text-center">
                                    <span className="fs-5 p-2 rounded">
                                      <input
                                        type="tel"
                                        maxLength="4"
                                        name="price"
                                        defaultValue={item?.quantity}
                                        className="border text-center"
                                        onChange={(e) => {
                                          handleChange(index, e);
                                        }}
                                      ></input>
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
      <div
        className="modal fade comman_modal"
        id="staticBackdrop65"
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
                Add Product
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="Modal"
                aria-label="Close"
                onClick={() => {
                  setSelectedProduct({ usersSelected: null });
                  document.getElementById("modalReset").click();
                }}
              />
            </div>
            <div className="modal-body shadow">
              <form className="form-design row p-2" action="">
                <div className="form-group col-12  ">
                  <label htmlFor="">Product Name </label>
                  <Select
                    name="users"
                    options={options}
                    value={selectedProduct?.usersSelected}
                    className="basic-multi-select z-3"
                    classNamePrefix="select"
                    onChange={handleChange2}
                    onInputChange={handleInputChange}
                    isClearable
                  />
                </div>

                <div className="form-group col-6">
                  <label htmlFor="">Select Flavour </label>
                  <select
                    type="select"
                    className="form-select"
                    onChange={(e) => setFlavour(e.target.value)}
                  >
                    <option selected="" value="">
                      Select Any Flavour
                    </option>

                    {product?.type?.map((item, ind) => (
                      <option value={JSON.stringify(item)} key={ind}>
                        {item?.flavour}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group col-6 ">
                  <label htmlFor="">Product Quantity </label>
                  <input
                    type="number"
                    className=" form-select"
                    maxLength={5}
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  ></input>
                  {/* <InputNumber
                    min={1}
                    max={5}
                    value={quantity}
                    className="mt-1"
                    enableMobileNumericKeyboard
                  /> */}
                </div>
                <div className="form-group mb-0 col-12 text-center ">
                  <button className="comman_btn2" onClick={AddProduct}>
                    Save
                  </button>
                </div>
                <div className="form-group mb-0 col-12 text-center ">
                  <button
                    className="comman_btn2 d-none"
                    id="modalReset"
                    type="reset"
                  >
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

export default EditOrder;
