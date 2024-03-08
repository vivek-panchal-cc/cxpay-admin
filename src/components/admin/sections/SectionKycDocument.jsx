import React from "react";
import CIcon from "@coreui/icons-react";

const SectionKycDocument = ({
  documentHeading = "",
  receipt = "",
  handleClickReceipt = () => {},
}) => {
  const validFileExtensions = {
    image: ["jpg", "png", "jpeg", "svg", "heif", "hevc"],
    pdf: ["pdf"],
  };

  const isValidFileType = (fileName, fileType) => {
    return (
      fileName &&
      validFileExtensions[fileType].includes(
        fileName?.split(".")?.pop().toLowerCase()
      )
    );
  };

  const getFileIcon = (fileName = "") => {
    const fileExtension = fileName?.split(".")?.pop().toLowerCase();

    switch (true) {
      case isValidFileType(fileExtension, "image"):
        return <CIcon name="IconDownloadImage" height={69} />;
      case isValidFileType(fileExtension, "pdf"):
        return <CIcon name="IconDownloadPdf" height={69} />;
      default:
        return <CIcon name="IconDownloadDocument" height={69} />;
    }
  };

  return (
    <div className="ps-xl-5 ps-md-4 border-start kyc-table-second-child">
      <div className="font-14-quick w-100 pb-2 dark_blue font-600">
        {documentHeading ? documentHeading : "Transaction Receipt"}
      </div>
      <div className="wr-dwld-wrap">
        <button
          className="d-flex justify-content-center align-items-center"
          onClick={() => handleClickReceipt(receipt)}
          style={{
            outline: "none",
            border: "0px",
            backgroundColor: "transparent",
            padding: "10px 0",
            marginLeft: "10px",
          }}
        >
          {getFileIcon(receipt)}
        </button>
      </div>
    </div>
  );
};

export default SectionKycDocument;
