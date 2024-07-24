import React, { useState, useEffect, useRef } from "react";
import Starlogo from "../../assets/img/logo.png";
import "../../assets/css/main.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { homeSearch } from "../../pwaComponents/httpServices/homeHttpService/homeHttpService";
import Fade from "react-reveal/Fade";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  CartCount,
  chngeFilter,
  pageCategory,
  pageSubCategory,
} from "../../atom";
import Swal from "sweetalert2";
const Navbar = ({ NState, LoginState }) => {
  const width = window.innerWidth;
  const [users, setUsers] = useState([]);
  const categoryApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/category/getCatAndSubCat`;
  const cart = `${process.env.REACT_APP_APIENDPOINTNEW}user/countCartProducts`;
  const allProd = `${process.env.REACT_APP_APIENDPOINTNEW}user/products/getAllProducts`;
  // const allNotify = `${process.env.REACT_APP_APIENDPOINTNEW}user/notify/getAllNotifications `;
  const userApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/getUserProfile`;
  const [SearchData, setSearchData] = useState([]);
  const [search, setSearch] = useState();
  const [category, setCategory] = useState([]);
  const [state, setState] = useState(false);
  const navigate = useNavigate();
  const [otpEmail, setOtpEmail] = useState();
  const [UserAuth, setUserAuth] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [cartNum, setCartNum] = useState(0);
  const [notifications, setNotifications] = useState();
  const [products, setProducts] = useState([]);
  const [relateCate, setRelateCate] = useState([]);
  const alert = useRecoilValue(CartCount);
  const setPage = useSetRecoilState(pageCategory);
  const setPage2 = useSetRecoilState(pageSubCategory);
  const setFilter = useSetRecoilState(chngeFilter);
  const [load, setLoad] = useState(true);
  const ref = useRef(null);

  useEffect(() => {
    AllProducts();
    CartCounts();
    getCategory();
    handleScroll();
    getUser();
  }, [state, NState, alert, search]);

  useEffect(() => {
    if (LoginState) {
      document.getElementById("modal-login").click();
    }
  }, [LoginState]);

  const getProductList = async (e) => {
    let Search = e.target.value;
    console.log(Search);

    if (Search != "") {
      const { data } = await homeSearch({
        search: Search.trim(),
        limit: 6,
      });
      if (!data.error) {
        let dataList = data?.results.products;
        setTimeout(() => {
          setProducts(dataList?.slice(0, 6));
          setRelateCate(data?.results.subCategories);
        }, [1000]);
      }
    }
  };

  const getUser = async () => {
    await axios.get(userApi).then((res) => {
      if (!res.data.error) {
        let val = res?.data.results;
        if (val?.status != true) {
          Swal.fire({
            title: "Your Account has been Disabled By Admin!",
            text: "Please Contact Admin!",
            icon: "warning",
            confirmButtonText: "Okay",
          }).then((res) => LogOut());
        }
      }
    });
  };

  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      setSearch();
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () =>
      document.removeEventListener("click", handleOutsideClick, true);
  }, []);

  axios.defaults.headers.common["x-auth-token-user"] =
    localStorage.getItem("token-user");

  const getCategory = async () => {
    await axios.get(categoryApi).then((res) => {
      setCategory(res?.data.results);
    });
  };
  const AllProducts = async () => {
    await axios.post(allProd).then((res) => {
      setSearchData(res?.data.results);
    });
  };

  useEffect(() => {
    // if (window.localStorage !== undefined) {
    const authToken = localStorage.getItem("token-user");
    setUserAuth(authToken);
    // }
  }, [UserAuth]);

  const CartCounts = async () => {
    await axios.post(cart).then((res) => {
      console.log(res);
      setCartNum(res?.data.results?.productCount);
    });
  };

  const LogOut = () => {
    setUserAuth(localStorage.removeItem("token-user"));
    setUserAuth(localStorage.removeItem("UserData"));
    navigate("/app/home");
    window.location.reload();
  };

  const handleScroll = () => {
    const offset = window.scrollY;
    if (offset > 40) {
      setScrolled(!scrolled);
    } else {
      setScrolled(false);
    }
  };

  return (
    <div className="header_main" ref={ref}>
      <div className="">
        <div className="container">
          <div className="row Newheader align-items-center ">
            <div className="col-auto">
              <Link className="header_logo mx-1" to="/app/home">
                <Fade left>
                  <img
                    src={Starlogo}
                    onClick={() => {
                      setSearch();
                      setPage(1);
                      setPage2(1);
                      document.getElementById("search").value = "";
                    }}
                    alt=""
                  />
                </Fade>
              </Link>
            </div>

            <div className="col ps-5 head_search">
              <form
                className="header_newsearch"
                autoComplete="off"
                onSubmit={(e) => {
                  e.preventDefault();
                  navigate(`/app/ProductSearch/${search}`);
                  setSearch();
                }}>
                <div className="form-group position-relative">
                  <input
                    onChange={(e) => {
                      e.preventDefault();
                      setLoad(true);
                      setProducts([]);
                      setRelateCate([]);
                      setTimeout(() => {
                        getProductList(e);
                      }, [1000]);
                      setSearch(e.target.value);
                    }}
                    type="text"
                    id="search"
                    name="search"
                    className="form-control shadow-none"
                    placeholder="Search in Star Importers"
                  />

                  <button className="search_ibtn">
                    <Fade left>
                      <img
                        src={require("../../assets/img/searchPng.png")}
                        alt=""
                      />
                    </Fade>
                  </button>
                </div>
              </form>
            </div>

            <div className="col-auto px-5 head_cart">
              <a className="cart_header">
                {NState ? (
                  // <Animate>
                  <Link to="/app/Cart" state={{ key: "hii" }}>
                    <Fade>
                      <i className="fa fa-cart-arrow-down" />
                    </Fade>

                    <span className="count">{cartNum}</span>
                  </Link>
                ) : (
                  // </Animate>
                  <Link to="/app/Cart">
                    <Fade>
                      <i className="fa fa-cart-arrow-down" />
                      <span className="count">
                        <Fade>{cartNum}</Fade>
                      </span>
                    </Fade>
                  </Link>
                )}
              </a>
            </div>

            <div className="col-auto text-end">
              {UserAuth ? (
                <div className="header_tabs ">
                  <div className="dropdown">
                    <Link
                      to="/MyAccount"
                      state={"jii"}
                      className="text-decoration-none mx-1">
                      <button className="Signupb mt-2">
                        <Fade left>My Account</Fade>
                      </button>
                    </Link>
                    <div className="dropdown-content">
                      <Link
                        to=""
                        className="login_btns mt-3 text-decoration-none d-flex"
                        data-bs-toggle="modal"
                        data-bs-target="#staticBackdrop1"
                        aria-current="page"
                        href="#"
                        onClick={() => {
                          LogOut();
                        }}>
                        <i class="fa fa-sign-out-alt mt-1 mx-1"></i> Logout
                      </Link>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="d-flex mt-2 mx-3">
                  <Link
                    to="/app/login"
                    state={{ kii: "nj" }}
                    // className="login_btns mt-2 text-decoration-none"
                    className="Loginb text-decoration-none"
                    onClick={() => setSearch()}>
                    <Fade left>Login</Fade>
                  </Link>
                  <Link to="/app/register" style={{ textDecoration: "none" }}>
                    <div className="btn-group ">
                      <button className="Signupb text-decoration-none">
                        <Fade left>Sign Up</Fade>
                      </button>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12 header_bottom ">
            <div className="container-fluid">
              <div className="row header_row">
                <div className="col-12">
                  <ul className="header_menuss mb-0 ps-0">
                    <li>
                      <a
                        className="mx-2 p-3"
                        onClick={() =>
                          navigate("/app/home", {
                            state: {
                              id: "kiiii",
                            },
                          })
                        }>
                        Home
                      </a>
                    </li>
                    {(category || [])
                      ?.filter(
                        (itm, ind) =>
                          (width <= 1400 && ind < 6) ||
                          (width < 1600 && ind < 9) ||
                          (width > 1600 && ind < 11)
                      )
                      .map((item, index) => (
                        <li
                          className="new_dropdown"
                          key={index}
                          // className="zindex-1"
                        >
                          <a
                            className="new_dropdown_link "
                            onClick={() => {
                              setPage2(1);
                              navigate("/app/subCategories", {
                                state: {
                                  id: item?._id,
                                  name: item?.categoryName,
                                  image: item?.background,
                                },
                              });
                            }}>
                            {item?.categoryName}
                          </a>
                          <div className="new_dropdown_inner">
                            {(item?.subcategories || [])?.map((item, index) => (
                              <a
                                key={index}
                                onClick={() => {
                                  setPage2(1);
                                  setFilter(item?._id);
                                  navigate(
                                    `/Category/Sub-Category/${item?.slug}`,
                                    {}
                                  );
                                }}>
                                {item?.subCategoryName}
                              </a>
                            ))}
                            {item?.subcategories.length ? (
                              <a
                                onClick={() =>
                                  navigate("/app/subCategories", {
                                    state: {
                                      id: item?._id,
                                      name: item?.categoryName,
                                    },
                                  })
                                }>
                                View all
                                <i className="fa fa-arrow-up-right-from-square mx-2"></i>
                              </a>
                            ) : (
                              <a>No Results....</a>
                            )}
                          </div>
                        </li>
                      ))}
                    <li>
                      <Link
                        className="text-decoration-none mx-2 p-3"
                        to="/app/events/catelog&flyer"
                        state={"JII55"}>
                        Catalog&Flyers
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="text-decoration-none mx-2 p-3"
                        to="/app/Categories"
                        state={"kooo"}>
                        More
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {search?.length ? (
        <section className="brands_page p-2 shadow">
          {products?.length >= 1 || relateCate?.length >= 1 ? (
            <div>
              <div className="col w-100">
                <div className="product_single_right row p-2">
                  <div className="col-12 d-flex ">
                    {relateCate?.length != 0 && (
                      <span className="search_head2 p-0 mb-3 mx-2">
                        Related Sub-Categories :
                      </span>
                    )}
                      {relateCate?.map((itm, ind) => (
                      <div>
                        <p
                          className="subCateSearch"
                          onClick={() => {
                            setPage2(1);
                            setFilter(itm?._id);
                            navigate(`/Category/Sub-Category/${itm?.slug}`, {
                              state: {
                                name: itm?.subCategoryName,
                              },
                            });
                          }}>
                          {" " + itm?.subCategoryName},{" "}
                        </p>
                      </div>
                    ))}
                  </div>
                  {(products || [])?.map((item, index) => (
                    <Fade>
                      <div className="col-xl-2 col-lg-2 col-md-3" key={index}>
                        <a className="featuredproduct_box p-2">
                          <div className="featuredproduct_img ">
                            <img
                              loading="lazy"
                              src={
                                // item?.type.flavour
                                //   ? item?.type?.flavourImage ||
                                //     require("../../assets/img/product.jpg")
                                //   :
                                item?.productImage
                                  ? item?.productImage
                                  : require("../../assets/img/product.jpg")
                              }
                              alt="Product"
                              onClick={() => {
                                navigate(`/AllProducts/Product/${item?.slug}`);
                                setSearch();
                              }}
                            />
                          </div>
                          <div className="featuredproduct_details p-2">
                            <span
                              onClick={() => {
                                navigate(`/AllProducts/Product/${item?.slug}`);

                                setSearch();
                              }}>
                              {/* {item?.type.flavour
                              ? item?.unitName + "-" + item?.type?.flavour
                              :  */}

                              {item?.unitName?.length >= 46
                                ? item?.unitName?.slice(0, 40) + "...."
                                : item?.unitName?.slice(0, 40)}
                            </span>
                          </div>
                        </a>
                      </div>
                    </Fade>
                  ))}
                </div>
                <div className="col-lg-12 d-flex text-center mt-1 mb-0">
                  {products?.length >= 3 && (
                    <p
                      className=" dropViewAll"
                      onClick={() => {
                        setSearch();
                        navigate(`/app/ProductSearch/${search}`);
                      }}>
                      View all results
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="row justify-content-center">
              {load ? (
                <div className="row text-center">
                  <div class="lds-facebook">
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                </div>
              ) : (
                <div className="row justify-content-center">
                  <img
                    className="no-data"
                    src={require("../../assets/img/no-data.gif")}
                    style={{ width: "600px" }}
                  />
                  <h5 className="text-center">NO RESULTS...</h5>
                </div>
              )}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
};

export default Navbar;
