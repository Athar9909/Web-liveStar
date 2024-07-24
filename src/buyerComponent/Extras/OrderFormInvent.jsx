import axios from "axios";import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { orderFromProducts } from "../../atom";
import { Button } from "rsuite";
import Swal from "sweetalert2";

const OrderFormInvent = () => {
  const [loader, setLoader] = useState(false);
  axios.defaults.headers.common["x-auth-token-vendor"] =
    localStorage.getItem("vendorLog");
  const [products, setProducts] = useState([]);
  const vendorProducts = `${process.env.REACT_APP_APIENDPOINTNEW}vendor/vendorProducts`;
  const [quantities, setQuantities] = useState([]);
  const orderProducts = useRecoilValue(orderFromProducts);
  const setOrderProducts = useSetRecoilState(orderFromProducts);
  const [selectedProd, setSelectedProd] = useState(orderProducts ?? []);
  const [selected, setSelected] = useState([]);
  let navigate = useNavigate();
  console.log(orderProducts, "recoild");

  // useEffect(() => {
  //   setOrderProducts(selectedProd);
  // }, [selectedProd]);

  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async (key) => {
    try {
      const response = await axios.get(vendorProducts, {
        search: key,
      });
      let data = response?.data.results.products;
      data.forEach((product) => {
        // Iterate over each type object
        product.type.forEach((type) => {
          // Create a new object to hold promoComment and listingPrice separately
          type.promoAndPrice = {
            promoComment: product.promoComment,
            listingPrice: product.listingPrice,
          };
          // Remove the original keys if needed
          // delete type.promoComment;
          // delete type.listingPrice;
        });
      });

      const mergedProducts = mergeProducts(data);
      setProducts(mergedProducts);
    } catch (error) {
      // Handle errors
      console.error("Error fetching products:", error);
    }
  };

  const mergeProducts = (products) => {
    const merged = {};
    console.log(products, "before merged");

    products.forEach((product) => {
      const id = product._id;
      if (!merged[id]) {
        merged[id] = { ...product };
      } else {
        // Merge properties if the ID already exists
        Object.keys(product).forEach((key) => {
          if (Array.isArray(product[key])) {
            // Merge arrays if the property is an array
            merged[id][key] = merged[id][key] || [];
            merged[id][key] = merged[id][key].concat(product[key]);
          } else {
            // Otherwise, overwrite existing properties
            merged[id][key] = product[key];
          }
        });
      }
    });
    console.log(merged, "after merged");

    return Object.values(merged);
  };

  console.log(products, quantities);

  const SetSelection = (i) => {
    let prod = [...selected];
    prod.forEach((item, index) => {
      if (item._id !== i._id) {
        item.IsVisible = false;
      } else {
        item.IsVisible = true;
      }
    });

    let foundIndex = prod.findIndex((obj) => obj?._id === i._id);

    if (foundIndex !== -1) {
      console.log("");
    } else {
      i.IsVisible = true;
      prod.push(i);
    }

    setSelected(prod);
  };

  console.log(selected, "kjhkj");

  const VisibilityToggle = (id, i, visible) => {
    let prod = [...selected];
    prod[i].IsVisible = visible;

    prod.forEach((item, index) => {
      if (index !== i) {
        item.IsVisible = false;
      }
    });

    setSelected(prod);
  };

  console.log(selectedProd, "athards");

  const GetProductLength = (id) => {
    let products = selectedProd?.filter((itm) => {
      if (itm?.productId === id) {
        return itm;
      }
    });
    return products?.length;
  };

  const SelectFlavours = (
    id,
    i,
    e,
    uName,
    flv,
    bar,
    comment,
    index,
    ind,
    price
  ) => {
    let checked = e.target.checked;
    let prod = [...selected];
    prod[index].type[ind].IsSelected = checked;
    setSelected(prod);

    let prods = [...selectedProd];
    let quantity = 1;

    if (checked) {
      // Increase quantity by 1 or add new product
      let foundIndex = prods.findIndex((obj) => obj?.flavourId === i);
      if (foundIndex !== -1) {
        // Create a new object to update quantity
        let updatedProduct = { ...prods[foundIndex] };
        updatedProduct.newQuantity = 1;
        prods[foundIndex] = updatedProduct;
      } else {
        prods.push({
          productId: id,
          flavourId: i,
          unitName: uName,
          flavour: flv,
          barcodes: bar,
          comment: comment,
          quantity: quantity,
          listingPrice: price,
        });
      }
      setSelectedProd(prods);
    } else {
      let foundIndex = prods.findIndex((obj) => obj?.flavourId === i);
      if (foundIndex !== -1) {
        prods.splice(foundIndex, 1);
        setSelectedProd(prods);
      }
    }
  };

  const handleChange = (id, e, index, ind) => {
    console.log(index, ind);
    let value = +e.target.value;
    let selectedItems = [...selectedProd];
    let select2 = [...selected];
    select2[index].type[ind].HoldQuantity = value;
    let updatedSelected = selectedItems.map((obj) => {
      if (obj?.flavourId === id) {
        return { ...obj, newQuantity: value }; // Create a new object with updated quantity
      }
      return obj;
    });
    setSelectedProd(updatedSelected);
    setSelected(select2);
  };

  const AddinOrder = () => {
    let selected = [...selectedProd];

    if (selected?.length > 0) {
      setLoader(true);

      let updatedProd = selected.map((itm) => {
        return {
          ...itm,
          quantity: itm.quantity + (itm.newQuantity ? itm.newQuantity : 0),
        };
      });
      console.log(updatedProd);
      setOrderProducts(updatedProd);

      setTimeout(() => {
        navigate("/app/OrderForm/:star");
        setLoader(false);
      }, 5000);
    } else {
      Swal.fire({
        title: "Please select flavor!",
        text: "Please select atleast one flavor.",
        icon: "warning",
        timer: 2000,
      });
    }
  };

  const searchProducts = (key) => {
    if (key?.length) {
      const searchTerm = key.trim().toLowerCase();
      let filteredProducts = products.filter((product) =>
        product.unitName.toLowerCase().includes(searchTerm)
      );
      setProducts(filteredProducts);
    } else {
      getProducts();
    }
  };

  return (
    <div>
      <div className="">
        <div className="container-fluid py-2">
          <div className="row justify-content-center">
            <div className="col-lg-4">
              <form className=" mt-3 bg-white p-4 mb-5 shadow">
                <div className="row">
                  <div>
                    <div className="d-flex justify-content-between">
                      <Button
                        appearance="primary"
                        loading={loader}
                        className="comman_btn  mb-4"
                        onClick={() => AddinOrder()}
                      >
                        Add In Order list
                      </Button>
                      <div>
                        <input
                          type="search"
                          className="form-control"
                          placeholder="Search product"
                          style={{ width: "95%" }}
                          onChange={(e) => searchProducts(e.target.value)}
                        ></input>
                      </div>
                    </div>
                    <div
                      style={{
                        overflowY: "scroll",
                        maxHeight: "80vh",
                      }}
                      className="table-responsive"
                    >
                      <table className="table mb-4">
                        <thead>
                          <tr style={{ backgroundColor: "#f2f2f2" }}>
                            <th>S.No</th>
                            <th>Product Name</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(products || [])
                            .sort((a, b) =>
                              a.unitName.localeCompare(b.unitName)
                            )
                            ?.map((item, index) => (
                              <tr key={index} className="border ">
                                <td
                                  className="border product_list_invent "
                                >
                                  {index + 1}.
                                </td>
                                <td
                                  className="border product_list_invent "
                                  onClick={() => SetSelection(item)}
                                >
                                  {item?.unitName}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="col-lg-8">
              <form className=" mt-3 bg-white p-4 mb-5 shadow">
                <div className="row">
                  <div
                    style={{
                      overflowY: "scroll",
                      maxHeight: "80vh",
                    }}
                    className="table-responsive"
                  >
                    Selected : {selected?.length} - (Same products will not
                    overide)
                    <table
                      className="table mb-4"
                      style={{
                        overflowX: "scroll",
                        maxWidth: "99%",
                      }}
                    >
                      <thead>
                        <tr style={{ backgroundColor: "#f2f2f2" }}>
                          <th>Select</th>

                          <th>Product Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {(selected || [])?.map((item, index) => (
                          <tr key={index} className="border ">
                            <td className=" d-flex justify-content-center">
                              <span className="count_invent">
                                {GetProductLength(item?._id)}
                              </span>

                              <div className="arrows">
                                {item?.IsVisible ? (
                                  <i
                                    class="fa-solid fa-angle-down down_arrow  rotate-up"
                                    onClick={(e) => {
                                      VisibilityToggle(item?._id, index, false);
                                    }}
                                  ></i>
                                ) : (
                                  <i
                                    class="fa-solid fa-angle-down down_arrow rotate-down"
                                    onClick={(e) => {
                                      VisibilityToggle(item?._id, index, true);
                                    }}
                                  ></i>
                                )}
                              </div>
                              <div></div>
                            </td>
                            <td className="border ">
                              {item?.unitName}

                              {item?.IsVisible && (
                                <table
                                  className="table animate__animated animate__fadeInRight animate_faster"
                                  style={{
                                    overflow: "visible",
                                  }}
                                >
                                  <thead>
                                    <tr>
                                      <th>Select</th>
                                      <th>Qty (In Units)</th>

                                      <th>Barcode</th>
                                      <th>Flavor</th>
                                      <th>List Price</th>
                                      <th>Promotion</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {item?.type?.map((itm, ind) => (
                                      <tr>
                                        <td>
                                          <div class="form-check">
                                            <input
                                              style={{
                                                width: "1.5rem",
                                                height: "1.5rem",
                                              }}
                                              class="form-check-input"
                                              defaultChecked={itm?.IsSelected}
                                              type="checkbox"
                                              onChange={(e) => {
                                                SelectFlavours(
                                                  item?._id,
                                                  itm?._id,
                                                  e,
                                                  item?.unitName,
                                                  itm?.flavour,
                                                  itm?.barcode[0],
                                                  item?.promoComment,
                                                  index,
                                                  ind,
                                                  item?.listingPrice
                                                );
                                              }}
                                              value=""
                                              id={itm?._id}
                                            />
                                            <label
                                              class="form-check-label"
                                              for={itm?._id}
                                            ></label>
                                          </div>
                                        </td>
                                        <td className="border  ">
                                          <span className="fs-5 ">
                                            <input
                                              type="number"
                                              style={{
                                                width: "100px",
                                              }}
                                              maxLength="4"
                                              id={itm._id}
                                              disabled={!itm?.IsSelected}
                                              name="price"
                                              defaultValue={
                                                itm?.HoldQuantity || 1
                                              }
                                              className="border text-center  rounded"
                                              onChange={(e) => {
                                                handleChange(
                                                  itm?._id,
                                                  e,
                                                  index,
                                                  ind
                                                );
                                              }}
                                            ></input>
                                          </span>
                                        </td>
                                        <td className="border">
                                          {itm?.barcode[0]}
                                        </td>
                                        <td className="border">
                                          {itm?.flavour}
                                        </td>
                                        <td className="border">
                                          {itm?.promoAndPrice?.listingPrice}
                                        </td>
                                        <td className="border">
                                          {itm?.promoAndPrice?.promoComment}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </td>
                            <td>
                              <i
                                className="fa fa-trash"
                                onClick={() => {
                                  let select = [...selected];
                                  select.splice(index, 1);
                                  setSelected(select);
                                }}
                                style={{
                                  marginLeft: "10px",
                                  color: "red",
                                  cursor: "pointer",
                                }}
                              ></i>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderFormInvent;
