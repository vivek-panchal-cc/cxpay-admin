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
import { capitalize, history, notify } from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBan } from "@fortawesome/free-solid-svg-icons";
import "react-dropzone-uploader/dist/styles.css";
import { savingJarService } from "services/admin/savings_jar.service";
class Saving_Jar_Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        jar_category_name: "",
        jar_category_status: false,
        jar_category_icon: null,
        bg_color: "",
        is_child: false,
        parent_id: "",
      },
      parentCategoryList: [],
      bgColors: ["#a279e4"],
    };
    // this.fixedColors = ["#FF5733", "#33FF57", "#5733FF", "#FFD700", "#00CED1"];
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
  }

  componentDidMount() {
    Promise.resolve(
      savingJarService.savingJarBulkAction({
        operation_type: "saving_jar_category_color_list",
      })
    )
      .then((response) => {
        if (response.success && response.data.length > 0) {
          this.setState((prevState) => ({
            bgColors: response.data,
            fields: {
              ...prevState.fields,
              bg_color: response.data[0], // Set first API color as default
            },
          }));
        }
      })
      .catch((error) => {
        console.error("Error fetching colors:", error);
      });

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

  handleColorSelect(color) {
    this.setState((prevState) => ({
      fields: {
        ...prevState.fields,
        bg_color: color,
      },
    }));
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
        is_child: is_child,
        parent_id: is_child ? parent_id : "",
        jar_category_name: this.state.fields.jar_category_name,
        jar_category_status: this.state.fields.jar_category_status,
        bg_color: this.state.fields.bg_color,
        operation_type: "saving_jar_category_add",
      };
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

  handleUpload(event) {
    const file = event.target.files[0];
    if (file && file.name.match(/\.(icon|svg)$/)) {
      this.setState({ imageTypeValidation: false });
    }
    if (file && file.size < 5000000) {
      this.setState({ imageSizeValidation: false });
    }

    this.setState({
      fields: {
        ...this.state.fields,
        jar_category_icon: file,
      },
    });
  }

  render() {
    return (
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              <strong>Add Sub-account Category</strong>
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
                      onChange={this.handleChange}
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
                    onChange={this.handleChange}
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
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    marginTop: "5px",
                  }}
                >
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
                  <CLabel htmlFor="select">Status</CLabel>
                </CCol>
                <CCol md="11">
                  <CFormGroup variant="custom-checkbox" inline>
                    <CSwitch
                      name="jar_category_status"
                      className="mr-1"
                      color="primary"
                      defaultChecked={this.state.fields.jar_category_status}
                      onClick={this.handleChange}
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
export default Saving_Jar_Add;
