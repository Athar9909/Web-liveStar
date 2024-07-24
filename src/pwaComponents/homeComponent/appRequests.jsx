import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import AppFooter from "./appFooter";
import AppHeader from "./appHeader";
import moment from "moment";

function AppRequests() {
  const getQuotes = `${process.env.REACT_APP_APIENDPOINTNEW}user/quotes/requestHistory`;

  const [orderDetails, setOrderDetails] = useState([]);

  useEffect(() => {
    const GetOrders = async () => {
      await axios.get(getQuotes).then((res) => {
        setOrderDetails(res?.data?.results);
      });
    };
    GetOrders();
  }, []);
  return (
    <>
      <div className="star_imp_app">
        <AppHeader />
        <div className="my_order_new ">
          <div className="container">
            {orderDetails?.length ? (
              <div className="row">
                {(orderDetails || [])?.map((item, index) => (
                  <div className="col-12 mb-3" key={index}>
                    <Link
                      to={`/app/request-detail/${item?.quoteId}`}
                      className="my_orderbox position-relative shadow"
                    >
                      <div className="left_part">
                        <div className="status_order d-block">
                          Status: {item?.status}
                        </div>
                        <div className="order_id d-block mb-1">
                          Request ID: <strong>{item?.quoteId}</strong>
                        </div>
                        <div className="date_box">
                          {moment(item?.createdAt?.slice(0, 10)).format(
                            "MM/DD/YYYY"
                          )}
                        </div>
                      </div>
                      <div className="items_box">
                        <h2>Items :</h2>
                        {(item?.products || []).map((item, ind) => (
                          <ul className="list-unstyled mb-0">
                            <li key={ind}>
                              {item?.flavour?._id
                                ? item?.productId?.unitName +
                                  "-" +
                                  item?.flavour?.flavour
                                : item?.productId?.unitName}
                            </li>
                          </ul>
                        ))}
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center">
                You have not submitted any request!
              </div>
            )}
          </div>
        </div>
        <AppFooter />
      </div>
    </>
  );
}

export default AppRequests;
