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
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faArrowLeft,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

import { notify } from "_helpers";
import { globalConstants } from "constants/admin/global.constants";
import { agentService } from "services/admin/agent.service";
import { _canAccess } from "_helpers";
import { formatDateFull } from "_helpers";
import { formatDateFullWithTimeStamp } from "_helpers";

class BlockedRequests extends React.Component {
  constructor(props) {
    super(props);
    this.openReleaseRequestPopup = this.openReleaseRequestPopup.bind(this);
    this.releaseCustomer = this.releaseCustomer.bind(this);
    this.state = {
      fields: {
        sort_dir: "desc",
        sort_field: "suspended_at",
        search: "",
        page: 1,
        customer_type: this.props.match.params.value,
      },
      _openPopup: false,
      _openReleaseRequestPopup: false,
    };
  }

  formatModuleNameFromURL() {
    const { pathname } = this.props.history.location;
    const parts = pathname?.split("/")?.filter((part) => part !== ""); // Split the URL and remove empty parts
    if (parts?.length > 1) {
      const moduleName = parts[1]; // Get the second part from the URL
      const words = moduleName?.split("_"); // Split by underscore
      const formattedModuleName = words
        ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
        ?.join(" ");
      return formattedModuleName;
    }
    return "";
  }

  componentDidMount() {
    this.getBlockedRequests();
  }

  getBlockedRequests() {
    let postData = {
      sort_dir: this.state.fields.sort_dir,
      sort_field: this.state.fields.sort_field,
      search: this.state.fields.search,
      page: this.state.fields.page,
      customer_type: this.props.match.params.value,
    };
    agentService.getBlockedRequests(postData).then((res) => {
      if (!res.success) {
        this.setState({
          blockedCustomers: [],
        });
        // notify.error(res.message);
      } else {
        this.setState({
          blockedCustomers: res.data.blocked_users,
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
        this.getBlockedRequests();
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
        this.getBlockedRequests();
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
            sort_field: "suspended_at",
            sort_dir: "desc",
            customer_type: this.props.match.params.value,
          },
        },
        () => {
          this.getBlockedRequests();
        }
      );
    } else {
      this.getBlockedRequests();
    }
  }

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ fields: { ...this.state.fields, search: value } });
  };

  openReleaseRequestPopup(id, userName) {
    this.setState({
      _openReleaseRequestPopup: true,
      releaseCustId: id,
      releaseUserName: userName,
    });
  }

  releaseCustomer() {
    let postData = { account_number: this.state.releaseCustId };
    this.setState({
      _openReleaseRequestPopup: false,
      releaseCustId: undefined,
      releaseUserName: undefined,
    });
    agentService.releaseCustomer(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getBlockedRequests();
      }
    });
  }

  handleGoBack = () => {
    this.props.history.goBack();
  };
  /****************************** Render Data To Dom ***************************************/

  render() {
    const moduleName = this.formatModuleNameFromURL();
    const headerText = `${moduleName} Blocked Lists`;
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
                          placeholder="Search Mobile Number"
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
                <strong>{headerText}</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      // onClick={this.handleGoBack}
                      to={`/admin/${this.props.module_name}`}
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
                        <th onClick={() => this.handleColumnSort("user_name")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Name</span>
                            {this.state.fields.sort_field !== "user_name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "user_name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "user_name" && (
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
                              Account Number
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
                          onClick={() => this.handleColumnSort("suspended_at")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Suspended At
                            </span>
                            {this.state.fields.sort_field !==
                              "suspended_at" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "suspended_at" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "suspended_at" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Suspension Reason
                            </span>
                          </span>
                        </th>

                        {_canAccess(this.props.module_name, "view") && (
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
                      {this.state?.blockedCustomers?.length > 0 &&
                        this.state.blockedCustomers.map((u, index) => (
                          <tr key={u.account_number || index}>
                            <td>{this.state.fields.page >= 2
                                ? index + 1 + 10 * (this.state.fields.page - 1)
                                : index + 1}</td>
                            <td>{u.user_name}</td>
                            <td>{u.account_number}</td>
                            <td>{u.mobile_number}</td>
                            <td>{formatDateFullWithTimeStamp(u.suspended_at)}</td>
                            <td>{u.suspension_reasons}</td>

                            {_canAccess(this.props.module_name, "view") && (
                              <td className="d-flex">
                                {_canAccess(this.props.module_name, "view") && (
                                  <CTooltip content={globalConstants.REL_CUST}>
                                    <button
                                      className="btn btn-md btn-primary"
                                      onClick={() =>
                                        this.openReleaseRequestPopup(
                                          u.account_number,
                                          u.user_name
                                        )
                                      }
                                    >
                                      <FontAwesomeIcon icon={faArrowRight} />
                                    </button>
                                  </CTooltip>
                                )}
                              </td>
                            )}
                          </tr>
                        ))}
                      {this.state?.blockedCustomers?.length === 0 && (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {this.state?.blockedCustomers?.length > 0 && (
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
          show={this.state._openReleaseRequestPopup}
          onClose={() => {
            this.setState({
              _openReleaseRequestPopup: !this.state._openReleaseRequestPopup,
            });
          }}
          color="primary"
        >
          <CModalHeader closeButton>
            <CModalTitle>Release Customer</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Are you sure you want to release{" "}
            <strong>{this.state.releaseUserName}</strong>?
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={() => this.releaseCustomer()}>
              Release
            </CButton>
            <CButton
              color="secondary"
              onClick={() => {
                this.setState({
                  _openReleaseRequestPopup:
                    !this.state._openReleaseRequestPopup,
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
export default BlockedRequests;
