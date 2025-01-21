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
} from "@coreui/react";

import SimpleReactValidator from "simple-react-validator";
import { notify, _canAccess, history } from "../../../../_helpers/index";
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
        _openPopup: false,
      },
      newJarIcon: null,
    };
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    this.fetchCategoryDetails();
  }

  // componentDidUpdate(prevProps) {
  //   if (prevProps.id !== this.props.id) {
  //     this.setState({ fields: { id: this.props.id } });
  //     this.fetchCategoryDetails();
  //   }
  // }

  fetchCategoryDetails() {
    if (_canAccess("saving_jar", "update", "/admin/saving_jar")) {
      const postData = {
        id: +this.state.fields.id,
        operation_type: "saving_jar_category_detail",
      };
      savingJarService.savingJarBulkAction(postData).then((res) => {
        if (!res.success) {
          notify.error(res.message);
        } else {
          this.setState({
            fields: res.data,
          });
        }
      });
    }
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
    if (
      this.state.newJarIcon &&
      !this.state.newJarIcon.name.match(/\.(icon|svg)$/)
    ) {
      this.setState({ imageTypeValidation: true });
      return false;
    }

    if (this.state.newJarIcon && this.state.newJarIcon.size > 5000000) {
      this.setState({ imageSizeValidation: true });
      return false;
    }
    if (this.validator.allValid()) {
      let formData = new FormData();
      formData.append("id", this.state.fields.id);
      formData.append("jar_category_name", this.state.fields.jar_category_name);
      formData.append(
        "jar_category_status",
        this.state.fields.jar_category_status
      ); // Convert boolean to string
      formData.append("operation_type", "saving_jar_category_update");
      if (this.state.newJarIcon) {
        formData.append("jar_category_icon", this.state.newJarIcon);
      }
      savingJarService.savingJarAddOrUpdate(formData).then((res) => {
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
    const { newJarIcon } = this.state;
    return (
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              <strong>Update Saving Jar Category</strong>
            </CCardHeader>
            <CCardBody>
              <CFormGroup>
                <CLabel htmlFor="nf-name">Jar Category Name</CLabel>
                <CInput
                  type="text"
                  id="jar_category_name"
                  name="jar_category_name"
                  placeholder="Enter Jar Category"
                  autoComplete="jar_category_name"
                  value={this.state.fields.jar_category_name}
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
                <CCol md="2">Jar Category Icon</CCol>

                <CCol sm="3">
                  <CInput
                    type="file"
                    id="newJarIcon"
                    name="newJarIcon"
                    placeholder="Jar Category Icon"
                    autoComplete="newJarIcon "
                    onChange={this.handleUpload}
                    style={{ border: "none" }}
                  />
                  {this.state.imageTypeValidation && (
                    <small className="form-text text-muted help-block">
                      <div className="text-danger">
                        Select valid icon. (.ico, .svg)
                      </div>
                    </small>
                  )}
                  {this.state.imageSizeValidation && (
                    <small className="form-text text-muted help-block">
                      <div className="text-danger">
                        Icon size is greater than 5MB. Please upload icon below
                        5MB.
                      </div>
                    </small>
                  )}
                </CCol>
                <CCol sm="2">
                  <img
                    src={
                      newJarIcon
                        ? URL.createObjectURL(newJarIcon)
                        : this.state.fields.jar_category_icon
                        ? this.state.fields.jar_category_icon
                        : "/avatars/default-avatar.png"
                    }
                    alt="icon"
                    className=""
                    width={50}
                  />
                </CCol>
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
