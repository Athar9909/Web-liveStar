import React from "react";
import "../../assets/css/adminMain.css";
import Starlogo from "../../assets/img/logo.png";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";

const AdminSendOtp = ({ AdminEmail }) => {
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/verifyOtp`;
  const sendOtp = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/forgetPassword`;
  const [counter, setCounter] = useState(60);
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [email, setEmail] = useState();

  useEffect(() => {
    const AdminEmail = localStorage.getItem("AdminEmail");
    setEmail(AdminEmail);
  }, []);

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter]);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm();

  const onSubmit = async (data) => {
    const tempOtp = data.number1 + data.number2 + data.number3 + data.number4;
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
            navigate("/AdminResetPassword");
          } else if (res?.data.message === "Invalid OTP") {
            setError("Invalid Otp");
          }
        });
    };
    VerifyUser();
  };
  const moveOnMax = (event, field, nextFieldID) => {
    event = event || window.event;
    if (event.keyCode != 9) {
      if (field.value.length >= field.maxLength) {
        nextFieldID.focus();
      }
    }
  };
  const ResendOtp = async (e) => {
    setCounter(60);
    e.preventDefault();
    await axios
      .post(sendOtp, {
        email: email,
      })
      .then((res) => {
        console.log(res?.data.results);
        if (!res.error) {
          setSuccess("OTP Re-sent Successfully.");
        }
      });
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
                      <img
                        src={Starlogo}
                        width="170"
                        height="80"
                        alt="Brand"
                      ></img>
                    </div>
                    <h1 className="fw-bold fs-3 mx-3  LoginHead">
                      Verification
                    </h1>
                    <p className="fw-bold fs-6 mx-3">
                      Please enter the OTP received on your Email.
                    </p>
                  </div>
                  <div className="col-12">
                    <form
                      className="forms_modal_content otp_part"
                      onSubmit={handleSubmit(onSubmit)}
                      autocomplete="off"
                    >
                      <div className="form-group mb-3 d-flex justify-content-center">
                        <input
                          className="form-control shadow-none border border-secondary text-center mx-1 otp_input "
                          type="number"
                          maxLength={1}
                          name="number1"
                          id="number1"
                          {...register("number1", {
                            required: "Please Enter OTP.",
                          })}
                          onKeyUp={(event) => {
                            moveOnMax(
                              event,
                              document.getElementById("number1"),
                              document.getElementById("number2")
                            );
                          }}
                        />

                        <input
                          className="form-control shadow-none border border-secondary text-center mx-1 otp_input"
                          type="number"
                          maxLength={1}
                          name="number2"
                          id="number2"
                          {...register("number2", {
                            required: "Please Enter OTP",
                          })}
                          onKeyUp={(event) => {
                            moveOnMax(
                              event,
                              document.getElementById("number2"),
                              document.getElementById("number3")
                            );
                          }}
                        />
                        <input
                          className="form-control shadow-none border border-secondary text-center mx-1 otp_input"
                          type="number"
                          maxLength={1}
                          name="number3"
                          id="number3"
                          {...register("number3", {
                            required: "Please Enter OTP",
                          })}
                          onKeyUp={(event) => {
                            moveOnMax(
                              event,
                              document.getElementById("number3"),
                              document.getElementById("number4")
                            );
                          }}
                        />
                        <input
                          className="form-control shadow-none border border-secondary text-center mx-1 otp_input"
                          type="number"
                          maxLength={1}
                          name="number4"
                          id="number4"
                          {...register("number4", {
                            required: "Please Enter OTP",
                          })}
                        />
                      </div>
                      <div className="mx-3 mb-3">
                        {errors.number1 && (
                          <small className="errorText mx-5 fw-bold fs-6 text-center">
                            {errors.number1?.message}
                          </small>
                        )}
                      </div>
                      <div className="form-group my-3 text-center">
                        <div className="time_js">
                          <span
                            className="fw-bold fs-5"
                            style={{ color: "#e3b4093" }}
                          >
                            {counter ? <p> 00:{counter}</p> : null}
                          </span>
                        </div>
                      </div>
                      <div className="fs-6 text-danger fw-bold">{error}</div>
                      <div className="form-group mb-4 d-flex justify-content-center">
                        <button className="comman_btn2  " type="submit">
                          Submit
                        </button>
                      </div>
                      <div className="fw-bold text-center">
                        <a className="text-decoration-none mb-3 text-success mx-5">
                          {success}
                        </a>
                      </div>

                      <div className="form-group mt-3 comman_text d-flex justify-content-center ">
                        Didn't receive the OTP?{" "}
                        {counter ? (
                          <span
                            className="otp-sec mx-1 fs-6 text-dark"
                            id="resendOTP"
                            style={{pointer:"cursor"}}
                          >
                            Check Your Email.
                          </span>
                        ) : (
                          <span
                            className="otp-sec mx-1 fs-6 text-dark"
                            id="resendOTP"
                            style={{pointer:"cursor"}}
                            onClick={ResendOtp}
                          >
                            Resent OTP
                          </span>
                        )}
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

export default AdminSendOtp;
