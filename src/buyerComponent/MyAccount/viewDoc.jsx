import React from "react";
import { Viewer } from "@react-pdf-viewer/core";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useLocation } from "react-router-dom";

const ViewDocs = () => {
  let location = useLocation();
  let url = location.state;

  return (
    <div className="container ">
      {/* <h1 className="fs-5">{url}</h1> */}
      <Viewer
        fileUrl={
          "https://starimporters-media.s3.amazonaws.com/1677148182640--A2003-34.pdf"
        }
        httpHeaders={{
          "Access-Control-Allow-Origin": "*",
        }}
      />
      {/* <img src={url} width={500} className="w-100"></img> */}
    </div>
  );
};

export default ViewDocs;
