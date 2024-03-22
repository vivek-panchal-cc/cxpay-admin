import React from "react";
import { notify } from "../../../../_helpers";
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import { _canAccess } from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { businessCustomersService } from "services/admin/business_customers.service";

class BusinessDeleteRequests extends React.Component {
  constructor(props) {
    super(props);

    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.openRejReqPopup = this.openRejReqPopup.bind(this);
    this.rejectDelRequest = this.rejectDelRequest.bind(this);

    this.state = {
      fields: {
        sort_dir: "desc",
        sort_field: "created_at",
        search: "",
        page: 1,
      },
      _openPopup: false,
      _openRejReqPopup: false,
    };
  }

  componentDidMount() {
    this.getDeleteRequests();
  }

  getDeleteRequests() {
    let postData = {
      sort_dir: this.state.fields.sort_dir,
      sort_field: this.state.fields.sort_field,
      search: this.state.fields.search,
    };

    businessCustomersService.getDeleteRequests(postData).then((res) => {
      if (!res.success) {
        this.setState({
          businessCustomers: [],
        });
      } else {
        this.setState({
          businessCustomers: res.data.business,
          fields: {
            ...this.state.fields,
            totalPage: res.data.pagination.last_page,
            totalRecords: res.data.pagination.total,
          },
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
        this.getDeleteRequests();
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
        this.getDeleteRequests();
      }
    );
  }

  handleSearch(type) {
    if (type === "reset") {
      this.setState(
        {
          fields: {
            page: 1,
            search: "",
            sort_field: "created_at",
            sort_dir: "desc",
          },
        },
        () => {
          this.getDeleteRequests();
        }
      );
    } else {
      this.getDeleteRequests();
    }
  }

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, search: value } });
  };

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteUser() {
    let postData = {
      mobile_number: [this.state.deleteId],
      user_type: "business",
    };
    this.setState({ _openPopup: false, deleteId: undefined });
    businessCustomersService.deleteBusinessCustomer(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getDeleteRequests();
      }
    });
  }

  openRejReqPopup(id) {
    this.setState({ _openRejReqPopup: true, deleteReqId: id });
  }

  rejectDelRequest() {
    let postData = {
      mobile_number: this.state.deleteReqId,
    };
    this.setState({ _openRejReqPopup: false, deleteReqId: undefined });
    businessCustomersService.rejectDeleteRequest(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getDeleteRequests();
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
                          placeholder="Search Company Name"
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

                <CRow>
                  <CCol xl={12}>
                    <CFormGroup row>
                      <CCol xs="1"></CCol>
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
                Business Customers Delete Requests
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/business_customers"
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
                              Company Name
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

                        <th onClick={() => this.handleColumnSort("email")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Email</span>
                            {this.state.fields.sort_field !== "email" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "email" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "email" && (
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
                        <th>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Account Number
                            </span>
                          </span>
                        </th>
                        <th>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Balance
                            </span>
                          </span>
                        </th>
                        {_canAccess("business_customers", "delete") && (
                          <th>
                            <span className="sortCls">
                              <span className="table-header-text-mrg">
                                Action
                              </span>
                            </span>
                          </th>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {this.state?.businessCustomers?.length > 0 &&
                        this.state.businessCustomers?.map((u, index) => (
                          <tr key={u.mobile_number}>
                            <td>{this.state.fields.page >= 2
                                ? index + 1 + 10 * (this.state.fields.page - 1)
                                : index + 1}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>{u.mobile_number}</td>
                            <td>{u.account_number}</td>
                            <td>{u.available_balance}</td>

                            {_canAccess("business_customers", "delete") && (
                              <>
                                <td className="d-flex">
                                  {_canAccess(
                                    "business_customers",
                                    "delete"
                                  ) && (
                                    <CTooltip
                                      content={globalConstants.APPR_DEL_REQ}
                                    >
                                      <button
                                        className="btn  btn-md btn-primary "
                                        onClick={() =>
                                          this.openDeletePopup(u.mobile_number)
                                        }
                                      >
                                        <CIcon name="cil-check"></CIcon>
                                      </button>
                                    </CTooltip>
                                  )}
                                  &nbsp;
                                  {_canAccess(
                                    "business_customers",
                                    "delete"
                                  ) && (
                                    <CTooltip
                                      content={globalConstants.REJ_DEL_REQ}
                                    >
                                      <button
                                        className="btn  btn-md btn-danger "
                                        onClick={() =>
                                          this.openRejReqPopup(u.mobile_number)
                                        }
                                      >
                                        <CIcon name="cil-x"></CIcon>
                                      </button>
                                    </CTooltip>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      {this.state?.businessCustomers?.length === 0 && (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {this.state?.businessCustomers?.length > 0 && (
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
          color="danger"
        >
          <CModalHeader closeButton>
            <CModalTitle>Delete Customer</CModalTitle>
          </CModalHeader>
          <CModalBody>Are you sure you want to delete this record?</CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.deleteUser()}>
              Delete
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

        <CModal
          show={this.state._openRejReqPopup}
          onClose={() => {
            this.setState({ _openRejReqPopup: !this.state._openRejReqPopup });
          }}
          color="danger"
        >
          <CModalHeader closeButton>
            <CModalTitle>Reject Delete Request</CModalTitle>
          </CModalHeader>
          <CModalBody>Are you sure you want to reject this request?</CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.rejectDelRequest()}>
              Reject Request
            </CButton>
            <CButton
              color="secondary"
              onClick={() => {
                this.setState({
                  _openRejReqPopup: !this.state._openRejReqPopup,
                });
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
export default BusinessDeleteRequests;
