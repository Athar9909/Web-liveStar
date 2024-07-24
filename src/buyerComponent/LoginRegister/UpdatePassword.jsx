import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";

const UpdatePassword = (otpEmail) => {
  const navigate = useNavigate();
  const [state, setState] = useState(false);
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}user/updatePassword`;
  let email = otpEmail?.otpEmail;
  const [error, setError] = useState();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm();
  const handleRefresh = () => {
    setState(true);
  };
  const onSubmit = (data) => {
    const password = data.password;
    if (data.Npassword !== data.password) {
      setError("Password Does'nt Match");
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
            setTimeout(() => {
              navigate("/app/home");
              window.location.reload(false);
            }, 1000);
          }
        });
    }
  };
  const togglePassword2 = (e) => {
    let x = document.getElementById("passwordInput");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };
  const togglePassword = (e) => {
    let x = document.getElementById("passwordInput2");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };
  return (
    <div>
      <div className="row align-items-center justify-content-center text-center">
        <div className="col-md-8">
          <div className="comman_modal_heading">
            <h2 className="fs-2 fw-bold">Reset Your Password</h2>
            <p>Create a new password</p>
            <p>{error}</p>
          </div>
          <form
            className="forms_modal_content form-design"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control shadow-none border border-secondary"
                id="passwordInput"
                placeholder="New Password"
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
              <span
                onClick={() => togglePassword2()}
                className="fa fa-fw fa-eye field-icon toggle-password"
              />
              {errors.Npassword && (
                <small className="errorText mx-1 fw-bold">
                  {errors.Npassword?.message}
                </small>
              )}
              <label htmlFor="Password-Input" className=" fw-bolder">
                New Password
              </label>
            </div>
            <div className="form-floating mb-4">
              <input
                type="password"
                className="form-control shadow-none border border-secondary"
                placeholder="New Password"
                id="passwordInput2"
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
              <span
                onClick={() => togglePassword()}
                className="fa fa-fw fa-eye field-icon toggle-password"
              />
              {errors.password && (
                <small className="errorText mx-1 fw-bold">
                  {errors.password?.message}
                </small>
              )}
              <label htmlFor="floatingPassword" className=" fw-bolder">
                Confirm New Password
              </label>
            </div>
            <div className="form-group">
              <button href="javscript:;" type="submit" className="comman_btn">
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;
