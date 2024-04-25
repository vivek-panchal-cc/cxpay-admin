import React, { useEffect, useState } from "react";
import "assets/css/page.css";
import "assets/css/responsive.css";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CCardFooter,
  CButton,
  CLink,
  CTextarea,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faSave } from "@fortawesome/free-solid-svg-icons";
import { FILE_SIZE } from "constants/frontend/schema.constants";
import { withdrawRequestService } from "services/admin/withdraw_request.service";
import { notify } from "../../../../_helpers";
import { useHistory } from "react-router-dom";

const Fullpage = (props) => {
  const {
    activity_ref_id = "",
    amount = "",
    bank_account_number = "",
    bank_name = "",
    comment = "",
    customer_account_number = "",
    date = "",
    fees = "",
    id = "",
    name = "",
    narration = "",
    receipt_images = [],
    request_receive_date = "",
    specification = "",
    status = "",
    swift_code = "",
    time = "",
    total_amount = "",
    transaction_id = "",
    //
    profile_image = "",
    email = "",
    mobile_number = "",
    user_type = "",
  } = props.withdraw || {};

  const lastFourDigits = bank_account_number?.slice(-4);
  const history = useHistory();
  const showEdits = status === "PROCESSING" ? true : false;
  const [adminComment, setAdminComment] = useState("");
  const [recieptFiles, setRecieptFiles] = useState([]);
  const [inputErrors, setInputErrors] = useState({
    comment: "",
    reciept: "",
  });

  const isValidComment = () => {
    if (!adminComment) {
      setInputErrors((err) => ({ ...err, comment: "Please add comment." }));
      return;
    } else if (adminComment?.length > 150) {
      setInputErrors((err) => ({
        ...err,
        comment: "Comment must not be greater than 150 characters.",
      }));
      return;
    }
    return adminComment;
  };

  const isValidFiles = (required = false) => {
    const allFiles = [...recieptFiles];
    if (allFiles?.length <= 0) {
      setInputErrors((err) => ({
        ...err,
        reciept: "Please add a reciept file.",
      }));
      return required ? false : true;
    }
    if (allFiles?.length > 4) {
      setInputErrors((err) => ({
        ...err,
        reciept: "At most 4 files are allowed.",
      }));
      return false;
    }
    for (const fil of allFiles) {
      if (fil.size > FILE_SIZE) {
        setInputErrors((err) => ({
          ...err,
          reciept: "A reciept must not exceed 5 MB size.",
        }));
        return false;
      }
    }
    return true;
  };

  const handleActionApprove = async () => {
    if (!isValidFiles(true)) {
      const inputField = document.getElementById(`cxp-admin-wd-recipt`);
      if (!inputField) return;
      inputField.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (adminComment?.length > 150) {
      setInputErrors((err) => ({
        ...err,
        comment: "Comment must not be greater than 150 characters.",
      }));
      return;
    }
    const formData = new FormData();
    formData.append("transaction_id", transaction_id);
    formData.append("type", "APPROVED");
    formData.append("comment", adminComment);
    for (const fil of recieptFiles) formData.append("media[]", fil);
    await handleWithdrawRequestAction(formData);
  };

  const handleActionReject = async () => {
    if (!isValidComment()) {
      const inputField = document.getElementById(`cxp-admin-wd-comment`);
      if (!inputField) return;
      inputField.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const allFiles = [...recieptFiles];
    if (allFiles?.length > 4) {
      setInputErrors((err) => ({
        ...err,
        reciept: "At most 4 files are allowed.",
      }));
      return false;
    }
    for (const fil of allFiles) {
      if (fil.size > FILE_SIZE) {
        setInputErrors((err) => ({
          ...err,
          reciept: "A reciept must not exceed 5 MB size.",
        }));
        return false;
      }
    }
    const formData = new FormData();
    formData.append("transaction_id", transaction_id);
    formData.append("type", "REJECTED");
    formData.append("comment", adminComment);
    for (const fil of recieptFiles) formData.append("media[]", fil);
    await handleWithdrawRequestAction(formData);
  };

  const handleWithdrawRequestAction = async (params = {}) => {
    try {
      const { data, message, success } =
        await withdrawRequestService.withdrawRequestAction(params);
      if (!success) throw message;
      notify.success(message);
      history.push("/admin/withdraw_requests");
    } catch (error) {
      console.log(error);
      notify.error(error);
    }
  };

  const handleDownloadReciept = async (reciptId = "") => {
    try {
      const formData = new FormData();
      formData.append("receipt_id", reciptId);
      const { data, message, success } =
        await withdrawRequestService.downloadReciept(formData);
      if (!success) throw message;
      const { encoded_file, file_name } = data;

      const extension = file_name?.split(".")?.[1] || "";
      const dtnow = new Date().toISOString();
      const linkSource = `data:application/${extension};base64,${encoded_file}`;
      const downloadLink = document.createElement("a");
      const fileName = `${transaction_id}_${reciptId}_${dtnow}.${extension}`;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (error) {
      console.log(error);
      notify.error(error);
    }
  };

  const handleFileInputChange = (e) => {
    const files = e.currentTarget.files || [];

    // Append the newly selected files to the existing files
    setRecieptFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const removeFile = (index) => {
    setRecieptFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      newFiles.splice(index, 1); // Remove the file at the specified index
      return newFiles;
    });
  };

  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <p className="title">
                  {profile_image !== null && profile_image !== undefined && (
                    <>
                      {
                        <img
                          width={100}
                          height={100}
                          src={
                            profile_image
                              ? profile_image
                              : user_type === "business"
                              ? "/assets/Business-account.png"
                              : "/assets/Personal.png"
                          }
                          alt="Profile Image"
                        />
                      }
                    </>
                  )}
                </p>
              </CCardHeader>
              <CCardBody>
                <div className="walllet-refund-wrapper wallet-refund-details-wrappper wr-bank-details-wrapper">
                  <div className="wr-title-wrap">
                    <h2>Transaction Details</h2>
                  </div>
                  <div className="wc-refund-main-wrap">
                    <div className="pattern-wrap pattern-wrap-top"></div>
                    <div className="wc-refund-main-inner">
                      <div className="wcr-innner-wrap wcr-innner-wrap-1 d-flex flex-wrap w-100">
                        <div className="wcr-img-wrap wbr-img-wrap">
                          <span bg-color="#000">
                            <svg
                              width="41"
                              height="41"
                              viewBox="0 0 41 41"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M20.6042 1.5L3.62305 9.99057H37.5853L20.6042 1.5Z"
                                stroke="#363853"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M20.6035 15.6509V32.632"
                                stroke="#363853"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M7.86719 15.6509V32.632"
                                stroke="#363853"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M33.3398 15.6509V32.632"
                                stroke="#363853"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M1.5 39H39"
                                stroke="#363853"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                        <div className="wcr-info-main">
                          <div className="wcr-info-1 d-flex flex-wrap">
                            <div className="wcr-card-data">
                              <h2>{bank_name}</h2>
                              <p>xxxx xxxx xxxx {lastFourDigits}</p>
                            </div>
                            <div className="wcr-card-amt wbr-card-amt">
                              <p className="green font-bold">{status}</p>
                              <h2>{amount} ANG</h2>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="wcr-info-2">
                        <h4 className="font-16-quick">Specifications</h4>
                        <p>{narration}</p>
                      </div>
                      <div className="wcr-divider-wrap"></div>
                      <div className="wcr-innner-wrap wcr-innner-wrap-2 d-flex flex-wrap w-100">
                        <div className="w-50-md wcr-transition-info wcr-transition-info-1">
                          <table>
                            <tr>
                              <td>Transaction ID</td>
                              <td>{activity_ref_id}</td>
                            </tr>
                            <tr>
                              <td>Date</td>
                              <td>{date}</td>
                            </tr>
                            <tr>
                              <td>Time</td>
                              <td>{time}</td>
                            </tr>
                          </table>
                        </div>
                        <div className="w-50-md wcr-transition-info wcr-transition-info-2">
                          <table>
                            <tr>
                              <td>Amount</td>
                              <td>{total_amount} ANG</td>
                            </tr>
                            <tr>
                              <td>Fees</td>
                              <td>{fees} ANG</td>
                            </tr>
                            <tr>
                              <td>Status</td>
                              <td>{status}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      <div className="wcr-divider-wrap"></div>
                      <div className="wcr-innner-wrap wbr-innner-wrap-3 d-flex flex-wrap w-100 align-items-center">
                        <div className="wr-bdatail-tbl pe-md-4">
                          <div className="font-16-quick  w-100 pb-2 dark_blue font-600">
                            Bank Details
                          </div>
                          <table>
                            <tr>
                              <td>Bank Name</td>
                              <td>{bank_name}</td>
                            </tr>
                            <tr>
                              <td>Account Number</td>
                              <td>xxxx xxxx xxxx {lastFourDigits}</td>
                            </tr>
                            {/* <tr>
                              <td>Swift Code</td>
                              <td>{swift_code}</td>
                            </tr> */}
                          </table>
                        </div>

                        <div className="wr-bdatail-dwld ps-xl-5 ps-md-4 border-start">
                          <div className="font-16-quick  w-100 pb-md-4 pb-3 dark_blue font-600">
                            Transaction Receipt
                          </div>
                          <div className="wr-dwld-wrap">
                            {showEdits ? (
                              <>
                                <ul className="pl-0">
                                  <li>
                                    <input
                                      name="media"
                                      className="invisible"
                                      id="cxp-admin-wd-recipt"
                                      type="file"
                                      style={{ height: 0, width: 0 }}
                                      onChange={handleFileInputChange}
                                      accept="*"
                                      multiple
                                    />
                                    <label
                                      htmlFor={"cxp-admin-wd-recipt"}
                                      style={{
                                        transform: "rotate(180deg)",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <p className="bg-extension justify-content-center">
                                        <svg
                                          width="24"
                                          height="24"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                                            stroke="black"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M7 10L12 15L17 10"
                                            stroke="black"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                          <path
                                            d="M12 15V3"
                                            stroke="black"
                                            strokeWidth="2"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      </p>
                                    </label>
                                  </li>
                                  <li className="w-75">
                                    <div
                                      className={`w-100 h-100 d-flex flex-column align-items-start overflow-auto pl-3 bg-extension ${
                                        recieptFiles.length > 1
                                          ? "justify-content-start"
                                          : "justify-content-center"
                                      }`}
                                    >
                                      {[...recieptFiles].map((item, index) => {
                                        return (
                                          <div
                                            key={index}
                                            className="d-flex align-items-center"
                                          >
                                            <p
                                              className={`p-0 ${
                                                recieptFiles.length > 1
                                                  ? "mb-2"
                                                  : "m-0"
                                              }`}
                                            >
                                              {`${index + 1}. ${item.name}`}
                                              <svg
                                                className={`ms-2 ml-2`}
                                                onClick={() =>
                                                  removeFile(index)
                                                } // Attach the removeFile handler
                                                style={{ cursor: "pointer" }} // Add cursor pointer style for interaction
                                                width="15"
                                                height="15"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M6 18L18 6M6 6L18 18"
                                                  stroke="black"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                            </p>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </li>
                                </ul>
                                {inputErrors.reciept && (
                                  <p className="text-danger">
                                    {inputErrors.reciept}
                                  </p>
                                )}
                              </>
                            ) : (
                              <ul className="pl-0">
                                {receipt_images.map((item, index) => {
                                  const file = receipt_images?.[index];
                                  const extension =
                                    file.receipt?.split(".")?.[1] || "";
                                  const imgExtensions = [
                                    "png",
                                    "jpg",
                                    "jpeg",
                                    "heif",
                                    "heic",
                                  ];

                                  return (
                                    <li key={item.id}>
                                      {file && (
                                        <button
                                          onClick={() =>
                                            handleDownloadReciept(file.id)
                                          }
                                        >
                                          {extension === "pdf" ? (
                                            <img
                                              src="/assets/ic_pdf.svg"
                                              alt="pdf"
                                            />
                                          ) : extension === "doc" ? (
                                            <img
                                              src="/assets/ic_document.svg"
                                              alt="doc"
                                            />
                                          ) : imgExtensions.includes(
                                              extension
                                            ) ? (
                                            <img
                                              src="/assets/ic_image_receipt.svg"
                                              alt="image_type"
                                            />
                                          ) : (
                                            <p className="bg-extension justify-content-center">
                                              <svg
                                                width="24"
                                                height="24"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                              >
                                                <path
                                                  d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                                                  stroke="black"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M7 10L12 15L17 10"
                                                  stroke="black"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                                <path
                                                  d="M12 15V3"
                                                  stroke="black"
                                                  strokeWidth="2"
                                                  strokeLinecap="round"
                                                  strokeLinejoin="round"
                                                />
                                              </svg>
                                            </p>
                                          )}
                                        </button>
                                      )}
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="wcr-divider-wrap"></div>
                      <div className="wcr-innner-wrap wbr-innner-wrap-3 d-flex flex-wrap w-100 align-items-center">
                        <div className="wr-bdatail-tbl pe-md-4">
                          <div className="font-16-quick  w-100 pb-2 dark_blue font-600">
                            Customer Details
                          </div>
                          <table>
                            <tr>
                              <td>Customer Name</td>
                              <td>{name}</td>
                            </tr>
                            <tr>
                              <td>Email</td>
                              <td>{email}</td>
                            </tr>
                            <tr>
                              <td>Mobile Number</td>
                              <td>{mobile_number}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      <div className="wcr-divider-wrap"></div>

                      <div className="wcr-innner-wrap wbr-innner-wrap-4">
                        <div className="font-16-quick  w-100 pb-2 dark_blue font-600">
                          Admin Comments
                        </div>
                        <p className="font-12 dark_blue">{comment}</p>
                        {showEdits ? (
                          <>
                            <CTextarea
                              id="cxp-admin-wd-comment"
                              placeholder="Add Comment"
                              name="comment"
                              value={adminComment}
                              onChange={(e) =>
                                setAdminComment(e?.target?.value)
                              }
                            ></CTextarea>
                            {inputErrors.comment && (
                              <p className="pl-1 pt-2 text-danger">
                                {inputErrors.comment}
                              </p>
                            )}
                          </>
                        ) : null}
                      </div>
                    </div>
                    <div className="pattern-wrap pattern-wrap-bottom"></div>
                  </div>
                </div>
              </CCardBody>
              <CCardFooter>
                &nbsp;
                <CLink
                  className="btn btn-outline-secondary btn-md"
                  to="/admin/withdraw_requests"
                  type="button"
                >
                  <FontAwesomeIcon icon={faBan} className="mr-1" />
                  Cancel
                </CLink>
                {showEdits ? (
                  <>
                    <CButton
                      className={"btn btn-danger btn-md ml-3"}
                      onClick={handleActionReject}
                    >
                      Reject
                    </CButton>
                    <CButton
                      className={"btn btn-success btn-md ml-3"}
                      onClick={handleActionApprove}
                    >
                      Approve
                    </CButton>
                  </>
                ) : null}
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
};

export default Fullpage;
