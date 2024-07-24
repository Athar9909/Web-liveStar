import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppFooter from "./appFooter";
import "owl.carousel/dist/assets/owl.carousel.css";
import {
  getByCategory,
  getSubCategories,
} from "../httpServices/homeHttpService/homeHttpService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Search from "./search";
import { charSearchKey } from "../../selecter";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { appCateProd } from "../../atom";

function AppProductCategory() {
  const addFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/addToFav`;
  const rmvFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/removeFav`;
  const getBrands = `${process.env.REACT_APP_APIENDPOINTNEW}user/brands/getBrands`;
  const [product, setProduct] = useState([]);
  const [brands, setBrands] = useState([]);
  const [pop, setPopup] = useState(true);
  const [heart, setHeart] = useState(false);
  const [category, setCategory] = useState([]);
  const [maxPage, setMaxPage] = useState(1);
  const pageData = useRecoilValue(appCateProd);
  const setData = useSetRecoilState(appCateProd);
  const resetData = useResetRecoilState(appCateProd);
  console.log(pageData);
  const [activePage, setActivePage] = useState(pageData[0]?.page);
  const [sortValue, setSortValue] = useState(pageData[0]?.sortBy);
  const [filterBrand, setFilterBrand] = useState();
  let ref = useRef();
  let { id } = useParams();
  const navigate = useNavigate();
  let token = localStorage.getItem("token-user");

  const searchKey = useRecoilValue(charSearchKey);
  console.log(searchKey);

  useEffect(() => {
    getCategoryList();
    getProductList();
    GetBrands();
  }, [activePage]);

  const GetBrands = async () => {
    await axios.get(getBrands).then((res) => {
      setBrands(res?.data.results);
    });
  };

  const getCategoryList = async () => {
    const { data } = await getSubCategories();
    if (!data.error) {
      setCategory(data.results);
    }
  };

  const getProductList = async (idd, sort, page) => {
    const { data } = await getByCategory({
      category: id,
      brand: pageData[0]?.brand ? pageData[0]?.brand : idd ? idd : filterBrand,
      page: page ? page : activePage,
      sortBy: sort ? sort : sortValue,
    });
    if (!data.error) {
      setProduct(data.results?.products);
      setMaxPage(data?.results.totalPages);
      // document.getElementById("checkbox").checked = false;
    }
  };

  const filterProduct = async (idd) => {
    console.log(idd);
    const { data } = await getByCategory({ category: id, brand: idd });
    if (!data.error) {
      setProduct(data.results);
    }
  };
  const sortProducts = async (e) => {
    setSortValue(parseInt(e.target.value));
    const { data } = await getByCategory({
      category: id,
      sortBy: parseInt(e.target.value),
      page: activePage,
    });
    if (!data.error) {
      setProduct(data.results?.products);
    }
  };

  const addToFav = async (index) => {
    await axios
      .post(addFav, {
        productId: product[index]?.products?._id,
        flavour: product[index]?.products?.type[0],
      })
      .then((res) => {
        if (!res.error) {
          setHeart(!heart);
          getProductList();
          Swal.fire({
            title: "Product Added to Wishlist.",
            icon: "success",
            text: "You can see your favourite products on My Wishlist.",
            confirmButtonText: "Ok",
          });
        }
      });
  };
  const rmvFromFav = async (index) => {
    await axios
      .post(rmvFav, {
        productId: product[index]?.products?._id,
        flavour: product[index]?.products?.type[0],
      })
      .then((res) => {
        if (!res.error) {
          setHeart(!heart);
          getProductList();
          Swal.fire({
            title: "Product Removed from Wishlist.",
            icon: "success",
            text: "You can see your favourite products on My Wishlist.",
            confirmButtonText: "Ok",
          });
        }
      });
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () =>
      document.removeEventListener("click", handleOutsideClick, true);
  }, []);

  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      document.getElementById("sideClose").click();
    }
  };
  return (
    <>
      <div className="star_imp_app">
        <div class="header-area" id="headerArea" ref={ref}>
          <div class="container h-100 d-flex align-items-center justify-content-between rtl-flex-d-row-r">
            <div class="back-button me-2">
              <Link
                to="/app/home"
                onClick={() => {
                  setData([{ page: 1, sortBy: 1 }]);
                }}
              >
                <i className="fa-solid fa-house"></i>
              </Link>
            </div>

            <div class="page-heading">
              <h6 class="mb-0">{id}</h6>
            </div>

            <div
              class="filter-option ms-2"
              data-bs-toggle="offcanvas"
              data-bs-target="#suhaFilterOffcanvas"
              aria-controls="suhaFilterOffcanvas"
            >
              <i class="fa-solid fa-sliders"></i>
            </div>
          </div>
        </div>
        <div
          class="offcanvas offcanvas-start suha-filter-offcanvas-wrap"
          tabindex="-1"
          id="suhaFilterOffcanvas"
          aria-labelledby="suhaFilterOffcanvasLabel"
        >
          <button
            class="btn-close text-reset"
            type="button"
            id="sideClose"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
          ></button>

          <div class="offcanvas-body py-5">
            <div class="container">
              <div class="row">
                <div class="col-12">
                  <h3 class="widget-title mb-2">Filter Products</h3>
                  <div class="widget catagory mb-4">
                    <p class="widget-title mb-2 ">Choose Brand</p>
                    <div class="widget-desc">
                      {(brands || [])
                        ?.filter((item, idx) => idx < 8)
                        .map((item, index) => (
                          <div class="form-check">
                            <input
                              class="form-check-input"
                              type="radio"
                              id="checkbox"
                              name="check5"
                              onChange={() => {
                                let brandId = item?._id;
                                setActivePage(1);
                                setFilterBrand(brandId);
                                getProductList(brandId, 1);
                              }}
                            />
                            <label class="form-check-label" for="zara">
                              {item?.brandName}
                            </label>
                          </div>
                        ))}
                    </div>
                    <div className="col-12 mt-3">
                      <p
                        className="more_btn text-decoration-none
                        "
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          navigate("/app/brands");
                        }}
                      >
                        More
                      </p>
                    </div>
                    <div
                      className="comman_btn"
                      onClick={() => {
                        setData([{ page: 1, sortBy: 1 }]);
                        document.getElementById("checkbox").checked = false;
                        setActivePage(1);
                      }}
                    >
                      Clear Filters
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="page-content-wrapper">
          <Search />
          <div class="py-3">
            {searchKey?.length ? null : (
              <div class="container">
                <div class="row g-1 align-items-center justify-content-between mb-4">
                  <div className="col-auto">
                    <button className="bg-white fw-bold border rounded-end">
                      {activePage}
                    </button>
                  </div>
                  <div class="col-auto">
                    <div class="custom_select_design">
                      <select
                        class=""
                        name="selectProductCatagory"
                        aria-label="Default select example"
                        onChange={(e) => sortProducts(e)}
                      >
                        <option selected>Sort by</option>
                        <option value="1">A to Z</option>
                        <option value="-1">Z to A</option>
                      </select>
                    </div>
                  </div>
                </div>
                {product?.length ? (
                  <div className="col-lg-12 col-sm-12 d-flex justify-content-between mt-1 mb-1">
                    <div
                      class={
                        activePage <= 1 ? "d-none" : "back-button me-2 me-2 "
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
                ) : null}
                <div class="row g-2 product_list_main">
                  {(product || [])?.map((item, index) => {
                    return (
                      <div
                        class="col-6 col-md-4 d-flex align-items-stretch"
                        key={index}
                      >
                        <div class="card product-card w-100">
                          <div class="card-body">
                            {token?.length ? (
                              <a class="wishlist-btn">
                                {item?.products?.favourite ? (
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
                              </a>
                            ) : null}
                            <Link
                              class="product-thumbnail d-block"
                              onClick={() =>
                                setData([
                                  {
                                    page: activePage,
                                    sortBy: sortValue,
                                    brand: filterBrand,
                                  },
                                ])
                              }
                              to={`/app/product-detail/${item?.products?.slug}`}
                              state={{ type: item?.products?.type[0] }}
                            >
                              <img
                                class="mb-2"
                                src={
                                  item?.products?.type[0]?.flavourImage
                                    ? item?.products?.type[0]?.flavourImage
                                    : require("../../assets/img/product.jpg")
                                }
                                alt=""
                              />
                            </Link>
                            <div class="row mt-1 d-flex align-items-center justify-content-between">
                              <div class="col">
                                <a class="product-title" href="javascript:;">
                                  {item?.products?.unitName +
                                    "-" +
                                    item?.products?.type[0]?.flavour}
                                </a>
                              </div>
                            
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {product?.length ? (
                  <div className="col-lg-12 col-sm-12 d-flex justify-content-between mt-3">
                    <div
                      class={
                        activePage <= 1 ? "d-none" : "back-button me-2 me-2 "
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
                ) : null}
              </div>
            )}
          </div>
        </div>

        <AppFooter />
      </div>
    </>
  );
}

export default AppProductCategory;
