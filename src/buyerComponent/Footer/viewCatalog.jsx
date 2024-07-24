import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Homepage/Navbar";
import Footer from "./Footer";
import $ from "jquery";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import axios from "axios";
import Starlogo from "../../assets/img/logo.png";
import { Link, useLocation } from "react-router-dom";

const ViewCatalog = () => {
  const allPdf = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getCatalog`;
  // var pages = document.getElementsByClassName("page");
  const [allPdfs, setAllPdfs] = useState([]);
  const handle = useFullScreenHandle();
  let location = useLocation();
  useEffect(() => {
    getPdfs();
  }, []);

  const getPdfs = async () => {
    const { data } = await axios.get(allPdf);
    console.log(data);
    if (!data.error) {
      setAllPdfs(data?.results?.catalog);
    }
  };

  return (
    <div>
      <section class="">
        <div className="">
          <header class="site-header shadow">
            <div class="site-identity">
              <Link className="bg-white" to="/app/home">
                <img
                  style={{
                    width: "8rem",
                    height: "4rem",
                  }}
                  src={Starlogo}
                  alt="Site Name"
                />
              </Link>
              {/* <h1>Star Importers & Wholesalers</h1> */}
            </div>
          </header>
          <div className="bg-white cateView">
            <iframe
              src={location?.state}
              width="100%"
              height="90%"
              allowFullScreen></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ViewCatalog;
