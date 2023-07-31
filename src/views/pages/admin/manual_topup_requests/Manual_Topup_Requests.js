import React, { useState } from "react";
import FilterContainer from "components/admin/FilterContainer";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { globalConstants } from "constants/admin/global.constants";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CTooltip,
  CLink,
  CPagination,
} from "@coreui/react";
import useGetManualRequests from "./useGetManualRequests";

const REQUEST_ITEM_HEADERS = [
  "Request From",
  "Bank Name",
  "Date",
  "Amount",
  "Status",
];

const Manual_Topup_Request = () => {
  const [currentPage, setCurrentPage] = useState();
  const [filters, setFilters] = useState({
    search: "",
    status: [],
    start_date: "",
    end_date: "",
  });
  const [pagination, manualRequests] = useGetManualRequests({
    page: currentPage,
    search: filters.search,
    status: filters.status,
    start_date: filters.start_date,
    end_date: filters.end_date,
  });

  const handleApplyFilter = async (filters) => {
    setCurrentPage(1);
    setFilters({
      search: filters?.search || "",
      status: filters?.statuses || "",
      start_date: filters?.startDate || "",
      end_date: filters?.endDate || "",
    });
  };

  return (
    <div>
      <FilterContainer
        statusOptions={globalConstants.MANUAL_TOPUP_STATUS_FILTER}
        handleSearchCallback={handleApplyFilter}
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
                      const fixedAmount =
                        amount !== null ? parseFloat(amount).toFixed(2) : "";
                      return (
                        <tr key={transaction_id || index}>
                          <td>{index + 1}</td>
                          <td>{name}</td>
                          <td>{bank_name}</td>
                          <td>{date}</td>
                          <td>{fixedAmount}</td>
                          <td>{status}</td>
                          <td>
                            <CTooltip
                              content={
                                globalConstants.VIEW_MANUAL_TOPUP_DETAILS
                              }
                            >
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
              <CPagination
                activePage={pagination?.current_page || 1}
                pages={pagination?.last_page || 1}
                onActivePageChange={(page) => setCurrentPage(page)}
                doubleArrows={true}
                align="end"
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Manual_Topup_Request;
