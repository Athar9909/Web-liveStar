/* eslint-disable jsx-a11y/anchor-is-valid */ import axios from "axios";
import classNames from "classnames";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "rsuite";
import Swal from "sweetalert2";
import Select from "react-select";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { orderFormData, orderFromProducts } from "../../atom";
import Confetti from "react-confetti";
const OrderForm = () => {
  axios.defaults.headers.common["x-auth-token-vendor"] =
    localStorage.getItem("vendorLog");
  const orderProducts = useRecoilValue(orderFromProducts);
  const orderData = useRecoilValue(orderFormData);
  const setOrderProducts = useSetRecoilState(orderFromProducts);
  const setOrderData = useSetRecoilState(orderFormData);
  const [options, setOptions] = useState([]);
  const [productsV, setProductsV] = useState([]);
  const [keySort, setKeySort] = useState("");
  let navigate = useNavigate();
  const [loader, setLoader] = useState(false);
  const apiUrl = `${process.env.REACT_APP_APIENDPOINTNEW}vendor/createOrder`;
  const [delOption, setDelOption] = useState([]);
  const [products, setProducts] = useState(orderProducts ?? []);
  const barcodeSearch = `${process.env.REACT_APP_APIENDPOINTNEW}vendor/getVendorProducts`;
  const accountSearch = `${process.env.REACT_APP_APIENDPOINTNEW}vendor/getUserByAccountNum/`;
  const vendorApi = `${process.env.REACT_APP_APIENDPOINTNEW}vendor/getVendor`;
  const [vendor, setVendor] = useState([]);
  console.log(orderProducts, "recoild");
  const [userData, setUserData] = useState(orderData);
  const [confettiLoader, setConfettiLoader] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    setOrderProducts(products);
  }, [products]);

  useEffect(() => {
    setTimeout(() => {
      setOrderData(userData);
    }, [2000]);
  }, [userData]);

  useEffect(() => {
    setProducts((prev) => {
      const updatedProducts = prev.map((item) => {
        const { newQuantity, ...rest } = item; // Destructure newQuantity and rest of the properties
        return rest; // Return the object without the newQuantity key
      });
      return updatedProducts;
    });
    reset({
      companyName: orderData?.companyName || "",
      account: orderData?.account || "",
      fullName: orderData?.fullName || "",
      email: orderData?.email || "",
      addressLine1: orderData?.address || "",
      phoneNumber: orderData?.phoneNumber || "",
      type: orderData?.type || "",
      comments: orderData?.comments || "",
    });
    setDelOption(orderData?.type || "");
    getVendorDetails();
  }, []);

  const getVendorDetails = async (key) => {
    try {
      const response = await axios.get(vendorApi, {
        search: key,
      });
      let data = response?.data.results.vendor;
      setVendor(data);
    } catch (error) {
      // Handle errors
      console.error("Error fetching products:", error);
    }
  };

  const handleInputChange = (inputValue, { action }) => {
    if (action === "input-change") {
      setTimeout(() => {
        searchProducts(inputValue);
      }, [500]);
    }
  };

  const handleChange2 = (selected) => {
    if (!selected || !selected.value) {
      console.error("Invalid selection:", selected);
      return;
    }

    let prods = productsV.filter((itm) => itm._id === selected.value);
    setProductsV(prods);
    setOptions([]);
  };
  const searchAccount = async (e) => {
    let value = e.target.value;
    if (value?.length > 6) {
      try {
        const response = await axios.get(accountSearch + value);
        let data = response?.data.results.user;
        if (data) {
          reset({
            companyName: data?.companyName || "",
            account: data?.accountNumber || "",
            fullName: data?.fullName || "",
            email: data?.email || "",
            addressLine1: data?.address || "",
            phoneNumber: data?.phoneNumber || "",
          });
        }
      } catch (error) {
        // Handle errors
        Swal.fire({
          title: "Error",
          text: "Please login again!",
          icon: "error",
          button: "Ok",
        });
        console.error("Error fetching account:", error);
      }
    }
  };
  const handleData = (e, key) => {
    const value = e.target.value;
    let data = { ...userData };
    data[key] = value;

    setUserData(data);
  };

  console.log(orderData);
  const searchProducts = async (key) => {
    try {
      const response = await axios.patch(barcodeSearch, {
        search: key,
      });
      setProductsV(response?.data.results.products);
      let data = response?.data.results.products;
      setKeySort(key);
      const optionList = data?.reduce((uniqueOptions, item) => {
        if (!uniqueOptions.find((option) => option.label === item.unitName)) {
          uniqueOptions.push({
            value: item._id,
            label: item.unitName,
          });
        }
        return uniqueOptions;
      }, []);

      setOptions(optionList);
    } catch (error) {
      // Handle errors
      Swal.fire({
        title: "Error",
        text: "Please login again!",
        icon: "error",
        button: "Ok",
      });
      console.error("Error fetching products:", error);
    }
  };

  const onSubmit = (data) => {
    setLoader(true);

    let Nprod = [];
    products?.map((itm) => {
      Nprod.push({
        productId: itm?.productId,
        quantity: +itm?.quantity,
        promotionalComment: itm?.comment,
        productComment: itm?.prodComment,
        flavourId: itm?.flavourId,
      });
    });

    const SignUpData = async (e) => {
      const formData = {
        companyName:
          data?.companyName?.charAt(0).toUpperCase() +
          data?.companyName?.slice(1).trim(),
        account:
          data?.account?.charAt(0).toUpperCase() +
          data?.account?.slice(1).trim(),
        fullName:
          data?.fullName?.charAt(0).toUpperCase() +
          data?.fullName?.slice(1).trim(),
        address:
          data?.addressLine1?.charAt(0).toUpperCase() +
          data?.addressLine1?.slice(1).trim(),
        email: data?.email?.trim(),
        phoneNumber: data?.phoneNumber?.trim(),
        type: delOption,
        countryCode: "+1",
        products: Nprod,
        comments:
          data?.comments?.charAt(0).toUpperCase() +
          data?.comments?.slice(1).trim(),
      };

      const response = await axios.post(apiUrl, formData);
      console.log(response);
      try {
        if (!response.data.error) {
          setLoader(false);
          setConfettiLoader(true);
          navigate("/app/OrderForm/:star");
          reset();
          document.getElementById("resetBtn").click();
          setProducts([]);
          setProductsV([]);
          setUserData([]);
          Swal.fire({
            title: "Hurray!",
            text: "Thank You! Your Order is submitted.",
            icon: "success",
            confirmButtonText: "Okay",
          }).then((result) => {
            if (result.isConfirmed) {
              setConfettiLoader(false);
            }
          });
        }
      } catch {
        setConfettiLoader(false);
        setLoader(false);
        Swal.fire({
          title: response?.data?.message,
          text: "401 error",
          icon: "error",
          button: "Ok",
        });
      }
      setTimeout(() => {
        setConfettiLoader(false);
        setLoader(false);
      }, 4000);
    };

    SignUpData();
  };

  const handleChange = async (id, e) => {
    let val = +e.target.value;
    let prods = [...products];
    let updatedProd = prods.map((item) => ({ ...item }));
    updatedProd.forEach((obj) => {
      if (obj.flavourId === id) {
        obj.quantity = val;
      }
    });
    setProducts(updatedProd);
  };

  const handleChangeComment = async (id, e) => {
    let val = e.target.value;
    let prods = [...products];
    let updatedProd = prods.map((item) => ({ ...item }));
    updatedProd.forEach((obj) => {
      if (obj.flavourId === id) {
        obj.prodComment = val;
      }
    });
    setProducts(updatedProd);
  };

  console.log(products, "prodsss");

  const addProducts = async (pId, fId, uName, flv, bar, comment, price) => {
    let updatedProd = productsV.filter((item) => item?.type?._id !== fId);
    setProductsV(updatedProd);
    let prods = [...products];
    let found = false;

    prods.forEach((obj) => {
      if (obj?.flavourId === fId) {
        found = true;
      }
    });

    if (!found) {
      prods.push({
        productId: pId,
        flavourId: fId,
        unitName: uName,
        flavour: flv,
        barcodes: bar,
        comment: comment,
        quantity: 1,
        listingPrice: price,
      });
    }
    setProducts(prods);
  };

  const AddItemsAll = () => {
    let prod = [...products];
    let updatedProd = prod.map((item) => ({ ...item })); // Create a shallow copy of products array
    productsV.forEach((itm) => {
      let existingItemIndex = updatedProd.findIndex(
        (obj) => obj?.flavourId === itm?.type?._id
      );
      if (existingItemIndex !== -1) {
        // If item with same flavourId already exists, increase its quantity by 1
        updatedProd[existingItemIndex].quantity += 1;
      } else {
        // If item with same flavourId doesn't exist, push a new item
        updatedProd.push({
          productId: itm?._id,
          flavourId: itm?.type?._id,
          unitName: itm?.unitName,
          flavour: itm?.type?.flavour,
          barcodes: itm?.type?.barcode[0],
          comment: itm?.vendorProduct?.promoComment,
          listingPrice: itm?.vendorProduct?.listingPrice,
          quantity: 1,
        });
      }
    });
    setProducts(updatedProd);
  };

  const removeProduct = async (pId, fId) => {
    let prods = [...products];
    prods = prods.filter((obj) => obj?.flavourId !== fId);
    setProducts(prods);
  };
  const [value, setValue] = useState("");
  const handleKeyDown = (event) => {
    if (event.key === "Enter" && event.shiftKey) {
      const { selectionStart, selectionEnd } = event.target;
      const newValue = `${value.substring(
        0,
        selectionStart
      )}\n${value.substring(selectionEnd)}`;
      setValue(newValue);
      event.preventDefault();
    }
  };

  return (
    <div>
      <div className="">
        {/* <Navbar /> */}

        <div className="container  p-4 p-sm-1 p-xs-0">
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <form
                className=" mt-1 bg-white p-4  shadow"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="d-flex justify-content-between mb-1">
                  <div className="text-center">
                    <img
                      className={vendor?.image?.length > 0 ? "" : "d-none"}
                      src={vendor?.image}
                      alt="Company Logo"
                      class="logo"
                      style={{
                        width: "100px",
                      }}
                    />

                    <h1
                      style={{
                        fontSize: "clamp(0.2rem, 0.2rem + .8rem, 1.875rem)",
                      }}
                      className=" mt-2"
                    >
                      {vendor?.fullName}
                    </h1>
                  </div>{" "}
                  <div className="text-center">
                    <img
                      className=""
                      onClick={() =>
                        (window.location.href =
                          "https://www.starimporters.com/")
                      }
                      src="https://starimporters-media.s3.amazonaws.com/1710029749556--Star%20Logo%20Tradeshow%202024.png"
                      alt="Company Logo"
                      style={{
                        width: "clamp(80px, 50%, 150px)",
                      }}
                    />
                    <h2
                      style={{
                        fontSize: "clamp(0.9rem, 0.6rem + 1.5vw, 1.875rem)",
                      }}
                      className=" mt-5 fw-bold text-center text-dark headOrder"
                    >
                      ORDER FORM
                    </h2>
                  </div>
                  <div className="text-center ">
                    <p className="fs-6 text-center text-secondary">
                      <Link
                        to={`/orderform/${vendor?.email}`}
                        onClick={() => {
                          localStorage.removeItem("vendorLog");
                          localStorage.removeItem("vendorId");
                        }}
                        className="text-decoration-none"
                      >
                        <i class="fa fa-right-from-bracket"></i> Logout
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="divider_line"></div>

                <div
                  className="row"
                  style={{
                    maxHeight: "70vh",
                    overflowY: "scroll",
                  }}
                >
                  <div className="form-floating  col-lg-6 col-md-6 col-sm-12 mb-4">
                    <input
                      type="text"
                      className={classNames(
                        "form-control  border border-secondary text-dark",
                        { "is-invalid": errors.account }
                      )}
                      id="floatingInput3"
                      name="account"
                      placeholder="name@example.com"
                      {...register("account", {
                        required: "Account Number is required!",
                        minLength: {
                          value: 7,

                          message: "Minimum 7 characters required! ",
                        },
                        onChange: (e) => {
                          searchAccount(e);
                          handleData(e, "account");
                        },
                      })}
                    />
                    {errors.account && (
                      <small className="errorText mx-1 fw-bold">
                        {errors.account?.message}
                      </small>
                    )}
                    <label htmlFor="floatingInput3" className="mx-2 fw-bolder">
                      Account Number
                    </label>
                  </div>
                  <div className="form-floating col-lg-6 col-md-6 col-sm-12 mb-2 ">
                    <input
                      type="text"
                      className={classNames(
                        "form-control  border border-secondary text-dark ",
                        { "is-invalid": errors.companyName }
                      )}
                      id="floatingInput3"
                      name="companyName"
                      placeholder="name@example.com"
                      {...register("companyName", {
                        required: false,
                        onChange: (e) => {
                          handleData(e, "companyName");
                        },
                      })}
                    />
                    {errors.companyName && (
                      <small className="errorText mx-1 fw-bold">
                        {errors.companyName?.message}
                      </small>
                    )}
                    <label htmlFor="floatingInput3" className="mx-2 fw-bolder">
                      Company Name
                    </label>
                  </div>

                  <div className="form-floating  col-lg-4 col-md-4 col-sm-6 mb-4">
                    <input
                      type="text"
                      className={classNames(
                        "form-control  border border-secondary text-dark",
                        { "is-invalid": errors.fullName }
                      )}
                      id="floatingInput3"
                      name="fullName"
                      placeholder="name@example.com"
                      {...register("fullName", {
                        required: false,
                        onChange: (e) => {
                          handleData(e, "fullName");
                        },
                      })}
                    />
                    {errors.fullName && (
                      <small className="errorText mx-1 fw-bold">
                        {errors.fullName?.message}
                      </small>
                    )}
                    <label htmlFor="floatingInput3" className="mx-2 fw-bolder">
                      Full Name
                    </label>
                  </div>
                  <div className="form-floating  col-lg-4 col-md-4 col-sm-6 mb-4">
                    <input
                      type="email"
                      className="form-control shadow-none border border-secondary text-dark"
                      id="floatingPassword4"
                      name="email"
                      placeholder="name@example.com"
                      {...register("email", {
                        required: false,
                        pattern: {
                          value:
                            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                          message: "Invalid email address",
                        },
                        onChange: (e) => {
                          handleData(e, "email");
                        },
                      })}
                    />
                    {errors.email && (
                      <small className="errorText mx-1 fw-bold">
                        {errors.email?.message}
                      </small>
                    )}

                    <label htmlFor="floatingPassword4" className="mx-2 fw-bold">
                      Email Address
                    </label>
                  </div>

                  <div className="form-floating  col-lg-4 col-md-4 col-sm-6 mb-4">
                    <input
                      type="text"
                      className={classNames(
                        "form-control  border border-secondary text-dark signup_fields",
                        { "is-invalid": errors.addressLine1 }
                      )}
                      id="floatingAddrees1"
                      placeholder="name@example.com"
                      name="addressLine1"
                      {...register("addressLine1", {
                        required: false,
                        onChange: (e) => {
                          handleData(e, "address");
                        },
                      })}
                    />
                    {errors.addressLine1 && (
                      <small className="errorText mx-1 fw-bold">
                        {errors.addressLine1?.message}
                      </small>
                    )}
                    <label
                      htmlFor="floatingAddress1"
                      className="mx-2 fw-bolder"
                    >
                      Full Address <span className="text-danger">*</span>
                    </label>
                  </div>

                  <>
                    <div className="form-floating  col-lg-4 col-md-4 col-sm-6 mb-4">
                      <input
                        type="number"
                        className={classNames(
                          "form-control  border border-secondary text-dark signup_fields ",
                          { "is-invalid": errors.phoneNumber }
                        )}
                        id="floatingPassword3"
                        placeholder="Password"
                        name="phoneNumber"
                        {...register("phoneNumber", {
                          required: false,
                          onChange: (e) => {
                            handleData(e, "phoneNumber");
                          },
                        })}
                      />
                      {errors.phoneNumber && (
                        <small className="errorText mx-1 fw-bold">
                          {errors.phoneNumber?.message}
                        </small>
                      )}
                      <label
                        htmlFor="floatingPassword3"
                        className="mx-2 fw-bolder"
                      >
                        Phone Number
                      </label>
                    </div>
                    <div className="form-floating  col-lg-4 col-md-4 col-sm-5 mb-4 select_dropdown ">
                      <select
                        className={classNames(
                          "form-select border border-secondary signup_fields fw-bolder mt-1",
                          { "is-invalid": errors.type }
                        )}
                        id="floatingSelect1"
                        aria-label="Floating label select example"
                        name="type"
                        {...register("type", {
                          required: "Select delivery option.",
                          onChange: (e) => {
                            setDelOption(e.target.value);

                            handleData(e, "type");
                          },
                        })}
                      >
                        <option value="">Select an option...</option>
                        <option value="Delivery">Delivery</option>
                        <option value="In-Store Pickup">Pickup</option>
                        <option value="Shipment">Shipment</option>
                      </select>
                      {errors.type && (
                        <small className="errorText mx-1 fw-bold">
                          {errors.type?.message}
                        </small>
                      )}

                      <label
                        htmlFor="floatingSelect1"
                        className="mx-2 fw-bolder mb-4"
                      >
                        Select Delivery Options
                      </label>
                    </div>

                    <div className="form-floating  col-lg-4 col-md-4 col-sm-5 mb-4">
                      <textarea
                        type="text"
                        className={classNames(
                          "form-control  border border-secondary text-dark signup_fields",
                          { "is-invalid": errors.comments }
                        )}
                        id="floatingAddreesComments"
                        placeholder="name@example.com"
                        onKeyDown={handleKeyDown}
                        style={{ height: "100px" }}
                        name="comments"
                        {...register("comments", {
                          required: false,
                          onChange: (e) => {
                            handleData(e, "comments");
                          },
                        })}
                      />
                      {errors.comments && (
                        <small className="errorText mx-1 fw-bold">
                          {errors.comments?.message}
                        </small>
                      )}
                      <label
                        htmlFor="floatingAddressComents"
                        className="mx-2 fw-bolder"
                      >
                        Order Comment
                      </label>
                    </div>

                    <h1>
                      <Link
                        to={"/app/OrderForm/viewInventory"}
                        className="fs-6 mt-2"
                      >
                        View Inventory
                      </Link>
                    </h1>
                    {products?.length > 0 && (
                      <div className="table-responsive">
                        <table className="table mb-4" key={products}>
                          <thead>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                              <th>S.No.</th>
                              <th>Barcode.</th>
                              <th>Product Name</th>
                              <th>Flavor</th>
                              <th>Qty (in units)</th>
                              <th>List Price</th>
                              <th>Promotion</th>
                              <th>Product Comment</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {(products || [])?.map((item, index) => (
                              <tr key={index} className="border ">
                                <td>{index + 1}</td>
                                <td className="border">{item?.barcodes}</td>
                                <td className="border">{item?.unitName}</td>
                                <td className="border">{item?.flavour}</td>
                                <td className="border  ">
                                  <span className="fs-5 ">
                                    <input
                                      type="number"
                                      key={item?._id}
                                      style={{
                                        width: "100px",
                                      }}
                                      maxLength="4"
                                      id={item?._id}
                                      name="price"
                                      defaultValue={
                                        item?.quantity ? item?.quantity : 1
                                      }
                                      className="border text-center bg-light rounded"
                                      onChange={(e) => {
                                        handleChange(item?.flavourId, e);
                                      }}
                                    ></input>
                                  </span>
                                </td>
                                <td className="border">{item?.listingPrice}</td>

                                <td className="border">{item?.comment}</td>
                                <td className="border  ">
                                  <span className="fs-6 ">
                                    <input
                                      type="text"
                                      key={item?._id}
                                      style={{
                                        width: "200px",
                                      }}
                                      id={item?._id}
                                      name="comments"
                                      defaultChecked={item?.prodComment || ""}
                                      className="border bg-light rounded"
                                      onChange={(e) => {
                                        handleChangeComment(item?.flavourId, e);
                                      }}
                                    ></input>
                                  </span>
                                </td>
                                <td className="border text-danger">
                                  {" "}
                                  <a
                                    onClick={() =>
                                      removeProduct(
                                        item?.productId,
                                        item?.flavourId
                                      )
                                    }
                                  >
                                    <i
                                      className="fa fa-trash"
                                      style={{
                                        marginLeft: "10px",
                                        color: "red",
                                        cursor: "pointer",
                                      }}
                                    ></i>
                                  </a>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {confettiLoader && (
                      <Confetti
                        drawShape={(ctx) => {
                          const colors = ["#3b4093", "#eb3237", "#987980"]; // Colors for the stars
                          const x = 0;
                          const y = 0;
                          const outerRadius = 20;
                          const innerRadius = 8;

                          ctx.beginPath();
                          for (let i = 0; i < 5; i++) {
                            const outerX =
                              x + Math.cos((Math.PI * 2 * i) / 5) * outerRadius;
                            const outerY =
                              y + Math.sin((Math.PI * 2 * i) / 5) * outerRadius;
                            ctx.lineTo(outerX, outerY);

                            const innerX =
                              x +
                              Math.cos((Math.PI * 2 * i) / 5 + Math.PI / 5) *
                                innerRadius;
                            const innerY =
                              y +
                              Math.sin((Math.PI * 2 * i) / 5 + Math.PI / 5) *
                                innerRadius;
                            ctx.lineTo(innerX, innerY);
                          }
                          ctx.closePath();

                          ctx.fillStyle =
                            colors[Math.floor(Math.random() * colors.length)]; // Randomly choose a color
                          ctx.fill();
                        }}
                      />
                    )}

                    {products?.length > 0 && (
                      <div className="col-12 text-center mb-2 ">
                        <Button
                          appearance="primary"
                          className="comman_btn mx-2 fw-bold d-none"
                          id="resetBtn"
                          type="reset"
                          style={{ backgroundColor: "#3e4093", color: "#fff" }}
                        >
                          Cancel
                        </Button>
                        <Button
                          loading={loader}
                          appearance="primary"
                          className="comman_btn mx-2 fw-bold"
                          type="submit"
                          style={{ backgroundColor: "#3e4093", color: "#fff" }}
                        >
                          Submit Order
                        </Button>
                      </div>
                    )}

                    <div className="border p-3 rounded bg-light">
                      <label className="fs-5 ">Select Products</label>
                      <div className="row">
                        <div className="form-floating col-6 mb-4">
                          <Select
                            name="users"
                            options={options}
                            // value={item?.productName || ""}
                            className="basic-multi-select z-3"
                            classNamePrefix="select"
                            onChange={handleChange2}
                            onInputChange={handleInputChange}
                            isClearable
                            placeholder="Type any keyword to Search Product"
                          ></Select>
                        </div>

                        <div className="form-group col-6 mb-4">
                          <input
                            type="search"
                            className={classNames(
                              "form-control  border border-secondary text-dark signup_fields"
                            )}
                            style={{ height: "38px" }}
                            disabled={keySort?.length ? false : true}
                            id="floatingAddrees122"
                            placeholder="Filter by flavour name"
                            name="addressLine1"
                            onChange={(e) => {
                              let key = e.target.value.toLowerCase();
                              if (key) {
                                setProductsV((prod) => {
                                  return prod.filter((itm) =>
                                    itm.type.flavour.toLowerCase().includes(key)
                                  );
                                });
                              }
                            }}
                          />
                        </div>
                        {productsV?.length > 0 && (
                          <div className="form-floating col-12 mb-4 text-end">
                            <Button
                              loading={loader}
                              appearance="primary"
                              className="comman_btn mx-2 fw-bold"
                              style={{
                                backgroundColor: "#3e4093",
                                color: "#fff",
                              }}
                              onClick={() => AddItemsAll()}
                            >
                              + Add All
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="row">
                        <div className="col-12 mb-4 p-3">
                          <div className="cart_table_2">
                            <div className="table">
                              <table className="table">
                                {productsV?.length > 0 && (
                                  <tbody className="border">
                                    {(productsV || [])?.map((item, index) => (
                                      <tr className="border text-center">
                                        <td className="border rounded">
                                          <div className="col-auto">
                                            <span
                                              style={{
                                                top: "-2.6rem",
                                                position: "relative",
                                              }}
                                              className=""
                                            >
                                              <img
                                                src={
                                                  item?.type?._id
                                                    ? item?.type?.flavourImage
                                                    : item?.productId
                                                        ?.productImage
                                                }
                                                alt=""
                                              />
                                            </span>
                                          </div>
                                        </td>
                                        <td>
                                          <div className="row align-items-center flex-lg-wrap flex-md-nowrap flex-nowrap">
                                            <div className="col">
                                              <div className="cart_content ">
                                                <h3
                                                  className=" mt-4"
                                                  style={{
                                                    fontSize:
                                                      "clamp(0.9rem, 0.7rem + .4vw, 1.875rem)",
                                                  }}
                                                >
                                                  {item?.type?._id
                                                    ? item?.unitName +
                                                      "-" +
                                                      item?.type?.flavour
                                                    : item?.productId?.unitName}
                                                </h3>
                                                <p>
                                                  Barcodes:
                                                  {item?.type?.barcode
                                                    ?.filter(
                                                      (itm, id) => id == 1
                                                    )
                                                    .map((item) => (
                                                      <li>{item}</li>
                                                    ))}
                                                </p>
                                              </div>
                                            </div>
                                          </div>
                                        </td>
                                        <td className="border  ">
                                          <p className="fs-6">
                                            {item?.vendorProduct?.promoComment?.slice(
                                              0,
                                              20
                                            ) ?? "No Comment"}
                                          </p>
                                        </td>

                                        <td className="border rounded">
                                          {products.some(
                                            (itm) =>
                                              itm.flavourId === item?.type?._id
                                          ) ? (
                                            <Button
                                              appearance="primary"
                                              color="green"
                                              className=" mx-2 fw-bold border rounded mt-5"
                                              style={{
                                                color: "#fff",
                                              }}
                                            >
                                              <i class="fa fa-check "></i> Added
                                            </Button>
                                          ) : (
                                            <Button
                                              appearance="primary"
                                              className="comman_btn mx-2 fw-bold border rounded "
                                              style={{
                                                backgroundColor: "#3e4093",
                                                color: "#fff",
                                              }}
                                              onClick={() =>
                                                addProducts(
                                                  item?._id,
                                                  item?.type?._id,
                                                  item?.unitName,
                                                  item?.type?.flavour,
                                                  item?.type?.barcode[0],
                                                  item?.vendorProduct
                                                    ?.promoComment,
                                                  item?.vendorProduct
                                                    ?.listingPrice
                                                )
                                              }
                                            >
                                              + Add
                                            </Button>
                                          )}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                )}
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
