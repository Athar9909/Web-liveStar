import React, { useState } from "react";
import Navbar from "../Homepage/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Footer from "../Footer/Footer";
import { useSetRecoilState } from "recoil";
import { pageCategory } from "../../atom";

const AllCategories = () => {
  const [categories, setCategories] = useState([]);
  const categoryApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/category/getCatAndSubCat`;
  const setPage = useSetRecoilState(pageCategory);
  const navigate = useNavigate();
  useEffect(() => {
    GetCategories();
    setPage(1);
  }, []);

  const GetCategories = async () => {
    await axios.get(categoryApi).then((res) => {
      setCategories(res?.data.results);
    });
  };

  return (
    <div>
      <Navbar />
      <section className="comman_banner _banner marginTopSecx">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>POPULAR CATEGORIES</h1>
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
                    <li className="breadcrumb-item" aria-current="page">
                      <a className="text-decoration-none text-white fs-6 ">
                        All Categories
                      </a>
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
                  <h2>Categories</h2>
                </div>
              </div>
              <div class="col-md-12">
                <div class="row justify-content-center comman_product1">
                  {(categories || [])?.map((item, index) => (
                    <div class="col-lg-3 col-md-4 mb-5">
                      <a class="categorynew_box text-decoration-none">
                        <a
                          onClick={() => {
                            navigate("/app/subCategories", {
                              state: {
                                id: item?._id,
                                name: item?.categoryName,
                                image: item?.background,
                              },
                            });
                          }}>
                          <div class="categorynew_img p-3">
                            <img src={item?.categoryImage} alt="" />
                          </div>
                        </a>
                        <span>{item?.categoryName}</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* <section className="brands_page py-5 ">
          <div className="container">
            <div className="row">
              <div className="col-12 bg-white px-0 border rounded">
                <ul class="brands_ul list-unstyled mb-3 container-fluid mt-4">
                  {(categories || [])?.map((item, index) => (
                    <li key={index} className="mb-2">
                      <h5 className="text-center mt-3">{item?.categoryName}</h5>

                      <Link
                        className="text-decoration-none mt-0 card w-100 pb-0"
                        to={{
                          pathname: "/CategoryProducts",
                          search: "?sort=name",
                          hash: "#the-hash",
                        }}
                        state={{ name: item?.categoryName }}
                      >
                        <img src={item?.categoryImage} width={150} alt="" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section> */}
      </>
      <Footer />
    </div>
  );
};

export default AllCategories;
