import React, { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Homepage/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Profile from "./Profile";
import axios from "axios";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import { FaFileDownload } from "react-icons/fa";
import { FaFileUpload } from "react-icons/fa";
import { saveAs } from "file-saver";
import moment from "moment";
import swal from "sweetalert";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userPassword } from "../../atom";

const Account = () => {
  const editProfile = `${process.env.REACT_APP_APIENDPOINTNEW}user/editProfile`;
  const editFiles = `${process.env.REACT_APP_APIENDPOINTNEW}user/reUploadFiles`;
  const [users, setUsers] = useState([]);
  const [formValues, setFormValues] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}user/verifyOtp`;
  const sendOtp = `${process.env.REACT_APP_APIENDPOINTNEW}user/forgotPassword`;
  const userApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/getUserProfile`;
  const [counter, setCounter] = useState(0);
  const [error, setError] = useState("");
  const [change, setChange] = useState(false);
  const setPass = useSetRecoilState(userPassword);
  const password = useRecoilValue(userPassword);
  const [errMsg, setErrorMsg] = useState("");
  const [files, setFiles] = useState({
    federalTaxId: "",
    businessLicense: "",
    tobaccoLicence: "",
    salesTaxId: "",
    accountOwnerId: "",
  });
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  let token = localStorage.getItem("token-user");
  const nav = useNavigate();
  axios.defaults.headers.common["x-auth-token-user"] =
    localStorage.getItem("loginToken");

  const onFileSelection = async (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };
  useEffect(() => {
    getUser();
  }, [change]);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  const getUser = async () => {
    await axios.get(userApi).then((res) => {
      console.log(res);
      setUsers(res?.data.results);
    });
  };
  const UpdatedData = (e) => {
    const value = e.target.value;
    setFormValues({
      ...formValues,
      [e.target.name]: value,
    });
  };
  console.log(formValues);
  const SaveProfile = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstName", formValues?.name);
    formData.append("phoneNumber", formValues?.phone);
    formData.append("email", formValues?.email);
    formData.append("password", formValues?.password);

    await axios.post(editProfile, formData).then((res) => {
      if (res.data.message === "Profile updated Successfully") {
        setChange(!change);
        let Modal = document.getElementById("close-modal11");
        window.location.reload();
        Modal.click();
      }
      if (res?.error) {
        Swal.fire({
          title: res?.data.message,
          icon: "error",
          button: "ok",
        });
      }
    });
  };

  // send Otp//

  let email = users?.email;
  const onSubmit = async (data) => {
    data?.number1?.length === "" && setError("Enter Otp");
    const tempOtp =
      data?.number1 + data?.number2 + data?.number3 + data?.number4;
    const otp = parseInt(tempOtp);
    const VerifyUser = () => {
      axios
        .post(apiUrl, {
          email,
          otp,
        })
        .then((res) => {
          console.log(res);
          if (res?.data.message === "OTP Verified") {
            document.getElementById("modal-toggle11").click();
          } else if (res?.data.message === "Invalid OTP") {
            setError("Invalid Otp");
          }
        });
    };
    VerifyUser();
  };
  const SendOtp = async (e) => {
    e.preventDefault();
    await axios
      .post(sendOtp, {
        email: email,
      })
      .then((res) => {});
  };
  const ResendOtp = async (e) => {
    setCounter(60);
    e.preventDefault();
    await axios
      .post(sendOtp, {
        email: email,
      })
      .then((res) => {});
  };

  const moveOnMax = (event, field, nextFieldID) => {
    event = event || window.event;
    if (event.keyCode != 9) {
      if (field.value.length >= field.maxLength) {
        nextFieldID.focus();
      }
    }
  };

  console.log(password, "sdf");
  const checkPassword = (e) => {
    let oldPass = e.target.value;

    if (oldPass !== password) {
      if (oldPass?.length >= 6) {
        setErrorMsg("Wrong Old Password!");
      }
    } else if (oldPass === password) {
      setErrorMsg("Password Matched!");
    }
  };

  const editDocs = async (e, file, name) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append(name, file);
    const { data } = await axios.post(editFiles, formData);
    if (!data.error) {
      getUser();
      Swal.fire({
        title: "Document Modified Successfully!",
        icon: "success",
        confirmButtonText: "Okay",
      });
      setFiles([]);
    }
  };

  const fileDownload = (url) => {
    saveAs(url);
  };

  const togglePassword = () => {
    let x = document.getElementById("password-input");
    let y = document.getElementById("password-input2");
    if (y.type === "password") {
      y.type = "text";
    } else {
      y.type = "password";
    }
    // if (x.type === "password") {
    //   x.type = "text";
    // } else {
    //   x.type = "password";
    // }
  };

  const togglePassword2 = () => {
    let x = document.getElementById("password-input");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };
  return (
    <div className="">
      <div class="myacct_data_inner">
        <div class="row">
          <div class="col-6 data_head mb-4">
            <h2>Account Settings</h2>
          </div>
          <div class="col-6 text-end data_head mb-4">
            <a data-bs-toggle="modal" data-bs-target="#staticBackdrop945">
              <i class="fas fa-edit"></i>
            </a>
          </div>

          <div class="col-12">
            <form class="row setting_form" action="">
              <div class="col-6 form-floating mb-4">
                <input
                  type="text"
                  class="form-control"
                  defaultValue={users?.firstName}
                  id="floatingInput1"
                  placeholder="username"
                  disabled
                />
                <label for="floatingInput1">Name</label>
              </div>
              <div class="col-6 form-floating mb-4">
                <input
                  type="email"
                  class="form-control"
                  defaultValue={users?.email}
                  id="floatingInput"
                  disabled
                />
                <label for="floatingInput">Email address</label>
              </div>
              <div class="col-6 form-floating mb-4">
                <input
                  type="text"
                  class="form-control"
                  defaultValue={users?.phoneNumber}
                  id="floatingInput"
                  disabled
                />
                <label for="floatingInput1">Mobile Number</label>
              </div>
              <div class="col-6 form-floating mb-4">
                <input
                  type="text"
                  class="form-control"
                  value={users?.istobaccoLicenceExpired ? "Expired" : "Active"}
                  id="floatingInput1"
                  placeholder="Expired"
                  disabled
                />
                <label for="floatingInput1">Tobacco Licence Status</label>
              </div>
              <div class="col-lg-4 col-md-6 form-group d-flex align-items-stretch mb-4">
                <div
                  class="upload_document w-100"
                  className={
                    users?.federalTaxId != ""
                      ? "upload_document w-100"
                      : "upload_document  border-danger text-danger mx-0 w-100"
                  }>
                  <span>Federal Tax ID</span>
                  <div class="drag_box">
                    <div className="text-center pt-3">
                      {users?.federalTaxId ? (
                        <FaFileDownload
                          size={25}
                          color="black"
                          onClick={() => {
                            fileDownload(users?.federalTaxId);
                          }}
                        />
                      ) : (
                        <FaFileUpload size={25} color="red" />
                      )}
                    </div>

                    <a
                      className="text-decoration-none text-center"
                      onClick={() => {
                        fileDownload(users?.federalTaxId);
                      }}>
                      <p className="mt-3" style={{ fontSize: "9px" }}>
                        {files?.federalTaxId?.name
                          ? files?.federalTaxId?.name
                          : users?.federalTaxId?.slice(42)}
                      </p>
                    </a>
                  </div>
                  {users?.federalTaxId === "" ? (
                    <div class="choose_fliee position-relative">
                      <input
                        type="file"
                        className="mx-1"
                        name="federalTaxId"
                        id="upld"
                        accept="image/jpeg,image/png,application/pdf,image/x-eps"
                        {...register("federalTaxId")}
                        onChange={(e) => onFileSelection(e, "federalTaxId")}
                      />
                      <label for="upld">Choose File</label>
                    </div>
                  ) : null}

                  {files?.federalTaxId?.name ? (
                    <button
                      className="SaveBtn"
                      onClick={(e) =>
                        editDocs(e, files?.federalTaxId, "federalTaxId")
                      }>
                      Save
                    </button>
                  ) : null}
                </div>
              </div>

              <div class="col-lg-4 col-md-6 form-group d-flex align-items-stretch mb-4">
                <div
                  class="upload_document w-100"
                  className={
                    users?.tobaccoLicence != ""
                      ? "upload_document w-100"
                      : "upload_document  border-danger text-danger mx-0 w-100"
                  }>
                  <span>Tobacco License</span>
                  <div class="drag_box">
                    <div className="text-center pt-3">
                      {users?.tobaccoLicence ? (
                        <FaFileDownload
                          size={25}
                          color="black"
                          onClick={() => {
                            fileDownload(users?.tobaccoLicence);
                          }}
                        />
                      ) : (
                        <FaFileUpload size={25} color="red" />
                      )}
                    </div>

                    <a
                      className="text-decoration-none text-center"
                      onClick={() => {
                        fileDownload(users?.tobaccoLicence);
                      }}>
                      <p className="mt-3" style={{ fontSize: "9px" }}>
                        {files?.tobaccoLicence?.name
                          ? files?.tobaccoLicence?.name
                          : users?.tobaccoLicence?.slice(42)}
                      </p>
                    </a>
                  </div>
                  {users?.tobaccoLicence === "" ? (
                    <div class="choose_fliee position-relative">
                      <input
                        type="file"
                        className="mx-1"
                        name="tobaccoLicence"
                        id="upld"
                        accept="image/jpeg,image/png,application/pdf,image/x-eps"
                        {...register("tobaccoLicence")}
                        onChange={(e) => onFileSelection(e, "tobaccoLicence")}
                      />
                      <label for="upld">Choose File</label>
                    </div>
                  ) : null}

                  {files?.tobaccoLicence?.name ? (
                    <button
                      className="SaveBtn"
                      onClick={(e) =>
                        editDocs(e, files?.tobaccoLicence, "tobaccoLicence")
                      }>
                      Save
                    </button>
                  ) : null}
                </div>
              </div>
              <div class="col-lg-4 col-md-6 form-group d-flex align-items-stretch mb-4">
                <div
                  class="upload_document w-100"
                  className={
                    users?.salesTaxId != ""
                      ? "upload_document w-100"
                      : "upload_document  border-danger text-danger mx-0 w-100"
                  }>
                  <span>Sales Tax ID</span>
                  <div class="drag_box">
                    <div className="text-center pt-3">
                      {users?.salesTaxId ? (
                        <FaFileDownload
                          size={25}
                          color="black"
                          onClick={() => {
                            fileDownload(users?.salesTaxId);
                          }}
                        />
                      ) : (
                        <FaFileUpload size={25} color="red" />
                      )}
                    </div>

                    <a
                      className="text-decoration-none text-center"
                      onClick={() => {
                        fileDownload(users?.salesTaxId);
                      }}>
                      <p className="mt-3" style={{ fontSize: "9px" }}>
                        {files?.salesTaxId?.name
                          ? files?.salesTaxId?.name
                          : users?.salesTaxId?.slice(42)}
                      </p>
                    </a>
                  </div>
                  {users?.salesTaxId === "" ? (
                    <div class="choose_fliee position-relative">
                      <input
                        type="file"
                        name="salesTaxId"
                        className="mx-1"
                        id="upld"
                        accept="image/jpeg,image/png,application/pdf,image/x-eps"
                        {...register("salesTaxId")}
                        onChange={(e) => onFileSelection(e, "salesTaxId")}
                      />
                      <label for="upld">Choose File</label>
                    </div>
                  ) : null}

                  {files?.salesTaxId?.name ? (
                    <button
                      className="SaveBtn"
                      onClick={(e) =>
                        editDocs(e, files?.salesTaxId, "salesTaxId")
                      }>
                      Save
                    </button>
                  ) : null}
                </div>
              </div>
              <div class="col-lg-6 col-md-6 mb-lg-0 mb-md-4 form-group d-flex align-items-stretch">
                <div
                  class="upload_document w-100"
                  className={
                    users?.businessLicense != ""
                      ? "upload_document w-100"
                      : "upload_document  border-danger text-danger mx-0 w-100"
                  }>
                  <span>Business License ID</span>
                  <div class="drag_box">
                    <div className="text-center pt-3">
                      {users?.businessLicense ? (
                        <FaFileDownload
                          size={25}
                          color="black"
                          onClick={() => {
                            fileDownload(users?.businessLicense);
                          }}
                        />
                      ) : (
                        <FaFileUpload size={25} color="red" />
                      )}
                    </div>
                    <a
                      className="text-decoration-none text-center"
                      onClick={() => {
                        fileDownload(users?.businessLicense);
                      }}>
                      <p className="mt-3" style={{ fontSize: "9px" }}>
                        {files?.businessLicense?.name
                          ? files?.businessLicense?.name
                          : users?.businessLicense?.slice(42)}
                      </p>
                    </a>
                  </div>
                  {users?.businessLicense === "" ? (
                    <div class="choose_fliee position-relative">
                      <input
                        type="file"
                        name="businessLicense"
                        className="mx-1"
                        id="upld"
                        accept="image/jpeg,image/png,application/pdf,image/x-eps"
                        {...register("businessLicense")}
                        onChange={(e) => onFileSelection(e, "businessLicense")}
                      />
                      <label for="upld">Choose File</label>
                    </div>
                  ) : null}

                  {files?.businessLicense?.name ? (
                    <button
                      className="SaveBtn"
                      onClick={(e) =>
                        editDocs(e, files?.businessLicense, "businessLicense")
                      }>
                      Save
                    </button>
                  ) : null}
                </div>
              </div>
              <div class="col-lg-6 form-group d-flex align-items-stretch">
                <div
                  class="upload_document w-100"
                  className={
                    users?.accountOwnerId != ""
                      ? "upload_document w-100"
                      : "upload_document  border-danger text-danger mx-0 w-100"
                  }>
                  <span>Account Owner ID</span>
                  <div class="drag_box">
                    <div className="text-center pt-3">
                      {users?.accountOwnerId ? (
                        <FaFileDownload
                          size={25}
                          color="black"
                          onClick={() => {
                            fileDownload(users?.accountOwnerId);
                          }}
                        />
                      ) : (
                        <FaFileUpload size={25} color="red" />
                      )}
                    </div>
                    <a
                      className="text-decoration-none text-center"
                      onClick={() => {
                        fileDownload(users?.accountOwnerId);
                      }}>
                      <p className="mt-3" style={{ fontSize: "9px" }}>
                        {files?.accountOwnerId?.name
                          ? files?.accountOwnerId?.name
                          : users?.accountOwnerId?.slice(42)}
                      </p>
                    </a>
                  </div>
                  {users?.accountOwnerId === "" ? (
                    <div class="choose_fliee position-relative">
                      <input
                        type="file"
                        name="accountOwnerId"
                        className="mx-1"
                        id="upld"
                        accept="image/jpeg,image/png,application/pdf,image/x-eps"
                        {...register("accountOwnerId")}
                        onChange={(e) => onFileSelection(e, "accountOwnerId")}
                      />
                      <label for="upld">Choose File</label>
                    </div>
                  ) : null}

                  {files?.accountOwnerId?.name ? (
                    <button
                      className="SaveBtn"
                      onClick={(e) =>
                        editDocs(e, files?.accountOwnerId, "accountOwnerId")
                      }>
                      Save
                    </button>
                  ) : null}
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div
        className="modal comman_modal_form forms_modal"
        id="staticBackdrop945"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered ">
          <div className="modal-content border-0 rounded-0  rounded-top">
            <div className="modal-body shadow">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />

              <div>
                <div className="container">
                  <div className="row justify-content-center p-2">
                    <h1 className="text-center">Verification</h1>
                    <div className="col-6 d-flex">
                      <input
                        type="radio"
                        name="emailType"
                        className="radioBtn"
                        checked
                      />
                      <p className="mt-3 mx-1 fs-6 fw-bold mt-2">
                        Email Address
                      </p>
                    </div>
                    <div className="col-6 d-flex">
                      <input
                        type="radio"
                        name="emailType"
                        className="radioBtn"
                      />
                      <p className="mt-3 mx-1 fs-6 fw-bold mt-2">
                        Mobile Number
                      </p>
                    </div>
                  </div>
                  <div
                    className="col-12 text-center mt-3"
                    data-bs-toggle="modal"
                    id="modal-toggle"
                    data-bs-target="#staticBackdrop9">
                    <button className="comman_btn2" onClick={SendOtp}>
                      Send Otp
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal  comman_modal_form"
        id="staticBackdrop9"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-0">
            <div className="modal-body shadow">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                onClick={() => window.location.reload(false)}
                aria-label="Close"
              />

              <div className="row align-items-center justify-content-center text-center">
                <div className="col-md-8">
                  <div className="comman_modal_heading">
                    <h2 className="fs-2 fw-bold">OTP Verification</h2>
                    <p>
                      Please enter the OTP received on <br /> your Email Address
                    </p>
                  </div>
                  <form
                    className="forms_modal_content otp_part"
                    onSubmit={handleSubmit(onSubmit)}
                    autocomplete="off">
                    {error}
                    <div className="form-group mb-3 d-flex justify-content-center">
                      <input
                        className="form-control shadow-none border border-secondary text-center mx-1 otp_input "
                        type="number"
                        maxLength={1}
                        name="number1"
                        id="numberOne"
                        {...register("number1", {
                          required: "Required",
                          maxLength: {
                            value: 1,
                            message: "maximium 1 Charcarters",
                          },
                        })}
                        onKeyUp={(event) => {
                          moveOnMax(
                            event,
                            document.getElementById("numberOne"),
                            document.getElementById("numberTwo")
                          );
                        }}
                      />
                      <input
                        className="form-control shadow-none border border-secondary text-center mx-1 otp_input"
                        type="number"
                        maxLength={1}
                        name="number2"
                        id="numberTwo"
                        {...register("number2", {
                          required: "Required",
                        })}
                        onKeyUp={(event) => {
                          moveOnMax(
                            event,
                            document.getElementById("numberTwo"),
                            document.getElementById("numberThree")
                          );
                        }}
                      />
                      <input
                        className="form-control shadow-none border border-secondary text-center mx-1 otp_input"
                        type="number"
                        maxLength={1}
                        name="number3"
                        id="numberThree"
                        {...register("number3", {
                          required: "Required",
                        })}
                        onKeyUp={(event) => {
                          moveOnMax(
                            event,
                            document.getElementById("numberThree"),
                            document.getElementById("numberFour")
                          );
                        }}
                      />
                      <input
                        className="form-control shadow-none border border-secondary text-center mx-1 otp_input"
                        type="number"
                        maxLength={1}
                        name="number4"
                        id="numberFour"
                        {...register("number4", {
                          required: "Required",
                        })}
                      />
                    </div>
                    <div className="fs-6 text-danger fw-bold">{error}</div>
                    <div className="form-group my-3">
                      <div className="time_js">
                        <span className="fw-bold fs-5 text-info">
                          {counter ? <p>00:{counter}</p> : null}
                        </span>
                      </div>
                    </div>
                    <div className="form-group mb-4">
                      <button className="comman_btn" type="submit">
                        Submit
                      </button>
                    </div>
                    <div className="form-group mb-0 comman_text">
                      <span>
                        Didn't receive the OTP?{" "}
                        {counter ? (
                          <a
                            className="text-decoration-none "
                            style={{ color: "#3b4093" }}>
                            Check Email
                          </a>
                        ) : (
                          <a
                            className="text-decoration-none"
                            style={{ color: "#3b4093", cursor: "pointer" }}
                            onClick={ResendOtp}>
                            Resend OTP
                          </a>
                        )}
                      </span>
                    </div>
                  </form>
                  <a
                    data-bs-toggle="modal"
                    id="modal-toggle"
                    data-bs-target="#staticBackdrop4"
                    href="javscript:;"
                    className="comman_btn text-decoration-none d-none">
                    Ssdfd
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <a
        data-bs-toggle="modal"
        id="modal-toggle11"
        data-bs-target="#staticBackdrop11"
        href="javscript:;"
        className="comman_btn text-decoration-none d-none">
        Ssdfd
      </a>
      <div
        className="modal  comman_modal_form"
        id="staticBackdrop11"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-0">
            <div className="modal-body shadow">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => window.location.reload(false)}
                id="close-modal11"
              />

              <div className="row align-items-center justify-content-center text-center">
                <div className="col-md-11">
                  <div className="comman_modal_heading">
                    <h2 className="fs-2 fw-bold mb-5">Update Your Profile</h2>
                  </div>
                  <form className="form-design row p-0" action="">
                    <div className="form-floating col-6 mb-4">
                      <input
                        type="text"
                        className="form-control shadow-none px-3"
                        defaultValue={users?.firstName}
                        id="floatingInput"
                        placeholder=" "
                        name="name"
                        onChange={UpdatedData}
                      />
                      <label htmlFor="floatingInput">Name</label>
                    </div>

                    <div className="form-floating col-6 mb-4">
                      <input
                        type="number"
                        className="form-control shadow-none px-3"
                        defaultValue={users?.phoneNumber}
                        id="floatingInput"
                        placeholder=" "
                        name="phone"
                        onChange={UpdatedData}
                      />
                      <label htmlFor="floatingInput">Mobile Number</label>
                    </div>
                    <div className="form-floating col-12 mb-4">
                      <input
                        type="email"
                        className="form-control shadow-none px-3"
                        defaultValue={users?.email}
                        id="floatingInput"
                        placeholder="email"
                        name="email"
                        disabled
                        onChange={UpdatedData}
                      />
                      {console.log(users?.email)}
                      <label htmlFor="floatingInput">Email Address</label>
                    </div>

                    <div className="form-floating col-12 mb-4 position-relative">
                      <input
                        type="password"
                        name="password"
                        className="form-control shadow-none px-3"
                        id="password-input"
                        onChange={UpdatedData}
                      />
                      <label htmlFor="password-field">Enter New Password</label>
                      <span
                        onClick={togglePassword2}
                        className="fa fa-fw fa-eye field-icon toggle-password"
                      />
                    </div>
                    <div className="form-floating col-12 text-center">
                      <button
                        className="text-center my-2 comman_btn"
                        onClick={SaveProfile}>
                        Save
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
