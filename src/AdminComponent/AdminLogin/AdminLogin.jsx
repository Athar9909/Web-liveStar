import React from "react";
import Starlogo from "../../assets/img/logo.png";
import "../../assets/css/adminMain.css";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import Swal from "sweetalert2";

const AdminLogin = () => {
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/login`;
  const navigate = useNavigate();
  const [EmailError, setEmailError] = useState("");
  const [passError, setPassError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm();
  const onSubmit = async (data) => {
    let response = await axios
      .post(apiUrl, {
        email: data.UserName,
        password: data.password,
      })
      .then((res) => {
        console.log(res);
        if (res?.data.message === "Logged in") {
          console.log(res?.data?.results);
          localStorage.setItem("AdminLogToken", res?.data?.results.token);
          localStorage.setItem(
            "AdminData",
            JSON.stringify(res?.data?.results?.verifyAdmin)
          );
          navigate("/AdminDashboard");
        } else if (res?.data.message === "Email is not Registered") {
          Swal.fire({
            title: "Email is not registered!",
            text: "Please Register you email as Admin.",
            icon: "error",
          });
          setEmailError("Email is not Registered as Admin");
        } else if (res?.data.message === "Wrong Password") {
          Swal.fire({
            title: "Incorrect Password",
            icon: "error",
          });
          setPassError("Incorrect Password");
        }
        else if (res?.data.message === "Your account is disabled by Admin") {
          Swal.fire({
            title: "Your account is disabled by Admin",
            text: "Please Contact Admin!",
            icon: "error",
          });
          setEmailError("Email is not Registered as Admin");
        } 
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
  return (
    <div>
      <section className="login_page">
        <div className="container-fluid mx-0">
          <div className="row justify-content-start">
            <div className="col-4 p-0">
              <div className="login_page_form shadow">
                <div className="row">
                  <div className="col-12 formheader mb-4">
                    <div className="text-center mb-5">
                      <img src={Starlogo} className="logo" alt="Brand"></img>
                    </div>
                    <h1 className="fw-bold fs-3  LoginHead">
                      Login for Admin Panel
                    </h1>
                    <p className="fw-bold fs-6">
                      Please enter your email and password
                    </p>
                  </div>
                  <div className="col-12">
                    <form
                      action=""
                      className="col-12"
                      onSubmit={handleSubmit(onSubmit)}
                      autoComplete="off"
                    >
                      <div className="form-floating mb-4">
                        <input
                          type="email"
                          className={classNames(
                            "form-control  border border-secondary",
                            { "is-invalid": errors.UserName }
                          )}
                          id="floatingEmail"
                          placeholder="user@gmail.com"
                          name="UserName"
                          {...register("UserName", {
                            required: "Please Enter Your Email",
                            pattern: {
                              value:
                                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                              message: "Invalid email address",
                            },
                          })}
                        />
                        <p className="text-danger fw-bold">{EmailError}</p>
                        {errors.UserName && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.UserName?.message}
                          </small>
                        )}
                        <label
                          htmlFor="floatingUsername"
                          className="mx-2 fw-bold text-secondary"
                        >
                          Email Address
                        </label>
                      </div>
                      <div className="form-floating mb-4">
                        <input
                          type="password"
                          className={classNames(
                            "form-control  border border-secondary",
                            { "is-invalid": errors.password }
                          )}
                          id="floatingPassword"
                          placeholder="Password"
                          name="password"
                          {...register("password", {
                            required: "Enter Your Password",
                          })}
                        />
                        <p className="text-danger fw-bold">{passError}</p>

                        {errors.password && (
                          <small className="errorText mx-1 fw-bold">
                            {errors.password?.message}
                          </small>
                        )}
                        <label
                          htmlFor="floatingPassword"
                          className="mx-2 fw-bold text-secondary"
                        >
                          Password
                        </label>
                        <span
                          onClick={togglePassword}
                          className="fa fa-fw fa-eye field-icon toggle-password"
                        />
                      </div>
                      <div className="form-group forgot_password mb-md-3 mb-3">
                        <Link
                          to="/AdminForgotPassword"
                          className="text-decoration-none fs-6"
                        >
                          Forgot Your Password?
                        </Link>
                      </div>
                      <div className="form-group mb-3">
                        <button type="submit" className="comman_btn2 py-2">
                          Sign In
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;
