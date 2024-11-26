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
} from "@coreui/react";

import SimpleReactValidator from "simple-react-validator";
import { businessCategoryManagementService } from "services/admin/business_category_management.service";
import { notify, _canAccess } from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBan } from "@fortawesome/free-solid-svg-icons";
class Business_Category_Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        name: "",
        id: this.props.id,
        initialValue: "",
        status: false,
        activeTab: 1,
        _openPopup: false,
      },
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

  componentDidMount() {
    this.fetchCategoryDetails();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.id !== this.props.id) {
      this.setState({ fields: { id: this.props.id } });
      this.fetchCategoryDetails();
    }
  }

  fetchCategoryDetails() {
    if (
      _canAccess(
        this.props.module_name,
        this.props.action,
        "/admin/business_category"
      )
    ) {
      const postData = {
        id: this.state.fields.id,
        operation_type: "category_detail",
      };
      businessCategoryManagementService
        .businessCategoryBulkAction(postData)
        .then((res) => {
          if (res.status === false) {
            notify.error(res.message);
          } else {
            this.setState({
              fields: {
                id: res.data.id,
                category_name: res.data.category_name,
                status: res.data.status,
              },
            });
          }
        });
    }
  }

  handleSubmit(event) {
    this.checkValidation(event);
  }

  checkValidation(event) {
    if (this.validator.allValid()) {
      var postData = {
        category_name: this.state.fields.category_name,
        status: this.state.fields.status === false ? false : true,
        id: this.state.fields.id,
        operation_type: "category_update",
      };
      businessCategoryManagementService
        .businessCategoryBulkAction(postData)
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
          <strong>Update Category</strong>
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
              value={this.state.fields.category_name}
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
                {this.state.fields.status && (
                  <CSwitch
                    className="mr-1"
                    color="primary"
                    name="status"
                    value={this.state.fields.status}
                    defaultChecked
                    onChange={this.handleChange}
                  />
                )}

                {this.state.fields.status === false && (
                  <CSwitch
                    className="mr-1"
                    color="primary"
                    name="status"
                    value={this.state.fields.status}
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
export default Business_Category_Edit;
