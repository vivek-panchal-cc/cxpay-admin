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
import { businessCustomersService } from "../../../../services/admin/business_customers.service";
import {
  notify,
  history,
  _canAccess,
  _loginUsersDetails,
} from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
} from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "../../../../constants/admin/global.constants";
import CIcon from "@coreui/icons-react";
const CheckBoxes = React.lazy(() =>
  import("../../../../components/admin/Checkboxes")
);
const MultiActionBar = React.lazy(() =>
  import("../../../../components/admin/MultiActionBar")
);

class Business_Customers_Index extends React.Component {
  constructor(props) {
    super(props);
    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.pageChange = this.pageChange.bind(this);

    this.state = {
      fields: {
        page: 1,
        search_company_name: "",
        sort_field: "created_at",
        sort_dir: "DESC",
      },
      _openPopup: false,
      customers_management_list: [],
      multiaction: [],
      allCheckedbox: false,
    };
    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/business_customers");
    }
  }

  componentDidMount() {
    this.getUserGroupsList();
  }

  getUserGroupsList() {
    businessCustomersService
      .getCustomersManagementList(this.state.fields)
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
            customers_management_list: res.data?.customers || [],
          });
          /* Multi delete checkbox code */
          if (res.data && res.data.customers.length > 0) {
            let customers_management = res.data.customers;
            let multiaction = [];
            const current_user = _loginUsersDetails();
            for (var key in customers_management) {
              if (
                globalConstants.DEVELOPER_PERMISSION_USER_ID.indexOf(
                  customers_management[key].mobile
                ) > -1
              ) {
                continue;
              }
              if (
                current_user.user_group_id === customers_management[key].mobile
              ) {
                continue;
              }
              multiaction[customers_management[key].mobile] = false;
            }

            this.setState({ multiaction: multiaction });
          } else if (res.result && res.result.length === 0) {
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
        this.getUserGroupsList();
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
        this.getUserGroupsList();
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
      this.getUserGroupsList();
    }
  };
  handleSearch(type) {
    this.resetCheckedBox();
    if (type === "reset") {
      this.setState(
        {
          fields: {
            page: 1,
            search_company_name: "",
            sort_field: "created_at",
            sort_dir: "DESC",
          },
        },
        () => {
          this.getUserGroupsList();
        }
      );
    } else {
      this.getUserGroupsList();
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });

    var postData = { mobile_number: [this.state.deleteId] };

    businessCustomersService.deleteCustomer(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getUserGroupsList();
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
          businessCustomersService
            .deleteMultipleCustomer({ mobile_number: appliedActionId })
            .then((res) => {
              if (res.status === false) {
                notify.error(res.message);
              } else {
                notify.success(res.message);
                this.getUserGroupsList();
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
    console.log(event);
    let multiactions = this.state.multiaction;
    for (var key in multiactions) {
      multiactions[key] = event.target.checked;
    }
    this.setState({
      multiaction: multiactions,
      allCheckedbox: event.target.checked,
    });
  };

  handleCheckChieldElement = (event) => {
    let multiactions = this.state.multiaction;
    multiactions[event.target.value] = event.target.checked;
    this.setState({ multiaction: multiactions });
  };

  StatusChangedHandler(_id, status) {
    var postData = {
      mobile_number: [_id],
      status: status == 0 ? 1 : 0,
    };

    businessCustomersService.changeCustomerStatus(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getUserGroupsList();
      }
    });
  }

  bulkCustomerStatusChangeHandler(postData) {
    businessCustomersService.changeBulkCustomerStatus(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getUserGroupsList();
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
                        <CLabel htmlFor="name">Company Name</CLabel>
                        <CInput
                          id="name"
                          placeholder="Search Company Name"
                          name="search_company_name"
                          value={this.state.fields.search_company_name}
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
                Business Customers
                {/* <div className="card-header-actions">
                {_canAccess('customers', 'create') &&
                  <CTooltip content={globalConstants.ADD_BTN} >
                    <CLink
                      className="btn btn-dark btn-block"
                      aria-current="page"
                      to="/admin/user_groups/add"
                    ><FontAwesomeIcon icon={faPlus} />
                    </CLink>
                  </CTooltip>
                }
              </div> */}
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  <MultiActionBar
                    onClick={this.handleApplyAction}
                    checkBoxData={this.state.multiaction}
                    module_name={"customers"}
                  />
                  <table className="table">
                    <thead>
                      <tr>
                        <th>
                          <input
                            type="checkbox"
                            onClick={this.handleAllChecked}
                            value="checkedall"
                            onChange={(e) => {}}
                            checked={this.state.allCheckedbox}
                          />
                        </th>
                        {/* <th>#</th> */}
                        <th
                          onClick={() => this.handleColumnSort("company_name")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Company Name
                            </span>
                            {this.state.fields.sort_field !==
                              "company_name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "company_name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "company_name" && (
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
                        {(_canAccess("customers", "update") ||
                          _canAccess("customers", "delete")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.customers_management_list.length > 0 &&
                        this.state.customers_management_list.map((c, index) => (
                          <tr key={c.mobile}>
                            <td>
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
                            </td>
                            {/* <td>{index + 1}</td> */}
                            <td>{c.company_name}</td>
                            <td>{c.email}</td>
                            <td>{c.mobile}</td>
                            <td>
                              {_canAccess("customers", "update") && (
                                <CLink
                                  onClick={() =>
                                    this.StatusChangedHandler(
                                      c.mobile,
                                      c.status
                                    )
                                  }
                                >
                                  {c.status == 0 ? "Active" : "Deactive"}
                                </CLink>
                              )}
                              {_canAccess("customers", "update") === false && (
                                <>{c.status ? "Active" : "Deactive"}</>
                              )}
                            </td>
                            {(_canAccess("customers", "update") ||
                              _canAccess("customers", "delete")) && (
                              <>
                                <td>
                                  {globalConstants.DEVELOPER_PERMISSION_USER_ID.indexOf(
                                    c._id
                                  ) === -1 && (
                                    <>
                                      {current_user.user_group_id !== c._id &&
                                        _canAccess("customers", "update") && (
                                          <CTooltip
                                            content={globalConstants.EDIT_BTN}
                                          >
                                            <CLink
                                              className="btn  btn-md btn-primary"
                                              aria-current="page"
                                              to={`/admin/business_customers/edit/${c.mobile}`}
                                            >
                                              <CIcon name="cil-pencil"></CIcon>{" "}
                                            </CLink>
                                          </CTooltip>
                                        )}
                                      &nbsp;
                                      {current_user.user_group_id !== c._id &&
                                        _canAccess("customers", "delete") && (
                                          <CTooltip
                                            content={globalConstants.DELETE_BTN}
                                          >
                                            <button
                                              className="btn  btn-md btn-danger "
                                              onClick={() =>
                                                this.openDeletePopup(c.mobile)
                                              }
                                            >
                                              <CIcon name="cil-trash"></CIcon>
                                            </button>
                                          </CTooltip>
                                        )}
                                    </>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      {this.state.customers_management_list.length === 0 && (
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

export default Business_Customers_Index;
