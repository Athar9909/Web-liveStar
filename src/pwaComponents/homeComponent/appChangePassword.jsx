import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  changePassword,
  getUserProfile,
} from "../httpServices/homeHttpService/homeHttpService";
import AppFooter from "./appFooter";
import WebHeader2 from "./webHeader2";

function AppChangePassword() {
  const [detail, setDetail] = useState("");
  let ref = useRef();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    console.log(data);
    if (data.newPassword === data.confirmPassword) {
      const response = await changePassword(data);
      if (!response.data.error) {
        navigate("/app/home");
        Swal.fire({
          title: "Password Updated Sucessfully!",
          icon: "success",
          button: "ok",
        });
      }

      if (response?.data.message === "Invalid old Password") {
        Swal.fire({
          title: "Incorrect Old Password",
          icon: "error",
          button: "ok",
        });
      }
    } else {
      Swal.fire({
        title: " Confirm password should be same as new password.",
        icon: "error",
        button: "ok",
      });
    }
  };

  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    const { data } = await getUserProfile();
    if (!data.error) {
      setDetail(data.results);
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
  const togglePassword2 = () => {
    let x = document.getElementById("newPassword-input");
    if (x.type === "password") {
      x.type = "text";
      setTimeout(() => {
        x.type = "password";
      }, [2000]);
    } else {
      x.type = "password";
    }
  };
  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () =>
      document.removeEventListener("click", handleOutsideClick, true);
  }, []);
  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      document.getElementById("closeModal").click();
    }
  };
  return (
    <>
      <div className="star_imp_app">
        <div class="header-area" id="headerArea" ref={ref}>
          <div class="container h-100 d-flex align-items-center justify-content-between rtl-flex-d-row-r">
            <div class="back-button me-2 me-2">
              <Link to="/app/settings">
                <i class="fa-solid fa-arrow-left-long"></i>
              </Link>
            </div>
            <div class="page-heading">
              <h6 class="mb-0">Change Password</h6>
            </div>
            <div
              class="suha-navbar-toggler ms-2"
              data-bs-toggle="offcanvas"
              data-bs-target="#suhaOffcanvas"
              aria-controls="suhaOffcanvas"
            >
              <div>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <WebHeader2 />

        <div className="page-content-wrapper2">
          <div className="">
            <div className="container">
              <div className="profile-wrapper-area py-3">
                <div className="card user-info-card">
                  <div className="card-body p-4 d-flex align-items-center">
                    <div className="user-profile me-3">
                      <img
                        src={
                          detail?.profileImage
                            ? detail?.profileImage
                            : "/assets/img/profile_img1.png"
                        }
                        alt=""
                      />
                    </div>
                    <div className="user-info">
                      <h5 className="mb-0">{detail?.companyName}</h5>
                    </div>
                  </div>
                </div>
                <div className="card user-data-card">
                  <div className="card-body">
                    <form onSubmit={handleSubmit(onSubmit)}>
                      <div className="mb-3">
                        <div className="title mb-2">
                          <i className="fa-solid fa-key"></i>
                          <span>Old Password</span>
                        </div>
                        <input
                          type="text"
                          className="form-control form-control2"
                          name="oldPassword"
                          id="oldPassword"
                          {...register("oldPassword", {
                            required: "This field is required",
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
                        {errors?.oldPassword && (
                          <p className="form-error mt-1">
                            {errors?.oldPassword?.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-3">
                        <div className="title mb-2">
                          <i className="fa-solid fa-key"></i>
                          <span>
                            New Password{" "}
                            <span className="text-secondary"></span>
                          </span>
                        </div>
                        <input
                          type="password"
                          className="form-control form-control2"
                          name="newPassword"
                          id="newPassword-input"
                          {...register("newPassword", {
                            required: "This field is required",
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
                        <span
                          style={{
                            position: "relative",
                            left: "90%",
                            top: "-28px",
                          }}
                          onClick={togglePassword2}
                          className="fa fa-fw fa-eye field-icon toggle-password"
                        />
                        {errors?.newPassword && (
                          <p className="form-error mt-1">
                            {errors?.newPassword?.message}
                          </p>
                        )}
                      </div>
                      <div className="mb-3">
                        <div className="title mb-2">
                          <i className="fa-solid fa-key"></i>
                          <span>Confirm Password </span>
                        </div>
                        <input
                          type="password  "
                          className="form-control form-control2"
                          name="confirmPassword"
                          id="password"
                          {...register("confirmPassword", {
                            required: "This field is required",
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
                        <span
                          style={{
                            position: "relative",
                            left: "90%",
                            top: "-28px",
                          }}
                          onClick={togglePassword}
                          className="fa fa-fw fa-eye field-icon toggle-password"
                        />
                        {errors?.confirmPassword && (
                          <p className="form-error mt-1">
                            {errors?.confirmPassword?.message}
                          </p>
                        )}
                      </div>
                      <button className="comman_btn" type="submit">
                        Update Password
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <AppFooter />
      </div>
    </>
  );
}

export default AppChangePassword;
