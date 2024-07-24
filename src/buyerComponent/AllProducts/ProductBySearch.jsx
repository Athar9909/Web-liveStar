import React, { useState } from "react";
import Navbar from "../Homepage/Navbar";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import Footer from "../Footer/Footer";
import { homeSearch } from "../../pwaComponents/httpServices/homeHttpService/homeHttpService";

const ProductBySearch = () => {
  const [products, setProducts] = useState([]);
  let params = useParams();
  const [search, setSearch] = useState("");
  const [relateCate, setRelateCate] = useState([]);

  let navigate = useNavigate();

  if (search !== params?.id) {
    setSearch(params?.id);
  }

  const getProductList = async () => {
    const { data } = await homeSearch({
      search: search.replace(".", ""),
      limit: 20,
    });
    if (!data.error) {
      setProducts(data?.results.products);
      setRelateCate(data?.results.subCategories);
    }
  };
  console.log(products);

  useEffect(() => {
    getProductList();
  }, [search]);

  return (
    <div>
      <Navbar />

      <>
        <section className="brands_page p-5 marginTop">
          <h4>Search Results For : "{search}"</h4>
          {products?.length ? (
            <div>
              <div className="col w-100">
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
                <div className="product_single_right row p-4">
                  {(products || [])?.map((item, index) => (
                    <div className="col-xl-3 col-lg-3 col-md-3" key={index}>
                      <div className="product_parts_box">
                        <div className="partsproduct_img">
                          <img
                            src={
                              // item?.type.flavour
                              //   ? item?.type?.flavourImage ||
                              //     require("../../assets/img/product.jpg")
                              //   :
                              item?.productImage ||
                              require("../../assets/img/product.jpg")
                            }
                            alt=""
                            onClick={() => {
                              navigate(`/AllProducts/Product/${item?.slug}`);
                            }}
                          />
                        </div>
                        {/* </Link> */}
                        <div className="product_content mt-3 text-center">
                          <div className="d-flex justify-content-center">
                            <h1
                              className="text-center fs-6 fw-bolder text-uppercase"
                              style={{ position: "relative", left: "0px" }}
                              onClick={() => {
                                navigate(`/AllProducts/Product/${item?.slug}`);
                              }}>
                              {/* {item?.type.flavour
                                ? item?.unitName + "-" + item?.type?.flavour } */}
                              {item?.unitName}
                            </h1>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="row justify-content-center">
              <img
                className="no-data"
                src={require("../../assets/img/no-data.gif")}
                style={{ width: "600px" }}
              />
            </div>
          )}
        </section>
      </>
      <Footer />
    </div>
  );
};

export default ProductBySearch;
