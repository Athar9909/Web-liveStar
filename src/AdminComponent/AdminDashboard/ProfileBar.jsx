import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProfileBar = () => {
  const getAdmin = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getAdminData`;
  const [adminData, setAdminData] = useState([]);
  const navigate = useNavigate()
  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");
  useEffect(() => {
    let token = localStorage.getItem("AdminLogToken");
    if (!token) {
      Swal.fire({
        title: "Un-Authenticated Request",
        text: "Please Login!",
        icon: "error",
        confirmButtonText: "okay",
      }).then((res)=>{
        navigate("/AdminLogin")
      })
    }
    const GetAdminData = async () => {
      await axios.get(getAdmin).then((res) => {
        setAdminData(res?.data.results.admin);
      });
    };
    GetAdminData();
  }, []);

  return (
    <div className="">
      <div className="dropdown  mt-1">
        <div>
          <div class="dropdownsp">
            <button class="dropdown-btnsp">
              <img
                className="bg-white "
                src={adminData?.adminProfile ? adminData?.adminProfile : require("../../assets/img/product.jpg")}
                alt=""
                width={50}
              />
            </button>
            <div class="dropdown-contentsp">
              <a href="#">
                <Link
                  className="text-decoration-none "
                  to="/AdminDashboard/EditProfile"
                >
                  Edit Profile
                </Link>
              </a>
              <a href="#">
                <Link
                  className="text-decoration-none"
                  to="/AdminDashboard/changePassword"
                >
                  Change Password
                </Link>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBar;
