import React from "react";
import { CFormGroup, CLabel, CFormText, CButton, CInput } from "@coreui/react";
import SimpleReactValidator from "simple-react-validator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBan, faSave } from "@fortawesome/free-solid-svg-icons";
import Select from "react-select";

class ResetPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        password: "",
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }

  handleSubmit() {
    if (this.validator.allValid()) {
      let postVal = {
        ...this.state.fields,
      };
      this.props.onSubmit(postVal);
    } else {
      this.validator.showMessages();
    }
  }

  handleClose() {
    this.props.onClose(false);
  }

  render() {
    return (
      <>
        <CFormGroup>
          <CLabel htmlFor="nf-name">Password</CLabel>
          <CInput
            type="text"
            id="password"
            name="password"
            placeholder="Enter Password "
            autoComplete="password"
            value={this.state.fields.password}
            onChange={this.handleChange}
          />
          <CFormText className="help-block">
            {this.validator.message(
              "password",
              this.state.fields.password,
              "required",
              { className: "text-danger" }
            )}
          </CFormText>
        </CFormGroup>
        <CButton
          type="button"
          size="sm"
          color="primary"
          onClick={this.handleSubmit}
        >
          <FontAwesomeIcon icon={faSave} className="mr-1" /> Submit
        </CButton>
        &nbsp;
        <CButton
          type="button"
          size="sm"
          color="secondary"
          onClick={this.handleClose}
        >
          <FontAwesomeIcon icon={faBan} className="mr-1" /> Cancel
        </CButton>
      </>
    );
  }
}

export default ResetPassword;
