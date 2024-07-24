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

const UserLogin = () => {
  const [loader, setLoader] = useState(false);
  const [state, setState] = useState(false);
  const navigate = useNavigate();
  const Swal = require("sweetalert2");
  const [emailerr, setEmailErr] = useState();
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}user/preLogin`;
  const autoClose = () => {
    document.getElementById("close").click();
  };
  useEffect(() => {}, [state]);
  const handleRefresh = () => {
    window.location.reload(false);
  };
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
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
          navigate("/app/login-password", { state: data?.email });
          setLoader(false);
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

  return (
    <div>
      <Navbar />
      <div class="login-new-design comman_padding marginTopLog">
        <div class="container px-4 py-0 ">
          <div
            class="row comman_divvision justify-content-center text-center shadow
          "
          >
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
                onSubmit={handleSubmit(onSubmit)}
              >
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
                    className="new---btn"
                  >
                    Sign In
                  </Button>
                </div>
                <div class="form-group mb-4 col-12">
                  <div class="forrm-btm">
                    Don’t have an account?{" "}
                    <a
                      className="text-decoration-none"
                      onClick={() => navigate("/app/register")}
                    >
                      Register Now
                    </a>
                  </div>
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

export default UserLogin;
