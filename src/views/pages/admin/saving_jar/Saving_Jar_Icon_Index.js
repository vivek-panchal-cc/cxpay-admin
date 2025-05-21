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
  CTooltip,
  CFormGroup,
  CLabel,
  CSelect,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import {
  notify,
  history,
  _canAccess,
  capitalize,
} from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { savingJarService } from "services/admin/savings_jar.service";
import IconTrash from "assets/icons/IconTrash";
import "./SavingJarIcons.css";

class Saving_Jar_Icon_Index extends React.Component {
  constructor(props) {
    super(props);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.getSavingJarIconsList = this.getSavingJarIconsList.bind(this);

    this.state = {
      fields: {
        operation_type: "saving_jar_icon_list",
        category_id: "",
      },
      _openPopup: false,
      saving_jar_icon_list: [],
      parentCategoryList: [],
    };
    this.handleChange = this.handleChange.bind(this);

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/saving_jar_icon");
    }
  }

  componentDidMount() {
    this.getSavingJarIconsList();
    Promise.resolve(
      savingJarService.savingJarBulkAction({
        operation_type: "saving_jar_parent_category_list",
      })
    )
      .then((response) => {
        if (response.success && response.data.category.length > 0) {
          this.setState({
            parentCategoryList: response.data?.category,
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching business categories:", error);
      });
  }

  getSavingJarIconsList() {
    savingJarService.savingJarIconBulkAction(this.state.fields).then((res) => {
      if (!res.success) {
        this.setState({
          saving_jar_icon_list: [],
        });
      } else {
        this.setState({
          saving_jar_icon_list: res.data || [],
        });
      }
    });
  }

  handleChange(event) {
    const { name, type, value, checked } = event.target;
    const updatedValue = type === "checkbox" ? checked : value;

    this.setState((prevState) => ({
      fields: {
        ...prevState.fields,
        [name]: updatedValue,
      },
    }));
  }

  handleSearch(type) {
    if (type === "reset") {
      this.setState(
        {
          fields: {
            operation_type: "saving_jar_icon_list",
            category_id: "",
          },
        },
        () => {
          this.getSavingJarIconsList(this.state.fields);
        }
      );
    } else {
      this.setState(
        {
          fields: {
            ...this.state.fields,
          },
        },
        () => {
          this.getSavingJarIconsList(this.state.fields);
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
      operation_type: "saving_jar_icon_delete",
    };

    savingJarService.savingJarIconBulkAction(postData).then((res) => {
      if (!res.success) {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getSavingJarIconsList();
      }
    });
  }

  render() {
    return (
      <>
        {this.state.parentCategoryList.length ? (
          <CRow>
            <CCol xl={12}>
              <CCard>
                <CCardBody>
                  <CRow>
                    <CCol xl={3}>
                      <CFormGroup row>
                        <CCol xs="12">
                          {/* <CLabel htmlFor="nf-name">Category</CLabel> */}
                          <CSelect
                            custom
                            id="select"
                            placeholder="Choose Category"
                            name="category_id"
                            value={this.state.fields.category_id}
                            onChange={this.handleChange}
                            style={{ cursor: "pointer" }}
                            onKeyPress={(event) => {
                              if (event.key === "Enter") {
                                this.handleSearch("search");
                              }
                            }}
                          >
                            <option value="">-- Choose Category --</option>;
                            {this.state.parentCategoryList?.map((ct, key) => {
                              return (
                                <option key={key} value={ct.id}>
                                  {capitalize(ct.jar_category_name)}
                                </option>
                              );
                            })}
                          </CSelect>
                        </CCol>
                      </CFormGroup>
                    </CCol>

                    <CCol xl={9}>
                      <CFormGroup row>
                        <CCol xs="12">
                          <button
                            className="btn btn-dark btn-md mr-2"
                            onClick={() => this.handleSearch("search")}
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
        ) : null}
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardHeader>
                <strong>Sub-account Icons</strong>
                <div className="card-header-actions">
                  {_canAccess("saving_jar", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/saving_jar_icon/add"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </CLink>
                    </CTooltip>
                  )}
                </div>
              </CCardHeader>
              <CCardBody>
                <div
                  className={`${
                    this.state.saving_jar_icon_list.length > 0
                      ? "saving-jar-icons-container"
                      : ""
                  }`}
                >
                  {this.state.saving_jar_icon_list &&
                    this.state.saving_jar_icon_list.length > 0 &&
                    this.state.saving_jar_icon_list.map((icon) => (
                      <div
                        key={icon.id}
                        className="saving-jar-icon"
                        onMouseEnter={() =>
                          this.setState({ hoveredIconId: icon.id })
                        }
                        onMouseLeave={() =>
                          this.setState({ hoveredIconId: null })
                        }
                      >
                        <img src={icon.url} alt="Sub-account Icon" />
                        {_canAccess("saving_jar", "delete") &&
                          this.state.hoveredIconId === icon.id && (
                            <IconTrash
                              className="delete-icon"
                              onClick={() => this.openDeletePopup(icon.id)}
                            />
                          )}
                      </div>
                    ))}
                </div>
                {this.state.saving_jar_icon_list?.length === 0 && (
                  <div>
                    <p>No icon found</p>
                  </div>
                )}
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
            <CModalTitle>Delete Sub-account Icon</CModalTitle>
          </CModalHeader>
          <CModalBody>Are you sure you want to delete this icon?</CModalBody>
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

export default Saving_Jar_Icon_Index;
