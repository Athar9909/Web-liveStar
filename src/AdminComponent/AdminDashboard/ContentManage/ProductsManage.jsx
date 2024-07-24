import axios from "axios";import classNames from "classnames";
import moment from "moment";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import Swal from "sweetalert2";

const ProductsManage = () => {
  const inventorySearch = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/searchInventory`;
  const getProducts = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/singleProduct`;
  const allPromotions = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getPromotions`;
  const addPromotions = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/addPromotion`;
  const editPromotions = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/editPromotion`;
  const [searchKey, setSearchKey] = useState("");
  const [flavour, setFlavour] = useState();
  const [expiry, setExpiry] = useState("");
  const [options, setOptions] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [product, setProducts] = useState([]);
  const [hotSell, setHotSell] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [closeOut, setCloseOut] = useState([]);
  const [NArrivals, setNArrivals] = useState([]);
  const [price, setPrice] = useState("");
  const [priceEdit, setPriceEdit] = useState("");
  const [monthly, setMonthly] = useState([]);

  useEffect(() => {
    createOptions();
  }, [searchKey]);

  useEffect(() => {
    GetPromotions();
    getPromotionsFeatured();
    getPromotionsMonthly();
    getPromotionsClose();
    getPromotionsArrivals();
  }, []);

  const GetPromotions = async () => {
    const { data } = await axios.post(allPromotions, {
      type: "HotSelling",
    });

    if (!data.error) {
      setHotSell(data?.results.promotion);
    }
  };
  const getPromotionsFeatured = async () => {
    const { data } = await axios.post(allPromotions, {
      type: "Featured",
    });

    if (!data.error) {
      setFeatured(data?.results.promotion);
    }
  };

  const getPromotionsMonthly = async () => {
    const { data } = await axios.post(allPromotions, {
      type: "MonthlyDeals",
    });

    if (!data.error) {
      setMonthly(data?.results.promotion);
    }
  };

  const changePrice = async (type, id, flavour) => {
    const { data } = await axios.post(editPromotions, {
      type: type,
      productId: id,
      flavourId: flavour?._id,
      price: priceEdit,
    });
    if (!data.error) {
      getPromotionsFeatured();
      getPromotionsClose();
      GetPromotions();
      Swal.fire({
        title: "Price Updated!",
        icon: "success",
        timer: 1000,
      });
      setPriceEdit();
    }
  };

  const EditMonthlyDate = async (date, type, id, flavour) => {
    const { data } = await axios.post(editPromotions, {
      type: type,
      productId: id,
      flavourId: flavour?._id,
      expireIn: date,
    });
    if (!data.error) {
      getPromotionsFeatured();
      getPromotionsClose();
      GetPromotions();
      Swal.fire({
        title: "Expiry Date!",
        icon: "success",
        timer: 1000,
      });
      setPriceEdit();
    }
  };

  const getPromotionsClose = async () => {
    const { data } = await axios.post(allPromotions, {
      type: "CloseOut",
    });

    if (!data.error) {
      setCloseOut(data?.results.promotion);
    }
  };
  const getPromotionsArrivals = async () => {
    const { data } = await axios.post(allPromotions, {
      type: "NewArrivals",
    });

    if (!data.error) {
      setNArrivals(data?.results.promotion);
    }
  };

  const deleteProduct = async (type, id, flavour) => {
    const { data } = await axios.post(editPromotions, {
      type: type,
      deleteKey: id,
      flavourId: flavour?._id,
    });
    if (!data.error) {
      getPromotionsFeatured();
      getPromotionsClose();
      GetPromotions();
      getPromotionsMonthly();
      getPromotionsArrivals()
    }
  };

  const createOptions = async () => {
    await axios
      .post(inventorySearch, {
        search: searchKey,
      })
      .then((res) => {
        if (!res.error) {
          let data = res?.data.results.results;
          setProducts(data);
          const optionList = data?.map((item, index) => ({
            value: item?._id,
            label: item?.unitName,
          }));
          setOptions(optionList);
        }
      });
  };

  const GetProducts = async (id) => {
    await axios.get(getProducts + "/" + id).then((res) => {
      console.log(res);
      setProducts(res?.data.results);
    });
  };

  const handleChange2 = (selected) => {
    setSelectedProduct({
      usersSelected: selected,
    });
    GetProducts(selected?.value);
  };

  const handleInputChange = (inputValue) => {
    setSearchKey(inputValue);
  };

  const AddProductHot = async (e) => {
    e.preventDefault();
    await axios
      .post(addPromotions, {
        productId: selectedProduct?.usersSelected?.value,
        flavourId: flavour && JSON.parse(flavour),
        title: "Hot Selling",
        type: "HotSelling",
        price: price,
      })
      .then((res) => {
        if (!res.data.error) {
          Swal.fire({
            title: "New Product Added!",
            icon: "success",
            confirmButtonText: "Ok",
            timer: 1000,
          });
          setPrice("");
          setSelectedProduct({ usersSelected: null });
          setProducts([]);
          GetPromotions();
        }
      });
  };
  const AddProductFeatured = async (e) => {
    e.preventDefault();
    await axios
      .post(addPromotions, {
        productId: selectedProduct?.usersSelected?.value,
        flavourId: flavour && JSON.parse(flavour),
        title: "Featured Product",
        type: "Featured",
        price: price,
      })
      .then((res) => {
        if (!res.data.error) {
          Swal.fire({
            title: "New Product Added!",
            icon: "success",
            confirmButtonText: "Ok",
            timer: 1000,
          });
          setSelectedProduct({ usersSelected: null });
          setProducts([]);
          getPromotionsFeatured();
          setPrice("");
        }
      });
  };

  const AddProductNewArrivals = async (e) => {
    e.preventDefault();
    await axios
      .post(addPromotions, {
        productId: selectedProduct?.usersSelected?.value,
        flavourId: flavour && JSON.parse(flavour),
        title: "New Arrivals",
        type: "NewArrivals",
        price: price,
      })
      .then((res) => {
        if (!res.data.error) {
          Swal.fire({
            title: "New Product Added!",
            icon: "success",
            confirmButtonText: "Ok",
            timer: 1000,
          });
          setSelectedProduct({ usersSelected: null });
          setProducts([]);
          getPromotionsArrivals();
          setPrice("");
        }
      });
  };

  const AddProductClose = async (e) => {
    e.preventDefault();
    await axios
      .post(addPromotions, {
        productId: selectedProduct?.usersSelected?.value,
        flavourId: flavour && JSON.parse(flavour),
        title: "Hot Selling",
        type: "CloseOut",
        expireIn: expiry,
        price: price,
      })
      .then((res) => {
        if (!res.data.error) {
          Swal.fire({
            title: "New Product Added!",
            icon: "success",
            confirmButtonText: "Ok",
            timer: 1000,
          });
          setSelectedProduct({ usersSelected: null });
          setProducts([]);
          setPrice("");
          getPromotionsClose();
          setExpiry("");
        }
        if (res.data.error) {
          Swal.fire({
            title: res?.data.message,
            icon: "error",
            confirmButtonText: "Ok",
            timer: 1000,
          });
        }
      });
  };
  const AddProducMonthly = async (e) => {
    e.preventDefault();
    await axios
      .post(addPromotions, {
        productId: selectedProduct?.usersSelected?.value,
        flavourId: flavour && JSON.parse(flavour),
        title: "Hot Selling",
        type: "MonthlyDeals",
        expireIn: expiry,
        price: price,
      })
      .then((res) => {
        if (!res.data.error) {
          Swal.fire({
            title: "New Product Added!",
            icon: "success",
            confirmButtonText: "Ok",
            timer: 1000,
          });
          setSelectedProduct({ usersSelected: null });
          setProducts([]);
          setPrice("");
          getPromotionsMonthly();
          setExpiry("");
        }
        if (res.data.error) {
          Swal.fire({
            title: res?.data.message,
            icon: "error",
            confirmButtonText: "Ok",
            timer: 1000,
          });
        }
      });
  };

  var today = new Date().toISOString().split("T")[0];
  document.getElementById("dateF")?.setAttribute("min", today);

  return (
    <div>
      <div className="row cms_management justify-content-center">
        <div className="col-12">
          <div className="row mx-0">
            <div className="col-12 design_outter_comman recent_orders shadow">
              <div className="row">
                <div className="col-12 user-management-cms px-0">
                  <nav>
                    <div
                      className="nav nav-tabs_prod "
                      id="nav-tab"
                      role="tablist"
                    >
                      <button
                        className="nav-link active labels"
                        id="nav-home-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-home"
                        type="button"
                        role="tab"
                        aria-controls="nav-home"
                        aria-selected="true"
                        onClick={() => {
                          setPrice("");
                        }}
                      >
                        HOT DEALS PRODUCTS
                      </button>
                      <button
                        className="nav-link  labels"
                        id="nav-age-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-age"
                        type="button"
                        role="tab"
                        aria-controls="nav-age"
                        aria-selected="true"
                        onClick={() => {
                          setPrice("");
                        }}
                      >
                        CLOSING OUT DEALS
                      </button>
                      <button
                        className="nav-link labels"
                        id="nav-homeBannNew-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-homeBannNew"
                        type="button"
                        role="tab"
                        aria-controls="nav-homeBannNew"
                        aria-selected="true"
                        onClick={() => {
                          setPrice("");
                        }}
                      >
                        NEW ARRIVALS PRODUCTS
                      </button>
                      <button
                        className="nav-link labels"
                        id="nav-homeBann-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-homeBann"
                        type="button"
                        role="tab"
                        aria-controls="nav-homeBann"
                        aria-selected="true"
                        onClick={() => {
                          setPrice("");
                        }}
                      >
                        FEATURED PRODUCTS
                      </button>
                      <button
                        className="nav-link  labels"
                        id="nav-month-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#nav-month"
                        type="button"
                        role="tab"
                        aria-controls="nav-month"
                        aria-selected="true"
                        onClick={() => {
                          setPrice("");
                        }}
                      >
                        MONTHLY DEALSS
                      </button>
                    </div>
                  </nav>
                  <div className="tab-content" id="nav-tabContent">
                    <div
                      className="tab-pane fade show active"
                      id="nav-home"
                      role="tabpanel"
                      aria-labelledby="nav-home-tab"
                    >
                      <div className="row mx-0 cms_home_banner">
                        <div className="col-12 design_outter_comman  shadow">
                          <form
                            className="form-design py-3 px-4 help-support-form row align-items-end justify-content-center bg-light border-bottom"
                            action=""
                          >
                            <div className="form-group col-4 ">
                              <label htmlFor="">Product Name </label>
                              <Select
                                name="users"
                                options={options}
                                value={selectedProduct?.usersSelected}
                                className="basic-multi-select z-3"
                                classNamePrefix="select"
                                onChange={handleChange2}
                                onInputChange={handleInputChange}
                                isClearable
                              />
                            </div>
                            <div className="form-group col-4">
                              <label htmlFor="">Select Flavour </label>
                              <select
                                type="select"
                                className="form-select"
                                onChange={(e) => setFlavour(e.target.value)}
                              >
                                <option selected="" value="">
                                  Select Any Flavour
                                </option>

                                {product?.type?.map((item, ind) => (
                                  <option
                                    value={JSON.stringify(item?._id)}
                                    key={ind}
                                  >
                                    {item?.flavour}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group col-4 ">
                              <label htmlFor="">Product Price </label>
                              <input
                                type="number"
                                className="form-control-sub border border-secondary"
                                name="Price"
                                value={price}
                                placeholder="Enter Product Price"
                                onChange={(e) => setPrice(e.target.value)}
                              />
                            </div>

                            <div className="form-group  col-2">
                              <button
                                className="comman_btn"
                                onClick={AddProductHot}
                              >
                                Save
                              </button>
                            </div>
                          </form>
                          <div className="row pt-2">
                            <div className="col-12 comman_table_design pb-3">
                              <div className="table-responsive">
                                <table className="table mb-0">
                                  <thead>
                                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                                      <th>Product Image</th>
                                      <th>Product Name</th>
                                      <th>Product Flavour</th>
                                      <th>Product Price</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {(hotSell || [])?.map((User, index) => (
                                      <tr key={index} className="">
                                        <td className="border">
                                          <img
                                            width={60}
                                            src={
                                              User?.productId?.type
                                                ?.flavourImage
                                                ? User?.productId?.type
                                                    ?.flavourImage
                                                : User?.productId
                                                    ?.productImage ||
                                                  require("../../../assets/img/product.jpg")
                                            }
                                          />
                                        </td>

                                        <td className="border">
                                          {User?.productId?.unitName}
                                        </td>
                                        <td className="border">
                                          {User?.productId?.type?.flavour
                                            ? User?.productId?.type?.flavour
                                            : "Not Selected"}
                                        </td>

                                        <td
                                          className="border"
                                          key={User?.price}
                                        >
                                          <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={User?.price}
                                            onChange={(e) => {
                                              setPriceEdit(e.target.value);
                                            }}
                                          ></input>
                                        </td>

                                        <td className="border">
                                          <button
                                            className="comman_btn mx-2"
                                            onClick={() => {
                                              changePrice(
                                                "HotSelling",
                                                User?.productId?._id,
                                                User?.productId?.type
                                              );
                                            }}
                                          >
                                            Save
                                          </button>
                                          <a
                                            className="comman_btn2 text-white text-decoration-none"
                                            onClick={() => {
                                              deleteProduct(
                                                "HotSelling",
                                                User?._id,
                                                User?.productId?.type
                                              );
                                            }}
                                          >
                                            Delete
                                          </a>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-homeBann"
                      role="tabpanel"
                      aria-labelledby="nav-homeBann-tab"
                    >
                      <div className="row mx-0 cms_home_banner">
                        <div className="col-12 design_outter_comman  shadow">
                          <form
                            className="form-design py-3 px-4 help-support-form row align-items-end justify-content-center bg-light border-bottom"
                            action=""
                          >
                            <div className="form-group col-4 ">
                              <label htmlFor="">Product Name </label>
                              <Select
                                name="users"
                                options={options}
                                value={selectedProduct?.usersSelected}
                                className="basic-multi-select z-3"
                                classNamePrefix="select"
                                onChange={handleChange2}
                                onInputChange={handleInputChange}
                                isClearable
                              />
                            </div>
                            <div className="form-group col-4">
                              <label htmlFor="">Select Flavour </label>
                              <select
                                type="select"
                                className="form-select"
                                onChange={(e) => setFlavour(e.target.value)}
                              >
                                <option selected="" value="">
                                  Select Any Flavour
                                </option>

                                {product?.type?.map((item, ind) => (
                                  <option
                                    value={JSON.stringify(item?._id)}
                                    key={ind}
                                  >
                                    {item?.flavour}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group col-4 ">
                              <label htmlFor="">Product Price </label>
                              <input
                                type="number"
                                className="form-control-sub border border-secondary"
                                name="Price"
                                value={price}
                                placeholder="Enter Product Price"
                                onChange={(e) => setPrice(e.target.value)}
                              />
                            </div>

                            <div className="form-group  col-2">
                              <button
                                className="comman_btn"
                                onClick={AddProductFeatured}
                              >
                                Save
                              </button>
                            </div>
                          </form>

                          <div className="row pt-2">
                            <div className="col-12 comman_table_design pb-3">
                              <div className="table-responsive">
                                <table className="table mb-0">
                                  <thead>
                                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                                      <th>Product Image</th>
                                      <th>Product Name</th>
                                      <th>Product Flavour</th>
                                      <th>Product Price</th>

                                      <th>Action</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {(featured || [])?.map((User, index) => (
                                      <tr key={index} className="">
                                        <td className="border">
                                          <img
                                            width={60}
                                            src={
                                              User?.productId?.type
                                                ?.flavourImage
                                                ? User?.productId?.type
                                                    ?.flavourImage
                                                : User?.productId
                                                    ?.productImage ||
                                                  require("../../../assets/img/product.jpg")
                                            }
                                          />
                                        </td>

                                        <td className="border">
                                          {User?.productId?.unitName}
                                        </td>
                                        <td className="border">
                                          {User?.productId?.type?.flavour
                                            ? User?.productId?.type?.flavour
                                            : "Not Selected"}
                                        </td>
                                        <td
                                          className="border"
                                          key={User?.price}
                                        >
                                          <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={User?.price}
                                            onChange={(e) => {
                                              setPriceEdit(e.target.value);
                                            }}
                                          ></input>
                                        </td>

                                        <td className="border">
                                          <button
                                            className="comman_btn mx-2"
                                            onClick={() => {
                                              changePrice(
                                                "Featured",
                                                User?.productId?._id,
                                                User?.productId?.type
                                              );
                                            }}
                                          >
                                            Save
                                          </button>
                                          <a
                                            className="comman_btn2 text-white text-decoration-none"
                                            onClick={() => {
                                              deleteProduct(
                                                "Featured",
                                                User?._id,
                                                User?.productId?.type
                                              );
                                            }}
                                          >
                                            Delete
                                          </a>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-homeBannNew"
                      role="tabpanel"
                      aria-labelledby="nav-homeBannNew-tab"
                    >
                      <div className="row mx-0 cms_home_banner">
                        <div className="col-12 design_outter_comman  shadow">
                          <form
                            className="form-design py-3 px-4 help-support-form row align-items-end justify-content-center bg-light border-bottom"
                            action=""
                          >
                            <div className="form-group col-4 ">
                              <label htmlFor="">Product Name </label>
                              <Select
                                name="users"
                                options={options}
                                value={selectedProduct?.usersSelected}
                                className="basic-multi-select z-3"
                                classNamePrefix="select"
                                onChange={handleChange2}
                                onInputChange={handleInputChange}
                                isClearable
                              />
                            </div>
                            <div className="form-group col-4">
                              <label htmlFor="">Select Flavour </label>
                              <select
                                type="select"
                                className="form-select"
                                onChange={(e) => setFlavour(e.target.value)}
                              >
                                <option selected="" value="">
                                  Select Any Flavour
                                </option>

                                {product?.type?.map((item, ind) => (
                                  <option
                                    value={JSON.stringify(item?._id)}
                                    key={ind}
                                  >
                                    {item?.flavour}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group col-4 ">
                              <label htmlFor="">Product Price </label>
                              <input
                                type="number"
                                className="form-control-sub border border-secondary"
                                name="Price"
                                value={price}
                                placeholder="Enter Product Price"
                                onChange={(e) => setPrice(e.target.value)}
                              />
                            </div>

                            <div className="form-group  col-2">
                              <button
                                className="comman_btn"
                                onClick={AddProductNewArrivals}
                              >
                                Save
                              </button>
                            </div>
                          </form>
                          <div className="row pt-2">
                            <div className="col-12 comman_table_design pb-3">
                              <div className="table-responsive">
                                <table className="table mb-0">
                                  <thead>
                                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                                      <th>Product Image</th>
                                      <th>Product Name</th>
                                      <th>Product Flavour</th>
                                      <th>Product Price</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {(NArrivals || [])?.map((User, index) => (
                                      <tr key={index} className="">
                                        <td className="border">
                                          <img
                                            width={60}
                                            src={
                                              User?.productId?.type
                                                ?.flavourImage
                                                ? User?.productId?.type
                                                    ?.flavourImage
                                                : User?.productId
                                                    ?.productImage ||
                                                  require("../../../assets/img/product.jpg")
                                            }
                                          />
                                        </td>

                                        <td className="border">
                                          {User?.productId?.unitName}
                                        </td>
                                        <td className="border">
                                          {User?.productId?.type?.flavour
                                            ? User?.productId?.type?.flavour
                                            : "Not Selected"}
                                        </td>
                                        <td
                                          className="border"
                                          key={User?.price}
                                        >
                                          <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={User?.price}
                                            onChange={(e) => {
                                              setPriceEdit(e.target.value);
                                            }}
                                          ></input>
                                        </td>

                                        <td className="border">
                                          <button
                                            className="comman_btn mx-2"
                                            onClick={() => {
                                              changePrice(
                                                "NewArrivals",
                                                User?.productId?._id,
                                                User?.productId?.type
                                              );
                                            }}
                                          >
                                            Save
                                          </button>
                                          <a
                                            className="comman_btn2 text-white text-decoration-none"
                                            onClick={() => {
                                              deleteProduct(
                                                "NewArrivals",
                                                User?._id,
                                                User?.productId?.type
                                              );
                                            }}
                                          >
                                            Delete
                                          </a>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="tab-pane fade"
                      id="nav-homeBann"
                      role="tabpanel"
                      aria-labelledby="nav-homeBann-tab"
                    >
                      <div className="row mx-0 cms_home_banner">
                        <div className="col-12 design_outter_comman  shadow">
                          <form
                            className="form-design py-3 px-4 help-support-form row align-items-end justify-content-center bg-light border-bottom"
                            action=""
                          >
                            <div className="form-group col-4 ">
                              <label htmlFor="">Product Name </label>
                              <Select
                                name="users"
                                options={options}
                                value={selectedProduct?.usersSelected}
                                className="basic-multi-select z-3"
                                classNamePrefix="select"
                                onChange={handleChange2}
                                onInputChange={handleInputChange}
                                isClearable
                              />
                            </div>
                            <div className="form-group col-4">
                              <label htmlFor="">Select Flavour </label>
                              <select
                                type="select"
                                className="form-select"
                                onChange={(e) => setFlavour(e.target.value)}
                              >
                                <option selected="" value="">
                                  Select Any Flavour
                                </option>

                                {product?.type?.map((item, ind) => (
                                  <option
                                    value={JSON.stringify(item?._id)}
                                    key={ind}
                                  >
                                    {item?.flavour}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group col-4 ">
                              <label htmlFor="">Product Price </label>
                              <input
                                type="number"
                                className="form-control-sub border border-secondary"
                                name="Price"
                                value={price}
                                placeholder="Enter Product Price"
                                onChange={(e) => setPrice(e.target.value)}
                              />
                            </div>

                            <div className="form-group  col-2">
                              <button
                                className="comman_btn"
                                onClick={AddProductFeatured}
                              >
                                Save
                              </button>
                            </div>
                          </form>
                          <div className="row pt-2">
                            <div className="col-12 comman_table_design pb-3">
                              <div className="table-responsive">
                                <table className="table mb-0">
                                  <thead>
                                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                                      <th>Product Image</th>
                                      <th>Product Name</th>
                                      <th>Product Flavour</th>
                                      <th>Product Price</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {(featured || [])?.map((User, index) => (
                                      <tr key={index} className="">
                                        <td className="border">
                                          <img
                                            width={60}
                                            src={
                                              User?.productId?.type
                                                ?.flavourImage
                                                ? User?.productId?.type
                                                    ?.flavourImage
                                                : User?.productId
                                                    ?.productImage ||
                                                  require("../../../assets/img/product.jpg")
                                            }
                                          />
                                        </td>

                                        <td className="border">
                                          {User?.productId?.unitName}
                                        </td>
                                        <td className="border">
                                          {User?.productId?.type?.flavour
                                            ? User?.productId?.type?.flavour
                                            : "Not Selected"}
                                        </td>
                                        <td
                                          className="border"
                                          key={User?.price}
                                        >
                                          <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={User?.price}
                                            onChange={(e) => {
                                              setPriceEdit(e.target.value);
                                            }}
                                          ></input>
                                        </td>

                                        <td className="border">
                                          <button
                                            className="comman_btn mx-2"
                                            onClick={() => {
                                              changePrice(
                                                "Featured",
                                                User?.productId?._id,
                                                User?.productId?.type
                                              );
                                            }}
                                          >
                                            Save
                                          </button>
                                          <a
                                            className="comman_btn2 text-white text-decoration-none"
                                            onClick={() => {
                                              deleteProduct(
                                                "Featured",
                                                User?._id,
                                                User?.productId?.type
                                              );
                                            }}
                                          >
                                            Delete
                                          </a>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="tab-pane fade"
                      id="nav-age"
                      role="tabpanel"
                      aria-labelledby="nav-age-tab"
                    >
                      <div className="row mx-0 cms_home_banner">
                        <div className="col-12 design_outter_comman  shadow">
                          <form
                            className="form-design py-3 px-4 help-support-form row align-items-end justify-content-start bg-light border-bottom"
                            action=""
                          >
                            <div className="form-group col-5 ">
                              <label htmlFor="">Product Name </label>
                              <Select
                                name="users"
                                options={options}
                                value={selectedProduct?.usersSelected}
                                className="basic-multi-select z-3"
                                classNamePrefix="select"
                                onChange={handleChange2}
                                onInputChange={handleInputChange}
                                isClearable
                              />
                            </div>
                            <div className="form-group col-5">
                              <label htmlFor="">Select Flavour </label>
                              <select
                                type="select"
                                className="form-select"
                                onChange={(e) => setFlavour(e.target.value)}
                              >
                                <option selected="" value="">
                                  Select Any Flavour
                                </option>

                                {product?.type?.map((item, ind) => (
                                  <option
                                    value={JSON.stringify(item?._id)}
                                    key={ind}
                                  >
                                    {item?.flavour}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group col-5">
                              <label htmlFor="">Select Deal End Date </label>
                              <input
                                type="date"
                                className="form-select"
                                id="dateF"
                                name="expiry"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                              ></input>
                            </div>

                            <div className="form-group col-5 ">
                              <label htmlFor="">Product Price </label>
                              <input
                                type="number"
                                className="form-control-sub border border-secondary"
                                name="Price"
                                value={price}
                                placeholder="Enter Product Price"
                                onChange={(e) => setPrice(e.target.value)}
                              />
                            </div>

                            <div className="form-group  col-2">
                              <button
                                className="comman_btn"
                                onClick={AddProductClose}
                              >
                                Save
                              </button>
                            </div>
                          </form>
                          <div className="row pt-2">
                            <div className="col-12 comman_table_design pb-3">
                              <div className="table-responsive">
                                <table className="table mb-0">
                                  <thead>
                                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                                      <th>Product Image</th>
                                      <th>Product Name</th>
                                      <th>Product Flavour</th>
                                      <th>Product Price</th>
                                      <th>Deal End Date</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {(closeOut || [])?.map((User, index) => (
                                      <tr key={index} className="">
                                        <td className="border">
                                          <img
                                            width={60}
                                            src={
                                              User?.productId?.type
                                                ?.flavourImage
                                                ? User?.productId?.type
                                                    ?.flavourImage
                                                : User?.productId
                                                    ?.productImage ||
                                                  require("../../../assets/img/product.jpg")
                                            }
                                          />
                                        </td>

                                        <td className="border">
                                          {User?.productId?.unitName}
                                        </td>
                                        <td className="border">
                                          {User?.productId?.type?.flavour
                                            ? User?.productId?.type?.flavour
                                            : "Not Selected"}
                                        </td>
                                        <td
                                          className="border"
                                          key={User?.price}
                                        >
                                          <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={User?.price}
                                            onChange={(e) => {
                                              setPriceEdit(e.target.value);
                                            }}
                                          ></input>
                                        </td>
                                        {/* <td className="border">
                                          {moment(
                                            User?.expireIn?.slice(0, 10)
                                          ).format("MM/DD/YYYY")}

                                        </td> */}
                                        <td className="border">
                                          <input
                                            type="date"
                                            className=" form-control"
                                            id="dateEdit"
                                            name="expiryDate"
                                            defaultValue={moment(
                                              User?.expireIn?.slice(0, 10)
                                            ).format("YYYY-MM-DD")}
                                            onChange={(e) =>
                                              EditMonthlyDate(
                                                e.target.value,
                                                "CloseOut",
                                                User?.productId?._id,
                                                User?.productId?.type
                                              )
                                            }
                                          ></input>
                                        </td>

                                        <td className="border">
                                          <button
                                            className="comman_btn mx-2"
                                            onClick={() => {
                                              changePrice(
                                                "CloseOut",
                                                User?.productId?._id,
                                                User?.productId?.type
                                              );
                                            }}
                                          >
                                            Save
                                          </button>
                                          <a
                                            className="comman_btn2 text-white text-decoration-none"
                                            onClick={() => {
                                              deleteProduct(
                                                "CloseOut",
                                                User?._id,
                                                User?.productId?.type
                                              );
                                            }}
                                          >
                                            Delete
                                          </a>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className="tab-pane fade"
                      id="nav-month"
                      role="tabpanel"
                      aria-labelledby="nav-month-tab"
                    >
                      <div className="row mx-0 cms_home_banner">
                        <div className="col-12 design_outter_comman  shadow">
                          <form
                            className="form-design py-3 px-4 help-support-form row align-items-end justify-content-start bg-light border-bottom"
                            action=""
                          >
                            <div className="form-group col-5 ">
                              <label htmlFor="">Product Name </label>
                              <Select
                                name="users"
                                options={options}
                                value={selectedProduct?.usersSelected}
                                className="basic-multi-select z-3"
                                classNamePrefix="select"
                                onChange={handleChange2}
                                onInputChange={handleInputChange}
                                isClearable
                              />
                            </div>
                            <div className="form-group col-5">
                              <label htmlFor="">Select Flavour </label>
                              <select
                                type="select"
                                className="form-select"
                                onChange={(e) => setFlavour(e.target.value)}
                              >
                                <option selected="" value="">
                                  Select Any Flavour
                                </option>

                                {product?.type?.map((item, ind) => (
                                  <option
                                    value={JSON.stringify(item?._id)}
                                    key={ind}
                                  >
                                    {item?.flavour}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="form-group col-5">
                              <label htmlFor="">Select Deal End Date </label>
                              <input
                                type="date"
                                className="form-select"
                                id="dateF"
                                name="expiry"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                              ></input>
                            </div>

                            <div className="form-group col-5 ">
                              <label htmlFor="">Product Price </label>
                              <input
                                type="number"
                                className="form-control-sub border border-secondary"
                                name="Price"
                                value={price}
                                placeholder="Enter Product Price"
                                onChange={(e) => setPrice(e.target.value)}
                              />
                            </div>

                            <div className="form-group  col-2">
                              <button
                                className="comman_btn"
                                onClick={AddProducMonthly}
                              >
                                Save
                              </button>
                            </div>
                          </form>
                          <div className="row pt-2">
                            <div className="col-12 comman_table_design pb-3">
                              <div className="table-responsive">
                                <table className="table mb-0">
                                  <thead>
                                    <tr style={{ backgroundColor: "#f2f2f2" }}>
                                      <th>Product Image</th>
                                      <th>Product Name</th>
                                      <th>Product Flavour</th>
                                      <th>Product Price</th>
                                      <th>Deal End Date</th>
                                      <th>Action</th>
                                    </tr>
                                  </thead>

                                  <tbody>
                                    {(monthly || [])?.map((User, index) => (
                                      <tr key={index} className="">
                                        <td className="border">
                                          <img
                                            width={60}
                                            src={
                                              User?.productId?.type
                                                ?.flavourImage
                                                ? User?.productId?.type
                                                    ?.flavourImage
                                                : User?.productId
                                                    ?.productImage ||
                                                  require("../../../assets/img/product.jpg")
                                            }
                                          />
                                        </td>

                                        <td className="border">
                                          {User?.productId?.unitName}
                                        </td>
                                        <td className="border">
                                          {User?.productId?.type?.flavour
                                            ? User?.productId?.type?.flavour
                                            : "Not Selected"}
                                        </td>
                                        <td
                                          className="border"
                                          key={User?.price}
                                        >
                                          <input
                                            type="number"
                                            className="form-control"
                                            defaultValue={User?.price}
                                            onChange={(e) => {
                                              setPriceEdit(e.target.value);
                                            }}
                                          ></input>
                                        </td>
                                        <td className="border">
                                          <input
                                            type="date"
                                            className=" form-control"
                                            id="dateEdit"
                                            name="expiryDate"
                                            defaultValue={moment(
                                              User?.expireIn?.slice(0, 10)
                                            ).format("YYYY-MM-DD")}
                                            onChange={(e) =>
                                              EditMonthlyDate(
                                                e.target.value,
                                                "MonthlyDeals",
                                                User?.productId?._id,
                                                User?.productId?.type
                                              )
                                            }
                                          ></input>
                                        </td>

                                        <td className="border">
                                          <button
                                            className="comman_btn mx-2"
                                            onClick={() => {
                                              changePrice(
                                                "MonthlyDeals",
                                                User?.productId?._id,
                                                User?.productId?.type
                                              );
                                            }}
                                          >
                                            Save
                                          </button>
                                          <a
                                            className="comman_btn2 text-white text-decoration-none"
                                            onClick={() => {
                                              deleteProduct(
                                                "MonthlyDeals",
                                                User?._id,
                                                User?.productId?.type
                                              );
                                            }}
                                          >
                                            Delete
                                          </a>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsManage;
