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
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CTooltip,
  CLink,
} from "@coreui/react";
import { customersManagementService } from "../../../../services/admin/customers_management.service";
import {
  notify,
  history,
  _canAccess,
  _loginUsersDetails,
  formatDate,
} from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faCheck,
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "../../../../constants/admin/global.constants";
import "./../agent_customers/notification.css";
import { businessCustomersService } from "services/admin/business_customers.service";

class CustomersManagementReviewNeededKycIndex extends React.Component {
  constructor(props) {
    super(props);
    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openPopup = this.openPopup.bind(this);
    this.reviewedKycApprovedOrRejected =
      this.reviewedKycApprovedOrRejected.bind(this);
    this.pageChange = this.pageChange.bind(this);

    this.state = {
      fields: {
        page: 1,
        search_name: "",
        sort_field: "kyc_renew_date",
        sort_dir: "desc",
        customer_type: "2",
      },
      _openPopup: false,
      review_needed_customer_list: [],
    };
    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/personal_customers");
    }
  }

  componentDidMount() {
    this.getReviewNeededCustomerList();
  }

  getReviewNeededCustomerList() {
    businessCustomersService
      .getReviewNeededCustomerList(this.state.fields)
      .then((res) => {
        if (!res.success) {
          // notify.error(res.message);
          this.setState({ review_needed_customer_list: [] });
        } else {
          this.setState({
            totalRecords: res.data?.pagination?.total,
            fields: {
              ...this.state.fields,
              totalPage: res.data?.pagination?.last_page,
            },
            review_needed_customer_list: res.data?.in_review_customers,
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
        this.getReviewNeededCustomerList();
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
        this.getReviewNeededCustomerList();
      }
    );
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }
  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      this.getReviewNeededCustomerList();
    }
  };
  handleSearch(type) {
    if (type === "reset") {
      this.setState(
        {
          fields: {
            page: 1,
            search_name: "",
            sort_field: "kyc_renew_date",
            sort_dir: "desc",
            customer_type: "2",
          },
        },
        () => {
          this.getReviewNeededCustomerList();
        }
      );
    } else {
      this.getReviewNeededCustomerList();
    }
  }

  openPopup(data) {
    this.setState({
      _openPopup: true,
      acc_num: data.account_number,
      ref_id: data.kyc_ref_id,
    });
  }
  reviewedKycApprovedOrRejected(status) {
    this.setState({
      _openPopup: false,
      acc_num: undefined,
      ref_id: undefined,
    });

    let postData = {
      operation_type: status,
      account_number: this.state.acc_num,
      kyc_ref_id: this.state.ref_id,
    };

    businessCustomersService
      .reviewedKycApprovedOrRejected(postData)
      .then((res) => {
        if (!res.success) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getReviewNeededCustomerList();
        }
      });
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
                          id="name"
                          placeholder="Search here..."
                          name="search_name"
                          value={this.state.fields.search_name}
                          onChange={this.handleChange}
                          onKeyDown={this.handleKeyDown}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={9}>
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
              <CCardHeader>
                <strong>Persoanl Customers In Review KYC</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/personal_customers"
                    >
                      {" "}
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="mr-1"
                      />{" "}
                      Back
                    </CLink>
                  </CTooltip>
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th onClick={() => this.handleColumnSort("name")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              User Name
                            </span>
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
                        <th
                          onClick={() => this.handleColumnSort("mobile_number")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Mobile Number
                            </span>
                            {this.state.fields.sort_field !==
                              "mobile_number" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "mobile_number" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "mobile_number" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th
                          onClick={() =>
                            this.handleColumnSort("account_number")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Account No.
                            </span>
                            {this.state.fields.sort_field !==
                              "account_number" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "account_number" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "account_number" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("kyc_ref_id")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Reference ID
                            </span>
                            {this.state.fields.sort_field !== "kyc_ref_id" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "kyc_ref_id" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "kyc_ref_id" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th
                          onClick={() =>
                            this.handleColumnSort("kyc_attempt_count")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Attempt Count
                            </span>
                            {this.state.fields.sort_field !==
                              "kyc_attempt_count" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "kyc_attempt_count" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "kyc_attempt_count" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th
                          onClick={() =>
                            this.handleColumnSort("kyc_renew_date")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              KYC Requested At
                            </span>
                            {this.state.fields.sort_field !==
                              "kyc_renew_date" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "kyc_renew_date" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "kyc_renew_date" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        {_canAccess("personal_customers", "update") && (
                          <th>Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.review_needed_customer_list?.length > 0 &&
                        this.state.review_needed_customer_list?.map(
                          (c, index) => (
                            <tr key={c.account_number}>
                              <td>
                                {this.state.fields.page >= 2
                                  ? index +
                                    1 +
                                    10 * (this.state.fields.page - 1)
                                  : index + 1}
                              </td>
                              <td>{c.name}</td>
                              <td>{`+${c.mobile_number}`}</td>
                              <td>{c.account_number}</td>
                              <td>{c.kyc_ref_id}</td>
                              <td>{c.kyc_attempt_count || 0}</td>
                              <td>{formatDate(c.date)}</td>
                              {_canAccess("personal_customers", "update") && (
                                <>
                                  <td>
                                    <div className="d-flex">
                                      {globalConstants.DEVELOPER_PERMISSION_USER_ID.indexOf(
                                        c._id
                                      ) === -1 && (
                                        <>
                                          {_canAccess(
                                            "personal_customers",
                                            "update"
                                          ) && (
                                            <CTooltip
                                              content={
                                                globalConstants.IN_PROCESSKYC_DONE
                                              }
                                            >
                                              <button
                                                className="btn btn-md btn-primary "
                                                onClick={() =>
                                                  this.openPopup(c)
                                                }
                                              >
                                                <FontAwesomeIcon
                                                  icon={faCheck}
                                                />
                                              </button>
                                            </CTooltip>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          )
                        )}
                      {this.state.review_needed_customer_list?.length === 0 && (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {this.state?.review_needed_customer_list?.length > 0 && (
                    <CPagination
                      activePage={this.state.fields.page}
                      onActivePageChange={this.pageChange}
                      pages={this.state.fields.totalPage}
                      doubleArrows={true}
                      align="end"
                    />
                  )}
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CModal
          show={this.state._openPopup}
          onClose={() => {
            this.setState({ _openPopup: !this.state._openPopup });
          }}
          color="primary"
        >
          <CModalHeader closeButton>
            <CModalTitle>Review KYC</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Are you sure you want to mark this user's KYC as reviewed?
          </CModalBody>
          <CModalFooter>
            <CButton
              color="primary"
              onClick={() => this.reviewedKycApprovedOrRejected("approved")}
            >
              Approve
            </CButton>
            <CButton
              color="danger"
              onClick={() => this.reviewedKycApprovedOrRejected("rejected")}
            >
              Reject
            </CButton>
            <CButton
              color="secondary"
              onClick={() => {
                this.setState({ _openPopup: !this.state._openPopup });
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

export default CustomersManagementReviewNeededKycIndex;
