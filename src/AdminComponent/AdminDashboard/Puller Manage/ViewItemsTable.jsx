import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import React, { useState } from "react";

const ViewItemsTable = ({ id }) => {
  const orderView = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/order/getOrderDetail`;
  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");
  const [keySort, setKeySort] = useState();
  const [orders, setOrders] = useState([]);
  const [openModal, setModalOpen] = React.useState(false);
  const [loader, setLoader] = useState(true);
  React.useEffect(() => {
    OrderDetails("", 1, "");
  }, []);

  const OrderDetails = async (status, sort, scanType) => {
    setModalOpen(true);
    setLoader(true);
    setKeySort(status);
    await axios
      .post(orderView + "/" + id, {
        sortBy: sort,
        overUnderScanned: status === "overUnderScanned" ? true : false,
        outOfStock: status === "outOfStock" ? true : false,
        scanned: status === "scanned" ? true : false,
        scanType: scanType,
      })
      .then((res) => {
        setOrders(res?.data.results);
        setModalOpen(true);
        setLoader(false);
      });

    setTimeout(() => {
      setLoader(false);
    }, 5000);
  };

  return (
    <div>
      {loader ? (   
        <Box sx={{ display: "flex",mt:4,justifyContent:"center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <div className="col-12 mb-4">
          <div className="cart_table_3">
            <div className="">
              <table className="table">
                <thead className="bg-light">
                  <tr>
                    <th>
                      {" "}
                      <div class="dropdowns">
                        <button class="dropdown-btns sort_btn ">
                          Scanned by <i class="fa-solid fa-caret-down"></i>
                        </button>
                        <div class="dropdown-contents DropBg">
                          <a
                            className="text-decoration-none text-dark "
                            onClick={() => OrderDetails("", 1, "qr")}>
                            Qr Scanned
                          </a>
                          <a
                            onClick={() => OrderDetails("", -1, "manual")}
                            className="text-decoration-none text-dark ">
                            Manually Scanned
                          </a>
                        </div>
                      </div>
                    </th>
                    <th>
                      Items{" - "}
                      <div class="dropdowns">
                        <button class="dropdown-btns sort_btn ">
                          Sort <i class="fa-solid fa-caret-down"></i>
                        </button>
                        <div class="dropdown-contents DropBg">
                          <a
                            className="text-decoration-none text-dark "
                            onClick={() => OrderDetails("", 1)}>
                            A to Z
                          </a>
                          <a
                            onClick={() => OrderDetails("", -1)}
                            className="text-decoration-none text-dark ">
                            Z to A
                          </a>
                        </div>
                      </div>
                    </th>
                    <th>Quantity</th>
                    <th>
                      Pull Status{" - "}
                      <div class="dropdowns">
                        <button class="dropdown-btns sort_btn ">
                          {keySort
                            ? (keySort === "scanned" && "Scanned") ||
                              (keySort === "overUnderScanned" &&
                                "Over/Under Scanned") ||
                              (keySort === "outOfStock" && "Out of Stock") ||
                              (keySort === "" && "All")
                            : "Sort"}
                          <i class="fa-solid fa-caret-down mx-2"></i>
                        </button>
                        <div class="dropdown-contents DropBg">
                          <a
                            className="text-decoration-none text-dark "
                            onClick={() => OrderDetails("", 1)}>
                            All
                          </a>
                          <a
                            className="text-decoration-none text-dark "
                            onClick={() => OrderDetails("scanned", 1)}>
                            Scanned
                          </a>
                          <a
                            onClick={() => OrderDetails("overUnderScanned", 1)}
                            className="text-decoration-none text-dark ">
                            Over/Under Scanned
                          </a>

                          <a
                            onClick={() => OrderDetails("outOfStock", 1)}
                            className="text-decoration-none text-dark ">
                            Out of Stock
                          </a>
                        </div>
                      </div>
                    </th>
                    <th>Pull Quantity</th>
                  </tr>
                </thead>
                {!orders?.products?.length ? (
                  <tbody className="border">
                    <tr className="border">
                      <td>
                        <button
                          className="btn-primary text-white p-4 mb-5 border rounded fs-6"
                          onClick={() => {
                            OrderDetails();
                          }}>
                          Refresh
                        </button>
                      </td>
                      <td className="border rounded">No Results</td>
                      <td className="border rounded">No Results</td>
                      <td className="border rounded">No Results</td>
                      <td className="border rounded">No Results</td>
                    </tr>
                  </tbody>
                ) : (
                  <tbody className="border">
                    {(orders?.products || [])?.map((item, index) => (
                      <tr className="border text-center mt-5">
                        <td className="border rounded">
                          <span className="fs-5 bg-light p-2 px-3 rounded">
                            {item?.isDirectScanned ? (
                              <i class="fa-solid fa-file-pen"></i>
                            ) : (
                              <i class="fa-solid fa-qrcode"></i>
                            )}
                          </span>
                        </td>
                        <td>
                          <div className="row align-items-center flex-lg-wrap flex-md-nowrap flex-nowrap">
                            <div className="col-auto">
                              <span className="cart_product_3">
                                <img
                                  src={
                                    item?.flavour?._id
                                      ? item?.flavour?.flavourImage
                                      : item?.productId?.productImage
                                  }
                                  alt=""
                                />
                              </span>
                            </div>
                            <div className="col">
                              <div className="cart_content ">
                                <h3 className="fs-6">
                                  {item?.flavour?._id
                                    ? item?.productId?.unitName +
                                      "-" +
                                      item?.flavour?.flavour
                                    : item?.productId?.unitName}
                                </h3>
                                <p>
                                  Barcodes:
                                  {item?.flavour?.barcode
                                    ?.filter((itm, id) => id == 1)
                                    .map((item) => (
                                      <li>{item}</li>
                                    ))}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="border rounded">
                          <span className="fs-5 bg-light p-2 px-3 rounded">
                            {item?.quantity}
                          </span>
                        </td>
                        <td className="border rounded">
                          {item?.scanned === "NotScanned" ? (
                            <span className="text-secondary  p-2 px-3 rounded bg-secondary text-white PullStatusText">
                              Not Scanned
                            </span>
                          ) : (
                            <div>
                              {item?.scanned === "PartlyScanned" && (
                                <span className=" text-secondary  p-2 px-3 rounded bg-warning text-white PullStatusText">
                                  Under Scanned
                                </span>
                              )}
                              {item?.scanned === "OutOfStock" && (
                                <span className=" text-secondary  p-2 px-3 rounded bg-danger text-white PullStatusText">
                                  Out of Stock
                                </span>
                              )}
                              {item?.scanned === "OverlyScanned" && (
                                <span className=" text-secondary  p-2 px-3 rounded bg-primary text-white PullStatusText">
                                  Over Scanned
                                </span>
                              )}
                              {item?.scanned === "FullyScanned" && (
                                <span className="  p-2 px-3 rounded bg-success text-white text-nowrap PullStatusText">
                                  <img
                                    className="mx-2"
                                    src={require("../../../assets/img/Group 427322975.png")}></img>{" "}
                                  Completely Scanned
                                </span>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="border rounded">
                          <span className="fs-5 bg-light p-2 px-3 rounded">
                            {item?.pickedQuantity}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewItemsTable;
