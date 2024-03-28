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
import CIcon from "@coreui/icons-react";
import MessagePopup from "./MyComponent";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
// import { agentService } from "../../../../services/admin/agent.service";
import { pushNotificationService } from "../../../../services/admin/push_notification.service";
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
} from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "../../../../constants/admin/global.constants";

class Push_Notifications_Index extends React.Component {
  constructor(props) {
    super(props);

    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteNotification = this.deleteNotification.bind(this);

    this.state = {
      fields: {
        page: 1,
        direction: "desc",
        sort: "title",
        title: "",
        description: "",
        customer_type: "",
        status: "",
        type: "",
        totalPage: 1,
      },
      notification_list: [],
      _openPopup: false,
      multiaction: [],
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/notifications");
    }
  }

  componentDidMount() {
    this.getPushNotificationLists();
  }

  getPushNotificationLists() {
    pushNotificationService
      .getPushNotificationList(this.state.fields)
      .then((res) => {
        if (res.success === false) {
          this.setState({
            totalRecords: res.data.total,
            fields: {
              ...this.state.fields,
            },
            notification_list: res.data.data,
          });
          notify.error(res.message);
        } else {
          this.setState({
            totalRecords: res.data.total,
            fields: {
              ...this.state.fields,
              totalPage: res?.data?.last_page,
            },
            notification_list: res.data.data,
          });

          /* Multi delete checkbox code */
          if (res?.data?.data?.length > 0) {
            let users = res.data.data;
            let multiaction = [];
            const current_user = _loginUsersDetails();
            for (var key in users) {
              if (
                globalConstants.DEVELOPER_PERMISSION_USER_ID.indexOf(
                  users[key].id
                ) > -1
              ) {
                continue;
              }
              if (current_user.user_group_id === users[key].id) {
                continue;
              }
              multiaction[users[key].id] = false;
            }

            this.setState({ multiaction: multiaction });
          } else if (res?.data?.data?.length === 0) {
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
        this.getPushNotificationLists();
      }
    );
  };

  handleColumnSort(fieldName) {
    this.setState(
      {
        fields: {
          ...this.state.fields,
          direction: ["desc"].includes(this.state.fields.direction)
            ? "asc"
            : "desc",
          sort: fieldName,
        },
      },
      () => {
        this.getPushNotificationLists();
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
          fields: {
            page: 1,
            direction: "desc",
            sort: "title",
            title: "",
            description: "",
            customer_type: "",
            status: "",
            type: "",
            totalPage: 1,
          },
        },
        () => {
          this.getPushNotificationLists(this.state.fields);
        }
      );
    } else {
      this.setState(
        {
          fields: {
            ...this.state.fields,
            page: 1
          },
        },
        () => {
          this.getPushNotificationLists(this.state.fields);
        }
      );
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }

  deleteNotification() {
    this.setState({ _openPopup: false, deleteId: undefined });
    pushNotificationService
      .deleteNotification(this.state.deleteId)
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getPushNotificationLists();
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

  // agentStatusChangedHandler(user_id, status) {
  //   let currentStatus;
  //   if (status === "0") {
  //     currentStatus = "1";
  //   }
  //   if (status === "1") {
  //     currentStatus = "0";
  //   }
  //   agentService
  //     .changeAgentStatus(user_id, { status: currentStatus })
  //     .then((res) => {
  //       if (res.status === "error") {
  //         notify.error(res.message);
  //       } else {
  //         notify.success(res.message);
  //         this.getPushNotificationLists();
  //       }
  //     });
  // }

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
                        <CLabel htmlFor="name">Title</CLabel>
                        <CInput
                          id="title"
                          placeholder="Search Title"
                          name="title"
                          value={this.state.fields.title}
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
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Status</CLabel>
                        <CSelect
                          id="name"
                          placeholder="Search Status"
                          name="status"
                          value={this.state.fields.status}
                          onChange={this.handleChange}
                          style={{ cursor: "pointer" }}
                          onKeyPress={(event) => {
                            if (event.key === "Enter") {
                              this.handleSearch("search");
                            }
                          }}
                        >
                          <option value="">-- Select Status --</option>
                          <option value="instant">Instant</option>
                          <option value="schedule">Schedule</option>
                        </CSelect>
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
                          onClick={() => this.handleSearch("search")}
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
                <strong>Push Notifications</strong>
                <div className="card-header-actions">
                  {_canAccess("notifications", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/notifications/add"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </CLink>
                    </CTooltip>
                  )}
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th onClick={() => this.handleColumnSort("title")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Title</span>
                            {this.state.fields.sort !== "title" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "title" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "title" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th
                          onClick={() => this.handleColumnSort("description")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Description
                            </span>
                            {this.state.fields.sort !== "description" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "description" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "description" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        <th
                          onClick={() => this.handleColumnSort("customer_type")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Customer Type
                            </span>
                            {this.state.fields.sort !== "customer_type" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "customer_type" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "customer_type" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>

                        {/* <th>User Groups</th> */}
                        {/* <th onClick={() => this.handleColumnSort("status")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Status
                            </span>
                            {this.state.fields.sort !== "status" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "status" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "status" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th> */}
                        <th onClick={() => this.handleColumnSort("type")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Type</span>
                            {this.state.fields.sort !== "type" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.direction === "asc" &&
                              this.state.fields.sort === "type" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.direction === "desc" &&
                              this.state.fields.sort === "type" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        {(_canAccess("users", "update") ||
                          _canAccess("users", "delete")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state?.notification_list?.length > 0 ? (
                        this.state.notification_list.map((u, index) => (
                          <tr key={u.id}>
                            <td>{this.state.fields.page >= 2
                                ? index + 1 + 10 * (this.state.fields.page - 1)
                                : index + 1}</td>
                            <td>{u.title}</td>
                            <td>
                              <MessagePopup message={u.description} />
                            </td>
                            <td>
                              {u.customer_type.charAt(0).toUpperCase() +
                                u.customer_type.slice(1)}
                            </td>
                            {/* <td>
                              {(() => {
                                switch (u.status) {
                                  case "send":
                                    return "Send";
                                  case "schedule":
                                    return "Schedule";
                                  case "inprogress":
                                    return "In Progress";
                                  default:
                                    return "";
                                }
                              })()}
                            </td> */}
                            <td>
                              {u.type.charAt(0).toUpperCase() + u.type.slice(1)}
                            </td>
                            {(_canAccess("notifications", "update") ||
                              _canAccess("notifications", "delete")) && (
                              <>
                                <td>
                                  {_canAccess("notifications", "update") && (
                                    <CTooltip
                                      content={globalConstants.EDIT_BTN}
                                    >
                                      <CLink
                                        className="btn  btn-md btn-primary"
                                        aria-current="page"
                                        to={`/admin/notifications/edit/${u.id}`}
                                      >
                                        <CIcon name="cil-pencil"></CIcon>{" "}
                                      </CLink>
                                    </CTooltip>
                                  )}
                                  &nbsp;
                                  {_canAccess("notifications", "delete") && (
                                    <CTooltip
                                      content={globalConstants.DELETE_BTN}
                                    >
                                      <button
                                        className="btn  btn-md btn-danger "
                                        onClick={() =>
                                          this.openDeletePopup(u.id)
                                        }
                                      >
                                        <CIcon name="cil-trash"></CIcon>
                                      </button>
                                    </CTooltip>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {this.state?.notification_list?.length > 0 ? (
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
          show={this.state._openPopup}
          onClose={() => {
            this.setState({ _openPopup: !this.state._openPopup });
          }}
          color="danger"
        >
          <CModalHeader closeButton>
            <CModalTitle>Delete Notification</CModalTitle>
          </CModalHeader>
          <CModalBody>Are you sure you want to delete this notification?</CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.deleteNotification()}>
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

export default Push_Notifications_Index;
