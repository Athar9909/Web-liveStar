import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { getUserProfile } from "../httpServices/homeHttpService/homeHttpService";
import { useRecoilValue } from "recoil";
import { notifyCount } from "../../atom";

function WebHeader2() {
  const [detail, setDetail] = useState("");
  let counter = useRecoilValue(notifyCount);
  let ref = useRef();
  useEffect(() => {
    getUserDetail();
  }, []);
  let token = localStorage.getItem("token-user");

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () =>
      document.removeEventListener("click", handleOutsideClick, true);
  }, []);

  const getUserDetail = async () => {
    const { data } = await getUserProfile();
    if (!data.error) {
      setDetail(data?.results);
    }
  };
  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      document.getElementById("closeModal").click();
    }
  };
  return (
    <>
      <div
        className="offcanvas offcanvas-start suha-offcanvas-wrap"
        tabindex="-1"
        id="suhaOffcanvas"
        aria-labelledby="suhaOffcanvasLabel">
        <button
          className="btn-close btn-close-white"
          type="button"
          id="closeModal"
          data-bs-dismiss="offcanvas"
          aria-label="Close"></button>

        <div className="offcanvas-body">
          <div className="sidenav-profile">
            <div className="user-profile-icon ms-2">
              <img
                className="userProfile"
                src={
                  detail?.profileImage
                    ? detail?.profileImage
                    : "/assets/img/favicon.png"
                }
                alt=""
              />
            </div>
            <div className="user-info">
              <h5 className="user-name mb-1 text-white">
                {detail?.companyName}
              </h5>
            </div>
          </div>

          <ul className="sidenav-nav ps-0">
            <li>
              <Link to={token ? "/app/profile" : "/app/login"}>
                <i className="fa-solid fa-user"></i>My Profile
              </Link>
            </li>
            <li>
              <Link to={token ? "/app/my-order" : "/app/login"}>
                <i className="fa-solid fa-bag-shopping"></i>My Orders
              </Link>
            </li>
            <li>
              <Link to={token ? "/app/my-request" : "/app/login"}>
                <i className="fa-solid fa-users"></i>My Quotations
              </Link>
            </li>
            <li>
              <Link to={token ? "/app/wishlist" : "/app/login"}>
                <i className="fa-solid fa-heart"></i>My Wishlist
              </Link>
            </li>
            <li>
              <Link to="/app/brands">
                <i className="fa-solid fa-ribbon"></i>Brands
              </Link>
            </li>

            <li>
              <Link to={token ? "/app/buy-again" : "/app/login"}>
                <i className="fa fa-shopping-cart mt-1" />
                Buy Again
              </Link>
            </li>

            <li>
              <Link to="/app/events/catelog&flyer">
                <i className="fa-solid fa-book"></i>Catalogs & Flyers
              </Link>
            </li>

            <li>
              <Link to={token ? "/app/settings" : "/app/login"}>
                <i className="fa-solid fa-sliders"></i>Settings
              </Link>
            </li>
            <li>
              <Link to="/app/logout">
                <i className="fa-solid fa-toggle-off"></i>{" "}
                {token ? "Sign Out" : "Log In"}
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default WebHeader2;
