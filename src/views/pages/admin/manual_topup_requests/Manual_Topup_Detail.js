import React, { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { fundRequestService } from "services/admin/fund_request.service";
import SectionHeader from "components/admin/sections/SectionHeader";
import SectionTransactionDetails from "components/admin/sections/SectionTransactionDetails";
import SectionTransactionReceipt from "components/admin/sections/SectionTransactionReceipt";
import SectionDetails from "components/admin/sections/SectionDetails";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan } from "@fortawesome/free-solid-svg-icons";
import ModalConfirmation from "components/admin/modals/ModalConfirmation";
import "assets/css/page.css";
import "assets/css/responsive.css";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardBody,
  CCardFooter,
  CLink,
  CButton,
  CInput,
  CLabel,
  CFormGroup,
  CFormText,
  CTextarea,
} from "@coreui/react";
import { notify } from "_helpers";

const Manual_Topup_Detail = () => {
  const params = useParams();
  const [appTopupId, setAppTopupId] = useState("");
  const [rejComment, setRejComment] = useState("");
  const [isError, setIsError] = useState({
    appTopupId: "",
    rejComment: "",
  });
  const [details, setDetails] = useState({
    id: "",
    amount: "",
    bank_account_number: "",
    bank_name: "",
    date: "",
    fees: "",
    specification: "",
    status: "",
    swift_code: "",
    total_amount: "",
    transaction_id: "",
    user_type: "",
    email: "",
    mobile_number: "",
    name: "",
    image: "",
    comment: "",
    approved_topup_txn_id: "",
    receipt_images: [],
  });
  const [confirmationDetails, setCofirmationDetails] = useState({
    show: false,
    status: null,
    title: "",
  });
  const showActions = details?.status === "PENDING" ? true : false;

  /**
   * For getting the details of manual fund request
   * @param {string} tid
   */
  const retrieveManualFundDetails = async (tid = "") => {
    try {
      const values = { transaction_id: tid };
      const response = await fundRequestService.getManualFundDetails(values);
      const { success, data, message = "" } = response || {};
      if (!success) throw message;
      setDetails(data);
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * For Updating the status of manual fund request
   * @param {boolean} status
   */
  const handleManualFundUpdateStatus = async () => {
    if (confirmationDetails.status === null) return;
    const regexId = new RegExp(/^[a-zA-Z0-9-()_ ]{5,25}$/);
    const regexComment = new RegExp(/^[\s\S]{1,150}$/);
    if (confirmationDetails.status && !regexId.test(appTopupId.trim()))
      return setIsError({
        appTopupId:
          "Topup-id should be alpha numeric containing 5 - 25 characters",
      });
    if (!confirmationDetails.status && !regexComment.test(rejComment.trim()))
      return setIsError({
        rejComment: "Comment should be string containing 1 - 150 characters",
      });
    try {
      const values = {
        transaction_id: details?.transaction_id,
        status: confirmationDetails.status ? "APPROVED" : "REJECTED",
        approved_topup_txn_id: appTopupId,
        comment: rejComment,
      };
      const response = await fundRequestService.updateManualFundStatus(values);
      const { success, message = "" } = response || {};
      if (!success) throw message;
      notify.success(message);
      await retrieveManualFundDetails(values?.transaction_id);
    } catch (error) {
      if (typeof error === "string") notify.error(error);
      console.log(error);
    } finally {
      handleCancelConfirmation();
    }
  };

  /**
   * For downloading manual fund receipt
   * @param {string} receipt_id
   */
  const handleViewManualFundReceipt = async (receipt) => {
    try {
      const values = { receipt_id: receipt?.id || "" };
      const { data, success, message } =
        await fundRequestService.getManualFundReceipt(values);
      if (!success) throw message;
      const { encoded_file, file_name } = data;
      const extension = file_name?.split(".")?.[1] || "";
      const dtnow = new Date().toISOString();
      const linkSource = `data:application/${extension};base64,${encoded_file}`;
      const downloadLink = document.createElement("a");
      const fileName = `${details?.transaction_id}_${receipt?.id}_${dtnow}.${extension}`;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmation = (status) => {
    setCofirmationDetails({
      show: true,
      status: status,
      title: status
        ? "Processing Fund Request Approve"
        : "Processing Fund Request Reject",
    });
  };

  const handleCancelConfirmation = () => {
    setCofirmationDetails({
      show: false,
      status: null,
      title: "",
    });
    setAppTopupId("");
    setRejComment("");
    setIsError({ appTopupId: "", rejComment: "" });
  };

  const adminInputDetails = useMemo(() => {
    const { approved_topup_txn_id, comment, status } = details || {};
    switch (status) {
      case "APPROVED":
        return [{ key: "Topup-id", value: approved_topup_txn_id }];
      case "REJECTED":
        return [{ key: "Comment", value: comment }];
      default:
        return [];
    }
  }, [details]);

  const HeaderImage = useMemo(() => {
    const { image, user_type } = details || {};
    const styles = {
      height: "100%",
      width: "100%",
      objectFit: "cover",
      objectPosition: "center",
    };
    switch (user_type) {
      case "business":
        return (
          <img src={image || "/assets/Business-account.png"} style={styles} />
        );
      case "personal":
        return <img src={image || "/assets/Personal.png"} style={styles} />;
      default:
        return <img src="/avatars/default-avatar.png" style={styles} />;
    }
  }, [details?.image, details?.user_type]);

  useEffect(() => {
    const { id = "" } = params || {};
    if (!id) return;
    retrieveManualFundDetails(id);
  }, [params]);

  return (
    <CContainer fluid className={"p-0"}>
      <CRow>
        <CCol sm="12">
          <CCard>
            <CCardBody>
              <div className="walllet-refund-wrapper wallet-refund-details-wrappper wr-bank-details-wrapper">
                <div className="wr-title-wrap">
                  <h2>Transaction Details</h2>
                </div>
                <div className="wc-refund-main-wrap">
                  <div className="pattern-wrap pattern-wrap-top"></div>
                  <div className="wc-refund-main-inner">
                    <SectionHeader
                      headerImage={HeaderImage}
                      heading={details?.name}
                      subHeading={details?.user_type}
                      status={details?.status}
                      amount={details?.amount + " ANG"}
                      specification={details?.specification}
                    />
                    <div className="wcr-divider-wrap"></div>
                    <SectionTransactionDetails
                      transactionId={details?.transaction_id}
                      date={details?.date}
                      amount={details?.amount}
                      fees={details?.fees}
                      status={details?.status}
                    />
                    <div className="wcr-divider-wrap"></div>
                    <div className="wcr-innner-wrap wbr-innner-wrap-3 d-flex flex-wrap w-100 align-items-center">
                      <SectionDetails
                        detailsHeading="Customer Details"
                        details={[
                          { key: "Customer Name", value: details?.name },
                          { key: "Email", value: details?.email },
                          {
                            key: "Mobile Number",
                            value: details?.mobile_number,
                          },
                        ]}
                      />
                      <SectionTransactionReceipt
                        receipts={details.receipt_images}
                        handleClickReceipt={handleViewManualFundReceipt}
                      />
                    </div>
                    <div className="wcr-divider-wrap"></div>
                    <div className="wcr-innner-wrap wbr-innner-wrap-4">
                      <SectionDetails
                        detailsHeading="Admin Inputs"
                        details={adminInputDetails}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CCardBody>
            <CCardFooter>
              &nbsp;
              <CLink
                type="button"
                className="btn btn-outline-secondary btn-md"
                to="/admin/manual_requests"
              >
                <FontAwesomeIcon icon={faBan} className="mr-1" />
                Cancel
              </CLink>
              {showActions && (
                <CButton
                  className={"btn btn-danger btn-md ml-3"}
                  onClick={() => handleConfirmation(false)}
                >
                  Reject
                </CButton>
              )}
              {showActions && (
                <CButton
                  className={"btn btn-success btn-md ml-3"}
                  onClick={() => handleConfirmation(true)}
                >
                  Approve
                </CButton>
              )}
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
      <ModalConfirmation
        show={confirmationDetails.show}
        title={confirmationDetails.title}
        onConfirmCallback={handleManualFundUpdateStatus}
        onCancelCallback={handleCancelConfirmation}
      >
        <CFormGroup row>
          {confirmationDetails.status ? (
            <CCol xs="12">
              <CLabel htmlFor="cxp-admin-mf-id">Add Topop Id</CLabel>
              <CInput
                id="cxp-admin-mf-id"
                placeholder="Transaction Id"
                name="appTopupId"
                value={appTopupId}
                onChange={(e) => setAppTopupId(e?.target?.value || "")}
              ></CInput>
              <CFormText color="red" className="text-danger">
                {isError.appTopupId}
              </CFormText>
            </CCol>
          ) : (
            <CCol xs="12">
              <CLabel htmlFor="cxp-admin-mf-comment">Add Comment</CLabel>
              <CTextarea
                id="cxp-admin-mf-comment"
                placeholder="comment..."
                name="rejComment"
                value={rejComment}
                rows={2}
                onChange={(e) => setRejComment(e?.target?.value || "")}
              ></CTextarea>
              <CFormText color="red" className="text-danger">
                {isError.rejComment}
              </CFormText>
            </CCol>
          )}
        </CFormGroup>
      </ModalConfirmation>
    </CContainer>
  );
};

export default Manual_Topup_Detail;
