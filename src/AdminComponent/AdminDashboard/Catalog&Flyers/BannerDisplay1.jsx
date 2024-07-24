import React from "react";

const BannerDisplay1 = () => {
  return (
    <div class="shadow preview_modal">
      <div class="child">
        <div className="">
          <div
            className="comman_inner_bg"
            style={{ backgroundImage: "url(assets/img/ZPage_2.png)" }}>
            <div className="comman_head">
              <h2>Star Impoters &amp; Wholesalers - 770.908.0404</h2>
            </div>
            <div className="wholesale_main">
              <a href="javascript:;" className="wholesale_img">
                <img src="assets/img/wholesale.png" alt="" />
              </a>
              <a href="javascript:;" className="wholesale_img">
                <img src="assets/img/wholesale.png" alt="" />
              </a>
              <a href="javascript:;" className="wholesale_img">
                <img src="assets/img/wholesale.png" alt="" />
              </a>
              <div className="bottom_line text-center">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerDisplay1;
