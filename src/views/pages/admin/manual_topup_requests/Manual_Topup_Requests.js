import React, { useEffect, useState } from "react";
import FilterContainer from "components/admin/FilterContainer";
import { fundRequestService } from "services/admin/fund_request.service";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CTooltip,
  CLink,
} from "@coreui/react";

const REQUEST_ITEM_HEADERS = [
  "Request From",
  "Bank Name",
  "Date",
  "Amount",
  "Status",
];

const Manual_Topup_Request = () => {
  const [manualRequests, setManualRequests] = useState([]);

  const retrieveManualRequests = async () => {
    try {
      const response = await fundRequestService.getManualFundAddList();
      const { success, data, message = "" } = response || {};
      if (!success) throw message;
      const { manual_funds = [], pagination = {} } = data || {};
      setManualRequests(manual_funds);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    retrieveManualRequests();
  }, []);

  return (
    <div>
      <FilterContainer
        handleSearchCallback={(filData) => console.log(filData)}
      />
      <CRow>
        <CCol xl={12}>
          <CCard>
            <CCardHeader>Manual Topup Requests</CCardHeader>
            <CCardBody>
              <div className="position-relative table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Sr.no</th>
                      {REQUEST_ITEM_HEADERS?.map((header) => (
                        <th key={header} onClick={() => {}}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              {header}
                            </span>
                          </span>
                        </th>
                      ))}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {manualRequests?.map((item, index) => {
                      const {
                        amount,
                        bank_name,
                        date,
                        name,
                        status,
                        transaction_id,
                      } = item || {};
                      return (
                        <tr key={transaction_id || index}>
                          <td>{index + 1}</td>
                          <td>{name}</td>
                          <td>{bank_name}</td>
                          <td>{date}</td>
                          <td>{amount}</td>
                          <td>{status}</td>
                          <td>
                            <CTooltip content={""}>
                              <CLink
                                className="btn btn-dark btn-block"
                                style={{ width: "fit-content" }}
                                aria-current="page"
                                to={`/admin/manual_requests/detailview/${transaction_id}`}
                              >
                                <FontAwesomeIcon icon={faEye} />
                              </CLink>
                            </CTooltip>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Manual_Topup_Request;
