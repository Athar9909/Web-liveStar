import React, { useEffect, useState } from "react";

const Intro1 = ({ backImg, QrImage, header }) => {
  // const [backImg, setBackImg] = useState();
  // const [QrImg, setQrImg] = useState();

  useEffect(() => {
    if (backImg) {
      var picture = new FileReader();
      picture.readAsDataURL(backImg);
      picture.addEventListener("load", function (event) {
        document
          .getElementById("bgImg")
          .setAttribute("src", event.target.result);
      });
    }
    if (QrImage) {
      var picture = new FileReader();
      picture.readAsDataURL(QrImage);
      picture.addEventListener("load", function (event) {
        document
          .getElementById("qrImg")
          .setAttribute("src", event.target.result);
      });
    }
  }, [backImg,QrImage]);

  console.log(backImg, QrImage, header, "jkh");
  return (
    <div>
      <div>
        <div class=" shadow preview_modal">
          <div class="child">
            <img
              id="bgImg"
              class="bg_img_prev"
              src={require("../../../assets/img/ZPage_1.jpg")}
              alt=""
            />
            <img
              id="qrImg"
              class="qr_img"
              src={require("../../../assets/img/ZPage_1.jpg")}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Intro1;
