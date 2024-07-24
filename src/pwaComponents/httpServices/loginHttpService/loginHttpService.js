import appHttpService from "../appHttpService";
import { toast } from "react-toastify";

export async function userLogin(formData) {
  try {
    const { data, headers } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/login`,
      formData
    );
    console.log(data, headers);

    if (!data.error) {
      await localStorage.removeItem("token-user");
      await localStorage.setItem("token-user", data.results.token);

      toast.success(data.message);
    } else toast.success(data.message);

    console.log(data.message);
    return { data };
  } catch (error) {
    if (error.response) toast.error(error.response.data.message);
    return { error };
  }
}

export async function userPreLoginPassword(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/login`,
      formData
    );
    console.log(data);

    if (!data.error) {
      // toast.success(data.message);
    } else toast.error(data.message);

    console.log(data.message);
    return { data };
  } catch (error) {
    if (error.response) toast.error(error.response.data.message);
    return { error };
  }
}

export async function userPreLogin(formData) {
  try {
    const { data, headers } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/preLogin`,
      formData
    );

    console.log(data);
    return { data };
  } catch (error) {
    if (error.response) return { error };
  }
}

export async function userRegister(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/register`,
      formData
    );
    console.log(data);

    if (!data.error) {
      toast.success(data.message);
    } else toast.error(data.message);

    console.log(data.message);
    return { data };
  } catch (error) {
    if (error.response) toast.error(error.response.data.message);
    return { error };
  }
}
export async function reSignup(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/reSignup`,
      formData
    );
    console.log(data);

    if (!data.error) {
      toast.success(data.message);
    } else toast.error(data.message);

    console.log(data.message);
    return { data };
  } catch (error) {
    if (error.response) toast.error(error.response.data.message);
    return { error };
  }
}

export async function forgotPassword(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/forgotPassword`,
      formData
    );
    console.log(data);

    if (!data.error) {
      await localStorage.removeItem("token-user");
    } else toast.error(data.message);

    if (!data.error) return { data };
  } catch (error) {
    if (error.response) toast.error(error.response.data.message);
    return { error };
  }
}

export async function verifyOTP(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/verifyOTP`,
      formData
    );
    console.log(data);
    if (!data.error) {
      toast.success(data.message);
    } else toast.error(data.message);

    if (!data.error) return { data };
  } catch (error) {
    if (error.response) toast.error(error.response.data.message);
    return { error };
  }
}

export async function updatePassword(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/updatePassword`,
      formData
    );
    console.log(data);
    if (!data.error) {
      toast.success(data.message);
    } else toast.error(data.message);

    return { data };
  } catch (error) {
    if (error.response) toast.error(error.response.data.message);
    return { error };
  }
}

export async function semiSignup(formData) {
  try {
    const { data } = await appHttpService.post(
      `${process.env.REACT_APP_APIENDPOINT}/user/semiSignup`,
      formData
    );
    console.log(data);

    return { data };
  } catch (error) {
    if (error.response) toast.error(error.response.data.message);
    return { error };
  }
}
