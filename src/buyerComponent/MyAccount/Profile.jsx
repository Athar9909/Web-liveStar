import React, { useState, useEffect } from "react";
import "../../assets/css/main.css";
import axios from "axios";
import Starlogo from "../../assets/img/logo2.png";
import Swal from "sweetalert2";

const Profile = () => {
  const [fileInfo, setFileInfo] = React.useState(null);
  const [users, setUsers] = useState([]);
  const [files, setFiles] = useState([]);
  const [change, setChange] = useState(false);

  const editImage = `${process.env.REACT_APP_APIENDPOINTNEW}user/editProfile`;
  const userApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/getUserProfile`;
  console.log(fileInfo);
  axios.defaults.headers.common["x-auth-token-user"] =
    localStorage.getItem("loginToken");
  useEffect(() => {
    getUser();
  }, [change]);
  const getUser = async () => {
    await axios.get(userApi).then((res) => {
      console.log(res);
      setUsers(res?.data.results);
    });
  };
  document
    .getElementById("profileImg")
    ?.addEventListener("change", function () {
      if (this.files[0]) {
        var picture = new FileReader();
        picture.readAsDataURL(this.files[0]);
        picture.addEventListener("load", function (event) {
          document
            .getElementById("profile")
            .setAttribute("src", event.target.result);
        });
      }
    });

  console.log(files);
  const changeProfile = async (e, key) => {
    const formData = new FormData();
    formData.append("profileImage", e.target.files[0]);
    await axios.post(editImage, formData).then((res) => {
      if (res.data?.message === "Profile updated Successfully") {
        console.log("HIi");
        setChange(!change);
      }
      if (res?.data.message === "Invalid Image format") {
        Swal.fire({
          title: "Invalid Image format!",
          text: "Only Images are allowed",
          icon: "warning",
          confirmButtonText: "ok",
        });
        window.location.reload(false);
      }
    });
  };

  return (
    <div className=" mt-5">
      <div class="row myacctnew_profile align-items-center mb-lg-5 mb-4">
        <div class="col-5 ps-0">
          <div
            class="myacctnew_profilebg"
            style={{
              backgroundImage: `url(${
                users?.profileImage ? users?.profileImage : Starlogo
              })`,
            }}
            // style="background-image: url('assets/images/profile_bg.png');"
          >
            <div class="profile_picc">
              <img
                src={users?.profileImage ? users?.profileImage : Starlogo}
                alt=""
              />
            </div>
          </div>
        </div>
        <div class="col">
          <div class="myacct_detail position-relative">
            <input
              type="File"
              className="d-none"
              name="fileToUpload"
              id="fileToUpload"
              onChange={(e) => changeProfile(e, "fileToUpload")}
            />
            <a
              class="edit_btnns text-decoration-none"
              onClick={() => {
                document.getElementById("fileToUpload").click();
              }}
            >
              Edit
            </a>
            <h2>
              {users?.companyName ? users?.companyName : "Login to continue!"}
            </h2>
            <a class="acct_email text-decoration-none" href="javascript:;">
              {users?.email}
            </a>
            <a class="acct_mnumber text-decoration-none" href="javascript:;">
              {users?.phoneNumber}
            </a>
          </div>
        </div>
      </div>
      {/* <div className="col-lg-12 profile_bg  p-4">
        <div class="content ">
          <div class="carding">
            <div class="firstinfo">
              <form className="nn-form">
                <label for="fileToUpload">
                  <div
                    class="profile-pic-nn border "
                    id="profile"
                    src={users?.profileImage ? users?.profileImage : Starlogo}
                    style={{
                      backgroundImage: `url(${
                        users?.profileImage ? users?.profileImage : Starlogo
                      })`,
                      backgroundSize: "98%",
                      backgroundRepeat: "no-repeat",
                    }}
                  >
                    <span class="glyphicon glyphicon-camera"></span>
                    <span>Edit</span>
                  </div>
                  <div style={{ position: "relative" }}>
                    <span class="icon-photo glyphicon glyphicon-camera"></span>
                  </div>
                </label>
                <input
                  type="File"
                  className="nn-Input"
                  name="fileToUpload"
                  id="fileToUpload"
                  onChange={(e) => changeProfile(e, "fileToUpload")}
                />
              </form>
              <div class="profileinfo">
                <h1>
                  {users?.companyName
                    ? users?.companyName
                    : "Login to continue!"}
                </h1>
                <h3>{users?.firstName + " " + users?.lastName}</h3>
              </div>
            </div>
          </div>
          <div class="badgescard">
            {" "}
            <span class="devicons devicons-django"></span>
            <span class="devicons devicons-python"> </span>
            <span class="devicons devicons-codepen"></span>
            <span class="devicons devicons-javascript_badge"></span>
            <span class="devicons devicons-gulp"></span>
            <span class="devicons devicons-angular"></span>
            <span class="devicons devicons-sass"> </span>
          </div>
        </div>
      
      </div> */}
    </div>
  );
};

export default Profile;
