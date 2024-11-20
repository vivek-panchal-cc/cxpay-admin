import * as React from "react";
import "assets/css/page.css";

const IconSwap = (props) => (
  <svg
    width={17}
    height={17}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g clipPath="url(#clip0_429_11110)">
      <path
        className="arrow-up"
        d="M11 8L7 4M7 4L3 8M7 4L7 20"
        stroke="inherit"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        className="arrow-down"
        d="M13 16L17 20M17 20L21 16M17 20L17 4"
        stroke="inherit"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_429_11110">
        <rect width={24} height={24} fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default IconSwap;
