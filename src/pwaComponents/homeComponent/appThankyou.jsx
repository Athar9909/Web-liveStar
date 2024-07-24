import React from "react";
import { Link } from "react-router-dom";

function AppThankyou() {
  return (
    <div className="star_imp_app">
      <div class="login-wrapper d-flex align-items-center justify-content-center text-center">
        <div class="background-shape"></div>
        <div class="container">
          <div class="row justify-content-center">
            <div class="col-11 col-lg-8 thankyou_text">
              <h2>Thank You For Placing Order!</h2>
              <p>Your Order Was Placed Successfully.</p>
              <Link class="comman_btn d-inline" to="/app/home">
                Back to Home
              </Link>
              <Link class="comman_btn d-inline mx-2" to="/app/my-order">
                View Orders
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AppThankyou;
