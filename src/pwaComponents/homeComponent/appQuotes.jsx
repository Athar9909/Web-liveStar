import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Animate from "../../Animate";
import {
  deleteCart,
  deleteQuote,
  getCart,
  getQuotes,
  updateCart,
  updateQuote,
} from "../httpServices/homeHttpService/homeHttpService";
import AppFooter from "./appFooter";
import WebHeader2 from "./webHeader2";

function AppQuotes() {
  const addQuotes = `${process.env.REACT_APP_APIENDPOINTNEW}user/quotes/shareRequest`;
  const productRemove = `${process.env.REACT_APP_APIENDPOINTNEW}user/quotes/removeQuoteProducts`;
  const [quotes, setQuotes] = useState([]);
  const navigate = useNavigate();
  let ref = useRef();
  useEffect(() => {
    getAllQuotes();
  }, []);

  const getAllQuotes = async () => {
    const { data } = await getQuotes();
    if (!data?.error) {
      setQuotes(data?.results[0]?.products);
    }
  };
  const addtoQuotes = async () => {
    await axios.post(addQuotes).then((res) => {
      if (!res?.error) {
        Swal.fire({
          title: "Your Quotation Request Has Submitted!",
          text: "Check Status here",
          icon: "success",
          button: "Ok",
        });
        navigate("/app/my-request");
      }
    });
  };
  const deleteProduct = async (index) => {
    await axios
      .post(productRemove, {
        productId: quotes[index].productId?._id,
        flavour: quotes[index].flavour,
      })
      .then((res) => {
        getAllQuotes();
      });
  };

  const HandleDecrease = async (id) => {
    const formData = {
      productId: quotes[id]?.productId?._id,
      quantity: quotes[id]?.quantity - 1,
      flavour: quotes[id]?.flavour,
    };
    const { data } = await updateQuote(formData);
    if (!data.error) {
      setQuotes((quotes) =>
        quotes?.map((item, ind) =>
          id === ind
            ? {
                ...item,
                quantity: item?.quantity - (item?.quantity > 1 ? 1 : 0),
              }
            : item
        )
      );
      getAllQuotes();
    }
  };

  const HandleIncrease = async (id) => {
    console.log(id);
    const formData = {
      productId: quotes[id]?.productId?._id,
      quantity: quotes[id]?.quantity + 1,
      flavour: quotes[id]?.flavour,
    };
    const { data } = await updateQuote(formData);
    if (!data.error) {
      setQuotes((quotes) =>
        quotes?.map((item, ind) =>
          id === ind ? { ...item, quantity: item?.quantity + 1 } : item
        )
      );
      getAllQuotes();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () =>
      document.removeEventListener("click", handleOutsideClick, true);
  }, []);
  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      document.getElementById("closeModal").click();
    }
  };

  return (
    <>
      <div className="star_imp_app">
        <div class="header-area" id="headerArea" ref={ref}>
          <div class="container h-100 d-flex align-items-center justify-content-between rtl-flex-d-row-r">
            <div class="back-button me-2 me-2">
              <Link to="/app/home">
                <i className="fa-solid fa-house"></i>
              </Link>
            </div>

            <div id="container">
              <div class="inner-container">
                <div
                  class="toggle"
                  style={{ backgroundColor: "#eb3237" }}
                  onClick={() => {
                    navigate("/app/quotes");
                  }}
                >
                  <p className="text-white fw-bold">Quotes</p>
                </div>
                <div
                  class="toggle"
                  onClick={() => {
                    navigate("/app/cart");
                  }}
                >
                  <p className="text-dark fw-bold">Cart</p>
                </div>
              </div>
            </div>
            <div
              class="suha-navbar-toggler ms-2"
              data-bs-toggle="offcanvas"
              data-bs-target="#suhaOffcanvas"
              aria-controls="suhaOffcanvas"
            >
              <div>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <WebHeader2 />
        <div className="page-content-wrapper2">
          <div className="container">
            <div className="cart-wrapper-area py-3">
              <div className="cart-table card mb-3">
                <div className="table-responsive card-body">
                  <table className="table mb-0">
                    {quotes.length ? (
                      <tbody>
                        {(quotes || []).map((item, index) => {
                          return (
                            <tr>
                              <th scope="row">
                                <Link
                                  className="remove-product"
                                  to=""
                                  onClick={() => deleteProduct(index)}
                                >
                                  <i className="fa-solid fa-xmark"></i>
                                </Link>
                              </th>
                              <td>
                                <div className="cart_icon">
                                  <img
                                    className=""
                                    src={
                                      item?.flavour?._id
                                        ? item?.flavour?.flavourImage
                                        : item?.productId?.productImage
                                    }
                                    alt=""
                                  />
                                </div>
                              </td>
                              <td>
                                {item?.flavour?._id ? (
                                  <Link
                                    to={`/app/product-detail/${item?.productId?.slug}`}
                                  >
                                    {item?.productId?.unitName +
                                      "-" +
                                      item?.flavour?.flavour}
                                  </Link>
                                ) : (
                                  <Link
                                    to={`/app/product-detail/${item?.productId?.slug}`}
                                  >
                                    {item?.productId?.unitName}
                                  </Link>
                                )}

                                <div className="quantity d-flex mt-1">
                                  <span
                                    className="minus fs-5 fw-bold"
                                    style={{ userSelect: "none" }}
                                    onClick={() => {
                                      HandleDecrease(index);
                                    }}
                                  >
                                    {item?.quantity <= 1 ? (
                                      <i
                                        class="fa fa-trash fs-6 text-danger"
                                        onClick={() => deleteProduct(index)}
                                      ></i>
                                    ) : (
                                      "-"
                                    )}
                                  </span>
                                  <input
                                    className="qty-text mx-2"
                                    type="text"
                                    id={`quantity${index}`}
                                    value={item?.quantity}
                                    disabled
                                  />
                                  <span
                                    className="plus fs-5 fw-bold"
                                    style={{ userSelect: "none" }}
                                    onClick={() => {
                                      HandleIncrease(index);
                                    }}
                                  >
                                    +
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    ) : (
                      <tbody>
                        <Animate>
                          <tr>
                            <td className="text-center">
                              Ahh! Your Quotes Bag is Empty{" "}
                              <span>&#128577;</span>
                            </td>
                          </tr>
                        </Animate>
                      </tbody>
                    )}
                  </table>
                </div>
              </div>

              <div className="card cart-amount-area">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <h5 className="total-price mb-0"></h5>
                  {quotes.length ? (
                    <Link className="comman_btn" onClick={addtoQuotes}>
                      Send Request
                    </Link>
                  ) : (
                    <Link className="comman_btn" to="/app/home">
                      Start Shopping
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>{" "}
        <AppFooter />
      </div>
    </>
  );
}

export default AppQuotes;
