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
} from "@coreui/react";
import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { paymentsService } from "services/admin/payments.service";
import { notify, history } from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../schedule_payments/page.css";
import InputDateRange from "components/admin/InputDateRange";
import { customersManagementService } from "services/admin/customers_management.service";

class CustomerManagementSchedulePayments extends React.Component {
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
        sort_field: "payment_schedule_date",
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
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/personal_customers");
    }
  }

  componentDidMount() {
    this.getSchedulePaymentsList();
  }

  getSchedulePaymentsList() {
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
        this.getSchedulePaymentsList();
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
        this.getSchedulePaymentsList();
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
            sort_field: "payment_schedule_date",
            search: "",
            start_date: null,
            end_date: null,
            account_number: this.props.account_number,
            detail_type: this.props.activeTab,
          },
        },
        () => {
          this.getSchedulePaymentsList(this.state.fields);
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
          this.getSchedulePaymentsList(this.state.fields);
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
                <strong>Schedule Payments</strong>
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
                            this.handleColumnSort("overall_specification")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Overall Specification
                            </span>
                            {this.state.fields.sort_field !==
                              "overall_specification" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "overall_specification" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "overall_specification" && (
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

                        <th
                          onClick={() =>
                            this.handleColumnSort("payment_schedule_date")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Payment Date
                            </span>
                            {this.state.fields.sort_field !==
                              "payment_schedule_date" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "payment_schedule_date" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "payment_schedule_date" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th>Is Group?</th>
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
                            <td>{u.overall_specification}</td>
                            <td>
                              ANG&nbsp;
                              {typeof parseFloat(u.amount) === "number"
                                ? parseFloat(u.amount).toFixed(2)
                                : u.amount}
                            </td>
                            <td>{u.payment_schedule_date}</td>
                            <td>
                              {u.is_group.toString() === "1" ? "Yes" : "No"}
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
      </>
    );
  }
}

export default CustomerManagementSchedulePayments;
