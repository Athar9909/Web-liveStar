import axios from "axios";


axios.defaults.headers.common["x-auth-token-user"] =
  localStorage.getItem("token-user");

//intercept errors while communicating with backend server
axios.interceptors.response.use(null, errorCallBack);