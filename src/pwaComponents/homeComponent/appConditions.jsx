import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { tAndC } from "../httpServices/homeHttpService/homeHttpService";
import WebHeader2 from "./webHeader2";

function AppConditions() {
  const [content, setContent] = useState("");

  useEffect(() => {
    getContentInfo();
  }, []);

  const getContentInfo = async () => {
    const { data } = await tAndC();
    if (!data.error) {
      setContent(data.results[0].description);
    }
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
              <h6 class="mb-0">Term & Condition</h6>
            </div>
          </div>
        </div>
        <WebHeader2 />

        <div className="page-content-wrapper2">
          <div className="container">
            <div className="privacy-policy-wrapper py-3">
              <h6>TERM & CONDITION</h6>
              <p>{content}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AppConditions;
