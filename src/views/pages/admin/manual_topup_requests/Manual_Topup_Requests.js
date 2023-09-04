import React, { useState } from "react";
import FilterContainer from "components/admin/FilterContainer";
import {
  faEye,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { globalConstants } from "constants/admin/global.constants";
import useGetManualRequests from "./useGetManualRequests";
import WrapAmount from "components/wrapper/WrapAmount";
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

const REQUEST_ITEM_HEADERS = [
  { label: "Request From", field: "name" },
  { label: "Bank Name", field: "bank_name" },
  { label: "Date", field: "request_receive_date" },
  { label: "Amount", field: "amount" },
  { label: "Status", field: "status" },
];

const Manual_Topup_Request = () => {
  const [currentPage, setCurrentPage] = useState();
  const [filters, setFilters] = useState({
    search: "",
    status: [],
    start_date: "",
    end_date: "",
    sort_field: "request_receive_date",
    sort_dir: "desc",
  });
  const [pagination, manualRequests] = useGetManualRequests({
    page: currentPage,
    search: filters.search,
    status: filters.status,
    start_date: filters.start_date,
    end_date: filters.end_date,
    sort_field: filters.sort_field,
    sort_dir: filters.sort_dir,
  });

  const handleApplyFilter = async (upfilters) => {
    setCurrentPage(1);
    setFilters({
      search: upfilters?.search || "",
      status: upfilters?.statuses || "",
      start_date: upfilters?.startDate || "",
      end_date: upfilters?.endDate || "",
      sort_field: filters?.sort_field || "request_receive_date",
      sort_dir: filters?.sort_dir || "desc",
    });
  };

  const switchSortDirection = (sortDirect) => {
    switch (sortDirect) {
      case "asc":
        return "desc";
      case "desc":
        return "asc";
      default:
        return "asc";
    }
  };

  const handleApplySorting = async (sort_field = "request_receive_date") => {
    setCurrentPage(1);
    const isSortField = filters.sort_field === sort_field;
    const sort_dir = switchSortDirection(isSortField ? filters.sort_dir : "");
    const muFilters = Object.assign({ ...filters }, { sort_field, sort_dir });
    setFilters(muFilters);
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
                      {REQUEST_ITEM_HEADERS?.map((header, index) => {
                        const isSort = filters.sort_field === header.field;
                        const sortDirect = filters.sort_dir;
                        return (
                          <th key={header.field || index}>
                            <span
                              className="sortCls"
                              onClick={header?.field != 'bank_name' ? () => handleApplySorting(header.field) : ''}
                            >
                              <span className="table-header-text-mrg">
                                {header?.label || ""}
                              </span>
                              {!isSort && header?.field != 'bank_name' && <FontAwesomeIcon icon={faSort} />}
                              {isSort && header?.field != 'bank_name' && sortDirect === "desc" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                              {isSort && header?.field != 'bank_name' && sortDirect === "asc" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                            </span>
                          </th>
                        );
                      })}
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
                          <td>
                            <WrapAmount value={amount} />
                          </td>
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
                    {manualRequests.length === 0 && (
                      <tr>
                        <td colSpan="5">No records found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <CPagination
                activePage={pagination?.current_page || 0}
                pages={pagination?.last_page || 0}
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
