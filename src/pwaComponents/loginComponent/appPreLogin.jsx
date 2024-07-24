import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  userPreLogin,
  userPreLoginPassword,
} from "../httpServices/loginHttpService/loginHttpService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { browserName } from "react-device-detect";

function AppPreLogin() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (localStorage.getItem("token-user")) {
      navigate("/app/home");
    }
  }, []);
  useEffect(() => {}, []);

  const onSubmit = async (data) => {
    console.log(data);
    const response = await userPreLogin(data);

    if (response.data.message === "Your ID in under review") {
      Swal.fire({
        title: "Your ID in under review",
        text: "Do you want to continue",
        icon: "error",
        button: "Ok",
      });
    }

    if (response?.data.message === "You are suspended by admin") {
      Swal.fire({
        title: "Your account has beed disabled. Please contact admin!",
        width: 600,
        icon: "error",
        button: "Ok",
      });
    }
    if (response?.data.message === "You need to provide details again") {
      Swal.fire({
        title:
          "Oops! Your registration request is declined. Please re-submit your application.",
        width: 600,
        text: "",
        icon: "error",
        button: "Go to Sign Up",
      });
      navigate("/app/re-register", { state: { email: data.email } });
    }
    if (response?.data.message === "Email is not registered") {
      toast.error("Email is not registered");
    }
    if (response?.data.message === "Please enter password") {
      navigate("/app/pre-login-password", { state: { email: data.email } });
      toast.success("Please enter password");
    }
  };
  const faceLogin = async () => {
    if (window.flutter_inappwebview) {
      let data = await window.flutter_inappwebview.callHandler(
        "loginWithFaceID"
      );
      data = data ? JSON.parse(data) : null;
      console.log(data);
      const response = await userPreLogin(data);
      if (response?.data.message === "Your ID in under review") {
        Swal.fire({
          title: "Your ID in under review",
          text: "Do you want to continue",
          icon: "error",
          button: "Ok",
        });
      }

      if (response?.data.message === "You are suspended by admin") {
        Swal.fire({
          title: "Your account has beed disabled. Please contact admin!",
          width: 600,
          icon: "error",
          button: "Ok",
        });
      }
      if (response?.data.message === "You need to provide details again") {
        Swal.fire({
          title:
            "Oops! Your registration request is declined. Please re-submit your application.",
          width: 600,
          text: "",
          icon: "error",
          button: "Go to Sign Up",
        });
        navigate("/app/re-register", { state: { email: data.email } });
      }
      if (response?.data.message === "Email is not registered") {
        toast.error("Email is not registered");
      }
      if (response?.data.message === "Please enter password") {
        const response = await userPreLoginPassword(data);
        if (!response.data.error) {
          navigate("/app/home");

          if (response?.data.message === "Logged In") {
            localStorage.setItem("token-user", response?.data?.results.token);
            navigate("/app/home");
            if (window.flutter_inappwebview) {
              window.flutter_inappwebview.callHandler("Flutter", data?.email);
              //  window.flutter_inappwebview.callHandler("saveDetails" , data?.email ,data?.password);
            }
            //
          }
        }
        if (response?.data.message === "First Time Login") {
          navigate("/app/success", { state: { email: data.email } });
        }
      }
    }
  };
  return (
    <>
      <div className="star_imp_app">
        <div className="login-wrapper d-flex align-items-center justify-content-center text-center">
          <div className="background-shape"></div>
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-11 col-lg-8">
                <div className="logo_comman">
                  <img
                    className="big-logo"
                    src={require("../../assets/img/welcomeLog2.png")}
                    alt=""
                  />
                </div>
                <div className="text-center rtl-text-right mt-4">
                  <h5 className="mb-1 text-white fs-4">
                    Welcome to StarImporters
                  </h5>
                  <p className="mt-3 text-white ">Please Login To Continue.</p>
                </div>

                <div className="register-form mt-5">
                  <form onSubmit={handleSubmit(onSubmit)} autoComplete="email">
                    <div className="form-group text-start mb-4">
                      <span>Email Address</span>
                      <label for="username">
                        <i className="fa-solid fa-user"></i>
                      </label>

                      <input
                        type="text"
                        className="form-control"
                        placeholder="User@gmail.com"
                        style={{
                          fontSize:"16px"
                        }}
                        name="email"
                        id="email"
                        autoComplete="nope"
                        autoFocus
                        {...register("email", { required: true })}
                      />

                      {errors?.email && (
                        <p className="form-error mt-1">
                          This field is required
                        </p>
                      )}
                    </div>
                    <button className="comman_btn" type="submit">
                      Log In
                    </button>
                  </form>
                </div>

                <div className="login-meta-data">
                  <p className="mb-0 mt-3">
                    Didn't have an account?
                    <Link className="mx-1" to="/app/register">
                      Register Now
                    </Link>
                  </p>
                </div>
                <div className="view-as-guest mt-2">
                  <Link className="btn" to="/app/homeGuest">
                    View as Guest
                  </Link>
                </div>
                {browserName === "WebKit" ||
                browserName === "Chrome WebView" ? (
                  <div className="view-as-guest mt-2">
                    <a className="btn" to="" onClick={faceLogin}>
                      Login with Finger Print/Face ID.
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppPreLogin;
