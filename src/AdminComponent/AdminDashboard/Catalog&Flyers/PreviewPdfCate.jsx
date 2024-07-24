import React, { useEffect, useState } from "react";import logo from "../../../assets/img/star_logo.png";
import print from "../../../assets/img/printer-line.svg";
import leftLine from "../../../assets/img/skip-left-line.svg";
import bookmark from "../../../assets/img/bookmark-3-line.svg";
import down from "../../../assets/img/file-download-line.svg";
import full from "../../../assets/img/fullscreen-exit-line.svg";
import rightLine from "../../../assets/img/skip-right-line.svg";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "../../../assets/css/flip.css";
import { FullScreen, useFullScreenHandle } from "react-full-screen";

const PreviewPdfCate = () => {
  const getTemp = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/viewTemplate/`;
  const [flipKey, setFlipKey] = useState(Math.random());
  const [zoom, setZoom] = useState(1); // Initial zoom level
  let { id } = useParams();
  const [templatePreview, setTemplatePreview] = useState([]);
  const [pageS, setPageS] = useState(0);
  axios.defaults.headers.common["x-auth-token-admin"] =
    localStorage.getItem("AdminLogToken");
  const [downloadLink, setDownloadLink] = useState();
  const navigate = useNavigate();
  useEffect(() => {
    GetTemplates();
  }, []);
  console.log(pageS, "ola");

  var pages = document.getElementsByClassName("page");

  const GetTemplates = async () => {
    await axios.get(getTemp + id).then((res) => {
      let data = res?.data.results?.catalog?.pages;
      setDownloadLink(data[0]?.pdfFilePath);
      setTemplatePreview(data);
      setFlipKey(Math.random());

      for (var i = 0; i < pages.length; i++) {
        var page = pages[i];
        if (i % 2 === 0) {
          page.style.zIndex = pages.length - i;
        }
      }

      for (var i = 0; i < pages.length; i++) {
        pages[i].pageNum = i + 1;
        console.log(pages[i], "ll");

        pages[i].onclick = function () {
          if (this.pageNum % 2 === 0) {
            setPageS(this.pageNum);
            this.classList.remove("flipped");
            this.previousElementSibling.classList.remove("flipped");
          } else {
            console.log(this.pageNum, "okayN");
            this.classList.add("flipped");
            this.nextElementSibling.classList.add("flipped");
          }
        };
      }
    });
  };

  const handleNext = () => {
    document.getElementById(pageS).click();
    setPageS(pageS + 2);
  };

  const handlePrev = () => {
    document.getElementById(pageS - 1).click();
    setPageS(pageS - 2);
  };

  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom * 1.4); // Increase zoom level by 20%
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => (prevZoom > 0.2 ? prevZoom * 0.8 : prevZoom)); // Decrease zoom level by 20%, with a minimum of 20%
  };
  let handle = useFullScreenHandle();

  return (
    <div key={flipKey}>
      <div className="star_catalog bg-white">
        <div className="star_header border-bottom">
          <div className="row align-items-center">
            <div className="col-lg-2 col-md-auto">
              <div className="star_logo">
                <img src={logo} alt="" />
              </div>
              <button onClick={() => handleZoomIn()}>
                <i class="icon-zoom-in"></i>{" "}
              </button>
              <button onClick={() => handleZoomOut()}>
                <i class="icon-zoom-in"></i>{" "}
              </button>
            </div>
            <div className="col">
              <div className="star_catalog_menus">
                <div className="catalog_menus_inner">
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Print"
                    href={downloadLink}
                    className="meeenus"
                    download
                    target="_blank"
                  >
                    <img src={print} alt="" />
                  </a>
                </div>
                <div className="catalog_pagination">
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Click this button to view this previous page"
                    onClick={() => handlePrev()}
                  >
                    <img src={leftLine} alt="" />
                  </a>
                  <div className="form-group mt-3" key={pageS}>
                    <input
                      className="form-control"
                      type="text"
                      value={`${pageS}-${pageS + 1}`}
                      disabled
                    />
                  </div>
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    onClick={() => handleNext()}
                    title="Click this button to view this Next page"
                  >
                    <img src={rightLine} alt="" />
                  </a>
                </div>
                <div className="catalog_menus_inner">
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Full Screen"
                    className="meeenus"
                    onClick={handle.enter}
                  >
                    <img src={full} alt="" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-auto">
              <div className="full_screen text-end"></div>
            </div>
          </div>
        </div>

        <div className="star_catalog bg-white">
          <FullScreen handle={handle}>
            <div className="star_catalog_inner position-relative">
              <div className="book ">
                <div id="pages" className="pages">
                  {templatePreview?.map((item, index) => (
                    <>
                      <div className="page shadow" key={index}>
                        {item?.pageURL?.length > 0 && (
                          <a
                            href={item?.pageURL}
                            target="_blank"
                            id="click-me"
                            className="shadow"
                          >
                            Click
                            <i class="fa-solid fa-hand-pointer"></i>
                          </a>
                        )}
                        <button id={index} className="d-none">
                          <img className="rightLine" src={rightLine} alt="" />
                        </button>

                        <div className="first_page">
                          <img
                            className="bg_img"
                            src={item?.backgroundImage}
                            alt=""
                          />

                          {/* <img className="qr_img" src={item?.qrImage} alt="" /> */}
                        </div>
                      </div>
                    </>
                  ))}

                  <div className="page shadow bg-white"></div>
                </div>
              </div>
              <div>
                <a className="arrow_btn  next_btn" onClick={() => handleNext()}>
                  <img src={rightLine} alt="" />
                </a>
                <a className=" arrow_btn prev_btn" onClick={() => handlePrev()}>
                  <img src={leftLine} alt="" />
                </a>
              </div>
            </div>
          </FullScreen>
        </div>
      </div>
    </div>
  );
};

export default PreviewPdfCate;
