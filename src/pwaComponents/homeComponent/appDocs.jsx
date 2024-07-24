import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserProfile } from "../httpServices/homeHttpService/homeHttpService";
import AppFooter from "./appFooter";
import AppHeader from "./appHeader";
import axios from "axios";
import Swal from "sweetalert2";
import { Button } from "rsuite";
import { saveAs } from "file-saver";

function AppDocs() {
  const [detail, setDetail] = useState("");
  const editFiles = `${process.env.REACT_APP_APIENDPOINTNEW}user/reUploadFiles`;
  const [loader, setLoader] = useState(false);
  const [loader2, setLoader2] = useState(false);
  const [loader3, setLoader3] = useState(false);
  const [loader4, setLoader4] = useState(false);
  const [files, setFiles] = useState({
    federalTaxId: "",
    businessLicense: "",
    tobaccoLicence: "",
    salesTaxId: "",
    accountOwnerId: "",
  });

  const onFileSelection = async (e, key) => {
    setFiles({ ...files, [key]: e.target.files[0] });
  };
  useEffect(() => {
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    const { data } = await getUserProfile();
    if (!data.error) {
      setDetail(data.results);
    }
  };

  const editDocs = async (e, file, name) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append(name, file);
    const { data } = await axios.post(editFiles, formData);
    if (!data.error) {
      getUserDetail();
      setLoader(false);
      setLoader2(false);
      setLoader3(false);
      setLoader4(false);
      Swal.fire({
        title: "Document Modified Successfully!",
        icon: "success",
        timer: 1000,
        confirmButtonText: "Okay",
      }).then(() => {
        window.location.reload(false);
      });
    }
  };

  const fileDownload = (url) => {
    let url1 = url;
    let url2 = url1.replace("http", "https");
    saveAs(url2);
  };
  return (
    <>
      <div className="star_imp_app">
        <AppHeader />
        <div className="page-content-wrapper">
          <div className="container">
            <div className="profile-wrapper-area py-3">
              <div className="card user-info-card">
                <div className="card-body p-4 d-flex align-items-center">
                  <div className="user-profile me-3">
                    <img
                      src={
                        detail?.profileImage
                          ? detail?.profileImage
                          : "../assets/img/logo.png"
                      }
                      alt=""
                    />
                  </div>
                  <div className="user-info">
                    <h5 className="mb-0">{detail?.companyName}</h5>
                    <p className="mb-0">All Documents</p>
                  </div>
                </div>
              </div>

              <div className="card user-data-card">
                <div className="card-body ">
                  <div>
                    {detail?.federalTaxId === "" ? (
                      <>
                        <i className="fa-solid fa-edit me-2 edit_pen"></i>
                        <input
                          className="file_selector_app"
                          type="file"
                          name="federalTaxId"
                          id="fileFT"
                          accept="image/jpeg,image/png,application/pdf,image/x-eps"
                          onChange={(e) => onFileSelection(e, "federalTaxId")}
                        />
                      </>
                    ) : null}

                    <div className="single-profile-data d-flex align-items-center justify-content-between bg-light p-3">
                      <div
                        className="title d-flex align-items-center"
                        onClick={() => {
                          fileDownload(detail?.federalTaxId);
                        }}>
                        <i className="fa fa-file"></i>
                        <span>Federal Tax ID</span>
                      </div>
                      <div className="data-content">
                        {detail?.federalTaxId ? (
                          "......." + detail?.federalTaxId?.slice(65)
                        ) : (
                          <small
                            className=" "
                            onClick={() => {
                              document.getElementById("fileFT").click();
                            }}>
                            Re-upload Document
                          </small>
                        )}
                      </div>
                    </div>
                    {files?.federalTaxId?.name ? (
                      <Button
                        loading={loader}
                        appearance="primary"
                        style={{ backgroundColor: "#3e4093" }}
                        className="SaveBtn mt-0"
                        onClick={(e) => {
                          setLoader(true);
                          editDocs(e, files?.federalTaxId, "federalTaxId");
                        }}>
                        Save
                      </Button>
                    ) : null}
                  </div>
                  <div>
                    {detail?.tobaccoLicence === "" ? (
                      <>
                        <i className="fa-solid fa-edit me-2 edit_pen"></i>
                        <input
                          className="file_selector_app"
                          type="file"
                          name="tobaccoLicence"
                          id="fileTL"
                          accept="image/jpeg,image/png,application/pdf,image/x-eps"
                          onChange={(e) => onFileSelection(e, "tobaccoLicence")}
                        />
                      </>
                    ) : null}
                    <div className="single-profile-data d-flex align-items-center justify-content-between bg-light p-3">
                      <div
                        className="title d-flex align-items-center"
                        onClick={() => {
                          fileDownload(detail?.tobaccoLicence);
                        }}>
                        <i className="fa fa-file"></i>
                        <span>Tobacco License ID</span>
                      </div>
                      <div className="data-content">
                        {detail?.tobaccoLicence ? (
                          "......." + detail?.tobaccoLicence?.slice(65)
                        ) : (
                          <small
                            className=" "
                            onClick={() => {
                              document.getElementById("fileTL").click();
                            }}>
                            Re-upload Document
                          </small>
                        )}
                      </div>
                    </div>
                    {files?.tobaccoLicence?.name ? (
                      <Button
                        loading={loader2}
                        appearance="primary"
                        style={{ backgroundColor: "#3e4093" }}
                        className="SaveBtn mt-0"
                        onClick={(e) => {
                          setLoader2(true);
                          editDocs(e, files?.tobaccoLicence, "tobaccoLicence");
                        }}>
                        Save
                      </Button>
                    ) : null}
                  </div>
                  <div>
                    {detail?.salesTaxId === "" ? (
                      <>
                        <i className="fa-solid fa-edit me-2 edit_pen"></i>
                        <input
                          className="file_selector_app"
                          type="file"
                          name="salesTaxId"
                          id="fileST"
                          accept="image/jpeg,image/png,application/pdf,image/x-eps"
                          onChange={(e) => onFileSelection(e, "salesTaxId")}
                        />
                      </>
                    ) : null}
                    <div className="single-profile-data d-flex align-items-center justify-content-between bg-light p-3">
                      <div
                        className="title d-flex align-items-center"
                        onClick={() => {
                          fileDownload(detail?.salesTaxId);
                        }}>
                        <i className="fa fa-file"></i>
                        <span>Sales Tax ID</span>
                      </div>
                      <div className="data-content">
                        {detail?.salesTaxId ? (
                          "......." + detail?.salesTaxId?.slice(65)
                        ) : (
                          <small
                            className=" "
                            onClick={() => {
                              document.getElementById("fileST").click();
                            }}>
                            Re-upload Document
                          </small>
                        )}
                      </div>
                    </div>
                    {files?.salesTaxId?.name ? (
                      <Button
                        loading={loader3}
                        appearance="primary"
                        style={{ backgroundColor: "#3e4093" }}
                        className="SaveBtn mt-0"
                        onClick={(e) => {
                          setLoader3(true);
                          editDocs(e, files?.salesTaxId, "salesTaxId");
                        }}>
                        Save
                      </Button>
                    ) : null}
                  </div>
                  <div>
                    {detail?.businessLicense === "" ? (
                      <>
                        <i className="fa-solid fa-edit me-2 edit_pen"></i>
                        <input
                          className="file_selector_app"
                          type="file"
                          id="fileBL"
                          name="businessLicense"
                          accept="image/jpeg,image/png,application/pdf,image/x-eps"
                          onChange={(e) =>
                            onFileSelection(e, "businessLicense")
                          }
                        />
                      </>
                    ) : null}
                    <div className="single-profile-data d-flex align-items-center justify-content-between bg-light p-3">
                      <div
                        className="title d-flex align-items-center"
                        onClick={() => {
                          fileDownload(detail?.businessLicense);
                        }}>
                        <i className="fa fa-file"></i>
                        <span>Business License ID</span>
                      </div>
                      <div className="data-content">
                        {detail?.businessLicense ? (
                          "......." + detail?.businessLicense?.slice(65)
                        ) : (
                          <small
                            className=" "
                            onClick={() => {
                              document.getElementById("fileBL").click();
                            }}>
                            Re-upload Document
                          </small>
                        )}
                      </div>
                    </div>
                    {files?.businessLicense?.name ? (
                      <Button
                        loading={loader4}
                        appearance="primary"
                        style={{ backgroundColor: "#3e4093" }}
                        className="SaveBtn mt-0"
                        onClick={(e) => {
                          setLoader4(true);
                          editDocs(
                            e,
                            files?.businessLicense,
                            "businessLicense"
                          );
                        }}>
                        Save
                      </Button>
                    ) : null}
                  </div>
                  <div>
                    {detail?.accountOwnerId === "" ? (
                      <>
                        <i className="fa-solid fa-edit me-2 edit_pen"></i>
                        <input
                          className="file_selector_app"
                          type="file"
                          id="fileAc"
                          name="accountOwnerId"
                          accept="image/jpeg,image/png,application/pdf,image/x-eps"
                          onChange={(e) => onFileSelection(e, "accountOwnerId")}
                        />
                      </>
                    ) : null}
                    <div className="single-profile-data d-flex align-items-center justify-content-between bg-light p-3">
                      <div
                        className="title d-flex align-items-center"
                        onClick={() => {
                          fileDownload(detail?.accountOwnerId);
                        }}>
                        <i className="fa fa-file"></i>
                        <span>Account Owner ID</span>
                      </div>
                      <div className="data-content">
                        {detail?.accountOwnerId ? (
                          "......." + detail?.accountOwnerId?.slice(50)
                        ) : (
                          <small
                            className=" "
                            onClick={() => {
                              document.getElementById("fileAc").click();
                            }}>
                            Re-upload Document
                          </small>
                        )}
                      </div>
                    </div>
                    {files?.accountOwnerId?.name ? (
                      <button
                        style={{ backgroundColor: "#3e4093" }}
                        className="SaveBtn mt-0"
                        onClick={(e) => {
                          setLoader4(true);
                          editDocs(e, files?.accountOwnerId, "accountOwnerId");
                        }}>
                        Save
                      </button>
                    ) : null}
                  </div>
                  {/* <div className="edit-profile-btn mt-3">
                    <Link className="comman_btn" to="/app/edit-profile">
                      <i className="fa-solid fa-pen me-2"></i>Edit Profile
                    </Link>
                  </div> */}
                </div>
              </div>
            </div>
          </div>
        </div>
        <AppFooter />
      </div>
    </>
  );
}

export default AppDocs;
