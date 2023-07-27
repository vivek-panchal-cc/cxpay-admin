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
import CIcon from "@coreui/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { feeManagementService } from "../../../../services/admin/fee_management.service";
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
const ActionBar = React.lazy(() =>
  import("../../../../components/admin/ActionBar")
);

class Fee_Management_Index extends React.Component {
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
        pageNo: 1,
        sort_dir: "desc",
        sort_field: "created_at",
        totalPage: 1,
        fee_label: "",
        fee_type: "",
      },
      _openPopup: false,
      page_list: [],
      multiaction: [],
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/fee_management");
    }
  }

  /***************** *  Get Api data when component Render very First Time *********************/

  componentDidMount() {
    this.getCmsPageList();
  }
  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();
      this.getCmsPageList();
    }
  };
  getCmsPageList() {
    feeManagementService.getFeeStructures(this.state.fields).then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({
          totalRecords: res.totalRecords,
          fields: {
            ...this.state.fields,
            totalPage: res.totalPage,
          },
          page_list: res.result,
        });

        /*multi delete cms pages */
        if (res.result && res.result.length > 0) {
          let pages = res.result;
          let multiaction = [];
          for (var key in pages) {
            multiaction[pages[key]._id] = false;
          }
          this.setState({ multiaction: multiaction });
        } else if (res.result && res.result.length === 0) {
          this.setState({ multiaction: [] });
        }
      }
    });
  }

  /************************* * Define Methods For sorting and page change**************************/
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
        this.getCmsPageList();
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
        this.getCmsPageList();
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
            pageNo: 1,
            sort_dir: "asc",
            sort_field: "fee_label",
            search_name: "",
            totalPage: 1,
            fee_label: "",
            fee_type: "",
          },
        },
        () => {
          this.getCmsPageList();
        }
      );
    } else {
      this.getCmsPageList();
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });

    var postData = { id: [this.state.deleteId] };

    feeManagementService.deletepage(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getCmsPageList();
      }
    });
  }

  PageStatusChangedHandler(page_id, status) {
    feeManagementService
      .changeFeeStatus({ id: [page_id], status: status == false ? 1 : 0 })
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getCmsPageList();
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

  handleCheckChieldElement = (event) => {
    let multiactions = this.state.multiaction;
    multiactions[event.target.value] = event.target.checked;
    this.setState({ multiaction: multiactions });
  };

  resetCheckedBox() {
    this.setState({ allCheckedbox: false });
  }

  bulkPageStatusChangeHandler(postData) {
    feeManagementService.changeBulkFeeStatus(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getCmsPageList();
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
        case "active": {
          this.bulkPageStatusChangeHandler({
            id: appliedActionId,
            status: 1,
          });
          break;
        }
        case "deactive": {
          this.bulkPageStatusChangeHandler({
            id: appliedActionId,
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
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Fee Type</CLabel>
                        <CInput
                          id="fee_type"
                          placeholder="Search Fee Type"
                          name="fee_type"
                          value={this.state.fields.fee_type}
                          onChange={this.handleChange}
                          onKeyDown={this.handleKeyDown}
                        />
                      </CCol>
                    </CFormGroup>
                  </CCol>
                  <CCol xl={3}>
                    <CFormGroup row>
                      <CCol xs="12">
                        <CLabel htmlFor="name">Fee Label</CLabel>
                        <CInput
                          id="fee_label"
                          placeholder="Search Fee Label"
                          name="fee_label"
                          value={this.state.fields.fee_label}
                          onChange={this.handleChange}
                          onKeyDown={this.handleKeyDown}
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
                Fee Management
                <div className="card-header-actions">
                  {_canAccess("fee_management", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/fee_management/add"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </CLink>
                    </CTooltip>
                  )}
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  <ActionBar
                    onClick={this.handleApplyAction}
                    checkBoxData={this.state.multiaction}
                    module_name={"fee_management"}
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
                          onClick={() => this.handleColumnSort("payment_type")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Payment Type
                            </span>
                            {this.state.fields.sort_field !==
                              "payment_type" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "payment_type" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "payment_type" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("fee_type")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Fee Type
                            </span>
                            {this.state.fields.sort_field !== "fee_type" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "fee_type" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "fee_type" && (
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
                        <th onClick={() => this.handleColumnSort("fee_label")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Fee Label
                            </span>
                            {this.state.fields.sort_field !== "fee_label" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "fee_label" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "fee_label" && (
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
                        {(_canAccess("fee_management", "update") ||
                          _canAccess("fee_management", "delete")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.page_list &&
                        this.state.page_list.length > 0 &&
                        this.state.page_list.map((u, index) => (
                          <tr key={u._id}>
                            <td>
                              <CheckBoxes
                                handleCheckChieldElement={
                                  this.handleCheckChieldElement
                                }
                                _id={u._id}
                                _isChecked={this.state.multiaction[u._id]}
                              />
                            </td>

                            {/* <td>{index + 1}</td> */}
                            <td>{u.payment_type}</td>
                            <td>{u.fee_type}</td>
                            <td>{u.amount}</td>
                            <td>{u.fee_label}</td>

                            <td>
                              {current_user.id !== u._id &&
                                _canAccess("fee_management", "update") && (
                                  <CLink
                                    onClick={() =>
                                      this.PageStatusChangedHandler(
                                        u._id,
                                        u.status
                                      )
                                    }
                                  >
                                    {u.status == false
                                      ? "Activate"
                                      : "Deactivate"}
                                  </CLink>
                                )}
                              {current_user.id !== u._id &&
                                _canAccess("fee_management", "update") ===
                                  false && (
                                  <>
                                    {u.status == true
                                      ? "Activate"
                                      : "Deactivate"}
                                  </>
                                )}
                            </td>
                            {(_canAccess("fee_management", "update") ||
                              _canAccess("fee_management", "delete")) && (
                              <>
                                <td>
                                  {_canAccess("fee_management", "update") && (
                                    <CTooltip
                                      content={globalConstants.EDIT_BTN}
                                    >
                                      <CLink
                                        className="btn  btn-md btn-primary"
                                        aria-current="page"
                                        to={`/admin/fee_management/edit/${u._id}`}
                                      >
                                        <CIcon name="cil-pencil"></CIcon>{" "}
                                      </CLink>
                                    </CTooltip>
                                  )}
                                  &nbsp;
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      {this.state.page_list &&
                        this.state.page_list.length === 0 && (
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
            <CModalTitle>Delete Page</CModalTitle>
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

export default Fee_Management_Index;
