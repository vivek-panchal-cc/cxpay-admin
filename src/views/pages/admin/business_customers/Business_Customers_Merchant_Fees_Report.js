import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CPagination,
  CFormGroup,
  CInput,
  CLabel,
  CTooltip,
  CLink,
} from "@coreui/react";
import { notify, _canAccess, history } from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import InputDateRange from "components/admin/InputDateRange";
import { businessCustomersService } from "services/admin/business_customers.service";
import "../business_customers/kycTable.css";
import "assets/css/page.css";
import "assets/css/responsive.css";
import { globalConstants } from "constants/admin/global.constants";

class Business_Customers_Merchant_Fees_Report extends React.Component {
  constructor(props) {
    super(props);

    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      account_number: this.props.account_number,
      activeTab: this.props.activeTab,
      filters: {
        fromDate: "",
        toDate: "",
      },
      showDateFilter: false,
      filtersChanged: false,
      allFilters: {
        from_date: "",
        to_date: "",
        status: "",
      },
      fields: {
        page: 1,
        direction: "desc",
        sort: "created_at",
        search: "",
        totalPage: 1,
        from_date: null,
        to_date: null,
        from_date1: null,
        to_date1: null,
        status: "",
        account_number: this.props.account_number,
      },
      merchant_fees_report: [],
      _openPopup: false,
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/business_customers");
    }
  }

  componentDidMount() {
    this.getMerchantFeesReport();
  }

  getMerchantFeesReport() {
    businessCustomersService
      .getMerchantFeesReport(this.state.fields)
      .then((res) => {
        if (!res.success) {
          this.setState({
            merchant_fees_report: [],
          });
        } else {
          this.setState({
            totalRecords: res.data.pagination?.total,
            fields: {
              ...this.state.fields,
              totalPage: res?.data?.pagination?.last_page,
            },
            merchant_fees_report: res.data.transaction,
          });
        }
      });
  }

  pageChange = (newPage) => {
    newPage = newPage === 0 ? 1 : newPage;
    this.setState(
      {
        fields: {
          ...this.state.fields,
          page: newPage,
        },
      },
      () => {
        this.getMerchantFeesReport();
      }
    );
  };

  handleColumnSort(fieldName) {
    this.setState(
      {
        fields: {
          ...this.state.fields,
          direction: ["desc"].includes(this.state.fields.direction)
            ? "asc"
            : "desc",
          sort: fieldName,
        },
      },
      () => {
        this.getMerchantFeesReport();
      }
    );
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }

  handleSearch(type) {
    if (type === "reset") {
      this.setState(
        {
          allFilters: {
            from_date: "",
            to_date: "",
            status: "",
          },
          filters: {
            fromDate: "",
            toDate: "",
          },
          filtersChanged: false,
          fields: {
            page: 1,
            direction: "desc",
            sort: "created_at",
            search: "",
            totalPage: 1,
            status: "",
            from_date: null,
            to_date: null,
            from_date1: null,
            to_date1: null,
            account_number: this.props.account_number,
          },
        },
        () => {
          this.getMerchantFeesReport(this.state.fields);
        }
      );
    } else {
      this.setState(
        {
          fields: {
            ...this.state.fields,
            page: 1,
          },
        },
        () => {
          this.getMerchantFeesReport(this.state.fields);
        }
      );
    }
  }

  handleChangeDateFilter = (params) => {
    const [fromDate, toDate] = params;
    this.setState({
      fields: {
        ...this.state.fields,
        from_date: fromDate?.toLocaleDateString("en-US"),
        to_date: toDate?.toLocaleDateString("en-US"),
      },
      filters: {
        fromDate: fromDate,
        toDate: toDate,
      },
      page: 1,
      showDateFilter: false,
      filtersChanged: true,
    });
  };

  render() {
    const downloadFile = async () => {
      try {
        const { data, message, success } =
          await businessCustomersService.downloadMerchantFeesReportData(
            this.state.fields
          );
        if (!success) throw message;
        if (typeof message === "string") notify.success(message);
        const base64csv = data;
        const dtnow = new Date().toISOString();
        const csvContent = atob(base64csv);
        const blob = new Blob([csvContent], { type: "text/csv" });
        const downloadLink = document.createElement("a");
        const fileName = `${this.state.fields.account_number}_MERCHANT_FEES_REPORT_${dtnow}.csv`;
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = fileName;
        downloadLink.click();
      } catch (error) {
        if (typeof error === "string") notify.error(error);
      }
    };

    return (
      <>
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardBody>
                <CRow>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Search</CLabel>
                        <CInput
                          id="search"
                          placeholder="Search"
                          name="search"
                          value={this.state.fields.search}
                          onChange={this.handleChange}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search");
                            }
                          }}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={4}>
                    <CFormGroup row>
                      <CCol xs="10">
                        <CLabel htmlFor="name">Date</CLabel>
                        <InputDateRange
                          className=""
                          startDate={this.state.filters.fromDate}
                          endDate={this.state.filters.toDate}
                          onChange={this.handleChangeDateFilter}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>

                <CRow>
                  <CCol xl={12}>
                    <CFormGroup row>
                      <CCol xs="1">
                        <button
                          className="btn btn-dark btn-md"
                          onClick={() => this.handleSearch("search")}
                        >
                          Search
                        </button>
                      </CCol>
                      <CCol xs="2">
                        <button
                          className="btn btn-dark btn-md"
                          onClick={() => this.handleSearch("reset")}
                        >
                          Clear
                        </button>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardHeader>
                <strong>Merchant Fees Report</strong>
                <div className="card-header-actions">
                  {_canAccess("business_customers", "view") && (
                    <CTooltip content={globalConstants.EXPORT_REPORT}>
                      <CLink
                        className={`btn btn-dark btn-block ${
                          this.state.merchant_fees_report?.length === 0 ||
                          this.state.merchant_fees_report?.length === undefined
                            ? "disabled"
                            : ""
                        }`}
                        aria-current="page"
                        onClick={
                          this.state.merchant_fees_report?.length > 0
                            ? downloadFile
                            : null
                        }
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
                        <th onClick={() => this.handleColumnSort("ref_id")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Transaction ID
                            </span>
                            {this.state.fields.sort !== "ref_id" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "ref_id" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "ref_id" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th onClick={() => this.handleColumnSort("sname")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Sender Name
                            </span>
                            {this.state.fields.sort !== "sname" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "sname" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "sname" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th
                          onClick={() => this.handleColumnSort("mobile_number")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Mobile Number
                            </span>
                            {this.state.fields.sort !== "mobile_number" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "mobile_number" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "mobile_number" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th>Received Amount</th>
                        <th>Fees</th>
                        <th>Transaction Cap</th>
                        <th>Specification</th>
                        <th onClick={() => this.handleColumnSort("created_at")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Transaction Date
                            </span>
                            {this.state.fields.sort !== "created_at" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "created_at" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "created_at" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.merchant_fees_report?.length > 0 ? (
                        this.state.merchant_fees_report.map((u, index) => (
                          <tr key={index + 1}>
                            <td>
                              {this.state.fields.page >= 2
                                ? index + 1 + 10 * (this.state.fields.page - 1)
                                : index + 1}
                            </td>
                            <td>{u.ref_id}</td>
                            <td>{u.sname}</td>
                            <td>{`+${u.mobile_number}`}</td>
                            <td>{parseFloat(u.amount).toFixed(2)}</td>
                            <td>{parseFloat(u.fees).toFixed(2)}</td>
                            <td>
                              {parseFloat(u.merchant_fees_capacity).toFixed(2)}
                            </td>
                            <td>{u.narration}</td>
                            <td>
                              {moment(u.created_at).format("DD-MM-YYYY HH:mm")}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {this.state?.merchant_fees_report?.length > 0 ? (
                    <CPagination
                      activePage={this.state.fields.page}
                      onActivePageChange={this.pageChange}
                      pages={this.state.fields.totalPage}
                      doubleArrows={true}
                      align="end"
                    />
                  ) : null}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default Business_Customers_Merchant_Fees_Report;
