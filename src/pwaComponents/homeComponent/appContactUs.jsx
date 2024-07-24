import React from "react";
import AppFooter from "./appFooter";
import AppHeader from "./appHeader";

function AppContactUs() {
  return (
    <>
      <div className="star_imp_app">
        <AppHeader />
        <div className="page-content-wrapper">
          <div className="google-maps-wrap">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d37902.096510377676!2d101.6393079588335!3d3.103387873464772!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31cc49c701efeae7%3A0xf4d98e5b2f1c287d!2sKuala%20Lumpur%2C%20Federal%20Territory%20of%20Kuala%20Lumpur%2C%20Malaysia!5e0!3m2!1sen!2sbd!4v1591684973931!5m2!1sen!2sbd"
              allowfullscreen=""
              aria-hidden="false"
              tabindex="0"
            ></iframe>
          </div>
          <div className="container">
            <div className="mt-3 rtl-text-right">
              <h5 className="mb-1">Contact Us</h5>
              <p className="mb-4">
                Write to us. We will reply to you as soon as possible. But yes,
                it can take up to 24 hours.
              </p>
            </div>
            <div className="contact-form mt-3 pb-3">
              <form action="#" method="">
                <input
                  className="form-control mb-3"
                  id="username"
                  type="text"
                  placeholder="Your Name"
                />
                <input
                  className="form-control mb-3"
                  id="email"
                  type="email"
                  placeholder="Enter email"
                />
                <textarea
                  className="form-control mb-3"
                  id="message"
                  name=""
                  cols="30"
                  rows="10"
                  placeholder="Write something..."
                ></textarea>
                <button className="comman_btn">Send Now</button>
              </form>
            </div>
          </div>
        </div>
        <AppFooter />
      </div>
    </>
  );
}

export default AppContactUs;
