import WrapAmount from "components/wrapper/WrapAmount";
import React from "react";

const SectionHeader = (props) => {
  const {
    headerImage,
    heading = "",
    subHeading = "",
    status = "",
    amount = "",
    specification = "",
  } = props || {};

  return (
    <>
      <div className="wcr-innner-wrap wcr-innner-wrap-1 d-flex flex-wrap w-100">
        <div className="wcr-img-wrap wbr-img-wrap">
          <span bg-color="#000" className="overflow-hidden">
            {headerImage}
          </span>
        </div>
        <div className="wcr-info-main">
          <div className="wcr-info-1 d-flex flex-wrap">
            <div className="wcr-card-data">
              <h2>{heading}</h2>
              <p>{subHeading}</p>
            </div>
            <div className="wcr-card-amt wbr-card-amt">
              <p className="font-bold">{status}</p>
              <h2>
                <WrapAmount value={amount} affix="suffix" />
              </h2>
            </div>
          </div>
        </div>
      </div>
      <div className="wcr-info-2">
        <h4 className="font-16-quick">Specifications</h4>
        <p>{specification}</p>
      </div>
    </>
  );
};

export default SectionHeader;
