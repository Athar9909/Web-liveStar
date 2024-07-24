import React, { useState } from "react";
import Navbar from "../Homepage/Navbar";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Footer from "../Footer/Footer";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { pageBrand } from "../../atom";

const AllBrands = () => {
  const [brands, setBrands] = useState([]);
  const getBrands = `${process.env.REACT_APP_APIENDPOINTNEW}user/brands/getBrands`;
  const setPage3 = useSetRecoilState(pageBrand);
  const [maxPage, setMaxPage] = useState(1);
  const [activePage, setActivePage] = useState(1);
  const pageData = useRecoilValue(pageBrand);

  useEffect(() => {
    GetBrands();
    setPage3(1);
  }, [activePage]);

  const GetBrands = async () => {
    await axios
      .post(getBrands, {
        page: activePage,
      })
      .then((res) => {
        setBrands(res?.data.results.brands);
        setMaxPage(res?.data.results?.pages);
      });
  };

  return (
    <div>
      <Navbar />
      <section className="comman_banner _banner marginTopSec">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>ALL BRANDS</h1>
              <div className="breadcrumbs mt-2">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="item_nanner">
                      <Link
                        to="/app/home"
                        className="text-decoration-none text-white fs-6  ">
                        Home <span className="arrow mx-2">&#9679;</span>{" "}
                      </Link>
                    </li>
                    <li className="breadcrumb-item fs-6" aria-current="page">
                      All Brands
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
      <>
        <section class="Sub-Categories-page comman_paddings">
          <div class="container">
            <div class="row comman_divvision mx-0">
              {/* <a class="view_all" href="javascript:;">
                View All
              </a> */}
              <div class="col-12 mb-3">
                <div class="comn_heads mb-5">
                  <h2>All Brands</h2>
                  {brands?.length ? (
                    <div className="col-12 py-2 rounded Paginate ">
                      <div class="col-6 mb-2 ps-lg-3">
                        <div class="singleproducttop---left ps-lg-2">
                          Total Pages: <span>{maxPage}</span>
                        </div>
                      </div>
                      <div class="col-6 mb-2 text-end">
                        <div class="singleproduct---paginationss">
                          <a
                            onClick={() => {
                              // window.scrollTo({ top: 0, behavior: "smooth" });
                              activePage <= 1
                                ? setActivePage(1)
                                : setActivePage(activePage - 1);
                            }}>
                            <img
                              src={require("../../assets/img/arrow.png")}
                              alt=""
                            />{" "}
                            Previous
                          </a>
                          <span>{activePage}</span>
                          <a
                            onClick={() => {
                              // window.scrollTo({ top: 0, behavior: "smooth" });
                              activePage === maxPage
                                ? setActivePage(maxPage)
                                : setActivePage(activePage + 1);
                            }}>
                            Next{" "}
                            <img
                              src={require("../../assets/img/arrow.png")}
                              alt=""
                            />
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <div class="col-md-12">
                <div class="row justify-content-center comman_product1">
                  {(brands || [])?.map((item, index) => (
                    <div class="col-lg-3 col-md-4 mb-5">
                      <a class="categorynew_box text-decoration-none">
                        <Link
                          to={`/app/productBrands/${item?.slug}`}
                          state={{ name: item?.brandName }}>
                          <div class="categorynew_img p-2">
                            <img
                              src={
                                item?.brandImage
                                  ? item?.brandImage
                                  : require("./../../assets/img/product.jpg")
                              }
                              alt=""
                            />
                          </div>
                        </Link>
                        <span>{item?.brandName}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
      <Footer />
    </div>
  );
};

export default AllBrands;
