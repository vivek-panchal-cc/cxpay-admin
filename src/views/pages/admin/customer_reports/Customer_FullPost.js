import React from "react";
import "./page.css";
import moment from "moment";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CCardFooter,
  CLink,
  CTooltip,
  CPopover,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "constants/admin/global.constants";

const Fullpage = (props) => {
  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <p className="title">
                  {props.customer.profile_image !== null &&
                    props.customer.profile_image !== undefined && (
                      <>
                        {
                          <img
                            width={200}
                            height={200}
                            src={
                              props.customer.profile_image
                                ? props.customer.profile_image
                                : props.customer.user_type === "business"
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
                <div className="d-flex">
                  <div>
                    <h4 className="pl-2">Details</h4>
                    <table cellPadding={12} cellSpacing={12}>
                      <tr>
                        <th>Customer ID:</th>
                        <td>{props.customer.cust_id}</td>
                      </tr>
                      <tr>
                        <th>Account Number:</th>
                        <td>{props.customer.account_number}</td>
                      </tr>
                      <tr>
                        <th>Name:</th>
                        <td>
                          {props.customer.user_type == "personal" ||
                          props.customer.user_type == "agent"
                            ? props.customer.first_name +
                              " " +
                              props.customer.last_name
                            : props.customer.company_name}
                        </td>
                      </tr>
                      <tr>
                        <th>Email:</th>
                        <td>{props.customer.email}</td>
                      </tr>
                      {props.customer.mobile_number && (
                        <tr>
                          <th>Mobile:</th>
                          <td>{`+${props.customer.mobile_number}`}</td>
                        </tr>
                      )}
                    </table>
                  </div>
                  <div className="m-auto">
                    <h4 className="pl-2">Transactions</h4>
                    <table cellPadding={12} cellSpacing={12}>
                      <tr>
                        <th>Total Sent:</th>
                        <td>
                          {globalConstants.CURRENCY_SYMBOL}&nbsp;
                          {typeof parseFloat(props.customer.total_send) ===
                          "number"
                            ? parseFloat(props.customer.total_send).toFixed(2)
                            : props.customer.total_send}
                          {/* {props.customer.total_send} */}
                        </td>
                      </tr>
                      <tr>
                        <th>Total Received:</th>
                        <td>
                          {globalConstants.CURRENCY_SYMBOL}&nbsp;
                          {typeof parseFloat(props.customer.total_receive) ===
                          "number"
                            ? parseFloat(props.customer.total_receive).toFixed(
                                2
                              )
                            : props.customer.total_receive}
                          {/* {props.customer.total_receive} */}
                        </td>
                      </tr>
                      <tr>
                        <th>Total Topup:</th>
                        <div className="d-flex align-items-center">
                          <td>
                            {globalConstants.CURRENCY_SYMBOL}&nbsp;
                            {typeof parseFloat(props.customer.total_topup) ===
                            "number"
                              ? parseFloat(props.customer.total_topup).toFixed(
                                  2
                                )
                              : props.customer.total_topup}
                            {/* {props.customer.total_topup} */}
                          </td>
                          {props.customer.total_topup &&
                          !isNaN(parseFloat(props.customer.total_topup)) ? (
                            <CPopover
                              content={
                                <div>
                                  <table
                                    style={{
                                      border: "1px solid #ccc",
                                      borderCollapse: "collapse",
                                      width: "100%",
                                      marginTop: "8px",
                                    }}
                                  >
                                    <thead
                                      style={{
                                        backgroundColor: "#f2f2f2",
                                      }}
                                    >
                                      <tr>
                                        <th
                                          style={{
                                            border: "1px solid #ccc",
                                            padding: "4px",
                                          }}
                                        >
                                          Total Topup via Card
                                        </th>
                                        <th
                                          style={{
                                            border: "1px solid #ccc",
                                            padding: "4px",
                                          }}
                                        >
                                          Total Topup via Manual
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      <tr>
                                        <td
                                          style={{
                                            border: "1px solid #ccc",
                                            padding: "4px",
                                          }}
                                        >
                                          {globalConstants.CURRENCY_SYMBOL}
                                          &nbsp;
                                          {typeof parseFloat(
                                            props.customer.total_topup_via_card
                                          ) === "number"
                                            ? parseFloat(
                                                props.customer
                                                  .total_topup_via_card
                                              ).toFixed(2)
                                            : props.customer
                                                .total_topup_via_card}
                                          {/* {props.customer.total_topup_via_card} */}
                                        </td>
                                        <td
                                          style={{
                                            border: "1px solid #ccc",
                                            padding: "4px",
                                          }}
                                        >
                                          {globalConstants.CURRENCY_SYMBOL}
                                          &nbsp;
                                          {typeof parseFloat(
                                            props.customer
                                              .total_topup_via_manual
                                          ) === "number"
                                            ? parseFloat(
                                                props.customer
                                                  .total_topup_via_manual
                                              ).toFixed(2)
                                            : props.customer
                                                .total_topup_via_manual}
                                          {/* {
                                            props.customer
                                              .total_topup_via_manual
                                          } */}
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </div>
                              }
                            >
                              <FontAwesomeIcon
                                style={{
                                  marginLeft: "8px",
                                  cursor: "pointer",
                                }}
                                icon={faInfoCircle}
                                // onClick={() => this.handleIconClick(u.id)}
                              />
                            </CPopover>
                          ) : null}
                        </div>
                      </tr>
                      <tr>
                        <th>Available Balance:</th>
                        <td>
                          {globalConstants.CURRENCY_SYMBOL}&nbsp;
                          {typeof parseFloat(
                            props.customer.available_balance
                          ) === "number"
                            ? parseFloat(
                                props.customer.available_balance
                              ).toFixed(2)
                            : props.customer.available_balance}
                        </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </CCardBody>
              <CCardFooter>
                <CLink
                  className="btn btn-danger btn-sm"
                  aria-current="page"
                  to="/admin/customer_reports"
                >
                  {" "}
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back
                </CLink>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
};

export default Fullpage;
