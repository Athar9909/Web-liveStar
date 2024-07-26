import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { charSearchKey } from "../../selecter";
import { getBrands } from "../httpServices/homeHttpService/homeHttpService";
import AppFooter from "./appFooter";
import Search from "./search";
import WebHeader2 from "./webHeader2";
import { browserName } from "react-device-detect";
import { appBrandProd } from "../../atom";

function AppBrands() {
  const [brand, setBrand] = useState([]);
  let navigate = useNavigate();
  let ref = useRef();
  const setData = useSetRecoilState(appBrandProd);
  const searchKey = useRecoilValue(charSearchKey);
  const [activePage, setActivePage] = useState(1);

  useEffect(() => {
    getBrandList();
    setData([{ page: 1, sortBy: 1 }]);
  }, []);

  const getBrandList = async () => {
    const { data } = await getBrands({
      page: 1,
    });
    if (!data.error) {
      setBrand(data.results?.brands);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () =>
      document.removeEventListener("click", handleOutsideClick, true);
  }, []);

  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      document.getElementById("closeModal").click();
    }
  };

  return (
    <>
      <div className="star_imp_app">
        <div class="header-area" id="headerArea" ref={ref}>
          <div class="container h-100 d-flex align-items-center justify-content-between rtl-flex-d-row-r">
            <div class="back-button me-2 me-2">
              <Link to="/app/home">
                <i className="fa-solid fa-house"></i>
              </Link>
            </div>
            <div class="page-heading">
              <h6 class="mb-0">Brands</h6>
            </div>
            <div
              class="suha-navbar-toggler ms-2"
              data-bs-toggle="offcanvas"
              data-bs-target="#suhaOffcanvas"
              aria-controls="suhaOffcanvas"
            >
              <div>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <WebHeader2 />
        <div className="page-content-wrapper2 container-fluid">
          <Search />

          {searchKey?.length ? null : (
            <div className="brands_section pt-3">
              <div className="row mx-0">
                {brand
                  ?.filter((itm, idx) =>
                    browserName === "WebKit" || browserName === "Chrome WebView"
                      ? itm
                      : itm
                  )
                  .map((item, index) => {
                    return (
                      <div className="col-6 mb-3 pe-2">
                        <Link
                          className="brands_box shadow"
                          to={`/app/productBrands/${item?.brandName}`}
                        >
                          <img
                            src={
                              item?.brandImage
                                ? item.brandImage
                                : require("../../assets/img/product.jpg")
                            }
                            className="p-2"
                            alt=""
                          />
                        </Link>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}
        </div>
        {/* )} */}
      </div>

      <AppFooter />
      {/* </div> */}
    </>
  );
}

export default AppBrands;
