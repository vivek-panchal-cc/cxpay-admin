import React from "react";
import "./page.css";
import "./responsive.css";

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
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faSave } from "@fortawesome/free-solid-svg-icons";

const Fullpage = (props) => {
  console.log(props);
  return (
    <>
      <CContainer fluid>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <p className="title">
                  {props.withdraw.profile_image !== null &&
                    props.withdraw.profile_image !== undefined && (
                      <>
                        {
                          <img
                            width={200}
                            height={200}
                            src={
                              props.withdraw.profile_image
                                ? props.withdraw.profile_image
                                : props.withdraw.user_type === "business"
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
                <div class="walllet-refund-wrapper wallet-refund-details-wrappper wr-bank-details-wrapper">
                  <div class="wr-title-wrap">
                    <h2>Transaction Details</h2>
                  </div>
                  <div class="wc-refund-main-wrap">
                    <div class="pattern-wrap pattern-wrap-top"></div>
                    <div class="wc-refund-main-inner">
                      <div class="wcr-innner-wrap wcr-innner-wrap-1 d-flex flex-wrap w-100">
                        <div class="wcr-img-wrap wbr-img-wrap">
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
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M20.6035 15.6509V32.632"
                                stroke="#363853"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M7.86719 15.6509V32.632"
                                stroke="#363853"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M33.3398 15.6509V32.632"
                                stroke="#363853"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                              <path
                                d="M1.5 39H39"
                                stroke="#363853"
                                stroke-width="3"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                              />
                            </svg>
                          </span>
                        </div>
                        <div class="wcr-info-main">
                          <div class="wcr-info-1 d-flex flex-wrap">
                            <div class="wcr-card-data">
                              <h2>{props.withdraw.bank_name}</h2>
                              <p>
                                xxxx xxxx xxxx{" "}
                                {props.withdraw.bank_account_number}
                              </p>
                            </div>
                            <div class="wcr-card-amt wbr-card-amt">
                              <p class="green font-bold">
                                {props.withdraw.status}
                              </p>
                              <h2>{props.withdraw.total_amount} NAFl</h2>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="wcr-info-2">
                        <h4 class="font-16-quick">Specifications</h4>
                        <p>{props.withdraw.narration}</p>
                      </div>
                      <div class="wcr-divider-wrap"></div>
                      <div class="wcr-innner-wrap wcr-innner-wrap-2 d-flex flex-wrap w-100">
                        <div class="w-50-md wcr-transition-info wcr-transition-info-1">
                          <table>
                            <tr>
                              <td>Transaction ID</td>
                              <td>{props.withdraw.activity_ref_id}</td>
                            </tr>
                            <tr>
                              <td>Date</td>
                              <td>{props.withdraw.date}</td>
                            </tr>
                            <tr>
                              <td>Time</td>
                              <td>{props.withdraw.time}</td>
                            </tr>
                          </table>
                        </div>
                        <div class="w-50-md wcr-transition-info wcr-transition-info-2">
                          <table>
                            <tr>
                              <td>Amount</td>
                              <td>{props.withdraw.amount} NAFl</td>
                            </tr>
                            <tr>
                              <td>Fees</td>
                              <td>{props.withdraw.fees} NAFl</td>
                            </tr>
                            <tr>
                              <td>Status</td>
                              <td>{props.withdraw.status}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      <div class="wcr-divider-wrap"></div>
                      <div class="wcr-innner-wrap wbr-innner-wrap-3 d-flex flex-wrap w-100 align-items-center">
                        <div class="wr-bdatail-tbl pe-md-4">
                          <div class="font-16-quick  w-100 pb-2 dark_blue font-600">
                            Bank Details
                          </div>
                          <table>
                            <tr>
                              <td>Bank Name</td>
                              <td>{props.withdraw.bank_name}</td>
                            </tr>
                            <tr>
                              <td>Account Number</td>
                              <td>
                                xxxx xxxx xxxx{" "}
                                {props.withdraw.bank_account_number}
                              </td>
                            </tr>
                            <tr>
                              <td>Swift Code</td>
                              <td>{props.withdraw.swift_code}</td>
                            </tr>
                          </table>
                        </div>

                        <div class="wr-bdatail-dwld ps-xl-5 ps-md-4 border-start">
                          <div class="font-16-quick  w-100 pb-md-4 pb-3 dark_blue font-600">
                            Transaction Reciept
                          </div>
                          <div class="wr-dwld-wrap">
                            <ul>
                              <li>
                                <button>
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
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M7 10L12 15L17 10"
                                      stroke="black"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                    <path
                                      d="M12 15V3"
                                      stroke="black"
                                      stroke-width="2"
                                      stroke-linecap="round"
                                      stroke-linejoin="round"
                                    />
                                  </svg>
                                </button>
                              </li>
                              <li></li>
                              <li></li>
                              <li></li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div class="wcr-divider-wrap"></div>
                      <div class="wcr-innner-wrap wbr-innner-wrap-3 d-flex flex-wrap w-100 align-items-center">
                        <div class="wr-bdatail-tbl pe-md-4">
                          <div class="font-16-quick  w-100 pb-2 dark_blue font-600">
                            Customer Details
                          </div>
                          <table>
                            <tr>
                              <td>Customer Name</td>
                              <td>{props.withdraw.name}</td>
                            </tr>
                            <tr>
                              <td>Email</td>
                              <td>{props.withdraw.email}</td>
                            </tr>
                            <tr>
                              <td>Mobile Number</td>
                              <td>{props.withdraw.mobile_number}</td>
                            </tr>
                          </table>
                        </div>
                      </div>
                      <div class="wcr-divider-wrap"></div>

                      <div class="wcr-innner-wrap wbr-innner-wrap-4">
                        <div class="font-16-quick  w-100 pb-2 dark_blue font-600">
                          Admin Comments
                        </div>
                        <p class="font-12 dark_blue">
                          {props.withdraw.comment}
                        </p>
                      </div>
                    </div>
                    <div class="pattern-wrap pattern-wrap-bottom"></div>
                  </div>
                </div>
              </CCardBody>
              <CCardFooter>
                &nbsp;
                <CLink
                  className="btn btn-danger btn-sm"
                  aria-current="page"
                  to="/admin/withdraw_requests"
                >
                  <FontAwesomeIcon icon={faBan} className="mr-1" />
                  Cancel
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
