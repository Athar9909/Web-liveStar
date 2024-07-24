import React, { useEffect } from "react";
import "../../assets/css/adminMain.css";
import Starlogo from "../../assets/img/logo.png";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";

const AdminForgotPassword = (AdminForgotPassword) => {
  const apiUrl =  `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/forgetPassword`
  const navigate = useNavigate();
  const [EmailError, setEmailError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm();



  const onSubmit = async (data) => {
  
    let response = await axios
      .post(apiUrl, {
        email: data.UserName,
      })
      .then((res) => {
        console.log(res?.data.results ,"OTP");
        if (res?.data.message === "Otp Sent") {
          localStorage.setItem("AdminEmail",data.UserName)
          navigate("/AdminVerifyOtp");
        } else if (res?.data.message === "User not registered") {
          setEmailError("User Not Registered");
        }
      });
  };

  return (
    <div>
      <section className="login_page">
        <div className="container-fluid mx-0">
          <div className="row justify-content-start ">
            <div className="col-4 p-0">
              <div className="login_page_form shadow">
                <div className="row">
                  <div className="col-12 formheader mb-4">
                    <div className="text-center mb-5">
                      <img
                        src={Starlogo}
                        width="170"
                        height="80"
                        alt="Brand"
                      ></img>
                    </div>
                    <h1 className="fw-bold fs-4  LoginHead">Forgot Password</h1>
                    <p className="fw-bold fs-6">
                      Please enter your registered Email Address to receive the
                      OTP
                    </p>
                  </div>
                  <div className="col-12">
                    <form
                      action=""
                      className="col-12 form-design"
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
                          className="fs-6 fw-bold text-secondary"
                        >
                          Email Address
                        </label>
                      </div>

                      <div className="form-group mb-3">
                        <button type="submit" className="comman_btn2 py-2">
                          Send Otp
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

export default AdminForgotPassword;
