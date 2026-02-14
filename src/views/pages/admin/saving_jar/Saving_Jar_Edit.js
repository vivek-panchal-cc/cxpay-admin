import React, { Component } from "react";
import {
  CButton,
  CFormGroup,
  CLabel,
  CFormText,
  CInput,
  CCol,
  CSwitch,
  CCardHeader,
  CCard,
  CCardBody,
  CCardFooter,
  CLink,
  CRow,
  CSelect,
} from "@coreui/react";

import SimpleReactValidator from "simple-react-validator";
import {
  notify,
  _canAccess,
  history,
  capitalize,
} from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBan } from "@fortawesome/free-solid-svg-icons";
import { savingJarService } from "services/admin/savings_jar.service";
class Saving_Jar_Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        id: this.props.match.params.id,
        jar_category_name: "",
        jar_category_status: false,
        jar_category_icon: null,
        bg_color: "",
        _openPopup: false,
        is_child: false,
        parent_id: "",
      },
      parentCategoryList: [],
      bgColors: [],
      newJarIcon: null,
    };
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleColorSelect = this.handleColorSelect.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
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

  componentDidMount() {
    this.fetchInitialData();
  }

  fetchInitialData() {
    Promise.all([
      this.fetchCategoryColors(),
      this.fetchCategoryDetails(),
      this.fetchParentCategoryDropdownList(),
    ])
      .then(([colorResponse, categoryDetails, parentCategoryList]) => {
        // handle success, the order of execution is maintained
      })
      .catch((error) => {
        console.error("Error in fetching data:", error);
        // handle error, proceed with fallback logic if needed
      });
  }

  fetchCategoryColors() {
    return new Promise((resolve, reject) => {
      savingJarService
        .savingJarBulkAction({
          operation_type: "saving_jar_category_color_list",
        })
        .then((colorResponse) => {
          let bgColors = [];
          let defaultBgColor = "#a279e4"; // Default color

          if (colorResponse.success && colorResponse.data.length > 0) {
            bgColors = colorResponse.data;
            defaultBgColor = bgColors[0]; // Use the first color from the API
          }

          this.setState(
            {
              bgColors,
              fields: {
                ...this.state.fields,
                bg_color: this.state.fields.bg_color || defaultBgColor,
              },
            },
            () => {
              resolve(colorResponse);
            }
          );
        })
        .catch((error) => {
          reject(error); // Reject if API fails
        });
    });
  }

  fetchCategoryDetails() {
    return new Promise((resolve, reject) => {
      if (_canAccess("saving_jar", "update", "/admin/saving_jar")) {
        const postData = {
          id: +this.state.fields.id,
          operation_type: "saving_jar_category_detail",
        };

        savingJarService
          .savingJarBulkAction(postData)
          .then((res) => {
            if (!res.success) {
              notify.error(res.message);
              resolve(res); // Resolve with response even if unsuccessful
            } else {
              const isChild =
                res.data.parent_id !== null && res.data.parent_id !== undefined;

              this.setState((prevState) => ({
                fields: {
                  ...res.data,
                  is_child: isChild,
                  bg_color:
                    res.data.bg_color || prevState.bgColors[0] || "#a279e4",
                },
              }));
              resolve(res); // Resolve on success
            }
          })
          .catch((error) => {
            reject(error); // Reject if API fails
          });
      } else {
        resolve(); // Resolve if no access
      }
    });
  }

  fetchParentCategoryDropdownList() {
    return new Promise((resolve, reject) => {
      if (_canAccess("saving_jar", "update", "/admin/saving_jar")) {
        const postData = {
          id: +this.props.match.params.id,
          operation_type: "saving_jar_parent_category_list",
        };

        savingJarService
          .savingJarBulkAction(postData)
          .then((res) => {
            if (!res.success) {
              notify.error(res.message);
              resolve(res); // Resolve with response even if unsuccessful
            } else {
              this.setState({
                parentCategoryList: res.data?.category || [],
              });
              resolve(res); // Resolve on success
            }
          })
          .catch((error) => {
            reject(error); // Reject if API fails
          });
      } else {
        resolve(); // Resolve if no access
      }
    });
  }

  handleColorSelect(color) {
    this.setState((prevState) => ({
      fields: {
        ...prevState.fields,
        bg_color: color,
      },
    }));
  }

  handleUpload(event) {
    const file = event.target.files[0];
    // const filename = event.target.files[0].name;

    if (file && file.name.match(/\.(icon|svg)$/)) {
      this.setState({ imageTypeValidation: false });
    }
    if (file && file.size < 5000000) {
      this.setState({ imageSizeValidation: false });
    }

    this.setState({
      newJarIcon: file,
    });
  }

  handleSubmit(event) {
    this.checkValidation(event);
  }

  checkValidation(event) {
    event.preventDefault();
    const { is_child, parent_id } = this.state.fields;
    if (is_child && !parent_id) {
      notify.error("Please select parent category");
      return;
    }
    if (this.validator.allValid()) {
      let requestParams = {
        id: this.state.fields.id,
        is_child: is_child,
        parent_id: is_child ? parent_id : "",
        jar_category_name: this.state.fields.jar_category_name,
        jar_category_status: this.state.fields.jar_category_status,
        bg_color: this.state.fields.bg_color,
        operation_type: "saving_jar_category_update",
      };
      // if (this.state.newJarIcon) {
      //   formData.append("jar_category_icon", this.state.newJarIcon);
      // }
      savingJarService.savingJarAddOrUpdate(requestParams).then((res) => {
        if (!res.success) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push("/admin/saving_jar");
          event.preventDefault();
        }
      });
    } else {
      this.validator.showMessages();
    }
  }

  render() {
    return (
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              <strong>Update Sub-account Category</strong>
            </CCardHeader>
            <CCardBody>
              <CFormGroup>
                <CLabel htmlFor="nf-name">Sub-account Category Name</CLabel>
                <CInput
                  type="text"
                  id="jar_category_name"
                  name="jar_category_name"
                  placeholder="Enter Sub-account Category"
                  autoComplete="jar_category_name"
                  value={capitalize(this.state.fields.jar_category_name)}
                  onChange={this.handleChange}
                />
                <CFormText className="help-block">
                  {this.validator.message(
                    "jar_category_name",
                    this.state.fields.jar_category_name,
                    "required",
                    {
                      className: "text-danger",
                    }
                  )}
                </CFormText>
              </CFormGroup>

              <CFormGroup row>
                <CCol tag="label" md="1">
                  <CLabel htmlFor="is_child">Is Child?</CLabel>
                </CCol>
                <CCol md="11">
                  <CFormGroup variant="custom-checkbox" inline>
                    <CSwitch
                      name="is_child"
                      color="primary"
                      checked={this.state.fields.is_child}
                      // onChange={this.handleChange}
                      disabled
                    />
                  </CFormGroup>
                </CCol>
              </CFormGroup>

              {this.state.fields.is_child && (
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Parent Category</CLabel>
                  <CSelect
                    custom
                    name="parent_id"
                    id="select"
                    // onChange={this.handleChange}
                    value={this.state.fields.parent_id}
                    disabled
                  >
                    <option value="">-- Enter Parent Category --</option>;
                    {this.state.parentCategoryList?.map((ct, key) => {
                      return (
                        <option key={key} value={ct.id}>
                          {capitalize(ct.jar_category_name)}
                        </option>
                      );
                    })}
                  </CSelect>
                </CFormGroup>
              )}

              <CFormGroup>
                <CLabel>Choose Background Color</CLabel>
                <div style={{ display: "flex", gap: "10px", marginTop: "5px" }}>
                  {this.state.bgColors.map((color) => (
                    <div
                      key={color}
                      onClick={() => this.handleColorSelect(color)}
                      style={{
                        position: "relative",
                        width: "50px",
                        height: "50px",
                        backgroundColor: color,
                        borderRadius: "50%",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        border:
                          this.state.fields.bg_color === color
                            ? "2px solid black"
                            : "1px solid transparent",
                      }}
                    >
                      {this.state.fields.bg_color === color && (
                        <span
                          style={{
                            position: "absolute",
                            color: "white", // Adjust based on background color
                            fontSize: "24px",
                            fontWeight: "bold",
                          }}
                        >
                          ✔
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </CFormGroup>

              <CFormGroup row>
                <CCol tag="label" md="1">
                  Status
                </CCol>

                <CCol sm="11">
                  <CFormGroup variant="custom-checkbox" inline>
                    {this.state.fields.jar_category_status && (
                      <CSwitch
                        className="mr-1"
                        color="primary"
                        name="jar_category_status"
                        value={this.state.fields.jar_category_status}
                        defaultChecked
                        onChange={this.handleChange}
                      />
                    )}

                    {this.state.fields.jar_category_status === false && (
                      <CSwitch
                        className="mr-1"
                        color="primary"
                        name="jar_category_status"
                        value={this.state.fields.jar_category_status}
                        onChange={this.handleChange}
                      />
                    )}
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
              &nbsp;
              <CLink
                className="btn btn-danger btn-sm"
                aria-current="page"
                to="/admin/saving_jar"
              >
                {" "}
                <FontAwesomeIcon icon={faBan} className="mr-1" /> Cancel
              </CLink>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    );
  }
}
// Export out Class component
export default Saving_Jar_Edit;
