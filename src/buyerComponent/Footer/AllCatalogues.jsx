import React, { useEffect, useRef, useState } from "react";
import Navbar from "../Homepage/Navbar";
import Footer from "./Footer";
import $ from "jquery";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import axios from "axios";
import Starlogo from "../../assets/img/logo.png";
import { Link, useNavigate } from "react-router-dom";

const AllCatalogues = () => {
  const allPdf = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getCatalog`;
  // var pages = document.getElementsByClassName("page");
  const navigate = useNavigate();
  const [catalogs, setCatalogs] = useState([]);

  useEffect(() => {
    getCatalogs();
  }, []);

  const getCatalogs = async () => {
    const { data } = await axios.post(allPdf, {
      type: "catalog",
    });
    console.log(data);
    if (!data.error) {
      setCatalogs(data?.results?.catalog);
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
              <h1>Star Importers & Wholesalers</h1>
            </div>
            <nav class="site-navigation">
              <ul class="nav">
                <li>
                  <Link
                    className="text-decoration-none text-dark"
                    to="/app/events/catelog&flyer">
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-decoration-none text-dark"
                    to="/app/events/catelog&flyer/All-Catalogs">
                    Catalogs
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-decoration-none text-dark"
                    to="/app/events/catelog&flyer/All-Flyers">
                    Monthly Flyers
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-decoration-none text-dark"
                    to="/app/about-us">
                    About Us
                  </Link>
                </li>
              </ul>
            </nav>
          </header>
          <div
            className="bg-dark p-5 "
            style={{
              height: "100vh",
            }}>
            <p className="text-white mb-4 fs-5">
              {"CATALOG&FLYERS" + "->" + "Catalogs"}
            </p>

            <div className="row ">
              {catalogs?.map((itm, id) => (
                <div className="col-auto mb-3">
                  <div
                    class="cardR wallet"
                    onClick={() => {
                      navigate("/app/events/catelog&flyer/View", {
                        state: itm?.url,
                      });
                    }}>
                    <div class="overlay"></div>
                    <div class="circle">
                      <img src={require("../../assets/img/iconCata.png")}></img>
                    </div>
                    <p>{itm?.title}</p>
                    {/* <span>{itm?.createdAt?.slice(0,10)}</span> */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AllCatalogues;
