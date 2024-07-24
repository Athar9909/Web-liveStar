import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Footer from "../Footer/Footer";
import Navbar from "../Homepage/Navbar";
import Select from "react-select";
const Checkout = () => {
  const userApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/getUserProfile`;
  const newOrder = `${process.env.REACT_APP_APIENDPOINTNEW}user/order/newOrder`;
  const quoteOrder = `${process.env.REACT_APP_APIENDPOINTNEW}user/quotes/quoteToOrder`;
  const [users, setUsers] = useState();
  const [comments, setComments] = useState("");
  const [delevryChoice, setDelevryChoice] = useState("In-Store Pickup");
  const navigate = useNavigate();
  const location = useLocation();
  const autoClose = () => {
    document.getElementById("close").click();
  };
  const [userType, setUserType] = useState({ type: "ParentAcc" });
  const [subAccList, setSubAccList] = useState([]);
  const [multipleUsers, setMultipleUsers] = useState(false);
  let MainId = localStorage.getItem("objectId");
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    await axios.get(userApi).then((res) => {
      console.log(res);
      setUsers(res?.data.results);
      setMultipleUsers(res?.data.results?.multipleUsers);
      setSubAccList(res?.data.results?.subAccounts);
    });
  };

  const newAddress = async (id) => {
    console.log(id);
    subAccList?.map((item, ind) => {
      if (item?._id === id) {
        setUsers(item);
        setUserType({ type: item?.accountType, id: item?._id });
      } else if (id === MainId) {
        getUser();
        setUserType({ type: "ParentAcc" });
      }
    });
  };

  const createOrder = async () => {
    if (delevryChoice == "Shipment") {
      await axios
        .post(newOrder, {
          type: "Shipment",
          address: users?.addressLine1 + users?.addressLine2,
          comments: comments,
          orderedBy: userType?.type,
          subUserId: userType?.id,
        })
        .then((res) => {
          console.log(res);
          if (!res.data.error) {
            Swal.fire({
              title: "Order Placed!",
              text: "You can Track your order on my account",
              icon: "success",
              confirmButtonText: "View Order",
            }).then((data) => {
              if (
                res?.data.message === "Your account has been disabled by admin"
              ) {
                navigate("/app/home");
              } else {
                navigate(`/app/order-detail/${res?.data.results?.order._id}`);
              }
            });
          } else if (res?.data.message === "Tobacco licence expired!") {
            Swal.fire({
              title: res?.data.message,
              icon: "error",
              confirmButtonText: "Okay",
            });
          } else if (
            res?.data.message === "Sub Account's Tobacco licence expired!"
          ) {
            Swal.fire({
              title: res?.data.message,
              icon: "error",
              confirmButtonText: "Okay",
            });
          }
        });
    } else if (delevryChoice == "Delivery") {
      await axios
        .post(newOrder, {
          type: "Delivery",
          address: users?.addressLine1 + users?.addressLine2,
          comments: comments,
          orderedBy: userType?.type,
          subUserId: userType?.id,
        })
        .then((res) => {
          console.log(res);

          if (!res.data.error) {
            Swal.fire({
              title: "Order Placed!",
              text: "You can Track your order on my account",

              icon: "success",
              confirmButtonText: "View Order",
            }).then((data) => {
              navigate(`/app/order-detail/${res?.data.results?.order._id}`);
            });
          } else if (res?.data.message === "Tobacco licence expired!") {
            Swal.fire({
              title: res?.data.message,
              icon: "error",
              confirmButtonText: "Okay",
            });
          } else if (
            res?.data.message === "Sub Account's Tobacco licence expired!"
          ) {
            Swal.fire({
              title: res?.data.message,
              icon: "error",
              confirmButtonText: "Okay",
            });
          }
        });
    } else if (delevryChoice == "In-Store Pickup") {
      await axios
        .post(newOrder, {
          type: "In-Store Pickup",
          address: users?.addressLine1 + users?.addressLine2,
          comments: comments,
          orderedBy: userType?.type,
          subUserId: userType?.id,
        })
        .then((res) => {
          console.log(res);

          if (!res.data.error) {
            Swal.fire({
              title: "Order Placed!",
              text: "You can Track your order on my account",
              icon: "success",
              confirmButtonText: "View Order",
            }).then((data) => {
              navigate(`/app/order-detail/${res?.data.results?.order._id}`);
            });
          } else if (res?.data.message === "Tobacco licence expired!") {
            Swal.fire({
              title: res?.data.message,
              icon: "error",
              confirmButtonText: "Okay",
            });
          } else if (
            res?.data.message === "Sub Account's Tobacco licence expired!"
          ) {
            Swal.fire({
              title: res?.data.message,
              icon: "error",
              confirmButtonText: "Okay",
            });
          }
        });
    } else if (delevryChoice == "UPS") {
      await axios
        .post(newOrder, {
          type: "UPS",
          address: users?.addressLine1 + users?.addressLine2,
          comments: comments,
          orderedBy: userType?.type,
          subUserId: userType?.id,
        })
        .then((res) => {
          console.log(res);

          if (!res.data.error) {
            Swal.fire({
              title: "Order Placed!",
              text: "You can Track your order on my account",
              icon: "success",
              confirmButtonText: "View Order",
            }).then((data) => {
              navigate(`/app/order-detail/${res?.data.results?.order._id}`);
            });
          } else if (res?.data.message === "Tobacco licence expired!") {
            Swal.fire({
              title: res?.data.message,
              icon: "error",
              confirmButtonText: "Okay",
            });
          } else if (
            res?.data.message === "Sub Account's Tobacco licence expired!"
          ) {
            Swal.fire({
              title: res?.data.message,
              icon: "error",
              confirmButtonText: "Okay",
            });
          }
        });
    }
  };

  const createQuoteOrder = async () => {
    if (delevryChoice == "Shipment") {
      await axios
        .post(quoteOrder, {
          type: "Shipment",
          address: users?.addressLine1 + users?.addressLine2,
          comments: comments,
          quoteId: location?.state?.id,
        })
        .then((res) => {
          if (!res.error) {
            Swal.fire({
              title: "Order Placed!",
              text: "You can Track your order on my account",
              icon: "success",
              confirmButtonText: "View Order",
              timer: 2000,
            }).then((data) => {
              navigate(`/app/order-detail/${res?.data.results?.order._id}`);
            });
          }
        });
    } else if (delevryChoice == "Delivery") {
      await axios
        .post(quoteOrder, {
          type: "Delivery",
          address: users?.addressLine1 + users?.addressLine2,
          comments: comments,
          quoteId: location?.state?.id,
        })
        .then((res) => {
          if (!res.error) {
            Swal.fire({
              title: "Order Placed!",
              text: "You can Track your order on my account",

              icon: "success",
              confirmButtonText: "View Order",
              timer: 2000,
            }).then((data) => {
              navigate(`/app/order-detail/${res?.data.results?.order._id}`);
            });
          }
        });
    } else if (delevryChoice == "In-Store Pickup") {
      await axios
        .post(quoteOrder, {
          type: "In-Store Pickup",
          address: users?.addressLine1 + users?.addressLine2,
          comments: comments,
          quoteId: location?.state?.id,
        })
        .then((res) => {
          if (!res.error) {
            Swal.fire({
              title: "Order Placed!",
              text: "You can Track your order on my account",
              icon: "success",
              confirmButtonText: "View Order",
              timer: 2000,
            }).then((data) => {
              navigate(`/app/order-detail/${res?.data.results?.order._id}`);
            });
          }
        });
    }
  };

  return (
    <div>
      <Navbar />
      <section className="comman_banner _banner marginTop">
        <div className="container">
          <div className="row">
            <div className="col-12 pt-4">
              <h1>Checkout</h1>
              <div className="breadcrumbs mt-2">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="item_nanner">
                      <Link
                        to="/app/home"
                        className="text-decoration-none text-white fs-6  ">
                        Home <span className="arrow mx-2">&#9679;</span>{" "}
                      </Link>
                    </li>
                    <li className="item_nanner">
                      <Link
                        to="/app/cart"
                        className="text-decoration-none text-white fs-6  ">
                        Cart <span className="arrow mx-2">&#9679;</span>{" "}
                      </Link>
                    </li>
                    <li className="breadcrumb-item" aria-current="page">
                      <Link
                        to=""
                        className="text-decoration-none text-white fs-6">
                        Checkout
                      </Link>
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
      <>
        <section
          className="Checkout_page py-5"
          // style={{ backgroundColor: "#eef3ff" }}
        >
          <div className="container bg-white shadow">
            <div className="row p-4 align-items-end">
              <div className="col-12 mb-2">
                <div className="chosse_location">
                  <div className="w-100 d-flex justify-content-between">
                    {" "}
                    <h3>Checkout</h3>
                    <h3
                      style={{
                        width: "20rem",
                      }}>
                      {multipleUsers && (
                        <select
                          className={
                            "form-select border border-secondary signup_fields fw-bolder"
                          }
                          id="floatingSelect1"
                          aria-label="Floating label select example"
                          name="city"
                          onChange={(e) => {
                            newAddress(e.target.value);
                          }}>
                          {/* <option value="">Select Another Account....</option> */}
                          <option value={MainId}>Main Account</option>

                          {subAccList?.map((itm, id) => (
                            <option value={itm?._id}>
                              Sub-Account : {itm?.companyName}
                            </option>
                          ))}
                        </select>
                      )}
                      {console.log(users)}

                      {/* <Select
                        // defaultValue={[colourOptions[0], colourOptions[1]]}
                        // isMulti
                        options={options}
                        onChange={handleChange}
                        // onInputChange={handleInputChangeUser}
                        placeholder="Select Another Store..."
                      /> */}
                    </h3>
                  </div>

                  {users?.state === "Georgia" ? (
                    <form className="row" action="">
                      <div className="form-group col-3 custom_radio">
                        <input
                          type="radio"
                          defaultChecked="true"
                          className="d-none"
                          value={true}
                          id="new_radio"
                          name="radioo"
                          onClick={() => {
                            setDelevryChoice("In-Store Pickup");
                          }}
                        />
                        <label htmlFor="new_radio">In-Store Pickup</label>
                      </div>
                      <div className="form-group col-3 custom_radio">
                        <input
                          type="radio"
                          className="d-none"
                          value={true}
                          onClick={() => {
                            setDelevryChoice("Delivery");
                          }}
                          id="new_radio1"
                          name="radioo"
                        />
                        <label htmlFor="new_radio1">Delivery</label>
                      </div>
                      <div className="form-group col-3 custom_radio">
                        <input
                          type="radio"
                          className="d-none"
                          value={true}
                          id="new_radio2"
                          name="radioo"
                          onClick={() => {
                            setDelevryChoice("Shipment");
                          }}
                        />
                        <label htmlFor="new_radio2">Shipment</label>
                      </div>
                      <div className="form-group col-3 custom_radio">
                        <input
                          type="radio"
                          className="d-none"
                          value={true}
                          id="new_radio3"
                          name="radioo"
                          onClick={() => {
                            setDelevryChoice("UPS");
                          }}
                        />
                        <label htmlFor="new_radio3">UPS</label>
                      </div>
                    </form>
                  ) : (
                    <form className="row" action="">
                      <div className="form-group col-3 custom_radio">
                        <input
                          type="radio"
                          defaultChecked="true"
                          className="d-none"
                          value={true}
                          id="new_radio"
                          name="radioo"
                          onClick={() => {
                            setDelevryChoice("In-Store Pickup");
                          }}
                        />
                        <label htmlFor="new_radio">In-Store Pickup</label>
                      </div>
                      <div className="form-group col-3 custom_radio">
                        <input
                          type="radio"
                          className="d-none"
                          id="new_radio2"
                          onClick={() => {
                            setDelevryChoice("Shipment");
                          }}
                          value={true}
                          name="radioo"
                        />
                        <label htmlFor="new_radio2">Shipment</label>
                      </div>

                      <div className="form-group col-3 custom_radio">
                        <input
                          type="radio"
                          className="d-none"
                          id="new_radio3"
                          onClick={() => {
                            setDelevryChoice("UPS");
                          }}
                          value={true}
                          name="radioo"
                        />
                        <label htmlFor="new_radio3">UPS</label>
                      </div>

                    </form>
                  )}
                </div>
              </div>

              <div className="col-12 pt-1 mb-4">
                {(delevryChoice == "Shipment" && (
                  <strong>(Shipment charges will be applicable)</strong>
                )) ||
                  (delevryChoice == "Delivery" && (
                    <strong>
                      {users?.cityAndState?.day?.length ? (
                        <>
                          (Your schedule delivery days{":"}
                          {users?.cityAndState?.day.map((item) => item + ",")})
                        </>
                      ) : (
                        <>
                          (Unfortunately we dont deliver to this location please
                          select In-store pick up or shipment.)
                        </>
                      )}
                      <br />
                      Minimum invoice amount of $1000 is required for delivery
                      (Excluding Tobacco products).
                    </strong>
                  ))}
                {delevryChoice == "Shipment" || delevryChoice == "Delivery" ? (
                  <div className="row mx-0 Checkout_address mt-3">
                    <span>Address :</span>

                    <h2>{users?.firstName}</h2>
                    <p className="mb-0">
                      {users?.addressLine1 +
                        "," +
                        users?.city +
                        "," +
                        users?.state +
                        "-" +
                        users?.zipcode}{" "}
                    </p>
                  </div>
                ) : (
                  <div className="row mx-0 Checkout_address">
                    <span>Store Address :</span>
                    <h2>Star Importers</h2>
                    <p className="mb-0">
                      <i className="fas fa-map-signs" /> 2166 Mountain
                      Industrial Blvd, Tucker, GA 30084, United States
                      <br />
                      <i className="fas fa-phone-alt" /> +1 770-908-0404
                    </p>
                  </div>
                )}
                <div className="row mx-0 Checkout_address mt-4">
                  <div className="col-12">
                    <span> Comments (optional) </span>
                    <div className="">
                      <textarea
                        className="form-control form-control2"
                        style={{ height: "5rem" }}
                        type="text"
                        placeholder="Enter your comments...."
                        onChange={(e) => setComments(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              {console.log(location)}
              {delevryChoice == "Delivery" ? (
                <div className="col-12 text-start">
                  {users?.cityAndState?.day?.length ? (
                    <button
                      className="comman_btn"
                      onClick={
                        location?.state?.type === "quote"
                          ? createQuoteOrder
                          : createOrder
                      }>
                      Place Order
                    </button>
                  ) : (
                    <button
                      className="comman_btn text-grey"
                      style={{
                        backgroundColor: "GrayText",
                        textDecoration: "line-through ",
                        cursor: "not-allowed",
                      }}>
                      Place Order
                    </button>
                  )}
                </div>
              ) : (
                <div className="col-12 text-start">
                  <button
                    className="comman_btn"
                    onClick={
                      location?.state?.type === "quote"
                        ? createQuoteOrder
                        : createOrder
                    }>
                    Place Order
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
      </>
      <Footer />
    </div>
  );
};

export default Checkout;
