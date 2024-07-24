import axios from "axios";
import React, { useEffect, useState } from "react";
import AppHeader from "./appHeader";
import AppFooter from "./appFooter";
import { Link } from "react-router-dom";
import moment from "moment";
import { getUserProfile } from "../httpServices/homeHttpService/homeHttpService";

const AppSubAcc = () => {
  const [detail, setDetail] = useState("");
  useEffect(() => {
    getUserDetail();
  }, []);
  const getUserDetail = async () => {
    const { data } = await getUserProfile();
    if (!data.error) {
      setDetail(data.results);
    }
  };

  return (
    <div className="star_imp_app">
      <AppHeader />
      <div className="my_order_new">
        <div className="container">
          <div className="row mt-3">
            {(detail?.subAccounts || [])?.map((item, index) => (
              <div className="col-12 mb-3" key={index}>
                <Link
                  to={`/app/profile/sub-account/view/${item?._id}`}
                  className="my_orderbox position-relative shadow">
                  <div className="left_part">
                    <div className="status_order d-block">
                      Status: Active
                    </div>
                    <div className="order_id d-block mb-1">
                      Company Name: <strong>{item?.companyName}</strong>
                    </div>
                    <div className="order_id d-block mb-1">
                      Name: <strong>{item?.firstName}</strong>
                    </div>{" "}
                  </div>
                  <div className="items_box">
                    <h2>
                     Sub Account Address :{" "}
                      <strong className="fw-normal">
                        {" "}
                        <strong>{item?.addressLine1}</strong>
                        <strong>-{item?.addressLine2}</strong>
                        <strong>-{item?.city}</strong>
                        <strong>-{item?.state}</strong>
                        <strong>-{item?.zipcode}</strong>
                      </strong>
                    </h2>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
};

export default AppSubAcc;
