import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import classNames from "classnames";
import Swal from "sweetalert2";
import Starlogo from "../../assets/img/logo.png";
import Navbar from "../Homepage/Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "../Footer/Footer";

const UserForgotPass = () => {
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}user/forgotPassword`;
  const [passDiss, setPassDis] = useState(false);
  const [emailDiss, setEmailDis] = useState(true);
  let navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    localStorage.setItem("userEmail", data?.email);
    data
      ? axios
          .post(apiUrl, {
            email: data.email,
            phoneNumber: data.phoneNumber,
          })
          .then((res) => {
            console.log(res?.data.results);
            if (res?.data.message === "User not registered") {
              Swal.fire({
                title: "You are not a registered User",
                text: " Register Now!",
                icon: "error",
                confirmButtonText: "GO BACK",
              });
            } else if (res?.data.message === "OTP Sent") {
              Swal.fire({
                title: "OTP SEND SUCCESS",
                text: "OTP SENT",
                icon: "success",
                confirmButtonText: "ENTER OTP",
              });
              navigate("/app/otp");
            }
          })
      : Swal.fire({
          title: "ENTER EMAIL/PHONE",
          icon: "error",
          confirmButtonText: "ok",
        });
  };

  return (
    <div>
      <Navbar />
      <div class="login-new-design comman_padding marginTopLog">
        <div class="container px-4 py-0">
          <div class="row comman_divvision justify-content-center text-center">
            <div class="col-12 login-new-img mb-lg-4 mb-md-4">
              <img src={Starlogo} alt="" />
            </div>
            <div class="col-12 login-new-heading mb-4">
              <h2>Forgot Your Password</h2>
              <span>
                Please Enter Your Registered <strong>Email/Phone</strong> Number
                to Recieve Verification Code
              </span>
            </div>
            <div class="col-lg-6 col-md-8">
              <form
                className="row login-new-form"
                onSubmit={handleSubmit(onSubmit)}>
                {emailDiss ? (
                  <div className={"form-group mb-4 col-12"}>
                    <input
                      type="email"
                      className={classNames("form-control", {
                        "is-invalid": errors.email,
                      })}
                      id="floatingEmail"
                      name="email"
                      placeholder="Enter Your Email Address"
                      {...register("email", {
                        required: "Required!",
                      })}
                    />
                    {errors.email && (
                      <small className="errorText mx-1 fw-bold">
                        {errors.email?.message}
                      </small>
                    )}
                  </div>
                ) : (
                  <div className={"form-group mb-4 col-12 "}>
                    <input
                      type="Number"
                      className={classNames("form-control ", {
                        "is-invalid": errors.phoneNumber,
                      })}
                      id="floatingNumber"
                      name="phoneNumber"
                      placeholder="Enter Your Phone Number"
                      {...register("phoneNumber", {
                        required: "Required!",
                      })}
                      onChange={(e) => {
                        let number = e.target.value;
                        if (number.length == 1) {
                          setEmailDis("okay");
                        } else if (number == 0) {
                          setEmailDis("");
                        }
                      }}
                    />
                    {errors.phoneNumber && (
                      <small className="errorText mx-1 fw-bold">
                        {errors.phoneNumber?.message}
                      </small>
                    )}
                  </div>
                )}
                <div className="form-group mb-4 mt-3">
                  <button className="comman_btn" type="submit">
                    Send Otp
                  </button>
                </div>
                <p>
                  {emailDiss ? (
                    <a onClick={() => setEmailDis(!emailDiss)}>
                      Use Phone Number instead of Email
                    </a>
                  ) : (
                    <a onClick={() => setEmailDis(!emailDiss)}>
                      Use Email Address instead of Number
                    </a>
                  )}
                </p>
                <div className="form-group mb-0 comman_text">
                  <span>
                    Didn't have access to email/phone?,
                    <a className="text-decoration-none text-dark">
                      Please Contact Admin.
                    </a>
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserForgotPass;
