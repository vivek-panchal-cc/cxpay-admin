import React, { Component } from "react";
import { _canAccess } from "../../../../_helpers/index";

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
} from "@coreui/react";

import SimpleReactValidator from "simple-react-validator";
import { notify } from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBan } from "@fortawesome/free-solid-svg-icons";
import "react-dropzone-uploader/dist/styles.css";
import { businessCategoryManagementService } from "services/admin/business_category_management.service";

class Business_Category_Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: { category_name: "", status: false },
    };
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
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

  handleSubmit(event) {
    this.checkValidation(event);
  }

  checkValidation(event) {
    if (this.validator.allValid()) {
      businessCategoryManagementService
        .businessCategoryBulkAction({
          category_name: this.state.fields.category_name,
          status: this.state.fields.status === false ? false : true,
          operation_type: "category_add",
        })
        .then((res) => {
          if (!res.success) {
            notify.error(res.message);
          } else {
            notify.success(res.message);
            event.preventDefault();
            if (typeof this.props.onApiSuccess === "function") {
              this.props.onApiSuccess();
              this.props.cancel(false);
            }
          }
        });
    } else {
      this.validator.showMessages();
    }
  }

  handleCancel() {
    if (typeof this.props.onApiSuccess === "function") {
      this.props.cancel(false);
    }
  }

  render() {
    return (
      <CCard>
        <CCardHeader>
          <strong>Add Business Category</strong>
        </CCardHeader>
        <CCardBody>
          <CFormGroup>
            <CLabel htmlFor="nf-name">Category</CLabel>
            <CInput
              type="text"
              id="category_name"
              name="category_name"
              placeholder="Enter Category"
              autoComplete="category_name"
              onChange={this.handleChange}
            />
            <CFormText className="help-block">
              {this.validator.message(
                "category_name",
                this.state.fields.category_name,
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
                  defaultChecked={this.state.fields.status}
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
          <CButton
            type="button"
            size="sm"
            className="btn btn-danger btn-sm"
            onClick={this.handleCancel}
          >
            {" "}
            <FontAwesomeIcon icon={faBan} className="mr-1" /> Cancel
          </CButton>
        </CCardFooter>
      </CCard>
    );
  }
}
// Export out Class component
export default Business_Category_Add;
