import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import {
  appBrandProd,
  appCateProd,
  appFeaturedProd,
  appSubProd,
} from "../../atom";

function AppFooter() {
  let navigate = useNavigate();
  let token = localStorage.getItem("token-user");
  const setData = useSetRecoilState(appCateProd);
  const setData2 = useSetRecoilState(appSubProd);
  const setData3 = useSetRecoilState(appBrandProd);
  const setData4 = useSetRecoilState(appFeaturedProd);

  return (
    <>
      <div className="star_imp_app">
        <div className="footer-nav-area w-100" id="footerNav">
          <div className="suha-footer-nav">
            <ul className="h-100 d-flex align-items-center justify-content-between ps-0 d-flex rtl-flex-d-row-r">
              <li>
                <Link
                  onClick={() => {
                  
                    navigate(-1);
                  }}>
                  <i class="fa-solid fa-arrow-left"></i>
                </Link>
              </li>
              <li>
                <Link
                  to={token ? "/app/cart" : "/app/login"}
                  onClick={() => {
                    setData([{ page: 1, sortBy: 1 }]);
                    setData2([{ page: 1, sortBy: 1 }]);
                    setData3([{ page: 1, sortBy: 1 }]);
                    setData4([{ page: 1, sortBy: 1 }]);
                  }}>
                  <i className="fa-solid fa-bag-shopping"></i>
                </Link>
              </li>
              <li>
                <Link
                  to={token ? "/app/settings" : "/app/login"}
                  onClick={() => {
                    setData([{ page: 1, sortBy: 1 }]);
                    setData2([{ page: 1, sortBy: 1 }]);
                    setData3([{ page: 1, sortBy: 1 }]);
                    setData4([{ page: 1, sortBy: 1 }]);
                  }}>
                  <i className="fa-solid fa-gear"></i>
                </Link>
              </li>
            </ul>
          </div>
        </div>{" "}
      </div>
    </>
  );
}

export default AppFooter;
