import React, { useRef, useState } from "react";
import Navbar from "../Homepage/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import Lightbox from "yet-another-react-lightbox";
import { useEffect } from "react";
import Footer from "./Footer";
import "yet-another-react-lightbox/styles.css";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/plugins/thumbnails.css";
const Photos = () => {
  const galleries = `${process.env.REACT_APP_APIENDPOINTNEW}user/getGallery`;
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [gallery, setGallery] = useState([]);
  let id = useParams();
  const [slide, setSlide] = useState([]);
  const [videoSlide, setVideoSlide] = useState([]);
  const [preload, setPreload] = React.useState("");

  useEffect(() => {
    getPhotos();
  }, []);

  const getPhotos = async () => {
    const { data } = await axios.post(galleries + "/" + id?.id);
    console.log(data);
    setGallery(data?.results?.gallery);
  };

  const getSlides = (img) => {
    console.log(img);
    let Slide = [];
    if (img) {
      Slide?.unshift({ src: img });
    }
    (gallery?.images || [])?.map((item) => {
      if (item) {
        Slide?.push({ src: item });
      }
    });
    setSlide(Slide);
    console.log(slide);
    setOpen(true);
  };

  const getVideoSlides = (vid) => {
    console.log("okauuuuuuuuuuuuuuuuuuuuuuuuu");
    let slide = [];
    if (vid) {
      slide?.unshift({
        type: "video",
        width: 1280,
        height: 720,
        poster: "",
        sources: [{ src: vid, width: 1200, height: 800, type: "video/mp4" }],
      });
    }
      (gallery?.videos || [])?.map((item) => {
        slide?.push({
          type: "video",
          width: 1280,
          height: 720,
          poster: "",
          sources: [{ src: item, width: 1200, height: 800, type: "video/mp4" }],
        });
      });
    setVideoSlide(slide);
    setOpen2(true)
  };

  return (
    <div>
      <Navbar />
      <section class="photos px-5">
        <div className="">
          <div className="mt-2">
            <div class="nine">
              <h1>
                {gallery?.title}
                <span>All Collection</span>
              </h1>
            </div>
          </div>

          <nav>
            <div
              className="nav nav-tabs justify-content-center"
              id="nav-tab"
              role="tablist">
              <button
                className="nav-link active"
                id="nav-home-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-home"
                type="button"
                role="tab"
                aria-controls="nav-home"
                aria-selected="true"
                // onClick={() => {
                //   document.getElementById("Search").value = "";
                //   getCategories();
                // }}
              >
                Images
              </button>
              <button
                className="nav-link"
                id="nav-profile-tab"
                data-bs-toggle="tab"
                data-bs-target="#nav-profile"
                type="button"
                role="tab"
                aria-controls="nav-profile"
                aria-selected="false"
                // onClick={() => {
                //   document.getElementById("Search").value = "";
                //   getSubCategories();
                // }}
              >
                Videos
              </button>
            </div>
          </nav>

          <div className="tab-content recent_orders_cate" id="nav-tabContent">
            <div
              className="tab-pane fade show active"
              id="nav-home"
              role="tabpanel"
              aria-labelledby="nav-home-tab">
              <div className="row  mt-1 mb-4   comman_divvision">
                {(gallery?.images || [])?.map((item, ind) => (
                  <div class="col-xl-3 col-sm-6 col-md-3 ">
                    <a>
                      <img
                        onClick={() => {
                          getSlides(item);
                          // setOpen(true);
                        }}
                        className="photo_gallery"
                        src={item}
                      />
                    </a>
                  </div>
                ))}
              </div>
            </div>
            <div
              className="tab-pane fade show "
              id="nav-profile"
              role="tabpanel"
              aria-labelledby="nav-profile-tab">
              <div className="row  mt-1   comman_divvision">
                {(gallery?.videos || [])?.map((item, ind) => (
                  <div class="col-xl-4 col-sm-6 col-md-4 p-0">
                    <video
                      onClick={() => {
                        getVideoSlides(item);
                        // setOpen2(true);
                      }}
                      className="gallery_uploads_web"
                      autoPlay
                      loop
                      muted
                      allowfullscreen="">
                      {console.log(item, "vido")}
                      <source
                        src={
                          item ? item : require("../../assets/img/no-data.gif")
                        }
                      />
                    </video>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <Lightbox open={open} close={() => setOpen(false)} slides={slide} />
      <Lightbox
        open={open2}
        close={() => setOpen2(false)}
        slides={videoSlide}
        plugins={[Video]}
        video={{
          controls: true,
          autoPlay: true,
          loop: true,
          preload,
        }}
      />
    </div>
  );
};

export default Photos;
