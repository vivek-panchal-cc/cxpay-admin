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
  CButtonGroup,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { menuManagementservice } from "../../../../services/admin/menu_management.service";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "../../../../constants/admin/global.constants";
const CheckBoxes = React.lazy(() =>
  import("../../../../components/admin/Checkboxes")
);
const MultiActionBar = React.lazy(() =>
  import("../../../../components/admin/MultiActionBar")
);

class Menu_Category_List extends React.Component {
  constructor(props) {
    super(props);

    // Bind Method with handler
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.handleChange = this.handleChange.bind(this);

    // Define initial State

    this.state = {
      fields: {
        pageNo: 1,
        sort_dir: "asc",
        sort_field: "menu_category_name",
        search_menu_category_name: "",
        totalPage: 1,
      },
      _openPopup: false,
      menu_category_list: [],
      multiaction: [],
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/menu_management");
    }
  }

  // Fetch Data very Fist Time when Component Load

  componentDidMount() {
    this.getMenucategoryList();
  }

  //Define Function For Get Records from Api

  getMenucategoryList() {
    menuManagementservice.getMenucategory(this.state.fields).then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({
          fields: {
            ...this.state.fields,
            totalPage: res.totalPage,
          },
          menu_category_list: res.result,
        });
        /*multi delete cms pages */
        if (res.result?.length > 0) {
          let menucategory = res.result;
          let multiaction = [];
          for (var key in menucategory) {
            multiaction[menucategory[key]._id] = false;
          }
          this.setState({ multiaction: multiaction });
        } else if (res.result?.length === 0) {
          this.setState({ multiaction: [] });
        }
      }
    });
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }

  //Delete Records

  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });
    menuManagementservice
      .deletemenucategory(this.state.deleteId)
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getMenucategoryList();
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
        this.getMenucategoryList();
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
        this.getMenucategoryList();
      }
    );
  }

  handleChange(e) {
    const { name, value } = e.target;

    this.setState({
      fields: {
        ...this.state.fields,
        [name]: value,
      },
    });
  }

  handleSearch(type) {
    if (type === "reset") {
      this.setState(
        {
          fields: {
            ...this.state.fields,
            pageNo: 1,
            sort_dir: "asc",
            sort_field: "menu_category_name",
            search_menu_category_name: "",
          },
        },
        () => {
          this.getMenucategoryList();
        }
      );
    } else {
      this.getMenucategoryList();
    }
  }

  menucategoryStatusChangedHandler(page_id, status) {
    menuManagementservice
      .changemenucategoryStatus(page_id, { status: !status })
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getMenucategoryList();
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
  bulkmenucategoryStatusChangeHandler(postData) {
    menuManagementservice.changeBulkMenucategoryStatus(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getMenucategoryList();
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
          menuManagementservice
            .deleteMultiplemenucategory({ menucategory_ids: appliedActionId })
            .then((res) => {
              if (res.status === false) {
                notify.error(res.message);
              } else {
                notify.success(res.message);
                this.getMenucategoryList();
              }
            });
          break;
        case "active": {
          this.bulkmenucategoryStatusChangeHandler({
            menucategory_ids: appliedActionId,
            status: true,
          });
          break;
        }
        case "deactive": {
          this.bulkmenucategoryStatusChangeHandler({
            menucategory_ids: appliedActionId,
            status: false,
          });
          break;
        }
        default:
          return "";
      }
    }
  };

  /*********** Render Date To Dom  *****************/
  render() {
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
                        <CLabel htmlFor="name">Menu Category</CLabel>
                        <CInput
                          id="search_menu_category_name"
                          placeholder="Search Menu Category"
                          name="search_menu_category_name"
                          value={this.state.fields.search_menu_category_name}
                          onChange={this.handleChange}
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
                Menu Management
                <div className="card-header-actions">
                  {_canAccess("menu_management", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/menu_management/add"
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
                    module_name={"menu_management"}
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
                        <th>
                          <span className="sortCls">
                            <span
                              className="table-header-text-mrg"
                              onClick={() =>
                                this.handleColumnSort("menu_category_name")
                              }
                            >
                              Menu Category
                            </span>
                            {this.state.fields.sort_field !==
                              "menu_category_name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "menu_category_name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "menu_category_name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th>
                          <span className="sortCls">
                            <span
                              className="table-header-text-mrg"
                              onClick={() => this.handleColumnSort("status")}
                            >
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
                        {(_canAccess("menu_management", "update") ||
                          _canAccess("menu_management", "delete") ||
                          _canAccess("menu_management", "menumanage")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.menu_category_list?.length > 0 &&
                        this.state.menu_category_list?.map((u, index) => (
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

                            <td>{this.state.fields.pageNo >= 2
                                ? index + 1 + 10 * (this.state.fields.pageNo - 1)
                                : index + 1}</td>
                            <td>{u.menu_category_name}</td>
                            <td>
                              {_canAccess("menu_management", "update") && (
                                <CLink
                                  onClick={() =>
                                    this.menucategoryStatusChangedHandler(
                                      u._id,
                                      u.status
                                    )
                                  }
                                >
                                  {u.status ? "Active" : "Deactive"}
                                </CLink>
                              )}
                              {_canAccess("menu_management", "update") ===
                                false && (
                                <>{u.status ? "Active" : "Deactive"}</>
                              )}
                            </td>
                            {(_canAccess("menu_management", "update") ||
                              _canAccess("menu_management", "delete") ||
                              _canAccess("menu_management", "menumanage")) && (
                              <>
                                <td>
                                  <CButtonGroup>
                                    {_canAccess(
                                      "menu_management",
                                      "update"
                                    ) && (
                                      <CTooltip
                                        content={globalConstants.EDIT_BTN}
                                      >
                                        <CLink
                                          className="btn  btn-md btn-primary"
                                          aria-current="page"
                                          to={`/admin/menu_management/edit/${u._id}`}
                                        >
                                          <CIcon name="cil-pencil"></CIcon>{" "}
                                        </CLink>
                                      </CTooltip>
                                    )}
                                    &nbsp;
                                    {_canAccess(
                                      "menu_management",
                                      "menumanage"
                                    ) && (
                                      <CTooltip
                                        content={globalConstants.List_BTN}
                                      >
                                        <CLink
                                          className="btn  btn-md btn-success"
                                          aria-current="page"
                                          to={{
                                            pathname: `/admin/menu_management/menu_items/${u._id}`,
                                            state: {
                                              category_name:
                                                u.menu_category_name,
                                            },
                                          }}
                                        >
                                          <CIcon name="cil-list"></CIcon>{" "}
                                        </CLink>
                                      </CTooltip>
                                    )}
                                    &nbsp;
                                    {_canAccess(
                                      "menu_management",
                                      "delete"
                                    ) && (
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
                                  </CButtonGroup>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      {this.state.menu_category_list?.length === 0 && (
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
            <CModalTitle>Delete Menu</CModalTitle>
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

export default Menu_Category_List;
