import axios from "axios";
import React, { useEffect, useState } from "react";
import AppHeader from "./appHeader";
import AppFooter from "./appFooter";
import { Link } from "react-router-dom";
import moment from "moment";
import { getUserProfile } from "../httpServices/homeHttpService/homeHttpService";

const AppViewSub = () => {
  const [detail, setDetail] = useState([]);

  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    const { data } = await getUserProfile();
    if (!data.error) {
      setDetail(data?.results?.subAccounts[0]);
    }
  };

  return (
    <div className="star_imp_app">
      <AppHeader />
      <div className="my_order_new">
        <div className="container">
          <div className="row">
            <div className="col-12 mb-3 mt-3">
              <div className="row mx-0 border rounded py-3 px-1 position-relative bg-white shadow">
                <span className="small_header">Account Details:</span>
                <div className="col-12 mb-1">
                  <div className="row">
                    <div className="col-12 d-flex">
                      <span className="data_main">Buyer Name :</span>
                      <span className="data_submain mx-2">
                        {detail?.firstName}
                      </span>
                    </div>  
                  </div>
                </div>

                <div className="col-12 mb-1">
                  <div className="row">
                    <div className="col-12 d-flex">
                      <span className="data_main">Copmany Name: </span>
                      <span className="data_submain mx-2">
                        {detail?.companyName}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-12 mb-1">
                  <div className="row">
                    <div className="col-12 d-flex">
                      <span className="data_main">Business Phone Number:</span>
                      <span className="data_submain mx-2  ">
                        {detail?.businessPhoneNumber}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="col-12 mb-1">
                  <div className="row">
                    <div className="col-12 d-flex">
                      <span className="data_main">Shipment Location:</span>
                      <span className="data_submain mx-2">
                        {detail?.addressLine1 +
                          "-" +
                          detail?.state +
                          "-" +
                          detail?.city +
                          "-" +
                          detail?.zipcode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <AppFooter />
    </div>
  );
};

export default AppViewSub;
