import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import moment from "moment";
import { PDFViewer } from "@react-pdf/renderer";
import { PDFDocument } from "./PdfDocument";

const TradeMultiplePdfs = () => {
  const orderData = JSON.parse(localStorage.getItem("orderPdfData"));
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    splitOrders(orderData);
  }, []);

  const splitOrders = (orders) => {
    const newOrders = [];
    let currentPage = 1;
    orders.forEach((order) => {
      if (order.products.length > 14) {
        const chunks = [];
        for (let i = 0; i < order.products.length; i += 14) {
          chunks.push(
            order.products.slice(i, i + 14).map((product) => ({
              ...product,
              pageNo: Math.floor(i / 14) + 1,
            }))
          );
        }
        chunks.forEach((chunk, index) => {
          const newOrder = { ...order, products: chunk };
          if (index !== 0) {
            newOrder._id = {
              ...order._id,
              orderId: `${order._id.orderId}`,
            };
          }
          newOrder.pageNo = index + 1;
          newOrder.page = currentPage; // Assigning pageNo to the order object
          newOrders.push(newOrder);
        });
      } else {
        order.page = currentPage;
        newOrders.push(order);
        currentPage++;
      }
    });

    // Remove pageNo from orders with less than or equal to 14 products

    setOrders(newOrders);
  };
  console.log(orders, "kjkjhdsdsdsdsddsk");

  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");

  return (
    <div className="p-5">
      <p className="d-flex mx-3 justify-content-between mt-1">
        <img width={120} src={require("../../../assets/img/logo.png")} />
      </p>

      <PDFViewer style={{ width: "100%", height: "100vh" }}>
        <PDFDocument orderData={orders} />
      </PDFViewer>
    </div>
  );
};

export default TradeMultiplePdfs;
