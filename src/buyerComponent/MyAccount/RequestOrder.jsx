import React, { useState, useEffect } from "react";
import Footer from "../Footer/Footer";
import Navbar from "../Homepage/Navbar";
import { Link, useNavigate } from "react-router-dom";
import "../../assets/css/main.css";
import axios from "axios";
import Profile from "./Profile";
import moment from "moment";

const RequestOrders = () => {
  const [quotes, setQuotes] = useState([]);
  const userApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/getUserProfile`;
  const getQuotes = `${process.env.REACT_APP_APIENDPOINTNEW}user/quotes/requestHistory`;
  let token = localStorage.getItem("token-user");
  const navigate = useNavigate();
  useEffect(() => {
    GetQuote();
  }, []);

  const GetQuote = async () => {
    await axios.get(getQuotes).then((res) => {
      setQuotes(res?.data.results);
    });
  };
  console.log(quotes);
  return (
    <div class="myacct_data_inner">
      <div class="row">
        <div class="col-12 data_head mb-4">
          <h2>My Quotation Request:</h2>
        </div>
        {(quotes || [])?.map((item, index) => (
          <div class="col-md-6 mb-4">
            <div
              class="order-new-box"
              onClick={() => navigate(`/app/request-detail/${item?.quoteId}`)}
              // state={{ id: item?._id }}
            >
              <div class="row">
                <div class="col-6 mb-1 pe-0">
                  <div class="orderID">
                    Order ID: <strong>{item?.quoteId}</strong>
                  </div>
                </div>
                <div class="col-6 mb-1">
                  <div class="status-box">
                    Status: <span>{item?.status}</span>
                  </div>
                </div>
                <div class="col-12 mb-2">
                  <div class="datee_part">
                    {moment(item?.createdAt?.slice(0, 10)).format("MM/DD/YYYY")}
                  </div>
                </div>
                <div class="col-12 items_part">
                  <div class="items_head">Items:</div>
                  {(item?.products || []).map((item, ind) => (
                    <ul className="list-unstyled mb-0">
                      <li key={ind}>
                        <strong>
                          {item?.flavour?._id
                            ? item?.productId?.unitName +
                              "-" +
                              item?.flavour?.flavour
                            : item?.productId?.unitName}
                        </strong>
                      </li>
                    </ul>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestOrders;
