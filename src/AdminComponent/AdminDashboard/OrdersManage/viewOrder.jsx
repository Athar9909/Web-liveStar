import axios from "axios";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Starlogo from "../../../assets/img/logo.png";
import ProfileBar from "../ProfileBar";
import { components } from "react-select";
import moment from "moment";
// import { CSVLink, CSVDownload } from "react-csv";
import Select from "react-select";
const Option = (props) => {
  return (
    <div>
      <components.Option {...props} className="d-flex ">
        <input
          type="checkbox"
          className="border border-secondary"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label className="mx-2 mt-1">{props.label}</label>
      </components.Option>
    </div>
  );
};

const ViewOrder = () => {
  const [sideBar, setSideBar] = useState(true);
  let location = useLocation();
  const orderView = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/order/getOrderDetail`;
  const updateOrder = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/order/updateOrder`;
  const orderExport = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/order/erpOrder`;
  const orderExportXls = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/order/exportOrder`;
  const allPullers = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/allPullers`;
  const assign = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/assignPuller`;
  const [orders, setOrders] = useState([]);
  const [orderStatus, setOrderStatus] = useState();
  const [statusComment, setStatusComment] = useState("");
  const [options, setOptions] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const [selectedPuller, setSelectedPuller] = useState([]);
  const [keySort, setKeySort] = useState();
  const navigate = useNavigate();
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const [csvData, setCsvData] = useState([]);
  let { id } = useParams();
  const fileDownload = (url, name) => {
    saveAs(url, name);
  };
  // const csvData = [
  //   ["firstname", "lastname", "email"],
  //   ["Ahmed", "Tomi", "ah@smthing.co.com"],
  //   ["Raed", "Labes", "rl@smthing.co.com"],
  //   ["Yezzi", "Min l3b", "ymin@cocococo.com"],
  // ];

  useEffect(() => {
    OrderDetails();
    exportOrder();
  }, []);

  const OrderDetails = async (status, sort, scanType) => {
    setKeySort(status);
    await axios
      .post(orderView + "/" + id, {
        sortBy: sort,
        overUnderScanned: status === "overUnderScanned" ? true : false,
        outOfStock: status === "outOfStock" ? true : false,
        scanned: status === "scanned" ? true : false,
        scanType: scanType,
      })
      .then((res) => {
        setOrders(res?.data.results);
      });
  };

  const UpdateOrderStatus = async (e) => {
    e.preventDefault();
    await axios
      .post(updateOrder + "/" + id, {
        status: orderStatus ? orderStatus : orders?.status,
        statusComment: statusComment,
      })
      .then((res) => {
        if (!res?.error) {
          Swal.fire({
            title: "Order Updated!",
            icon: "success",
            button: "Okay",
          });
        }
      });
  };

  const exportOrder = async () => {
    await axios.post(orderExport + "/" + id).then((res) => {
      console.log(res);
      setCsvData(res.data.results);
    });
  };

  const exportOrderXls = async (e) => {
    e.preventDefault();
    await axios.post(orderExportXls + "/" + id).then((res) => {
      if (!res?.error) {
        fileDownload(res?.data.results?.file, orders?.orderId);
      }
    });
  };
  useEffect(() => {
    createOptions();
  }, [searchKey]);

  const createOptions = async () => {
    await axios.get(allPullers).then((res) => {
      if (!res.error) {
        let data = res?.data.results.pullers;
        const optionList = data?.map((item, index) => ({
          value: item?._id,
          label: (
            <div>
              {item?.fullName}-{item?.isPullerBusy ? "Busy" : "Available"}
            </div>
          ),
        }));
        setOptions(optionList);
      }
    });
  };

  const handleInputChange = (inputValue) => {
    console.log("lkjkl");
    setSearchKey(inputValue);
  };
  const handleChange = (selected) => {
    setSelectedPuller({
      puller: selected,
    });
  };

  const assignPuller = async (e) => {
    e.preventDefault();
    console.log(selectedPuller);
    const { data } = await axios.post(assign + "/" + orders?._id, {
      pullerId: selectedPuller?.puller?.value,
    });
    if (!data.error) {
      document.getElementById("modalP").click();
      Swal.fire({
        title: "Puller Assigned!",
        icon: "success",
        timer: 2000,
        confirmButtonText: "Okay",
      });
    } else {
      Swal.fire({
        title: "401 Error!",
        icon: "error",
        timer: 2000,
        confirmButtonText: "Okay",
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
                    }}>
                    <i
                      style={{ position: "relative", left: "4px", top: "4px" }}
                      className="fa fa-bars"></i>
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
              <div className="row mx-0 ">
                <div className="col-12 design_outter_comman  shadow">
                  <div className="row comman_header justify-content-between ">
                    <div className="col-auto">
                      <h2>Order Details</h2>
                    </div>
                    <div className="col-auto"></div>
                    <div className="col-auto">
                      {orders?.pullStatus === "Assigned" ? (
                        <button
                          class="dropdown-btns comman_btn mx-1"
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdropAdmin">
                          Puller: {orders?.puller?.fullName}{" "}
                          <i class="fas fa-user-gear"></i>
                        </button>
                      ) : (
                        <button
                          class="dropdown-btns comman_btn2 mx-1"
                          data-bs-toggle="modal"
                          onClick={() => {
                            createOptions();
                          }}
                          data-bs-target="#staticBackdropAdmin">
                          Assign Puller <i class="fas fa-user-gear"></i>
                        </button>
                      )}

                      <button
                        class="dropdown-btns comman_btn2 mx-2"
                        onClick={() =>
                          navigate("/OrderRequest/ViewOrder/Edit", {
                            state: { id: id },
                          })
                        }>
                        Edit <i class="fa fa-edit"></i>
                      </button>
                      <div class="dropdowns">
                        <button class="dropdown-btns comman_btn2 ">
                          Export <i class="fa fa-download"></i>
                        </button>
                        <div class="dropdown-contents">
                          {console.log(csvData)}
                          <a
                            target="_blank"
                            onClick={() =>
                              fileDownload(csvData?.file, orders?.orderId)
                            }>
                            Export .csv
                          </a>
                          <a href="#">
                            <Link
                              className="text-decoration-none text-dark dropdown-item"
                              onClick={exportOrderXls}>
                              Export .xls
                            </Link>
                          </a>
                          <a href="#">
                            <Link
                              className="text-decoration-none text-dark dropdown-item"
                              to={`/OrderRequest/Pdf/${id}`}
                              target="_blank"
                              rel="noopener noreferrer">
                              Export .pdf
                            </Link>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="row p-4 py-5 recent_orders_new  ">
                    <div className="col-12 mb-4 ">
                      <div className="row mx-0 border rounded py-4 px-3 position-relative">
                        <span className="small_header">Order Details</span>
                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Order Date - Time</span>

                            <div className="col">
                              <strong>
                                {" "}
                                {moment(orders?.createdAt?.slice(0, 10)).format(
                                  "MM/DD/YYYY"
                                ) +
                                  "-" +
                                  moment(orders?.createdAt).format("h:mm a")}
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
                      <div className="row mx-0 border rounded pt-4 p-3 position-relative">
                        <span className="small_header">Buyer Details</span>

                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Customer Name:</span>
                            <div className="col">
                              <strong>
                                {orders?.userId?.firstName +
                                  " " +
                                  orders?.userId?.lastName}
                              </strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Email:</span>
                            <div className="col">
                              <strong>{orders?.userId?.email}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Mobile Number:</span>
                            <div className="col">
                              <strong>{orders?.userId?.phoneNumber}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Company Name:</span>
                            <div className="col">
                              <strong>{orders?.userId?.companyName}</strong>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Shipment Location:</span>
                            <div className="col">
                              <strong>
                                {orders?.userId?.addressLine1 +
                                  "," +
                                  orders?.userId?.city +
                                  "," +
                                  orders?.userId?.state +
                                  "-" +
                                  orders?.userId?.zipcode}
                              </strong>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 my-3 d-flex align-items-stretch">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Comments(if any):</span>
                            <div className="col">
                              <strong>{orders?.comments}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 my-3 d-flex align-items-stretch ">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Order Type:</span>
                            <div className="col">
                              <strong>{orders?.type}</strong>
                            </div>
                          </div>
                        </div>

                        <div className="col-md-4 my-3 d-flex align-items-stretch ">
                          <div className="row view-inner-box border mx-0 w-100">
                            <span>Puller:</span>
                            <div className="col">
                              <strong>{orders?.puller?.fullName}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {orders?.orderedBy === "SubAcc" && (
                      <div className="col-12 mt-4">
                        <div className="row mx-0 border rounded pt-4 p-3 position-relative">
                          <span className="small_header">
                            Sub-Account Details
                          </span>

                          <div className="col-md-4 my-3 d-flex align-items-stretch">
                            <div className="row view-inner-box border mx-0 w-100">
                              <span>Order By:</span>
                              <div className="col">
                                <strong>Sub-Account</strong>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 my-3 d-flex align-items-stretch">
                            <div className="row view-inner-box border mx-0 w-100">
                              <span>Customer Name:</span>
                              <div className="col">
                                <strong>
                                  {orders?.userId?.subAccounts?.firstName}
                                </strong>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 my-3 d-flex align-items-stretch">
                            <div className="row view-inner-box border mx-0 w-100">
                              <span>Business Number:</span>
                              <div className="col">
                                <strong>
                                  {
                                    orders?.userId?.subAccounts
                                      ?.businessPhoneNumber
                                  }
                                </strong>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 my-3 d-flex align-items-stretch">
                            <div className="row view-inner-box border mx-0 w-100">
                              <span>Company Name:</span>
                              <div className="col">
                                <strong>
                                  {orders?.userId?.subAccounts?.companyName}
                                </strong>
                              </div>
                            </div>
                          </div>

                          <div className="col-md-4 my-3 d-flex align-items-stretch">
                            <div className="row view-inner-box border mx-0 w-100">
                              <span>Shipment Location:</span>
                              <div className="col">
                                <strong>
                                  {orders?.userId?.subAccounts?.addressLine1 +
                                    "," +
                                    orders?.userId?.subAccounts?.city +
                                    "," +
                                    orders?.userId?.subAccounts?.state +
                                    "-" +
                                    orders?.userId?.subAccounts?.zipcode}
                                </strong>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="col-12 mb-5 mt-3">
                      <div className="row mx-0 border rounded pt-4 p-3 position-relative">
                        <span className="small_header">
                          Customer Notification Status
                        </span>
                        <div className="col-12 Change_staus">
                          <form
                            className="form-design row align-items-end"
                            action="">
                            <div className="form-group mb-0 col">
                              <label htmlFor="">Order Status</label>
                              <select
                                className="form-select form-control"
                                aria-label="Default select example"
                                onChange={(e) => {
                                  setOrderStatus(e.target.value);
                                }}>
                                <option selected="">
                                  {orders?.status + "-" + "selected"}
                                </option>
                                <option value="ORDER PLACED">
                                  Order Placed
                                </option>
                                <option value="PROCESSING">Processing</option>
                                <option value="Picked-Up">Picked-Up</option>
                                <option value="DELIVERED">Delivered</option>
                                <option value="SHIPPED">Shipped</option>
                                <option value="CANCEL">Canceled</option>
                              </select>
                            </div>
                            {orders?.status === "SHIPPED" ||
                            orderStatus === "SHIPPED" ? (
                              <div className="form-group mb-0 col">
                                <label htmlFor="">Comment if(any)</label>
                                <textarea
                                  type="text"
                                  name="statusComment"
                                  defaultValue={orders?.statusComment}
                                  placeholder="Add your comment here."
                                  className="form-control"
                                  onChange={(e) => {
                                    setStatusComment(e.target.value);
                                  }}
                                />
                              </div>
                            ) : (
                              ""
                            )}

                            <div className="form-group mb-0 col-auto">
                              <button
                                className="comman_btn"
                                onClick={UpdateOrderStatus}>
                                Save
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>

                    <div className="col-12 mb-4">
                      <div className="cart_table_2">
                        <div className="">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>
                                  {" "}
                                  <div class="dropdowns">
                                    <button class="dropdown-btns sort_btn ">
                                      Scanned by{" "}
                                      <i class="fa-solid fa-caret-down"></i>
                                    </button>
                                    <div class="dropdown-contents DropBg">
                                      <a
                                        className="text-decoration-none text-dark "
                                        onClick={() =>
                                          OrderDetails("", 1, "qr")
                                        }>
                                        Qr Scanned
                                      </a>
                                      <a
                                        onClick={() =>
                                          OrderDetails("", -1, "manual")
                                        }
                                        className="text-decoration-none text-dark ">
                                        Manually Scanned
                                      </a>
                                    </div>
                                  </div>
                                </th>
                                <th>
                                  Items{" - "}
                                  <div class="dropdowns">
                                    <button class="dropdown-btns sort_btn ">
                                      Sort{" "}
                                      <i class="fa-solid fa-caret-down"></i>
                                    </button>
                                    <div class="dropdown-contents DropBg">
                                      <a
                                        className="text-decoration-none text-dark "
                                        onClick={() => OrderDetails("", 1)}>
                                        A to Z
                                      </a>
                                      <a
                                        onClick={() => OrderDetails("", -1)}
                                        className="text-decoration-none text-dark ">
                                        Z to A
                                      </a>
                                    </div>
                                  </div>
                                </th>
                                <th>Quantity</th>
                                <th>
                                  Pull Status{" - "}
                                  <div class="dropdowns">
                                    <button class="dropdown-btns sort_btn ">
                                      {keySort
                                        ? (keySort === "scanned" &&
                                            "Scanned") ||
                                          (keySort === "overUnderScanned" &&
                                            "Over/Under Scanned") ||
                                          (keySort === "outOfStock" &&
                                            "Out of Stock") ||
                                          (keySort === "" && "All")
                                        : "Sort"}
                                      <i class="fa-solid fa-caret-down mx-2"></i>
                                    </button>
                                    <div class="dropdown-contents DropBg">
                                      <a
                                        className="text-decoration-none text-dark "
                                        onClick={() => OrderDetails("", 1)}>
                                        All
                                      </a>
                                      <a
                                        className="text-decoration-none text-dark "
                                        onClick={() =>
                                          OrderDetails("scanned", 1)
                                        }>
                                        Scanned
                                      </a>
                                      <a
                                        onClick={() =>
                                          OrderDetails("overUnderScanned", 1)
                                        }
                                        className="text-decoration-none text-dark ">
                                        Over/Under Scanned
                                      </a>

                                      <a
                                        onClick={() =>
                                          OrderDetails("outOfStock", 1)
                                        }
                                        className="text-decoration-none text-dark ">
                                        Out of Stock
                                      </a>
                                    </div>
                                  </div>
                                </th>
                                <th>Pull Quantity</th>
                              </tr>
                            </thead>
                            {orders?.products?.length < 1 ? (
                              <tbody className="border">
                                <tr
                                  className="border"
                                  style={{
                                    width: "20rem",
                                  }}>
                                  <td>
                                    No Results -{" "}
                                    <button
                                      className="bg-primary text-white p-2 border rounded"
                                      onClick={() => {
                                        OrderDetails();
                                      }}>
                                      Refresh
                                    </button>
                                  </td>
                                  <td className="border rounded">
                                    <span className="fs-5 bg-light p-2 px-3 rounded">
                                      No Results
                                    </span>
                                  </td>
                                  <td className="border rounded">No Results</td>
                                  <td className="border rounded">
                                    <span className="fs-5 bg-light p-2 px-3 rounded">
                                      No Results
                                    </span>
                                  </td>
                                </tr>
                              </tbody>
                            ) : (
                              <tbody className="border">
                                {(orders?.products || [])?.map(
                                  (item, index) => (
                                    <tr className="border text-center mt-5">
                                      <td className="border rounded">
                                        <span className="fs-5 bg-light p-2 px-3 rounded">
                                          {item?.isDirectScanned ? (
                                            <i class="fa-solid fa-file-pen"></i>
                                          ) : (
                                            <i class="fa-solid fa-qrcode"></i>
                                          )}
                                        </span>
                                      </td>
                                      <td>
                                        <div className="row align-items-center flex-lg-wrap flex-md-nowrap flex-nowrap">
                                          <div className="col-auto">
                                            <span className="cart_product">
                                              <img
                                                src={
                                                  item?.flavour?._id
                                                    ? item?.flavour
                                                        ?.flavourImage
                                                    : item?.productId
                                                        ?.productImage
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
                                                Barcodes:
                                                {item?.flavour?.barcode
                                                  ?.filter((itm, id) => id == 1)
                                                  .map((item) => (
                                                    <li>{item}</li>
                                                  ))}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                      <td className="border rounded">
                                        <span className="fs-5 bg-light p-2 px-3 rounded">
                                          {item?.quantity}
                                        </span>
                                      </td>
                                      <td className= "border rounded">
                                        {item?.scanned === "NotScanned" ? (
                                          <span className="text-secondary  p-2 px-3 rounded bg-secondary text-white PullStatusText">
                                            Not Scanned
                                          </span>
                                        ) : (
                                          <div>
                                            {item?.scanned ===
                                              "PartlyScanned" && (
                                              <span className=" text-secondary  p-2 px-3 rounded bg-warning text-white PullStatusText">
                                                Under Scanned
                                              </span>
                                            )}
                                            {item?.scanned === "OutOfStock" && (
                                              <span className=" text-secondary  p-2 px-3 rounded bg-danger text-white PullStatusText" >
                                                Out of Stock
                                              </span>
                                            )}
                                            {item?.scanned ===
                                              "OverlyScanned" && (
                                              <span className=" text-secondary  p-2 px-3 rounded bg-primary text-white PullStatusText">
                                                Over Scanned
                                              </span>
                                            )}
                                            {item?.scanned ===
                                              "FullyScanned" && (
                                              <span className="  p-2 px-3 rounded bg-success text-white text-nowrap PullStatusText">
                                                <img
                                                  className="mx-2"
                                                  src={require("../../../assets/img/Group 427322975.png")}></img>{" "}
                                                Completely Scanned
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border rounded">
                                        <span className="fs-5 bg-light p-2 px-3 rounded">
                                          {item?.pickedQuantity}
                                        </span>
                                      </td>
                                    </tr>
                                  )
                                )}
                              </tbody>
                            )}

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
        id="staticBackdropAdmin"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-header">
              <h5 className="modal-title" id="staticBackdropLabel">
                Assign Puller
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="modalP"
                aria-label="Close"
              />
            </div>
            <div className="modal-body shadow">
              <form className="form-design row p-2" action="">
                <div className="form-group col-12">
                  <label htmlFor="">Select Puller</label>
                  <Select
                    options={options}
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={handleChange}
                    onInputChange={handleInputChange}
                    value={selectedPuller?.puller}
                  />
                </div>

                <div className="form-group mb-0 col-12 text-center ">
                  <button className="comman_btn2" onClick={assignPuller}>
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

export default ViewOrder;
