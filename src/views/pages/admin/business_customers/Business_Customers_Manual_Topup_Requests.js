import React, { useState } from "react";
import FilterContainer from "components/admin/FilterContainer";
import {
  faEye,
  faFileExport,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { globalConstants } from "constants/admin/global.constants";
import useGetBusinessManualRequestForReport from "./useGetBusinessManualRequestForReport";
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
import { businessCustomersService } from "services/admin/business_customers.service";
import { _canAccess, notify } from "_helpers";

const REQUEST_ITEM_HEADERS = [
  { label: "Request From", field: "name" },
  // { label: "Bank Name", field: "bank_name" },
  { label: "Date", field: "request_receive_date" },
  { label: "Amount", field: "amount" },
  { label: "Status", field: "status" },
];

const Business_Customers_Manual_Topup_Requests = (props) => {
  const [currentPage, setCurrentPage] = useState();
  const [filters, setFilters] = useState({
    search: "",
    status: [],
    start_date: "",
    end_date: "",
    sort_field: "request_receive_date",
    sort_dir: "desc",
    account_number: props.account_number,
    detail_type: props.activeTab,
  });
  const [pagination, manualRequests] = useGetBusinessManualRequestForReport({
    page: currentPage,
    search: filters.search,
    status: filters.status,
    start_date: filters.start_date,
    end_date: filters.end_date,
    sort_field: filters.sort_field,
    sort_dir: filters.sort_dir,
    account_number: filters.account_number,
    detail_type: filters.detail_type,
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
      account_number: filters.account_number,
      detail_type: filters.detail_type,
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

  const downloadFile = async () => {
    try {
      const { data, message, success } =
        await businessCustomersService.downloadReportData(filters);
      if (!success) throw message;
      if (typeof message === "string") notify.success(message);
      const base64csv = data;
      const dtnow = new Date().toISOString();
      const csvContent = atob(base64csv);
      const blob = new Blob([csvContent], { type: "text/csv" });
      const downloadLink = document.createElement("a");
      const fileName = `${filters.account_number}_WITHDRAW_REQUEST_REPORT_${dtnow}.csv`;
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = fileName;
      downloadLink.click();
    } catch (error) {
      if (typeof error === "string") notify.error(error);
    }
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
            <CCardHeader>
              <strong>Manual Top Up Requests</strong>
              <div className="card-header-actions">
                {_canAccess("business_customers", "view") && (
                  <CTooltip content={globalConstants.EXPORT_REPORT}>
                    <CLink
                      className={`btn btn-dark btn-block ${
                        manualRequests?.length === 0 ||
                        manualRequests?.length === undefined
                          ? "disabled"
                          : ""
                      }`}
                      aria-current="page"
                      onClick={manualRequests?.length > 0 ? downloadFile : null}
                      to="#"
                    >
                      <FontAwesomeIcon icon={faFileExport} />
                    </CLink>
                  </CTooltip>
                )}
              </div>
            </CCardHeader>
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
                              onClick={
                                header?.field != "bank_name"
                                  ? () => handleApplySorting(header.field)
                                  : ""
                              }
                            >
                              <span className="table-header-text-mrg">
                                {header?.label || ""}
                              </span>
                              {!isSort && header?.field != "bank_name" && (
                                <FontAwesomeIcon icon={faSort} />
                              )}
                              {isSort &&
                                header?.field != "bank_name" &&
                                sortDirect === "desc" && (
                                  <FontAwesomeIcon icon={faSortUp} />
                                )}
                              {isSort &&
                                header?.field != "bank_name" &&
                                sortDirect === "asc" && (
                                  <FontAwesomeIcon icon={faSortDown} />
                                )}
                            </span>
                          </th>
                        );
                      })}
                      {/* <th>Action</th> */}
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
                          <td>
                            {currentPage >= 2
                              ? index + 1 + 10 * (currentPage - 1)
                              : index + 1}
                          </td>
                          <td>{name}</td>
                          {/* <td>{bank_name}</td> */}
                          <td>{date}</td>
                          <td>
                            <WrapAmount value={amount} />
                          </td>
                          <td>{status}</td>
                          {/* <td>
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
                          </td> */}
                        </tr>
                      );
                    })}
                    {manualRequests?.length === 0 && (
                      <tr>
                        <td colSpan="5">No records found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {manualRequests?.length > 0 && (
                <CPagination
                  activePage={pagination?.current_page || 0}
                  pages={pagination?.last_page || 0}
                  onActivePageChange={(page) => setCurrentPage(page)}
                  doubleArrows={true}
                  align="end"
                />
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

export default Business_Customers_Manual_Topup_Requests;
