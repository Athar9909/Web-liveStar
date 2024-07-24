import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  countProducts,
  getUserProfile,
} from "../httpServices/homeHttpService/homeHttpService";
import {
  browserName,
  browserVersion,
  deviceDetect,
  deviceType,
} from "react-device-detect";
import {
  appBrandProd,
  appCateProd,
  appFeaturedProd,
  appSubProd,
  searchKeyRemove,
} from "../../atom";
import { useSetRecoilState } from "recoil";

function AppHeader({ cartCount }) {
  const [detail, setDetail] = useState("");
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const navigate = useNavigate();
  const setData = useSetRecoilState(appCateProd);
  const setData2 = useSetRecoilState(appSubProd);
  const setData3 = useSetRecoilState(appBrandProd);
  const setData4 = useSetRecoilState(appFeaturedProd);
  const setSearchkey = useSetRecoilState(searchKeyRemove);

  useEffect(() => {
    getUserDetail();
    getCartCount();
  }, [cartCount]);

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () =>
      document.removeEventListener("click", handleOutsideClick, true);
  }, []);

  let token = localStorage.getItem("token-user");

  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      document.getElementById("closeModal").click();
    }
  };

  const getUserDetail = async () => {
    const { data } = await getUserProfile();
    if (!data?.error) {
      setDetail(data?.results);
    }
  };
  const getCartCount = async () => {
    const { data } = await countProducts();
    if (!data?.error) {
      setCount(data?.results.productCount);
    }
  };

  return (
    <>
      <div className="header_main">
        <div className=" " id="headerArea" ref={ref}>
          <div className="container-fluid ">
            <div className="d-flex py-1">
              <div className="suha-navbar-toggler">
                <i
                  data-bs-toggle="offcanvas"
                  data-bs-target="#suhaOffcanvas"
                  aria-controls="suhaOffcanvas"
                  class="fa-solid fa-bars fs-5 mt-2"></i>
              </div>
              <div className="logo-wrapper">
                <Link
                  to="/app/home"
                  onClick={() => {
                    setSearchkey(true);
                    setData2([{ page: 1, sortBy: 1 }]);
                    setData3([{ page: 1, sortBy: 1 }]);
                    setData4([{ page: 1, sortBy: 1 }]);
                    setData([{ page: 1, sortBy: 1 }]);
                  }}>
                  <img src={require("../../assets/img/logo.png")} alt="" />
                </Link>
              </div>
              {/* {browserName !== "Mobile Safari" ? null : (
              <div>
                <a
                  className="appdownload_btn "
                  target="_blank"
                  href="https://apps.apple.com/app/star-importers-wholesalers/id6447689704">
                  <img
                    src={require("../../assets/img/app-store.png")}
                    className="dwn_btn"
                    alt=""
                  />
                </a>
              </div>
            )}
            {browserName !== "Chrome" ? null : (
              <div>
                <a
                  className="appdownload_btn"
                  target="_blank"
                  href="https://play.google.com/store/apps/details?id=com.star_importers">
                  <img
                    className="dwn_btn"
                    src={require("../../assets/img/play-store.png")}
                    alt=""
                    style={{
                      width:"6rem"
                    }}
                  />
                </a>
              </div>
            )} */}

              <div className="navbar-logo-container d-flex align-items-end">
                <div
                  className={
                    token
                      ? "cart-icon-wrap opacity-100"
                      : "cart-icon-wrap opacity-0"
                  }>
                  <Link to="/app/cart">
                    <i className="fa-solid fa-bag-shopping"></i>
                    <span>{count}</span>
                  </Link>
                </div>

                <div className="user-profile ms-2">
                  <Link to={token ? "/app/profile" : "/app/login"}>
                    <img
                      className="headerProfile"
                      src={
                        detail?.profileImage
                          ? detail?.profileImage
                          : "/assets/img/logo.png"
                      }
                      alt=""
                    />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
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
            <div className="">
              <div className="mb-2">
                <img
                  style={{
                    width: "120px",
                    height: "120px",
                    borderRadius: "50%",
                    marginLeft: "40px",
                  }}
                  src={
                    detail?.profileImage
                      ? detail?.profileImage
                      : "/assets/img/logo.png"
                  }
                />
              </div>
              <div className="user-info">
                <h5 className="user-name  text-white text-center mt-3">
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
              {detail?.quotation && (
                <li>
                  <Link to={token ? "/app/my-request" : "/app/login"}>
                    <i className="fa-solid fa-users"></i>My Quotation
                  </Link>
                </li>
              )}

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
      </div>
    </>
  );
}

export default AppHeader;
