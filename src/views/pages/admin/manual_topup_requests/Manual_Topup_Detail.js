import React, { useEffect, useState } from "react";
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
} from "@coreui/react";

const Manual_Topup_Detail = () => {
  const params = useParams();
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

    receipt_images: [],
  });
  const [confirmationDetails, setCofirmationDetails] = useState({
    show: false,
    title: "",
    description: "",
    confirmCallback: () => {},
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
  const handleManualFundUpdateStatus = async (status) => {
    try {
      const values = {
        transaction_id: details?.transaction_id,
        status: status ? "APPROVED" : "REJECTED",
      };
      const response = await fundRequestService.updateManualFundStatus(values);
      const { success, message = "" } = response || {};
      if (!success) throw message;
      await retrieveManualFundDetails(values?.transaction_id);
    } catch (error) {
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
    const statusAlias = status ? "approve" : "reject";
    setCofirmationDetails({
      show: true,
      title: "Processing Fund Request",
      description: `Are you sure want to ${statusAlias} this request ?`,
      confirmCallback: () => handleManualFundUpdateStatus(status),
    });
  };

  const handleCancelConfirmation = () => {
    setCofirmationDetails({
      show: false,
      title: "",
      description: "",
      confirmCallback: () => {},
    });
  };

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
                      headerImage={
                        <img
                          src={details?.image}
                          className="h-100 w-100"
                          style={{
                            objectFit: "cover",
                            objectPosition: "center",
                          }}
                        />
                      }
                      heading={details?.name}
                      subHeading={details?.user_type}
                      status={details?.status}
                      amount={details?.amount + " ANG"}
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
        description={confirmationDetails.description}
        onConfirmCallback={confirmationDetails.confirmCallback}
        onCancelCallback={handleCancelConfirmation}
      />
    </CContainer>
  );
};

export default Manual_Topup_Detail;
