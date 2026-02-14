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
  CSelect,
} from "@coreui/react";
import {
  notify,
  _canAccess,
  history,
  capitalize,
} from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileExport,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import InputDateRange from "components/admin/InputDateRange";
import { reportsService } from "services/admin/reports.service";
import "../business_customers/kycTable.css";
import "assets/css/page.css";
import "assets/css/responsive.css";
import { globalConstants } from "constants/admin/global.constants";
import WrapAmount from "components/wrapper/WrapAmount";

class Savings_Jar_Reports_Index extends React.Component {
  constructor(props) {
    super(props);

    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      filters: {
        fromDate: "",
        toDate: "",
      },
      showDateFilter: false,
      filtersChanged: false,
      allFilters: {
        from_date: "",
        to_date: "",
      },
      fields: {
        page: 1,
        direction: "desc",
        sort: "created_at",
        search_name: "",
        totalPage: 1,
        from_date: null,
        to_date: null,
        per_page: 10,
        operation_type: "saving_jar_report",
      },
      savings_jar_report: [],
      _openPopup: false,
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/dashboard");
    }
  }

  componentDidMount() {
    this.getSavingsJarReport();
  }

  getSavingsJarReport() {
    reportsService.getSavingsJarReport(this.state.fields).then((res) => {
      if (!res.success) {
        this.setState({
          savings_jar_report: [],
        });
      } else {
        this.setState({
          totalRecords: res.data.pagination?.total,
          fields: {
            ...this.state.fields,
            totalPage: res?.data?.pagination?.last_page,
          },
          perPage: res?.data?.pagination?.per_page,
          savings_jar_report: res.data.jars,
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
        this.getSavingsJarReport();
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
        this.getSavingsJarReport();
      }
    );
  }

  //   handleChange(e) {
  //     const { name, value } = e.target;
  //     this.setState({ fields: { ...this.state.fields, [name]: value } });
  //   }

  handleChange = (event) => {
    const { name, value } = event.target;

    this.setState((prevState) => ({
      fields: {
        ...prevState.fields,
        [name]: name === "per_page" ? parseInt(value, 10) : value, // Convert 'per_page' to an integer
      },
    }));
  };

  handleSearch(type) {
    if (type === "reset") {
      this.setState(
        {
          allFilters: {
            from_date: "",
            to_date: "",
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
            search_name: "",
            totalPage: 1,
            from_date: null,
            to_date: null,
            per_page: 10,
            operation_type: "saving_jar_report",
          },
        },
        () => {
          this.getSavingsJarReport(this.state.fields);
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
          this.getSavingsJarReport(this.state.fields);
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
        const reqParams = {
          ...this.state.fields,
          operation_type: "saving_jar_report_export",
        };
        const { data, message, success } =
          await reportsService.getSavingsJarReport(reqParams);
        if (!success) throw message;
        if (typeof message === "string") notify.success(message);
        const base64csv = data;
        const dtnow = new Date().toISOString();
        const csvContent = atob(base64csv);
        const blob = new Blob([csvContent], { type: "text/csv" });
        const downloadLink = document.createElement("a");
        const fileName = `SAVINGS_JAR_REPORT_${dtnow}.csv`;
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
                          name="search_name"
                          value={this.state.fields.search_name}
                          onChange={this.handleChange}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search_name");
                            }
                          }}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
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
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Per Page</CLabel>
                        <CSelect
                          id="per_page"
                          className={""}
                          placeholder="Per Page"
                          name="per_page"
                          value={this.state.fields.per_page}
                          onChange={this.handleChange}
                          style={{ cursor: "pointer" }}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search");
                            }
                          }}
                        >
                          {/* <option value="">-- Select Type --</option> */}
                          <option value={10}>10</option>
                          <option value={50}>50</option>
                          <option value={100}>100</option>
                          <option value={200}>200</option>
                        </CSelect>
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
                <strong>Sub-accounts Report</strong>
                <div className="card-header-actions">
                  {_canAccess("saving_jars_reports", "view") && (
                    <CTooltip content={globalConstants.EXPORT_JARS_DATA}>
                      <CLink
                        className={`btn btn-dark btn-block ${
                          this.state.savings_jar_report?.length === 0 ||
                          this.state.savings_jar_report?.length === undefined
                            ? "disabled"
                            : ""
                        }`}
                        aria-current="page"
                        onClick={
                          this.state.savings_jar_report?.length > 0
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
                        <th onClick={() => this.handleColumnSort("jar_name")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Sub-account Name
                            </span>
                            {this.state.fields.sort !== "jar_name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "jar_name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "jar_name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("name")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Owner Name
                            </span>
                            {this.state.fields.sort !== "name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th
                          onClick={() =>
                            this.handleColumnSort("owner_account_number")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Account Number
                            </span>
                            {this.state.fields.sort !==
                              "owner_account_number" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort ===
                                "owner_account_number" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort ===
                                "owner_account_number" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th>Mobile Number</th>

                        <th onClick={() => this.handleColumnSort("user_type")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              User Type
                            </span>
                            {this.state.fields.sort !== "user_type" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "user_type" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "user_type" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th
                          onClick={() =>
                            this.handleColumnSort("jar_category_name")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Sub-account Category
                            </span>
                            {this.state.fields.sort !== "jar_category_name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort ===
                                "jar_category_name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort ===
                                "jar_category_name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th>Deposite Amount</th>
                        <th>Target Amount</th>
                        <th>Target Date</th>
                        <th onClick={() => this.handleColumnSort("created_at")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Created Date
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
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.savings_jar_report?.length > 0 ? (
                        this.state.savings_jar_report.map((u, index) => (
                          <tr key={index + 1}>
                            <td>
                              {this.state.fields.page >= 2
                                ? index + 1 + 10 * (this.state.fields.page - 1)
                                : index + 1}
                            </td>
                            <td>{u.jar_name}</td>
                            <td>{u.name}</td>
                            <td>{u.owner_account_number}</td>
                            <td>{`+${u.mobile_number}`}</td>
                            <td>{capitalize(u.user_type)}</td>
                            <td>{capitalize(u.jar_category_name)}</td>
                            <td>
                              <WrapAmount value={u.deposite_amount} />
                            </td>
                            <td>
                              <WrapAmount value={u.target_amount} />
                            </td>
                            <td>
                              {u.target_date &&
                                u.target_date.split("-").reverse().join("/")}
                            </td>
                            <td>
                              {u.created_at &&
                                u.created_at.split("-").reverse().join("/")}
                            </td>
                            <td>{u.status ? "Active" : "Inactive"}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {this.state?.savings_jar_report?.length > 0 ? (
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

export default Savings_Jar_Reports_Index;
