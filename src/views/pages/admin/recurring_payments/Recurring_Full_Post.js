import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CContainer,
  CCardFooter,
  CLink,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { formatDate, history } from "_helpers";
import "./page.css";
import "./details.css";

const RecurringFullPost = (props) => {
  if (!props.recurring_details) {
    history.push("/admin/recurring_payments");
    return null;
  }

  const {
    sender_name,
    amount,
    created_date,
    fees_total,
    frequency,
    is_group,
    no_of_occurrence,
    receiver_name,
    recurring_end_date,
    recurring_start_date,
    recurring_dates,
  } = props?.recurring_details;
  return (
    <>
      <CContainer fluid className="recurring-details-container">
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardHeader>
                <h5>Recurring Payment Details</h5>
              </CCardHeader>
              <CCardBody>
                <table cellPadding={12} cellSpacing={12}>
                  <tr>
                    <th>Sender Name:</th>
                    <td>{sender_name}</td>
                  </tr>
                  <tr>
                    <th>Receiver Name:</th>
                    <td>
                      {Array.isArray(receiver_name) ? (
                        <table className="nested-table">
                          <thead>
                            <tr>
                              <th>Member Name</th>
                              <th>Specification</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {receiver_name.map((item, index) => (
                              <tr key={index}>
                                <td>{item.member_name}</td>
                                <td>{item.specification}</td>
                                <td>{item.amount?.toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        receiver_name
                      )}
                    </td>
                  </tr>

                  <tr>
                    <th>Frequency:</th>
                    <td>{frequency?.toUpperCase()}</td>
                  </tr>
                  <tr>
                    <th>Occurrences:</th>
                    <td>{no_of_occurrence}</td>
                  </tr>
                  <tr>
                    <th>Start Date:</th>
                    <td>{formatDate(recurring_start_date)}</td>
                  </tr>
                  <tr>
                    <th>End Date:</th>
                    <td>{formatDate(recurring_end_date)}</td>
                  </tr>
                  <tr>
                    <th>Created Date:</th>
                    <td>{created_date}</td>
                  </tr>
                  <tr>
                    <th>Amount:</th>
                    <td>
                      {typeof parseFloat(amount) === "number"
                        ? parseFloat(amount).toFixed(2)
                        : amount}
                    </td>
                  </tr>
                  <tr>
                    <th>Total Fees:</th>
                    <td>
                      {typeof parseFloat(fees_total) === "number"
                        ? parseFloat(fees_total).toFixed(2)
                        : fees_total}
                    </td>
                  </tr>
                  <tr>
                    <th>Is Group?:</th>
                    <td>{is_group?.toString() === "1" ? "Yes" : "No"}</td>
                  </tr>
                  <tr>
                    <th>Recurring Dates:</th>
                    <td>
                      {Array.isArray(recurring_dates) ? (
                        <table className="nested-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recurring_dates?.map((dateItem, index) => (
                              <tr key={index}>
                                <td>{formatDate(dateItem.recurring_date)}</td>
                                <td
                                  className={`status-${dateItem.status.toLowerCase()}`}
                                >
                                  {dateItem.status?.toLowerCase() === "pending"
                                    ? "UPCOMING"
                                    : dateItem.status?.toLowerCase() === "paid"
                                    ? "SUCCESS"
                                    : dateItem.status?.toUpperCase()}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        recurring_dates
                      )}
                    </td>
                  </tr>
                </table>
              </CCardBody>
              <CCardFooter>
                <CLink
                  className="btn btn-danger btn-sm"
                  aria-current="page"
                  to="/admin/recurring_payments"
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

export default RecurringFullPost;
