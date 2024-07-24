import React from "react";

const NotFound = () => {
  return (
    <div>
      <div>
        <img
          style={{ width: "100%", height: "96dvh" }}
          src="/assets/img/404.svg"
        />
      </div>
      <a
        className="border bg-dark text-white fs-5 fw-bold p-2 mb-3"
        href="https://www.starimporters.com/"
      >
        Go to Home
      </a>
    </div>
  );
};

export default NotFound;
