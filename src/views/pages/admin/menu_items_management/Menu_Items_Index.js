import React from "react";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CLink,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CPagination,
  CFormGroup,
  CLabel,
  CInput,
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { MenuitemServices } from "../../../../services/admin/menu_item_service";
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

class Menu_Items_List extends React.Component {
  constructor(props) {
    super(props);

    // Bind Method with handler
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    // Define initial State

    this.state = {
      fields: {
        pageNo: 1,
        sort_dir: "asc",
        sort_field: "menu_title",
        search_menu_title: "",
        totalPage: 1,
        id: this.props.match.params.id,
      },
      _openPopup: false,
      menu_item_list: "",
      multiaction: [],
      allCheckedbox: false,
      menu_category_name: "",
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/menu_management");
    }
  }

  // Fetch Data very Fist Time when Component Load

  componentDidMount() {
    setTimeout(() => {
      if (
        _canAccess(
          this.props.module_name,
          this.props.action,
          "/admin/menu_management"
        )
      ) {
        this.getMenuitemsList();
      }
    }, 300);
  }

  //Define Function For Get Records from Api

  getMenuitemsList() {
    MenuitemServices.getMenuitems(this.state.fields).then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({
          totalRecords: res.totalRecords,
          menu_category_name: res.menu_category_name,
          fields: {
            ...this.state.fields,
            totalPage: res.totalPage,
          },
          menu_item_list: res.result,
        });
        /*multi delete cms pages */
        if (res.result.length > 0) {
          let menuitem = res.result;
          let multiaction = [];
          for (var key in menuitem) {
            multiaction[menuitem[key]._id] = false;
          }
          this.setState({ multiaction: multiaction });
        } else if (res.result.length === 0) {
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
    MenuitemServices.deletemenuitem(this.state.deleteId).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getMenuitemsList();
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
        this.getMenuitemsList();
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
        this.getMenuitemsList();
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
            sort_field: "menu_title",
            search_menu_title: "",
          },
        },
        () => {
          this.getMenuitemsList();
        }
      );
    } else {
      this.getMenuitemsList();
    }
  }

  menuitemStatusChangedHandler(page_id, status) {
    MenuitemServices.changemenuitemStatus(page_id, { status: !status }).then(
      (res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getMenuitemsList();
        }
      }
    );
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
  bulkmenuitemChangeHandler(postData) {
    MenuitemServices.changeBulkMenuitemStatus(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getMenuitemsList();
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
          MenuitemServices.deleteMultiplemenuitem({
            menuitem_ids: appliedActionId,
          }).then((res) => {
            if (res.status === false) {
              notify.error(res.message);
            } else {
              notify.success(res.message);
              this.getMenuitemsList();
            }
          });
          break;
        case "active": {
          this.bulkmenuitemChangeHandler({
            menuitem_ids: appliedActionId,
            status: true,
          });
          break;
        }
        case "deactive": {
          this.bulkmenuitemChangeHandler({
            menuitem_ids: appliedActionId,
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
                        <CLabel htmlFor="name">Menu Title</CLabel>
                        <CInput
                          id="search_menu_title"
                          placeholder="Search Menu Title"
                          name="search_menu_title"
                          value={this.state.fields.search_menu_title}
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
                <strong>
                  {this.state.menu_category_name !== "" &&
                    this.state.menu_category_name}
                </strong>{" "}
                Item Management
                <div className="card-header-actions">
                  {_canAccess("menu_management", "menumanage") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to={{
                          pathname: `/admin/menu_management/menu_items/add/${this.state.fields.id}`,
                          state: { next_order: this.state.totalRecords + 1 },
                        }}
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
                    module_name={"menu_items"}
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
                        <th onClick={() => this.handleColumnSort("menu_title")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Menu Title
                            </span>
                            {this.state.fields.sort_field !== "menu_title" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "menu_title" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "menu_title" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th onClick={() => this.handleColumnSort("menu_types")}>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Menu Types
                            </span>
                            {this.state.fields.sort_field !== "menu_types" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field === "menu_types" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field === "menu_types" && (
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
                      {this.state.menu_item_list.length > 0 &&
                        this.state.menu_item_list.map((u, index) => (
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
                            <td>{index + 1}</td>

                            <td>{u.menu_title}</td>
                            <td>{u.menu_types}</td>
                            <td>
                              {_canAccess("menu_management", "update") && (
                                <CLink
                                  onClick={() =>
                                    this.menuitemStatusChangedHandler(
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
                            <td>
                              {_canAccess("menu_management", "menumanage") && (
                                <CTooltip content={globalConstants.EDIT_BTN}>
                                  <CLink
                                    className="btn  btn-md btn-primary"
                                    aria-current="page"
                                    to={`/admin/menu_management/menu_items/edit/${u.menu_category_id}/${u._id}`}
                                  >
                                    <CIcon name="cil-pencil"></CIcon>{" "}
                                  </CLink>
                                </CTooltip>
                              )}
                              &nbsp;
                              {_canAccess("menu_management", "menumanage") && (
                                <CTooltip content={globalConstants.DELETE_BTN}>
                                  <button
                                    className="btn  btn-md btn-danger "
                                    onClick={() => this.openDeletePopup(u._id)}
                                  >
                                    <CIcon name="cil-trash"></CIcon>
                                  </button>
                                </CTooltip>
                              )}
                            </td>
                          </tr>
                        ))}
                      {this.state.menu_item_list.length === 0 && (
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
            <CModalTitle>Delete Menu Item</CModalTitle>
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

export default Menu_Items_List;
