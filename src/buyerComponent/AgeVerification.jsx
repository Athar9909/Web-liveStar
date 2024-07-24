import React, { useEffect, useState } from "react";
import "../assets/css/main.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const AgeVerification = ({ ModalClose }) => {
  const getAgeBanner = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/cms/getAgeConfirmations `;
  const [banner, setBanner] = useState("");
  const [err, setErr] = useState(false);
  const nav = useNavigate();
  useEffect(() => {
    getBanner();
  }, []);

  const getBanner = async () => {
    const { data } = await axios.get(getAgeBanner);
    console.log(data);
    if (!data.error) {
      setBanner(data.results.ageConfirmation[0]?.image);
    }
  };

  console.log(banner);
  const handleClick = (e) => {
    e.preventDefault();
    // var expires = new Date(Date.now() + 86400 * 50000).toUTCString();
    // console.log(expires);
    // e.preventDefault();
    // document.cookie = "cookie=NewUser; expires =" + expires + ";";
    sessionStorage.setItem("new", "user");
    nav("/app/home");
  };

  return (
    <div
      className="modalContent "
      style={{
        backgroundImage: banner ? `url(${banner})` : `url(${require("../../src/assets/img/verification_bg.jpg")})`,
      }}>
      <section className="age_verification">
        <div className="container">
          <div
            className="row justify-content-center"
            style={{ marginTop: "15rem" }}>
            <div className="col-lg-5 col-md-6 verification_content">
              <h2 className="text-shadow">Confirm Your Age</h2>
              <span className="fs-4">ARE YOU 21 YEARS OLD OR OLDER?</span>
              <form>
                <div className="form-group custom_checkboxs mt-3 mb-md-4 mb-3">
                  <label htmlFor="" >
                    THIS WEBSITE REQUIRES YOU TO BE 21+ YEARS OLDER TO ENTER.
                  </label>
                </div>
                <button
                  className="comman_btn shadow mx-2"
                  type="submit"
                  onClick={handleClick}>
                  Yes, I am
                </button>
                <a
                  className="comman_btn2 shadow mx-2"
                  href="https://www.google.co.in/">
                  Exit
                </a>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AgeVerification;
