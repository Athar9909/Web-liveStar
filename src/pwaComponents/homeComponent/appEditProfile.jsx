import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  editProfile,
  getUserProfile,
} from "../httpServices/homeHttpService/homeHttpService";
import AppFooter from "./appFooter";
import WebHeader2 from "./webHeader2";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

function AppEditProfile() {
  const [detail, setDetail] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const navigate = useNavigate();
  let ref = useRef();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    const { data } = await getUserProfile();
    if (!data.error) {
      setDetail(data.results);

      let defaultValues = {};
      defaultValues.firstName = data.results.firstName;
      defaultValues.lastName = data.results.lastName;
      defaultValues.addressLine = data.results.addressLine;

      reset({ ...defaultValues });
      if (data?.results?.profileImage) {
        setImageFile(data?.results?.profileImage);
      }
    }
  };

  const onSubmit = async (data) => {
    console.log(data);

    const formData = new FormData();
    for (const item in data) {
      formData.append(item, data[item]);
    }

    if (selectedFile) {
      formData.append("profileImage", selectedFile, selectedFile.name);
    }

    const response = await editProfile(formData);
    if (!response.data.error) {
      Swal.fire({
        title: "Profile updated successfully!",
        icon: "success",
        button: "ok",
      });
      navigate("/app/profile");
    }
  };

  const onFileSelection = (event) => {
    console.log(event);
    let file = event.target.files[0];
    if (file && file.size < 2880) {
      toast.error("Minimum File size should be 1MB.");
      return;
    } else if (file && file.size > 5242880) {
      toast.error("File size exceeded. Max size should be 5MB.");
      return;
    } else {
      // Update the state
      console.log(file);
      setImageFile(URL.createObjectURL(file));
      setSelectedFile(file);
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
        <div class="header-area " id="headerArea" ref={ref}>
          <div class="container h-100 d-flex align-items-center justify-content-between rtl-flex-d-row-r">
            <div class="back-button me-2 me-2">
              <Link to="/app/profile">
                <i class="fa-solid fa-arrow-left-long"></i>
              </Link>
            </div>
            <div class="page-heading">
              <h6 class="mb-0">Edit Profile</h6>
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
          <div className="container">
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="profile-wrapper-area py-3">
                <div className="card user-info-card">
                  <div className="card-body p-4 d-flex align-items-center">
                    <div className="user-profile me-3">
                      <img
                        src={imageFile ? imageFile : "../assets/img/logo.png"}
                        alt=""
                      />
                      <div className="change-user-thumb">
                        <input
                          className="form-control-file"
                          type="file"
                          accept="image/*"
                          id="input-file"
                          onChange={(e) => onFileSelection(e)}
                        />
                        <button>
                          <i className="fa-solid fa-pen"></i>
                        </button>
                      </div>
                    </div>
                    <div className="user-info">
                      <h5 className="mb-0">{detail.companyName}</h5>
                    </div>
                  </div>
                </div>

                <div className="card user-data-card">
                  <div className="card-body">
                    <div className="mb-3">
                      <div className="title mb-2">
                        <i className="fa-solid fa-at"></i>
                        <span>First Name</span>
                      </div>
                      <input
                        className="form-control form-control2"
                        type="text"
                        name="firstName"
                        id="firstName"
                        {...register("firstName", { required: true })}
                      />

                      {errors?.firstName && (
                        <p className="form-error mt-1">
                          This field is required
                        </p>
                      )}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2">
                        <i className="fa-solid fa-user"></i>
                        <span>Last Name</span>
                      </div>
                      <input
                        className="form-control form-control2"
                        type="text"
                        name="lastName"
                        id="lastName"
                        {...register("lastName", { required: true })}
                      />

                      {errors?.lastName && (
                        <p className="form-error mt-1">
                          This field is required
                        </p>
                      )}
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2">
                        <i className="fa-solid fa-phone"></i>
                        <span>Phone</span>
                      </div>
                      <input
                        className="form-control form-control2"
                        type="number"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={detail.phoneNumber}
                        disabled
                      />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2">
                        <i className="fa-solid fa-envelope"></i>
                        <span>Email Address</span>
                      </div>
                      <input
                        type="text"
                        className="form-control form-control2"
                        name="email"
                        id="email"
                        disabled
                        value={detail.email}
                      />
                    </div>
                    <div className="mb-3">
                      <div className="title mb-2">
                        <i className="fa-solid fa-location-arrow"></i>
                        <span>Shipping Address</span>
                      </div>
                      <input
                        className="form-control form-control2"
                        type="text"
                        disabled
                        placeholder=""
                        name="addressLine"
                        id="addressLine"
                        {...register("addressLine")}
                      />

                      {errors?.addressLine && (
                        <p className="form-error mt-1">
                          This field is required
                        </p>
                      )}
                    </div>
                    <button className="comman_btn" type="submit">
                      Save All Changes
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <AppFooter />
      </div>
    </>
  );
}

export default AppEditProfile;
