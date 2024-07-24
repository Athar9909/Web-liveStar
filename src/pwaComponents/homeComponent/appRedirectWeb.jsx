import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Fade from "react-reveal/Fade";
import { Button, Loader } from "rsuite";
import axios from "axios";
import { useEffect } from "react";
const AppRedirectWeb = () => {
  let id = useParams();
  const navigate = useNavigate();
  const tokenapi = `${process.env.REACT_APP_APIENDPOINTNEW}user/verifyToken`;
  useEffect(() => {
    verifyToken();
  }, []);
  const verifyToken = async () => {
    const { data } = await axios.post(tokenapi, { tempToken: id?.id });
    console.log(data);
    if (!data.error) {
      navigate("/app/home");
      localStorage.setItem("token-user", data?.results.token);
    } else {
      navigate("/app/login");
    }
  };
  return (
    <div className="star_imp_app ">
      <div class="login-wrapper d-flex align-items-center justify-content-center text-center">
        <div class="background-shape dull"></div>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-12 col-lg-8 thankyou_text">
              <div className="logo_comman">
                <Fade>
                  <img
                    className="big-logo "
                    src="../assets/img/logo1.png"
                    alt=""
                  />
                </Fade>
              </div>
            </div>
            <div className="col-12 text-center mt-3">
              <div class="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppRedirectWeb;
