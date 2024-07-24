import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Starlogo from "../../../assets/img/logo.png";
import ProfileBar from "../ProfileBar";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { components } from "react-select";
import { default as ReactSelect } from "react-select";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment";

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
        <label className="mx-2 mt-2">{props.label}</label>
      </components.Option>
    </div>
  );
};
export const colourOptions = [
  { value: "Dashboard", label: "Dashboard" },
  { value: "User Management", label: "User Management" },
  {
    value: "Category Sub-Category Management",
    label: "Category & Sub Category",
  },
  { value: "Brands Management", label: "Brands Management" },
  { value: "Inventory Management", label: "Inventory Management" },
  { value: "Visitor Panel", label: "Visitor Panel" }, 
  { value: "Orders Management", label: "Orders Management" },
  { value: "Puller", label: "Pullers Management" },
  { value: "Trade", label: "TradeShow Management" },
  { value: "Gallery", label: "Gallery Management" },
  { value: "Contact", label: "Contact & Support" },
  { value: "catalog", label: "Catalog & flyer" },
  { value: "CMS", label: "CMS" },
];

const SubAdmin = () => {
  const [allSubAdmins, setAllSubAdmins] = useState([]);
  const [sideBar, setSideBar] = useState(true);
  const [selectOptions, setSelectOptions] = useState([]);
  const [selectEditOptions, setSelectEditOptions] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const addSubAdmin = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/addSubAdmin`;
  const SubAdmin = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getSubAdmins`;
  const disableAdmin = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/disableSubAdmin`;
  const EditAdmin = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/editSubAdmin`;
  const ViewAdmin = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/viewSubAdmin`;
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const [maxPage, setMaxPage] = useState(1);
  const [SubAdminId, setSubAdminID] = useState();
  const [Edit, setEdit] = useState({});
  const [EditView, setEditView] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getSubAdmins();
  }, []);
  const getSubAdmins = async () => {
    await axios.post(SubAdmin).then((res) => {
      setAllSubAdmins(res?.data.results?.subAdmins);
      setMaxPage(res?.data.results.totalPages);
    });
  };
  const onSubmit = async (data) => {
    console.log(data, selectOptions);
    if (selectOptions?.optionSelected?.length >= 1) {
      await axios
        .post(addSubAdmin, {
          fullName: data?.subAdminName?.trim(),
          email: data?.email?.trim(),
          access: (selectOptions.optionSelected || [])?.map(
            (item) => item?.value
          ),
          password: data?.password,
          type: "SubAdmin",
        })
        .then((res) => {
          if (res?.data?.message === "Sub admin created") {
            getSubAdmins();
            document.getElementById("resetF").click();
            setSelectOptions({ optionSelected: [] });
            Swal.fire({
              title: res?.data?.message,
              text: "Now you can Login as Sub-Admin..",
              icon: "success",
              confirmButtonText: "Okay",
              timer: 2000,
            });
          }
          if (res?.data?.error) {
            Swal.fire({
              title: res?.data.message,
              icon: "error",
              confirmButtonText: "ok",
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
    } else {
      Swal.fire({
        title: "Select atleast 1 Module!",
        icon: "warning",
        timer: 2000,
        confirmButtonText: "Okay",
      });
    }
  };
  const onEditSave = async (e) => {
    e.preventDefault();
    if (selectEditOptions?.optionSelected?.length >= 1) {
      await axios
        .post(EditAdmin + "/" + EditView._id, {
          fullName: Edit?.name?.trim(),
          email: Edit?.email?.trim(),
          access: (selectEditOptions.optionSelected || [])?.map(
            (item) => item?.value
          ),
          password: Edit?.password,
          type: "SubAdmin",
        })
        .then((res) => {
          if (!res.error) {
            getSubAdmins();
            document.getElementById("Modal").click();
            Swal.fire({
              title: res?.data?.message,
              timer: 2000,
              icon: "success",
              confirmButtonText: "Okay",
            });
          }
        })
        .catch((err) => {
          if (err) {
            console.log(err);
            Swal.fire({
              title: err.response?.data?.message,
              text: "",
              icon: "error",
              confirmButtonText: "ok",
            });
          }
        });
    } else {
      Swal.fire({
        title: "Select atleast 1 Module!",
        icon: "warning",
        timer: 2000,
        confirmButtonText: "Okay",
      });
    }
  };
  const handleChange = (selected) => {
    setSelectOptions({
      optionSelected: selected,
    });
  };
  const handleChangeEdit = (selected) => {
    setSelectEditOptions({
      optionSelected: selected,
    });
  };
  
  const SubAdminStatus = async (id) => {
    const { data } = await axios.post(disableAdmin + "/" + id);

    if (!data?.error) {
      getSubAdmins();
      Swal.fire({
        title: " Admin Status Changed!",
        icon: "success",
        confirmButtonText: "Ok",
      });
    }
  };

  const EditSubAdmin = async (id) => {
    setSubAdminID(id);
    await axios.post(ViewAdmin + "/" + id).then((res) => {
      let adminData = res?.data.results?.subAdmin;
      console.log(adminData);
      setEditView(adminData);
      setSelectEditOptions({
        optionSelected: adminData?.access?.map((item) => ({
          label: item,
          value: item,
        })),
      });
    });
  };

  const togglePassword = () => {
    let x = document.getElementById("floatingPassword");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
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
                    className="bg-white"
                    to="/Admin/SubAdmin"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
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
                    className="bg-white"
                    to="/Admin/SubAdmin"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
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
          <div className="row inventory-management justify-content-center">
            <div className="col-12">
              <div className="row mx-0 ">
                <div className="col-12 design_outter_comman shadow mb-4">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2> Add Sub-Admin</h2>
                    </div>
                  </div>
                  <form
                    className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between "
                    action=""
                    onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group col-4">
                      <label htmlFor="">
                        User Name{" "}
                        {errors.subAdminName && (
                          <small className="errorText mx-1 fw-bold">
                            *{errors.subAdminName?.message}
                          </small>
                        )}
                      </label>
                      <input
                        type="text"
                        className={classNames(
                          "form-control-sub border border-secondary",
                          {
                            "is-invalid": errors.subAdminName,
                          }
                        )}
                        name="subAdminName"
                        placeholder="Enter Name"
                        {...register("subAdminName", {
                          required: "User Name is required!",
                          pattern: {
                            value: /^[^*|\":<>[\]{}`\\()';@"&$]+$/,
                            message: "Special Character not allowed",
                          },
                        })}
                      />
                    </div>
                    <div className="form-group col-4 react-select">
                      <label htmlFor="">Select Module</label>
                      <ReactSelect
                        options={colourOptions}
                        isMulti
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{
                          Option,
                        }}
                        onChange={handleChange}
                        allowSelectAll={true}
                        value={selectOptions?.optionSelected}
                      />
                    </div>
                    <div
                      className="form-group col-4 
                    ">
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
                          "form-control-sub border border-secondary",
                          {
                            "is-invalid": errors.email,
                          }
                        )}
                        name="email"
                        placeholder="Enter email address"
                        {...register("email", {
                          required: false,
                          pattern: {
                            value:
                              /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: "Invalid email address",
                          },
                        })}
                      />
                    </div>
                    <div className="form-group col-4">
                      <label htmlFor="">
                        Sub-Admin Password{" "}
                        {errors.password && (
                          <small className="errorText mx-1 fw-bold">
                            *{errors.password?.message}
                          </small>
                        )}
                      </label>
                      <input
                        type="password"
                        className={classNames(
                          "form-control-sub border border-secondary",
                          {
                            "is-invalid": errors.password,
                          }
                        )}
                        name="password"
                        id="floatingPassword"
                        placeholder="************"
                        {...register("password", {
                          required: "Password is required!",
                          pattern: {
                            value:
                              /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            message:
                              "Password must be 8 characters including one uppercase letter, one special character and alphanumeric characters (ex:Starlove12@)",
                          },
                        })}
                      />
                      <span
                        onClick={togglePassword}
                        className="fa fa-fw fa-eye field-icon toggle-password3"
                      />
                    </div>
                    <div className="form-group mb-0 col-12 text-center ">
                      <button className="comman_btn" type="submit">
                        Save Admin
                      </button>
                      <button
                        className="comman_btn d-none"
                        type="reset"
                        id="resetF">
                        Reset
                      </button>
                    </div>
                  </form>
                </div>
                <div className="col-12 design_outter_comman recent_orders shadow">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2>Sub-Admin Management</h2>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-12 comman_table_design px-0">
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <thead>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                              <th>S.No.</th>
                              <th>Date</th>
                              <th>Sub-Admin Name</th>
                              <th className="text-center mx-3">Modules</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(allSubAdmins || [])?.map((item, index) => (
                              <tr key={index} className="border ">
                                <td className="border">
                                  {(activePage - 1) * 20 + (index + 1)}.
                                </td>
                                <td className="border">
                                  {moment(item?.createdAt?.slice(0, 10)).format(
                                    "MM/DD/YYYY"
                                  )}
                                </td>
                                <td className="border">{item?.fullName}</td>
                                <td className=" border ">
                                  <ol>
                                    {item?.access?.map((li, ind) => (
                                      <li key={ind}>{li}</li>
                                    ))}
                                  </ol>
                                </td>

                                <td className=" border" key={item?.status}>
                                  {" "}
                                  <div className="">
                                    <label class="switchUser">
                                      <input
                                        type="checkbox"
                                        id={index + 1}
                                        defaultChecked={item?.status}
                                        onClick={() => {
                                          SubAdminStatus(item?._id);
                                        }}
                                      />
                                      <span class="sliderUser round"></span>
                                    </label>
                                  </div>
                                </td>

                                <td>
                                  <Link
                                    data-bs-toggle="modal"
                                    data-bs-target="#staticBackdropAdmin"
                                    className="comman_btn2 text-white text-decoration-none"
                                    key={index}
                                    onClick={() => {
                                      EditSubAdmin(item?._id);
                                    }}>
                                    Edit
                                  </Link>
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
                Edit Sub-Admin
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                id="Modal"
                aria-label="Close"
                onClick={() => setSelectEditOptions(null)}
              />
            </div>
            <div className="modal-body shadow" key={EditView?.fullName}>
              <form className="form-design row p-2" action="">
                <div className="form-group col-6 w-50 ">
                  <label htmlFor="">Sub-Admin Name </label>
                  <input
                    type="text"
                    className="form-control-sub border border-secondary"
                    name="EsubAdminName"
                    defaultValue={EditView?.fullName}
                    placeholder="Enter Name"
                    onChange={(e) => setEdit({ name: e.target.value })}
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Select Module</label>
                  <ReactSelect
                    options={colourOptions}
                    isMulti
                    closeMenuOnSelect={false}
                    hideSelectedOptions={false}
                    components={{
                      Option,
                    }}
                    onChange={handleChangeEdit}
                    allowSelectAll={true}
                    value={selectEditOptions?.optionSelected}
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="">Email Address </label>
                  <input
                    type="email"
                    className="form-control-sub border border-secondary"
                    name="Eemail"
                    defaultValue={EditView?.email}
                    placeholder="Enter Product Name"
                    onChange={(e) => setEdit({ email: e.target.value })}
                  />
                </div>
                <div className="form-group col-6">
                  <label htmlFor="EditPass">Sub-Admin Password </label>
                  <input
                    type="password"
                    className="form-control-sub border border-secondary"
                    id="EditPass"
                    defaultValue={EditView?.password}
                    name="Epassword"
                    disabled
                    placeholder="********"
                    onChange={(e) => setEdit({ password: e.target.value })}
                  />
                </div>
                <div className="form-group mb-0 col-12 text-center ">
                  <button className="comman_btn2" onClick={onEditSave}>
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

export default SubAdmin;
