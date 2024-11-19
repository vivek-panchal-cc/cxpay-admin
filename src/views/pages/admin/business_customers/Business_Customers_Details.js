import React from "react";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CRow,
} from "@coreui/react";

import {
  _canAccess,
  _loginUsersDetails,
  capitalize,
  capitalizeWordByWord,
  formatDate,
  formatDateByConditional,
  history,
  notify,
} from "../../../../_helpers/index";
import SectionKycDetails from "components/admin/sections/SectionKycDetails";
import { businessCustomersService } from "../../../../services/admin/business_customers.service";
import "../business_customers/kycTable.css";
import "assets/css/page.css";
import "assets/css/responsive.css";

class Business_Customers_Details extends React.Component {
  constructor(props) {
    super(props);
    const mobile_number = this.props.mobile_number;
    const account_number = this.props.account_number;
    const detail_type = this.props.activeTab;
    this.state = {
      // account_number: this.props.match.params.account_number,
      countryData: [],
      customerDetails: [],
      fields: {
        mobile_number: mobile_number,
        account_number: account_number,
        pageNo: 1,
        sort_dir: "desc",
        sort_field: "updated_at",
        totalPage: 1,
        detail_type: detail_type,
      },
      _openPopup: false,
      animalImages: [],
      multiaction: [],
    };
    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/business_customers");
    }
  }

  componentDidMount() {
    this.getCustomerDetails();
  }

  getCustomerDetails() {
    businessCustomersService
      .getCustomerWiseDetails(this.state.fields)
      .then((res) => {
        if (res.success === false) {
          notify.error(res.message);
          history.push("/admin/business_customers");
        } else {
          this.setState({
            customerDetails: res.data,
          });
        }
      });
    businessCustomersService.getCountry().then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        if (res.data == null) {
        } else {
          const countryMap = res.data.country_list.reduce((map, country) => {
            map[country.iso] = country.country_name;
            return map;
          }, {});
          this.setState({ countryData: countryMap });
        }
      }
    });
  }

  handleKycDocument = async (isRenewal = false) => {
    try {
      const values = {
        account_number: this.state.fields.account_number || "",
        is_renewal: isRenewal,
      };
      const { data, success, message } =
        await businessCustomersService.getBusinessKycDocument(values);
      if (!success) throw message;
      const { encoded_file, file_name } = data;
      const extension = file_name?.split(".")?.[1] || "";
      const dtnow = new Date().toISOString();
      const linkSource = `data:application/${extension};base64,${encoded_file}`;
      const downloadLink = document.createElement("a");
      const fileName = `${this.state.fields.account_number}_${dtnow}.${extension}`;
      downloadLink.href = linkSource;
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (error) {
      console.log(error);
    }
  };

  render() {
    return (
      <>
        <CCard>
          <CCardBody>
            <CRow>
              <CCol xl={12}>
                <CCard>
                  <CCardHeader className={"font-weight-bold h5"}>
                    Business Details
                  </CCardHeader>
                  <CCardBody>
                    <CRow>
                      <CCol xl={12}>
                        <CFormGroup row>
                          <CCol xs="6">
                            <p>
                              <b>Company Name: </b>
                              {this.state.customerDetails.company_name}
                            </p>
                            {this.state.customerDetails.mobile_number && (
                              <p>
                                <b>Mobile: </b>
                                {`+${this.state.customerDetails.mobile_number}`}
                              </p>
                            )}
                            <p>
                              <b>Email: </b>
                              {this.state.customerDetails.email || "-"}
                            </p>
                            {this.state.customerDetails.city &&
                              this.state.customerDetails.country && (
                                <p>
                                  <b>Address: </b>
                                  {`${this.state.customerDetails.city}, ${
                                    this.state.countryData &&
                                    this.state.customerDetails.country &&
                                    this.state.countryData[
                                      this.state.customerDetails.country
                                    ]
                                      ? this.state.countryData[
                                          this.state.customerDetails.country
                                        ]
                                      : this.state.customerDetails.country
                                  }`}
                                </p>
                              )}
                            <p>
                              <b>Business ID: </b>
                              {this.state.customerDetails.business_id || "-"}
                            </p>
                            <p>
                              <b>KYC Type: </b>
                              {this.state.customerDetails.kyc_type || "-"}
                            </p>
                          </CCol>
                          <CCol xs="6">
                            <p>
                              <b>Account Number: </b>
                              {this.state.customerDetails.account_number || "-"}
                            </p>
                            <p>
                              <b>Available Balance: </b>
                              {this.state.customerDetails.available_balance ||
                                "-"}
                            </p>
                            <p>
                              <b>Reserved Amount: </b>
                              {this.state.customerDetails.reserved_amount ||
                                "-"}
                            </p>
                            {this.state.customerDetails.kyc_approved_status && (
                              <p>
                                <b>KYC Approved Status: </b>
                                {capitalize(
                                  this.state.customerDetails.kyc_approved_status
                                )}
                              </p>
                            )}
                            {this.state.customerDetails.renew_kyc_data
                              ?.renew_kyc_document_file && (
                              <p>
                                <b>KYC Renew Document: </b>
                                <a
                                  href={
                                    this.state.customerDetails.renew_kyc_data
                                      .renew_kyc_document_file
                                  }
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  View Document
                                </a>
                              </p>
                            )}
                            <p>
                              <b>KYC Attempt Count: </b>
                              {this.state.customerDetails.kyc_attempt_count ||
                                0}
                            </p>
                            {this.state.customerDetails.updated_at && (
                              <p>
                                <b>Updated At: </b>
                                {formatDate(
                                  this.state.customerDetails.updated_at
                                )}
                              </p>
                            )}
                          </CCol>
                        </CFormGroup>

                        {this.state.customerDetails.kyc_document_type && (
                          <div
                            className="walllet-refund-wrapper wallet-refund-details-wrappper wr-bank-details-wrapper kyc-approved-border"
                            style={{ marginBottom: "20px" }}
                          >
                            <div
                              className={`kyc-innner-wrap d-flex flex-wrap w-100 ${
                                this.state.customerDetails.kyc_document_file
                                  ? // ? "kyc-document-innner-wrap-3"
                                    "kyc-wbr-innner-wrap-3"
                                  : "kyc-wbr-innner-wrap-3"
                              }`}
                            >
                              <SectionKycDetails
                                detailsHeading="Document Details"
                                details={[
                                  {
                                    key: "Document Type",
                                    value: capitalizeWordByWord(
                                      this.state.customerDetails
                                        .kyc_document_type
                                    ),
                                  },
                                  {
                                    key: "Document Id",
                                    value:
                                      this.state.customerDetails
                                        .kyc_document_id,
                                  },
                                  {
                                    key: "Expiry Date",
                                    value: formatDateByConditional(
                                      this.state.customerDetails
                                        .kyc_expiration_date,
                                      true
                                    ),
                                  },
                                  {
                                    key: "Completion Date",
                                    value: formatDateByConditional(
                                      this.state.customerDetails
                                        .kyc_completion_date,
                                      true
                                    ),
                                  },
                                  {
                                    key: "Transaction Id",
                                    value:
                                      this.state.customerDetails
                                        .kyc_transaction_id,
                                  },
                                ]}
                              />
                              {/* {this.state.customerDetails
                                    .kyc_document_file && (
                                    <SectionKycDocument
                                      documentHeading="Document"
                                      receipt={
                                        this.state.customerDetails
                                          .kyc_document_file || null
                                      }
                                      handleClickReceipt={() =>
                                        this.handleKycDocument(false)
                                      }
                                    />
                                  )} */}
                            </div>
                          </div>
                        )}

                        {/* Table for Daily and Monthly Limits */}
                        <CRow>
                          <CCol xs="12">
                            <table className="table table-striped table-bordered">
                              <thead>
                                <tr>
                                  <th>Limit Type</th>
                                  <th>Daily Limit</th>
                                  <th>Monthly Limit</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr>
                                  <td>Add Fund</td>
                                  <td>
                                    {this.state.customerDetails
                                      .daily_add_fund_limit || "-"}
                                  </td>
                                  <td>
                                    {this.state.customerDetails
                                      .monthly_add_fund_limit || "-"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Wallet Transfer</td>
                                  <td>
                                    {this.state.customerDetails
                                      .daily_wallet_transfer_limit || "-"}
                                  </td>
                                  <td>
                                    {this.state.customerDetails
                                      .monthly_wallet_transfer_limit || "-"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Withdraw</td>
                                  <td>
                                    {this.state.customerDetails
                                      .daily_withdraw_limit || "-"}
                                  </td>
                                  <td>
                                    {this.state.customerDetails
                                      .monthly_withdraw_limit || "-"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Agent Top-Up</td>
                                  <td>
                                    {this.state.customerDetails
                                      .daily_agent_topup_limit || "-"}
                                  </td>
                                  <td>
                                    {this.state.customerDetails
                                      .monthly_agent_topup_limit || "-"}
                                  </td>
                                </tr>
                                <tr>
                                  <td>Request Limit</td>
                                  <td>
                                    {this.state.customerDetails
                                      .daily_request_limit || "-"}
                                  </td>
                                  <td>
                                    {this.state.customerDetails
                                      .monthly_request_limit || "-"}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </>
    );
  }
}

export default Business_Customers_Details;
