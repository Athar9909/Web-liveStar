import React from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../httpServices/loginHttpService/loginHttpService";
import validator from "validator";
import { toast } from "react-toastify";

function AppForgotPassword() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    let formData = {};
    if (validator.isEmail(data.email)) {
      formData.email = data.email;
    } else if (validator.isNumeric(data.email) && data.email.length === 10) {
      formData.phoneNumber = data.email;
    } else {
      toast.error("Invalid email or phone number");
      return;
    }
    const response = await forgotPassword(formData);
    if (!response.data.error) {
      navigate("/app/otp-verification", { state: { email: data.email } });
    }
  };

  return (
    <>
      <div className="star_imp_app">
        <div className="login-wrapper d-flex align-items-center justify-content-center text-center">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-11 col-lg-8">
                <div className="logo_comman">
                  <img
                    className="big-logo"
                    src="../assets/img/logo1.png"
                    alt=""
                  />
                </div>

                <div className="register-form mt-5">
                  <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group text-start mb-4">
                      <span>Email or Phone Number</span>
                      <label for="email">
                        <i className="fa-solid fa-user"></i>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        name="email"
                        id="email"
                        {...register("email", { required: true })}
                      />

                      {errors?.email && (
                        <p className="form-error mt-1">
                          This field is required
                        </p>
                      )}
                    </div>
                    <button className="comman_btn" type="submit">
                      Reset Password
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppForgotPassword;
