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
  CSelect,
} from "@coreui/react";
// import { userGroupsService } from "../../../../services/admin/user_groups.service";
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
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
  faBan,
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "../../../../constants/admin/global.constants";
import CIcon from "@coreui/icons-react";
import InputDateRange from "components/admin/InputDateRange";
import { businessCustomersService } from "services/admin/business_customers.service";
const CheckBoxes = React.lazy(() =>
  import("../../../../components/admin/Checkboxes")
);
const MultiActionBar = React.lazy(() =>
  import("../../../../components/admin/MultiActionBar")
);

class CustomerManagementPendingKycIndex extends React.Component {
  constructor(props) {
    super(props);
    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.pageChange = this.pageChange.bind(this);

    this.state = {
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
        start_date: "",
        end_date: "",
        search_name: "",
        sort_field: "kyc_renew_date",
        sort_dir: "desc",
        status: "",
        customer_type: "2",
        // pageNo: 1,
        // sort_dir: 'asc',
        // sort_field: "user_group_name",
        // search_user_group_name: "",
        // totalPage: 1
      },
      _openPopup: false,
      customers_management_list: [],
      multiaction: [],
      allCheckedbox: false,
    };
    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/personal_customers");
    }
  }

  componentDidMount() {
    this.getPendingKycCustomerList();
  }

  getPendingKycCustomerList() {
    businessCustomersService
      .getPendingKycCustomerList(this.state.fields)
      .then((res) => {
        if (res.success === false) {
          // notify.error(res.message);
          this.setState({ customers_management_list: [] });
        } else {
          this.setState({
            totalRecords: res.data?.pagination?.total || null,
            fields: {
              ...this.state.fields,
              totalPage: res.data?.pagination?.last_page || null,
            },
            customers_management_list: res.data?.blocked_users || [],
          });
          /* Multi delete checkbox code */
          if (res.data && res.data.blocked_users?.length > 0) {
            let customers_management = res.data.blocked_users;
            let multiaction = [];
            const current_user = _loginUsersDetails();
            for (var key in customers_management) {
              if (
                globalConstants.DEVELOPER_PERMISSION_USER_ID.indexOf(
                  customers_management[key].mobile_number
                ) > -1
              ) {
                continue;
              }
              if (
                current_user.user_group_id ===
                customers_management[key].mobile_number
              ) {
                continue;
              }
              multiaction[customers_management[key].mobile_number] = false;
            }

            this.setState({ multiaction: multiaction });
          } else if (res.result && res.result?.length === 0) {
            this.setState({ multiaction: [] });
          }
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
        this.getPendingKycCustomerList();
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
        this.getPendingKycCustomerList();
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
      this.getPendingKycCustomerList();
    }
  };
  handleSearch(type) {
    this.resetCheckedBox();
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
            start_date: "",
            end_date: "",
            search_name: "",
            sort_field: "kyc_renew_date",
            sort_dir: "desc",
            status: "",
            customer_type: "2",
            // pageNo: 1,
            // sort_dir: 'DESC',
            // sort_field: "created_at",
            // search_name: "",
            // totalPage: 1
          },
        },
        () => {
          this.getPendingKycCustomerList();
        }
      );
    } else {
      this.getPendingKycCustomerList();
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });

    var postData = {
      mobile_number: [this.state.deleteId],
      user_type: "personal",
    };

    customersManagementService.deleteCustomer(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getPendingKycCustomerList();
      }
    });
  }
  resetCheckedBox() {
    this.setState({ allCheckedbox: false });
  }

  handleApplyAction = (actionValue = "") => {
    if (actionValue !== "") {
      let appliedActionId = [];
      let selectedIds = this.state.multiaction;
      for (var key in selectedIds) {
        if (selectedIds[key]) {
          appliedActionId.push(key);
        }
      }
      this.resetCheckedBox();
      switch (actionValue) {
        case "delete": {
          customersManagementService
            .deleteMultipleCustomer({ mobile_number: appliedActionId })
            .then((res) => {
              if (res.status === false) {
                notify.error(res.message);
              } else {
                notify.success(res.message);
                this.getPendingKycCustomerList();
              }
            });
          break;
        }
        case "active": {
          this.bulkCustomerStatusChangeHandler({
            mobile_number: appliedActionId,
            status: 1,
          });
          break;
        }
        case "deactive": {
          this.bulkCustomerStatusChangeHandler({
            mobile_number: appliedActionId,
            status: 0,
          });
          break;
        }
        default:
          return "";
      }
    }
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

  // handleCheckChieldElement = (event) => {
  //   let multiactions = this.state.multiaction;
  //   multiactions[event.target.value] = event.target.checked;
  //   this.setState({ multiaction: multiactions });
  // };

  handleCheckChieldElement = (event) => {
    const { multiaction } = this.state;
    multiaction[event.target.value] = event.target.checked;
    this.setState({ multiaction });

    // Check if all checkboxes are checked
    const allChecked = Object.values(multiaction).every((val) => val);
    this.setState({ allCheckedbox: allChecked });
  };

  StatusChangedHandler(_id, status) {
    var postData = {
      mobile_number: [_id],
      status: status == 0 ? 1 : 0,
    };

    customersManagementService.changeCustomerStatus(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getPendingKycCustomerList();
      }
    });
  }

  //filter code
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

  bulkCustomerStatusChangeHandler(postData) {
    customersManagementService
      .changeBulkCustomerStatus(postData)
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getPendingKycCustomerList();
        }
      });
  }

  render() {
    const current_user = _loginUsersDetails();
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
                  {/* <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Status</CLabel>
                        <CSelect
                          custom
                          name="status"
                          id="status"
                          onChange={this.handleChange}
                          value={this.state?.fields?.status}
                        >
                          <option value={""}>{"Select Status"}</option>
                          <option value={"1"}>{"Active"}</option>
                          <option value={"0"}>{"Deactive"}</option>
                        </CSelect>
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
                  </CCol> */}

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
              <CCardHeader>Personal Customers Pending KYC</CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  {/* <MultiActionBar
                    onClick={this.handleApplyAction}
                    checkBoxData={this.state.multiaction}
                    module_name={"personal_customers"}
                  /> */}
                  <table className="table">
                    <thead>
                      <tr>
                        {/* <th>
                          <input
                            type="checkbox"
                            onClick={this.handleAllChecked}
                            value="checkedall"
                            onChange={(e) => {}}
                            checked={this.state.allCheckedbox}
                          />
                        </th> */}
                        <th>#</th>
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
                        <th onClick={() => this.handleColumnSort("created_at")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Created At
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
                        {/* <th onClick={() => this.handleColumnSort("status")}>
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
                        </th> */}
                        {(_canAccess("personal_customers", "update") ||
                          _canAccess("personal_customers", "delete") ||
                          _canAccess("personal_customers", "view")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.customers_management_list?.length > 0 &&
                        this.state.customers_management_list?.map(
                          (c, index) => (
                            <tr key={c.mobile_number}>
                              {/* <td>
                                {this.state.multiaction[c.mobile_number] !==
                                  undefined && (
                                  <CheckBoxes
                                    handleCheckChieldElement={
                                      this.handleCheckChieldElement
                                    }
                                    _id={c.mobile_number}
                                    _isChecked={
                                      this.state.multiaction[c.mobile_number]
                                    }
                                  />
                                )}
                              </td> */}
                              <td>
                                {this.state.fields.page >= 2
                                  ? index +
                                    1 +
                                    10 * (this.state.fields.page - 1)
                                  : index + 1}
                              </td>
                              <td>{c.user_name}</td>
                              <td>{`+${c.mobile_number}`}</td>
                              <td>{formatDate(c.date)}</td>
                              <td>{formatDate(c.kyc_renew_date)}</td>
                              {/* <td>
                                {_canAccess("personal_customers", "update") && (
                                  <CLink
                                    onClick={() =>
                                      this.StatusChangedHandler(
                                        c.mobile_number,
                                        c.status
                                      )
                                    }
                                  >
                                    {c.status == 0 ? "Active" : "Deactive"}
                                  </CLink>
                                )}
                                {_canAccess("personal_customers", "update") ===
                                  false && (
                                  <>{c.status == "0" ? "Active" : "Deactive"}</>
                                )}
                              </td> */}
                              {(_canAccess("personal_customers", "update") ||
                                _canAccess("personal_customers", "delete") ||
                                _canAccess("personal_customers", "view")) && (
                                <>
                                  <td>
                                    <div className="d-flex">
                                      {globalConstants.DEVELOPER_PERMISSION_USER_ID.indexOf(
                                        c._id
                                      ) === -1 && (
                                        <>
                                          {current_user.user_group_id !==
                                            c._id &&
                                            _canAccess(
                                              "personal_customers",
                                              "update"
                                            ) && (
                                              <CTooltip
                                                content={
                                                  globalConstants.EDIT_BTN
                                                }
                                              >
                                                <CLink
                                                  className="btn  btn-md btn-primary"
                                                  aria-current="page"
                                                  to={`/admin/personal_customers/edit/${c.mobile_number}`}
                                                >
                                                  <CIcon name="cil-pencil"></CIcon>{" "}
                                                </CLink>
                                              </CTooltip>
                                            )}
                                          &nbsp;
                                          {current_user.user_group_id !==
                                            c._id &&
                                            _canAccess(
                                              "personal_customers",
                                              "delete"
                                            ) && (
                                              <CTooltip
                                                content={
                                                  globalConstants.DELETE_BTN
                                                }
                                              >
                                                <button
                                                  className="btn  btn-md btn-danger "
                                                  onClick={() =>
                                                    this.openDeletePopup(
                                                      c.mobile_number
                                                    )
                                                  }
                                                >
                                                  <CIcon name="cil-trash"></CIcon>
                                                </button>
                                              </CTooltip>
                                            )}
                                          &nbsp;
                                          {current_user.user_group_id !==
                                            c._id &&
                                            _canAccess(
                                              "personal_customers",
                                              "view"
                                            ) && (
                                              <CTooltip
                                                content={
                                                  globalConstants.REPORT_BTN
                                                }
                                              >
                                                <CLink
                                                  className="btn btn-dark btn-block w-auto"
                                                  aria-current="page"
                                                  to={{
                                                    pathname: `/admin/personal_customers/${c.account_number}/basic_details`,
                                                    state: {
                                                      route: "pending_kyc",
                                                      mobile_number:
                                                        c.mobile_number,
                                                    },
                                                  }}
                                                >
                                                  <FontAwesomeIcon
                                                    icon={faEye}
                                                  ></FontAwesomeIcon>
                                                </CLink>
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
                      {this.state.customers_management_list?.length === 0 && (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {this.state.customers_management_list?.length > 0 && (
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
          <CModalBody>
            {/* If you are delete the customer, then associate users will be delete.<br /> */}
            Are you sure you want to delete your account? This will permanently
            erase all your details.
          </CModalBody>
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
      </>
    );
  }
}

export default CustomerManagementPendingKycIndex;
