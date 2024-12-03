import React from "react";
import CIcon from "@coreui/icons-react";

const SectionTransactionReceipt = (props) => {
  const { documentHeading = "", receipts = [], handleClickReceipt = () => {} } = props || {};

  const validFileExtensions = {
    image: ["jpg", "png", "jpeg", "svg", "heif", "hevc"],
    pdf: ["pdf"],
  };

  // To check file type
  const isValidFileType = (fileName, fileType) => {
    return (
      fileName &&
      validFileExtensions[fileType].indexOf(fileName.split(".").pop()) > -1
    );
  };

  const getFileIcon = (fileName = "") => {
    switch (true) {
      case isValidFileType(fileName?.toLowerCase(), "image"):
        return <CIcon name="IconDownloadImage" height={69} />;
      case isValidFileType(fileName?.toLowerCase(), "pdf"):
        return <CIcon name="IconDownloadPdf" height={69} />;
      default:
        return <CIcon name="IconDownloadDocument" height={69} />;
    }
  };

  return (
    <div className="wr-bdatail-dwld ps-xl-5 ps-md-4 border-start">
      <div className="font-16-quick  w-100 pb-md-4 pb-3 dark_blue font-600">
        {documentHeading ? documentHeading : "Transaction Receipt"}
      </div>
      <div className="wr-dwld-wrap">
        <ul>
          {receipts?.map((item, index) => {
            const { id = "", receipt = "" } = item || {};
            return (
              <li key={id || index}>
                <button
                  className="d-flex justify-content-center align-items-center p-0"
                  onClick={() => handleClickReceipt(item)}
                  style={{ outline: "none" }}
                >
                  {getFileIcon(receipt)}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default SectionTransactionReceipt;
