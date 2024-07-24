import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import Footer from "../Footer/Footer";
import Navbar from "../Homepage/Navbar";
import Starlogo from "../../assets/img/logo.png";
import { Link, useNavigate } from "react-router-dom";
import OTPInput, { ResendOTP } from "otp-input-react";
const UserOtpValidate = () => {
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}user/verifyOtp`;
  const sendOtp = `${process.env.REACT_APP_APIENDPOINTNEW}user/forgotPassword`;
  const [error, setError] = useState("");
  const [counter, setCounter] = useState(60);
  const navigate = useNavigate();
  const [OTP, setOTP] = useState("");
  let email = localStorage.getItem("userEmail");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm();

  useEffect(() => {
    counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  }, [counter, email]);

  const onSubmit = async (data) => {
    if (!OTP) {
      Swal.fire({
        title: "Enter Otp.",
        text: "",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
    const VerifyUser = () => {
      axios
        .post(apiUrl, {
          email,
          otp: OTP,
        })
        .then((res) => {
          console.log(res);
          if (res?.data.message === "OTP Verified") {
            Swal.fire({
              title: "OTP Verified Successfully.",
              text: "",
              icon: "success",
              confirmButtonText: "OK",
            });
            navigate("/app/update-password", { state: email });
          } else if (res?.data.message === "Invalid OTP") {
            Swal.fire({
              title: "Invalid OTP",
              text: "Please Enter Valid OTP!",
              icon: "error",
              confirmButtonText: "Okay",
            });
          }
        });
    };
    VerifyUser();
  };

  const ResendOtp = async (e) => {
    setOTP("");
    setCounter(60);
    e.preventDefault();
    await axios
      .post(sendOtp, {
        email: email,
      })
      .then((res) => {
        console.log(res?.data.results);
        if (!res.error) {
          Swal.fire({
            title: "OTP Resent Successfully.",
            text: "Please check your registered Email.",
            icon: "success",
            confirmButtonText: "OK",
          });
        }
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
              <h2>OTP Verification</h2>
              <span>
                {" "}
                Please enter the OTP received on your registered Email Address.
              </span>
            </div>
            <div class="col-lg-6 col-md-8">
              <form
                class="row login-new-form justify-content-center"
                action=""
                onSubmit={handleSubmit(onSubmit)}>
                <div class="form-group mb-2 col-12 otp_field">
                  <OTPInput
                    value={OTP}
                    onChange={setOTP}
                    autoFocus
                    inputClassName="otp-field__input mx-2"
                    OTPLength={4}
                    otpType="number"
                    disabled={false}
                  />
                  <br />
                </div>
                <div className="time_js">
                  <span className="fw-bold fs-5" style={{ color: "#3b4093" }}>
                    {counter ? <p>00:{counter}</p> : null}
                  </span>
                </div>
                <div class="form-group mb-4 pt-0 col-12">
                  <button className="new---btn" type="submit">
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
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserOtpValidate;
