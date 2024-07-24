import React, { useState } from "react";
import Navbar from "../Homepage/Navbar";
import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Footer from "../Footer/Footer";
import { pageSubCategory } from "../../atom";
import { useSetRecoilState } from "recoil";

const SubCategories = () => {
  const [categories, setCategories] = useState([]);
  const categoryApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/category/subCatbyCat`;
  const [objectId, setObjectID] = useState();
  let location = useLocation();
  const setPage = useSetRecoilState(pageSubCategory);

  if (objectId !== location?.state?.id) {
    setObjectID(location?.state?.id);
  }
  useEffect(() => {
    GetSubCategories();
    setPage(1);
  }, [objectId]);

  const GetSubCategories = async () => {
    await axios
      .post(categoryApi, { category: location?.state?.id })
      .then((res) => {
        setCategories(res?.data.results.subCat);
      });
  };

  return (
    <div>
      <Navbar />
      <section className="comman_banner _banner marginTopSec">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>{location?.state.name}</h1>
              <div className="breadcrumbs mt-2">
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0">
                    <li className="item_nanner">
                      <Link
                        to="/app/home"
                        className="text-decoration-none text-white fs-6  "
                      >
                        Home <span className="arrow mx-2">&#9679;</span>{" "}
                      </Link>
                    </li>
                    <a className="text-decoration-none text-white fs-6  ">
                      {location?.state.name}{" "}
                      <span className="arrow mx-2">&#9679;</span>{" "}
                    </a>
                    <a className="text-decoration-none text-white fs-6  ">
                      Sub-Categories <span className="arrow mx-2"></span>{" "}
                    </a>
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
                  <h2>Sub Categories</h2>
                </div>
              </div>

              <div class="col-md-12">
                <div class="row justify-content-center comman_product1">
                  {(categories || [])?.map((item, index) => (
                    <div class="col-lg-3 col-md-4 mb-5">
                      <a class="categorynew_box text-decoration-none">
                        <Link
                          to={`/Category/Sub-Category/${item?.slug}`}
                          state={{
                            name: item?.subCategoryName,
                            catName: location?.state?.name,
                          }}
                        >
                          <div class="categorynew_img">
                            <img
                              src={
                                item?.subCategoryImage
                                  ? item?.subCategoryImage
                                  : require("./../../assets/img/product.jpg")
                              }
                              alt=""
                            />
                          </div>
                        </Link>
                        <span>{item?.subCategoryName}</span>
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

export default SubCategories;
