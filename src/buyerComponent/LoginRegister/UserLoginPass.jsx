import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import Starlogo from "../../assets/img/logo.png";
import { Button } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import Navbar from "../Homepage/Navbar";
import { userPassword } from "../../atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Footer from "../Footer/Footer";
const UserLoginPass = ({ otpEmail }) => {
  const [loader, setLoader] = useState(false);
  const navigate = useNavigate();
  const Swal = require("sweetalert2");
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}user/login`;
  let email = localStorage.getItem("userEmail");
  const setPass = useSetRecoilState(userPassword);
  const password = useRecoilValue(userPassword);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoader(true);
    await axios
      .post(apiUrl, {
        email: email,
        password: data.password,
      })
      .then((res) => {
        if (res?.data.message === "Logged In") {
          setLoader(false);
          setPass(data?.password);
          localStorage.setItem("token-user", res?.data?.results.token);
          localStorage.setItem(
            "UserData",
            JSON.stringify(res?.data?.results?.verifyUser)
          );
          Swal.fire({
            title: "You have been successfully Logged In .",
            icon: "success",
            showCloseButton: true,
            focusConfirm: false,
            timer:1000
          });
          navigate("/app/home");
        }
        if (res?.data.message === "Your ID in under review") {
          setLoader(false);
          Swal.fire({
            title: "Your ID in under review",
            text: "Do you want to continue",
            icon: "error",
            confirmButtonText: "Cool",
          });
        }
        if (res?.data.message === "You are suspended by admin") {
          setLoader(false);

          Swal.fire({
            title: "Your Account has beed disabled. Please Contact Admin!",
            width: 600,
            icon: "error",
            confirmButtonText: "Ok",
          });
        }
        if (res?.data.message === "Wrong Password") {
          setLoader(false);
          Swal.fire({
            title: "Wrong or Invalid Password!",
            width: 600,
            text: "Try again or click ‘Forgot password’ to reset it.",
            icon: "error",
            confirmButtonText: "Try again",
            timer:2000

          });
        }
        if (res?.data.message === "First Time Login") {
          setLoader(false);
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
      <Navbar />
      <div class="login-new-design comman_padding marginTopLog">
        <div class="container px-4 py-0">
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
                onSubmit={handleSubmit(onSubmit)}
              >
                <div class="form-group mb-2 col-12">
                  <input
                    type="password"
                    className={classNames(
                      "form-control  border border-secondary px-3",
                      { "is-invalid": errors.password }
                    )}
                    id="Password-2"
                    placeholder="**********"
                    name="password"
                    {...register("password", {
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
                    loading={loader}
                    style={{ backgroundColor: "#eb3237" }}
                    appearance="primary"
                    type="submit"
                    className="new---btn"
                  >
                    Sign In
                  </Button>
                </div>
                <div className="form-group">
                  <Link
                    to="/app/forgot-password"
                    className="text-decoration-none text-primary"
                    style={{ fontSize: "14px" }}
                  >
                    Forgot Your Password?
                  </Link>
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
      <Footer/>
    </div>
  );
};

export default UserLoginPass;
