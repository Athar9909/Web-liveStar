import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Starlogo from "../../../assets/img/logo.png";
import ProfileBar from "../ProfileBar";
import ViewProduct from "../ViewProduct";
import moment from "moment";
import UserGuide from "./UserGuide";

const ContactSupport = () => {
  const contactList = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getAllContacts `;
  const newsLetterList = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/activeNewsLetterUsers`;
  const newsLetterExport = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/exportNewsLetter`;
  const [contacts, setContacts] = useState([]);
  const [newsLetters, setNewsLetter] = useState([]);
  const [sideBar, setSideBar] = useState(true);
  const [values, setValues] = useState({ from: "", to: "" });
  const navigate = useNavigate();
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const [activePage, setActivePage] = useState(1);
  const [activePage2, setActivePage2] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [maxPage2, setMaxPage2] = useState(1);
  const [wrap, setWrap] = useState();
  useEffect(() => {
    getAllContacts();
    getAllNewsLetter();
  }, [activePage, activePage2]);

  const getAllContacts = async () => {
    const { data } = await axios.post(contactList, { page: activePage });
    if (!data.error) {
      setContacts(data.results.queries);
      setMaxPage(data.results.totalPages);
    }
  };

  const getAllNewsLetter = async () => {
    const { data } = await axios.post(newsLetterList, {
      page: activePage2,
    });
    if (!data.error) {
      setNewsLetter(data.results.users);
      setMaxPage2(data.results.totalPages);
    }
  };
  const ExportLetters = async () => {
    const { data } = await axios.get(newsLetterExport);
    if (!data.error) {
      // let fileContent = data?.results?.file;
      // const blob = new Blob([fileContent], { type: "text/plain" });

      const blobURL = data?.results?.file;
      const link = document.createElement("a");
      link.href = blobURL;
      link.download = "example.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobURL);
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
                    className="bg-white"
                    to="/Contact&Support"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
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
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}>
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
                    className="bg-white"
                    to="/Contact&Support"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
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
                            Contact Us
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
                            Newsletter Subscription{" "}
                            <i
                              onClick={() => ExportLetters()}
                              class="fa-solid fa-file-export"></i>
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
                            User Help & Guide
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
                            <div className="col-12">
                              {/* <form
                                className="form-design py-4 px-3 help-support-form row align-items-end "
                                action=""
                              >
                                <div className="form-group mb-0 col-5">
                                  <label htmlFor="">From</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="from"
                                    id="orderFrom"
                                    value={values.from}
                                    onChange={handleDate}
                                  />
                                </div>
                                <div className="form-group mb-0 col-5">
                                  <label htmlFor="">To</label>
                                  <input
                                    type="date"
                                    className="form-control"
                                    name="to"
                                    id="orderTo"
                                    value={values.to}
                                    onChange={handleDate}
                                  />
                                </div>
                                <div className="form-group mb-0 col-auto text-center">
                                  <button
                                    className="comman_btn rounded"
                                    // onClick={}
                                  >
                                    Search
                                  </button>
                                </div>
                              </form> */}

                              <div className="row recent_orders_order">
                                <div className="col-12 comman_table_design px-0">
                                  <div className="table-responsive">
                                    <table className="table mb-0">
                                      <thead>
                                        <tr
                                          style={{
                                            backgroundColor: "#f2f2f2",
                                          }}>
                                          <th>Date</th>
                                          <th>Name</th>
                                          <th>Email</th>
                                          <th>Subject</th>
                                          <th>Message(Query)</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {(contacts || [])?.map(
                                          (item, index) => (
                                            <tr key={index}>
                                              <td>
                                                {moment(
                                                  item?.createdAt?.slice(0, 10)
                                                ).format("MM/DD/YYYY")}
                                              </td>
                                              <td>{item?.fullName}</td>

                                              <td>{item?.email}</td>
                                              <td>{item?.subject}</td>
                                              <td className="border text_area ">
                                                {wrap === item?._id ? (
                                                  <>
                                                    {item?.messageTextArea} ....
                                                    <a
                                                      className="text-primary"
                                                      onClick={() => setWrap()}>
                                                      read less
                                                    </a>
                                                  </>
                                                ) : (
                                                  <>
                                                    {item?.messageTextArea?.slice(
                                                      0,
                                                      250
                                                    )}

                                                    <a
                                                      className="text-primary text-decoration-none"
                                                      onClick={() =>
                                                        setWrap(item?._id)
                                                      }>
                                                      ....read more
                                                    </a>
                                                  </>
                                                )}
                                              </td>

                                              {/* <td>
                                                <button
                                                  className="comman_btn table_viewbtn"
                                                  onClick={() => {
                                                    navigate(
                                                      "/OrderRequest/ViewOrder",
                                                      {
                                                        state: {
                                                          id: item?._id,
                                                        },
                                                      }
                                                    );
                                                  }}
                                                >
                                                  View
                                                </button>
                                              </td> */}
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                  {contacts?.length ? (
                                    <div className="col-11 d-flex justify-content-between py-2 mx-5">
                                      <span className="totalPage">
                                        Total Pages : {maxPage}
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
                                            }>
                                            «<small>prev</small>
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
                                            }>
                                            <small>next</small>»
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  ) : null}
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
                            <div className="col-12">
                              <div className="row recent_orders_order  ">
                                <div className="col-12 comman_table_design px-0">
                                  <div className="table-responsive">
                                    <table className="table mb-0">
                                      <thead>
                                        <tr
                                          style={{
                                            backgroundColor: "#f2f2f2",
                                          }}>
                                          <th>User Name</th>
                                          <th>Mobile Number</th>
                                          <th>Email</th>
                                          <th>Address</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {(newsLetters || [])?.map(
                                          (item, index) => (
                                            <tr key={index}>
                                              <td>{item?.firstName}</td>
                                              <td>{item?.phoneNumber}</td>
                                              <td>{item?.email}</td>
                                              <td>
                                                {item?.city +
                                                  "-" +
                                                  item?.zipcode}
                                              </td>
                                              {/* <td>
                                                <button
                                                  className="comman_btn table_viewbtn"
                                                  onClick={() => {
                                                    navigate(
                                                      "/UserManage/ApprovedView",
                                                      {
                                                        state: {
                                                          id: item?._id,
                                                        },
                                                      }
                                                    );
                                                  }
                                                }
                                                >
                                                  View
                                                </button>
                                              </td> */}
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                  {newsLetters?.length ? (
                                    <div className="col-11 d-flex justify-content-between py-2 mx-5">
                                      <span className="totalPage">
                                        Total Pages : {maxPage2}
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
                                            «<small>prev</small>
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
                                            <small>next</small>»
                                          </a>
                                        </li>
                                      </ul>
                                    </div>
                                  ) : null}
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
                            <UserGuide />
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
        id="staticBackdropView1"
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
              />
            </div>
            <div className="modal-body shadow">
              <ViewProduct />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSupport;
