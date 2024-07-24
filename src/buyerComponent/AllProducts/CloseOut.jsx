import React, { useState } from "react";
import Navbar from "../Homepage/Navbar";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Footer from "../Footer/Footer";
import Swal from "sweetalert2";
import { pageFeature } from "../../atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Countdown from "react-countdown";
import { Modal, ButtonToolbar, Button, Loader, Placeholder } from "rsuite";
import LoginPOP from "../Homepage/loginPOP";
import moment from "moment";

const CloseOut = () => {
  const [products, setProducts] = useState([]);
  const allProd = `${process.env.REACT_APP_APIENDPOINTNEW}user/getPromotion`;
  const addFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/addToFav`;
  const rmvFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/removeFav`;
  const navigate = useNavigate();
  const [maxPage, setMaxPage] = useState(1);
  const [heart, setHeart] = useState(false);
  const setPage = useSetRecoilState(pageFeature);
  const page = useRecoilValue(pageFeature);
  const [activePage, setActivePage] = useState(page);
  const addCart = `${process.env.REACT_APP_APIENDPOINTNEW}user/addProducts`;
  const [NState, setNState] = useState(false);
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState(0);
  const handleClose = () => setOpen(false);
  const handleEntered = () => {
    setTimeout(() => setRows(80), 2000);
  };
  const getLoginCnfirm = (data) => {
    if (data?.length > 1) {
      setOpen(false);
      window.location.reload(false);
    }
  };

  useEffect(() => {
    GetProducts();
  }, [activePage, heart]);
  console.log(page);

  const GetProducts = async () => {
    const { data } = await axios.post(allProd, {
      type: "CloseOut",
    });

    if (!data.error) {
      setProducts(data?.results.promotion?.products);
    }
  };

  const AddtoCart = async (id, flavour, slug, price) => {
    await axios
      .post(addCart, {
        productId: id,
        quantity: 1,
        flavour: flavour,
      })
      .then((res) => {
        if (!res.data.error) {
          setNState(!NState);
          Swal.fire({
            title: "Product Added to Cart",
            icon: "success",
            showCloseButton: true,
            showCancelButton: true,
            timer: 1000,
            focusConfirm: false,
            confirmButtonText: '<i class="fa fa-shopping-cart"></i> Cart!',
            confirmButtonAriaLabel: "Thumbs up, Okay!",
            cancelButtonText: "Close",
          }).then((res) => {
            if (res.isConfirmed) {
              navigate("/app/cart", { state: "jii" });
            }
          });
        }
        if (res.data?.message === "Not available in your State!") {
    
          Swal.fire({
            title: "This Product is not available in your State!",
            icon: "warning",
            focusConfirm: false,
            timer: 1000,
          });
        }
        if (
          res?.data.message === "Flavour is not available!" ||
          res?.data.message === "Please provide flavour!"
        ) {
          Swal.fire({
            title: "Please select a Flavour!",
            text: "Click Below button to view All Flavours.",
            icon: "error",
            confirmButtonText: "View",
          }).then((res) => {
            console.log(res);
            navigate(`/AllProducts/Product/${slug}`, {
              state: {
                offer: price,
              },
            });
          });
        }
      })
      .catch((err) => {
        console.log(err.response.data.message);
        if (err.response.data.error) {
          setOpen(true);
        }
      });
  };

  const addToFav = async (id, flavour) => {
    await axios
      .post(addFav, {
        productId: id,
        flavour: flavour,
      })
      .then((res) => {
        if (!res.error) {
          Swal.fire({
            title: "Product Added to Wishlist.",
            icon: "success",
            text: "You can see your favorite products on My Wishlist.",
            confirmButtonText: "Okay",
            timer: 2000,
          });
        }
      })
      .catch((err) => {
        if (err) {
          setOpen(true);
        }
      });
  };

  return (
    <div>
      <Navbar NState={NState} />
      <section className="comman_banner _banner marginTopSec">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <h1>CLOSING OUT DEALS PRODUCTS</h1>
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
                        Closing-Out-Deal Products
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
        <section className="singleproduct-page comman_paddings">
          <div className="container">
            <div className="row">
              <div className="col singleproduct_divvision mx-0">
                <div className="product_single_right row p-3">
                  <div class="col-12">
                    <div class="row singleproduct---show">
                      {(products || [{}])?.map((item, index) => (
                        <div className="col-xl-3 col-lg-3 col-md-3 mb-lg-3 mb-md-4 mb-3">
                          <div className="product-grid ">
                            <div
                              className="product-image mt-2
                           border">
                              <a
                                className="image mt-4"
                                onClick={() => {
                                  navigate(
                                    `/AllProducts/Product/${item?.productId?.slug}`,
                                    {
                                      state: {
                                        type: item?.productId?.type,
                                        offer: item?.price,
                                      },
                                    }
                                  );
                                }}>
                                <img
                                  className="pic-1"
                                  src={
                                    item?.productId?.productImage
                                      ? item?.productId?.productImage
                                      : require("../../assets/img/product.jpg")
                                  }
                                />
                                <img
                                  className="pic-2"
                                  src={
                                    item?.productId?.type?.flavourImage
                                      ? item?.productId?.type?.flavourImage
                                      : item?.productId?.productImage ||
                                        require("../../assets/img/product.jpg")
                                  }
                                />
                              </a>
                              <span className="product-Close-label">
                                {" "}
                                Ends in : {moment(item?.expireIn).format("L")}
                              </span>
                              <ul className="product-links">
                                <li>
                                  <a
                                    data-tip="Add to Wishlist"
                                    onClick={() => {
                                      addToFav(
                                        item?.productId?._id,
                                        item?.productId?.type
                                      );
                                    }}>
                                    <i className="far fa-heart" />
                                  </a>
                                </li>
                                <li>
                                  <a
                                    data-tip="Add to Cart"
                                    onClick={() => {
                                      AddtoCart(
                                        item?.productId?._id,
                                        item?.productId?.type,
                                        item?.productId?.slug,
                                        item?.price
                                      );
                                    }}>
                                    {" "}
                                    <i className="fas fa-shopping-cart" />
                                  </a>
                                </li>
                                <li>
                                  <a
                                    data-tip="Quick View"
                                    onClick={() => {
                                      navigate(
                                        `/AllProducts/Product/${item?.productId?.slug}`,
                                        {
                                          state: {
                                            type: item?.productId?.type,
                                            offer: item?.price,
                                          },
                                        }
                                      );
                                    }}>
                                    <i className="fa fa-search" />
                                  </a>
                                </li>
                              </ul>
                            </div>
                            <div className="product-content ">
                              <a
                                className="add-to-cart text-decoration-none"
                                onClick={() => {
                                  navigate(
                                    `/AllProducts/Product/${item?.productId?.slug}`,
                                    {
                                      state: {
                                        type: item?.productId?.type,
                                        offer: item?.price,
                                      },
                                    }
                                  );
                                }}>
                                <small
                                  style={{
                                    fontSize: "12px",
                                  }}>
                                  {item?.productId?.type?.flavour
                                    ? item?.productId?.type?.flavour
                                    : item?.productId?.unitName}
                                </small>
                              </a>
                              <h3 className="title ">
                                <a className="text-decoration-none">
                                  {item?.productId?.unitName}
                                </a>
                                <p
                                  style={{
                                    fontSize: "12px",
                                  }}
                                  className="text-dark fw-bold">
                                  {item?.price
                                    ? "Offer Price - $" + item.price
                                    : ""}
                                </p>
                              </h3>
                            </div>
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
      <Modal
        open={open}
        onClose={handleClose}
        onEntered={handleEntered}
        onExited={() => {
          setRows(0);
        }}
        size="lg"
        position="center">
        <Modal.Header>
          {/* <Modal.Title>Modal Title</Modal.Title> */}
        </Modal.Header>
        <Modal.Body>
          {rows ? (
            <div>
              <LoginPOP getLoginCnfirm={getLoginCnfirm} />
            </div>
          ) : (
            <div style={{ textAlign: "center" }}>
              <Loader size="md" />
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CloseOut;
