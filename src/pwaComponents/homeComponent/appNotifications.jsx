import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppFooter from "./appFooter";
import AppHeader from "./appHeader";

function AppNotifications() {
  const allNotify = `${process.env.REACT_APP_APIENDPOINTNEW}user/notify/getAllNotifications `;
  const deleteNotify = `${process.env.REACT_APP_APIENDPOINTNEW}user/notify/removeOne`;
  const deleteAllNotify = `${process.env.REACT_APP_APIENDPOINTNEW}user/notify/removeAll`;
  const [notifications, setNotifications] = useState();
  useEffect(() => {
    getNotifications();
  }, []);
  const getNotifications = async () => {
    await axios.get(allNotify).then((res) => {
      setNotifications(res?.data.results?.notifications);
    });
  };
  const RemoveAll = async () => {
    await axios.post(deleteAllNotify).then((res) => {
      if (!res.err) {
        getNotifications();
      }
    });
  };

  return (
    <>
      <div className="star_imp_app">
        <AppHeader />
        <div className="page-content-wrapper">
          <div className="container">
            <div className="section-heading d-flex align-items-center pt-3 justify-content-between rtl-flex-d-row-r">
              <h6>Notification(s)</h6>
              <a
                className="notification-clear-all text-secondary"
                onClick={RemoveAll}
              >
                Clear All
              </a>
            </div>

            <div className="notification-area pb-2">
              <div className="list-group">
                {notifications?.map((item, index) => (
                  <Link
                    className="list-group-item d-flex align-items-center border-0"
                    to="/app/notification-detail"
                    key={index}
                  >
                    <span className="noti-icon">
                      <i className="fa-solid fa-bell"></i>
                    </span>
                    <div className="noti-info">
                      <h6 className="mb-0">{item?.title}</h6>
                      <span>12 min ago</span>
                    </div>
                  </Link>
                ))}

                {/* <Link
                  className="list-group-item d-flex align-items-center border-0"
                  to="/app/notification-detail"
                >
                  <span className="noti-icon">
                    <i className="fa-solid fa-gift"></i>
                  </span>
                  <div className="noti-info">
                    <h6 className="mb-0">Black Friday Deals in One Place</h6>
                    <span>49 min ago</span>
                  </div>
                </Link>
                <Link
                  className="list-group-item d-flex align-items-center border-0"
                  to="/app/notification-detail"
                >
                  <span className="noti-icon">
                    <i className="fa-solid fa-reply"></i>
                  </span>
                  <div className="noti-info">
                    <h6 className="mb-0">
                      Share your experience, it's matters!
                    </h6>
                    <span>58 min ago</span>
                  </div>
                </Link>
                <Link
                  className="list-group-item readed d-flex align-items-center border-0"
                  to="/app/notification-detail"
                >
                  <span className="noti-icon">
                    <i className="fa-solid fa-ship"></i>
                  </span>
                  <div className="noti-info">
                    <h6 className="mb-0">Your order has been delivered.</h6>
                    <span>Yesterday</span>
                  </div>
                </Link>
                <Link
                  className="list-group-item readed d-flex align-items-center border-0"
                  to="/app/notification-detail"
                >
                  <span className="noti-icon">
                    <i className="fa-solid fa-heart"></i>
                  </span>
                  <div className="noti-info">
                    <h6 className="mb-0">Your wishlist is updated.</h6>
                    <span>2 days ago</span>
                  </div>
                </Link>
                <Link
                  className="list-group-item readed d-flex align-items-center border-0"
                  to="/app/notification-detail"
                >
                  <span className="noti-icon">
                    <i className="fa-solid fa-bolt"></i>
                  </span>
                  <div className="noti-info">
                    <h6 className="mb-0">11% Price drop! Hurry up.</h6>
                    <span>2 days ago</span>
                  </div>
                </Link>
                <Link
                  className="list-group-item readed d-flex align-items-center border-0"
                  to="/app/notification-detail"
                >
                  <span className="noti-icon">
                    <i className="fa-solid fa-percent"></i>
                  </span>
                  <div className="noti-info">
                    <h6 className="mb-0">Use 30% Discount Code</h6>
                    <span>3 days ago</span>
                  </div>
                </Link>
                <Link
                  className="list-group-item readed d-flex align-items-center border-0"
                  to="/app/notification-detail"
                >
                  <span className="noti-icon">
                    <i className="fa-solid fa-ship"></i>
                  </span>
                  <div className="noti-info">
                    <h6 className="mb-0">Your order has been delivered.</h6>
                    <span>Yesterday</span>
                  </div>
                </Link>
                <Link
                  className="list-group-item readed d-flex align-items-center border-0"
                  to="/app/notification-detail"
                >
                  <span className="noti-icon">
                    <i className="fa-solid fa-heart"></i>
                  </span>
                  <div className="noti-info">
                    <h6 className="mb-0">Your wishlist is updated.</h6>
                    <span>2 days ago</span>
                  </div>
                </Link>
                <Link
                  className="list-group-item readed d-flex align-items-center border-0"
                  to="/app/notification-detail"
                >
                  <span className="noti-icon">
                    <i className="fa-solid fa-bolt"></i>
                  </span>
                  <div className="noti-info">
                    <h6 className="mb-0">11% Price drop! Hurry up.</h6>
                    <span>2 days ago</span>
                  </div>
                </Link>
                <Link
                  className="list-group-item readed d-flex align-items-center border-0"
                  to="/app/notification-detail"
                >
                  <span className="noti-icon">
                    <i className="fa-solid fa-percent"></i>
                  </span>
                  <div className="noti-info">
                    <h6 className="mb-0">Use 30% Discount Code</h6>
                    <span>3 days ago</span>
                  </div>
                </Link> */}
              </div>
            </div>
          </div>
        </div>
        <AppFooter />
      </div>
    </>
  );
}

export default AppNotifications;
