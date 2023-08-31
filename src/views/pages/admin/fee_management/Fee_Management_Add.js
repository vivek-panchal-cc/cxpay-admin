import React, { Component } from "react";
import slugify from "react-slugify";
import { _canAccess } from "../../../../_helpers/index";

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
  CSelect,
} from "@coreui/react";

import SimpleReactValidator from "simple-react-validator";
import { feeManagementService } from "../../../../services/admin/fee_management.service";
import { notify, history } from "../../../../_helpers/index";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBan, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { globalConstants } from "../../../../constants/admin/global.constants";
import "react-dropzone-uploader/dist/styles.css";

import "./Draft.css";

class Fee_Management_Add extends Component {
  constructor(props) {
    super(props);

    // Define State by vivek
    this.state = {
      initialValue: "",
      editorValidated: true,
      payment_type: "",
      fee_type: "",
      amount: "",
      fee_label: "",
      status: false,
      activeTab: 1,
      _openPopup: false,
      images: "",
    };

    // Bind Methods for actions by vivek
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this._handleCancelAction = this._handleCancelAction.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      _canAccess(
        this.props.module_name,
        this.props.action,
        "/admin/fee_management"
      );
    }, 300);
  }

  /********** Editor Change handler   *****************/
  handleEditorChange = (content, editor) => {
    this.setState({
      initialValue: content,
    });
  };

  preventMinusVal(e) {}
  // Method For Form Field
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

  setActiveTab(id) {
    this.setState({ activeTab: id });
  }

  // Validation Before submit

  handleSubmit(event) {
    this.checkValidation(event);
  }

  checkValidation(event) {
    if (this.validator.allValid()) {
      const slug = slugify(this.state.payment_type, { delimiter: "-" });

      feeManagementService
        .createFeeStructure({
          payment_type: this.state.payment_type,
          fee_type: this.state.fee_type,
          amount: this.state.amount,
          fee_label: this.state.fee_label,
          status: this.state.status == false ? 0 : 1,
        })
        .then((res) => {
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
  addDefaultSrc(ev) {
    ev.target.src = `${process.env.REACT_APP_API_URL + "uploads/default.jpg"}`;
  }
  // Rendering Html To Dom
  render() {
    return (
      <CCard>
        <CCardHeader>
          Add Fee Structure
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
              custom
              name="payment_type"
              id="select"
              onChange={this.handleChange}
              value={this.props.value}
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
              <option key="MF" value="MF">
              Manual Topup
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
              custom
              name="fee_type"
              id="select"
              onChange={this.handleChange}
              value={this.props.value}
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
              min="0"
              id="amount"
              name="amount"
              placeholder="Enter Amount"
              autoComplete="amount"
              onKeyPress={this.preventMinusVal}
              onChange={this.handleChange}
            />
            <CFormText className="help-block">
              {this.validator.message(
                "amount",
                this.state.amount,
                "required|numeric|min:0,num",
                {
                  className: "text-danger",
                }
              )}
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
                <CSwitch
                  name="status"
                  className="mr-1"
                  color="primary"
                  defaultChecked={this.state.status}
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
export default Fee_Management_Add;
