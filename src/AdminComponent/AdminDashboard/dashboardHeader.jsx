import React from "react";

const dashboardHeader = () => {
  return (
    <div>
      <div className="row align-items-center mx-0 justify-content-between w-100">
        <div className="col">
          <a className="sidebar_btn" href="javscript:;">
            <i className="far fa-bars" />
          </a>
        </div>
        <div className="col-auto">
          <div className="dropdown Profile_dropdown">
            <button
              className="btn btn-secondary"
              type="button"
              id="dropdownMenuButton1"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <img src="assets/img/profile.png" alt="" />
            </button>
            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li>
                <a className="dropdown-item" href="edit-profile.html">
                  Edit Profile
                </a>
              </li>
              <li>
                <a className="dropdown-item" href="change-password.html">
                  Change Password
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default dashboardHeader;
