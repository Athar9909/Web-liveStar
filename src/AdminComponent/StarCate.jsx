import React from "react";
import HTMLFlipBook from "react-pageflip";
import AboutUs from "../buyerComponent/Homepage/AboutUs";
const Page = React.forwardRef((props, ref) => {
  return (
    <div className="demoPage bg-white" ref={ref}>
      /* ref required */
      <h1>Page Header</h1>
      <p>{props.children}</p>
      <p>Page number: {props.number}</p>
    </div>
  );
});
const StarCate = () => {
  return (
    <div>
      <HTMLFlipBook width={300} height={500}>
        <Page number="1">
          <AboutUs />
        </Page>
        <Page number="2">Page text</Page>
        <Page number="3">Page text</Page>
        <Page number="4">Page text</Page>
        <Page number="5">Page text</Page>
        <Page number="6">Page text</Page>
      </HTMLFlipBook>
    </div>
  );
};

export default StarCate;
