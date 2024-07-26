import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import AppFooter from "./appFooter";
import AppHeader from "./appHeader";
import { browserName } from "react-device-detect";

function AppBuyAgain() {
  const products = `${process.env.REACT_APP_APIENDPOINTNEW}user/order/purchasedProducts`;
  const addInCart = `${process.env.REACT_APP_APIENDPOINTNEW}user/order/buyAgain`;
  const [purchasedProd, setPurchasedProd] = useState();
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(false);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async () => {
    await axios.post(products).then((res) => {
      setPurchasedProd(res?.data.results.products);
    });
  };

  const handleClick = (e, flavour, productId, quantity, i) => {
    const { id, checked } = e.target;
    console.log(id, checked);
    if (checked) {
      let Array = [...selected];
      Array.push({ flavour, productId, quantity });
      setSelected(Array);
    }
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
      setSelected(selected.filter((item) => item?.productId !== productId));
    }
  };

  const handleSelectAll = (e) => {
    const { checked } = e.target;
    setIsCheckAll(!isCheckAll);
    let Nitem = [...isCheck];
    purchasedProd?.map((li) =>
      li.products?.map((val, ind) => Nitem.push(val.flavour?._id))
    );
    console.log(Nitem);
    setIsCheck(Nitem);
    let allData = [...selected];
    (purchasedProd || [])?.map((item, index) =>
      item.products?.map((val, ind) =>
        allData.push({
          flavour: val?.flavour,
          productId: val?.productId?._id,
          quantity: val?.quantity,
        })
      )
    );
    setSelected(allData);
    console.log(checked);
    if (isCheckAll) {
      setIsCheck([]);
    }
    if (!checked) {
      setSelected([]);
    }
  };

  const AddtoCart = async (e) => {
    if (selected == []) {
      Swal.fire({
        title: "Please Select any product!",
        icon: "error",
        showConfirmButton: "okay",
      });
    }
    const { data } = await axios.post(addInCart, {
      products: selected,
    });
    if (!data.error) {
      setCartCount(!cartCount);
      setIsCheck([]);
      setIsCheckAll(false);
      Swal.fire({
        title: "Product Added to Cart",
        icon: "success",
        showCloseButton: true,
        showCancelButton: true,
        focusConfirm: false,
        confirmButtonText: '<i class="fa fa-shopping-cart"></i> Cart!',
        confirmButtonAriaLabel: "Thumbs up, Okay!",
        cancelButtonText: "Close",
      }).then((res) => {
        if (res.isConfirmed) {
          navigate("/app/cart", { state: "jii" });
        }
      });
    }
    if (data.error) {
      Swal.fire({
        title: data?.message,
        icon: "error",
        showConfirmButton: "okay",
      });
    }
  };

  const handleQuantityMinus = (outerInd, innerInd) => {
    let data = purchasedProd?.map((item, index) => {
      if (outerInd === index) {
        return {
          ...item,
          products: item.products?.map((val, ind) => {
            if (innerInd === ind) {
              return {
                ...val,
                quantity: val?.quantity - (val?.quantity > 1 ? 1 : 0),
              };
            } else {
              return val;
            }
          }),
        };
      } else {
        return item;
      }
    });
    console.log(data);
    setPurchasedProd(data);
  };

  const handleQuantityPlus = (outerInd, innerInd) => {
    let data = purchasedProd?.map((item, index) => {
      if (outerInd === index) {
        return {
          ...item,
          products: item.products?.map((val, ind) => {
            if (innerInd === ind) {
              return {
                ...val,
                quantity: +val?.quantity + 1,
              };
            } else {
              return val;
            }
          }),
        };
      } else {
        return item;
      }
    });
    console.log(data);
    setPurchasedProd(data);
  };

  const handleQuantity = (outerInd, innerInd, value) => {
    console.log(value);
    let data = purchasedProd?.map((item, index) => {
      if (outerInd === index) {
        return {
          ...item,
          products: item.products?.map((val, ind) => {
            if (innerInd === ind) {
              return {
                ...val,
                quantity: val?.quantity === value,
              };
            } else {
              return val;
            }
          }),
        };
      } else {
        return item;
      }
    });
    setPurchasedProd(data);
  };
  return (
    <>
      <div className="">
        <AppHeader cartCount={cartCount} />
        <div className="page-content-wrapper2 mt-1 bg-light ">
          <div className="py-3">
            <div className="row mb-2 p-2 justify-content-between   ">
              <div className="col-auto mx-3 mx-xs-0 col-xs-auto ">
                <label class="checkbox-label-all d-flex">
                  <input
                    type="checkbox"
                    name="selectAll"
                    id="selectAll"
                    onChange={handleSelectAll}
                    checked={isCheckAll}
                    class="checkbox-input-all"
                  />
                  <span class="checkmark-all"></span>
                  <span className="select-text">Select All</span>
                </label>
              </div>
              <div className="col-auto col-xs-auto">
                <button onClick={(e) => AddtoCart(e)} className="comman_btn">
                  Add to Cart
                </button>
              </div>
            </div>
            <div className="container px-2">
              <div className="row mt-0 buyAgain px-3 py-2">
                {(purchasedProd || [])?.map((item, index) =>
                  item.products
                    ?.filter(
                      (itm, idx) =>
                        browserName === "WebKit" ||
                        browserName === "Chrome WebView"
                          ? itm
                          : itm // ? !itm?.productIdisTobaccoProduct
                    )
                    .map((val, ind) => (
                      <div className="col-12 mb-2 card" key={`${ind}${index}`}>
                        <div>
                          <label class="checkbox-label ">
                            <input
                              type="checkbox"
                              key={val?.flavour?._id}
                              name={ind}
                              id={val?.flavour?._id}
                              onChange={(e) =>
                                handleClick(
                                  e,
                                  val?.flavour,
                                  val?.productId?._id,
                                  val?.quantity,
                                  ind
                                )
                              }
                              class="checkbox-input mb-2 mx-3"
                              checked={isCheck?.includes(val?.flavour?._id)}
                            />
                            <span class="checkmark"></span>
                          </label>
                        </div>
                        <div className="horizontal-product-card py-1">
                          <div className="d-flex align-items-center mt-2 mb-2">
                            <div className="product-thumbnail-side mt-1">
                              <Link
                                className="product-thumbnail shadow-sm d-block"
                                to={`/app/product-detail/${val?.productId?.slug}`}
                                state={{ type: val?.flavour }}
                              >
                                <img
                                  src={
                                    val?.flavour
                                      ? val?.flavour?.flavourImage ||
                                        require("../../assets/img/product.jpg")
                                      : val?.productId?.productImage ||
                                        require("../../assets/img/product.jpg")
                                  }
                                  alt="Product"
                                />
                              </Link>
                            </div>

                            <div className="p-3">
                              <Link
                                className="product-title d-block  mb-3"
                                to={`/app/product-detail/${val?.productId?.slug}`}
                                state={{ type: val?.flavour }}
                              >
                                {val?.productId?.unitName}
                                {"-"}
                                {val?.flavour ? val?.flavour?.flavour : null}
                              </Link>
                              Quantity :
                              {isCheck?.includes(val?.flavour?._id) ? (
                                val?.quantity
                              ) : (
                                <form className="cart-form w-100" action="#">
                                  <div className="order-plus-minus d-flex align-items-center">
                                    <span
                                      className="quantity-button-handler"
                                      // key={`${ind}${index}`}
                                      onClick={() =>
                                        handleQuantityMinus(index, ind)
                                      }
                                    >
                                      -
                                    </span>
                                    <input
                                      className="cart-quantity-input text-center bg-light"
                                      type="number"
                                      key={val?.quantity}
                                      // id={`${ind}${index}`}
                                      name="quantity"
                                      max="999"
                                      defaultValue={val?.quantity}
                                      disabled
                                      onChange={(e) =>
                                        handleQuantity(
                                          index,
                                          ind,
                                          e.target.value
                                        )
                                      }
                                    />

                                    <span
                                      className="quantity-button-handler"
                                      // key={`${ind}${index}`}
                                      onClick={() =>
                                        handleQuantityPlus(index, ind)
                                      }
                                    >
                                      +
                                    </span>
                                  </div>
                                </form>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>
          </div>
          {/* )} */}
        </div>

        <AppFooter />
      </div>
    </>
  );
}

export default AppBuyAgain;
