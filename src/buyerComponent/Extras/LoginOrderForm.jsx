import axios from "axios";import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "rsuite";
import Swal from "sweetalert2";

const LoginOrderForm = () => {
  // axios.defaults.headers.common["x-auth-token-vendor"] =
  //   localStorage.getItem("vendorLog");
  const generatePass = `${process.env.REACT_APP_APIENDPOINTNEW}vendor/forgetPassword`;
  let { name } = useParams();
  const navigate = useNavigate();
  const apiLogin = `${process.env.REACT_APP_APIENDPOINTNEW}vendor/login`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState();

  console.log(name);

  const Login = async () => {
    if (email === name) {
      await axios
        .patch(apiLogin, {
          email: email,
          password: password,
        })
        .then((response) => {
          if (!response.data.error) {
            localStorage.removeItem("vendorLog");
            localStorage.setItem("vendorLog", response?.data?.results.token);
            !response?.data?.results?.firstTimeLogin
              ? navigate(
                  `/app/OrderForm/${response?.data?.results.vendor.email}`
                )
              : navigate(`/app/OrderForm/ResetPassword`, {
                  state: response?.data?.results.vendor.email,
                });
          } else {
            Swal.fire({
              title: response.data.message,
              text: "",
              icon: "error",
              button: "Okay",
              timer: 2000,
            });
          }
        })
        .catch((err) => {
          let error = err?.response?.data?.message;
          if (err) {
            Swal.fire({
              title: error,
              text: "401 error",
              icon: "error",
              button: "Ok",
            });
          }
        });
    } else {
      Swal.fire({
        title: "Email Error!",
        text: "Please use your specified vendor portal or Enter your correct registered email.",
        icon: "warning",
        confirmButtonText: "Okay",
      });
    }
  };

  const GeneratePassword = async () => {
    if (!email?.length) {
      Swal.fire({
        title: "Please enter valid email address!",
        text: "Enter email address in email field.",
        icon: "warning",
        confirmButtonText: "Okay",
        showCloseButton: true,
        timer: 2000,
      });
    }
    await axios
      .patch(generatePass, {
        email: email,
      })
      .then((res) => {
        if (res?.data.message === "New Password Generated") {
          Swal.fire({
            title: "Password Sent Successfully",
            text: "Email has been sent to your registered email address.",
            icon: "success",
            confirmButtonText: "Okay",
            showCloseButton: true,
            timer: 5000,
          });
        } else {
          Swal.fire({
            title: res.data.message,
            text: "Entered email address is not valid.",
            icon: "error",
            button: "Okay",
            timer: 2000,
          });
        }
      });
  };

  const togglePassword = () => {
    let x = document.getElementById("floatingPassword88");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  return (
    <div>
      <div className="">
        <div
          className="container"
          style={{
            padding: "80px 20px",
          }}
        >
          <div className="row justify-content-center align-item-center">
            <div className="col-lg-6">
              <form className=" mt-3 bg-white p-4 mb-5 shadow">
                <div className="text-center mb-5">
                  <div>
                    <img
                      className=""
                      onClick={() =>
                        (window.location.href =
                          "https://www.starimporters.com/")
                      }
                      src="https://starimporters-media.s3.amazonaws.com/1710029749556--Star%20Logo%20Tradeshow%202024.png"
                      alt="Company Logo"
                      style={{
                        width: "clamp(80px, 50%, 200px)",
                      }}
                    />
                    <h2 className=" mt-5 fw-bold  fs-2 text-center text-dark headOrder">
                      LOGIN
                    </h2>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div className="form-floating col-10 mb-4">
                    <input
                      style={{
                        fontWeight: 500,
                        color: "#1A0F1C",
                      }}
                      type="email"
                      className="form-control shadow-none border border-secondary"
                      id="floatingPassword4"
                      name="email"
                      required
                      placeholder="name@example.com"
                      onChange={(e) => {
                        setEmail(e.target.value);
                      }}
                    />

                    <label htmlFor="floatingPassword4" className="mx-2 fw-bold">
                      Email Address <span className="text-danger">*</span>
                    </label>
                  </div>

                  <div class="form-floating mb-4 col-10">
                    <input
                      type="password"
                      style={{
                        fontWeight: 500,
                        color: "#1A0F1C",
                      }}
                      className="form-control shadow-none border border-secondary"
                      id="floatingPassword88"
                      name="email"
                      required
                      placeholder="name@example.com"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <label
                      htmlFor="floatingPassword88"
                      className="mx-2 fw-bold"
                    >
                      Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="checkbox"
                      onClick={togglePassword}
                      className="showPassCheck"
                    />
                    <small className=" showPass">Show Password</small>
                  </div>
                  <>
                    <div className="col-10 text-center mt-4">
                      <Button
                        onClick={() => Login()}
                        appearance="primary"
                        className="comman_btn  fw-bold"
                        style={{ backgroundColor: "#3e4093", color: "#fff" }}
                      >
                        Login
                      </Button>
                    </div>
                    <p className="fs-6 text-center mt-3 text-secondary">
                      *Forgot your password.
                      <Link
                        onClick={() => GeneratePassword()}
                        className="text-decoration-none mx-1"
                      >
                        Click here.
                      </Link>
                    </p>
                  </>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOrderForm;
