import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { getUserProfile } from "../httpServices/homeHttpService/homeHttpService";
function AppLogout() {
  const navigate = useNavigate();
  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    const { data } = await getUserProfile();
    if (!data?.error) {
      await logout();
      if (window.flutter_inappwebview)
        window.flutter_inappwebview.callHandler("logout", data.results.email);
    }
  };
  const logout = async () => {
    if (await localStorage.getItem("token-user")) {
      await localStorage.removeItem("token-user");
      await localStorage.removeItem("device");
    }
    navigate("/app/login");
  };

  return null;
}

export default AppLogout;
