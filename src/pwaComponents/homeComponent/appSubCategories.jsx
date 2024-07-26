import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getBrands,
  getCategory,
  getSubCategory,
} from "../httpServices/homeHttpService/homeHttpService";
import AppFooter from "./appFooter";
import AppHeader from "./appHeader";
import WebHeader2 from "./webHeader2";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { charSearchKey } from "../../selecter";
import Search from "./search";
import { appSubProd } from "../../atom";
import { browserName } from "react-device-detect";

function AppSubCategories() {
  const [categories, setCategories] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const setData = useSetRecoilState(appSubProd);

  let { id } = useParams();
  const [pop, setPopup] = useState(true);
  const navigate = useNavigate();
  let ref = useRef();
  const searchKey = useRecoilValue(charSearchKey);

  useEffect(() => {
    getCategoryList();
    setData([{ page: 1, sortBy: 1 }]);
  }, [activePage]);

  const getCategoryList = async () => {
    const { data } = await getSubCategory(id);
    if (!data.error) {
      setCategories(data.results?.subCat);
      setMaxPage(data?.results.totalPages);
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
              <h6 class="mb-0">All Sub Categories</h6>
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
        <div className="page-content-wrapper2 container-fluid ">
          <Search />
          {searchKey?.length ? null : (
            <div className="brands_section mt-3 p-0 ">
              {/* <button className="bg-white fw-bold border rounded-end">
              {activePage}
            </button> */}
              <div className="row mx-0 justify-content-center align-items-end">
                {categories
                  ?.filter((itm, idx) =>
                    browserName === "WebKit" || browserName === "Chrome WebView"
                      ? itm
                      : itm
                  )
                  .map((item, index) => {
                    return (
                      <div className="col-sm-5 col-md-5 col-5 mb-2 p-2 m-2 brands_box shadow">
                        <Link
                          className="text-center mt-4"
                          to={`/app/product-subCategory/${item?.subCategoryName}`}
                        >
                          <div>
                            <img
                              src={
                                item?.subCategoryImage
                                  ? item?.subCategoryImage
                                  : require("./../../assets/img/product.jpg")
                              }
                              alt=""
                            />
                          </div>
                          <p className="text-center mt-2 fs-6">
                            {item?.subCategoryName}
                          </p>
                        </Link>
                      </div>
                    );
                  })}
                {/* {categories?.length ? (
                <div className="col-lg-12 col-sm-12 d-flex justify-content-between mt-3">
                  <div
                    class={
                      activePage <= 1 ? "opacity-0" : "back-button me-2 me-2 "
                    }
                  >
                    <Link
                      state={{ naek: "ki" }}
                      onClick={() =>
                        activePage <= 1
                          ? setActivePage(1)
                          : setActivePage(activePage - 1)
                      }
                    >
                      <i class="fa-solid fa-arrow-left-long"></i> Prev
                    </Link>
                  </div>
                  <div
                    class={
                      activePage === maxPage
                        ? "d-none"
                        : "back-button me-2 me-2 "
                    }
                  >
                    <Link
                      state={{ naek: "ki" }}
                      onClick={() =>
                        activePage === maxPage
                          ? setActivePage(maxPage)
                          : setActivePage(activePage + 1)
                      }
                    >
                      Next <i class="fa-solid fa-arrow-right-long"></i>
                    </Link>
                  </div>
                </div>
              ) : null} */}
              </div>
            </div>
          )}
        </div>

        <AppFooter />
      </div>
    </>
  );
}

export default AppSubCategories;
