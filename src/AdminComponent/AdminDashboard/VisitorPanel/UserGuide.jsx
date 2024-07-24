import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../../../assets/css/adminMain.css";

import axios from "axios";
import { useEffect } from "react";
import ProfileBar from "../ProfileBar";
import Swal from "sweetalert2";
import moment from "moment";
import Compressor from "compressorjs";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";
import { Button } from "rsuite";
import Video from "yet-another-react-lightbox/plugins/video";
import "yet-another-react-lightbox/plugins/thumbnails.css";

const UserGuide = () => {
  const [steps, setSteps] = useState("");
  const [fileType, setFiletype] = useState("videos");
  const [content, setContent] = useState([]);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [videoSlide, setVideoSlide] = useState();
  const addCollection = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/addContent`;
  const allCollection = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/getContent`;
  const editCollection = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/editCollection`;
  const viewCollection = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/gallery`;
  const status = `${process.env.REACT_APP_APIENDPOINTNEW}api/admin/galleryStatus/`;
  const [preload, setPreload] = React.useState("");
  const [loader, setLoader] = useState(false);
  const [allVideos, setAllVideos] = useState();
  const [pdf, setPdf] = useState([]);
  const [files, setFiles] = useState([]);
  const [video, setVideo] = useState([]);
  const [multipleFiles, setMultipleFiles] = useState([]);
  const [title, setTitle] = useState("");
  const [galleries, setGalleries] = useState([]);
  const [slide, setSlide] = useState([]);
  const [editGalleryData, setEditGalleryData] = useState([]);
  const [editGalleryName, setEditGalleryName] = useState("");
  const [images, setImages] = useState();
  const [id, setId] = useState();
  useEffect(() => {
    getCollection();
  }, []);

  console.log(fileType, files);
  const addGallery = async (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("title", title);
    formData.append("instructions", steps);
    formData.append(
      "type",
      (fileType === "images" && "IMAGE") ||
        (fileType === "videos" && "VIDEO") ||
        (fileType === "pdf" && "PDF")
    );
    formData.append(
      "content",
      (fileType === "images" && files?.image) ||
        (fileType === "videos" && video?.video) ||
        (fileType === "pdf" && files?.pdf)
    );

    // multipleFiles?.dataImg?.map((item) => {
    //   formData.append("images", item?.images);
    // });


    await axios.post(addCollection, formData).then((res) => {
      getCollection();
      setTitle("");
      if (!res.data.error) {
        document.getElementById("resetCatss").click();
        setFiles([]);
        setMultipleFiles([]);
        Swal.fire({
          title: "New Content Added!",
          icon: "success",
          confirmButtonText: "Okay",
        });
      } else {
        Swal.fire({
          title: res?.data.message,
          text: "Please fill all fields with valid Data.",
          icon: "error",
          timer: 2000,
          confirmButtonText: "Okay",
        });
      }
    });
  };

  const saveCollection = async (e) => {
    e.preventDefault();
    setLoader(true);
    // if(editGalleryName != "" || )
    let formData = new FormData();
    formData.append("title", editGalleryName);
    formData.append("coverImage", files?.editCoverImage);
    formData.append("videos", video?.videoEdit);
    multipleFiles?.dataImg?.map((item) => {
      formData.append("images", item?.gallery_images);
    });
    await axios.post(editCollection + "/" + id, formData).then((res) => {
      getCollection();
      document.getElementById("gallery_cat").click();
      if (!res.data.error) {
        Swal.fire({
          title: "Gallery Modified Successfully!",
          icon: "success",
          confirmButtonText: "Okay",
        });
        setFiles();
        setVideo();
        setLoader(false);
        onEditGallery(id);
        // window.location.reload(false);
      } else {
        Swal.fire({
          title: "Enter Valid Details!",
          icon: "error",
          confirmButtonText: "Okay",
        });
        setLoader(false);
      }
    });
  };

  const deleteImage = async (i, img, key) => {
    console.log(img, "delete");
    // images?.splice(i, 1);
    let formData = new FormData();
    formData.append(key, img);
    formData.append("removeVideo", true);
    await axios.post(editCollection + "/" + id, formData).then((res) => {
      console.log(res);
    });
    onEditGallery(id);
  };

  const onEditGallery = async (id) => {
    setId(id);
    const { data } = await axios.get(viewCollection + "/" + id);
    if (!data.error) {
      setEditGalleryData(data?.results?.gallery);
      setImages(data?.results?.gallery?.images);
      setAllVideos(data?.results?.gallery?.videos);
    }
  };

  const getCollection = async () => {
    const { data } = await axios.get(allCollection);
    console.log(data);
    if (!data.error) {
      setContent(data?.results.help);
    }
  };

  // instant image preview //

  document.getElementById("image_up")?.addEventListener("change", function () {
    if (this.files[0]) {
      var picture = new FileReader();
      picture.readAsDataURL(this.files[0]);
      picture.addEventListener("load", function (event) {
        document
          .getElementById("image")
          .setAttribute("src", event.target.result);
      });
    }
  });

  const onFileSelection = (e, key) => {
    let image = e.target.files[0];
    setFiles({ ...files, [key]: image });

    // new Compressor(image, {
    //   success: (compressed) => {
    //     setFiles({ ...files, [key]: compressed });
    //   },
    // });
  };

  const onFileSelectionVideo = (e, key) => {
    let video = e.target.files[0];
    setVideo({ ...video, [key]: video });
  };

  console.log(video, "vieo");

  const onFileSelection2 = (e, key) => {
    let image = [e.target.files];
    let dataImg = [];
    (image || [])?.map((item) => {
      Object.values(item)?.map((img) => {
        new Compressor(img, {
          success: (compressed) => {
            dataImg.push({ [key]: compressed });
          },
        });
      });
    });
    setMultipleFiles({ dataImg });
  };

  const getSlides = (img) => {
    let Slide = [];

    Slide?.push({ src: img });

    setSlide(Slide);
    setOpen(true);
  };

  const getVideoSlides = (vid) => {
    console.log("okauuuuuuuuuuuuuuuuuuuuuuuuu");
    let slide = [];
    slide?.push({
      type: "video",
      width: 1280,
      height: 720,
      poster: "",
      sources: [{ src: vid, width: 1200, height: 800, type: "video/mp4" }],
    });
    setVideoSlide(slide);
    setOpen2(true);
  };

  const GalleryStatus = async (id) => {
    await axios.post(status + id).then((res) => {
      if (!res?.data.error) {
        Swal.fire({
          title: res?.data.message,
          icon: "success",
          confirmButtonText: "Okay",
        });
      }
    });
  };

  console.log(files, multipleFiles, "ijj");

  const handleClick = () => {
    localStorage.removeItem("AdminData");
    localStorage.removeItem("AdminLogToken");
    localStorage.removeItem("AdminEmail");
  };

  return (
    <div>
      <div className="">
        <div className="">
          <div className="row justify-content-center">
            <div className="col-12">
              <div className="row mx-0 mb-2">
                <div className="col-12 design_outter_comman  shadow">
                  <div className="row">
                    <div className="col-12 user-management-tabs px-0">
                      <div className="">
                        <div
                          className="tab-pane fade show active"
                          id="nav-home"
                          role="tabpanel"
                          aria-labelledby="nav-home-tab">
                          <div className="row mx-0 ">
                            <div className="col-12">
                              <form
                                className="form-design py-4 px-3 help-support-form row align-items-end justify-content-between"
                                action="">
                                <div className="form-group mb-4 col-4">
                                  <label htmlFor="">Title/Question</label>
                                  <input
                                    type="text"
                                    className="form-control"
                                    name="Title"
                                    onChange={(e) => {
                                      setTitle(e.target.value);
                                    }}
                                  />
                                </div>
                                <div className="form-group mb-4 col-8">
                                  <label htmlFor="">Instruction/Steps</label>
                                  <textarea
                                    style={{
                                      height: "8rem",
                                    }}
                                    type="text"
                                    className="form-control"
                                    name="Step"
                                    onChange={(e) => {
                                      setSteps(e.target.value);
                                    }}
                                  />
                                </div>

                                <div className="form-group mb-4 col-6">
                                  <label className="mb-2">
                                    Please Select One Type of File.
                                  </label>
                                  <select
                                    type="select"
                                    className="form-control shadow-none"
                                    name="selectFile"
                                    onChange={(e) =>
                                      setFiletype(e.target.value)
                                    }>
                                    <option selected value="videos">
                                      Videos
                                    </option>
                                    <option value="pdf">PDF</option>
                                    <option value="images">Images</option>
                                  </select>
                                </div>

                                {(fileType === "images" && (
                                  <div className="form-group mb-4 col-6 choose_fileAdmin position-relative">
                                    {" "}
                                    <span class="form-check d-flex">
                                      Upload Image
                                      {/* </label> */}
                                    </span>
                                    <label
                                      htmlFor="uploadImage"
                                      className="mt-1">
                                      <i class="fa fa-camera me-1"></i>
                                      Choose File
                                    </label>{" "}
                                    <input
                                      type="file"
                                      className="form-control shadow-none"
                                      defaultValue=""
                                      id="uploadImage"
                                      accept="image/*"
                                      name="image"
                                      onChange={(e) =>
                                        onFileSelection(e, "image")
                                      }
                                    />
                                  </div>
                                )) ||
                                  (fileType === "pdf" && (
                                    <div className="form-group mb-4 col-6 choose_fileAdmin position-relative">
                                      {" "}
                                      <span class="form-check d-flex">
                                        Upload Pdf
                                      </span>
                                      <label
                                        htmlFor="uploadPdf"
                                        className="mt-1">
                                        <i class="fa fa-camera me-1"></i>
                                        Choose File
                                      </label>{" "}
                                      <input
                                        type="file"
                                        className="form-control shadow-none"
                                        defaultValue=""
                                        id="uploadPdf"
                                        accept="pdf/*"
                                        name="pdf"
                                        onChange={(e) =>
                                          onFileSelection(e, "pdf")
                                        }
                                      />
                                    </div>
                                  )) ||
                                  (fileType === "videos" && (
                                    <div className="form-group  col-6 choose_fileAdmin position-relative">
                                      {" "}
                                      <span
                                        class="form-check
                                      ">
                                        Upload a Video
                                        {/* </label> */}
                                      </span>
                                      <label
                                        htmlFor="uploadVideo"
                                        className="mt-1">
                                        <i class="fa fa-camera me-1"></i>
                                        Choose File
                                      </label>{" "}
                                      <input
                                        type="file"
                                        className="form-control shadow-none"
                                        defaultValue=""
                                        id="uploadVideo"
                                        accept="video/*"
                                        name="video"
                                        onChange={(e) =>
                                          onFileSelectionVideo(e, "video")
                                        }
                                      />
                                    </div>
                                  ))}

                                <div className="form-group mb-0 col-12 text-center mt-4">
                                  <button
                                    className="comman_btn2"
                                    onClick={addGallery}>
                                    Add New
                                  </button>
                                  <button
                                    className="comman_btn d-none"
                                    id="resetCatss"
                                    type="reset">
                                    Reset
                                  </button>
                                </div>
                              </form>

                              <div className="row ">
                                <div className="col-12 comman_table_design px-0">
                                  <div className="table-responsive border">
                                    <table className="table mb-0">
                                      <thead>
                                        <tr
                                          style={{
                                            backgroundColor: "#f2f2f2",
                                          }}>
                                          <th>Date</th>
                                          <th>Title/Question</th>
                                          <th>File</th>
                                          <th>Status</th>
                                          <th>Action</th>
                                        </tr>
                                      </thead>
                                      <tbody className="recent_orders_cate">
                                        {content?.map((item, index) => (
                                          <tr>
                                            <td className="border">
                                              {" "}
                                              {moment(item?.createdAt).format(
                                                "MM/DD/YYYY"
                                              )}
                                            </td>
                                            <td className="border">
                                              {item?.title}
                                            </td>

                                            {item?.type === "IMAGE" ||
                                            item?.type === "VIDEO" ? (
                                              <td className="border">
                                                <img
                                                  onClick={() =>
                                                    (item?.type === "IMAGE" &&
                                                      getSlides(
                                                        item?.content
                                                      )) ||
                                                    (item?.type === "VIDEO" &&
                                                      getVideoSlides(
                                                        item?.content
                                                      ))
                                                  }
                                                  className="previewImages"
                                                  src={require("../../../assets/img/preview2.png")}></img>
                                                <br />
                                                <small>CLick to preview</small>
                                              </td>
                                            ) : (
                                              <td className="border">
                                                <i
                                                  class="fa fa-download"
                                                  aria-hidden="true"></i>
                                              </td>
                                            )}
                                            <td className="border">
                                              {" "}
                                              <div className="" key={item?._id}>
                                                <label class="switchUser">
                                                  <input
                                                    type="checkbox"
                                                    id={item?._id}
                                                    defaultChecked={
                                                      item?.status
                                                    }
                                                    onClick={() => {
                                                      GalleryStatus(item?._id);
                                                    }}
                                                  />
                                                  <span class="sliderUser round"></span>
                                                </label>
                                              </div>
                                            </td>

                                            <td className="border">
                                              <a
                                                data-bs-toggle="modal"
                                                data-bs-target="#staticBackdrop"
                                                className="comman_btn2   text-white text-decoration-none"
                                                style={{
                                                  backgroundColor: "#eb3237",
                                                  fontSize: "22px",
                                                  position: "relative",
                                                  top: "-2px",
                                                }}
                                                key={index}
                                                onClick={() => {
                                                  onEditGallery(item?._id);
                                                }}>
                                                Edit
                                              </a>
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <>
        <div
          className="modal fade comman_modal"
          id="staticBackdrop"
          data-bs-backdrop="static"
          data-bs-keyboard="false"
          tabIndex={-1}
          aria-labelledby="staticBackdropLabel"
          aria-hidden="true">
          <div className="modal-dialog modal-dialog-centered modal-xl ">
            <div className="modal-content border-0">
              <div className="modal-header">
                <h5 className="modal-title" id="staticBackdropLabel">
                  Edit Gallery
                </h5>
                <Button
                  appearance="primary"
                  loading={loader}
                  style={{
                    backgroundColor: "#eb3237",
                    fontSize: "20px",
                    position: "relative",
                    top: "-2px",
                  }}
                  className="comman_btn mx-4"
                  onClick={saveCollection}>
                  Save
                </Button>

                <button
                  type="button"
                  className="btn-close"
                  data-bs-dismiss="modal"
                  id="Modal_gallery"
                  aria-label="Close"
                  onClick={() => {
                    document.getElementById("gallery_cat").click();
                  }}
                />
              </div>

              <div className="modal-body shadow">
                <form
                  className="form-design px-2 py-2 help-support-form  row  justify-content-center"
                  action="">
                  <div
                    className="form-group col-2 mt-2"
                    key={editGalleryData?.title}>
                    <label htmlFor="">Title</label>
                    <input
                      type="text"
                      defaultValue={editGalleryData?.title}
                      className="form-control"
                      onChange={(e) => {
                        setEditGalleryName(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group mb-0 col choose_fileAdmin position-relative mt-2">
                    <span>Add Gallery Images</span>{" "}
                    <label htmlFor="uploadImg">
                      <i class="fa fa-camera me-1"></i>
                      Choose File
                    </label>{" "}
                    <input
                      type="file"
                      className="form-control shadow-none"
                      defaultValue=""
                      id="uploadImg"
                      accept="image/*"
                      name="gallery_images"
                      onChange={(e) => onFileSelection2(e, "gallery_images")}
                      multiple
                    />
                  </div>

                  <div className="form-group mb-0 col choose_fileAdmin position-relative mt-2">
                    <span>Add Url</span>{" "}
                    <label htmlFor="upload_videoEdit">
                      <i class="fa fa-camera me-1"></i>
                      Choose File
                    </label>
                    <input
                      type="file"
                      className="form-control shadow-none"
                      defaultValue=""
                      id="upload_videoEdit"
                      accept="video/*"
                      name="videoEdit"
                      onChange={(e) => onFileSelectionVideo(e, "videoEdit")}
                    />
                  </div>
                  <div className="form-group col-4 p-2 ">
                    <label htmlFor="" className="mx-3">
                      Cover Image
                    </label>
                    <div className="border pb-5 rounded">
                      <div className="account_profile position-relative">
                        <div className="circle">
                          <img
                            className="profile-pic subCatImages2"
                            id="image"
                            src={
                              editGalleryData?.coverImage
                                ? editGalleryData?.coverImage
                                : require("../../../assets/img/product.jpg")
                            }
                          />
                        </div>
                        <div className="p-image">
                          <i className="uploadFile fa fa-camera" />
                          <input
                            className="file-uploads"
                            type="file"
                            id="image_up"
                            accept="image/*"
                            name="editCoverImage"
                            onChange={(e) =>
                              onFileSelection(e, "editCoverImage")
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <nav>
                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                      <button
                        className="nav-link active"
                        id="SlideImg-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#SlideImg"
                        type="button"
                        role="tab"
                        aria-controls="SlideImg"
                        aria-selected="false">
                        All Images
                      </button>
                      <button
                        className="nav-link "
                        id="SlideVid-tab"
                        data-bs-toggle="tab"
                        data-bs-target="#SlideVid"
                        type="button"
                        role="tab"
                        aria-controls="SlideVid"
                        aria-selected="false">
                        All Videos
                      </button>
                    </div>
                  </nav>
                  <div
                    className="tab-content recent_orders_cate"
                    id="nav-tabContent">
                    <div
                      className="tab-pane fade show  active"
                      id="SlideImg"
                      role="tabpanel"
                      aria-labelledby="SlideImg-tab">
                      <div className="row align-items-start px-0 p-2 border rounded edit_galllery p-3">
                        {images?.map((item, ind) => (
                          <div className="col-3 mb-3" key={ind}>
                            <div className="image_box">
                              <i
                                className="fas fa-close closeIcon"
                                onClick={() =>
                                  deleteImage(ind, item, "imageKey")
                                }></i>
                              <img
                                className="gallery_uploads"
                                src={
                                  item
                                    ? item
                                    : require("../../../assets/img/product.jpg")
                                }
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div
                      className="tab-pane fade  show"
                      id="SlideVid"
                      role="tabpanel"
                      aria-labelledby="SlideVid-tab">
                      <div className="row align-items-start px-0 p-2 border rounded edit_galllery">
                        {allVideos?.map((item, ind) => (
                          <div className="col-3 mb-3" key={ind}>
                            <div className="image_box">
                              <i
                                className="fas fa-close closeIcon"
                                onClick={() =>
                                  deleteImage(ind, item, "videoKey")
                                }></i>
                              <video
                                id="frameOne"
                                className="gallery_uploads"
                                autoPlay
                                loop
                                muted
                                allowfullscreen="">
                                <source
                                  src={
                                    item
                                      ? item
                                      : require("../../../assets/img/product.jpg")
                                  }
                                />
                              </video>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-0 col-auto mt-3">
                    <button
                      className="comman_btn d-none"
                      type="reset"
                      id="gallery_cat">
                      reset
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
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

export default UserGuide;
