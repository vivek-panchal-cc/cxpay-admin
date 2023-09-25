import React from "react";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CPagination,
  CLink,
  CFormGroup,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CTooltip,
  CSwitch,
} from "@coreui/react";
import { withdrawRequestService } from "../../../../services/admin/withdraw_request.service";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEye,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "../../../../constants/admin/global.constants";
import ReactDatePicker from "react-datepicker";
import InputDropdown from "components/admin/InputDropdown";
import InputDateRange from "components/admin/InputDateRange";

class Withdraw_Requests_Index extends React.Component {
  constructor(props) {
    super(props);
    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.pageChange = this.pageChange.bind(this);
    this.openConfirmPopup = this.openConfirmPopup.bind(this);

    this.state = {
      filters: {
        startDate: "",
        endDate: "",
      },
      showDateFilter: false,
      filtersChanged: false,
      drawStatus: [],
      allFilters: {
        start_date: "",
        end_date: "",
        status: [],
      },
      fields: {
        page: 1,
        start_date: "",
        end_date: "",
        status: [],
        search: "",
        sort_field: "created_at",
        sort_dir: "DESC",
      },
      _openPopup: false,
      withdraw_requests: [],
      multiaction: [],
      allCheckedbox: false,
    };
    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/withdraw_requests");
    }
  }

  componentDidMount() {
    this.getWithdrawRequests();
  }

  openConfirmPopup(id) {
    this.setState({ _openPopup: true, transaction_id: id });
  }

  getWithdrawRequests() {
    withdrawRequestService
      .getWithdrawRequestData(this.state.fields)
      .then((res) => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          this.setState({
            totalRecords: res.data?.pagination?.total || null,
            fields: {
              ...this.state.fields,
              totalPage: res.data?.pagination?.last_page || null,
            },
            withdraw_requests: res.data?.transactions || [],
          });
        }
      });
  }

  pageChange = (newPage) => {
    newPage = newPage ? newPage : 1;
    this.setState(
      {
        fields: {
          ...this.state.fields,
          page: newPage,
        },
      },
      () => {
        this.getWithdrawRequests();
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
        this.getWithdrawRequests();
      }
    );
  }

  handleChange(e, id = "") {
    // const { name, value } = e.target;
    // this.setState({ fields: { ...this.state.fields, [name]: value } });

    const { filters, drawStatus } = this.state;
    const filStrDate = filters.startDate
      ? filters.startDate?.toLocaleDateString()
      : "";
    const filEndDate = filters.endDate
      ? filters.endDate?.toLocaleDateString()
      : "";
    this.setState({
      // fields: {
      //   ...this.state.fields,
      //   search: name,
      // },
      allFilters: {
        start_date: filStrDate,
        end_date: filEndDate,
        status: drawStatus,
      },
      filtersChanged: false,
    });
  }

  deleteUser() {
    this.setState({ _openPopup: false, transaction_id: undefined });
    withdrawRequestService
      .chnageWithdrawStatus({ transaction_id: this.state.transaction_id })
      .then((res) => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          this.getWithdrawRequests();
        }
      });
  }

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      this.getWithdrawRequests();
    }
  };

  handleChangeSearch = (e) => {
    this.setState({
      fields: {
        ...this.state.fields,
        search: e?.target?.value,
      },
    });
  };

  handleSearch(type) {
    this.resetCheckedBox();
    if (type === "reset") {
      this.setState(
        {
          drawStatus: [],
          allFilters: {
            start_date: "",
            end_date: "",
            status: [],
          },
          filters: {
            startDate: "",
            endDate: "",
          },
          filtersChanged: false,
          fields: {
            page: 1,
            start_date: "",
            end_date: "",
            search: "",
            sort_field: "created_at",
            sort_dir: "DESC",
            status: [],
          },
        },
        () => {
          this.getWithdrawRequests();
        }
      );
    } else {
      this.getWithdrawRequests();
    }
  }

  resetCheckedBox() {
    this.setState({ allCheckedbox: false });
  }

  //filter code
  handleChangeDateFilter = (params) => {
    const [startDate, endDate] = params;
    // if (!startDate || !endDate) return;
    this.setState({
      fields: {
        ...this.state.fields,
        start_date: startDate?.toLocaleDateString(),
        end_date: endDate?.toLocaleDateString(),
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

  handleChangeStatusFilter = (statuses = []) => {
    if (!statuses) return;
    this.setState({
      fields: {
        ...this.state.fields,
        status: statuses,
      },
      drawStatus: statuses,
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
                        <CLabel htmlFor="name">Name</CLabel>
                        <CInput
                          id="name"
                          placeholder="Search Name"
                          name="search"
                          value={this.state.fields.search}
                          onChange={this.handleChangeSearch}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search");
                            }
                          }}
                          // onKeyDown={this.handleKeyDown}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Status</CLabel>
                        <InputDropdown
                          id="refund-status-dd"
                          name="status"
                          className="dropdown-check-list"
                          title="Status"
                          valueList={this.state.drawStatus}
                          dropList={globalConstants.WITHDRAW_STATUS_FILTER_BANK}
                          onChange={this.handleChangeStatusFilter}
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

                  <CCol xl={6}>
                    <CFormGroup row>
                      <CCol xs="12"></CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
                <CRow>
                  <CCol xl={12}>
                    <CFormGroup row>
                      <CCol xs="1">
                        <button
                          className="btn btn-dark btn-md"
                          onClick={() => this.handleSearch()}
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
              <CCardHeader>Withdraw Requests</CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Sr.no</th>
                        {/* <th>#</th> */}
                        <th onClick={() => this.handleColumnSort("name")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Name</span>
                            {this.state.fields.sort_field !== "name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("bank_name")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Bank Name
                            </span>
                            {this.state.fields.sort_field !== "bank_name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "bank_name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "bank_name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("date")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Date</span>
                            {this.state.fields.sort_field !== "date" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "date" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "date" && (
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
                        <th onClick={() => this.handleColumnSort("status")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Status
                            </span>
                            {this.state.fields.sort_field !== "status" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "status" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "status" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("status")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Withdraw Process
                            </span>
                            {this.state.fields.sort_field !== "status" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "status" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "status" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        {_canAccess("withdraw_requests", "view") && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.withdraw_requests.length > 0 &&
                        this.state.withdraw_requests.map((c, index) => (
                          <tr key={index + 1}>
                            {/* <td>
                              {this.state.multiaction[c.mobile] !==
                                undefined && (
                                <CheckBoxes
                                  handleCheckChieldElement={
                                    this.handleCheckChieldElement
                                  }
                                  _id={c.mobile}
                                  _isChecked={this.state.multiaction[c.mobile]}
                                />
                              )}
                            </td> */}
                            <td>
                              {this.state.fields.page >= 2
                                ? index + 1 + 10 * (this.state.fields.page - 1)
                                : index + 1}
                            </td>
                            <td>{c.name}</td>
                            <td>{c.bank_name}</td>
                            <td>{c.date}</td>

                            <td>{parseFloat(c.amount).toFixed(2)}</td>
                            <td>{c.status}</td>
                            <td>
                              {_canAccess("withdraw_requests", "update") && (
                                <CFormGroup variant="custom-checkbox" inline>
                                  {c.status !== "PENDING" && (
                                    <CSwitch
                                      className="mr-1"
                                      color="primary"
                                      name="status"
                                      value={c.status}
                                      defaultChecked
                                      disabled
                                    />
                                  )}

                                  {c.status === "PENDING" && (
                                    <CSwitch
                                      className="mr-1"
                                      color="primary"
                                      name="status"
                                      value={c.status}
                                      onClick={() =>
                                        this.openConfirmPopup(c.transaction_id)
                                      }
                                      // onChange={(e) => {
                                      //   this.handleChange(e, c.transaction_id);
                                      // }}
                                    />
                                  )}
                                </CFormGroup>
                              )}
                              {_canAccess("withdraw_requests", "update") ===
                                false && (
                                <>{c.status ? "Active" : "Deactive"}</>
                              )}
                            </td>
                            {_canAccess("withdraw_requests", "update") && (
                              <>
                                <td>
                                  {_canAccess("customer_reports", "view") && (
                                    <CTooltip
                                      content={
                                        globalConstants.VIEW_WITHDRAW_DETAILS
                                      }
                                    >
                                      <CLink
                                        className="btn btn-dark btn-block"
                                        aria-current="page"
                                        to={`/admin/withdraw_requests/detailview/${c.transaction_id}`}
                                      >
                                        <FontAwesomeIcon icon={faEye} />
                                      </CLink>
                                    </CTooltip>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      {this.state.withdraw_requests.length === 0 && (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <CPagination
                    activePage={this.state.fields.page}
                    onActivePageChange={this.pageChange}
                    pages={this.state.fields.totalPage}
                    doubleArrows={true}
                    align="end"
                  />
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CModal
          show={this.state._openPopup}
          onClose={() => {
            this.setState({ _openPopup: !this.state._openPopup });
            this.setState({
              totalRecords: null,
              fields: {
                ...this.state.fields,
                totalPage: null,
              },
              withdraw_requests: [],
            });
            this.getWithdrawRequests();
          }}
          color="#636f83"
        >
          <CModalHeader closeButton>
            <CModalTitle>Processing Withdraw Request</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Are you sure want to start with withdraw process? Once it's started
            then it will not revert back.
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={() => this.deleteUser()}>
              Confirm
            </CButton>
            <CButton
              color="secondary"
              onClick={() => {
                this.setState({ _openPopup: !this.state._openPopup });
                this.setState({
                  totalRecords: null,
                  fields: {
                    ...this.state.fields,
                    totalPage: null,
                  },
                  withdraw_requests: [],
                });
                this.getWithdrawRequests();
              }}
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    );
  }
}

export default Withdraw_Requests_Index;
