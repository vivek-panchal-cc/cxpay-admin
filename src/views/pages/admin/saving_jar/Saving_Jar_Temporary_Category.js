import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CPagination,
  CLink,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CTooltip,
  CFormGroup,
  CInput,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faEye,
  faArrowRight,
  faArrowLeft,
} from "@fortawesome/free-solid-svg-icons";
import {
  notify,
  history,
  _canAccess,
  capitalize,
} from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { savingJarService } from "services/admin/savings_jar.service";

class Saving_Jar_Temporary_Category extends React.Component {
  constructor(props) {
    super(props);
    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openReleasePopup = this.openReleasePopup.bind(this);
    this.releaseTempCategory = this.releaseTempCategory.bind(this);
    this.getSavingTemporaryJarCategoryList =
      this.getSavingTemporaryJarCategoryList.bind(this);

    this.state = {
      fields: {
        page: 1,
        sort_dir: "asc",
        sort_field: "jar_category_name",
        search_name: "",
        totalPage: 1,
        operation_type: "saving_jar_temp_category_list",
      },
      editFormId: "",
      showAddForm: false,
      showEditForm: false,
      _openPopup: false,
      saving_jar_temporary_category_list: [],
      multiaction: [],
      allCheckedbox: false,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/saving_jar");
    }
  }

  componentDidMount() {
    this.getSavingTemporaryJarCategoryList();
  }

  getSavingTemporaryJarCategoryList() {
    savingJarService.savingJarBulkAction(this.state.fields).then((res) => {
      if (!res.success) {
        notify.error(res.message);
        this.setState({ saving_jar_temporary_category_list: [] });
      } else {
        this.setState({
          totalRecords: res.data?.pagination?.total,
          fields: {
            ...this.state.fields,
            totalPage: res.data?.pagination?.last_page,
          },
          saving_jar_temporary_category_list: res.data?.category,
        });
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
        this.getSavingTemporaryJarCategoryList();
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
        this.getSavingTemporaryJarCategoryList();
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
            operation_type: "saving_jar_temp_category_list",
          },
          showEditForm: false,
          showAddForm: false,
          editFormId: "",
          multiaction: [],
          allCheckedbox: false,
        },
        () => {
          this.getSavingTemporaryJarCategoryList();
        }
      );
    } else {
      this.setState(
        { showEditForm: false, showAddForm: false, editFormId: "" },
        () => {
          this.getSavingTemporaryJarCategoryList();
        }
      );
    }
  }

  openReleasePopup(id, name) {
    this.setState({ _openPopup: true, releaseId: id, releaseCategory: name });
  }

  releaseTempCategory() {
    this.setState({
      _openPopup: false,
      releaseId: undefined,
      releaseCategory: undefined,
    });

    var postData = {
      id: [this.state.releaseId],
      operation_type: "saving_jar_temp_category_change_status",
      status: 0,
    };

    savingJarService.savingJarBulkAction(postData).then((res) => {
      if (!res.success) {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getSavingTemporaryJarCategoryList();
      }
    });
  }

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
                        <CInput
                          id="search_name"
                          placeholder="Search Temporary Category"
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
                    <CFormGroup row>
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
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardHeader>
                <strong>Temporary Categories List</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      // onClick={this.handleGoBack}
                      to={`/admin/saving_jar`}
                    >
                      {" "}
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="mr-1"
                      />{" "}
                      Back
                    </CLink>
                  </CTooltip>
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
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
                        {_canAccess("saving_jar", "update") && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.saving_jar_temporary_category_list &&
                        this.state.saving_jar_temporary_category_list?.length >
                          0 &&
                        this.state.saving_jar_temporary_category_list?.map(
                          (u, index) => (
                            <tr key={u.id}>
                              <td>
                                {this.state.fields.page >= 2
                                  ? index +
                                    1 +
                                    10 * (this.state.fields.page - 1)
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
                                {u.jar_category_status ? "Active" : "Deactive"}
                              </td>
                              {_canAccess("saving_jar", "update") && (
                                <>
                                  <td>
                                    <div className="d-flex">
                                      {_canAccess("saving_jar", "update") && (
                                        <CTooltip
                                          content={
                                            globalConstants.ACTION_TEMPORARY_JAR_CATEGORY
                                          }
                                        >
                                          <button
                                            className="btn btn-md btn-primary"
                                            onClick={() =>
                                              this.openReleasePopup(
                                                u.id,
                                                u.jar_category_name
                                              )
                                            }
                                          >
                                            <FontAwesomeIcon
                                              icon={faArrowRight}
                                            />
                                          </button>
                                        </CTooltip>
                                      )}
                                    </div>
                                  </td>
                                </>
                              )}
                            </tr>
                          )
                        )}
                      {this.state.saving_jar_temporary_category_list &&
                        this.state.saving_jar_temporary_category_list
                          ?.length === 0 && (
                          <tr>
                            <td colSpan="5">No records found</td>
                          </tr>
                        )}
                    </tbody>
                  </table>
                  {this.state.saving_jar_temporary_category_list?.length >
                    0 && (
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
          color="primary"
        >
          <CModalHeader closeButton>
            <CModalTitle>Release Temporary Customer</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Are you sure you want to release{" "}
            <strong>{capitalize(this.state.releaseCategory)}</strong>?
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={() => this.releaseTempCategory()}>
              Release
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

export default Saving_Jar_Temporary_Category;
