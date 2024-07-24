import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import moment from "moment";

const QuotePdf = () => {
  const QuoteView = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/quotations/singleUserQuote`;
  const [orders, setOrders] = useState([]);
  let id = useParams();
  console.log(id);
  useEffect(() => {
    OrderDetails();
  }, []);

  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");

  const OrderDetails = async () => {
    await axios.get(QuoteView + "/" + id.id).then((res) => {
      setOrders(res?.data.results);
      if (!res?.data.error) {
        const timer = setTimeout(() => {
          printPdf();
        }, 2000);
        return () => clearTimeout(timer);
      }
    });
  };

  const printPdf = async () => {
    console.log("KK");
    window.print();
  };

  return (
    <div className="" id="main_pdf">
      <p className="d-flex mx-3 justify-content-between mt-1">
        <img width={100} src={require("../../../assets/img/logo.png")} />
        <button className="commanBtn2  text-end" onClick={printPdf}>
          <i class="fa fa-print" aria-hidden="true"></i> Print.
        </button>
      </p>

      <section className="px-3 mt-0">
        <table
          width="100%"
          style={{ margin: "0 auto", border: 0, borderSpacing: 0 }}
        >
          <tbody>
            <tr>
              <td
                style={{ padding: 0, borderSpacing: 0, verticalAlign: "top" }}
              >
                <table
                  width="100%"
                  style={{ margin: "0 auto", border: 0, borderSpacing: 0 }}
                >
                  <tbody>
                    {/* <tr>
                      <td style={{ paddingBottom: 25 }}>
                        <table
                          width="100%"
                          style={{
                            margin: "0 auto",
                            border: 0,
                            borderSpacing: 0,
                          }}
                        >
                          <tbody>
                            <tr>
                              <td
                                style={{
                                  width: "20%",
                                  textAlign: "start",
                                  borderSpacing: 0,
                                  verticalAlign: "top",
                                }}
                              >
                                kii
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </td>
                    </tr> */}
                    <tr>
                      <td
                        style={{
                          padding: "5px 0 8px",
                          border: "2px solid #000",
                          backgroundColor: "#f2f2f2",
                        }}
                      >
                        <table
                          width="100%"
                          style={{
                            margin: "0 auto",
                            border: 0,
                            borderSpacing: 0,
                          }}
                        >
                          <tbody>
                            <tr>
                              <td style={{ paddingBottom: 5 }}>
                                <table
                                  width="100%"
                                  style={{
                                    margin: "0 auto",
                                    border: 0,
                                    borderSpacing: 0,
                                  }}
                                >
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
                                        }}
                                      >
                                        - Quotation Details -
                                      </td>
                                    </tr>
                                  </tbody>
                                </table>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                <table
                                  width="100%"
                                  style={{
                                    margin: "0 auto",
                                    border: 0,
                                    borderSpacing: 0,
                                  }}
                                >
                                  <tbody>
                                    <tr>
                                      <td
                                        style={{
                                          width: "15%",
                                          textAlign: "center",
                                          borderSpacing: 0,
                                          verticalAlign: "top",
                                        }}
                                      >
                                        <table
                                          width="100%"
                                          style={{
                                            margin: "0 auto",
                                            border: 0,
                                            borderSpacing: 0,
                                          }}
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: 15,
                                                  fontWeight: 600,
                                                  color: "#000",
                                                  textAlign: "center",
                                                  borderSpacing: 0,
                                                }}
                                              >
                                                {" "}
                                                Company Name :{" "}
                                                <span
                                                  style={{
                                                    fontSize: 15,
                                                    fontWeight: 700,
                                                    color: "#3e4093",
                                                    textAlign: "center",
                                                    borderSpacing: 0,
                                                  }}
                                                >
                                                  {orders?.userId?.companyName}
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                      <td
                                        style={{
                                          width: "15%",
                                          textAlign: "center",
                                          borderSpacing: 0,
                                          verticalAlign: "top",
                                        }}
                                      >
                                        <table
                                          width="100%"
                                          style={{
                                            margin: "0 auto",
                                            border: 0,
                                            borderSpacing: 0,
                                          }}
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: 15,
                                                  fontWeight: 600,
                                                  color: "#000",
                                                  textAlign: "center",
                                                  borderSpacing: 0,
                                                }}
                                              >
                                                {" "}
                                                Phone :{" "}
                                                <span
                                                  style={{
                                                    fontSize: 15,
                                                    fontWeight: 700,
                                                    color: "#3e4093",
                                                    textAlign: "center",
                                                    borderSpacing: 0,
                                                  }}
                                                >
                                                  {orders?.userId?.phoneNumber}
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                      <td
                                        style={{
                                          width: "20%",
                                          textAlign: "center",
                                          borderSpacing: 0,
                                          verticalAlign: "top",
                                        }}
                                      >
                                        <table
                                          width="100%"
                                          style={{
                                            margin: "0 auto",
                                            border: 0,
                                            borderSpacing: 0,
                                          }}
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: 15,
                                                  fontWeight: 600,
                                                  color: "#000",
                                                  textAlign: "center",
                                                  borderSpacing: 0,
                                                }}
                                              >
                                                {" "}
                                                Address :{" "}
                                                <span
                                                  style={{
                                                    fontSize: 15,
                                                    fontWeight: 700,
                                                    color: "#3e4093",
                                                    textAlign: "center",
                                                    borderSpacing: 0,
                                                  }}
                                                >
                                                  {orders?.userId
                                                    ?.addressLine1 +
                                                    "-" +
                                                    orders?.userId?.state +
                                                    "-" +
                                                    orders?.userId?.city}
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                      <td
                                        style={{
                                          width: "15%",
                                          textAlign: "center",
                                          borderSpacing: 0,
                                          verticalAlign: "top",
                                        }}
                                      >
                                        <table
                                          width="100%"
                                          style={{
                                            margin: "0 auto",
                                            border: 0,
                                            borderSpacing: 0,
                                          }}
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: 15,
                                                  fontWeight: 600,
                                                  color: "#000",
                                                  textAlign: "center",
                                                  borderSpacing: 0,
                                                }}
                                              >
                                                {" "}
                                                Quote Date :{" "}
                                                <span
                                                  style={{
                                                    fontSize: 15,
                                                    fontWeight: 700,
                                                    color: "#3e4093",
                                                    textAlign: "center",
                                                    borderSpacing: 0,
                                                  }}
                                                >
                                                  {moment(
                                                    orders?.craetedAt?.slice(
                                                      0,
                                                      10
                                                    )
                                                  ).format("MM/DD/YYYY")}
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>

                                      <td
                                        style={{
                                          width: "15%",
                                          textAlign: "center",
                                          borderSpacing: 0,
                                          verticalAlign: "top",
                                        }}
                                      >
                                        <table
                                          width="100%"
                                          style={{
                                            margin: "0 auto",
                                            border: 0,
                                            borderSpacing: 0,
                                          }}
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: 15,
                                                  fontWeight: 600,
                                                  color: "#000",
                                                  textAlign: "center",
                                                  borderSpacing: 0,
                                                }}
                                              >
                                                {" "}
                                                Quote Id :{" "}
                                                <span
                                                  style={{
                                                    fontSize: 15,
                                                    fontWeight: 700,
                                                    color: "#3e4093",
                                                    textAlign: "center",
                                                    borderSpacing: 0,
                                                  }}
                                                >
                                                  {orders?.quoteId}
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                      <td
                                        style={{
                                          width: "15%",
                                          textAlign: "center",
                                          borderSpacing: 0,
                                          verticalAlign: "top",
                                        }}
                                      >
                                        <table
                                          width="100%"
                                          style={{
                                            margin: "0 auto",
                                            border: 0,
                                            borderSpacing: 0,
                                          }}
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: 15,
                                                  fontWeight: 600,
                                                  color: "#000",
                                                  textAlign: "center",
                                                  borderSpacing: 0,
                                                }}
                                              >
                                                {" "}
                                                Quote Status :{" "}
                                                <span
                                                  style={{
                                                    fontSize: 15,
                                                    fontWeight: 700,
                                                    color: "#3e4093",
                                                    textAlign: "center",
                                                    borderSpacing: 0,
                                                  }}
                                                >
                                                  {orders?.status}
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                      <td
                                        style={{
                                          width: "15%",
                                          textAlign: "center",
                                          borderSpacing: 0,
                                          verticalAlign: "top",
                                        }}
                                      >
                                        <table
                                          width="100%"
                                          style={{
                                            margin: "0 auto",
                                            border: 0,
                                            borderSpacing: 0,
                                          }}
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                style={{
                                                  fontSize: 15,
                                                  fontWeight: 600,
                                                  color: "#000",
                                                  textAlign: "center",
                                                  borderSpacing: 0,
                                                }}
                                              >
                                                {" "}
                                                Items :{" "}
                                                <span
                                                  style={{
                                                    fontSize: 15,
                                                    fontWeight: 700,
                                                    color: "#3e4093",
                                                    textAlign: "center",
                                                    borderSpacing: 0,
                                                  }}
                                                >
                                                  {orders?.products?.length}
                                                </span>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
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
                      <td style={{ paddingTop: 25 }}>
                        <table
                          width="100%"
                          style={{
                            margin: "0 auto",
                            border: 0,
                            borderSpacing: 0,
                          }}
                        >
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
                                  }}
                                >
                                  <thead>
                                    <tr>
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
                                        }}
                                      >
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
                                        }}
                                      >
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
                                        }}
                                      >
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
                                        }}
                                      >
                                        Qty
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
                                        }}
                                      >
                                        Price
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {(orders?.products || [])?.map(
                                      (item, index) => (
                                        <tr>
                                          <td
                                            style={{
                                              fontSize: 16,
                                              fontWeight: 500,
                                              textAlign: "start",
                                              color: "#000",
                                              border: "2px solid #000",
                                              padding: "10px 20px",
                                              borderBottom: 0,
                                            }}
                                          >
                                            <table
                                              width="100%"
                                              style={{
                                                margin: "0 auto",
                                                border: 0,
                                                borderSpacing: 0,
                                              }}
                                            >
                                              <tbody>
                                                {(
                                                  item?.flavour?.barcode || []
                                                )?.map(
                                                  (item, ind) =>
                                                    ind <= 2 && (
                                                      <tr>
                                                        <td
                                                          style={{
                                                            fontSize: 16,
                                                            fontWeight: 500,
                                                            textAlign: "start",
                                                            color: "#000",
                                                          }}
                                                        >
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
                                            }}
                                          >
                                            {" "}
                                            <span
                                              style={{
                                                display: "block",
                                                backgroundColor: "#f2f2f2",
                                                borderRadius: 10,
                                                padding: "17px 20px",
                                              }}
                                            >
                                              <img
                                                style={{
                                                  display: "block",
                                                  maxWidth: 90,
                                                  margin: "0 auto",
                                                }}
                                                src={
                                                  item?.flavour?._id
                                                    ? item?.flavour
                                                        ?.flavourImage
                                                    : item?.productId
                                                        ?.productImage
                                                }
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
                                            }}
                                          >
                                            {item?.flavour?._id
                                              ? item?.productId?.unitName +
                                                "-" +
                                                item?.flavour?.flavour
                                              : item?.productId?.unitName}
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
                                            }}
                                          >
                                            {item?.quantity}
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
                                            }}
                                          >
                                            {item?.price}
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
                                        }}
                                      >
                                        {" "}
                                        {/* <span
                                          style={{
                                            display: "block",
                                            backgroundColor: "#f2f2f2",
                                            borderRadius: 10,
                                            padding: "17px 20px",
                                          }}
                                        >
                                          <img
                                            style={{
                                              display: "block",
                                              maxWidth: 55,
                                              margin: "0 auto",
                                            }}
                                            src="product.png"
                                            alt=""
                                          />
                                        </span> */}
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
                                        }}
                                      >
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
                                        }}
                                      >
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

export default QuotePdf;
