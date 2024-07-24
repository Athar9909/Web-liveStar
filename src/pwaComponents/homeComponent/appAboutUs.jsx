import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { aboutUs } from "../httpServices/homeHttpService/homeHttpService";
import WebHeader2 from "./webHeader2";
import DOMPurify from "dompurify";

function AppAboutUs() {
  const [content, setContent] = useState([]);

  useEffect(() => {
    getContentInfo();
  }, []);

  const getContentInfo = async () => {
    const { data } = await aboutUs();
    if (!data.error) {
      setContent(data.results[0]?.description);
    }
  };

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };


  return (
    <>
      <div className="star_imp_app">
        <div class="header-area" id="headerArea">
          <div class="container h-100 d-flex align-items-center justify-content-between rtl-flex-d-row-r">
            <div class="back-button me-2 me-2">
              <Link to="/app/settings">
                <i class="fa-solid fa-arrow-left-long"></i>
              </Link>
            </div>
            <div class="page-heading">
              <h6 class="mb-0">About Us</h6>
            </div>
          </div>
        </div>
        <WebHeader2 />
        <div className="page-content-wrapper2">
          <div className="container">
            <div className="privacy-policy-wrapper py-3">
              <h6>ABOUT US</h6>
              <p
                dangerouslySetInnerHTML={createMarkup(
                  content
                    ? content
                    : "Star Importers & Wholesalers is a family-owned and operated business that has been serving the convenience store and smoke shop industry for years. With a 110,000 sqft warehouse, we are a one-stop shop for all your products. Our goal is to provide high-quality products and exceptional customer service to our B2B clients.As a family-run business, we understand the importance of building strong relationships with our clients. Our team is dedicated to ensuring that each and every customer is satisfied with their experience. Whether you are a small business owner or the manager of a large chain, we have the products and expertise to meet your needs. Our extensive product line includes everything from snacks and candy to smoke shop supplies, and we are constantly adding new items to meet the changing needs of the market"
                )}></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppAboutUs;
