import React, { useState, useEffect } from "react";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import AppFooter from "./appFooter";
import AppHeader from "./appHeader";
import moment from "moment";
import { browserName } from "react-device-detect";
import Swal from "sweetalert2";

function AppRequestDetail() {
  const getQuoteDetails = `${process.env.REACT_APP_APIENDPOINTNEW}user/quotes/singleRequest`;
  const addInCart = `${process.env.REACT_APP_APIENDPOINTNEW}user/quotes/quoteToCart`;
  const [quoteDetails, setQuoteDetails] = useState([]);
  let navigate = useNavigate();
  let {id} = useParams();

  useEffect(() => {
    const GetQuote = async () => {
      await axios
        .post(getQuoteDetails, {
          quoteId: id,
        })
        .then((res) => {
          setQuoteDetails(res?.data.results?.quotes);
        });
    };
    GetQuote();
  }, []);

  const addToCart = async () => {
    const { data } = await axios.get(addInCart + "/" + quoteDetails?._id);
    if (!data.error) {
      navigate("/app/cart");
      Swal.fire({
        title: "Product Added to Cart",
        icon: "success",
        timer: 2000,
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-shopping-cart"></i> Cart!',
        confirmButtonAriaLabel: "Thumbs up, Okay!",
        cancelButtonText: "Close",
      }).then((res) => {
        if (res.isConfirmed) {
          navigate("/app/cart");
        }
      });
    }
  };

  return (
    <>
      <div className="star_imp_app">
        <AppHeader />
        <div className="my_order_new">
          <div className="container">
            <div className="row">
              <div className="col-12 mb-3">
                <div className="d-flex justify-content-between px-1 mt-0">
                  <Link
                    className="comman_btn2 m-2"
                    to="/app/checkout"
                    state={{ type: "quote", id: quoteDetails?._id }}>
                    Place Order
                  </Link>

                  <Link
                    className="comman_btn2 text-decoration-none m-2"
                    onClick={addToCart}
                  >
                    Add to Cart
                  </Link>
                </div>
                <div className="row mx-0 border rounded py-3 px-1 position-relative bg-white shadow">
                  <span className="small_header">Request Details:</span>
                  <div className="col-12 mb-1">
                    <div className="row">
                      <div className="col-6">
                        <span className="data_main">Request Date :</span>
                      </div>
                      <div className="col-6">
                        <span className="data_submain">
                          {moment(quoteDetails?.createdAt?.slice(0, 10)).format(
                            "MM/DD/YYYY"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mb-1">
                    <div className="row">
                      <div className="col-6">
                        <span className="data_main">Request Id :</span>
                      </div>
                      <div className="col-6">
                        <span className="data_submain">
                          {quoteDetails?.quoteId}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="col-12 mb-1">
                    <div className="row">
                      <div className="col-6">
                        <span className="data_main">Total Products :</span>
                      </div>
                      <div className="col-6">
                        <span className="data_submain">
                          {quoteDetails?.products?.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* {browserName === "WebKit" || browserName === "Chrome WebView" ? (
                <div className="col-12 mb-3">
                  <div className="row mx-0 border rounded position-relative bg-white shadow cart-table">
                    <div className="table-responsive card-body">
                      <table className="table mb-0">
                        <tbody>
                          {(quoteDetails?.products || [])?.map(
                            (item, index) => (
                              <tr
                                key={index}
                                className={
                                  item?.productId?.isTobaccoProduct
                                    ? "filter"
                                    : ""
                                }>
                                <td>
                                  <div className="cart_icon">
                                    <img
                                      className=""
                                      src={item?.flavour?.flavourImage}
                                      alt=""
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="order_items">
                                    <Link
                                      to={`/app/product-detail/${item?.productId?.slug}`}>
                                      {item?.productId?.unitName}
                                    </Link>
                                   
                                    <div className="bar_code mt-1 d-flex">
                                      Price: $<span>{item?.price}</span>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="quantity">
                                    <input
                                      className="qty-text"
                                      type="text"
                                      value={item?.quantity}
                                      disabled
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="quantity">
                                    <input
                                      className="qty-text2"
                                      type="text"
                                      disabled
                                      value={"$" + item?.quantity * item?.price}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : ( */}
                <div className="col-12 mb-3">
                  <div className="row mx-0 border rounded position-relative bg-white shadow cart-table">
                    <div className="table-responsive card-body">
                      <table className="table mb-0">
                        <tbody>
                          {(quoteDetails?.products || [])?.map(
                            (item, index) => (
                              <tr key={index}>
                                <td>
                                  <div className="cart_icon">
                                    <img
                                      className=""
                                      src={item?.flavour?.flavourImage}
                                      alt=""
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="order_items">
                                    <Link
                                      to={`/app/product-detail/${item?.productId?.slug}`}>
                                      {item?.productId?.unitName}
                                    </Link>
                                    {/* <div className="bar_code mt-1">
                                Bar Code:{" "}
                                <span>
                                  {item?.flavour.barcode.map((item) => (
                                    <li>{item}</li>
                                  ))}
                                </span>
                              </div> */}
                                    <div className="bar_code mt-1 d-flex">
                                      Price: $<span>{item?.price}</span>
                                    </div>
                                  </div>
                                </td>
                                <td>
                                  <div className="quantity">
                                    <input
                                      className="qty-text"
                                      type="text"
                                      value={item?.quantity}
                                      disabled
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="quantity">
                                    <input
                                      className="qty-text2"
                                      type="text"
                                      disabled
                                      value={"$" + item?.quantity * item?.price}
                                    />
                                  </div>
                                </td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              {/* )} */}
            </div>
          </div>
        </div>
        <AppFooter />
      </div>
    </>
  );
}

export default AppRequestDetail;
