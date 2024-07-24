import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useRecoilState, useSetRecoilState } from "recoil";
import { CartCount } from "../../atom";

const BuyAgain = () => {
  const [users, setUsers] = useState();
  const products = `${process.env.REACT_APP_APIENDPOINTNEW}user/order/purchasedProducts`;
  const addInCart = `${process.env.REACT_APP_APIENDPOINTNEW}user/order/buyAgain`;
  const [purchasedProd, setPurchasedProd] = useState();
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);
  const [selected, setSelected] = useState([]);
  const [Nstate, setNstate] = useState(false);
  const navigate = useNavigate();
  const setCount = useSetRecoilState(CartCount);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("UserData"));
    setUsers(data);
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
    console.log(data);
    if (!data.error) {
      setNstate(!Nstate);
      setCount((count) => [
        ...count,
        {
          text: Math.random(),
        },
      ]);
      Swal.fire({
        title: "Product Added to Cart",
        icon: "success",
        showCloseButton: true,
        showCancelButton: true,
        timer: 1000,
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
    <div className="">
      <div class="myacct_data_inner">
        <div class="row">
          <div class="col-12 data_head mb-4 d-flex justify-content-between">
            <h2>Buy Again</h2>
            <div class="right_btns">
              <a
                href="javascript:;"
                className="border border-white text-decoration-none"
              >
                {" "}
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
              </a>
              <a
                href="javascript:;"
                className="text-decoration-none"
                onClick={() => AddtoCart()}
              >
                Add to Cart
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="row myfavourites">
          {(purchasedProd || [])?.map((item, index) =>
            item.products?.map((val, ind) => (
              <div className="col-lg-4 col-md-4 mb-lg-4 mb-md-2 ">
                <div className="product_parts_box_buy">
                <label class="checkbox-labels">
                      <input
                        type="checkbox"
                        key={val?.flavour?._id}
                        // name={ind}
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
                        class="checkbox-input"
                        checked={isCheck?.includes(val?.flavour?._id)}
                      />
                      <span class="checkmark"></span>
                    </label>
                  <div className="partsproduct_img_buy text-center">
                    <img
                      onClick={() => {
                        navigate(
                          `/AllProducts/Product/${val?.productId?.slug}`,
                          {
                            state: {
                              id: val?.productId?.slug,
                            },
                          }
                        );
                      }}
                      src={
                        val?.flavour
                          ? val?.flavour?.flavourImage ||
                            require("../../assets/img/product.jpg")
                          : val?.productId?.productImage ||
                            require("../../assets/img/product.jpg")
                      }
                      alt="Product"
                    />
                 
                  </div>
                  <div>
                    <div class="featuredproduct_details p-2 text-center">
                      <span
                        onClick={() => {
                          navigate(
                            `/AllProducts/Product/${val?.productId?.slug}`,
                            {
                              state: {
                                id: val?.productId?.slug,
                              },
                            }
                          );
                        }}
                      >
                        {val?.productId?.unitName}
                        {"-"}
                        {val?.flavour ? val?.flavour?.flavour : null}
                      </span>
                      {isCheck?.includes(val?.flavour?._id) ? (
                        <p>Quantity:{val?.quantity}</p>
                      ) : (
                        <div className="prdct_bottom mt-3 d-flex justify-content-center">
                          <div className="number">
                            <span
                              className="minus"
                              style={{ userSelect: "none" }}
                              onClick={() => handleQuantityMinus(index, ind)}
                            >
                              -
                            </span>
                            <input
                              type="number"
                              key={val?.quantity}
                              // id={`${ind}${index}`}
                              name="quantity"
                              max="999"
                              defaultValue={val?.quantity}
                              disabled
                              onChange={(e) =>
                                handleQuantity(index, ind, e.target.value)
                              }
                            />
                            <span
                              className="plus"
                              style={{ userSelect: "none" }}
                              onClick={() => handleQuantityPlus(index, ind)}
                            >
                              +
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* <form className="cart-form w-100" action="#">
                      <div className="order-plus-minus d-flex align-items-center">
                        <span
                          className="quantity-button-handler"
                          // key={`${ind}${index}`}
                          onClick={() => handleQuantityMinus(index, ind)}
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
                            handleQuantity(index, ind, e.target.value)
                          }
                        />

                        <span
                          className="quantity-button-handler"
                          // key={`${ind}${index}`}
                          onClick={() => handleQuantityPlus(index, ind)}
                        >
                          +
                        </span>
                      </div>
                    </form> */}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default BuyAgain;
