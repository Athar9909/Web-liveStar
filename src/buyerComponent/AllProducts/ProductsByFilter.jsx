import React, { useState } from "react";
import Navbar from "../Homepage/Navbar";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Footer from "../Footer/Footer";
import { Panel, PanelGroup, Placeholder } from "rsuite";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import backGround from "../../assets/img/banner_img2.jpg";

const ProductsByFilter = () => {
  const location = useLocation();
  const [sortValue, setSortValue] = useState();
  const [brands, setBrands] = useState([]);
  const [message, setMessage] = useState();
  const [brandName, setBrandName] = useState();
  const getProduct = `${process.env.REACT_APP_APIENDPOINTNEW}user/products/getByCategory`;
  const getBrands = `${process.env.REACT_APP_APIENDPOINTNEW}user/brands/getBrands`;
  const addFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/addToFav`;
  const rmvFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/removeFav`;
  const [products, setProducts] = useState([]);
  const [heart, setHeart] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [maxPage, setMaxPage] = useState(1);
  const navigate = useNavigate();
  useEffect(() => {
    getProducts();
    GetBrands();
  }, [location, heart, activePage]);

  const GetBrands = async () => {
    await axios.get(getBrands).then((res) => {
      setBrands(res?.data.results);
    });
  };
  const getProducts = async () => {
    await axios
      .post(getProduct, {
        category: location.state?.name,
        page: activePage,
      })
      .then((res) => {
        setProducts(res.data?.results.products);
        setMaxPage(res.data?.results.totalPages);
      });
  };

  const filterProduct = async (e) => {
    e.preventDefault();
    await axios
      .post(getProduct, {
        category: location.state?.name,
        brand: brandName,
        sortBy: sortValue,
        page: activePage,
      })
      .then((res) => {
        setProducts(res.data?.results.products);
        setMaxPage(res.data?.results.totalPages);
      });
  };

  const clearFilters = (e) => {
    e.preventDefault();
    window.location.reload(false);
  };
  const addToFav = async (index) => {
    await axios
      .post(addFav, {
        productId: products[index]?.products?._id,
      })
      .catch((err) => {
        if (err) {
          Swal.fire({
            title: "Please Login To Continue!",
            icon: "warning",
            button: "cool",
          });
        }
      });
    setMessage("Added to Favourites!");
    setHeart(!heart);
  };
  const rmvFromFav = async (index) => {
    await axios.post(rmvFav, {
      productId: products[index]?.products?._id,
    });

    setMessage("Removed from Favourites!");
    setHeart(!heart);
  };

  return (
    <div>
      <Navbar />

      <section
        className="comman_banner _banner marginTopSec"
        style={{
          backgroundImage: `url(${
            location?.state.image ? location?.state.image : backGround
          })`,
        }}
      >
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>{location?.state?.name}</h1>
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
                    <li className="item_nanner">
                      <Link
                        to="/app/Categories"
                        className="text-decoration-none text-white fs-6  "
                      >
                        Categories <span className="arrow mx-2">&#9679;</span>{" "}
                      </Link>
                    </li>
                    <li className="breadcrumb-item fs-6" aria-current="page">
                      {location?.state?.name}
                    </li>
                  </ol>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </section>
      <>
        <section class="singleproduct-page comman_padding">
          <div class="container">
            <div class="row singleproduct_divvision mx-0">
              <div class="col-xl-3 col-lg-4 col-md-4 ps-0">
                <div class="singleproduct-left">
                  <div class="singleproduct-left-box border-bottom border-dark mt-4">
                    <h2>Top Brands</h2>
                    <form class="singleproduct-form row" action="">
                      <div className="">
                        {(brands || [])
                          ?.filter((item, idx) => idx < 5)
                          .map((item, index) => (
                            <div
                              className="form-group col-12 mb-3 custom_radio"
                              key={index}
                            >
                              <input
                                class="d-none"
                                type="radio"
                                value={item?.brandName}
                                id={item?._id}
                                name="check5"
                                onChange={(e) => {
                                  setBrandName(item?._id);
                                }}
                              />
                              <label htmlFor={item?._id}>
                                {item?.brandName}
                              </label>
                            </div>
                          ))}
                      </div>
                    </form>
                    <a
                      class="moreee d-flex mt-3 text-decoration-none"
                      onClick={() => {
                        navigate("/app/brands");
                      }}
                    >
                      More Brands
                    </a>
                  </div>
                  <div class="singleproduct-left-box">
                    <h2>Sort By</h2>
                    <form class="singleproduct-form row" action="">
                      <div class="form-group col-12 mb-3 custom_radio">
                        <input
                          type="radio"
                          defaultChecked
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
                  <a type="reset" onClick={getProducts}>
                    Clear All
                  </a>
                  <a onClick={filterProduct}>Apply Filter</a>
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
                            }}
                          >
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
                            }}
                          >
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
                        <div class="col-xl-4 col-lg-6 col-md-6 mb-lg-4 mb-md-4">
                          <div class="singleproduct-box">
                            <a href="javascript:;" class="singleproduct--img">
                              <img
                                src={
                                  item?.products?.productImage
                                    ? item?.products?.productImage
                                    : require("../../assets/img/product.jpg")
                                }
                                alt="Product"
                                onClick={() => {
                                  navigate(
                                    `/AllProducts/Product/${item?.products?._id}`,
                                    {
                                      state: {
                                        id: item?.products?._id,
                                        image: item?.background,
                                      },
                                    }
                                  );
                                }}
                              />
                            </a>
                            <a class="favvv---icon" href="javascript:;">
                              {item?.favourite ? (
                                <i
                                  class="fa fa-heart"
                                  onClick={() => {
                                    rmvFromFav(index);
                                  }}
                                  style={{ color: "#3e4093 " }}
                                />
                              ) : (
                                <i
                                  class="fa fa-heart"
                                  onClick={() => {
                                    addToFav(index);
                                  }}
                                  style={{ color: "#E1E1E1 " }}
                                />
                              )}
                              {/* <img src="assets/images/Vector.png" alt="" /> */}
                            </a>
                            <span
                              onClick={() => {
                                navigate(
                                  `/AllProducts/Product/${item?.products?._id}`,
                                  {
                                    replace: true,
                                    state: {
                                      id: item?.products?._id,
                                      CateName: item?.categoryName,
                                    },
                                  }
                                );
                              }}
                            >
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
    </div>
  );
};

export default ProductsByFilter;
