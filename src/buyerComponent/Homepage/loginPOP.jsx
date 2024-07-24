import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import classNames from "classnames";
import Starlogo from "../../assets/img/logo.png";
import Navbar from "../Homepage/Navbar";
import { Button } from "rsuite";
import Footer from "../Footer/Footer";

const LoginPOP = ({getLoginCnfirm}) => {
  const [loader, setLoader] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [state, setState] = useState(false);
  const navigate = useNavigate();
  const Swal = require("sweetalert2");
  const [emailerr, setEmailErr] = useState();
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}user/preLogin`;
  const apiUrl2 = `${process.env.REACT_APP_APIENDPOINTNEW}user/login`;

  const autoClose = () => {
    document.getElementById("close").click();
  };

  useEffect(() => {}, [state]);
  const handleRefresh = () => {
    window.location.reload(false);
  };
  const [email, setEmail] = useState("");

  const [passScrn, setPassScrn] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm();

  const {
    register: register2,
    handleSubmit: handleSubmit2,
    formState: { errors: errors2 },
  } = useForm();

  const onSubmit = async (data) => {
    setLoader(true);
    await axios
      .post(apiUrl, {
        email: data.email,
      })
      .then((res) => {
        if (res?.data.message === "Please enter password") {
          localStorage.setItem("userEmail", data.email);
          //   navigate("/app/login-password", { state: data?.email });
          setLoader(false);
          setPassScrn(true);
          setEmail(data?.email);
        }
        if (res?.data.message === "Your ID in under review") {
          Swal.fire({
            title: "Your ID in under review",
            text: "Do you want to continue",
            icon: "error",
            confirmButtonText: "Cool",
          });
          setLoader(false);
        }
        if (res?.data.message === "You are suspended by admin") {
          Swal.fire({
            title: "Your Account has beed disabled. Please Contact Admin!",
            width: 600,
            icon: "error",
            confirmButtonText: "Ok",
          });
          setLoader(false);
        }
        if (res?.data.message === "You need to provide details again") {
          localStorage.setItem("userEmail", data.email);
          setLoader(false);

          Swal.fire({
            title:
              "Oops! Your Registration  request is Declined.Please Re-submit your application.",
            width: 600,
            text: "Click Below to know reason.",
            icon: "error",
            confirmButtonText: "Go to Sign Up",
          }).then((res) => {
            autoClose();
            navigate("/Register/ReSubmit");
          });
        }
        if (res?.data.message === "Email is not registered") {
          Swal.fire({
            title: "Email is not registered!",
            text: "Please Register your account!",
            icon: "error",
            confirmButtonText: "okay",
          });
          setLoader(false);
        }
      });
  };

  const onSubmit2 = async (data) => {
    setLoader2(true);
    await axios
      .post(apiUrl2, {
        email: email,
        password: data.password2,
      })
      .then((res) => {
        if (res?.data.message === "Logged In") {
          setLoader2(false);
          localStorage.setItem("token-user", res?.data?.results.token);
          localStorage.setItem(
            "UserData",
            JSON.stringify(res?.data?.results?.verifyUser)
          );
          Swal.fire({
            title: "You have been successfully Logged In .",
            icon: "success",
            showCloseButton: true,
            timer: 1000,
          });
          getLoginCnfirm("login")
        }
        if (res?.data.message === "Your ID in under review") {
          setLoader2(false);
          Swal.fire({
            title: "Your ID in under review",
            text: "Do you want to continue",
            icon: "error",
            confirmButtonText: "Cool",
          });
        }
        if (res?.data.message === "You are suspended by admin") {
          setLoader2(false);

          Swal.fire({
            title: "Your Account has beed disabled. Please Contact Admin!",
            width: 600,
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
        if (res?.data.message === "Wrong Password") {
          setLoader2(false);
          Swal.fire({
            title: "Wrong or Invalid Password!",
            width: 600,
            text: "Try again or click ‘Forgot password’ to reset it.",
            icon: "error",
            confirmButtonText: "Try again",
            timer: 2000,
          });
        }
        if (res?.data.message === "First Time Login") {
          setLoader2(false);
          navigate("/app/update-password", { state: email });
        }
      });
  };

  const togglePassword = () => {
    let x = document.getElementById("Password-2");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };
  return (
    <div>
      <div class="container px-4 py-0 ">
        {passScrn ? (
          <div class="row comman_divvision justify-content-center text-center">
            <div class="col-12 login-new-img mb-lg-4 mb-md-4">
              <img src={Starlogo} alt="" />
            </div>
            <div class="col-12 login-new-heading mb-4">
              <h2>Welcome to StarImporters.</h2>
              <span>Enter Your Password</span>
            </div>
            <div class="col-lg-6 col-md-8">
              <form
                class="row login-new-form"
                action=""
                autoComplete="off"
                onSubmit={handleSubmit2(onSubmit2)}>
                <div class="form-group mb-2 col-12">
                  <input
                    type="password"
                    className={classNames(
                      "form-control  border border-secondary px-3",
                      { "is-invalid": errors2.password2 }
                    )}
                    id="Password-2"
                    placeholder="**********"
                    name="password2"
                    {...register2("password2", {
                      required: "Enter Your Password",
                    })}
                  />
                  <input
                    type="checkbox"
                    onClick={togglePassword}
                    className="showPassCheck"
                  />
                  <small className=" showPass">Show Password</small>
                </div>

                <div class="form-group mb-4 pt-3 col-12">
                  <Button
                    loading={loader2}
                    style={{ backgroundColor: "#eb3237" }}
                    appearance="primary"
                    type="submit"
                    className="new---btn">
                    Sign In
                  </Button>
                </div>
                <div className="form-group">
                  <Link
                    to="/app/forgot-password"
                    className="text-decoration-none text-primary"
                    style={{ fontSize: "14px" }}>
                    Forgot Your Password?
                  </Link>
                </div>
                <div class="form-group mb-4 col-12">
                  <div class="forrm-btm">
                    Don’t have an account?{" "}
                    <a
                      className="text-decoration-none"
                      onClick={() => navigate("/app/register")}>
                      Register Now
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        ) : (
          <div
            class="row comman_divvision justify-content-center text-center 
          ">
            <div class="col-12 login-new-img mb-lg-4 mb-md-4">
              <img src={Starlogo} alt="" />
            </div>
            <div class="col-12 login-new-heading mb-4">
              <h2>Welcome to StarImporters.</h2>
              <span>Login to your account !</span>
            </div>
            <div class="col-lg-6 col-md-8">
              <form
                class="row login-new-form"
                action=""
                key={passScrn}
                onSubmit={handleSubmit(onSubmit)}>
                <div class="form-group mb-4 col-12">
                  <input
                    type="email"
                    className={classNames("form-control", {
                      "is-invalid": errors.email,
                    })}
                    id="email"
                    placeholder="Enter Email Address"
                    name="email"
                    {...register("email", {
                      required: "Please Enter Your Email",
                    })}
                  />
                </div>
                <strong className="" style={{ color: "#eb3237" }}>
                  {emailerr ? emailerr + "!" : null}
                </strong>
                <div class="form-group mb-4 pt-3 col-12">
                  <Button
                    loading={loader}
                    style={{ backgroundColor: "#eb3237" }}
                    appearance="primary"
                    type="submit"
                    className="new---btn">
                    Sign In
                  </Button>
                </div>
                <div class="form-group mb-4 col-12">
                  <div class="forrm-btm">
                    Don’t have an account?{" "}
                    <a
                      className="text-decoration-none"
                      onClick={() => navigate("/app/register")}>
                      Register Now
                    </a>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPOP;
