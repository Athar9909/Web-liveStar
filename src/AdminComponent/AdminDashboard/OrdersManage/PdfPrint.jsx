import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
// import html2pdf from "html2pdf.js/dist/html2pdf.min";
import moment from "moment";

const PdfPrint = () => {
  const orderView = `${process.env.REACT_APP_APIENDPOINTNEW}user/order/orderPDF`;
  const [orders, setOrders] = useState([]);
  const [subAccount, setSubAccount] = useState([]);
  let id = useParams();
  console.log(id);

  useEffect(() => {
    OrderDetails();
  }, []);

  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");

  const OrderDetails = async () => {
    await axios.get(orderView + "/" + id.id).then((res) => {
      setOrders(res?.data.results);
      setSubAccount(res?.data?.results?.userId?.subAccounts);
      if (!res?.data.error) {
        const timer = setTimeout(() => {
          // printPdf();
        }, 2000);
        return () => clearTimeout(timer);
      }
    });
  };
  console.log(subAccount, "65464654");

  const printPdf = async () => {
    console.log("KK");
    window.print();
  };

  return (
    <div className="" id="main_pdf">
      <p className="d-flex mx-3 justify-content-between mt-1">
        <img width={100} src={require("../../../assets/img/logo.png")} />
        <button
          className="border text-dark fw-bold text-end"
          onClick={printPdf}>
          <i class="fa fa-print" aria-hidden="true"></i> Print
        </button>
      </p>

      <section className="px-3 mt-0">
        <table
          width="100%"
          style={{ margin: "0 auto", border: 0, borderSpacing: 0 }}>
          <tbody>
            <tr>
              <td
                style={{ padding: 0, borderSpacing: 0, verticalAlign: "top" }}>
                <table
                  width="100%"
                  style={{ margin: "0 auto", border: 0, borderSpacing: 0 }}>
                  <tbody>
                    <tr>
                      <td
                        style={{
                          padding: "5px 0 8px",
                          border: "2px solid #000",
                          backgroundColor: "#f2f2f2",
                        }}>
                        <table
                          width="100%"
                          style={{
                            margin: "0 auto",
                            border: 0,
                            borderSpacing: 0,
                          }}>
                          <tbody>
                            <tr>
                              <td style={{ paddingBottom: 5 }}>
                                <table
                                  width="100%"
                                  style={{
                                    margin: "0 auto",
                                    border: 0,
                                    borderSpacing: 0,
                                  }}>
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          fontSize: 20,
                                          fontWeight: 700,
                                          color: "#eb3237",
                                          textAlign: "center",
                                          textTransform: "uppercase",
                                          borderSpacing: 0,
                                        }}>
                                        - Order Details -
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <table className="table-responsive-pdf w-100">
                              <tr>
                                <th className="border">COMPANY NAME</th>
                                <th className="border">PHONE NUMBER</th>
                                <th className="border">ADDRESS</th>
                                <th className="border">ORDER DATE</th>
                                <th className="border">ORDER ID</th>
                                <th className="border">ORDER TYPE</th>
                                <th className="border">ITEMS</th>
                              </tr>
                              <tr className="mb-4">
                                <td className="border">
                                  {orders?.userId?.companyName}
                                </td>
                                <td className="border">
                                  {orders?.userId?.phoneNumber}
                                </td>
                                <td className="border">
                                  {orders?.userId?.addressLine1}-
                                  {orders?.userId?.city}-{orders?.userId?.state}
                                  -{orders?.userId?.zipcode}
                                </td>{" "}
                                <td className="border">
                                  {moment(orders?.updatedAt).format(
                                    "MM/DD/YYYY"
                                  ) +
                                    ":" +
                                    moment(orders?.updatedAt).format("h:mm a")}
                                </td>
                                <td className="border">{orders?.orderId}</td>
                                <td className="border">{orders?.type}</td>
                                <td className="border">
                                  {orders?.products?.length}
                                </td>
                              </tr>
                              {orders?.userId?.multipleUsers && (
                                <>
                                  <tr className="mt-4">
                                    <th className="border">
                                      SUB-ACCOUNT COMPANY NAME
                                    </th>
                                    <th className="border">
                                      SUB-ACCOUNT BUSINESS NUMBER
                                    </th>
                                    <th className="border">
                                      SUB-ACCOUNT DELIVERY LOCATION
                                    </th>
                                  </tr>

                                  <tr>
                                    <td className="border">
                                      {subAccount[0]?.companyName}
                                    </td>
                                    <td className="border">
                                      {subAccount[0]?.businessPhoneNumber}
                                    </td>
                                    <td className="border">
                                      {subAccount[0]?.addressLine1 +
                                        "-" +
                                        subAccount[0]?.city +
                                        "-" +
                                        subAccount[0]?.state +
                                        "-" +
                                        subAccount[0]?.zipcode}
                                    </td>{" "}
                                  </tr>
                                </>
                              )}
                            </table>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td style={{ paddingTop: 25 }}>
                        <table
                          width="100%"
                          style={{
                            margin: "0 auto",
                            border: 0,
                            borderSpacing: 0,
                          }}>
                          <tbody>
                            <tr>
                              <td style={{ paddingBottom: 15 }}>
                                <table
                                  className="table"
                                  width="100%"
                                  style={{
                                    margin: "0 auto",
                                    border: 0,
                                    borderSpacing: 0,
                                  }}>
                                  <thead>
                                    <tr>
                                      <th
                                      className="text-center"
                                        style={{
                                          backgroundColor: "#f2f2f2",
                                          fontSize: 15,
                                          fontWeight: 600,
                                          textAlign: "start",
                                          color: "#000",
                                          border: "2px solid #000",
                                          padding: "10px 20px",
                                          borderBottom: 0,
                                        }}>
                                        Scanned By
                                      </th>
                                      <th
                                        style={{
                                          backgroundColor: "#f2f2f2",
                                          fontSize: 15,
                                          fontWeight: 600,
                                          textAlign: "start",
                                          color: "#000",
                                          border: "2px solid #000",
                                          padding: "10px 20px",
                                          borderBottom: 0,
                                        }}>
                                        Part Number
                                      </th>
                                      <th
                                        style={{
                                          backgroundColor: "#f2f2f2",
                                          fontSize: 15,
                                          fontWeight: 600,
                                          textAlign: "center",
                                          color: "#000",
                                          border: "2px solid #000",
                                          padding: "10px 20px",
                                          borderLeft: 0,
                                          borderBottom: 0,
                                        }}>
                                        Product Image
                                      </th>
                                      <th
                                        style={{
                                          backgroundColor: "#f2f2f2",
                                          fontSize: 15,
                                          fontWeight: 600,
                                          textAlign: "start",
                                          color: "#000",
                                          border: "2px solid #000",
                                          padding: "10px 20px",
                                          borderLeft: 0,
                                          borderBottom: 0,
                                        }}>
                                        Description
                                      </th>
                                      <th
                                        style={{
                                          backgroundColor: "#f2f2f2",
                                          fontSize: 15,
                                          fontWeight: 600,
                                          textAlign: "center",
                                          color: "#000",
                                          border: "2px solid #000",
                                          padding: "10px 20px",
                                          borderLeft: 0,
                                          borderBottom: 0,
                                        }}>
                                        Ordered
                                      </th>
                                      <th
                                        style={{
                                          backgroundColor: "#f2f2f2",
                                          fontSize: 15,
                                          fontWeight: 600,
                                          textAlign: "center",
                                          color: "#000",
                                          border: "2px solid #000",
                                          padding: "10px 20px",
                                          borderLeft: 0,
                                          borderBottom: 0,
                                        }}>
                                        Pick Qty
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(orders?.products || [])?.map(
                                      (item, index) => (
                                        <tr>
                                          <td
                                          className="text-center"
                                            style={{
                                              fontSize: 16,
                                              fontWeight: 500,
                                              textAlign: "start",
                                              color: "#000",
                                              border: "2px solid #000",
                                              padding: "10px 20px",
                                              borderBottom: 0,
                                            }}>
                                            <span className="fs-5 bg-light p-2 px-3 rounded">
                                              {item?.isDirectScanned ? (
                                                <i class="fa-solid fa-file-pen"></i>
                                              ) : (
                                                <i class="fa-solid fa-qrcode"></i>
                                              )}
                                            </span>
                                          </td>
                                          <td
                                            style={{
                                              fontSize: 16,
                                              fontWeight: 500,
                                              textAlign: "start",
                                              color: "#000",
                                              border: "2px solid #000",
                                              padding: "10px 20px",
                                              borderBottom: 0,
                                            }}>
                                            <table
                                              width="100%"
                                              style={{
                                                margin: "0 auto",
                                                border: 0,
                                                borderSpacing: 0,
                                              }}>
                                              <tbody>
                                                {(
                                                  item?.flavour?.barcode || []
                                                )?.map(
                                                  (item, ind) =>
                                                    ind <= 0 && (
                                                      <tr>
                                                        <td
                                                          style={{
                                                            fontSize: 16,
                                                            fontWeight: 500,
                                                            textAlign: "start",
                                                            color: "#000",
                                                          }}>
                                                          {" "}
                                                          {item}
                                                        </td>
                                                      </tr>
                                                    )
                                                )}
                                              </tbody>
                                            </table>
                                          </td>
                                          <td
                                            style={{
                                              fontSize: 16,
                                              fontWeight: 500,
                                              textAlign: "center",
                                              color: "#000",
                                              border: "2px solid #000",
                                              padding: 12,
                                              borderLeft: 0,
                                              borderBottom: 0,
                                              verticalAlign: "middle",
                                            }}>
                                            {" "}
                                            <span
                                              style={{
                                                display: "block",
                                                borderRadius: 10,
                                                padding: "2px 20px",
                                              }}>
                                              <img
                                                style={{
                                                  display: "block",
                                                  maxWidth: 55,
                                                  margin: "0 auto",
                                                  maxHeight: 70,
                                                }}
                                                src={
                                                  item?.flavour?._id
                                                    ? item?.flavour
                                                        ?.flavourImage
                                                    : item?.productId
                                                        ?.productImage
                                                }
                                                className="shadow"
                                                alt=""
                                              />
                                            </span>{" "}
                                          </td>
                                          <td
                                            style={{
                                              fontSize: 16,
                                              fontWeight: 500,
                                              textAlign: "start",
                                              color: "#000",
                                              border: "2px solid #000",
                                              padding: "10px 20px",
                                              borderLeft: 0,
                                              borderBottom: 0,
                                            }}>
                                            {item?.flavour?._id
                                              ? item?.productId?.unitName +
                                                "-" +
                                                item?.flavour?.flavour +
                                                "-" +
                                                "-" +
                                                item?.productId?.category
                                                  ?.categoryName
                                              : item?.productId?.unitName +
                                                "-" +
                                                item?.productId?.category
                                                  ?.categoryName}
                                          </td>
                                          <td
                                            style={{
                                              fontSize: 16,
                                              fontWeight: 500,
                                              textAlign: "center",
                                              color: "#000",
                                              border: "2px solid #000",
                                              padding: "10px 20px",
                                              borderLeft: 0,
                                              borderBottom: 0,
                                            }}>
                                            {item?.quantity}
                                          </td>
                                          <td
                                          className="border-bottom-2 border-dark "
                                            style={{
                                              fontSize: 16,
                                              fontWeight: 500,
                                              textAlign: "center",
                                              color: "#000",
                                              border: "2px solid #000",
                                              padding: "10px 20px",
                                              borderLeft: 0,
                                            }}>
                                            {item?.pickedQuantity}
                                          </td>
                                        </tr>
                                      )
                                    )}

                                    <tr>
                                      <td
                                        style={{
                                          fontSize: 16,
                                          fontWeight: 500,
                                          textAlign: "start",
                                          color: "#000",
                                          border: "2px solid #000",
                                          padding: "10px 20px",
                                        }}
                                      />
                                      <td
                                        style={{
                                          fontSize: 16,
                                          fontWeight: 500,
                                          textAlign: "center",
                                          color: "#000",
                                          border: "2px solid #000",
                                          padding: 12,
                                          borderLeft: 0,
                                          verticalAlign: "middle",
                                        }}>
                                        {" "}
                                     
                                      </td>
                                      <td
                                        style={{
                                          fontSize: 16,
                                          fontWeight: 500,
                                          textAlign: "start",
                                          color: "#000",
                                          border: "2px solid #000",
                                          padding: "10px 20px",
                                          borderLeft: 0,
                                        }}></td>
                                      <td
                                        style={{
                                          fontSize: 16,
                                          fontWeight: 500,
                                          textAlign: "center",
                                          color: "#000",
                                          border: "2px solid #000",
                                          padding: "10px 20px",
                                          borderLeft: 0,
                                        }}></td>
                                      <td
                                        style={{
                                          fontSize: 16,
                                          fontWeight: 500,
                                          textAlign: "center",
                                          color: "#000",
                                          border: "2px solid #000",
                                          padding: "10px 20px",
                                          borderLeft: 0,
                                        }}
                                      />
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td
                        style={{
                          padding: "5px 4px 8px",
                          border: "2px solid #000",
                          backgroundColor: "#f2f2f2",
                        }}>
                        <tbody>
                          <tr className=" text-center px-2">
                            <th
                              style={{
                                fontSize: 17,
                                fontWeight: 700,
                                color: "#00000",
                                textAlign: "center",
                                textTransform: "uppercase",
                                borderSpacing: 0,
                              }}>
                              Order Comments:
                            </th>
                            <tr>
                              <th
                                style={{
                                  fontSize: 15,
                                  fontWeight: 600,
                                  textAlign: "start",
                                  color: "#3b4093",
                                  padding: "5px 10px",
                                }}>
                                {orders?.comments
                                  ? orders?.comments
                                  : "No comments!"}
                              </th>
                            </tr>
                          </tr>
                        </tbody>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
        <button className="comman_btn2 d-none" onClick={printPdf}>
          Print
        </button>
      </section>
    </div>
  );
};

export default PdfPrint;
