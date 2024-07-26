import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Animate from "../../Animate";
import {
  addToCart,
  deleteCart,
  searchByBarcode,
  updateCart,
} from "../httpServices/homeHttpService/homeHttpService";
import AppFooter from "./appFooter";
import WebHeader2 from "./webHeader2";
import { Loader } from "rsuite";
import { browserName } from "react-device-detect";

function AppCart() {
  const [cart, setCart] = useState([]);
  const [load, setLoad] = useState(false);
  const navigate = useNavigate();
  const [userDetail, setUserDetail] = useState([]);
  const userData = `${process.env.REACT_APP_APIENDPOINTNEW}user/getUserProfile`;
  const addQuotes = `${process.env.REACT_APP_APIENDPOINTNEW}user/quotes/shareRequest`;
  const myCart = `${process.env.REACT_APP_APIENDPOINTNEW}user/getMyCart`;
  let ref = useRef();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    getCartss();
    userInfo();
  }, []);

  const userInfo = async () => {
    await axios.get(userData).then((res) => {
      setUserDetail(res?.data?.results);
    });
  };

  const getCartss = async () => {
    await axios.post(myCart).then((res) => {
      let data = res?.data.results?.cart.products;
      setCart(res?.data.results?.cart.products);
      data?.map((item) => {
        (!item?.flavour?.flavourStatus && setIsActive(true)) ||
          (!item?.productId?.status && setIsActive(true));
      });
    });
  };
  console.log(isActive);

  const deleteProduct = async (id, flavour) => {
    setLoad(true);
    const { data } = await deleteCart({ productId: id, flavour: flavour });
    if (!data?.error) {
      setIsActive(false);
      setLoad(false);
      getCartss();
    }
  };

  const updateQuantity = async (q, id, flavour) => {
    setLoad(true);
    const formData = {
      productId: cart[id]?.productId?._id,
      quantity: q,
      flavour: cart[id]?.flavour,
    };
    const { data } = await updateCart(formData);
    if (!data.error) {
      getCartss();
      setLoad(false);
    }
  };

  const cameraScan = async () => {
    if (window.flutter_inappwebview) {
      let Dd = await window.flutter_inappwebview.callHandler("scanBarcode");
      if (Dd) {
        const { data } = await searchByBarcode({
          barcode: Dd,
        });
        if (!data.error) {
          Swal.fire({
            title: "Product Added to Cart.",
            icon: "success",
            timer: 1000,
            confirmButtonText: "Okay",
          });
          const productDetail = data?.results[0];
          const addToCartt = async () => {
            if (
              productDetail?.category?.isTobacco ||
              productDetail?.subCategory?.isTobacco
            ) {
              if (!userDetail?.istobaccoLicenceExpired) {
                const formData = {
                  productId: productDetail?._id,
                  quantity: 1,
                  flavour: productDetail?.type,
                };
                console.log(formData);
                const { data } = await addToCart(formData);
                if (!data.error) {
                  getCartss();
                }
              } else {
                Swal.fire({
                  title: "Your Tobacco licence is Expired/Invalid!",
                  text: "*Licence is Required for this product.",
                  icon: "warning",
                  confirmButtonText: "Okay",
                });
              }
            } else {
              const formData = {
                productId: productDetail?._id,
                quantity: 1,
                flavour: productDetail?.type,
              };
              console.log(formData);
              const { data } = await addToCart(formData);
              if (!data.error) {
                getCartss();
              }
            }
          };
          addToCartt();
        }
      }
    }
  };

  const HandleDecrease = async (id) => {
    setLoad(true);
    const formData = {
      productId: cart[id]?.productId?._id,
      quantity: cart[id]?.quantity - 1,
      flavour: cart[id]?.flavour,
    };
    const { data } = await updateCart(formData);
    if (!data.error) {
      setCart((cart) =>
        cart?.map((item, ind) =>
          id === ind
            ? {
                ...item,
                quantity: item?.quantity - (item?.quantity > 1 ? 1 : 0),
              }
            : item
        )
      );
      getCartss();
      setLoad(false);
    }
  };

  const HandleIncrease = async (id) => {
    console.log(id);
    setLoad(true);
    const formData = {
      productId: cart[id]?.productId?._id,
      quantity: cart[id]?.quantity + 1,
      flavour: cart[id]?.flavour,
    };
    const { data } = await updateCart(formData);
    if (!data.error) {
      setCart((cart) =>
        cart?.map((item, ind) =>
          id === ind ? { ...item, quantity: item?.quantity + 1 } : item
        )
      );
      getCartss();
      setLoad(false);
    }
  };

  const addToQuotes = async () => {
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
              <div
                class="toggle w-100"
                style={{ backgroundColor: "#eb3237" }}
                onClick={() => {
                  navigate("/app/cart");
                }}
              >
                <p className="text-white fw-bold">
                  <i class="fa fa-shopping-cart"></i> Cart ({cart?.length})
                </p>
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
        <div className="page-content-wrapper2" style={{ marginTop: "4.5rem" }}>
          <div className="container ">
            <div className=" ">
              <div className="">
                {browserName === "WebKit" ||
                browserName === "Chrome WebView" ? (
                  <div className="col-6  p-1 mb-3">
                    <div className="card-body d-flex align-items-center justify-content-between">
                      <h5 className="total-price mb-0"></h5>
                      <a
                        className="comman_btn2 text-center"
                        onClick={cameraScan}
                      >
                        Scan Barcode
                      </a>
                    </div>
                  </div>
                ) : null}
              </div>
              <div className="cart-table card mb-1">
                {browserName === "WebKit" ||
                browserName === "Chrome WebView" ? (
                  <div className="table-responsive card-body p-1">
                    {load ? <Loader speed="slow" content="Updating.." /> : null}

                    <div className=" fixed-head">
                      <table className="table mb-0 ">
                        {cart?.length ? (
                          <tbody className="">
                            {(cart || [])?.map((item, index) =>
                              item?.flavour?.flavourStatus &&
                              item?.productId?.status ? (
                                <tr key={index}>
                                  <th scope="">
                                    {item?.isTobacco ? (
                                      <span class="refFilter text-center" />
                                    ) : (
                                      ""
                                    )}
                                    <Link
                                      className="remove-product"
                                      to=""
                                      onClick={() =>
                                        deleteProduct(
                                          item?.productId._id,
                                          item?.flavour
                                        )
                                      }
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
                                        state={{ type: item?.flavour }}
                                        // className={
                                        //   item?.isTobacco ? "filter" : ""
                                        // }
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
                                        style={{
                                          userSelect: "none",
                                          background: "#fff",
                                        }}
                                        onClick={() => {
                                          HandleDecrease(index);
                                        }}
                                      >
                                        {item?.quantity <= 1 ? (
                                          <i
                                            class="fa fa-trash fs-6 text-danger"
                                            onClick={() => {
                                              deleteProduct(
                                                item?.productId._id,
                                                item?.flavour
                                              );
                                            }}
                                          ></i>
                                        ) : (
                                          <span className="text-dark">-</span>
                                        )}
                                      </span>
                                      <input
                                        className="qty-text mx-2 text-center"
                                        type="number"
                                        key={item?.quantity}
                                        id={`quantity${index}`}
                                        defaultValue={item?.quantity}
                                        onChange={(e) =>
                                          updateQuantity(e.target.value, index)
                                        }
                                      />
                                      <span
                                        className=" fs-5 fw-bold"
                                        style={{
                                          userSelect: "none",
                                          background: "#fff",
                                        }}
                                        onClick={() => {
                                          HandleIncrease(index);
                                        }}
                                      >
                                        +
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ) : (
                                <tr
                                  key={index}
                                  style={{ backgroundColor: "gray" }}
                                >
                                  <th scope="">
                                    {item?.isTobacco ? (
                                      <span class="refFilter text-center" />
                                    ) : (
                                      ""
                                    )}
                                    <Link
                                      className="remove-product"
                                      to=""
                                      onClick={() =>
                                        deleteProduct(
                                          item?.productId._id,
                                          item?.flavour
                                        )
                                      }
                                    >
                                      <i className="fa-solid fa-xmark"></i>
                                    </Link>
                                  </th>
                                  <td>
                                    <div className="cart_icon">
                                      <img
                                        className=""
                                        style={{ opacity: "20%" }}
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
                                        state={{ type: item?.flavour }}
                                        className={
                                          item?.isTobacco ? "filter" : ""
                                        }
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
                                    <br />
                                    <span className="text-dark">
                                      This Product is not available now.
                                    </span>
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        ) : (
                          <tbody className="text-center">
                            <Animate>
                              <tr className="">
                                <td className="text-center">
                                  Ahh! Your Cart is Empty <span>&#128577;</span>
                                </td>
                              </tr>
                            </Animate>
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="table-responsive card-body p-1">
                    {load ? <Loader speed="slow" content="Updating.." /> : null}

                    <div className=" fixed-head">
                      <table className="table mb-0 ">
                        {cart?.length ? (
                          <tbody className="">
                            {(cart || [])?.map((item, index) => {
                              return item?.flavour?.flavourStatus &&
                                item?.productId?.status ? (
                                <tr key={index}>
                                  <th scope="">
                                    <Link
                                      className="remove-product"
                                      to=""
                                      onClick={() =>
                                        deleteProduct(
                                          item?.productId._id,
                                          item?.flavour
                                        )
                                      }
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
                                        state={{ type: item?.flavour }}
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
                                        style={{
                                          userSelect: "none",
                                          background: "#fff",
                                        }}
                                        onClick={() => {
                                          HandleDecrease(index);
                                        }}
                                      >
                                        {item?.quantity <= 1 ? (
                                          <i
                                            class="fa fa-trash fs-6 text-danger"
                                            onClick={() => {
                                              deleteProduct(
                                                item?.productId._id,
                                                item?.flavour
                                              );
                                            }}
                                          ></i>
                                        ) : (
                                          <span className="text-dark">-</span>
                                        )}
                                      </span>
                                      <input
                                        className="qty-text mx-2 text-center"
                                        type="number"
                                        key={item?.quantity}
                                        id={`quantity${index}`}
                                        defaultValue={item?.quantity}
                                        onChange={(e) =>
                                          updateQuantity(e.target.value, index)
                                        }
                                      />
                                      <span
                                        className=" fs-5 fw-bold"
                                        style={{
                                          userSelect: "none",
                                          background: "#fff",
                                        }}
                                        onClick={() => {
                                          HandleIncrease(index);
                                        }}
                                      >
                                        +
                                      </span>
                                    </div>
                                  </td>
                                </tr>
                              ) : (
                                <tr
                                  key={index}
                                  style={{ backgroundColor: "gray" }}
                                >
                                  <th scope="">
                                    <Link
                                      className="remove-product"
                                      to=""
                                      onClick={() =>
                                        deleteProduct(
                                          item?.productId._id,
                                          item?.flavour
                                        )
                                      }
                                    >
                                      <i className="fa-solid fa-xmark"></i>
                                    </Link>
                                  </th>
                                  <td>
                                    <div className="cart_icon">
                                      <img
                                        className=""
                                        style={{ opacity: "20%" }}
                                        src={
                                          item?.flavour?._id
                                            ? item?.flavour?.flavourImage
                                            : item?.productId?.productImage
                                        }
                                        alt=""
                                      />
                                    </div>
                                  </td>
                                  <td className="text-small">
                                    {item?.flavour?._id ? (
                                      <Link
                                        to={`/app/product-detail/${item?.productId?.slug}`}
                                        state={{ type: item?.flavour }}
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
                                    <br />
                                    <span className="text-dark">
                                      This Product is not available now.
                                    </span>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        ) : (
                          <tbody className="text-center">
                            <Animate>
                              <tr className="">
                                <td className="text-center">
                                  Ahh! Your Cart is Empty <span>&#128577;</span>
                                </td>
                              </tr>
                            </Animate>
                          </tbody>
                        )}
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {cart?.length ? (
              <div className="d-flex justify-content-between p-2 ">
                <a
                  className="comman_btn2 "
                  onClick={() => {
                    if (isActive) {
                      Swal.fire({
                        title: "Please Remove Un-available products from cart!",
                        icon: "warning",
                        timer: 2000,
                      });
                    } else {
                      navigate("/app/checkout");
                    }
                  }}
                >
                  Place Order
                </a>

                {userDetail?.quotation === true ? (
                  <Link
                    className="comman_btn2 text-decoration-none mx-2"
                    onClick={addToQuotes}
                  >
                    Req. for Quote
                  </Link>
                ) : (
                  <Link
                    className="comman_btn2 text-decoration-none mx-2"
                    onClick={addToQuotes}
                    style={{ visibility: "hidden" }}
                  >
                    Req. for Quote
                  </Link>
                )}
              </div>
            ) : (
              <Link className="comman_btn " to="/app/home">
                Start Shopping
              </Link>
            )}
          </div>
        </div>
        <AppFooter />
      </div>
    </>
  );
}

export default AppCart;
