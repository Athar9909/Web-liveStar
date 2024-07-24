import axios from "axios";import classNames from "classnames";
import React, { useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "rsuite";
import Swal from "sweetalert2";

const ResetPassOrder = () => {
  // axios.defaults.headers.common["x-auth-token-vendor"] =
  //   localStorage.getItem("vendorLog");
  const navigate = useNavigate();
  const apiLogin = `${process.env.REACT_APP_APIENDPOINTNEW}vendor/updatePassword`;

  const location = useLocation();
  const email = location.state;
  const [password, setPassword] = useState();

  let name = localStorage.getItem("vendor");
  const Login = async () => {
    await axios
      .patch(apiLogin, {
        email: email,
        password: password,
      })
      .then((response) => {
        if (!response.data.error) {
          Swal.fire({
            title: response.data.message,
            icon: "success",
            button: "Okay",
            timer: 2000,
          });
          navigate(`/orderform/${name}}`);
        } else {
          Swal.fire({
            title: response.data.message,
            text: "",
            icon: "error",
            button: "Okay",
            timer: 2000,
          });
        }
      })
      .catch((err) => {
        let error = err?.response?.data?.message;
        if (err) {
          Swal.fire({
            title: error,
            text: "401 error",
            icon: "error",
            button: "Ok",
          });
        }
      });
  };

  const togglePassword = () => {
    let x = document.getElementById("floatingPassword88");
    if (x.type === "password") {
      x.type = "text";
    } else {
      x.type = "password";
    }
  };

  return (
    <div>
      <div className="">
        <div className="container marginTop p-5">
          <div className="row justify-content-center">
            <div className="col-lg-6">
              <form className=" mt-3 bg-white p-4 mb-5 shadow">
                <div className="text-center mb-5">
                  <div>
                    <img
                      className=""
                      onClick={() =>
                        (window.location.href =
                          "https://www.starimporters.com/")
                      }
                      src="https://starimporters-media.s3.amazonaws.com/1710029749556--Star%20Logo%20Tradeshow%202024.png"
                      alt="Company Logo"
                      width={200}
                      style={{
                        height: "120px",
                      }}
                    />
                    <h2 className=" mt-5 fw-bold  fs-2 text-center text-dark headOrder">
                      Create New Password
                    </h2>
                  </div>
                </div>
                <div className="row justify-content-center">
                  <div class="form-floating mb-4 col-10">
                    <input
                      type="password"
                      className="form-control shadow-none border border-secondary"
                      id="floatingPassword88"
                      name="email"
                      required
                      placeholder="name@example.com"
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                    <label
                      htmlFor="floatingPassword88"
                      className="mx-2 fw-bold"
                    >
                      New Password <span className="text-danger">*</span>
                    </label>
                    <input
                      type="checkbox"
                      onClick={togglePassword}
                      className="showPassCheck"
                    />
                    <small className=" showPass">Show Password</small>
                  </div>
                  <>
                    <div className="col-12 text-center mt-4">
                      <Button
                        onClick={() => Login()}
                        appearance="primary"
                        className="comman_btn mx-2 fw-bold"
                        style={{ backgroundColor: "#3e4093", color: "#fff" }}
                      >
                        Update
                      </Button>
                    </div>
                  </>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassOrder;
