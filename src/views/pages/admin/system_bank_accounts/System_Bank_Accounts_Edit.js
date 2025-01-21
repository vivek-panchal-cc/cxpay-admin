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
import { notify, _canAccess, history } from "../../../../_helpers/index";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBan } from "@fortawesome/free-solid-svg-icons";
import { systemBankAccountsServices } from "services/admin/system_bank_accounts.service";
import { agentService } from "services/admin/agent.service";

class System_Bank_Accounts_Edit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        id: +this.props.match.params.id,
        bank_name: "",
        account_number: "",
        account_name: "",
        country_code: "",
        status: false,
      },
      countryData: [],
    };
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
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
    this.fetchSystemBankAccountDetails();
  }

  fetchSystemBankAccountDetails() {
    if (
      _canAccess(
        "system_bank_accounts",
        "update",
        "/admin/system_bank_accounts"
      )
    ) {
      const postData = {
        id: +this.state.fields.id,
        operation_type: "system_bank_account_detail",
      };
      systemBankAccountsServices
        .systemBankAccountsBulkAction(postData)
        .then((res) => {
          if (!res.success) {
            notify.error(res.message);
          } else {
            this.setState({
              fields: res.data,
            });
          }
        });

      agentService.getCountry().then((res) => {
        if (!res.success) {
          // notify.error(res.message);
          this.setState({ countryData: [] });
        } else {
          this.setState({
            countryData: res?.data?.country_list || [],
          });
        }
      });
    }
  }

  handleSubmit(event) {
    this.checkValidation(event);
  }

  checkValidation(event) {
    event.preventDefault();
    if (this.validator.allValid()) {
      systemBankAccountsServices
        .systemBankAccountsBulkAction(this.state.fields)
        .then((res) => {
          if (!res.success) {
            notify.error(res.message);
          } else {
            notify.success(res.message);
            history.push("/admin/system_bank_accounts");
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
              <strong>Update System Bank Account</strong>
            </CCardHeader>
            <CCardBody>
              <CFormGroup>
                <CLabel htmlFor="nf-name">Bank Name</CLabel>
                <CInput
                  type="text"
                  id="bank_name"
                  name="bank_name"
                  placeholder="Enter Bank Name"
                  autoComplete="bank_name"
                  value={this.state.fields.bank_name}
                  onChange={this.handleChange}
                />
                <CFormText className="help-block">
                  {this.validator.message(
                    "bank_name",
                    this.state.fields.bank_name,
                    "required",
                    {
                      className: "text-danger",
                    }
                  )}
                </CFormText>
              </CFormGroup>

              <CFormGroup>
                <CLabel htmlFor="nf-name">Account Number</CLabel>
                <CInput
                  type="text"
                  id="account_number"
                  name="account_number"
                  placeholder="Enter Account Number"
                  autoComplete="account_number"
                  value={this.state.fields.account_number}
                  onChange={this.handleChange}
                />
                <CFormText className="help-block">
                  {this.validator.message(
                    "account_number",
                    this.state.fields.account_number,
                    "required",
                    {
                      className: "text-danger",
                    }
                  )}
                </CFormText>
              </CFormGroup>

              <CFormGroup>
                <CLabel htmlFor="nf-name">Account Name</CLabel>
                <CInput
                  type="text"
                  id="account_name"
                  name="account_name"
                  placeholder="Enter Account Name"
                  autoComplete="account_name"
                  value={this.state.fields.account_name}
                  onChange={this.handleChange}
                />
                <CFormText className="help-block">
                  {this.validator.message(
                    "account_name",
                    this.state.fields.account_name,
                    "required",
                    {
                      className: "text-danger",
                    }
                  )}
                </CFormText>
              </CFormGroup>

              <CFormGroup>
                <CLabel htmlFor="nf-name">Country</CLabel>
                <CSelect
                  custom
                  name="country_code"
                  id="country_code"
                  value={this.state.fields.country_code}
                  onChange={this.handleChange}
                >
                  <option value="">-- Country --</option>;
                  {this.state?.countryData?.map((e, key) => {
                    return (
                      <option key={key} value={e.iso}>
                        {e.country_name}
                      </option>
                    );
                  })}
                </CSelect>
                <CFormText className="help-block">
                  {this.validator.message(
                    "country_code",
                    this.state.fields.country_code,
                    "required",
                    {
                      className: "text-danger",
                    }
                  )}
                </CFormText>
              </CFormGroup>

              <CFormGroup row>
                <CCol tag="label" md="1">
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
export default System_Bank_Accounts_Edit;
