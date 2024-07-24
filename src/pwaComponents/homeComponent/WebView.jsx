import React from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

const WebView = () => {
  let location = useLocation();
  const navigate = useNavigate();
  console.log(location?.state);
  return (
    <div>
      <div className="bg-dark  text-center text-white">
        <span >
          {" "}
          <Link
            onClick={() => {
              navigate(-1);
            }}>
            <i class="fa-solid fa-arrow-left text-white mx-1"></i>
          </Link>
        </span>
        Web View
      </div>
      <iframe
        style={{
          width: "100vw",
          height: "90vh",
        }}
        className="mt-1"
        src={location?.state}></iframe>
    </div>
  );
};

export default WebView;
