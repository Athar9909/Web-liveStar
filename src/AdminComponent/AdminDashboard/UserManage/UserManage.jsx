import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "../../../assets/css/adminMain.css";
import { Button } from "rsuite";
// Default CSS
import "rsuite/dist/rsuite.min.css";
import Starlogo from "../../../assets/img/logo.png";
import { BiEdit } from "react-icons/bi";
import { useEffect } from "react";
import axios from "axios";
import ProfileBar from "../ProfileBar";
import Swal from "sweetalert2";
import moment from "moment";
import { pageUserData } from "../../../atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { useForm } from "react-hook-form";

const UserManage = () => {
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/allUsersList`;
  const uploadUrl = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/importUsers`;
  const userStatus = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/userStatus`;
  const genCrendentials = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/sendUsersCredentials`;
  const totalUser = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/usersCount`;
  const searchUser = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/searchUser`;
  const sendMail = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/sendAgentActivationMail`;

  const [values, setValues] = useState({ from: "", to: "" });
  const [search, setSearch] = useState();
  const [searchTerm, setSearchTerm] = useState("");
  const [impFile, setImpFile] = useState([]);
  const [usersTotal, setUsersTotal] = useState([]);
  const [ux, setUx] = useState(false);
  const [um, setUm] = useState(false);
  const [sideBar, setSideBar] = useState(true);
  const [uploadError, setUploadError] = useState("");
  const [pendingUsers, setPendingUsers] = useState([]);
  const [approvedUsers, setApprovedUsers] = useState([]);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [set, setSet] = useState(true);
  const [loader, setLoader] = useState(false);
  const importInput = document.getElementById("fileID");
  const [crenditials, setCrenditials] = useState([]);
  const [errEmails, setErrorEmails] = useState([]);
  const [activePendingPage, setActivePendingPage] = useState(1);
  const [activeReturnedPage, setActiveReturnedPage] = useState(1);
  const [maxAppPage, setMaxAppPage] = useState(1);
  const [maxPenPage, setMaxPenPage] = useState(1);
  const [maxRetPage, setMaxRetPage] = useState(1);
  const [searchType, setSearchType] = useState("companyName");
  const [userType, setUserType] = useState("APPROVED");
  const pageData = useRecoilValue(pageUserData);
  const setPageData = useSetRecoilState(pageUserData);
  const [activeApprovePage, setActiveApprovePage] = useState(pageData[0]?.page);
  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm();

  useEffect(() => {
    GetUserCount();
    getPendingUser();
    getRejectedUser();
    pageData[0]?.searchKey
      ? userSearch(pageData[0]?.searchKey)
      : getApprovedUser();
  }, [activeApprovePage, activePendingPage, activeReturnedPage]);

  const onFileSelection = (e) => {
    let file = e.target.files[0];
    setImpFile(file);
    setUx(true);
  };

  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");
  let User = JSON.parse(localStorage.getItem("AdminData"));

  const userSearch = async (key) => {
    let string = key;
    setSearch(key);
    if (string !== "") {
      await axios
        .post(searchUser, {
          type: userType,
          search: string,
          searchType: searchType,
        })
        .then((res) => {
          if (!res.error) {
            setApprovedUsers(res?.data.results.users);
            setPendingUsers(res?.data.results.users);
            setRejectedUsers(res?.data.results.users);
            // setActiveApprovePage(1);
          }
        });
    } else {
      getApprovedUser();
      getPendingUser();
      getRejectedUser();
    }
  };
  const sendActivation = async (ids) => {
    const { data } = await axios.patch(sendMail, {
      user: [ids],
    });
    if (!data.error) {
      Swal.fire({
        title: "Mail Sent!",
        icon:"success",
        timer: 500,
      });
    }
  };
  const sorting = async (i) => {
    await axios
      .post(apiUrl, {
        type: "PENDING",
        sortBy: i,
        page: activePendingPage,
      })
      .then((res) => {
        setPendingUsers(res.data.results.usersList);
      });
    await axios
      .post(apiUrl, {
        type: "APPROVED",
        sortBy: i,
        page: activeApprovePage,
      })
      .then((res) => {
        setApprovedUsers(res?.data.results.usersList);
      });
    await axios
      .post(apiUrl, {
        type: "REJECTED",
        sortBy: i,
        page: activeReturnedPage,
      })
      .then((res) => {
        setRejectedUsers(res?.data.results.usersList);
      });
  };

  const getPendingUser = async () => {
    const res = await axios.post(apiUrl, {
      type: "PENDING",
      page: activePendingPage,
    });
    setMaxPenPage(res?.data.results.totalPages);
    setPendingUsers(res.data.results.usersList);
    return res.data;
  };

  const getApprovedUser = async () => {
    const res = await axios.post(apiUrl, {
      type: "APPROVED",
      page: activeApprovePage,
    });
    setApprovedUsers(res?.data.results.usersList);
    setMaxAppPage(res?.data.results.totalPages);
  };

  const getRejectedUser = async () => {
    const res = await axios.post(apiUrl, {
      type: "REJECTED",
      page: activeReturnedPage,
    });
    setRejectedUsers(res.data.results.usersList);
    setMaxRetPage(res?.data.results.totalPages);
    return res.data;
  };

  const GetUserCount = async () => {
    await axios.get(totalUser).then((res) => {
      setUsersTotal(res?.data.results);
    });
  };

  const onUpload = async () => {
    setLoader(true);
    const formData = new FormData();
    formData.append("csvFilePath", impFile);
    await axios
      .post(uploadUrl, formData)
      .then((res) => {
        console.log(res);
        if (res.data.error) {
          setUploadError(res?.data.message);
          setLoader(false);
          Swal.fire({
            title: "Error in file",
            text: res?.data.message,
            icon: "error",
            button: "ok",
          });
        }
        if (res?.data.message === "Imported details") {
          setSet(!set);
          setUm(true);
          setLoader(false);
          setCrenditials(res?.data.results?.userNameAndPassword);
        }
        if (res?.data.message === "Duplicte email OR Already Registered") {
          setUm(true);
          setErrorEmails(res?.data.results);
          setLoader(false);
        }
      })
      .catch((err) => {
        setLoader(false);
        if (err) {
          Swal.fire({
            title: "Error in file",
            icon: "error",
            button: "ok",
          });
        }
      });
    document.getElementById("reUpload").hidden = false;
    setTimeout(() => {
      setLoader(false);
    }, [6000]);
  };

  const modalClose = () => {
    window.location.reload(false);
  };

  const handleClick = () => {
    localStorage.removeItem("AdminData");
    localStorage.removeItem("AdminLogToken");
    localStorage.removeItem("AdminEmail");
  };

  const handleDate = (e) => {
    const value = e.target.value;
    setValues({
      ...values,
      [e.target.name]: value,
    });
  };

  const onPendingView = (index) => {
    localStorage.setItem("objectId", pendingUsers[index]?._id);
  };

  const onReturnedView = (index) => {
    localStorage.setItem("objectId", rejectedUsers[index]?._id);
  };

  const onApprovedView = (index) => {
    localStorage.setItem("objectId", approvedUsers[index]?._id);
    // setStatsIndex(approvedUsers[index]?._id);
  };

  const UserStatus = async (id) => {
    await axios.post(userStatus + "/" + id).then((res) => {
      if (!res?.data.error) {
        Swal.fire({
          title: res?.data.message,
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    });
  };

  const GenerateCrendential = async () => {
    await axios
      .post(genCrendentials, {
        credentials: crenditials,
      })
      .then((res) => {
        if (res?.data.message === "Credentials Sent Successfully") {
          document.getElementById("modal-toggle87").click();
        }
      });
  };

  return (
    <div className={sideBar ? "  admin_main" : "row expanded_main"}>
      <div className="">
        <div className={sideBar ? " siderbar_section" : "d-none"}>
          <div className="siderbar_inner">
            <div className="sidebar_logo">
              <Link to="" className=" ">
                <img src={Starlogo} className="" alt="Logo" />
              </Link>
            </div>
            <div className="sidebar_menus">
              {User?.type === "SubAdmin" ? (
                <ul className="list-unstyled ps-1 m-0">
                  <li
                    className={
                      User?.access?.includes("Dashboard") ? "" : "d-none"
                    }
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "2px",
                        }}
                        className="fa fa-home"
                      ></i>{" "}
                      Dashboard
                    </Link>
                  </li>
                  <li
                    className={
                      User?.access?.includes("User Management") ? "" : "d-none"
                    }
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                  >
                    <Link
                      className="bg-white"
                      to="/UserManage"
                      style={{
                        textDecoration: "none",
                        fontSize: "18px",
                        color: "#3e4093",
                      }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
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
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                  >
                    <Link
                      className=""
                      to="/CategorySub"
                      style={{ textDecoration: "none", fontSize: "18px" }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
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
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                  >
                    <Link
                      className=""
                      to="/Inventory"
                      style={{ textDecoration: "none", fontSize: "18px" }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "6px",
                          top: "3px",
                        }}
                        class="far fa-building"
                      ></i>{" "}
                      Inventory Management
                    </Link>
                  </li>
                  <li
                    className={
                      User?.access?.includes("Brands Management")
                        ? ""
                        : "d-none"
                    }
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                  >
                    <Link
                      className=""
                      to="/brandsManage"
                      style={{ textDecoration: "none", fontSize: "18px" }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fa fa-ship"
                      ></i>{" "}
                      Brands Management
                    </Link>
                  </li>
                  <li
                    className={
                      User?.access?.includes("Sub-Admin") ? "" : "d-none"
                    }
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fas fa-user-cog"
                      ></i>{" "}
                      Sub-Admin Management
                    </Link>
                  </li>

                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fas fa-users-gear"
                      ></i>{" "}
                      Puller Management
                    </Link>
                  </li>
                  <li
                    className={User?.access?.includes("Trade") ? "" : "d-none"}
                  >
                    <Link
                      className=""
                      to="/admin/Tradeshow-manage"
                      style={{
                        textDecoration: "none",
                        fontSize: "18px",
                      }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fa fa-calendar-check"
                      ></i>{" "}
                      Trade Show Management
                    </Link>
                  </li>
                  <li
                    className={
                      User?.access?.includes("Gallery") ? "" : "d-none"
                    }
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fas fa-user-cog"
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fa-solid fa-book"
                      ></i>{" "}
                      Catalog & Flyers
                    </Link>
                  </li>
                  <li
                    className={
                      User?.access?.includes("Orders Management")
                        ? ""
                        : "d-none"
                    }
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                  >
                    <Link
                      className=""
                      to="/OrderRequest"
                      style={{ textDecoration: "none", fontSize: "18px" }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fa fa-layer-group"
                      ></i>{" "}
                      Order Management
                    </Link>
                  </li>
                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                    className={User?.access?.includes("CMS") ? "" : "d-none"}
                  >
                    <Link
                      className=""
                      to="/Cms"
                      style={{ textDecoration: "none", fontSize: "18px" }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fa fa-cog"
                      ></i>{" "}
                      Content Management
                    </Link>
                  </li>
                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                    className={
                      User?.access?.includes("Contact") ? "" : "d-none"
                    }
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fa-solid fa-handshake-angle"
                      ></i>{" "}
                      Contact & Support
                    </Link>
                  </li>
                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                  >
                    <Link
                      className=""
                      to="/AdminLogin"
                      onClick={handleClick}
                      style={{ textDecoration: "none", fontSize: "18px" }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fa fa-sign-out-alt"
                      ></i>
                      Logout
                    </Link>
                  </li>
                </ul>
              ) : (
                <ul className="list-unstyled ps-1 m-0">
                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "2px",
                        }}
                        className="fa fa-home"
                      ></i>{" "}
                      Dashboard
                    </Link>
                  </li>
                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                  >
                    <Link
                      className="bg-white"
                      to="/UserManage"
                      style={{
                        textDecoration: "none",
                        fontSize: "18px",
                        color: "#3e4093",
                      }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fa fa-user"
                      ></i>{" "}
                      User Management
                    </Link>
                  </li>
                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                  >
                    <Link
                      className=""
                      to="/CategorySub"
                      style={{ textDecoration: "none", fontSize: "18px" }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fas fa-users"
                      ></i>{" "}
                      Visitor Management
                    </Link>
                  </li>
                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                  >
                    <Link
                      className=""
                      to="/Inventory"
                      style={{
                        textDecoration: "none",
                        fontSize: "18px",
                      }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "6px",
                          top: "3px",
                        }}
                        class="far fa-building"
                      ></i>{" "}
                      Inventory Management
                    </Link>
                  </li>
                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                  >
                    <Link
                      className=""
                      to="/brandsManage"
                      style={{ textDecoration: "none", fontSize: "18px" }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fa fa-ship"
                      ></i>{" "}
                      Brands Management
                    </Link>
                  </li>
                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fas fa-user-cog"
                      ></i>{" "}
                      Sub-Admin Management
                    </Link>
                  </li>
                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fa fa-calendar-check"
                      ></i>{" "}
                      TradeShow Management
                    </Link>
                  </li>

                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fa-solid fa-book"
                      ></i>{" "}
                      Catalog & Flyers
                    </Link>
                  </li>
                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                  >
                    <Link
                      className=""
                      to="/OrderRequest"
                      style={{ textDecoration: "none", fontSize: "18px" }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fa fa-layer-group"
                      ></i>{" "}
                      Order Management
                    </Link>
                  </li>
                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                  >
                    <Link
                      className=""
                      to="/Cms"
                      style={{ textDecoration: "none", fontSize: "18px" }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
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
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
                        class="fa-solid fa-handshake-angle"
                      ></i>{" "}
                      Contact & Support
                    </Link>
                  </li>
                  <li
                    onClick={() =>
                      setPageData([{ page: 1, searchKey: "", sortBy: "1" }])
                    }
                  >
                    <Link
                      className=""
                      to="/AdminLogin"
                      onClick={handleClick}
                      style={{ textDecoration: "none", fontSize: "18px" }}
                    >
                      <i
                        style={{
                          position: "relative",
                          left: "4px",
                          top: "3px",
                        }}
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
            <div className="row user-management justify-content-center">
              <div className="col-12">
                <div className="row mx-0">
                  <div className="col-12 text-end mb-4">
                    <Link
                      data-bs-toggle="modal"
                      id="modal-toggle"
                      data-bs-target="#staticBackdrop6"
                      className="comman_btn text-decoration-none"
                    >
                      Import User
                    </Link>
                    <Link
                      to="/UserManage/AddUser"
                      className="comman_btn2 ms-2 text-decoration-none"
                    >
                      Add User
                    </Link>
                  </div>
                  <div className="col-12 design_outter_comman  shadow">
                    <div className="row comman_header justify-content-between px-2">
                      <div className="col-6">
                        <h2 className="main_headers">Users Management</h2>
                      </div>
                      <div className="col-6  d-flex justify-content-end">
                        <button className="comman_btn_search ">
                          <select
                            name=""
                            id=""
                            className="searchDrop "
                            onChange={(e) => setSearchType(e.target.value)}
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
                        {/* <form className="form-design" action=""> */}
                        <div className="form-group mb-0 position-relative icons_set">
                          <input
                            type="text"
                            className="form-control bg-white"
                            placeholder="Search"
                            defaultValue={pageData[0]?.searchKey}
                            name="name"
                            id="Search"
                            onChange={(e) => {
                              userSearch(e.target.value);
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
                                  className="mx-3 mt-2"
                                ></img>
                              </button>
                              <div class="dropdown-content_sort">
                                <a>
                                  <Link
                                    className="text-decoration-none "
                                    onClick={() => sorting(1)}
                                  >
                                    A to Z
                                  </Link>
                                </a>
                                <a>
                                  <Link
                                    className="text-decoration-none"
                                    onClick={() => sorting(-1)}
                                  >
                                    Z to A
                                  </Link>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-12 p-0 user-management-tabs">
                        <nav>
                          <div
                            className="nav nav-tabs"
                            id="nav-tab"
                            role="tablist"
                          >
                            <button
                              className="nav-link outline-0 "
                              id="nav-home-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-home"
                              type="button"
                              role="tab"
                              aria-controls="nav-home"
                              aria-selected="true"
                              onClick={() => {
                                getPendingUser();
                                document.getElementById("Search").value = "";
                                setUserType("PENDING");
                                setPageData([
                                  { page: 1, searchKey: "", sortBy: "1" },
                                ]);
                              }}
                            >
                              Pending{" "}
                              <span className="circle_count">
                                {usersTotal?.pending}
                              </span>
                            </button>
                            <button
                              className="nav-link outline-0 active
                              "
                              id="nav-approve-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-approve"
                              type="button"
                              role="tab"
                              aria-controls="nav-approve"
                              aria-selected="false"
                              onClick={() => {
                                document.getElementById("Search").value = "";
                                setUserType("APPROVED");
                                getApprovedUser();
                              }}
                            >
                              Approved{" "}
                              <button className="circle_count">
                                {usersTotal?.approved}
                              </button>
                            </button>
                            <button
                              className="nav-link outline-0 border-0"
                              id="nav-return-tab"
                              data-bs-toggle="tab"
                              data-bs-target="#nav-return"
                              type="button"
                              role="tab"
                              aria-controls="nav-return"
                              aria-selected="false"
                              onClick={() => {
                                getRejectedUser();
                                document.getElementById("Search").value = "";
                                setUserType("REJECTED");
                                setPageData([
                                  { page: 1, searchKey: "", sortBy: "1" },
                                ]);
                              }}
                            >
                              Returned{" "}
                              <span className="circle_count">
                                {usersTotal?.rejected}
                              </span>
                            </button>
                          </div>
                        </nav>
                        <div className="tab-content" id="nav-tabContent">
                          <div
                            className="tab-pane fade  "
                            id="nav-home"
                            role="tabpanel"
                            aria-aria-labelledby="nav-home-tab"
                          >
                            <div className="row">
                              <div className="col-12 comman_table_design ">
                                <div className="table-responsive recent_orders_user">
                                  {search?.length >= 1 ? (
                                    ""
                                  ) : (
                                    <>
                                      {pendingUsers?.length ? (
                                        <div className="col-11 d-flex justify-content-between py-2 mx-5">
                                          <span className="totalPage">
                                            Total Pages : {maxPenPage}
                                          </span>
                                          <ul id="pagination">
                                            <li>
                                              <a
                                                class="fs-5"
                                                href="#"
                                                onClick={() =>
                                                  activePendingPage <= 1
                                                    ? setActivePendingPage(1)
                                                    : setActivePendingPage(
                                                        activePendingPage - 1
                                                      )
                                                }
                                              >
                                                «<small>prev</small>
                                              </a>
                                            </li>

                                            <li>
                                              <a href="#" className="active">
                                                {activePendingPage}
                                              </a>
                                            </li>

                                            <li>
                                              <a
                                                className="fs-5"
                                                href="#"
                                                onClick={() =>
                                                  activePendingPage ===
                                                  maxPenPage
                                                    ? setActivePendingPage(
                                                        maxPenPage
                                                      )
                                                    : setActivePendingPage(
                                                        activePendingPage + 1
                                                      )
                                                }
                                              >
                                                <small>next</small>»
                                              </a>
                                            </li>
                                          </ul>
                                        </div>
                                      ) : null}
                                    </>
                                  )}

                                  <table className="table mb-0  ">
                                    <thead>
                                      <tr
                                        style={{
                                          backgroundColor: "#f2f2f2",
                                          marginLeft: "8px",
                                        }}
                                      >
                                        <th>Date</th>
                                        <th>Company Name</th>
                                        <th>User Name</th>
                                        <th>Address</th>
                                        <th>Email</th>
                                        <th>Mobile</th>

                                        <th>Action</th>
                                      </tr>
                                    </thead>

                                    <tbody>
                                      {(pendingUsers || [])
                                        .filter((User) => {
                                          if (searchTerm == "") {
                                            return User;
                                          } else if (
                                            User?.firstName
                                              .toLowerCase()
                                              .includes(
                                                searchTerm.toLowerCase()
                                              )
                                          ) {
                                            return User;
                                          }
                                        })
                                        .map((User, index) => (
                                          <tr className="" key={index}>
                                            <td className="border">
                                              {moment(
                                                User?.createdAt?.slice(0, 10)
                                              ).format("MM/DD/YYYY")}
                                            </td>
                                            <td className="border table_user">
                                              {User?.companyName}
                                            </td>
                                            <td className="border">
                                              {User?.firstName}
                                            </td>

                                            <td className="border">
                                              {User?.addressLine1?.slice(0, 40)}
                                              ....
                                            </td>
                                            <td className="border">
                                              {User?.email}
                                            </td>
                                            <td className="border">
                                              {User?.phoneNumber}
                                            </td>

                                            <td className="border">
                                              <Link
                                                className="comman_btn2  text-decoration-none"
                                                to="/UserManage/PendingView"
                                                id={index}
                                                onClick={() => {
                                                  onPendingView(index);
                                                }}
                                              >
                                                View
                                              </Link>
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                  {search?.length >= 1 ? (
                                    ""
                                  ) : (
                                    <>
                                      {pendingUsers?.length ? (
                                        <div className="col-11 d-flex justify-content-between py-2 mx-5">
                                          <span className="totalPage">
                                            Total Pages : {maxPenPage}
                                          </span>
                                          <ul id="pagination">
                                            <li>
                                              <a
                                                class="fs-5"
                                                href="#"
                                                onClick={() =>
                                                  activePendingPage <= 1
                                                    ? setActivePendingPage(1)
                                                    : setActivePendingPage(
                                                        activePendingPage - 1
                                                      )
                                                }
                                              >
                                                «<small>prev</small>
                                              </a>
                                            </li>

                                            <li>
                                              <a href="#" className="active">
                                                {activePendingPage}
                                              </a>
                                            </li>

                                            <li>
                                              <a
                                                className="fs-5"
                                                href="#"
                                                onClick={() =>
                                                  activePendingPage ===
                                                  maxPenPage
                                                    ? setActivePendingPage(
                                                        maxPenPage
                                                      )
                                                    : setActivePendingPage(
                                                        activePendingPage + 1
                                                      )
                                                }
                                              >
                                                <small>next</small>»
                                              </a>
                                            </li>
                                          </ul>
                                        </div>
                                      ) : null}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="tab-content" id="nav-tabContent">
                            <div
                              className="tab-pane fade show active recent_orders_user"
                              id="nav-approve"
                              role="tabpanel"
                              aria-labelledby="nav-approve-tab"
                            >
                              <div className="row">
                                <div className="col-12 comman_table_design ">
                                  <div className="table-responsive">
                                    {search?.length >= 1 ? (
                                      ""
                                    ) : (
                                      <>
                                        {approvedUsers?.length ? (
                                          <div className="col-11 d-flex justify-content-between py-2 mx-5 ">
                                            <span className="totalPage">
                                              ( Total Pages : {maxAppPage} )
                                            </span>
                                            <ul id="pagination">
                                              <li>
                                                <a
                                                  class="fs-5"
                                                  href="#"
                                                  onClick={() =>
                                                    activeApprovePage === 1
                                                      ? setActiveApprovePage(1)
                                                      : setActiveApprovePage(
                                                          activeApprovePage - 1
                                                        )
                                                  }
                                                >
                                                  « <small>prev</small>
                                                </a>
                                              </li>

                                              <li>
                                                <a href="#" className="active">
                                                  {activeApprovePage}
                                                </a>
                                              </li>

                                              <li>
                                                <a
                                                  className="fs-5"
                                                  href="#"
                                                  onClick={() =>
                                                    activeApprovePage ===
                                                    maxAppPage
                                                      ? setActiveApprovePage(
                                                          maxAppPage
                                                        )
                                                      : setActiveApprovePage(
                                                          activeApprovePage + 1
                                                        )
                                                  }
                                                >
                                                  <small>next</small>»
                                                </a>
                                              </li>
                                            </ul>
                                          </div>
                                        ) : null}
                                      </>
                                    )}
                                    <table className="table mb-0">
                                      <thead>
                                        <tr
                                          style={{
                                            backgroundColor: "#f2f2f2",
                                            marginLeft: "8px",
                                          }}
                                        >
                                          <th>Date</th>
                                          <th>Company Name</th>
                                          <th>Account Number</th>
                                          <th>User Name</th>
                                          <th>Address</th>
                                          <th>Email</th>
                                          <th>Mobile</th>
                                          <th>Status</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {(approvedUsers || []).map(
                                          (User, index) => (
                                            <tr key={index} className="">
                                              <td className="border">
                                                {moment(
                                                  User?.createdAt?.slice(0, 10)
                                                ).format("MM/DD/YYYY")}
                                              </td>
                                              <td className="border">
                                                {User?.companyName}
                                              </td>
                                              <td
                                                key={User?.accountNumber}
                                                className="border"
                                              >
                                                {User?.accountNumber}
                                              </td>
                                              <td className="border">
                                                {User?.firstName}
                                              </td>

                                              <td className="border">
                                                {User?.addressLine1?.slice(
                                                  0,
                                                  40
                                                )}
                                                ....
                                              </td>
                                              <td className="border">
                                                {User?.email}
                                              </td>
                                              <td className="border">
                                                {User?.phoneNumber}
                                              </td>
                                              <td
                                                className="border"
                                                key={User._id}
                                              >
                                                {" "}
                                                <div className="">
                                                  <label class="switchUser">
                                                    <input
                                                      type="checkbox"
                                                      name="quotation"
                                                      id={User._id}
                                                      defaultChecked={
                                                        User.status
                                                      }
                                                      onClick={() => {
                                                        UserStatus(User?._id);
                                                      }}
                                                    />
                                                    <span class="sliderUser round"></span>
                                                  </label>
                                                </div>
                                              </td>
                                              <td className="border">
                                                <Link
                                                  className="comman_btn2 text-decoration-none"
                                                  to="/UserManage/ApprovedView"
                                                  id={index}
                                                  onClick={() => {
                                                    setPageData([
                                                      {
                                                        page: activeApprovePage,
                                                        sortBy: sorting,
                                                        searchKey: search,
                                                      },
                                                    ]);
                                                    onApprovedView(index);
                                                  }}
                                                >
                                                  View
                                                </Link>
                                                <Link
                                                  className="comman_btn2 text-decoration-none mx-1"
                                                  id={index}
                                                  onClick={() =>
                                                    sendActivation(User?._id)
                                                  }
                                                >
                                                  Send Mail For Membership
                                                </Link>
                                              </td>
                                            </tr>
                                          )
                                        )}
                                      </tbody>
                                    </table>
                                  </div>
                                  {search?.length >= 1 ? (
                                    ""
                                  ) : (
                                    <>
                                      {approvedUsers?.length ? (
                                        <div className="col-11 d-flex justify-content-between py-2 mx-5 ">
                                          <span className="totalPage">
                                            ( Total Pages : {maxAppPage} )
                                          </span>
                                          <ul id="pagination">
                                            <li>
                                              <a
                                                class="fs-5"
                                                href="#"
                                                onClick={() =>
                                                  activeApprovePage === 1
                                                    ? setActiveApprovePage(1)
                                                    : setActiveApprovePage(
                                                        activeApprovePage - 1
                                                      )
                                                }
                                              >
                                                « <small>prev</small>
                                              </a>
                                            </li>

                                            <li>
                                              <a href="#" className="active">
                                                {activeApprovePage}
                                              </a>
                                            </li>

                                            <li>
                                              <a
                                                className="fs-5"
                                                href="#"
                                                onClick={() =>
                                                  activeApprovePage ===
                                                  maxAppPage
                                                    ? setActiveApprovePage(
                                                        maxAppPage
                                                      )
                                                    : setActiveApprovePage(
                                                        activeApprovePage + 1
                                                      )
                                                }
                                              >
                                                <small>next</small>»
                                              </a>
                                            </li>
                                          </ul>
                                        </div>
                                      ) : null}
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="tab-content" id="nav-tabContent">
                          <div
                            className="tab-pane fade recent_orders_user"
                            id="nav-return"
                            role="tabpanel"
                            aria-labelledby="nav-return-tab"
                          >
                            <div className="row">
                              <div className="col-12 comman_table_design ">
                                <div className="table-responsive">
                                  <table className="table mb-0">
                                    <thead>
                                      <tr
                                        style={{
                                          backgroundColor: "#f2f2f2",
                                          marginLeft: "8px",
                                        }}
                                      >
                                        <th>Date</th>
                                        <th>Company Name</th>
                                        <th>User Name</th>
                                        <th>Address</th>
                                        <th>Email</th>
                                        <th>Mobile</th>
                                        <th>Action</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {(rejectedUsers || [])
                                        ?.filter((User) => {
                                          if (searchTerm == "") {
                                            return User;
                                          } else if (
                                            User?.firstName
                                              .toLowerCase()
                                              .includes(
                                                searchTerm.toLowerCase()
                                              )
                                          ) {
                                            return User;
                                          }
                                        })
                                        .map((User, index) => (
                                          <tr key={index} className="">
                                            <td className="border">
                                              {moment(
                                                User?.createdAt?.slice(0, 10)
                                              ).format("L")}
                                            </td>
                                            <td className="border">
                                              {User?.companyName}
                                            </td>
                                            <td className="border">
                                              {User?.firstName}
                                            </td>

                                            <td className="border">
                                              {User?.addressLine1?.slice(0, 40)}
                                              ....
                                            </td>
                                            <td className="border">
                                              {User?.email}
                                            </td>
                                            <td className="border">
                                              {User?.phoneNumber}
                                            </td>

                                            <td className="border">
                                              <Link
                                                className="comman_btn2  text-decoration-none"
                                                to="/UserManage/ReturnedView"
                                                id={index}
                                                onClick={() => {
                                                  onReturnedView(index);
                                                }}
                                              >
                                                View
                                              </Link>
                                            </td>
                                          </tr>
                                        ))}
                                    </tbody>
                                  </table>
                                </div>
                                {rejectedUsers?.length ? (
                                  <div className="col-11 d-flex justify-content-between py-2 mx-5 ">
                                    <span className="totalPage">
                                      Total Pages : {maxRetPage}
                                    </span>
                                    <ul id="pagination">
                                      <li>
                                        <a
                                          class="fs-5"
                                          href="#"
                                          onClick={() =>
                                            activeReturnedPage <= 1
                                              ? setActiveReturnedPage(1)
                                              : setActiveReturnedPage(
                                                  activeReturnedPage - 1
                                                )
                                          }
                                        >
                                          «
                                        </a>
                                      </li>

                                      <li>
                                        <a href="#">.</a>
                                      </li>
                                      <li>
                                        <a href="#">.</a>
                                      </li>
                                      <li>
                                        <a href="#" className="active">
                                          {activeReturnedPage}
                                        </a>
                                      </li>
                                      <li>
                                        <a href="#">.</a>
                                      </li>
                                      <li>
                                        <a href="#">.</a>
                                      </li>

                                      <li>
                                        <a
                                          className="fs-5"
                                          href="#"
                                          onClick={() =>
                                            activeReturnedPage === maxRetPage
                                              ? setActiveReturnedPage(
                                                  maxRetPage
                                                )
                                              : setActiveReturnedPage(
                                                  activeReturnedPage + 1
                                                )
                                          }
                                        >
                                          »
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
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal comman_modal_form forms_modal"
        id="staticBackdrop6"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content border-0 rounded-0  rounded-top">
            <div className="modal-body ">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={modalClose}
              />

              <div>
                <div className="container-lg w-100">
                  <div className="">
                    {set ? (
                      <div className="drop_box p-5">
                        <header>
                          <h4>Choose File here</h4>
                        </header>
                        <p>Files Supported: CSV</p>
                        <p className="text-dark bg-light p-2">
                          {impFile?.name}{" "}
                          <button
                            hidden
                            className="btn"
                            id="reUpload"
                            onClick={() => {
                              importInput.click();
                            }}
                          >
                            <BiEdit />
                          </button>
                        </p>
                        {um ? (
                          <p className="text-danger fw-bold">{uploadError}</p>
                        ) : null}
                        <input
                          type="file"
                          id="fileID"
                          accept=".csv"
                          style={{ display: "none" }}
                          onChange={onFileSelection}
                        />
                        {ux ? (
                          <Button
                            className="comman_btn"
                            htmlFor=""
                            loading={loader}
                            style={{
                              backgroundColor: "#eb3237",
                              color: "#fff",
                              fontSize: "20px",
                              position: "relative",
                              top: "-2px",
                            }}
                            onClick={onUpload}
                          >
                            Upload
                          </Button>
                        ) : (
                          <button
                            className="comman_btn2"
                            htmlFor=""
                            onClick={() => {
                              importInput.click();
                            }}
                          >
                            Import
                          </button>
                        )}
                        <div className="row  w-100 text-start mt-3">
                          <div className="col-6">
                            {errEmails ? (
                              <h3 className="" style={{ fontSize: "12px" }}>
                                Duplicate Emails
                              </h3>
                            ) : null}
                            <ul style={{ listStyle: "none" }}>
                              {(errEmails?.duplicateMails || []).map(
                                (item, ind) => (
                                  <li
                                    key={ind}
                                    style={{
                                      fontSize: "12px",
                                      position: "relative",
                                      left: "-28px",
                                    }}
                                  >
                                    {item}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                          <div className="col-6">
                            {errEmails ? (
                              <h3 className="" style={{ fontSize: "12px" }}>
                                Existing Emails
                              </h3>
                            ) : null}
                            <ul style={{ listStyle: "none" }}>
                              {(errEmails?.alreadyRegistered || []).map(
                                (item, ind) => (
                                  <li
                                    key={ind}
                                    style={{
                                      fontSize: "12px",
                                      position: "relative",
                                      left: "-28px",
                                    }}
                                  >
                                    {item?.email}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="drop_box p-5">
                        <h1 className="fs-5">CSV Imported</h1>
                        <p> {impFile?.name} </p>
                        <button
                          className="comman_btn mt-3"
                          onClick={GenerateCrendential}
                        >
                          Generate Passwords
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="modal comman_modal_form forms_modal"
        id="staticBackdrop87"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-0  rounded-top">
            <div className="modal-body">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  window.location.reload(false);
                }}
              />

              <div>
                <div className="container">
                  <div className="row justify-content-center p-2">
                    <div className="col-11 text-center mt-2">
                      <p className="fs-4 fw-bold">
                        <i class="fa fa-check-double mx-1 text-success"></i>
                        All Crenditials Sent Successfully!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Link
        data-bs-toggle="modal"
        id="modal-toggle87"
        data-bs-target="#staticBackdrop87"
        href="javscript:;"
        className="comman_btn text-decoration-none d-none"
      >
        Import
      </Link>
    </div>
  );
};

export default UserManage;
