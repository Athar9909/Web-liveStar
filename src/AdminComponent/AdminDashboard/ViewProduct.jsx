import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect } from "react";
import classNames from "classnames";
import Swal from "sweetalert2";

const ViewProduct = () => {
  const getProducts = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/allProducts`;
  const categoryApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/categoryDropdown`;
  const SubCategoryApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/subCategoryList`;
  const brandsApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/brandsDropdown`;
  const prodStatus = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/productStatus`;
  const inventorySearch = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/searchInventory`;
  const inventorySort = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/sortProducts`;
  const [maxPage, setMaxPage] = useState(1);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [change, setChange] = useState();
  const [activePage, setActivePage] = useState(1);
  const [formValues, setFormValues] = useState([
    {
      productType: [],
      flavour: [],
      flavourImage: [],
      barcode: [],
      size: [],
      description: [],
    },
  ]);
  let User = JSON.parse(localStorage.getItem("AdminData"));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm({
    mode: "onBlur",
  });
  useEffect(() => {
    getBrands();
    GetProducts();
  }, [change, activePage]);

  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");

  const getBrands = async () => {
    await axios
      .post(categoryApi, {
        page: 1,
      })
      .then((res) => {
        setCategories(res?.data.results?.categories);
      });
    await axios.post(brandsApi).then((res) => {
      setBrands(res?.data.results.brands);
    });
  };
  const GetProducts = async () => {
    await axios
      .post(getProducts, {
        page: activePage,
      })
      .then((res) => {
        let data = res?.data.results.products;
        setAllProducts(data);
        setMaxPage(res?.data.results.allPages);
      });
  };
  const sorting = async (i) => {
    await axios
      .post(getProducts, {
        page: activePage,
        sortBy: i,
      })
      .then((res) => {
        let data = res?.data.results.products;
        setAllProducts(data);
        setMaxPage(res?.data.results.allPages);
      });
  };

  const NewSubCategory = async (e) => {
    let categoryId = e.target.value;
    await axios
      .post(SubCategoryApi, {
        categoryId: categoryId,
        page: 1,
      })
      .then((res) => {
        setSubCategories(res?.data.results);
      });
  };
  const onSearch = async (data) => {
    if (data?.Scategory || data?.Sbrands || data?.SsubCategory) {
      console.log(data);
      await axios
        .post(inventorySort, {
          category: data?.Scategory,
          subCategory: data?.SsubCategory,
          brand: data?.Sbrands,
        })
        .then((res) => {
          let data = res?.data.results.products;
          setAllProducts(data);
        });
    } else {
      Swal.fire({
        title: "Please Select search keys.",
        icon: "warning",
      });
    }
  };

  const InventSearch = async (e) => {
    let string = e.target.value;
    string !== ""
      ? await axios
          .post(inventorySearch, {
            search: e.target.value,
          })
          .then((res) => {
            if (!res.error) {
              setAllProducts(res?.data.results.results);
            }
          })
      : GetProducts();
  };

  const ProductStatus = async (index) => {
    await axios.post(prodStatus + "/" + allProducts[index]?._id).then((res) => {
      console.log(res);
    });
  };

  var today = new Date().toISOString().split("T")[0];
  document.getElementsByName("to")[0]?.setAttribute("max", today);
  document.getElementsByName("from")[0]?.setAttribute("max", today);
  return (
    <div>
      <div className="col-12 design_outter_comman recent_orders shadow">
        <div className="row comman_header justify-content-between">
          <div className="col-auto">
            <h2>Inventory Management</h2>
          </div>
          <div className="col-4 d-flex justify-content-end">
            <form className="form-design" action="">
              <div className="form-group mb-0 position-relative icons_set">
                <input
                  type="search"
                  className="form-control bg-white "
                  placeholder="Search"
                  name="name"
                  id="search"
                  onChange={(e) => {
                    InventSearch(e);
                  }}
                />
              </div>
            </form>
            <div className="dropdown  mt-1">
              <div>
                <div class="dropdown_sort">
                  <button class="dropdown-btn_sort">
                    <img
                      src={require("../../assets/img/iconSort.png")}
                      width={23}
                      height={23}
                      className="mx-3 mt-2"
                    ></img>
                  </button>
                  <div class="dropdown-content_sort">
                    <a>
                      <Link
                        className="text-decoration-none "
                        onClick={() => sorting(1)}
                      >
                        A to Z
                      </Link>
                    </a>
                    <a>
                      <Link
                        className="text-decoration-none"
                        onClick={() => sorting(-1)}
                      >
                        Z to A
                      </Link>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <form
          className="form-design py-3 px-4 help-support-form row align-items-end justify-content-between"
          action=""
          onSubmit={handleSubmit2(onSearch)}
        >
          <div className="form-group col-4">
            <label htmlFor="">Category</label>
            <select
              className={classNames(" form-select   border border-secondary", {
                "is-invalid": errors2.Scategory,
              })}
              name="Scategory"
              {...register2("Scategory")}
              onChange={(e) => NewSubCategory(e)}
            >
              <option value="">Select Category</option>

              {categories?.map((item, index) => (
                <option value={item?._id} key={index}>
                  {item?.categoryName}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group col-4">
            <label htmlFor="">Sub Category</label>
            <select
              className={classNames(" form-select  border border-secondary", {
                "is-invalid": errors2.SsubCategory,
              })}
              name="SsubCategory"
              {...register2("SsubCategory")}
            >
              <option value="">Select Sub Category</option>
              {(subCategories || [])?.map((item, index) => (
                <option value={item.subcategories?._id} key={index}>
                  {item.subcategories?.subCategoryName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-3">
            <label htmlFor="">Brands</label>
            <select
              className={classNames(" form-select  border border-secondary", {
                "is-invalid": errors2.Sbrands,
              })}
              aria-label="Default select example"
              name="Sbrands"
              {...register2("Sbrands")}
            >
              <option value="">Select Brands</option>
              {(brands || [])?.map((item, index) => (
                <option value={item?._id} key={index}>
                  {item?.brandName}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group  col-1">
            <button className="comman_btn" type="submit">
              Search
            </button>
          </div>
        </form>
        <div className="row">
          <div className="col-12 comman_table_design px-0">
            <div className="table-responsive">
              <table className="table mb-0">
                <thead>
                  <tr style={{ backgroundColor: "#f2f2f2" }}>
                    <th>S.No.</th>
                    <th>Product Name</th>
                    <th>Flavours-Status</th>
                    <th>Brand</th>
                    <th>Category</th>
                    <th>Sub-Category</th>
                    <th>Product Image</th>
                  </tr>
                </thead>

                <tbody>
                  {(allProducts || [])?.map((User, index) => (
                    <tr key={index} className="">
                      <td className="border">
                        {(activePage - 1) * 20 + (index + 1)}.
                      </td>
                      <td className="border">
                        <h6>{User?.unitName}</h6>
                      </td>
                      <td className="border">
                        {User?.type?.map((item) => (
                          <ul>
                            <li className="d-flex">
                              <h6 className="mx-2">{item.flavour}</h6>(
                              {item?.flavourStatus === true
                                ? "Active"
                                : "In-active"}
                              )
                            </li>
                          </ul>
                        ))}
                      </td>
                      <td className="border">
                        <h6>{User?.brand?.brandName}</h6>
                      </td>
                      <td className="border">
                        <h6>{User?.category?.categoryName}</h6>
                      </td>
                      <td className="border">
                        <h6>{User?.subCategory?.subCategoryName}</h6>
                      </td>
                      <td className="border">
                        <img
                          width={100}
                          src={
                            User?.productImage
                              ? User?.productImage
                              : require("../../assets/img/product.jpg")
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {allProducts?.length ? (
              <div className="col-11 d-flex justify-content-between py-2 mx-5">
                <span className="totalPage">( Total Pages : {maxPage} )</span>
                <ul id="pagination">
                  <li>
                    <a
                      class="fs-5"
                      href="#"
                      onClick={() =>
                        activePage <= 1
                          ? setActivePage(1)
                          : setActivePage(activePage - 1)
                      }
                    >
                      «
                    </a>
                  </li>

                  <li>
                    <a href="#">.</a>
                  </li>
                  <li>
                    <a href="#">.</a>
                  </li>
                  <li>
                    <a href="#" className="active">
                      {activePage}
                    </a>
                  </li>
                  <li>
                    <a href="#">.</a>
                  </li>
                  <li>
                    <a href="#">.</a>
                  </li>

                  <li>
                    <a
                      className="fs-5"
                      href="#"
                      onClick={() =>
                        activePage === maxPage
                          ? setActivePage(maxPage)
                          : setActivePage(activePage + 1)
                      }
                    >
                      »
                    </a>
                  </li>
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewProduct;
