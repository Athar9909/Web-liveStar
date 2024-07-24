import React, { useState } from "react";import { Link, useNavigate } from "react-router-dom";
import "../../../assets/css/adminMain.css";
import { useForm } from "react-hook-form";
import Starlogo from "../../../assets/img/logo.png";
import axios from "axios";
import { useEffect } from "react";
import ProfileBar from "../ProfileBar";
import classNames from "classnames";
import Swal from "sweetalert2";
import { BiEdit } from "react-icons/bi";
import { useScrollBy } from "react-use-window-scroll";
import { Button } from "rsuite";
import Compressor from "compressorjs";
import { pageInventoryData } from "../../../atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { components } from "react-select";
import { default as ReactSelect } from "react-select";

const OptionSelect = (props) => {
  return (
    <div>
      <components.Option {...props} className="d-flex ">
        <input
          type="checkbox"
          className="border border-secondary"
          checked={props.isSelected}
          onChange={() => null}
        />{" "}
        <label className="mx-2 mt-1">{props.label}</label>
      </components.Option>
    </div>
  );
};

const Inventory = () => {
  const addProduct = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/addProduct`;
  const statesApi = "https://countriesnow.space/api/v0.1/countries/states";
  const getProducts = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/allProducts`;
  const categoryApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/categoryDropdown`;
  const SubCategoryApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/subCategoryList`;
  const brandsApi = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/brandsDropdown`;
  const uploadImage = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/imageUpload`;
  const importInvent = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/importInventory`;
  const editInvent = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/importInventory`;
  const prodStatus = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/productStatus`;
  const inventorySearch = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/searchInventory`;
  const inventorySort = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/sortProducts`;
  const exportEdit = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/inventory/exportForEdit`;
  const [NewMessage, setNewMessage] = useState("");
  const scrollBy = useScrollBy();
  const [maxPage, setMaxPage] = useState(1);
  const [productImage, setProductImage] = useState();
  const [barcodes, setBarcodes] = useState([]);
  const [sideBar, setSideBar] = useState(true);
  const [allProducts, setAllProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [change, setChange] = useState();
  const importInput = document.getElementById("fileID");
  const editInput = document.getElementById("fileEditID");
  const [impFile, setImpFile] = useState([]);
  const [editFile, setEditFile] = useState([]);
  const [uploadError, setUploadError] = useState("");
  const [set, setSet] = useState(true);
  const [ux, setUx] = useState("");
  const [uE, setUE] = useState("");
  const [loader, setLoader] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const pageData = useRecoilValue(pageInventoryData);
  const setPageData = useSetRecoilState(pageInventoryData);
  const [activePage, setActivePage] = useState(
    pageData[0]?.page ? pageData[0]?.page : 1
  );
  const [isCheck, setIsCheck] = useState([]);
  const [selected, setSelected] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [formValues, setFormValues] = useState([
    {
      productType: [],
      flavour: [],
      flavourImage: [],
      barcode: [],
      description: [],
      caseQty: "",
    },
  ]);
  const [seo, setSeo] = useState([]);
  let User = JSON.parse(localStorage.getItem("AdminData"));
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [options, setOptions] = useState([]);
  const [restrictedState, setRestrictedState] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [searchKey, setSearchKey] = useState("");

  const {
    register: register2,
    formState: { errors: errors2 },
    handleSubmit: handleSubmit2,
  } = useForm({
    mode: "onBlur",
  });

  useEffect(() => {
    setIsCheck([]);
    setIsCheckAll(!isCheckAll);
    getBrands();
    pageData[0]?.searchKey
      ? InventSearch(pageData[0]?.searchKey)
      : GetProducts();
  }, [change, activePage]);

  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");

  const handleChange2 = (selected) => {
    setRestrictedState(selected);
  };

  const handleInputChange = (inputValue) => {
    setSearchKey(inputValue);
  };
  useEffect(() => {
    createOptions();
  }, [searchKey]);

  const createOptions = async () => {
    await axios
      .post(statesApi, {
        country: "United States",
      })
      .then((res) => {
        if (!res.error) {
          let data = res?.data?.data?.states;
          console.log(data, "jdfkk");
          const optionList = data?.map((item, index) => ({
            value: item?.name,
            label: item?.name,
          }));
          setOptions(optionList);
        }
      });
  };

  console.log(restrictedState);

  const exportProducts = async () => {
    if (selected?.length) {
      const { data } = await axios.post(exportEdit, {
        id: selected?.map((item) => item.productId),
      });
      if (!data.error) {
        setSelected([]);
        setIsCheck([]);
        setSideBar([]);
        const downloadLink = document.createElement("a");
        downloadLink.href = data.results.file;
        downloadLink.download = "doc";
        downloadLink.click();
      }
    } else {
      Swal.fire({
        text: "Please Select atleast One Product!",
        icon: "warning",
        confirmButtonText: "Okay",
      });
    }
  };

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
    setPageData([{ searchKey: "" }]);
    await axios
      .post(getProducts, {
        page: activePage ? activePage : 1,
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
  let handleChange = (i, e) => {
    let newFormValues = [...formValues];
    newFormValues[i][e.target.name] = e.target.value;
    setFormValues(newFormValues);
  };

  const InventSearch = async (key) => {
    let string = key;
    setSearch(key);
    console.log(key);
    string !== ""
      ? await axios
          .post(inventorySearch, {
            search: string,
          })
          .then((res) => {
            if (!res.error) {
              setAllProducts(res?.data.results.results);
              // setActivePage(1);
            }
          })
      : GetProducts();
  };

  const addFormFields = (e) => {
    setFormValues([
      ...formValues,
      {
        productType: "",
        flavour: [],
        flavourImage: "",
        barcode: [],
        flavourPrice: "",
        description: "",
        size: "",
      },
    ]);
  };
  const removeFormFields = (index) => {
    let newFormValues = [...formValues];
    newFormValues?.splice(index, 1);
    setFormValues(newFormValues);
    setChange(!change);
  };
  // console.log(compressedFile);

  const productImageSelection = (e) => {
    const formData = new FormData();
    const image = e.target.files[0];
    new Compressor(image, {
      success: (compressed) => {
        formData.append("productImage", compressed);
        axios.post(uploadImage, formData).then((res) => {
          if (res?.data.message === "Invalid Image format") {
            Swal.fire({
              title: "Invalid Image format!",
              icon: "warning",
              confirmButtonText: "ok",
            });
            e.target.value = null;
            setProductImage("");
          }
          console.log(res?.data.results);
          setProductImage(res?.data.results.productImage);
        });
      },
    });
  };
  const flavourImageSelection = async (e, index) => {
    const formData = new FormData();
    formData.append("flavourImage", e.target.files[0]);

    await axios.post(uploadImage, formData).then((res) => {
      if (res?.data.message === "Invalid Image format") {
        Swal.fire({
          title: "Invalid Image format!",
          icon: "warning",
          confirmButtonText: "ok",
        });
      }
      // e.target.value = null;
      let data = res.data?.results;
      let newFormValues = [...formValues];
      newFormValues[index][e.target.name] = data?.flavourImage;
      setFormValues(newFormValues);
    });
  };

  const onSubmit = async (data) => {
    // setLoader(true);
    console.log(data);
    await axios
      .post(addProduct, {
        productImage: productImage,
        unitName: data?.productName.trim(),
        category: data?.category,
        subCategory: data?.subCategory,
        caseSize: data?.caseSize,
        brand: data?.brands,
        type: formValues,
        SEOKeywords: seo,
        restrictedStates: restrictedState?.map((itm) => itm?.label),
      })
      .then((res) => {
        if (res?.data.error) {
          setLoader(false);
          Swal.fire({
            title: res.data.message,
            icon: "warning",
            confirmButtonText: "ok",
          });
        }
        if (res?.data.message === "Product Added Successfully") {
          setLoader(false);
          Swal.fire({
            title: "Product is added in Inventory!",
            icon: "success",
            confirmButtonText: "okay",
            timer: 2000,
          }).then(() => {
            window.location.reload(false);
          });
          scrollBy(500, 0);
        }
        if (res?.data.message === "Product is already in added") {
          Swal.fire({
            title: "Product is already in Inventory!",
            icon: "warning",
            confirmButtonText: "ok",
          });
        }
        if (res?.data.message === "Please enter unit name") {
          Swal.fire({
            title: "Please Enter Valid Name",
            icon: "warning",
            confirmButtonText: "ok",
          });
        }
      })
      .catch((err) => {
        if (
          err.response?.data?.message ===
          "Please enter valid Details of product"
        ) {
          setLoader(false);
          Swal.fire({
            title: "Please Enter Valid Details of product",
            icon: "error",
            focusConfirm: false,
          });
          setNewMessage("Please Enter All Details of product*");
        }
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

  function handleKeyDown(i, e) {
    // If user did not press enter key, return
    if (e.key !== "Enter") return;
    // Get the value of the input
    const value = e.target.value;
    // If the value is empty, return
    if (!value.trim()) return;
    // Add the value to the tags array
    setBarcodes([...barcodes, value.replace(/(\r\n|\n|\r)/gm, "")]);
    let newFormValues = { ...formValues };
    newFormValues[i][e.target.name] = [
      ...(formValues[i]?.barcode || []),
      value.replace(/(\r\n|\n|\r)/gm, ""),
    ];
    e.target.value = "";
  }

  function handleKeyDownSeo(e) {
    // If user did not press enter key, return
    if (e.key !== "Tab") return;
    const value = e.target.value;
    if (!value.trim()) return;
    // Add the value to the tags array
    setSeo([...seo, value.replace(/(\r\n|\n|\r)/gm, "")]);
    let newFormValues = { ...seo };
    newFormValues[e.target.name] = [
      ...(seo || []),
      value.replace(/(\r\n|\n|\r)/gm, ""),
    ];
    e.target.value = "";
  }

  const removeTag = (ind, i) => {
    console.log(ind, i);
    let newForm = { ...formValues };
    newForm[i]?.barcode.splice(ind, 1);
    setChange(!change);
  };

  const removeKeyWord = (i) => {
    let newForm = [...seo];
    newForm?.splice(i, 1);
    setSeo(newForm);
    setChange(!change);
  };

  const handleClick = () => {
    localStorage.removeItem("AdminData");
    localStorage.removeItem("AdminLogToken");
    localStorage.removeItem("AdminEmail");
  };

  const onUpload = async () => {
    setLoader2(true);
    const formData = new FormData();
    formData.append("csvFilePath", impFile);
    await axios
      .post(importInvent, formData)
      .then((res) => {
        if (res?.data.error) {
          setLoader2(false);
          Swal.fire({
            title: res?.data?.message,
            icon: "error",
            confirmButtonText: "okay",
          });
        }
        if (res?.error) {
          Swal.fire({
            title: "Error in File",
            icon: "error",
            confirmButtonText: "ok",
          });
          setLoader2(false);
        }
        if (res?.data.message === "Imported Successfully") {
          setLoader2(false);

          Swal.fire({
            title: "Products Imported successfully",
            icon: "success",
            confirmButtonText: "ok",
          });
          window.location.reload(false);
        } else if (res?.data.message === "Error in File") {
          setLoader2(false);

          Swal.fire({
            title: "Item Number or Product Name Error in CSV",
            text: res?.data.results?.catError.map((item) => item),
            icon: "error",
            focusConfirm: false,
          });
        } else if (res?.data.message === "Error in file") {
          setLoader2(false);

          Swal.fire({
            title: "Item Number or Product Name Error in CSV",
            text: res?.data.results?.itemNumErr.map((item) => item),
            icon: "error",
            focusConfirm: false,
          });
        }
      })
      .catch((err) => {
        setLoader2(false);

        if (err) {
          Swal.fire({
            title: "Error in csv!",
            icon: "error",
            focusConfirm: false,
          });
        }
      });
    document.getElementById("reUpload").hidden = false;
  };

  const onUploadEdit = async () => {
    const formData = new FormData();
    formData.append("inventoryFile", editFile);
    await axios
      .post(editInvent, formData)
      .then((res) => {
        if (res?.data.error) {
          Swal.fire({
            title: res?.data?.message,
            icon: "error",
            confirmButtonText: "okay",
          });
        }
        if (res?.error) {
          Swal.fire({
            title: "Error in File",
            icon: "error",
            confirmButtonText: "ok",
          });
        }
        if (res?.data.message === "Error in file") {
          Swal.fire({
            title: res?.data.message,
            text: res?.data.results?.itemNumErr.map((item) => item),
            icon: "error",
            confirmButtonText: "okay",
          }).then((res) => {
            window.location.reload();
          });
          setUE("");
          document.getElementById("modalCloseN44").click();
        } else if (res?.data.message === "Products has been modified") {
          Swal.fire({
            title: "Products has been modified",
            icon: "success",
            focusConfirm: false,
            confirmButtonText: "okay",
          });
          document.getElementById("modalCloseN44").click();
        }
      })
      .catch((err) => {
        if (err) {
          Swal.fire({
            title: "Error in Importing Excel.",
            icon: "error",
            focusConfirm: false,
          });
          setUE("");
        }
      });
    document.getElementById("reUpload").hidden = false;
  };

  const onFileSelection = (e) => {
    let file = e.target.files[0];
    setImpFile(file);
    setUx("uploaded");
  };
  const onFileSelectionEdit = (e) => {
    let file = e.target.files[0];
    setEditFile(file);
    setUE("uploaded");
  };
  const ProductStatus = async (id) => {
    await axios.post(prodStatus + "/" + id).then((res) => {
      if (!res?.data.error) {
        Swal.fire({
          title: res?.data.message,
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    });
  };

  const handleSelectAll = (e) => {
    const { checked } = e.target;
    setIsCheckAll(!isCheckAll);
    let Nitem = [...isCheck];
    console.log(allProducts);
    allProducts?.map((li) => Nitem.push(li?._id));
    setIsCheck(Nitem);
    let allData = [...selected];

    (allProducts || [])?.map((val, index) =>
      allData.push({
        productId: val?._id,
      })
    );
    setSelected(allData);

    if (isCheckAll) {
      setIsCheck([]);
    }
    if (!checked) {
      setSelected([]);
    }
  };

  const handleClickSelect = (e, productId, i) => {
    const { id, checked } = e.target;
    console.log(id, checked);
    if (checked) {
      let Array = [...selected];
      Array.push({ productId });
      setSelected(Array);
    }
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
      setSelected(selected.filter((item) => item?.productId !== productId));
    }
  };
  console.log(selected);

  var today = new Date().toISOString().split("T")[0];
  document.getElementsByName("to")[0]?.setAttribute("max", today);
  document.getElementsByName("from")[0]?.setAttribute("max", today);
  return (
    <div className={sideBar ? "admin_main" : "expanded_main"}>
      <div className={sideBar ? "siderbar_section" : "d-none"}>
        <div className="siderbar_inner">
          <div className="sidebar_logo">
            <Link to="" className="">
              <img src={Starlogo} alt="Logo" />{" "}
            </Link>
          </div>
          <div className="sidebar_menus">
            {User?.type === "SubAdmin" ? (
              <ul className="list-unstyled ps-1 m-0">
                <li
                  className={
                    User?.access?.includes("Dashboard") ? "" : "d-none"
                  }
                  onClick={() => setPageData([{ page: 1, searchKey: "" }])}
                >
                  <Link
                    className=""
                    to="/AdminDashboard"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "2px" }}
                      className="fa fa-home"
                    ></i>{" "}
                    Dashboard
                  </Link>
                </li>
                <li
                  onClick={() => setPageData([{ page: 1, searchKey: "" }])}
                  className={
                    User?.access?.includes("User Management") ? "" : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/UserManage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-user"
                    ></i>{" "}
                    User Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("Category Sub-Category Management")
                      ? ""
                      : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/CategorySub"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-layer-group"
                    ></i>{" "}
                    Category &amp; Sub Category
                  </Link>
                </li>

                <li
                  className={
                    User?.access?.includes("Visitor Management")
                      ? ""
                      : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/VisitorPanel"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-layer-group"
                    ></i>{" "}
                   Visitor Management
                  </Link>
                </li>

                <li
                  onClick={() => window.location.reload(false)}
                  className={
                    User?.access?.includes("Inventory Management")
                      ? ""
                      : "d-none"
                  }
                >
                  <Link
                    className="bg-white"
                    to="/Inventory"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "6px", top: "3px" }}
                      class="far fa-building"
                    ></i>{" "}
                    Inventory Management
                  </Link>
                </li>
                <li
                  onClick={() => setPageData([{ page: 1, searchKey: "" }])}
                  className={
                    User?.access?.includes("Brands Management") ? "" : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/brandsManage"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-ship"
                    ></i>{" "}
                    Brands Management
                  </Link>
                </li>
                <li
                  onClick={() => setPageData([{ page: 1, searchKey: "" }])}
                  className={
                    User?.access?.includes("Sub-Admin") ? "" : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/Admin/SubAdmin"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-user-cog"
                    ></i>{" "}
                    Sub-Admin Management
                  </Link>
                </li>

                <li
                  onClick={() => setPageData([{ page: 1, searchKey: "" }])}
                  className={User?.access?.includes("Puller") ? "" : "d-none"}
                >
                  <Link
                    className=" ata"
                    to="/Puller-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-users-gear"
                    ></i>{" "}
                    Puller Management
                  </Link>
                </li>

                <li className={User?.access?.includes("Trade") ? "" : "d-none"}>
                  <Link
                    className=""
                    to="/admin/Tradeshow-manage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-calendar-check"
                    ></i>{" "}
                    Trade Show Management
                  </Link>
                </li>

                <li
                  onClick={() => setPageData([{ page: 1, searchKey: "" }])}
                  className={User?.access?.includes("Gallery") ? "" : "d-none"}
                >
                  <Link
                    className=""
                    to="/Gallery-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-image"
                    ></i>{" "}
                    Gallery Management
                  </Link>
                </li>
                <li
                  className={
                    User?.access?.includes("catalogFlyers") ? "" : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/Catelog-Flyers"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-book"
                    ></i>{" "}
                    Catalog & Flyers
                  </Link>
                </li>

                <li
                  onClick={() => setPageData([{ page: 1, searchKey: "" }])}
                  className={
                    User?.access?.includes("Orders Management") ? "" : "d-none"
                  }
                >
                  <Link
                    className=""
                    to="/OrderRequest"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-layer-group"
                    ></i>{" "}
                    Order Management
                  </Link>
                </li>
                <li
                  onClick={() => setPageData([{ page: 1, searchKey: "" }])}
                  className={User?.access?.includes("CMS") ? "" : "d-none"}
                >
                  <Link
                    className=""
                    to="/Cms"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-cog"
                    ></i>{" "}
                    Content Management
                  </Link>
                </li>
                <li
                  className={User?.access?.includes("Contact") ? "" : "d-none"}
                >
                  <Link
                    className=""
                    to="/Contact&Support"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-handshake-angle"
                    ></i>{" "}
                    Contact & Support
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/AdminLogin"
                    onClick={handleClick}
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-sign-out-alt"
                    ></i>
                    Logout
                  </Link>
                </li>
              </ul>
            ) : (
              <ul className="list-unstyled ps-1 m-0">
                <li onClick={() => setPageData([{ page: 1, searchKey: "" }])}>
                  <Link
                    className=""
                    to="/AdminDashboard"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "2px" }}
                      className="fa fa-home"
                    ></i>{" "}
                    Dashboard
                  </Link>
                </li>
                <li onClick={() => setPageData([{ page: 1, searchKey: "" }])}>
                  <Link
                    className=""
                    to="/UserManage"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-user"
                    ></i>{" "}
                    User Management
                  </Link>
                </li>
                <li onClick={() => setPageData([{ page: 1, searchKey: "" }])}>
                  <Link
                    className=""
                    to="/CategorySub"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-layer-group"
                    ></i>{" "}
                    Category &amp; Sub Category
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/VisitorPanel"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-users"
                    ></i>{" "}
                    Visitor Management
                  </Link>
                </li>
                
                <li onClick={() => window.location.reload(false)}>
                  <Link
                    className="bg-white"
                    to="/Inventory"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                      color: "#3e4093",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "6px", top: "3px" }}
                      class="far fa-building"
                    ></i>{" "}
                    Inventory Management
                  </Link>
                </li>
                <li onClick={() => setPageData([{ page: 1, searchKey: "" }])}>
                  <Link
                    className=""
                    to="/brandsManage"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-ship"
                    ></i>{" "}
                    Brands Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Admin/SubAdmin"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-user-cog"
                    ></i>{" "}
                    Sub-Admin Management
                  </Link>
                </li>
                <li onClick={() => setPageData([{ page: 1, searchKey: "" }])}>
                  <Link
                    className=" ata"
                    to="/Puller-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-users-gear"
                    ></i>{" "}
                    Puller Management
                  </Link>
                </li>

                <li>
                  <Link
                    className=""
                    to="/admin/Tradeshow-manage"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-calendar-check"
                    ></i>{" "}
                    TradeShow Management
                  </Link>
                </li>

                <li onClick={() => setPageData([{ page: 1, searchKey: "" }])}>
                  <Link
                    className=""
                    to="/Gallery-Management"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fas fa-image"
                    ></i>{" "}
                    Gallery Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Catelog-Flyers"
                    style={{
                      textDecoration: "none",
                      fontSize: "18px",
                    }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-book"
                    ></i>{" "}
                    Catalog & Flyers
                  </Link>
                </li>
                <li onClick={() => setPageData([{ page: 1, searchKey: "" }])}>
                  <Link
                    className=""
                    to="/OrderRequest"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-layer-group"
                    ></i>{" "}
                    Order Management
                  </Link>
                </li>
                <li onClick={() => setPageData([{ page: 1, searchKey: "" }])}>
                  <Link
                    className=""
                    to="/Cms"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-cog"
                    ></i>{" "}
                    Content Management
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/Contact&Support"
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa-solid fa-handshake-angle"
                    ></i>{" "}
                    Contact & Support
                  </Link>
                </li>
                <li>
                  <Link
                    className=""
                    to="/AdminLogin"
                    onClick={handleClick}
                    style={{ textDecoration: "none", fontSize: "18px" }}
                  >
                    <i
                      style={{ position: "relative", left: "4px", top: "3px" }}
                      class="fa fa-sign-out-alt"
                    ></i>
                    Logout
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="admin_main_inner">
        <div className="admin_header shadow">
          <div className="row align-items-center mx-0 justify-content-between w-100">
            <div className="col">
              {sideBar ? (
                <div>
                  <h1
                    className="mt-2 text-white"
                    onClick={() => {
                      console.log("yello");
                      setSideBar(!sideBar);
                    }}
                  >
                    <i className="fa fa-bars"></i>
                  </h1>
                </div>
              ) : (
                <div>
                  <h3 className="">
                    <button
                      onClick={(e) => {
                        console.log(e);
                        setSideBar(!sideBar);
                      }}
                    >
                      X
                    </button>
                  </h3>
                </div>
              )}
            </div>
            <div className="col-auto d-flex ml-5">
              <ProfileBar />
            </div>
          </div>
        </div>

        <div className="admin_panel_data height_adjust mt-0">
          <div className="row inventory-management justify-content-center">
            <div className="col-12">
              <div className="row mx-0">
                <div className="col-12 design_outter_comman shadow mb-3">
                  <div className="row comman_header justify-content-between">
                    <div className="col-12 d-flex justify-content-between">
                      <h2 className="mt-3">Add New Inventory</h2>
                      <div>
                        <a
                          data-bs-toggle="modal"
                          id="modal-toggle66"
                          data-bs-target="#staticBackdrop66"
                          className="comman_btn2 text-decoration-none"
                        >
                          Import New Inventory
                        </a>
                        <a
                          data-bs-toggle="modal"
                          data-bs-target="#staticBackdrop68"
                          className="comman_btn2 text-decoration-none mx-2"
                        >
                          Import Existing Inventory
                        </a>
                      </div>
                    </div>
                  </div>
                  <form
                    className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                    action=""
                    onSubmit={handleSubmit(onSubmit)}
                  >
                    <div className="form-group col-3">
                      <label htmlFor="">Product Name</label>
                      <input
                        type="text"
                        className={classNames(
                          "form-control  border border-secondary",
                          { "is-invalid": errors.productName }
                        )}
                        name="productName"
                        placeholder="Enter Product Name"
                        {...register("productName", {
                          required: "Enter Product Name",
                        })}
                      />
                    </div>

                    <div className="form-group col-3 choose_fileInvent position-relative">
                      <span>Product Image </span>
                      <label htmlFor="upload_video" className="inputText">
                        <i className="fa fa-camera me-1" />
                        Choose File
                      </label>{" "}
                      <input
                        type="file"
                        accept="image/*"
                        className={classNames(
                          "form-control  border border-secondary",
                          { "is-invalid": errors.productImage }
                        )}
                        defaultValue=""
                        name="productImage"
                        capture
                        {...register("productImage", {
                          required: "Enter Product Name",
                        })}
                        onChange={(e) => productImageSelection(e)}
                      />
                    </div>
                    <div className="form-group col-3">
                      <label htmlFor="">Case Size</label>
                      <input
                        type="text"
                        className={classNames(
                          "form-control  border border-secondary",
                          { "is-invalid": errors.caseSize }
                        )}
                        name="caseSize"
                        placeholder="Enter Case Size"
                        {...register("caseSize", {
                          required: "Enter Case Size",
                        })}
                      />
                    </div>
                    <div className="form-group col-3">
                      <label htmlFor="">Category</label>
                      <select
                        className={classNames(
                          " form-select form-control  border border-secondary",
                          { "is-invalid": errors.category }
                        )}
                        aria-label="Default select example"
                        name="category"
                        {...register("category", {
                          required: "category is Required*",
                        })}
                        onChange={(e) => NewSubCategory(e)}
                      >
                        <option>Select Category</option>

                        {categories?.map((item, index) => (
                          <option value={item?._id} key={index}>
                            {item?.categoryName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-3">
                      <label htmlFor="">Sub Category</label>
                      <select
                        className={classNames(
                          "  form-control  border border-secondary",
                          { "is-invalid": errors.subCategory }
                        )}
                        aria-label="Default select example"
                        name="subCategory"
                        {...register("subCategory", {
                          required: "SubCategory is Required*",
                        })}
                      >
                        <option value="">Select Sub Category</option>
                        {(subCategories || [])?.map((item, index) => (
                          <option value={item?.subcategories?._id} key={index}>
                            {item?.subcategories?.subCategoryName}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group col-3">
                      <label htmlFor="">Brands</label>
                      <select
                        className="form-select form-control"
                        aria-label="Default select example"
                        name="brands"
                        {...register("brands", {
                          required: "Brands is Required*",
                        })}
                      >
                        <option selected="">Select Brands</option>
                        {(brands || [])?.map((item, index) => (
                          <option value={item?._id} key={index}>
                            {item?.brandName}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group col-6">
                      <label htmlFor="">SEO Keywords (Use Tab key)</label>
                      <div className="tags-input-container">
                        {(seo || [])?.map((tag, ind) => (
                          <div className="tag-item" key={ind}>
                            <span className="tag-text">{tag}</span>
                            <span
                              className="close"
                              onClick={() => removeKeyWord(ind)}
                            >
                              &times;
                            </span>
                          </div>
                        ))}

                        <input
                          type="text"
                          className="tags-input mb-0 bg-light p-2"
                          placeholder="Enter Keywords"
                          name="SeoKeyword"
                          onKeyDown={(e) => handleKeyDownSeo(e)}
                        />
                      </div>
                    </div>

                    <div className="form-group col-12">
                      <label htmlFor="" className="d-flex">
                        Select Restricted States {" -"}
                        <span className="d-flex mx-2">
                          <input
                            className="form-check-input border border-secondary"
                            type="checkbox"
                            value={true}
                            name="subscribe2"
                            id="flexCheckAddress2"
                            onChange={(e) => {
                              let val = e.target.checked;
                              setRestrictedState(val ? options : []);
                            }}
                          />
                          <label
                            className="form-check-label fs-6 text-primary fw-bold mx-2"
                            for="flexCheckAddress2"
                          >
                            Select All
                          </label>
                        </span>
                      </label>
                      <ReactSelect
                        options={options}
                        isMulti
                        closeMenuOnSelect={false}
                        hideSelectedOptions={false}
                        components={{
                          OptionSelect,
                        }}
                        onChange={handleChange2}
                        allowSelectAll={true}
                        value={restrictedState}
                      />

                      {/* <Select
                        name="users"
                        options={options}
                        className="basic-multi-select z-3"
                        classNamePrefix="select"
                        onChange={handleChange2}
                        onInputChange={handleInputChange}
                        value={options}
                        required
                        allowSelectAll={true}
                      /> */}
                    </div>

                    <div className="form-group col-12 mt-2">
                      <form className="">
                        <div className="row flavour_box align-items-end mx-0 py-4 px-3">
                          <p className="text-danger fw-bold"> {NewMessage}</p>
                          {(formValues || [])?.map((element, index) => (
                            <div className="form-group mb-0 col-12 border-bottom">
                              <div className="row" key={index}>
                                <div className="form-group col-3">
                                  <label htmlFor="">Type</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="productType"
                                    pattern="[A-Za-z]{3}"
                                    title="Three letter country code"
                                    placeholder="Enter Product Type"
                                    value={element.productType || ""}
                                    onChange={(e) => handleChange(index, e)}
                                  />
                                </div>
                                <div className="form-group mb-0 col-3">
                                  <label htmlFor="">Flavour</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="flavour"
                                    placeholder="Enter Flavour"
                                    value={element.flavour || ""}
                                    onChange={(e) => handleChange(index, e)}
                                  />
                                </div>
                                <div className="form-group mb-0 col-3">
                                  <label htmlFor="">Price</label>
                                  <input
                                    type="number"
                                    className="form-control"
                                    name="flavourPrice"
                                    placeholder="Enter Price"
                                    value={element.flavourPrice || ""}
                                    onChange={(e) => handleChange(index, e)}
                                  />
                                </div>
                                <div className="form-group col-3">
                                  <label htmlFor="">Size</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="caseQty"
                                    placeholder="Enter case size"
                                    value={element.caseQty || ""}
                                    onChange={(e) => handleChange(index, e)}
                                  />
                                </div>
                                <div className="form-group mt-2 col-3  choose_fileInvent position-relative">
                                  <span>Flavour Image </span>{" "}
                                  <label
                                    htmlFor="upload_video"
                                    className="inputText"
                                  >
                                    <i className="fa fa-camera me-1" />
                                    Choose File
                                  </label>{" "}
                                  <input
                                    type="file"
                                    className="form-control"
                                    id="flavourImage"
                                    name="flavourImage"
                                    accept="image/*"
                                    onChange={(e) =>
                                      flavourImageSelection(e, index)
                                    }
                                  />
                                </div>
                                <div className="form-group mb-0 col-4">
                                  <label htmlFor="">Barcode</label>
                                  <div className="tags-input-container">
                                    {(formValues[index]?.barcode || [])?.map(
                                      (tag, ind) => (
                                        <div className="tag-item" key={ind}>
                                          <span className="tag-text">
                                            {tag}
                                          </span>
                                          <span
                                            className="close"
                                            onClick={() =>
                                              removeTag(ind, index)
                                            }
                                          >
                                            &times;
                                          </span>
                                        </div>
                                      )
                                    )}

                                    <input
                                      type="text"
                                      className="tags-input mb-0"
                                      placeholder="Enter Barcodes"
                                      name="barcode"
                                      onKeyDown={(e) => handleKeyDown(index, e)}
                                    />
                                  </div>
                                </div>
                                <div className="form-group col-4">
                                  <label htmlFor="">Description</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="description"
                                    placeholder="Enter Product Description"
                                    value={element.description || ""}
                                    onChange={(e) => handleChange(index, e)}
                                  />
                                </div>

                                <div className="form-group col-1  rmv_btn">
                                  <button
                                    className="comman_btn "
                                    type="button"
                                    disabled={
                                      formValues?.length <= 1 ? true : false
                                    }
                                    onClick={() => removeFormFields(index)}
                                  >
                                    <i className="fa fa-minus mt-1 mx-1" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                          <div className="form-group  col-12 text-center mt-1 mb-2 mb-0">
                            <button
                              className="comman_btn add_btn"
                              type="button"
                              onClick={() => addFormFields()}
                            >
                              <i className="fa fa-plus mt-1 mx-1" /> Add More
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                    <div className="form-group mb-0 col-12 text-center ">
                      <Button
                        loading={loader}
                        className="comman_btn"
                        style={{ backgroundColor: "#eb3237", color: "#fff" }}
                        type="submit"
                      >
                        Save Product
                      </Button>
                    </div>
                  </form>
                </div>
                <div className="col-12 design_outter_comman recent_orders shadow">
                  <div className="row comman_header justify-content-between">
                    <div className="col-auto">
                      <h2>Inventory Management</h2>
                    </div>
                    <div className="col-auto d-flex justify-content-end">
                      <div className="form-design mt-1 mx-1">
                        <div className="form-group mb-0 position-relative icons_set">
                          <input
                            type="text"
                            className="form-control bg-white "
                            placeholder="Search"
                            name="name"
                            defaultValue={pageData[0]?.searchKey}
                            id="search"
                            onChange={(e) => {
                              InventSearch(e.target.value);
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-auto">
                        <button
                          className="comman_btn2 mx-1"
                          onClick={() => exportProducts()}
                        >
                          Export <i class="fa-solid fa-file-export"></i>
                        </button>
                      </div>
                      <div className="dropdown  mt-1 col-auto">
                        <div>
                          <div class="dropdown_sort">
                            <button class="dropdown-btn_sort">
                              <img
                                src={require("../../../assets/img/iconSort.png")}
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
                    className="form-design py-3 px-4 help-support-form row align-items-end justify-content-between bg-light border-bottom"
                    action=""
                    onSubmit={handleSubmit2(onSearch)}
                  >
                    <div className="form-group col-4">
                      <label htmlFor="">Category</label>
                      <select
                        className={classNames(
                          " form-select   border border-secondary",
                          { "is-invalid": errors2.Scategory }
                        )}
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
                        className={classNames(
                          " form-select  border border-secondary",
                          { "is-invalid": errors2.SsubCategory }
                        )}
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
                        className={classNames(
                          " form-select  border border-secondary",
                          { "is-invalid": errors2.Sbrands }
                        )}
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
                  <div className="row recent_orders_invent">
                    {allProducts?.length && !search?.length ? (
                      <div className="col-11 d-flex justify-content-between py-2 mx-5">
                        <span className="totalPage">
                          ( Total Pages : {maxPage} )
                        </span>
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
                              {activePage ? activePage : 1}
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
                    <div className="col-12 comman_table_design pb-3">
                      <div className="table-responsive">
                        <table className="table mb-0">
                          <thead>
                            <tr style={{ backgroundColor: "#f2f2f2" }}>
                              <th>
                                <input
                                  type="checkbox"
                                  name="selectAll"
                                  id="selectAll"
                                  onChange={handleSelectAll}
                                  checked={isCheckAll ? true : false}
                                  class=""
                                />
                                <span class="checkmark-all"></span>
                                <span className="mx-1">Select All</span>
                              </th>
                              <th>Product Name</th>
                              <th>Brand</th>
                              <th>Category</th>
                              <th>Sub-Category</th>
                              <th>Product Image</th>
                              <th>Status</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            {(allProducts || [])?.map((User, index) => (
                              <tr key={index} className="">
                                <td className="border">
                                  <input
                                    type="checkbox"
                                    key={User?._id}
                                    name={index}
                                    id={User?._id}
                                    onChange={(e) =>
                                      handleClickSelect(e, User?._id, index)
                                    }
                                    checked={isCheck?.includes(User?._id)}
                                    class="checkbox-in"
                                  />
                                </td>
                                {/* <td className="border">
                                  {(pageData[0]?.page
                                    ? pageData[0]?.page
                                    : 1 - 1) *
                                    20 +
                                    (index + 1)}
                                  .
                                </td> */}
                                <td className="border">{User?.unitName}</td>
                                <td className="border">
                                  {User?.brand?.brandName}
                                </td>
                                <td className="border">
                                  {User?.category?.categoryName}
                                </td>
                                <td className="border">
                                  {User?.subCategory?.subCategoryName}
                                </td>
                                <td className="border">
                                  <img
                                    width={60}
                                    src={
                                      User?.productImage
                                        ? User?.productImage
                                        : require("../../../assets/img/product.jpg")
                                    }
                                  />
                                </td>
                                <td className="border">
                                  {" "}
                                  <div className="" key={User?._id}>
                                    <label class="switchUser">
                                      <input
                                        type="checkbox"
                                        id={User?.unitName}
                                        defaultChecked={User?.status}
                                        onClick={() => {
                                          ProductStatus(User?._id);
                                        }}
                                      />
                                      <span class="sliderUser round"></span>
                                    </label>
                                  </div>
                                </td>

                                <td className="border">
                                  <Link
                                    className="comman_btn2  text-decoration-none"
                                    to={{
                                      pathname: `/Inventory/View-Edit/${User?._id}`,
                                    }}
                                    onClick={() => {
                                      setPageData([
                                        { page: activePage, searchKey: search },
                                      ]);
                                    }}
                                    id={index}
                                  >
                                    View
                                  </Link>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      {allProducts?.length && !search?.length ? (
                        <div className="col-11 d-flex justify-content-between py-2 mx-5">
                          <span className="totalPage">
                            ( Total Pages : {maxPage} )
                          </span>
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
                                {activePage ? activePage : 1}
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
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal comman_modal_form forms_modal"
        id="staticBackdrop66"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-0  rounded-top">
            <div className="modal-body">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  window.location.reload(false);
                }}
                id="modal-close66"
              />

              <div>
                <div className="container">
                  <div className="">
                    {set ? (
                      <div className="drop_box p-5">
                        <header>
                          <h4>Choose File here</h4>
                        </header>
                        <p>Files Supported: CSV</p>
                        <p className="text-dark bg-light p-2">
                          {impFile?.name}{" "}
                          <button
                            hidden
                            className="btn"
                            id="reUpload"
                            accept=".csv/*"
                            onClick={() => {
                              importInput.click();
                            }}
                          >
                            <BiEdit />
                          </button>
                        </p>
                        <p className="text-danger fw-bold">{uploadError}</p>
                        <input
                          type="file"
                          accept=".csv"
                          id="fileID"
                          style={{ display: "none" }}
                          onChange={onFileSelection}
                        />
                        {ux !== "" ? (
                          <Button
                            className="comman_btn"
                            loading={loader2}
                            style={{
                              backgroundColor: "#eb3237",
                              color: "#fff",
                              fontSize: "20px",
                              position: "relative",
                              top: "-2px",
                            }}
                            onClick={onUpload}
                          >
                            Upload
                          </Button>
                        ) : (
                          <button
                            className="comman_btn2"
                            htmlFor=""
                            onClick={() => {
                              importInput.click();
                            }}
                          >
                            Import
                          </button>
                        )}
                        <span className="text-secondary mt-2">
                          *Large files may take longer time.
                        </span>
                      </div>
                    ) : (
                      <div className="drop_box p-5">
                        <h1 className="fs-5">CSV Imported</h1>
                        <p> {impFile?.name} </p>
                        <button className="comman_btn mt-3">
                          Generate Passwords
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        className="modal comman_modal_form forms_modal"
        id="staticBackdrop68"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 rounded-0  rounded-top">
            <div className="modal-body">
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={() => {
                  setEditFile("");
                  setUE("");
                  GetProducts();
                }}
                id="modalCloseN44"
              />

              <div>
                <div className="container">
                  <div className="">
                    <div className="drop_box p-5">
                      <header>
                        <h4>Choose Edit File here</h4>
                      </header>
                      <p>Files Supported: Excel</p>
                      <p className="text-dark bg-light p-2">
                        {editFile?.name}{" "}
                        <button
                          hidden
                          className="btn"
                          id="reUpload"
                          accept=".csv/*"
                          onClick={() => {
                            editInput.click();
                          }}
                        >
                          <BiEdit />
                        </button>
                      </p>
                      <p className="text-danger fw-bold">{uploadError}</p>
                      <input
                        type="file"
                        accept=".xlsx"
                        id="fileEditID"
                        style={{ display: "none" }}
                        onChange={onFileSelectionEdit}
                      />
                      {uE !== "" ? (
                        <button
                          className="comman_btn"
                          htmlFor=""
                          onClick={onUploadEdit}
                        >
                          Upload
                        </button>
                      ) : (
                        <button
                          className="comman_btn2"
                          htmlFor=""
                          onClick={() => {
                            editInput.click();
                          }}
                        >
                          Choose File
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
