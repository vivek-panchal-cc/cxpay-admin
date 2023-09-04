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
import { connect } from "react-redux";
import CIcon from "@coreui/icons-react";
import { getUsersList } from "../../../../actions/admin";
import { userService } from "../../../../services/admin/user.service";
import {
  notify,
  _canAccess,
  history,
  _loginUsersDetails,
} from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "../../../../constants/admin/global.constants";
const UserGroups = React.lazy(() =>
  import("../../../../components/admin/UserGroups")
);
const CheckBoxes = React.lazy(() =>
  import("../../../../components/admin/Checkboxes")
);
const MultiActionBar = React.lazy(() =>
  import("../../../../components/admin/MultiActionBar")
);

class User_Index extends React.Component {
  constructor(props) {
    super(props);

    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    this.state = {
      pageNo: 1,
      sort_dir: "asc",
      sort_field: "name",
      search_name: "",
      search_email: "",
      user_group_id: "",
      _openPopup: false,
      multiaction: [],
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/users");
    }
  }

  componentDidMount() {
    //this.props.getInitFilter(this.state);
    this.props.getUsersList(this.state);
  }

  pageChange = (newPage) => {
    newPage = newPage === 0 ? 1 : newPage;
    this.setState({ pageNo: newPage });
    var filter = {
      ...this.state,
      pageNo: newPage,
    };
    this.props.getUsersList(filter);
  };

  handleColumnSort(fieldName) {
    this.setState({
      sort_dir: ["desc"].includes(this.state.sort_dir) ? "asc" : "desc",
      sort_field: fieldName,
    });

    let page = this.props.users.page;
    if (page !== 1) {
      page = 1;
    }

    this.props.getUsersList(this.state);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }
  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      this.props.getUsersList(this.state);
    }
  };
  handleSearch(type) {
    this.resetCheckedBox();
    if (type === "reset") {
      this.setState(
        {
          pageNo: 1,
          sort_dir: "asc",
          sort_field: "name",
          search_name: "",
          search_email: "",
          user_group_id: "",
        },
        () => {
          this.props.getUsersList(this.state);
        }
      );
    } else {
      this.props.getUsersList(this.state);
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });
    userService.deleteUser(this.state.deleteId).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.props.getUsersList(this.state);
      }
    });
  }

  userStatusChangedHandler(user_id, status) {
    userService.changeUserStatus(user_id, { status: !status }).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.props.getUsersList(this.state);
      }
    });
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

  handleCheckChieldElement = (event) => {
    let multiactions = this.state.multiaction;
    multiactions[event.target.value] = event.target.checked;
    this.setState({ multiaction: multiactions });
    let allTrue = false;
    if (this.state.multiaction.length > 0) {
      allTrue = this.state.multiaction.every((element) => element === true);
    }
    this.setState({ allCheckedbox: allTrue });
  };

  componentWillReceiveProps(nextProps) {
    const current_user = _loginUsersDetails();
    if (nextProps.users.user_list.length > 0) {
      let users = nextProps.users.user_list;
      let multiaction = [];
      for (var key in users) {
        if (current_user.id !== users[key]._id) {
          multiaction[users[key]._id] = false;
        }
      }
      this.setState({ multiaction: multiaction });
    } else if (nextProps.users.user_list.length === 0) {
      this.setState({ multiaction: [] });
    }
  }

  resetCheckedBox() {
    this.setState({ allCheckedbox: false });
  }

  bulkUserStatusChangeHandler(postData) {
    userService.changeBulkUsersStatus(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.props.getUsersList(this.state);
      }
    });
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
          userService
            .deleteMultipleUsers({ user_ids: appliedActionId })
            .then((res) => {
              if (res.status === false) {
                notify.error(res.message);
              } else {
                notify.success(res.message);
                this.props.getUsersList(this.state);
              }
            });
          break;
        }
        case "active": {
          this.bulkUserStatusChangeHandler({
            user_ids: appliedActionId,
            status: true,
          });
          break;
        }
        case "deactive": {
          this.bulkUserStatusChangeHandler({
            user_ids: appliedActionId,
            status: false,
          });
          break;
        }
        default:
          return "";
      }
    }
  };

  render() {
    const current_user = _loginUsersDetails();
    const { page, totalPage, user_list } = this.props.users;

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
                          name="search_name"
                          value={this.state.search_name}
                          onChange={this.handleChange}
                          onKeyDown={this.handleKeyDown}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Email</CLabel>
                        <CInput
                          id="name"
                          placeholder="Search Email"
                          name="search_email"
                          value={this.state.search_email}
                          onChange={this.handleChange}
                          onKeyDown={this.handleKeyDown}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">User Groups</CLabel>
                        <UserGroups
                          key="user_group_id"
                          id="user_group_id"
                          value={this.state.user_group_id}
                          onChange={this.handleFieldChange}
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
              <CCardHeader>
                Users Management
                <div className="card-header-actions">
                  {_canAccess("users", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/users/add"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </CLink>
                    </CTooltip>
                  )}
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  <MultiActionBar
                    onClick={this.handleApplyAction}
                    checkBoxData={this.state.multiaction}
                    module_name={"users"}
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
                        <th>#</th>
                        <th onClick={() => this.handleColumnSort("name")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Name</span>
                            {this.state.sort_field !== "name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.sort_dir === "asc" &&
                              this.state.sort_field === "name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.sort_dir === "desc" &&
                              this.state.sort_field === "name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("email")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Email</span>
                            {this.state.sort_field !== "email" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.sort_dir === "asc" &&
                              this.state.sort_field === "email" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.sort_dir === "desc" &&
                              this.state.sort_field === "email" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th>User Groups</th>
                        <th>Status</th>
                        {(_canAccess("users", "update") ||
                          _canAccess("users", "delete")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {user_list.length > 0 &&
                        user_list.map((u, index) => (
                          <tr key={u._id}>
                            <td>
                              {" "}
                              {current_user.id !== u._id && (
                                <CheckBoxes
                                  handleCheckChieldElement={
                                    this.handleCheckChieldElement
                                  }
                                  _id={u._id}
                                  _isChecked={this.state.multiaction[u._id]}
                                />
                              )}{" "}
                            </td>
                            <td>{index + 1}</td>
                            <td>{u.name}</td>
                            <td>{u.email}</td>
                            <td>
                              {u.user_group_id !== undefined &&
                              u.user_group_id !== null
                                ? u.user_group_id.user_group_name
                                : "-"}
                            </td>
                            <td>
                              {current_user.id !== u._id &&
                                _canAccess("users", "update") && (
                                  <CLink
                                    onClick={() =>
                                      this.userStatusChangedHandler(
                                        u._id,
                                        u.status
                                      )
                                    }
                                  >
                                    {u.status ? "Active" : "Deactive"}
                                  </CLink>
                                )}
                              {current_user.id !== u._id &&
                                _canAccess("users", "update") === false && (
                                  <>{u.status ? "Active" : "Deactive"}</>
                                )}
                            </td>
                            {(_canAccess("users", "update") ||
                              _canAccess("users", "delete")) && (
                              <>
                                <td>
                                  {current_user.id !== u._id && (
                                    <>
                                      {_canAccess("users", "update") && (
                                        <CTooltip
                                          content={globalConstants.EDIT_BTN}
                                        >
                                          <CLink
                                            className="btn  btn-md btn-primary"
                                            aria-current="page"
                                            to={`/admin/users/edit/${u._id}`}
                                          >
                                            <CIcon name="cil-pencil"></CIcon>{" "}
                                          </CLink>
                                        </CTooltip>
                                      )}
                                      &nbsp;
                                      {_canAccess("users", "delete") && (
                                        <CTooltip
                                          content={globalConstants.DELETE_BTN}
                                        >
                                          <button
                                            className="btn  btn-md btn-danger "
                                            onClick={() =>
                                              this.openDeletePopup(u._id)
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
                      {user_list.length === 0 && (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <CPagination
                    activePage={page}
                    onActivePageChange={this.pageChange}
                    pages={totalPage}
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
            <CModalTitle>Delete User</CModalTitle>
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
      </>
    );
  }
}
function mapStateToProps(state) {
  const { users } = state;

  return {
    users: users,
  };
}

const mapDispatchToProps = { getUsersList };

export default connect(mapStateToProps, mapDispatchToProps)(User_Index);
