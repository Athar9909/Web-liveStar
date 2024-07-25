import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Starlogo from "../../../assets/img/logo.png";
import ProfileBar from "../ProfileBar";
import ViewProduct from "../ViewProduct";
import moment from "moment";
import { default as ReactSelect } from "react-select";
import { DatePicker, DateRangePicker } from "rsuite";
const customStyles = {
  control: (provided) => ({
    ...provided,
    minHeight: "45px",
    height: "45px",
  }),
  valueContainer: (provided) => ({
    ...provided,
    height: "45px",
    padding: "0 6px",
  }),
  input: (provided) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorsContainer: (provided) => ({
    ...provided,
    height: "45px",
  }),
};

const VisitorManagement = () => {
  const contactList = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getVisitorLog  `;
  const [sideBar, setSideBar] = useState(true);
  const navigate = useNavigate();
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const [activePage, setActivePage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const [allVisitors, setAllVisitor] = useState();
  const [logCounts, setLogCounts] = useState();
  const [selectTrainers, setSelectTrainers] = useState([]);
  const [selectedTrainers, setSelectedTrainers] = useState([]);
  const [searchKey, setSearchKey] = useState("");
  const UserSearch = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/searchUser`;
  const [searchType, setSearchType] = useState("companyName");

  useEffect(() => {
    getAllVisitors();
  }, []);

  useEffect(() => {
    if (searchKey?.length > 1) {
      userSearch();
    }
  }, [searchKey]);

  const handleInputChangePull = (inputValue) => {
    setSearchKey(inputValue);
  };

  const handleChangeDates = (values) => {
    console.log(values);
    getAllVisitors("",values);
  };

  const userSearch = async () => {
    let string = searchKey;
    const { data } = await axios.post(UserSearch, {
      type: "APPROVED",
      search: string,
      searchType: searchType,
    });
    if (data && !data.error) {
      const optionList = data.results.users?.map((item) => ({
        value: item._id,
        label: (
          <div>
            {item.firstName} - {item.companyName}
          </div>
        ),
      }));
      setSelectTrainers(optionList);
    }
  };

  const getAllVisitors = async (filterKey, dates) => {
    
    const { data } = await axios.patch(contactList, {
      page: activePage,
      visitType: filterKey,
      from: dates,
    });
    if (!data.error) {
      setAllVisitor(data.results.visitors?.usersList);
      setLogCounts(data.results.logCount);
      setMaxPage(data.results.totalPages);
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
                    className="bg-white"
                    to="/Contact&Support"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
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
                    to="/VisitorPanel"
                    className="bg-white"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}
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
                    className=""
                    to="/OrderRequest"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
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
              <div className="row ms-3 mb-4 justify-content-center">
                <div className="col-3 mb-3 d-flex align-items-stretch">
                  <Link
                    onClick={() => getAllVisitors("liveChecked")}
                    className="row dashboard_box box_design me-3 w-100"
                  >
                    <div className="col-auto px-0">
                      <span className="dashboard_icon">
                        <i
                          class="fa-regular fa-circle-dot"
                          style={{ color: "red" }}
                        ></i>
                      </span>
                    </div>
                    <div className="col pe-0">
                      <div className="dashboard_boxcontent">
                        <h2>Live Visitors</h2>
                        <span>{logCounts?.liveChecked[0]?.count}</span>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="col-3 mb-3 d-flex align-items-stretch">
                  <Link
                    onClick={() => getAllVisitors("")}
                    className="row dashboard_box box_design me-3 w-100"
                  >
                    <div className="col-auto px-0">
                      <span className="dashboard_icon">
                        <i class="fa-solid fa-clipboard-list"></i>
                      </span>
                    </div>
                    <div className="col pe-0">
                      <div className="dashboard_boxcontent">
                        <h2>Total Visitors</h2>
                        <span>{logCounts?.totalVisits[0]?.count}</span>
                      </div>
                    </div>
                  </Link>
                </div>
                <div className="col-3 mb-3 d-flex align-items-stretch">
                  <Link
                    onClick={() => getAllVisitors("CheckedIn")}
                    className="row dashboard_box box_design me-3 w-100"
                  >
                    <div className="col-auto px-0">
                      <span className="dashboard_icon">
                        <i class="fa-solid fa-spinner"></i>
                      </span>
                    </div>
                    <div className="col pe-0">
                      <div className="dashboard_boxcontent">
                        <h2>Check-Ins</h2>
                        <span>{logCounts?.checkedIn[0]?.count}</span>
                      </div>
                    </div>
                  </Link>
                </div>

                <div className="col-3 mb-3 d-flex align-items-stretch">
                  <Link
                    onClick={() => getAllVisitors("CheckedOut")}
                    className="row dashboard_box box_design me-3 w-100"
                  >
                    <div className="col-auto px-0">
                      <span className="dashboard_icon">
                        <i class="fa-solid fa-list-check"></i>
                      </span>
                    </div>
                    <div className="col pe-0">
                      <div className="dashboard_boxcontent">
                        <h2>Check-Outs</h2>
                        <span>{logCounts?.checkedOut[0]?.count}</span>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
              {/* <div
                style={{
                  position: "absolute",
                  right: "50px",
                  marginTop: "8px",
                }}
              >
                {form ? (
                  <div className="d-flex">
                    <button className="comman_btn_search ">
                      <select
                        className="searchDrop "
                        onClick={(e) => {
                          e.preventDefault();
                          setSearchType(e.target.value);
                        }}
                      >
                        <option selected="" value="companyName">
                          Company
                        </option>
                        <option value="firstName">User Name</option>
                        <option value="email">Email</option>
                        <option value="addressLine1">Address</option>
                        <option value="phoneNumber">Mobile</option>
                      </select>
                    </button>
                    <div
                      style={{ width: "300px",zIndex:"995" }}
                      className="react-select mx-2"
                    >
                      <ReactSelect
                        options={selectTrainers}
                        styles={customStyles}
                        onInputChange={handleInputChangePull}
                        onChange={handleChange}
                        isMulti
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        allowSelectAll={true}
                        value={selectedTrainers?.optionSelected}
                        blurInputOnSelect={false}
                        className="custom_select3"
                        
                      />
                    </div>
                    <div
                      onClick={() => setForm(!form)}
                      className="comman_btn2 mx-2"
                    >
                      Send
                    </div>
                    <div onClick={() => setForm(!form)} className="comman_btn2">
                      Cancel
                    </div>
                  </div>
                ) : (
                  <a
                    onClick={() => setForm(!form)}
                    className="comman_btn2 text-end"
                  >
                    Send Activation Links
                  </a>
                )}
              </div> */}
              <div className="col-12 design_outter_comman recent_orders shadow">
                <div className="row comman_header justify-content-between">
                  <div className="col-2">
                    <h2>Visitors Listings</h2>
                  </div>
                  <div className="col">
                    <DatePicker
                      placeholder="Filter by Date"
                      onChange={handleChangeDates}
                    ></DatePicker>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 comman_table_design px-0">
                    <div className="table-responsive">
                      <table className="table mb-0">
                        <thead>
                          <tr style={{ backgroundColor: "#f2f2f2" }}>
                            <th>S.No.</th>
                            <th>CheckIn</th>
                            <th>CheckOut</th>
                            <th>Company Name</th>
                            <th>Visitor Name</th>
                            <th>Phone Number</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(allVisitors || [])?.map((item, index) => (
                            <tr key={index} className=" ">
                              <td>{index + 1}</td>
                              <td className="border">
                                {moment(item?.entryDate?.slice(0, 10)).format(
                                  "MM/DD/YYYY"
                                )}{" "}
                                {item?.entryTime}
                              </td>
                              {item?.exitDate?.length ? (
                                <td className="border">
                                  {moment(item?.exitDate?.slice(0, 10)).format(
                                    "MM/DD/YYYY"
                                  )}{" "}
                                  {item?.exitTime}
                                </td>
                              ) : (
                                <td className="border">Not Checked-Out Yet</td>
                              )}

                              <td className="border">
                                {item?.user?.companyName}
                              </td>
                              <td className="border">
                                {item?.agent?.firstName}
                              </td>
                              <td className="border">
                                {item?.agent?.phoneNumber}
                              </td>

                              {/* <td>
                                <Link
                                  className="comman_btn2 text-white text-decoration-none"
                                  key={index}
                                  to={`/Puller-Management/Puller-details/${item?._id}`}
                                >
                                  View
                                </Link>
                              </td> */}
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
      <div
        className="modal fade comman_modal"
        id="staticBackdropView1"
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

export default VisitorManagement;

