import React from "react";
import "../../assets/css/main.css";
import Navbar from "../Homepage/Navbar";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import axios from "axios";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}user/contact`;
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm();
  const onSubmit = (data) => {
    const getData = async () => {
      let response = await axios
        .post(apiUrl, {
          fullName: data.firstName,
          email: data.email,
          subject: data.subject,
          messageTextArea: data.textArea,
        })
        .then((res) => {
          console.log(res?.data.message);
          if (res?.data.message === "We'll contact you ASAP") {
            swal({
              title: "Query Submitted",
              text: "We'll contact you ",
              icon: "success",
              button: "Go Back",
            }).then((res) => {
              navigate("/app/home");
            });
          }
        })
        .catch((res) => {
          console.log(res);
          if (res?.response.data?.error) {
            swal({
              title: res?.response.data.message,
              icon: "error",
              button: "Go Back",
            });
          }
        });
    };
    getData();
  };

  return (
    <div className="bg-light Contacts">
      <Navbar />

      <div className="marginTop">
        <div className="container p-5">
          <div className="row mt-4 mb-5">
            <div className="card bg-white col-lg-6 col-md-6 col-sm-12 shadow "
            style={{
              height:"100%"
            }}
            >
              <h4 className="text-center mb-3 mt-5 fs-2">CONTACT US</h4>

              <form onSubmit={handleSubmit(onSubmit)} className="p-5 mb-5">
                <div className="row mt-4">
                  <div className="col-lg-6 col-md-6 col-sm-12">
                    <label for="Name" className="form-label">
                      First Name
                    </label>
                    <input
                      type="name"
                      className="form-control bg-light p-1 fs-6"
                      id="Name"
                      name="firstName"
                      aria-describedby="emailHelp"
                      {...register("firstName", {
                        required: "Required Field",
                        pattern: {
                          value: /[A-Za-z]{1,15}/,
                          message: "No Numerical and Special Characters", // JS only: <p>error message</p> TS only support string
                        },
                      })}
                      onKeyUp={() => {
                        trigger("firstName");
                      }}
                    />
                    {errors.firstName && (
                      <small className="errorText">
                        {errors.firstName?.message}
                      </small>
                    )}
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-12 ">
                    <label for="Name" className="form-label">
                      Last Name
                    </label>

                    <input
                      type="name"
                      className="form-control bg-light p-1 fs-6 "
                      id="Name"
                      name="lastName"
                      {...register("lastName", {
                        required: "Required Field",
                        pattern: {
                          value: /[A-Za-z]{1,15}/,
                          message: "No Numerical and Special Characters", // JS only: <p>error message</p> TS only support string
                        },
                      })}
                      onKeyUp={() => {
                        trigger("lastName");
                      }}
                    />
                    {errors.lastName && (
                      <small className="errorText">
                        {errors.lastName?.message}
                      </small>
                    )}
                  </div>
                  <div className="col-lg-10 col-md-6 col-sm-12 mt-3 ">
                    <label for="Email" className="form-label">
                      Email
                    </label>

                    <input
                      type="email"
                      className="form-control bg-light p-1 fs-6"
                      id="Name"
                      name="email"
                      {...register("email", {
                        required: "Required Field",
                        pattern: {
                          value: /^[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+$/,
                          message: "In Valid Email Address", // JS only: <p>error message</p> TS only support string
                        },
                      })}
                    onKeyUp={() => {
                        trigger("email");
                      }}
                    />
                    {errors.email && (
                      <small className="errorText">
                        {errors.email?.message}
                      </small>
                    )}
                  </div>
                  <div className="col-lg-10 col-md-6 col-sm-12 mt-3 ">
                    <label for="Subject" className="form-label">
                      Subject:
                    </label>

                    <input
                      type="text"
                      className="form-control bg-light p-1 fs-6 fw-bold"
                      id="Subject"
                      name="subject"
                      {...register("subject", {
                        required: "Required Field",
                        pattern: {
                          value: /[A-Za-z]{1,15}/,
                          message: "No Numerical and Special Characters", // JS only: <p>error message</p> TS only support string
                        },
                      })}
                      onKeyUp={() => {
                        trigger("subject");
                      }}
                    />
                    {errors.subject && (
                      <small className="errorText">
                        {errors.subject?.message}
                      </small>
                    )}
                  </div>
                  <div className="col-lg-10 col-md-6 col-sm-12 mt-3 ">
                    <label for="Message" className="form-label">
                      Message:
                    </label>

                    <textarea
                      type="text"
                      className="form-control bg-light p-1 fs-6 messageBox"
                      id="Message"
                      name="textArea"
                      {...register("textArea", {
                        required: "Required Field",
                      })}
                      onKeyUp={() => {
                        trigger("textArea");
                      }}
                    />
                    {errors.lastName && (
                      <small className="errorText">
                        {errors.textArea?.message}
                      </small>
                    )}
                  </div>
                  <div className="col-lg-10 col-md-6 col-sm-12 mt-3 ">
                    <button className="btn btn-danger" type="submit">
                      {" "}
                      Submit
                    </button>
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

export default Contact;
