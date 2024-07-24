import React from "react";
import "../../assets/css/adminMain.css";
import Starlogo from "../../assets/img/logo.png";
import classNames from "classnames";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";

const AdminResetPassword = () => {
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/updatePassword`;
  const navigate = useNavigate();
  const [error, setError] = useState("(ex:Starlove123@)");
  const [email, setEmail] = useState();
  useEffect(() => {
    const AdminEmail = localStorage.getItem("AdminEmail");
    setEmail(AdminEmail);
  }, []);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm();
  const onSubmit = (data) => {
    console.log(data);
    if (
      data?.Npassword !== data?.password ||
      data?.password !== data?.Npassword
    ) {
      setError("Passwords does not match!");
      Swal.fire({
        title: "Confirm password should same as New password!",
        icon: "error",
      });
    } else if (data.Npassword === data.password) {
      setError("");
      axios
        .post(apiUrl, {
          email,
          newPassword: data.password,
        })
        .then((res) => {
          if (res?.data.message === "Password Updated Sucessfully") {
            Swal.fire({
              title: "Password Updated Sucessfully!",
              timer:2000,
              icon: "success", 
            });
            navigate("/AdminLogin");
          }
         
        }).catch((err)=>{
          if(err.response.data.error){
            Swal.fire({
              title: "Trouble in Updating password!",
              text:err.response.data.message,
              timer:3000,
              icon: "warning", 
            });
          }
        })
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
                      <img
                        src={Starlogo}
                        width="170"
                        height="80"
                        alt="Brand"
                      ></img>
                    </div>
                    <h1 className="fw-bold fs-4  LoginHead">Reset Password</h1>
                    <p className="fw-lighter fs-6 text-danger">
                      {error?.length ? error : null}
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
                          type="text"
                          className="form-control shadow-none border border-secondary"
                          id="floatingPassword"
                          placeholder="New Password"
                          name="Npassword"
                          {...register("Npassword", {
                            required: "Enter Your Password",
                            // pattern: {
                            //   value:
                            //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            //   message:
                            //     "Password must be 8 characters including one uppercase letter, one special character and alphanumeric characters (ex.StarnewUser123@)",
                            // },
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
                          <small className="errorText mx-1  fw-bold">
                            {errors.Npassword?.message}
                          </small>
                        )}
                        <label
                          htmlFor="floatingPassword"
                          className=" fs-6 fw-bolder"
                        >
                          New Password
                        </label>
                      </div>
                      <div className="form-floating mb-4">
                        <input
                          type="text"
                          className="form-control shadow-none border border-secondary"
                          id="floatingPassword"
                          placeholder="New Password"
                          name="password"
                          {...register("password", {
                            required: "Enter Your Password",
                            // pattern: {
                            //   value:
                            //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                            //   message:
                            //     "Password must be 8 characters including one uppercase letter, one special character and alphanumeric characters (ex.StarnewUser123@)",
                            // },
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
                        <label
                          htmlFor="floatingPassword"
                          className="fs-6 fw-bolder"
                        >
                          Confirm New Password
                        </label>
                      </div>
                      <div className="form-group">
                        <button
                          href="javscript:;"
                          type="submit"
                          className="comman_btn"
                        >
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
      </section>
    </div>
  );
};

export default AdminResetPassword;
