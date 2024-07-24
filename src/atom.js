import React from "react";
import {
  RecoilRoot,
  selector,
  useRecoilState,
  useRecoilValue,
  atom,
} from "recoil";
export const textState = atom({
  key: "textState", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
export const notifyCount = atom({
  key: "notifyCount", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export const CartCount = atom({
  key: "CartCount", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export const searchKey = atom({
  key: "searchKey", // unique ID (with respect to other atoms/selectors)
  default: "", // default value (aka initial value)
});
export const pageCategory = atom({
  key: "pageCate", // unique ID (with respect to other atoms/selectors)
  default: 1, // default value (aka initial value)
});
export const pageBrand = atom({
  key: "pageBrand", // unique ID (with respect to other atoms/selectors)
  default: 1, // default value (aka initial value)
});

export const pageSubCategoryData = atom({
  key: "pageSubCategoryData", // unique ID (with respect to other atoms/selectors)
  default: [
    {
      subCategory: "",
      brand: "",
      sortBy: "",
      filtr: false,
    },
  ], // default value (aka initial value)
});
export const pageCategoryData = atom({
  key: "pageCategoryData", // unique ID (with respect to other atoms/selectors)
  default: [
    {
      category: "",
      brand: "",
      sortBy: "",
      filtr: false,
    },
  ], // default value (aka initial value)
});
export const pageSubCategory = atom({
  key: "pageSubCategory", // unique ID (with respect to other atoms/selectors)
  default: 1, // default value (aka initial value)
});
export const pageFeature = atom({
  key: "pageFeature", // unique ID (with respect to other atoms/selectors)
  default: 1, // default value (aka initial value)
});
export const chngeFilter = atom({
  key: "chngeFilter", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const userPassword = atom({
  key: "userPassword", // unique ID (with respect to other atoms/selectors)
  default: "star@321", // default value (aka initial value)
});

export const appCateProd = atom({
  key: "appCateProd", // unique ID (with respect to other atoms/selectors)
  default: [
    {
      page: 1,
      searchKey: "",
      brand: "",
      sortBy: 1,
      filtr: false,
    },
  ],
});

export const appSubProd = atom({
  key: "appSubProd", // unique ID (with respect to other atoms/selectors)
  default: [
    {
      page: 1,
      searchKey: "",
      brand: "",
      sortBy: 1,
      filtr: false,
    },
  ], // default value (aka initial value)
});
export const appBrandProd = atom({
  key: "appBrandProd", // unique ID (with respect to other atoms/selectors)
  default: [
    {
      page: 1,
      brand: "",
      sortBy: 1,
      filtr: false,
    },
  ], // default value (aka initial value)
});
export const appFeaturedProd = atom({
  key: "appFeaturedProd", // unique ID (with respect to other atoms/selectors)
  default: [
    {
      page: 1,
      sortBy: 1,
      filtr: false,
    },
  ], // default value (aka initial value)
});

export const pageInventoryData = atom({
  key: "pageInventoryData", // unique ID (with respect to other atoms/selectors)
  default: [
    {
      page: 1,
      searchKey: "",
      sortBy: "",
      filtr: false,
    },
  ], // default value (aka initial value)
});
export const pageUserData = atom({
  key: "pageUserData", // unique ID (with respect to other atoms/selectors)
  default: [
    {
      page: 1,
      searchKey: "",
      sortBy: 1,
      filtr: false,
    },
  ], // default value (aka initial value)
});

export const orderPageData = atom({
  key: "orderPageData", // unique ID (with respect to other atoms/selectors)
  default: [
    {
      page: 1,
      searchKey: "",
      sortBy: 1,
      filtr: false,
    },
  ], // default value (aka initial value)
});

export const searchKeyRemove = atom({
  key: "searchkeyRemove", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export const orderFromProducts = atom({
  key: "orderFormProducts", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const orderFormData = atom({
  key: "orderFormData", // unique ID (with respect to other atoms/selectors)
  default: [
    {
      companyName: "",
      account: "",
      fullName: "",
      address: "",
      email: "",
      phoneNumber: "",
      type: "",
      comments: "",
    },
  ], // default value (aka initial value)
});
export const orderPdfData = atom({
  key: "orderPdfData", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
export const approvedData = atom({
  key: "approvedData", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const MultiPdfData = atom({
  key: "MultiPdfData", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});
