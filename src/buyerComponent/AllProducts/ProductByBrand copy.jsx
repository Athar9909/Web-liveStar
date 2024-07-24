import React, { useState } from "react";
import Navbar from "../Homepage/Navbar";
import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import { pageBrand } from "../../atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Button } from "rsuite";

const ProductByBrand = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const getProductData = `${process.env.REACT_APP_APIENDPOINTNEW}user/products/getByBrands`;
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sortValue, setSortValue] = useState("");
  const getBrands = `${process.env.REACT_APP_APIENDPOINTNEW}user/brands/getBrands`;
  const [maxPage, setMaxPage] = useState(1);
  const [chnge, setChnge] = useState(false);
  const setPage = useSetRecoilState(pageBrand);
  const page = useRecoilValue(pageBrand);
  const [activePage, setActivePage] = useState(page);
  let { id } = useParams();
  const [loader, setLoader] = useState(false);
  const [loaderM, setLoaderM] = useState(true);
  const [cate, setCate] = useState();

  useEffect(() => {
    GetBrands();
    getProducts();
    setTimeout(() => {
      setLoaderM(false);
    }, 8000);
  }, [chnge, activePage]);

  const GetBrands = async () => {
    await axios
      .get(getBrands, {
        page: 1,
      })
      .then((res) => {
        setBrands(res?.data.results);
      });
  };

  const getProducts = async () => {
    await axios
      .post(getProductData, {
        brand: id,
        page: activePage,
        sortBy: sortValue ? sortValue : "",
      })
      .then((res) => {
        setProducts(res.data?.results.products);
        setCate(res.data?.results.brand);
        setMaxPage(res.data?.results.totalPages);
        setLoaderM(false);
      });
  };

  const filterProduct = async (e) => {
    setLoader(true);
    e.preventDefault();
    await axios
      .post(getProductData, {
        brand: cate?.brandName,
        sortBy: sortValue,
        page: activePage,
      })
      .then((res) => {
        setProducts(res.data?.results.products);
        setMaxPage(res.data?.results.totalPages);
        setActivePage(1);
        setLoader(false);
      });
  };

  return (
    <div>
      <Navbar />
      {loaderM ? (
        <div className="load_position">
          <div className="loader_new"></div>
        </div>
      ) : (
        <>
          <section className="comman_banner  marginTop">
            <div className="container">
              <div className="row">
                <div className="col-12 mt-4">
                  <h1>
                    {cate?.brandName
                      ? cate?.brandName
                      : id?.toLocaleUpperCase()}
                  </h1>
                  <div className="breadcrumbs ">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb mb-0">
                        <li className="item_nanner">
                          <Link
                            to="/app/home"
                            className="text-decoration-none text-white fs-6  ">
                            Home <span className="arrow mx-1">&#9679;</span>
                          </Link>
                        </li>
                        <Link to="/app/brands" className="text-decoration-none">
                          <li className="item_nanner fs-6">
                            Brands <span className="arrow mx-1">&#9679;</span>
                          </li>
                        </Link>
                        <li
                          className="breadcrumb-item fs-6"
                          aria-current="page">
                          <a>{cate?.brandName ? cate?.brandName : id}</a>
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <>
            <section class="singleproduct-page comman_paddings">
              <div class="container">
                <div class="row singleproduct_divvision mx-0">
                  <div class="col-xl-3 col-lg-4 col-md-4 ps-0 mt-4">
                    <div class="singleproduct-left">
                      <div class="singleproduct-left-box">
                        <h2>Sort By</h2>
                        <form class="singleproduct-form row" action="">
                          <div class="form-group col-12 mb-3 custom_radio">
                            <input
                              type="radio"
                              class="d-none"
                              id="Alphabetically"
                              name="Alphabetically"
                              value="1"
                              onChange={(e) => setSortValue(1)}
                            />
                            <label for="Alphabetically">
                              Alphabetically: A to Z
                            </label>
                          </div>
                          <div class="form-group col-12 mb-3 custom_radio">
                            <input
                              type="radio"
                              class="d-none"
                              id="Alphabetically1"
                              name="Alphabetically"
                              value="0"
                              onChange={(e) => setSortValue(-1)}
                            />
                            <label for="Alphabetically1">
                              Alphabetically: Z to A
                            </label>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div class="singleproduct--btns mt-4">
                      <Button
                        appearance="primary"
                        style={{
                          backgroundColor: "#3b4093",
                          padding: "10px 20px",
                        }}
                        type="reset"
                        onClick={() => setChnge(!chnge)}>
                        Clear Filter
                      </Button>
                      <Button
                        loading={loader}
                        style={{
                          backgroundColor: "#eb3237",
                          padding: "10px 20px",
                        }}
                        appearance="primary"
                        onClick={filterProduct}>
                        Apply Filter
                      </Button>
                    </div>
                  </div>
                  <div class="col-xl-9 col-lg-8 col-md-8 pe-0 ps-xl-5 ">
                    <div class="row singleproduct_right">
                      {products?.length ? (
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

                      <div class="col-12 mt-3">
                        <div class="row singleproduct---show">
                          {(products || [{}])?.map((item, index) => (
                            <div
                              class="col-xl-3 col-lg-3 col-md-3 mb-lg-4 mb-md-4"
                              key={index}>
                              <div class="singleproduct-box">
                                <a
                                  href="javascript:;"
                                  class="singleproduct--img">
                                  <img
                                    src={
                                      item?.products?.productImage
                                        ? item?.products?.productImage
                                        : require("../../assets/img/product.jpg")
                                    }
                                    alt="Product"
                                    onClick={() => {
                                      setPage(activePage);
                                      navigate(
                                        `/AllProducts/Product/:${item?.products?.slug}`,
                                        {
                                          state: {
                                            image: item?.background,
                                            CateName: item?.categoryName,
                                          },
                                        }
                                      );
                                    }}
                                  />
                                </a>

                                <span
                                  onClick={() => {
                                    setPage(activePage);
                                    navigate(
                                      `/AllProducts/Product/:${item?.products?.slug}`,
                                      {
                                        state: {
                                          image: item?.background,
                                          CateName: item?.categoryName,
                                        },
                                      }
                                    );
                                  }}>
                                  {item?.products?.unitName}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
          <Footer />
        </>
      )}
    </div>
  );
};

export default ProductByBrand;
