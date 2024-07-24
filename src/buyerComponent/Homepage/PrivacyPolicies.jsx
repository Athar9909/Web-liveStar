import axios from "axios";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import Footer from "../Footer/Footer";
import Navbar from "./Navbar";

const PrivacyPolicies = () => {
  const [data, setData] = useState("");
  const TermsCond = `${process.env.REACT_APP_APIENDPOINTNEW}user/welcome/privacyPolicy`;
  useEffect(() => {
    axios.get(TermsCond).then((res) => {
      setData(res.data?.results);
    });
  }, []);
  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };
  return (
    <div>
      <Navbar />
      <div class="content_pagess comman_padding" style={{ marginTop: "8rem" }}>
        <div class="container">
          <div class="row comman_divvision">
            <div class="col-12 content_pagess_main">
              <h1>Privacy Policy</h1>
              <p>
                <span
                  dangerouslySetInnerHTML={createMarkup(data[0]?.description)}
                ></span>{" "}
              </p>
              <p className="mb-5 fw-bold">
                *Please note that the images displayed on this website are for
                illustrative purposes only and may not necessarily reflect the
                actual product or service. Kindly ensure that you confirm the
                accuracy of the image with the corresponding description.
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicies;
