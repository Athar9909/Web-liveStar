import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  userLogin,
  userPreLoginPassword,
} from "../httpServices/loginHttpService/loginHttpService";
import { toast } from "react-toastify";
import validator from "validator";
import { useLocation } from "react-router-dom";

function AppPreLoginPassword() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (localStorage.getItem("token-user")) {
      navigate("/app/home");
    }
  }, []);

  useEffect(() => {}, []);

  const onSubmit = async (data) => {
    console.log(data);
    data.email = location.state.email;

    const response = await userPreLoginPassword(data);
    if (!response.data.error) {
      navigate("/app/home");

      if (response?.data.message === "Logged In") {
        localStorage.setItem("token-user", response?.data?.results.token);
        localStorage.setItem(
          "device",
          response?.data?.results.verifyUser?.deviceOS
        );
        navigate("/app/home");
        if (window.flutter_inappwebview) {
          window.flutter_inappwebview.callHandler("Flutter", data?.email);
          window.flutter_inappwebview.callHandler(
            "saveDetails",
            data?.email,
            data?.password
          );
        }
        //
      }
    }
    if (response?.data.message === "First Time Login") {
      navigate("/app/success", { state: { email: data.email } });
    }
  };
  const togglePassword = () => {
    let x = document.getElementById("password");
    if (x.type === "password") {
      x.type = "text";
      setTimeout(() => {
        x.type = "password";
      }, [2000]);
    } else {
      x.type = "password";
    }
  };
  console.log();
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
                    src="../assets/img/logo1.png"
                    alt=""
                  />
                </div>

                <div className="register-form mt-5">
                  <form onSubmit={handleSubmit(onSubmit)} autoComplete="email">
                    <div className="form-group text-start mb-4">
                      <span>Password</span>
                      <label for="password">
                        <i className="fa-solid fa-key"></i>
                      </label>

                      <input
                        type="password"
                        className="form-control"
                        placeholder="**********"
                        name="password"
                        style={{
                          fontSize: "16px",
                        }}
                        id="password"
                        {...register("password", { required: true })}
                      />
                      <span
                        style={{
                          position: "relative",
                          left: "96%",
                          top: "-25px",
                        }}
                        onClick={togglePassword}
                        className="fa fa-fw fa-eye field-icon text-end"
                      />

                      {errors?.password && (
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
                  <Link
                    className="forgot-password d-block mt-3 mb-1"
                    to="/app/forgot-password">
                    Forgot Password?
                  </Link>
                  <p className="mb-0">
                    Didn't have an account?
                    <Link className="mx-1" to="/app/register">
                      Register Now
                    </Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppPreLoginPassword;
