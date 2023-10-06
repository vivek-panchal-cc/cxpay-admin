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
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { bannerManagementser } from "../../../../services/admin/banner_management.service";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { globalConstants } from "../../../../constants/admin/global.constants";

const CheckBoxes = React.lazy(() =>
  import("../../../../components/admin/Checkboxes")
);
const MultiActionBar = React.lazy(() =>
  import("../../../../components/admin/MultiActionBar")
);

const API_URL = process.env.REACT_APP_API_URL;

class Banner_list extends React.Component {
  constructor(props) {
    super(props);

    /************************** * Bind Method with class *******************************/

    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.openimgpop = this.openimgpop.bind(this);

    this.state = {
      fields: {
        pageNo: 1,
        sort_dir: "asc",
        sort_field: "title",
        search_page_title_name: "",
        totalPage: 1,
      },
      _openPopup: false,
      popup: false,
      banner_list: [],
      multiaction: [],
      allCheckedbox: false,
      totalRecords: 0,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/banner_management");
    }
  }

  /***************** *  Get Api data when component Render very First Time *********************/

  componentDidMount() {
    this.getBannerpageList();
  }

  getBannerpageList() {
    bannerManagementser.getbannerlist(this.state.fields).then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({
          totalRecords: res.totalRecords,
          fields: {
            ...this.state.fields,
            totalPage: res.totalPage,
          },
          banner_list: res.result,
        });
        /*multi delete cms pages */
        if (res.result.length > 0) {
          let banner = res.result;
          let multiaction = [];
          for (var key in banner) {
            multiaction[banner[key]._id] = false;
          }
          this.setState({ multiaction: multiaction });
        } else if (res.result.length === 0) {
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
        this.getBannerpageList();
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
        this.getBannerpageList();
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
            sort_field: "name",
            search_page_title_name: "",
            totalPage: 1,
          },
        },
        () => {
          this.getBannerpageList();
        }
      );
    } else {
      this.getBannerpageList();
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });
    bannerManagementser.deletebanner(this.state.deleteId).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getBannerpageList();
      }
    });
  }

  openimgpop(id) {
    this.setState({ popup: !this.state.popup, image_path: id });
  }

  bannerStatusChangedHandler(page_id, status) {
    bannerManagementser
      .changebannerStatus(page_id, { status: !status })
      .then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          this.getBannerpageList();
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

  bulkbannerChangeHandler(postData) {
    bannerManagementser.changeBulkBannerStatus(postData).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getBannerpageList();
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

      switch (actionValue) {
        case "delete":
          bannerManagementser
            .deleteMultiplebanner({ banner_ids: appliedActionId })
            .then((res) => {
              if (res.status === false) {
                notify.error(res.message);
              } else {
                notify.success(res.message);
                this.getBannerpageList();
              }
            });
          break;
        case "active": {
          this.bulkbannerChangeHandler({
            banner_ids: appliedActionId,
            status: true,
          });
          break;
        }
        case "deactive": {
          this.bulkbannerChangeHandler({
            banner_ids: appliedActionId,
            status: false,
          });
          break;
        }
        default:
          return "";
      }
    }
  };

  addDefaultSrc(ev) {
    ev.target.src = `${API_URL + "uploads/default.jpg"}`;
  }

  /****************** * Render Data To Dom ************************/

  render() {
    const styles = {
      maxWidth: "100px",
      transition: "0.3s",
    };

    const cursor = {
      cursor: "pointer",
    };
    const responsive = {
      width: "100%",
      height: "auto",
    };

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
                        <CLabel htmlFor="name">Title </CLabel>
                        <CInput
                          id="name"
                          placeholder="Search Title"
                          name="search_page_title_name"
                          value={this.state.fields.search_page_title_name}
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
                Banner
                <div className="card-header-actions">
                  {_canAccess("banner_management", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/banner_management/add"
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
                    module_name={"banner_management"}
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
                            this.handleColumnSort("user_title_name")
                          }
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Title</span>
                            {this.state.fields.sort_field !==
                              "user_title_name" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "user_title_name" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "user_title_name" && (
                                <FontAwesomeIcon icon={faSortDown} />
                              )}
                          </span>
                        </th>
                        <th>
                          <span className="sortCls">
                            <span className="table-header-text-mrg">
                              Banner Image
                            </span>
                          </span>
                        </th>

                        <th
                          onClick={() => this.handleColumnSort("banner_order")}
                        >
                          <span className="sortCls">
                            <span className="table-header-text-mrg">Order</span>
                            {this.state.fields.sort_field !==
                              "banner_order" && (
                              <FontAwesomeIcon icon={faSort} />
                            )}
                            {this.state.fields.sort_dir === "asc" &&
                              this.state.fields.sort_field ===
                                "banner_order" && (
                                <FontAwesomeIcon icon={faSortUp} />
                              )}
                            {this.state.fields.sort_dir === "desc" &&
                              this.state.fields.sort_field ===
                                "banner_order" && (
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
                        {(_canAccess("banner_management", "update") ||
                          _canAccess("banner_management", "delete")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.banner_list.length > 0 &&
                        this.state.banner_list.map((u, index) => (
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
                            <td>{u.title}</td>
                            <td style={cursor}>
                              {/* <img onError={this.addDefaultSrc} src={`${API_URL + 'uploads/' + u.image_path}`} alt="Banner Image " style={styles} onClick={() => this.openimgpop(u.image_path)} /> */}
                              {u.media_id !== null &&
                                u.media_id !== undefined && (
                                  <>
                                    {
                                      <img
                                        onError={this.addDefaultSrc}
                                        src={`${
                                          API_URL +
                                          "uploads/media/" +
                                          u.media_id.media_path
                                        }`}
                                        alt="Banner Image "
                                        style={styles}
                                        onClick={() =>
                                          this.openimgpop(
                                            "media/" + u.media_id.media_path
                                          )
                                        }
                                      />
                                    }
                                  </>
                                )}
                              {(u.media_id === null ||
                                u.media_id === undefined) && (
                                <>
                                  {
                                    <img
                                      onError={this.addDefaultSrc}
                                      src={`${
                                        API_URL +
                                        "uploads/media/"
                                      }`}
                                      alt="Banner Image "
                                      style={styles}
                                      onClick={() =>
                                        this.openimgpop(this.addDefaultSrc)
                                      }
                                    />
                                  }
                                </>
                              )}
                            </td>
                            <td>{u.banner_order}</td>
                            <td>
                              {_canAccess("banner_management", "update") && (
                                <CLink
                                  onClick={() =>
                                    this.bannerStatusChangedHandler(
                                      u._id,
                                      u.status
                                    )
                                  }
                                >
                                  {u.status ? "Active" : "Deactive"}
                                </CLink>
                              )}
                              {_canAccess("banner_management", "update") ===
                                false && (
                                <>{u.status ? "Active" : "Deactive"}</>
                              )}
                            </td>
                            {(_canAccess("banner_management", "update") ||
                              _canAccess("banner_management", "delete")) && (
                              <>
                                <td>
                                  {_canAccess(
                                    "banner_management",
                                    "update"
                                  ) && (
                                    <CTooltip
                                      content={globalConstants.EDIT_BTN}
                                    >
                                      <CLink
                                        className="btn btn-md btn-primary"
                                        aria-current="page"
                                        to={`/admin/banner_management/edit/${u._id}`}
                                      >
                                        <CIcon name="cil-pencil"></CIcon>{" "}
                                      </CLink>
                                    </CTooltip>
                                  )}
                                  &nbsp;
                                  {_canAccess(
                                    "banner_management",
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
                                        {" "}
                                        <CIcon name="cil-trash"></CIcon>
                                      </button>
                                    </CTooltip>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      {this.state.banner_list.length === 0 && (
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
            <CModalTitle>Delete Banner</CModalTitle>
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

        <CModal
          show={this.state.popup}
          onClose={() => {
            this.setState({ popup: false });
          }}
          className="modal"
        >
          <CModalHeader closeButton></CModalHeader>

          <CModalBody>
            <img
              style={responsive}
              onError={this.addDefaultSrc}
              src={`${
                API_URL +
                "uploads/" +
                this.state.image_path
              }`}
              alt="Banner Image "
            />
          </CModalBody>
        </CModal>
      </>
    );
  }
}

export default Banner_list;
