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
import { userGroupsService } from "../../../../services/admin/user_groups.service";
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
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "../../../../constants/admin/global.constants";
import CIcon from "@coreui/icons-react";
const CheckBoxes = React.lazy(() =>
  import("../../../../components/admin/Checkboxes")
);
const MultiActionBar = React.lazy(() =>
  import("../../../../components/admin/MultiActionBar")
);

class User_Groups_Index extends React.Component {
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
        pageNo: 1,
        sort_dir: "asc",
        sort_field: "user_group_name",
        search_user_group_name: "",
        totalPage: 1,
      },
      _openPopup: false,
      user_list: [],
      multiaction: [],
      allCheckedbox: false,
    };
    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/user_groups");
    }
  }

  componentDidMount() {
    this.getUserGroupsList();
  }

  getUserGroupsList() {
    userGroupsService.getUserGroupsList(this.state.fields).then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({
          totalRecords: res.totalRecords,
          fields: {
            ...this.state.fields,
            totalPage: res.totalPage,
          },
          user_list: res.result,
        });
        /* Multi delete checkbox code */
        if (res.result?.length > 0) {
          let users = res.result;
          let multiaction = [];
          const current_user = _loginUsersDetails();
          for (var key in users) {
            if (
              globalConstants.DEVELOPER_PERMISSION_USER_ID.indexOf(
                users[key]._id
              ) > -1
            ) {
              continue;
            }
            if (current_user.user_group_id === users[key]._id) {
              continue;
            }
            multiaction[users[key]._id] = false;
          }

          this.setState({ multiaction: multiaction });
        } else if (res.result?.length === 0) {
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
          pageNo: newPage,
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
            pageNo: 1,
            sort_dir: "asc",
            sort_field: "user_group_name",
            search_user_group_name: "",
            totalPage: 1,
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
    userGroupsService.deleteUserGroup(this.state.deleteId).then((res) => {
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
          userGroupsService
            .deleteMultipleUserGroups({ user_group_ids: appliedActionId })
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
          this.bulkUserGroupStatusChangeHandler({
            user_group_ids: appliedActionId,
            status: true,
          });
          break;
        }
        case "deactive": {
          this.bulkUserGroupStatusChangeHandler({
            user_group_ids: appliedActionId,
            status: false,
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

  handleCheckChieldElement = (event) => {
    let multiactions = this.state.multiaction;
    multiactions[event.target.value] = event.target.checked;
    this.setState({ multiaction: multiactions });
    let allTrue = false;
    if (this.state.multiaction?.length > 0) {
      allTrue = this.state.multiaction.every((element) => element === true);
    }
    this.setState({ allCheckedbox: allTrue });
  };

  UserGroupStatusChangedHandler(user_group_id, status) {
    userGroupsService
      .changeUserGroupStatus(user_group_id, { status: !status })
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getUserGroupsList();
        }
      });
  }

  bulkUserGroupStatusChangeHandler(postData) {
    userGroupsService.changeBulkUserGroupsStatus(postData).then((res) => {
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
                        <CLabel htmlFor="name"> Group Name</CLabel>
                        <CInput
                          id="name"
                          placeholder="Search  Group Name"
                          name="search_user_group_name"
                          value={this.state.fields.search_user_group_name}
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
                Groups Management
                <div className="card-header-actions">
                  {_canAccess("user_groups", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/user_groups/add"
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
                    module_name={"user_groups"}
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
                        <th
                          onClick={() =>
                            this.handleColumnSort("user_group_name")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Group Name
                            </span>
                            {this.state.fields.sort_field !==
                              "user_group_name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "user_group_name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "user_group_name" && (
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
                        {(_canAccess("user_groups", "update") 
                        // || _canAccess("user_groups", "delete")
                        ) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.user_list?.length > 0 &&
                        this.state.user_list?.map((u, index) => (
                          <tr key={u._id}>
                            <td>
                              {this.state.multiaction[u._id] !== undefined && (
                                <CheckBoxes
                                  handleCheckChieldElement={
                                    this.handleCheckChieldElement
                                  }
                                  _id={u._id}
                                  _isChecked={this.state.multiaction[u._id]}
                                />
                              )}
                            </td>
                            <td>{this.state.fields.pageNo >= 2
                                ? index + 1 + 10 * (this.state.fields.pageNo - 1)
                                : index + 1}</td>
                            <td>{u.user_group_name}</td>
                            <td>
                              {globalConstants.DEVELOPER_PERMISSION_USER_ID.indexOf(
                                u._id
                              ) === -1 && (
                                <>
                                  {current_user.user_group_id !== u._id &&
                                    _canAccess("user_groups", "update") && (
                                      <CLink
                                        onClick={() =>
                                          this.UserGroupStatusChangedHandler(
                                            u._id,
                                            u.status
                                          )
                                        }
                                      >
                                        {u.status ? "Active" : "Deactive"}
                                      </CLink>
                                    )}
                                  {current_user.user_group_id !== u._id &&
                                    _canAccess("user_groups", "update") ===
                                      false && (
                                      <>{u.status ? "Active" : "Deactive"}</>
                                    )}
                                </>
                              )}
                            </td>
                            {(_canAccess("user_groups", "update") ||
                              _canAccess("user_groups", "delete")) && (
                              <>
                                <td>
                                  {globalConstants.DEVELOPER_PERMISSION_USER_ID.indexOf(
                                    u._id
                                  ) === -1 && (
                                    <>
                                      {current_user.user_group_id !== u._id &&
                                        _canAccess("user_groups", "update") && (
                                          <CTooltip
                                            content={globalConstants.EDIT_BTN}
                                          >
                                            <CLink
                                              className="btn  btn-md btn-primary"
                                              aria-current="page"
                                              to={`/admin/user_groups/edit/${u._id}`}
                                            >
                                              <CIcon name="cil-pencil"></CIcon>{" "}
                                            </CLink>
                                          </CTooltip>
                                        )}
                                      &nbsp;
                                      {/* {current_user.user_group_id !== u._id &&
                                        _canAccess("user_groups", "delete") && (
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
                                        )} */}
                                    </>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      {this.state.user_list?.length === 0 && (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  <CPagination
                    activePage={this.state.fields.pageNo}
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
            <CModalTitle>Delete Group</CModalTitle>
          </CModalHeader>
          <CModalBody>
            If you are delete the group, then associate users will be delete.
            <br />
            Are you sure you want to delete this record?
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

export default User_Groups_Index;
