import React, { Component } from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import slugify from "react-slugify";

import {
  CButton,
  CFormGroup,
  CLabel,
  CFormText,
  CInput,
  CCol,
  CLink,
  CSwitch,
  CCardHeader,
  CCard,
  CCardBody,
  CCardFooter,
  CTooltip,
  CRow,
  CTabPane,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CNavItem,
  CNavLink,
  CTabContent,
  CNav,
  CTabs,
  CModal,
  CSelect,
} from "@coreui/react";

import SimpleReactValidator from "simple-react-validator";
import { feeManagementService } from "../../../../services/admin/fee_management.service";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBan, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import "react-dropzone-uploader/dist/styles.css";
import "./Draft.css";

class Fee_Management_Edit extends Component {
  constructor(props) {
    super(props);

    /************  Define iniitla State by  ***********************/
    this.state = {
      name: "",
      id: this.props.match.params.id,
      initialValue: "",
      status: false,
      activeTab: 1,
      _openPopup: false,
    };

    /************************* Bind Methods for actions  **************************/

    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this._handleCancelAction = this._handleCancelAction.bind(this);
  }

  /*************** * Bind Method For Form Editor **********************/
  handleEditorChange = (content, editor) => {
    this.setState({
      initialValue: content,
    });
  };

  /************************ Define  Method For Form Field **************************/
  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }

  // Close  modal box method
  _handleCancelAction() {
    $("#myModal").css("display", "none");
  }

  // set Active tab

  setActiveTab(id) {
    this.setState({ activeTab: id });
  }

  /********** Retrieve Data very first time render to dom  ************************/
  componentDidMount() {
    setTimeout(() => {
      if (
        _canAccess(
          this.props.module_name,
          this.props.action,
          "/admin/fee_management"
        )
      ) {
        var postData = { id: this.state.id };
        feeManagementService.getFeeDetail(postData).then((res) => {
          if (res.status === false) {
            notify.error(res.message);
            history.push("/admin/fee_management");
          } else {
            if (res.result == null) {
              notify.error("Page not found");
              history.push("/admin/fee_management");
            } else {
              this.setState({
                payment_type: res.result.payment_type,
                fee_type: res.result.fee_type,
                amount: res.result.amount,
                fee_label: res.result.fee_label,
                status: res.result.status,
              });
            }
          }
        });
      }
    }, 300);
  }

  // Submit Button Handler For Create Page
  handleSubmit(event) {
    this.checkValidation(event);
  }

  checkValidation(event) {
    if (this.validator.allValid()) {
      var postData = {
        payment_type: this.state.payment_type,
        fee_type: this.state.fee_type,
        amount: this.state.amount,
        fee_label: this.state.fee_label,
        status: this.state.status === false ? 0 : 1,
        id: this.state.id,
      };
      feeManagementService.updateFeeStructure(postData).then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push("/admin/fee_management");
          event.preventDefault();
        }
      });
    } else {
      this.validator.showMessages();
    }
  }

  // Rendering Html To Dom
  render() {
    return (
      <CCard>
        <CCardHeader>
          Edit Page
          <div className="card-header-actions">
            <CTooltip content={globalConstants.BACK_MSG}>
              <CLink
                className="btn btn-danger btn-sm"
                aria-current="page"
                to="/admin/fee_management"
              >
                {" "}
                <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back
              </CLink>
            </CTooltip>
          </div>
        </CCardHeader>
        <CCardBody>
          <CFormGroup>
            <CLabel htmlFor="nf-email">Payment Types</CLabel>
            <CSelect
              disabled
              value={this.state.payment_type}
              custom
              name="payment_type"
              id="select"
              onChange={this.handleChange}
            >
              <option key="0" value="">
                -- Payment Types --{" "}
              </option>
              <option key="PL" value="PL">
                Deposit
              </option>
              ;
              <option key="WW" value="WW">
                Wallet to wallet
              </option>
              ;
              <option key="WD" value="WD">
                Withdrawal
              </option>
              ;
            </CSelect>
            <CFormText className="help-block">
              {this.validator.message(
                "payment_type",
                this.state.payment_type,
                "required",
                {
                  className: "text-danger",
                }
              )}
            </CFormText>
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="nf-email">Fee Types</CLabel>
            <CSelect
              value={this.state.fee_type}
              custom
              name="fee_type"
              id="select"
              onChange={this.handleChange}
            >
              <option key="0" value="">
                -- Fee Types --{" "}
              </option>
              <option value="percentage">Percentage</option>;
              <option value="fixed">Fixed</option>;
            </CSelect>
            <CFormText className="help-block">
              {this.validator.message(
                "fee_type",
                this.state.fee_type,
                "required",
                {
                  className: "text-danger",
                }
              )}
            </CFormText>
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="nf-name">Amount</CLabel>
            <CInput
              type="number"
              id="amount"
              name="amount"
              placeholder="Enter Amount"
              autoComplete="amount"
              value={this.state.amount}
              onChange={this.handleChange}
            />
            <CFormText className="help-block">
              {this.validator.message("amount", this.state.amount, "required", {
                className: "text-danger",
              })}
            </CFormText>
          </CFormGroup>
          <CFormGroup>
            <CLabel htmlFor="nf-name">Fee Label</CLabel>
            <CInput
              type="text"
              id="fee_label"
              name="fee_label"
              placeholder="Enter Fee Label"
              autoComplete="fee_label"
              value={this.state.fee_label}
              onChange={this.handleChange}
            />
            <CFormText className="help-block">
              {this.validator.message(
                "fee_label",
                this.state.fee_label,
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
                {this.state.status && (
                  <CSwitch
                    className="mr-1"
                    color="primary"
                    name="status"
                    value={this.state.status}
                    defaultChecked
                    onChange={this.handleChange}
                  />
                )}

                {this.state.status === false && (
                  <CSwitch
                    className="mr-1"
                    color="primary"
                    name="status"
                    value={this.state.status}
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
            to="/admin/fee_management"
          >
            {" "}
            <FontAwesomeIcon icon={faBan} className="mr-1" /> Cancel
          </CLink>
        </CCardFooter>
      </CCard>
    );
  }
}
// Export out Class component
export default Fee_Management_Edit;
