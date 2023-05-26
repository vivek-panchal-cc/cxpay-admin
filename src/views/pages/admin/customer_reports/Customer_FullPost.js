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
} from "@coreui/react";

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
                  {props.customer.profile_image !== null &&
                    props.customer.profile_image !== undefined && (
                      <>
                        {
                          <img width={200} height={200}
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
                      {props.customer.first_name} {props.customer.last_name}
                    </td>
                  </tr>
                  <tr>
                    <th>Email:</th>
                    <td>{props.customer.email}</td>
                  </tr>
                  <tr>
                    <th>Mobile:</th>
                    <td>
                      {"+"}
                      {props.customer.mobile_number}
                    </td>
                  </tr>
                  <tr>
                    <th>Available Balance:</th>
                    <td>
                      {typeof parseFloat(props.customer.available_balance) ===
                      "number"
                        ? parseFloat(props.customer.available_balance).toFixed(
                            2
                          )
                        : props.customer.available_balance}
                    </td>
                  </tr>
                </table>
              </CCardBody>
              <CCardFooter></CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </>
  );
};

export default Fullpage;
