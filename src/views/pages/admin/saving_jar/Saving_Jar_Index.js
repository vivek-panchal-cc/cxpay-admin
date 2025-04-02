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
  faEye,
} from "@fortawesome/free-solid-svg-icons";
import {
  notify,
  history,
  _canAccess,
  capitalize,
} from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { savingJarService } from "services/admin/savings_jar.service";

const MultiActionBar = React.lazy(() =>
  import("../../../../components/admin/MultiActionBar")
);
const CheckBoxes = React.lazy(() =>
  import("../../../../components/admin/Checkboxes")
);

class Saving_Jar_Index extends React.Component {
  constructor(props) {
    super(props);
    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.getSavingJarCategoryList = this.getSavingJarCategoryList.bind(this);

    this.state = {
      fields: {
        page: 1,
        sort_dir: "asc",
        sort_field: "jar_category_name",
        search_name: "",
        totalPage: 1,
        operation_type: "saving_jar_category_list",
      },
      editFormId: "",
      showAddForm: false,
      showEditForm: false,
      _openPopup: false,
      saving_jar_category_list: [],
      multiaction: [],
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/saving_jar");
    }
  }

  componentDidMount() {
    this.getSavingJarCategoryList();
  }

  getSavingJarCategoryList() {
    savingJarService.savingJarBulkAction(this.state.fields).then((res) => {
      if (!res.success) {
        notify.error(res.message);
        this.setState({ saving_jar_category_list: [] });
      } else {
        this.setState({
          totalRecords: res.data?.pagination?.total,
          fields: {
            ...this.state.fields,
            totalPage: res.data?.pagination?.last_page,
          },
          saving_jar_category_list: res.data?.category,
        });

        if (res?.data && res?.data?.category?.length > 0) {
          let categories = res?.data?.category;
          let multiaction = [];
          for (var key in categories) {
            multiaction[categories[key].id] = false;
          }
          this.setState({ multiaction: multiaction });
        } else if (res.data?.category?.length === 0) {
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
        this.getSavingJarCategoryList();
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
        this.getSavingJarCategoryList();
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
            sort_dir: "asc",
            sort_field: "jar_category_name",
            search_name: "",
            totalPage: 1,
            operation_type: "saving_jar_category_list",
          },
          showEditForm: false,
          showAddForm: false,
          editFormId: "",
          multiaction: [],
          allCheckedbox: false,
        },
        () => {
          this.getSavingJarCategoryList();
        }
      );
    } else {
      this.setState(
        { showEditForm: false, showAddForm: false, editFormId: "" },
        () => {
          this.getSavingJarCategoryList();
        }
      );
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }

  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });

    var postData = {
      id: [this.state.deleteId],
      operation_type: "saving_jar_category_delete",
    };

    savingJarService.savingJarBulkAction(postData).then((res) => {
      if (!res.success) {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getSavingJarCategoryList();
      }
    });
  }

  categoryStatusChangedHandler(id, status) {
    savingJarService
      .savingJarBulkAction({
        id: [id],
        status: status === false ? true : false,
        operation_type: "saving_jar_category_status_change",
      })
      .then((res) => {
        if (!res.success) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getSavingJarCategoryList();
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

  bulkCategoryStatusChangeHandler(postData) {
    this.setState({ showAddForm: false, showEditForm: false, editFormId: "" });
    savingJarService.savingJarBulkAction(postData).then((res) => {
      if (!res.success) {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getSavingJarCategoryList();
      }
    });
  }

  bulkSavingJarDeleteHandler(postData) {
    savingJarService.savingJarBulkAction(postData).then((res) => {
      if (!res.success) {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getSavingJarCategoryList();
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
          this.bulkSavingJarDeleteHandler({
            id: appliedActionId,
            operation_type: "saving_jar_category_delete",
          });
          break;
        case "active": {
          this.bulkCategoryStatusChangeHandler({
            id: appliedActionId,
            status: true,
            operation_type: "saving_jar_category_status_change",
          });
          break;
        }
        case "deactive": {
          this.bulkCategoryStatusChangeHandler({
            id: appliedActionId,
            status: false,
            operation_type: "saving_jar_category_status_change",
          });
          break;
        }
        default:
          return "";
      }
    }
  };

  render() {
    return (
      <>
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardHeader>
                <strong>Sub-account Categories</strong>
                <div className="card-header-actions">
                  {_canAccess("saving_jar", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/saving_jar/add"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </CLink>
                    </CTooltip>
                  )}
                </div>
                <CRow>
                  <CCol xl={12} className="p-0">
                    <CCardBody>
                      <CRow style={{ flexWrap: "nowrap" }}>
                        <CCol xl={3}>
                          <CFormGroup
                            row
                            className="flex flex-wrap nowrap mb-0"
                          >
                            <CCol xs="12" className="p-0">
                              <CInput
                                id="search_name"
                                placeholder="Search Sub-account Category"
                                name="search_name"
                                value={this.state.fields.search_name}
                                onChange={this.handleChange}
                                onKeyPress={(event) => {
                                  if (event.key === "Enter") {
                                    this.handleSearch("search_name");
                                  }
                                }}
                              />
                            </CCol>
                          </CFormGroup>
                        </CCol>
                        <CCol xl={9}>
                          <CFormGroup
                            row
                            className="flex flex-wrap nowrap mb-0"
                          >
                            <CCol xs="12">
                              <button
                                className="btn btn-dark btn-md mr-2"
                                onClick={() => this.handleSearch()}
                              >
                                Search
                              </button>
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
                      <CRow></CRow>
                    </CCardBody>
                  </CCol>
                </CRow>
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  <MultiActionBar
                    onClick={this.handleApplyAction}
                    checkBoxData={this.state.multiaction}
                    module_name={"saving_jar"}
                  />
                  <table className="table">
                    <thead>
                      <tr>
                        {(_canAccess("saving_jar", "update") ||
                          _canAccess("saving_jar", "delete")) && (
                          <th>
                            <input
                              type="checkbox"
                              onClick={this.handleAllChecked}
                              value="checkedall"
                              onChange={(e) => {}}
                              checked={this.state.allCheckedbox}
                            />
                          </th>
                        )}
                        <th>#</th>
                        <th
                          onClick={() =>
                            this.handleColumnSort("jar_category_name")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Name</span>
                            {this.state.fields.sort_field !==
                              "jar_category_name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "jar_category_name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "jar_category_name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th>
                          <div className="d-flex justify-content-center">
                            Background Color
                          </div>
                        </th>
                        <th
                          onClick={() =>
                            this.handleColumnSort("jar_category_status")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Status
                            </span>
                            {this.state.fields.sort_field !==
                              "jar_category_status" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "jar_category_status" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "jar_category_status" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        {(_canAccess("saving_jar", "update") ||
                          _canAccess("saving_jar", "delete") ||
                          _canAccess("saving_jar", "view")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.saving_jar_category_list &&
                        this.state.saving_jar_category_list?.length > 0 &&
                        this.state.saving_jar_category_list?.map((u, index) => (
                          <tr key={u.id}>
                            {(_canAccess("saving_jar", "update") ||
                              _canAccess("saving_jar", "delete")) && (
                              <td>
                                <CheckBoxes
                                  handleCheckChieldElement={
                                    this.handleCheckChieldElement
                                  }
                                  _id={u.id}
                                  _isChecked={this.state.multiaction[u.id]}
                                />
                              </td>
                            )}

                            <td>
                              {this.state.fields.page >= 2
                                ? index + 1 + 10 * (this.state.fields.page - 1)
                                : index + 1}
                            </td>
                            <td>{capitalize(u.jar_category_name)}</td>
                            <td
                              className="text-center"
                              style={{ verticalAlign: "middle" }}
                            >
                              <div
                                style={{
                                  backgroundColor: u.bg_color || "#a279e4",
                                  borderRadius: "50%",
                                  width: "40px", // Adjust the size if needed
                                  height: "40px",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  margin: "auto",
                                }}
                              ></div>
                            </td>
                            <td>
                              {_canAccess("saving_jar", "update") ? (
                                <CLink
                                  onClick={() =>
                                    this.categoryStatusChangedHandler(
                                      u.id,
                                      u.jar_category_status
                                    )
                                  }
                                >
                                  {u.jar_category_status === false
                                    ? "Activate"
                                    : "Deactivate"}
                                </CLink>
                              ) : (
                                <>
                                  {u.jar_category_status === false
                                    ? "Deactive"
                                    : "Active"}
                                </>
                              )}
                            </td>
                            {(_canAccess("saving_jar", "update") ||
                              _canAccess("saving_jar", "delete") ||
                              _canAccess("saving_jar", "view")) && (
                              <>
                                <td>
                                  <div className="d-flex">
                                    {_canAccess("saving_jar", "update") && (
                                      <CTooltip
                                        content={globalConstants.EDIT_BTN}
                                      >
                                        <CLink
                                          className="btn  btn-md btn-primary"
                                          aria-current="page"
                                          to={`/admin/saving_jar/edit/${u.id}`}
                                        >
                                          <CIcon name="cil-pencil"></CIcon>{" "}
                                        </CLink>
                                      </CTooltip>
                                    )}
                                    &nbsp;
                                    {_canAccess("saving_jar", "delete") && (
                                      <CTooltip
                                        content={globalConstants.DELETE_BTN}
                                      >
                                        <button
                                          className="btn btn-md btn-danger "
                                          onClick={() =>
                                            this.openDeletePopup(u.id)
                                          }
                                        >
                                          <CIcon name="cil-trash"></CIcon>
                                        </button>
                                      </CTooltip>
                                    )}
                                    &nbsp;
                                    {_canAccess("saving_jar", "view") && (
                                      <CTooltip
                                        content={
                                          globalConstants.VIEW_JAR_CATEGORY_DETAILS
                                        }
                                      >
                                        <CLink
                                          className="btn btn-dark btn-block w-auto"
                                          aria-current="page"
                                          to={{
                                            pathname: `/admin/saving_jar/${u.id}/basic_details`,
                                            state: {
                                              route: "basic_details",
                                            },
                                          }}
                                        >
                                          <FontAwesomeIcon icon={faEye} />
                                        </CLink>
                                      </CTooltip>
                                    )}
                                  </div>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      {this.state.saving_jar_category_list &&
                        this.state.saving_jar_category_list?.length === 0 && (
                          <tr>
                            <td colSpan="5">No records found</td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                  {this.state.saving_jar_category_list?.length > 0 && (
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
            <CModalTitle>Delete Sub-account Category</CModalTitle>
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

export default Saving_Jar_Index;
