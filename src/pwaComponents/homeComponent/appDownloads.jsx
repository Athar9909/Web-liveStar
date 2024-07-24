import React from "react";
import AppFooter from "./appFooter";
import AppHeader from "./appHeader";

const AppDownloads = () => {
  return (
    <div className="star_imp_app mb-0">
      <AppHeader />
      <div className="bg-white mt-4">
        <div class="container py-5 px-lg-5 bg-white mt-4">
          <div class="row g-5 align-items-center">
            <div class="col-lg-6 ">
              <img
                class="img-fluid wow fadeInUp"
                data-wow-delay="0.1s"
                src={require("../../assets/img/dff.png")}
                // style="visibility: visible; animation-delay: 0.1s;"
              />
            </div>
            <div
              class="col-lg-6 wow fadeInUp"
              data-wow-delay="0.3s"
              //   style="visibility: visible; animation-delay: 0.3s;"
            >
              <h1 class="mb-3 dwn-title1 text-center">
                Download The Latest Version Of Our Star Importers Application.
              </h1>
              <p class="mb-3 text-center">
                Now Available On Play Store And App Store.
              </p>
              <div class="row g-4 p-3">
                <div
                  class="col-sm-6 dwn-btns "
                  //   style="visibility: visible; animation-delay: 0.5s;"
                >
                  <a
                    href=""
                    class="d-flex bg-primary-gradient rounded py-3 px-4"
                  >
                    <i class="fab fa-apple fa-3x text-white flex-shrink-0"></i>
                    <div class="ms-3">
                      <p class="text-white mb-0">Download Our</p>
                      <h5 class="text-white mb-0">Ios App</h5>
                    </div>
                  </a>
                </div>
                `
                <div class="col-sm-6 dwn-btns" data-wow-delay="0.7s">
                  <a
                    target="_blank"
                    href="https://play.google.com/store/apps/details?id=com.star_importers"
                    class="d-flex bg-secondary-gradient rounded py-3 px-4"
                  >
                    <i class="fab fa-android fa-3x text-white mt-1"></i>
                    <div class="ms-3">
                      <p class="text-white mb-0">Download Our</p>
                      <h5 class="text-white mb-0">Android App</h5>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AppFooter />
    </div>
  );
};

export default AppDownloads;
