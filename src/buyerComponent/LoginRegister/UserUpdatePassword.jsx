import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Navbar from "../Homepage/Navbar";
import Footer from "../Footer/Footer";
import Starlogo from "../../assets/img/logo.png";

const UserUpdatePassword = () => {
  const navigate = useNavigate();
  const [state, setState] = useState(false);
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}user/updatePassword`;
  const [error, setError] = useState();
  let location = useLocation();
  let email = location?.state;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const password = data.password;
    if (data.Npassword !== data.password) {
      setError("Password Does'nt Match");
      Swal.fire({
        title: "Password Does not Match!",
        text: "Confirm password should be same as New password!",
        icon: "warning",
        showCloseButton: true,
        confirmButtonText: "Okay",
      });
    } else if (data.Npassword === password) {
      setError("");
      axios
        .post(apiUrl, {
          email,
          password,
        })
        .then((res) => {
          if (res?.data.message === "Password Updated Successfully") {
            Swal.fire({
              title: "Your Password Updated Successfully",
              text: "",
              icon: "success",
              showCloseButton: true,
              focusConfirm: false,
            });
            navigate("/app/home");
          }
        });
    }
  };

  const togglePassword = (e) => {
    let x = document.getElementById("passwordInput-2");
    let y = document.getElementById("passwordInput-1");
    if (x.type === "password") {
      x.type = "text";
      y.type = "text";
    } else {
      x.type = "password";
      y.type = "password";
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
              <h2>Reset Your Password</h2>
              <span> Create a new password.</span>
              <p>{error}</p>
            </div>
            <div class="col-lg-6 col-md-8">
              <div className="row align-items-center justify-content-center text-center">
                <div className="">
                  <form
                    className="forms_modal_content form-design"
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="form-group mb-2 col-12">
                      <input
                        type="password"
                        className="form-control shadow-none border border-secondary"
                        id="passwordInput-1"
                        placeholder="Enter New Password"
                        name="Npassword"
                        {...register("Npassword", {
                          required: "Enter Your Password",
                          maxLength: {
                            value: 15,
                            message: "Password Max length is 15 characters!",
                          },
                          minLength: {
                            value: 8,
                            message: "Password Min length is 8 characters!",
                          },
                        })}
                      />

                      {errors.Npassword && (
                        <small className="errorText mx-1 fw-bold">
                          {errors.Npassword?.message}
                        </small>
                      )}
                    </div>
                    <div className="form-group mb-1 col-12">
                      <input
                        type="password"
                        className="form-control  border border-secondary px-3"
                        placeholder="Confirm New Password"
                        id="passwordInput-2"
                        name="password"
                        {...register("password", {
                          required: "Enter Your Password",
                          maxLength: {
                            value: 15,
                            message: "Password Max length is 15 characters!",
                          },
                          minLength: {
                            value: 8,
                            message: "Password Min length is 8 characters!",
                          },
                        })}
                      />

                      {errors.password && (
                        <small className="errorText mx-1 fw-bold">
                          {errors.password?.message}
                        </small>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      onClick={togglePassword}
                      className="showPassCheck"
                    />
                    <small className=" showPass mb-3">Show Password</small>
                    <div className="form-group mt-4">
                      <button type="submit" className="new---btn mt-5">
                        Submit
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserUpdatePassword;
