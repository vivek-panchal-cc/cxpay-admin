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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
  faEye,
  faList,
} from "@fortawesome/free-solid-svg-icons";
import { agentService } from "../../../../services/admin/agent.service";
import {
  notify,
  history,
  _canAccess,
  _loginUsersDetails,
} from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
const CheckBoxes = React.lazy(() =>
  import("../../../../components/admin/Checkboxes")
);
const MultiActionBar = React.lazy(() =>
  import("../../../../components/admin/MultiActionBar")
);

class Agent_list extends React.Component {
  constructor(props) {
    super(props);

    /************************** * Bind Method with class *******************************/

    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    this.state = {
      fields: {
        page: 1,
        search: "",
        status: "",
        sort_field: "created_at",
        sort_dir: "DESC",
      },
      _openPopup: false,
      agents: [],
      multiaction: [],
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/agent_customers");
    }
  }

  /***************** *  Get Api data when component Render very First Time *********************/

  componentDidMount() {
    this.getAgentList();
  }

  getAgentList() {
    agentService.getAgentList(this.state.fields).then((res) => {
      if (res.success === false) {
        notify.error(res.message);
      } else {
        this.setState({
          totalRecords: res.data?.pagination?.total,
          fields: {
            ...this.state.fields,
            totalPage: res.data?.pagination?.last_page,
          },
          agents: res.data?.agents,
          // agents: res.data?.agents,
        });

        /*multi delete cms pages */
        if (res.data?.agents?.length > 0) {
          let pages = res.data?.agents;
          let multiaction = [];
          for (var key in pages) {
            multiaction[pages[key].mobile_number] = false;
          }
          this.setState({ multiaction: multiaction });
        } else if (res.data?.agents?.length === 0) {
          this.setState({ multiaction: [] });
        }
      }
      this.resetCheckedBox();
    });
  }

  /************************* * Define Methods For sorting and page change**************************/
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
        this.getAgentList();
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
        this.getAgentList();
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
            search: "",
            status: "",
            sort_field: "created_at",
            sort_dir: "DESC",
          },
        },
        () => {
          this.getAgentList();
        }
      );
    } else {
      this.setState({ fields: { ...this.state.fields, page: "" } }, () => {
        this.getAgentList();
      });
      // this.getAgentList();
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteUser() {
    let postData = { mobile_number: [this.state.deleteId] };
    this.setState({ _openPopup: false, deleteId: undefined });
    agentService.deleteAgent(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getAgentList();
      }
    });
  }

  PageStatusChangedHandler(id, status) {
    var postData = {
      mobile_number: [id],
      status: status == 0 ? 1 : 0,
      user_type: "agent",
    };
    agentService.changeAgentStatus(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getAgentList();
      }
    });
  }

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

  resetCheckedBox() {
    this.setState({ allCheckedbox: false });
  }

  bulkPageStatusChangeHandler(postData) {
    agentService.changeBulkPageStatus(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getAgentList();
      }
    });
  }

  bulkCustomerStatusChangeHandler(postData) {
    agentService.changeBulkCustomerStatus(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getAgentList();
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
        case "delete":
          agentService
            .deleteAgent({ mobile_number: appliedActionId })
            .then((res) => {
              if (res.status === false) {
                notify.error(res.message);
              } else {
                notify.success(res.message);
                this.getAgentList();
              }
            });
          break;
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

  /****************** * Render Data To Dom ************************/

  render() {
    const current_user = _loginUsersDetails();
    return (
      <>
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardBody>
                <CRow>
                  <CCol xl={5}>
                    <CFormGroup row>
                      <CCol xs="6">
                        <CLabel htmlFor="name">Title</CLabel>
                        <CInput
                          id="name"
                          placeholder="Search Title"
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
                      <CCol xs="6">
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
                Agent
                <div className="card-header-actions px-2">
                  {_canAccess("agent_customers", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/agent_customers/add"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </CLink>
                    </CTooltip>
                  )}
                </div>
                <div className="card-header-actions">
                  {_canAccess("agent_customers", "delete") && (
                    <CTooltip content={globalConstants.DELETE_REQ_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/agent_customers/delete_requests"
                      >
                        {/* <FontAwesomeIcon icon={faList} /> */}
                        Delete Requests
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
                    module_name={"agent_customers"}
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
                            <span className="table-header-text-mrg">email</span>
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
                        {(_canAccess("agent_customers", "update") ||
                          _canAccess("agent_customers", "delete")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {this.state?.agents?.length > 0 &&
                        this.state.agents.map((u, index) => (
                          <tr key={u.email}>
                            <td>
                              {this.state.multiaction[u.mobile_number] !==
                                undefined && (
                                <CheckBoxes
                                  handleCheckChieldElement={
                                    this.handleCheckChieldElement
                                  }
                                  _id={u.mobile_number}
                                  _isChecked={
                                    this.state.multiaction[u.mobile_number]
                                  }
                                />
                              )}
                            </td>

                            <td>{index + 1}</td>
                            <td>
                              {" "}
                              {/* {_canAccess("agent_customers", "view") && (
                                <CLink
                                  to={`/admin/agent_customers/detailview/${u._id}`}
                                > */}
                              {u.name}
                              {/* </CLink>
                              )} */}
                            </td>
                            <td>{u.email}</td>
                            <td>{u.mobile_number}</td>
                            <td>
                              {current_user.id !== u._id &&
                                _canAccess("agent_customers", "update") && (
                                  <CLink
                                    onClick={() =>
                                      this.PageStatusChangedHandler(
                                        u.mobile_number,
                                        u.status
                                      )
                                    }
                                  >
                                    {u.status == "0" ? "Active" : "Deactive"}
                                  </CLink>
                                )}
                              {current_user.id !== u._id &&
                                _canAccess("agent_customers", "update") ===
                                  false && (
                                  <>{u.status ? "Active" : "Deactive"}</>
                                )}
                            </td>
                            {(_canAccess("agent_customers", "update") ||
                              _canAccess("agent_customers", "delete") ||
                              _canAccess("agent_customers", "view")) && (
                              <>
                                <td className="d-flex">
                                  {_canAccess("agent_customers", "update") && (
                                    <CTooltip
                                      content={globalConstants.EDIT_BTN}
                                    >
                                      <CLink
                                        className="btn  btn-md btn-primary"
                                        aria-current="page"
                                        to={`/admin/agent_customers/edit/${u.account_number}`}
                                      >
                                        <CIcon name="cil-pencil"></CIcon>{" "}
                                      </CLink>
                                    </CTooltip>
                                  )}
                                  &nbsp;
                                  {_canAccess("agent_customers", "delete") && (
                                    <CTooltip
                                      content={globalConstants.DELETE_BTN}
                                    >
                                      <button
                                        className="btn  btn-md btn-danger "
                                        onClick={() =>
                                          this.openDeletePopup(u.mobile_number)
                                        }
                                      >
                                        <CIcon name="cil-trash"></CIcon>
                                      </button>
                                    </CTooltip>
                                  )}
                                  &nbsp;
                                  {_canAccess("agent_customers", "view") && (
                                    <CTooltip
                                      content={
                                        globalConstants.VIEW_RECHARGE_DETAILS
                                      }
                                    >
                                      <CLink
                                        className="btn btn-dark btn-block w-auto"
                                        aria-current="page"
                                        to={`/admin/agent_customers/detailview/${u.account_number}`}
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
                      {this.state.agents?.length === 0 && (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  {this.state?.agents?.length > 0 && (
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
            <CModalTitle>Delete Agent</CModalTitle>
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

export default Agent_list;
