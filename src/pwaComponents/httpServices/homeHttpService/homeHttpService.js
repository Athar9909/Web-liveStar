import appHttpService from "../appHttpService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export async function privacyPolicy(formData) {
  try {
    const { data } = await appHttpService.get(
      `${process.env.REACT_APP_APIENDPOINT}/user/welcome/privacyPolicy`,
      formData
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}

export async function aboutUs(formData) {
  try {
    const { data } = await appHttpService.get(
      `${process.env.REACT_APP_APIENDPOINT}/user/welcome/aboutUs`,
      formData
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}

export async function tAndC(formData) {
  try {
    const { data } = await appHttpService.get(
      `${process.env.REACT_APP_APIENDPOINT}/user/welcome/tAndC`,
      formData
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}

export async function changePassword(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/changePassword`,
      formData
    );
    console.log(data);
    // if (!data.error) {
    //   toast.success(data.message);
    // } else toast.error(data.message);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}

export async function getUserProfile(formData) {
  try {
    const { data } = await appHttpService.get(
      `${process.env.REACT_APP_APIENDPOINT}/user/getUserProfile`,
      formData
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) console.log(error.response.data.message);
    return { error };
  }
}

export async function countProducts() {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/countCartProducts`
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response);
    return { error };
  }
}

export async function getMyCart() {
  try {
    const { data } = await appHttpService.get(
      `${process.env.REACT_APP_APIENDPOINT}user/getMyCart`
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) console.log(error.response.data.message);
    return { error };
  }
}
export async function getQuotes() {
  try {
    const { data } = await appHttpService.get(
      `${process.env.REACT_APP_APIENDPOINT}/user/quotes/getQuotes
      `
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) console.log(error.response.data.message);
    return { error };
  }
}

export async function updateCart(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/modifyCart
      `,
      formData
    );
    console.log(data);
    // if (!data.error) {
    //   // toast.success(data.message);
    // } else toast.error(data.message);

    return { data };
  } catch (error) {
    if (error.response) console.log(error.response.data.message);
    return { error };
  }
}
export async function updateQuote(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/quotes/editQuotes
      `,
      formData
    );
    console.log(data);
    // if (!data.error) {
    //   toast.success(data.message);
    // } else toast.error(data.message);

    return { data };
  } catch (error) {
    if (error.response) console.log(error.response.data.message);
    return { error };
  }
}

export async function deleteCart(id) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/removeProduct`,
      id
    );
    console.log(data);
    // if (!data.error) {
    //   toast.success(data.message);
    // } else toast.error(data.message);

    return { data };
  } catch (error) {
    if (error.response) console.log(error.response.data.message);
    return { error };
  }
}
export async function deleteQuote(id) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/quotes/removeQuoteProducts

      `,
      id
    );
    console.log(data);
    // if (!data.error) {
    //   toast.success(data.message);
    // } else toast.error(data.message);

    return { data };
  } catch (error) {
    if (error.response) console.log(error.response.data.message);
    return { error };
  }
}

export async function editProfile(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/editProfile`,
      formData
    );
    console.log(data);
    if (!data.error) {
      // toast.success(data.message);
    } else
      Swal.fire({
        title: data.message,
        icon: "error",
        button: "ok",
      });

    return { data };
  } catch (error) {
    if (error.response) {
      Swal.fire({
        title: error.response.data.message,
        icon: "error",
        button: "ok",
      });
    }
    return { error };
  }
}

export async function homeBanner() {
  try {
    const { data } = await appHttpService.get(
      `${process.env.REACT_APP_APIENDPOINT}/user/homeBanner/getSlides`
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) console.log(error.response.data.message);
    return { error };
  }
}
export async function getCategory(activePage) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/category/getCategory`,
      {
        page: activePage,
      }
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}
export async function getSubCategory(id) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/category/subCatbyCat`,
      {
        category: id,
      }
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}
export async function getAllProducts(activePage) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/products/getAllProducts`,
      {
        page: activePage,
      }
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}
export async function getFeaturedProd() {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/products/featuredProducts`
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}
export async function getByCategory(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/products/getByCategory
      `,

      formData
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}
export async function getBySubCategory(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/products/getBySubCategory
      `,
      formData
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}
export async function getByBrands(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/products/getByBrands
      `,
      formData
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error?.response) return { error };
  }
}
export async function similarProduct() {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/category/similarProduct`
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}

export async function getBrands(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/brands/getBrands`,formData
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}

export async function getSubCategories() {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/subCategory/getSubCategories`
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}
export async function getProductDetaill(id) {
  try {
    const { data } = await appHttpService.get(
      `${process.env.REACT_APP_APIENDPOINT}/user/product/getProduct/${id}`
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}

export async function addToCart(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/addProducts
      `,
      formData
    );
    console.log(data);
    
    return { data };
  } catch (error) {
    if (error.response) console.log(error.response.data.message);
    Swal.fire({
      title: "Please Login To Continue",
      icon: "error",
      button: "ok",
    }).then((res) => {
      window.location.replace("/app/login");
    });
    return { error };
  }
}
export async function addToQuote(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/quotes/addQuote
      `,
      formData
    );
    console.log(data);
    // if (!data.error) {
    //   toast.success(data.message);
    // } else toast.error(data.message);

    return { data };
  } catch (error) {
    if (error.response) console.log(error.response.data.message);
    return { error };
  }
}
export async function homeSearch(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/homeSearch
      `,
      formData
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}

export async function searchByBarcode(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/searchByBarcode
      `,
      formData
    );
    // if (!data.error) {
    //   Swal.fire({
    //     title: "Product Added to Cart.",
    //     icon: "success",
    //     confirmButtonText: "Okay",
    //   });
    // }
    console.log(data);
    if (data.error) {
      Swal.fire({
        title: data?.message,
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
    return { data };
  } catch (error) {
    if (error.response)
      Swal.fire({
        title: error.response.data.message,
        icon: "warning",
        confirmButtonText: "Okay",
      });
    console.log();
    return { error };
  }
}
