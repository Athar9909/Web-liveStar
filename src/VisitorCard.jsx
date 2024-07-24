import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const VisitorCard = () => {
  let aoi = `${process.env.REACT_APP_APIENDPOINT}api/visitor/viewAgent/`;
  const [user, setUser] = useState([]);
  let { id } = useParams();
  
  useEffect(() => {
    scanQr();
  }, []);

  const scanQr = async () => {
    const { data, error } = await axios.post(aoi+id);
    console.log(data);
    if (!error) {
      if (data) {
        setUser(data?.results?.agent);
      } else {
        console.log("Data is undefined.");
      }
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-5">
        <div className="row comman_design mx-0">
          <div className="col-12">
            <div className="qr_imgs  ">
              {/* <img src="assets/img/letter.png" alt="" /> */}
              <div className="d-flex justify-content-center">
                <div
                  style={{
                    borderRadius: "12px",
                    width: "65%",
                    border: "1px solid #3e4093",
                    position: "relative",
                    top: "-20px",
                  }}
                  className=" h-100 px-2 py-1 bg-white shadow"
                  id="qrDiv"
                >
                  <div className="text-center mt-4">
                    <div>
                      <img
                        className=""
                        onClick={() =>
                          (window.location.href =
                            "https://www.starimporters.com/")
                        }
                        src="/imgs/logo1.png"
                        alt="Company Logo"
                        style={{
                          width: "clamp(80px, 50%, 200px)",
                        }}
                      />
                    </div>
                  </div>
                  <div
                    className=" py-1 px-3 mt-4"
                    style={{ borderRadius: "20px" }}
                  >
                    <div className="row mt-3">
                      <div className="col-6 mb-3">
                        <img
                          className=""
                          id="proImage"
                          src={
                            user?.image?.length > 5
                              ? user?.image
                              : "/imgs/profileDummy.png"
                          }
                          style={{
                            width: "clamp(60px, 50%, 120px)",
                            borderRadius: "12px",
                            maxWidth: "100px",
                            maxHeight: "100px",
                            borderRadius: "80px",
                          }}
                        />
                        <h1 className="comman_heads mt-1">{user?.firstName}</h1>
                      </div>
                      <div className="col-6 text-end mb-3 align-end">
                        <label className="text-danger fw-bold">Status</label>
                        <h1 className="comman_heads">
                          {user?.status ? "Active" : "In-active"}
                        </h1>
                      </div>

                      <div className="col-6 text-start mb-3">
                        <label className="text-danger fw-bold">
                          COMPANY NAME
                        </label>
                        <h1 className="comman_heads">
                          {user?.user?.companyName}
                        </h1>
                      </div>

                      <div className="col-6 text-end mb-3">
                        <label className="text-danger fw-bold">
                          ACCOUNT NUMBER
                        </label>
                        <h1 className="comman_heads">
                          {user?.user?.accountNumber ?? "Not Added"}
                        </h1>
                      </div>

                      <div className="col-6 text-start mb-3">
                        <label className="text-danger fw-bold">
                          MEMBER'S NAME
                        </label>
                        <h1 className="comman_heads">
                          {user?.firstName + " " + user?.lastName}
                        </h1>
                      </div>
                      <div className="col-6 text-end mb-3">
                        <label className="text-danger fw-bold">
                          MEMBER'S CONTACT
                        </label>
                        <h1 className="comman_heads">{user?.phoneNumber}</h1>
                      </div>
                      <div className="col-12 text-center mb-3">
                        <img
                          className=""
                          id="proImage"
                          src={
                            user?.qrcode?.length > 5
                              ? user?.qrcode
                              : "/imgs/profileDummy.png"
                          }
                          style={{
                            width: "clamp(60px, 50%, 120px)",
                            borderRadius: "12px",
                            maxWidth: "100px",
                            maxHeight: "100px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>Verified agent</div>
      </div>
    </div>
  );
};

export default VisitorCard;
