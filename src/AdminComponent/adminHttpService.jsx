import axios from "axios";

axios.defaults.headers.append("Access-Control-Allow-Origin", "*");
axios.defaults.headers.common["x-auth-token-user"] =
  localStorage.getItem("token-user");
axios.interceptors.request.use(async (req) => {
  req.headers["x-auth-token-user"] = await localStorage.getItem("loginToken");
  return req;
});
//intercept errors while communicating with backend server
axios.interceptors.response.use(null, errorCallBack);
