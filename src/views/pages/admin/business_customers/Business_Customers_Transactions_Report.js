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
  CSelect,
  CTooltip,
  CLink,
} from "@coreui/react";
// import { agentService } from "../../../../services/admin/agent.service";
import { reportsService } from "../../../../services/admin/reports.service";
import {
  notify,
  _canAccess,
  history,
  _loginUsersDetails,
} from "../../../../_helpers/index";
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

class Business_Customers_Transactions_Report extends React.Component {
  constructor(props) {
    super(props);

    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);

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
        name: "",
        txn_type: "",
        type: "",
        totalPage: 1,
        from_date: null,
        to_date: null,
        from_date1: null,
        to_date1: null,
        status: "",
        account_number: this.props.account_number,
        detail_type: this.props.activeTab,
      },
      transactions_list: [],
      _openPopup: false,
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/business_customers");
    }
  }

  componentDidMount() {
    this.getTransactionList();
  }

  getTransactionList() {
    businessCustomersService
      .getCustomerWiseDetails(this.state.fields)
      .then((res) => {
        if (res.success === false) {
          this.setState({
            totalRecords: res.data?.pagination?.total,
            fields: {
              ...this.state.fields,
            },
            transactions_list: res.data?.transaction,
          });
          //   notify.error(res.message);
        } else {
          this.setState({
            totalRecords: res.data.pagination.total,
            fields: {
              ...this.state.fields,
              totalPage: res?.data?.pagination?.last_page,
            },
            transactions_list: res.data.transaction,
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
        this.getTransactionList();
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
        this.getTransactionList();
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
            txn_type: "",
            type: "",
            totalPage: 1,
            status: "",
            from_date: null,
            to_date: null,
            from_date1: null,
            to_date1: null,
            account_number: this.props.account_number,
            detail_type: this.props.activeTab,
          },
        },
        () => {
          this.getTransactionList(this.state.fields);
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
          this.getTransactionList(this.state.fields);
        }
      );
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }

  handleFieldChange = (inputFieldId, inputFieldValue) => {
    this.setState({ [inputFieldId]: inputFieldValue });
  };

  handleAllChecked = (event) => {
    let multiactions = this.state.multiaction;
    for (var key in multiactions) {
      multiactions[key] = event.target.checked;
    }
    this.setState({
      multiaction: multiactions,
      allCheckedbox: event.target.checked,
    });
  };

  //   downloadFile = async () => {
  //     const { search, txn_type, status, from_date, to_date } = this.state.fields;
  //     reportsService
  //       .downloadTransactionCSV({ search, txn_type, status, from_date, to_date })
  //       .then((res) => {
  //         //if (res.success) {
  //         notify.success("Successfully send report logged in user mail");
  //         //}
  //       });
  //   };

  handledateChange = (date) => {
    this.setState({
      fields: {
        ...this.state.fields,
        from_date1: date,
        from_date: date.toLocaleDateString("en-US"),
      },
    });
  };

  handledateChangeTo = (date) => {
    this.setState({
      fields: {
        ...this.state.fields,
        to_date1: date,
        to_date: date.toLocaleDateString("en-US"),
      },
    });
  };

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
    const current_user = _loginUsersDetails();

    const downloadFile = async () => {
      try {
        // const { search, status, start_date, end_date, sort_field, sort_dir } =
        //   this.state.fields;
        // const reqParams = {
        //   filter_search: search,
        //   filter_start_date: start_date,
        //   filter_end_date: end_date,
        //   filter_sort_dir: sort_dir,
        //   filter_sort_field: sort_field,
        //   filter_status: status,
        // };

        const { data, message, success } =
          await businessCustomersService.downloadReportData(this.state.fields);
        if (!success) throw message;
        if (typeof message === "string") notify.success(message);
        const base64csv = data;
        const dtnow = new Date().toISOString();
        const csvContent = atob(base64csv);
        const blob = new Blob([csvContent], { type: "text/csv" });
        const downloadLink = document.createElement("a");
        const fileName = `BUSINESS_TRANSACTION_REPORT_${dtnow}.csv`;
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
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="txn_type">Transaction Type</CLabel>
                        <CSelect
                          id="txn_type"
                          placeholder="Transaction Type"
                          name="txn_type"
                          value={this.state.fields.txn_type}
                          onChange={this.handleChange}
                          style={{ cursor: "pointer" }}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search");
                            }
                          }}
                        >
                          <option value="">-- Select Type --</option>
                          <option value="PL">Deposit</option>
                          <option value="REQ">Request</option>
                          <option value="WW">Wallet to Wallet</option>
                          <option value="AGENT TOPUP">Agent Top Up</option>
                        </CSelect>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="status">Status</CLabel>
                        <CSelect
                          id="status"
                          placeholder="Status"
                          name="status"
                          value={this.state.fields.status}
                          onChange={this.handleChange}
                          style={{ cursor: "pointer" }}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search");
                            }
                          }}
                        >
                          <option value="">-- Select Status --</option>
                          {(this.state.fields.txn_type == "PL" ||
                            this.state.fields.txn_type == "WW" ||
                            this.state.fields.txn_type == "AGENT TOPUP") && (
                            <>
                              <option value="FAILED">Failed</option>
                              <option value="PAID">Paid</option>
                              <option value="PENDING">Pending</option>
                            </>
                          )}
                          {this.state.fields.txn_type == "REQ" && (
                            <>
                              <option value="CANCELLED">Cancelled</option>
                              <option value="DECLINED">Declined</option>
                              <option value="FAILED">Failed</option>
                              <option value="PAID">Paid</option>
                              <option value="PENDING">Pending</option>
                            </>
                          )}
                        </CSelect>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
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
                </CRow>
                {/* <CRow>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CFormGroup>
                          <CLabel htmlFor="from_date">From Date</CLabel>
                          <DatePicker
                            selected={this.state.fields.from_date1}
                            onChange={(date) => this.handledateChange(date)}
                            name="from_date"
                            dateCaption=""
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </CFormGroup>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CFormGroup>
                          <CLabel htmlFor="name">To Date</CLabel>
                          <DatePicker
                            minDate={this.state.fields.from_date1}
                            selected={this.state.fields.to_date1}
                            onChange={(date) => this.handledateChangeTo(date)}
                            dateCaption=""
                            dateFormat="dd/MM/yyyy"
                            className="form-control"
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </CFormGroup>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow> */}

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
                <strong>Transaction Details</strong>
                {/* <div className="card-header-actions">
                  {_canAccess("transaction_reports", "view") && (
                    <CTooltip content={globalConstants.EXPORT_TRANSACTION_DATA}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        onClick={this.downloadFile}
                        to="#"
                      >
                        <FontAwesomeIcon icon={faFileExport} />
                      </CLink>
                    </CTooltip>
                  )}
                </div> */}
                <div className="card-header-actions">
                  {_canAccess("business_customers", "view") && (
                    <CTooltip content={globalConstants.EXPORT_REPORT}>
                      <CLink
                        className={`btn btn-dark btn-block ${
                          this.state.transactions_list?.length === 0 ||
                          this.state.transactions_list?.length === undefined
                            ? "disabled"
                            : ""
                        }`}
                        aria-current="page"
                        onClick={
                          this.state.transactions_list?.length > 0
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

                        <th
                          onClick={() =>
                            this.handleColumnSort("receiver_account_number")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Receiver account number
                            </span>
                            {this.state.fields.sort !==
                              "receiver_account_number" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort ===
                                "receiver_account_number" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort ===
                                "receiver_account_number" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th onClick={() => this.handleColumnSort("rname")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Receiver name
                            </span>
                            {this.state.fields.sort !== "rname" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "rname" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "rname" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th
                          onClick={() =>
                            this.handleColumnSort("sender_account_number")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Sender account number
                            </span>
                            {this.state.fields.sort !==
                              "sender_account_number" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort ===
                                "sender_account_number" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort ===
                                "sender_account_number" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th onClick={() => this.handleColumnSort("sname")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Sender name
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

                        <th onClick={() => this.handleColumnSort("amount")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Amount
                            </span>
                            {this.state.fields.sort !== "amount" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "amount" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "amount" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("fees")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Fees</span>
                            {this.state.fields.sort !== "fees" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "fees" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "fees" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("type")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Type</span>
                            {this.state.fields.sort !== "type" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "type" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "type" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("narration")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Narration
                            </span>
                            {this.state.fields.sort !== "narration" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "narration" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "narration" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("status")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Status
                            </span>
                            {this.state.fields.sort !== "status" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "status" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "status" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th
                          onClick={() => this.handleColumnSort("error_reason")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Error reason
                            </span>
                            {this.state.fields.sort !== "error_reason" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "error_reason" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "error_reason" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
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
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.transactions_list?.length > 0 ? (
                        this.state.transactions_list.map((u, index) => (
                          <tr key={index + 1}>
                            <td>
                              {this.state.fields.page >= 2
                                ? index + 1 + 10 * (this.state.fields.page - 1)
                                : index + 1}
                            </td>
                            <td>{u.ref_id}</td>
                            <td>{u.receiver_account_number}</td>
                            <td>{u.rname}</td>
                            <td>{u.sender_account_number}</td>
                            <td>{u.sname}</td>
                            <td>{parseFloat(u.amount).toFixed(2)}</td>
                            <td>{parseFloat(u.fees).toFixed(2)}</td>
                            <td>{u.type}</td>
                            <td>{u.narration}</td>
                            <td>{u.status}</td>
                            <td>{u.error_reason}</td>
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
                  {this.state?.transactions_list?.length > 0 ? (
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

export default Business_Customers_Transactions_Report;
