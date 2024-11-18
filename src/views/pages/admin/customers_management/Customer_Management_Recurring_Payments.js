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
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModal,
  CModalFooter,
  CButton,
} from "@coreui/react";
import {
  faEye,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { paymentsService } from "services/admin/payments.service";
import {
  notify,
  history,
  formatDate,
  _canAccess,
  capitalize,
} from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../recurring_payments/page.css";
import { globalConstants } from "constants/admin/global.constants";
import InputDateRange from "components/admin/InputDateRange";
import { customersManagementService } from "services/admin/customers_management.service";

class CustomerManagementRecurringPaymentsIndex extends React.Component {
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
        startDate: "",
        endDate: "",
      },
      showDateFilter: false,
      filtersChanged: false,
      allFilters: {
        start_date: "",
        end_date: "",
        status: "",
      },
      fields: {
        page: 1,
        sort_dir: "desc",
        sort_field: "created_at",
        search: "",
        start_date: null,
        start_date_in: null,
        end_date: null,
        end_date_in: null,
        account_number: this.props.account_number,
        detail_type: this.props.activeTab,
      },
      schedule_payments_list: [],
      _openPopup: false,
      _openDetailsPopup: false,
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/personal_customers");
    }
  }

  componentDidMount() {
    this.getRecurringPaymentsList();
  }

  getRecurringPaymentsList() {
    customersManagementService
      .getCustomerWiseDetails(this.state.fields)
      .then((res) => {
        if (res.success === false) {
          this.setState({
            totalRecords: res.data?.pagination?.total,
            fields: {
              ...this.state.fields,
            },
            schedule_payments_list: res.data?.schedule_payments,
          });
          //   notify.error(res.message);
        } else {
          this.setState({
            totalRecords: res.data.pagination.total,
            fields: {
              ...this.state.fields,
              totalPage: res?.data?.pagination?.last_page,
            },
            schedule_payments_list: res.data.schedule_payments,
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
        this.getRecurringPaymentsList();
      }
    );
  };

  handleColumnSort(fieldName) {
    this.setState(
      {
        fields: {
          ...this.state.fields,
          sort_dir: ["desc"].includes(this.state.fields.sort_dir)
            ? "asc"
            : "desc",
          sort_field: fieldName,
        },
      },
      () => {
        this.getRecurringPaymentsList();
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
            start_date: "",
            end_date: "",
            status: "",
          },
          filters: {
            startDate: "",
            endDate: "",
          },
          filtersChanged: false,
          fields: {
            page: 1,
            sort_dir: "desc",
            sort_field: "created_at",
            search: "",
            start_date: null,
            end_date: null,
            account_number: this.props.account_number,
            detail_type: this.props.activeTab,
          },
        },
        () => {
          this.getRecurringPaymentsList(this.state.fields);
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
          this.getRecurringPaymentsList(this.state.fields);
        }
      );
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }

  handleStartDateChange = (date) => {
    this.setState({
      fields: {
        ...this.state.fields,
        start_date_in: date,
        start_date: date.toLocaleDateString("en-US"),
      },
    });
  };

  handleEndDateChange = (date) => {
    this.setState({
      fields: {
        ...this.state.fields,
        end_date_in: date,
        end_date: date.toLocaleDateString("en-US"),
      },
    });
  };

  handleChangeDateFilter = (params) => {
    const [startDate, endDate] = params;
    // if (!startDate || !endDate) return;
    this.setState({
      fields: {
        ...this.state.fields,
        start_date: startDate?.toLocaleDateString("en-US"),
        end_date: endDate?.toLocaleDateString("en-US"),
      },
      filters: {
        startDate: startDate,
        endDate: endDate,
      },
      page: 1,
      showDateFilter: false,
      filtersChanged: true,
    });
  };

  openDetailsPopup(id) {
    paymentsService
      .recurringDetails({ recurring_payment_id: id })
      .then((res) => {
        if (res.success === false) {
          notify.error(res.message);
        } else {
          this.setState({
            _openDetailsPopup: true,
            res: res.data,
          });
        }
      });
    // this.setState({ _openDetailsPopup: true, res: parsedResponse });
  }

  render() {
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
                          startDate={this.state.filters.startDate}
                          endDate={this.state.filters.endDate}
                          onChange={this.handleChangeDateFilter}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>

                  {/* <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="start_date">Start Date</CLabel>
                        <div className="datepicker-container">
                          <DatePicker
                            placeholderText="Start date"
                            selected={this.state.fields.start_date_in}
                            onChange={(date) =>
                              this.handleStartDateChange(date)
                            }
                            name="start_date"
                            dateCaption=""
                            dateFormat="dd/MM/yyyy"
                            popperClassName="my-custom-datepicker-popper"
                            className="form-control"
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </div>
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">End Date</CLabel>
                        <div className="datepicker-container">
                          <DatePicker
                            placeholderText="End date"
                            minDate={this.state.fields.start_date_in}
                            selected={this.state.fields.end_date_in}
                            onChange={(date) => this.handleEndDateChange(date)}
                            dateCaption=""
                            dateFormat="dd/MM/yyyy"
                            popperClassName="my-custom-datepicker-popper"
                            className="form-control"
                            onKeyDown={(e) => {
                              e.preventDefault();
                            }}
                          />
                        </div>
                      </CCol>
                    </CFormGroup>
                  </CCol> */}
                </CRow>
                <CRow>
                  <CCol xl={2}>
                    <CFormGroup row>
                      <CCol xs="6">
                        <button
                          className="btn btn-dark btn-md"
                          onClick={() => this.handleSearch("search")}
                        >
                          Search
                        </button>
                      </CCol>
                      <CCol xs="6">
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
                <strong>Recurring Payments</strong>
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Sr.no</th>
                        <th
                          onClick={() => this.handleColumnSort("sender_name")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Sender Name
                            </span>
                            {this.state.fields.sort_field !== "sender_name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "sender_name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "sender_name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th
                          onClick={() => this.handleColumnSort("receiver_name")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Receiver Name
                            </span>
                            {this.state.fields.sort_field !==
                              "receiver_name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "receiver_name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "receiver_name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th
                          onClick={() =>
                            this.handleColumnSort("no_of_occurrence")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              No. of Occurrence
                            </span>
                            {this.state.fields.sort_field !==
                              "no_of_occurrence" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "no_of_occurrence" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "no_of_occurrence" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th
                          onClick={() =>
                            this.handleColumnSort("recurring_start_date")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Start Date
                            </span>
                            {this.state.fields.sort_field !==
                              "recurring_start_date" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "recurring_start_date" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "recurring_start_date" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th
                          onClick={() =>
                            this.handleColumnSort("recurring_end_date")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              End Date
                            </span>
                            {this.state.fields.sort_field !==
                              "recurring_end_date" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "recurring_end_date" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "recurring_end_date" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th onClick={() => this.handleColumnSort("amount")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Amount
                            </span>
                            {this.state.fields.sort_field !== "amount" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "amount" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "amount" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th onClick={() => this.handleColumnSort("created_at")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Created Date
                            </span>
                            {this.state.fields.sort_field !== "created_at" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "created_at" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "created_at" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th>Is Group?</th>

                        {_canAccess("recurring_payments", "view") && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.schedule_payments_list?.length > 0 ? (
                        this.state.schedule_payments_list.map((u, index) => (
                          <tr key={index + 1}>
                            <td>
                              {this.state.fields.page >= 2
                                ? index + 1 + 10 * (this.state.fields.page - 1)
                                : index + 1}
                            </td>
                            <td>{u.sender_name}</td>
                            <td>{u.receiver_name}</td>
                            <td>{u.no_of_occurrence}</td>
                            <td>{formatDate(u.recurring_start_date)}</td>
                            <td>{formatDate(u.recurring_end_date)}</td>
                            <td>
                              ANG&nbsp;
                              {typeof parseFloat(u.amount) === "number"
                                ? parseFloat(u.amount).toFixed(2)
                                : u.amount}
                            </td>
                            <td>{formatDate(u.created_at)}</td>
                            <td>
                              {u.is_group.toString() === "1" ? "Yes" : "No"}
                            </td>

                            <td className="d-flex">
                              {_canAccess("recurring_payments", "view") && (
                                <button
                                  className="btn btn-dark btn-block w-auto"
                                  onClick={() => this.openDetailsPopup(u.id)}
                                >
                                  <FontAwesomeIcon icon={faEye} />
                                </button>
                              )}
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
                  {this.state?.schedule_payments_list?.length > 0 ? (
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
        <CModal
          show={this.state._openDetailsPopup}
          onClose={() => {
            this.setState({
              _openDetailsPopup: !this.state._openDetailsPopup,
            });
          }}
          color="dark"
        >
          <CModalHeader closeButton className={"modal-close-button"}>
            <CModalTitle>Recurring Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {this.state.res && (
              <div cl>
                <p>
                  <strong>Sender Name:</strong> {this.state.res.sender_name}
                </p>
                <p>
                  <strong>Receiver Name:</strong> {this.state.res.receiver_name}
                </p>
                <p>
                  <strong>Frequence:</strong>{" "}
                  {capitalize(this.state.res.frequency)}
                </p>
                <p>
                  <strong>Occurrence:</strong> {this.state.res.no_of_occurrence}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {formatDate(this.state.res.recurring_start_date)}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {formatDate(this.state.res.recurring_end_date)}
                </p>
                <p>
                  <strong>Created Date:</strong> {this.state.res.created_date}
                </p>
                <p>
                  <strong>Amount:</strong>
                  {typeof parseFloat(this.state.res.amount) === "number"
                    ? parseFloat(this.state.res.amount).toFixed(2)
                    : this.state.res.amount}
                </p>
                <p>
                  <strong>Total Fees:</strong>{" "}
                  {typeof parseFloat(this.state.res.fees_total) === "number"
                    ? parseFloat(this.state.res.fees_total).toFixed(2)
                    : this.state.res.fees_total}
                </p>
                <p>
                  <strong>Is Group?:</strong>{" "}
                  {this.state.res.is_group?.toString() === "1" ? "Yes" : "No"}
                </p>
                <p>
                  <table>
                    <tr>
                      <th className="align-top">Recurring Dates:</th>{" "}
                      <td className="pl-5">
                        {Array.isArray(this.state.res.recurring_dates) ? (
                          <table className="nested-table">
                            <thead style={{ borderBottom: "1px solid" }}>
                              <tr>
                                <th>Date</th>
                                <th className="pl-4">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.res.recurring_dates?.map(
                                (dateItem, index) => (
                                  <tr key={index}>
                                    <td>
                                      {formatDate(dateItem.recurring_date)}
                                    </td>
                                    <td
                                      className={`status-${dateItem.status.toLowerCase()} pl-4`}
                                    >
                                      {dateItem.status?.toLowerCase() ===
                                      "pending"
                                        ? "UPCOMING"
                                        : dateItem.status?.toLowerCase() ===
                                          "paid"
                                        ? "SUCCESS"
                                        : dateItem.status?.toUpperCase()}
                                    </td>
                                  </tr>
                                )
                              )}
                            </tbody>
                          </table>
                        ) : (
                          this.state.res.recurring_dates
                        )}
                      </td>
                    </tr>
                  </table>
                </p>
                {/* <p>
                  <li>
                    <strong>Merchant ID:</strong>{" "}
                    {this.state.res.data.sender_name}
                  </li>
                  <li>
                    <strong>Merchant Transaction ID:</strong>{" "}
                    {this.state.res.data.merchantTransactionId}
                  </li>
                  <li>
                    <strong>Transaction ID:</strong>{" "}
                    {this.state.res.data.transactionId}
                  </li>
                  <li>
                    <strong>Amount:</strong>{" "}
                    {(this.state.res.data.amount / 100)?.toFixed(2)}
                  </li>
                  <li>
                    <strong>State:</strong> {this.state.res.data.state}
                  </li>
                  <li>
                    <strong>Response Code:</strong>{" "}
                    {this.state.res.data.responseCode}
                  </li>
                  {this.state.res.data.paymentInstrument && (
                    <li>
                      <strong>Payment Instrument:</strong>{" "}
                      <ul>
                        <li>
                          <strong>Type:</strong>{" "}
                          {this.state.res.data.paymentInstrument.type || "-"}
                        </li>
                        <li>
                          <strong>UTR:</strong>{" "}
                          {this.state.res.data.paymentInstrument.utr || "-"}
                        </li>
                        <li>
                          <strong>Account Type:</strong>{" "}
                          {this.state.res.data.paymentInstrument.accountType ||
                            "-"}
                        </li>
                      </ul>
                    </li>
                  )}
                </p> */}
              </div>
            )}
          </CModalBody>

          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                this.setState({
                  _openDetailsPopup: !this.state._openDetailsPopup,
                });
              }}
            >
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    );
  }
}

export default CustomerManagementRecurringPaymentsIndex;
