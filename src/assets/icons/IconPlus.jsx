import * as React from "react";
const IconPlus = (props) => (
  <svg
    fill="#000000"
    width={17}
    height={19}
    viewBox="0 0 24 24"
    id="plus"
    data-name="Line Color"
    xmlns="http://www.w3.org/2000/svg"
    className="icon line-color"
    {...props}
  >
    <path
      id="primary"
      d="M5,12H19M12,5V19"
      style={{
        fill: "none",
        stroke: "rgb(0, 0, 0)",
        strokeLinecap: "round",
        strokeLinejoin: "round",
        strokeWidth: 2,
      }}
    />
  </svg>
);
export default IconPlus;
