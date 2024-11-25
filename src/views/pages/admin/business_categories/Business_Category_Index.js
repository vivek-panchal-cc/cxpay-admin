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
  CFormText,
  CSwitch,
  CCardFooter,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
  faArrowLeft,
  faSave,
  faBan,
} from "@fortawesome/free-solid-svg-icons";
import { businessCategoryManagementService } from "../../../../services/admin/business_category_management.service";
import {
  notify,
  history,
  _canAccess,
  _loginUsersDetails,
} from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import SimpleReactValidator from "simple-react-validator";
import { feeManagementService } from "services/admin/fee_management.service";
import slugify from "react-slugify";
const CheckBoxes = React.lazy(() =>
  import("../../../../components/admin/Checkboxes")
);
const ActionBar = React.lazy(() =>
  import("../../../../components/admin/ActionBar")
);

class Business_Category_Index extends React.Component {
  constructor(props) {
    super(props);

    /************************** * Bind Method with class *******************************/

    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleAddChange = this.handleAddChange.bind(this);
    // this._handleCancelAction = this._handleCancelAction.bind(this);

    this.state = {
      fields: {
        pageNo: 1,
        sort_dir: "desc",
        sort_field: "created_at",
        totalPage: 1,
        fee_label: "",
        fee_type: "",
      },
      fieldsData: {
        fee_label: "",
        status: false,
      },
      _openPopup: false,
      category_list: [],
      multiaction: [],
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/business_category");
    }
  }

  componentDidMount() {
    this.getCategoryList();
  }

  getCategoryList() {
    businessCategoryManagementService
      .getFeeStructures(this.state.fields)
      .then((res) => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          this.setState({
            totalRecords: res.totalRecords,
            fields: {
              ...this.state.fields,
              totalPage: res.totalPage,
            },
            category_list: res.result,
          });

          /*multi delete cms pages */
          if (res.result && res.result?.length > 0) {
            let pages = res.result;
            let multiaction = [];
            for (var key in pages) {
              multiaction[pages[key]._id] = false;
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
          pageNo: newPage,
        },
      },
      () => {
        this.getCategoryList();
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
        this.getCategoryList();
      }
    );
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }

  handleAddChange(event) {
    const { name, type, value, checked } = event.target;
    const updatedValue = type === "checkbox" ? checked : value;

    this.setState((prevState) => ({
      fieldsData: {
        ...prevState.fieldsData,
        [name]: updatedValue,
      },
    }));
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
          this.getCategoryList();
        }
      );
    } else {
      this.getCategoryList();
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });

    var postData = { id: [this.state.deleteId] };

    businessCategoryManagementService.deletepage(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getCategoryList();
      }
    });
  }

  PageStatusChangedHandler(page_id, status) {
    businessCategoryManagementService
      .changeFeeStatus({ id: [page_id], status: status == false ? 1 : 0 })
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getCategoryList();
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
    let allTrue = false;
    if (this.state.multiaction?.length > 0) {
      allTrue = this.state.multiaction.every((element) => element === true);
    }
    this.setState({ allCheckedbox: allTrue });
  };

  resetCheckedBox() {
    this.setState({ allCheckedbox: false });
  }

  bulkPageStatusChangeHandler(postData) {
    businessCategoryManagementService
      .changeBulkFeeStatus(postData)
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getCategoryList();
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

  handleSubmit(event) {
    this.checkValidation(event);
  }

  checkValidation(event) {
    if (this.validator.allValid()) {
      feeManagementService
        .createFeeStructure({
          fee_label: this.state.fieldsData.fee_label,
          status: this.state.fieldsData.status == false ? 0 : 1,
        })
        .then((res) => {
          if (res.status === "error") {
            notify.error(res.message);
          } else {
            notify.success(res.message);
            history.push("/admin/business_category");
            event.preventDefault();
          }
        });
    } else {
      this.validator.showMessages();
    }
  }

  /****************** * Render Data To Dom ************************/

  render() {
    const current_user = _loginUsersDetails();
    return (
      <>
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardHeader>
                <strong>Add Business Category</strong>
              </CCardHeader>
              <CCardBody>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Fee Label</CLabel>
                  <CInput
                    type="text"
                    id="fee_label"
                    name="fee_label"
                    placeholder="Enter Fee Label"
                    autoComplete="fee_label"
                    onChange={this.handleAddChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "fee_label",
                      this.state.fieldsData.fee_label,
                      "required",
                      {
                        className: "text-danger",
                      }
                    )}
                  </CFormText>
                </CFormGroup>

                <CFormGroup row>
                  <CCol tag="label" sm="1" className="col-form-label">
                    Status
                  </CCol>
                  <CCol sm="11">
                    <CFormGroup variant="custom-checkbox" inline>
                      <CSwitch
                        name="status"
                        className="mr-1"
                        color="primary"
                        defaultChecked={this.state.fieldsData.status}
                        onClick={this.handleAddChange}
                      />
                    </CFormGroup>
                  </CCol>
                </CFormGroup>
              </CCardBody>
              <CCardFooter>
                <CButton
                  type="button"
                  size="sm"
                  color="primary"
                  onClick={this.handleSubmit}
                >
                  {" "}
                  <FontAwesomeIcon icon={faSave} className="mr-1" /> Submit
                </CButton>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardHeader>
                <strong>Search Business Category</strong>
              </CCardHeader>
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
                <strong>Business Categories</strong>
                <div className="card-header-actions">
                  {_canAccess("business_category", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/business_category/add"
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
                    module_name={"business_category"}
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
                        {(_canAccess("business_category", "update") ||
                          _canAccess("business_category", "delete")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.category_list &&
                        this.state.category_list?.length > 0 &&
                        this.state.category_list?.map((u, index) => (
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

                            <td>
                              {this.state.fields.pageNo >= 2
                                ? index +
                                  1 +
                                  10 * (this.state.fields.pageNo - 1)
                                : index + 1}
                            </td>
                            <td>{u.payment_type}</td>

                            <td>
                              {_canAccess("business_category", "update") && (
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
                              {_canAccess("business_category", "update") ===
                                false && (
                                <>
                                  {u.status == true ? "Activate" : "Deactivate"}
                                </>
                              )}
                            </td>
                            {(_canAccess("business_category", "update") ||
                              _canAccess("business_category", "delete")) && (
                              <>
                                <td>
                                  {_canAccess(
                                    "business_category",
                                    "update"
                                  ) && (
                                    <CTooltip
                                      content={globalConstants.EDIT_BTN}
                                    >
                                      <CLink
                                        className="btn  btn-md btn-primary"
                                        aria-current="page"
                                        to={`/admin/business_category/edit/${u._id}`}
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
                      {this.state.category_list &&
                        this.state.category_list?.length === 0 && (
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

export default Business_Category_Index;