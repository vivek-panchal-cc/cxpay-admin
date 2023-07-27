import React from "react";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CFormGroup,
  CInput,
  CLabel,
  CFormText,
  CCardFooter,
  CButton,
  CLink,
  CSwitch,
  CTooltip,
} from "@coreui/react";
import SimpleReactValidator from "simple-react-validator";
import { userService } from "../../../../services/admin/user.service";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import $ from "jquery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBan, faSave } from "@fortawesome/free-solid-svg-icons";
const UserGroups = React.lazy(() =>
  import("../../../../components/admin/UserGroups")
);

class User_Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        name: "",
        email: "",
        user_group_id: "",
        status: false,
        id: this.props.match.params.id,
      },
    };
    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      if (
        _canAccess(this.props.module_name, this.props.action, "/admin/users")
      ) {
        userService.getUser(this.state.fields.id).then((res) => {
          if (res.status === false) {
            notify.error(res.message);
            history.push("/admin/users");
          } else {
            if (res.data == null) {
              notify.error("User not found");
              history.push("/admin/users");
            } else {
              this.setState({ fields: res.data });
            }
          }
        });
      }
    }, 300);
  }

  handleChange(e) {
    const { name, value } = e.target;
    if (name === "status") {
      var fstatus = value === "true" ? false : true;
      this.setState({ fields: { ...this.state.fields, [name]: fstatus } });
    } else {
      this.setState({ fields: { ...this.state.fields, [name]: value } });
    }
  }

  handleFieldChange = (inputFieldId, inputFieldValue) => {
    this.setState({
      fields: { ...this.state.fields, [inputFieldId]: inputFieldValue },
    });
  };

  handleSubmit() {
    if (this.validator.allValid()) {
      if (this.state.fields.password !== this.state.fields.confirm_password) {
        $(".confirm_password").html(
          '<div class="text-danger">Password and confirm password must be same.</div>'
        );
      } else {
        $(".confirm_password").html("");
        userService.updateUser(this.state.fields).then((res) => {
          if (res.status === false) {
            notify.error(res.message);
          } else {
            notify.success(res.message);
            history.push("/admin/users");
          }
        });
      }
    } else {
      this.validator.showMessages();
    }
  }

  render() {
    return (
      <>
        <CRow>
          <CCol xs="12">
            <CCard>
              <CCardHeader>
                Edit User
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/users"
                    >
                      <FontAwesomeIcon icon={faArrowLeft} className="mr-1" />
                      Back
                    </CLink>
                  </CTooltip>
                </div>
              </CCardHeader>
              <CCardBody>
                <CFormGroup>
                  <CLabel htmlFor="nf-name">Name</CLabel>
                  <CInput
                    type="text"
                    id="name"
                    name="name"
                    placeholder="Enter Name "
                    autoComplete="name"
                    value={this.state.fields.name}
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "name",
                      this.state.fields.name,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-email">Email</CLabel>
                  <CInput
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter Email "
                    autoComplete="email"
                    value={this.state.fields.email}
                    onChange={this.handleChange}
                    onBlur={() => this.validator.showMessageFor("email")}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "email",
                      this.state.fields.email,
                      "required|email",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-email">User Groups</CLabel>
                  <UserGroups
                    key="user_group_id"
                    id="user_group_id"
                    value={this.state.fields.user_group_id}
                    onChange={this.handleFieldChange}
                  />
                  <CFormText className="help-block">
                    {this.validator.message(
                      "user_group_id",
                      this.state.fields.user_group_id,
                      "required",
                      { className: "text-danger" }
                    )}
                  </CFormText>
                </CFormGroup>
                <CFormGroup>
                  <CLabel htmlFor="nf-email">Password</CLabel>
                  <CInput
                    type="password"
                    id="password"
                    name="password"
                    placeholder="Enter Password "
                    autoComplete="false"
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block"></CFormText>
                </CFormGroup>

                <CFormGroup>
                  <CLabel htmlFor="nf-email">Confirm Password</CLabel>
                  <CInput
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    placeholder="Enter Confirm Password "
                    autoComplete="false"
                    onChange={this.handleChange}
                  />
                  <CFormText className="help-block confirm_password"></CFormText>
                </CFormGroup>
                <CFormGroup row>
                  <CCol md="1">Status</CCol>

                  <CCol sm="11">
                    <CFormGroup variant="custom-checkbox" inline>
                      {this.state.fields.status && (
                        <CSwitch
                          className="mr-1"
                          color="primary"
                          id="status"
                          name="status"
                          value={this.state.fields.status}
                          defaultChecked
                          onChange={this.handleInputChange}
                        />
                      )}

                      {this.state.fields.status === false && (
                        <CSwitch
                          className="mr-1"
                          color="primary"
                          id="status"
                          name="status"
                          value={this.state.fields.status}
                          onChange={this.handleInputChange}
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
                  <FontAwesomeIcon icon={faSave} className="mr-1" /> Submit
                </CButton>
                &nbsp;
                <CLink
                  className="btn btn-danger btn-sm"
                  aria-current="page"
                  to="/admin/users"
                >
                  <FontAwesomeIcon icon={faBan} className="mr-1" />
                  Cancel
                </CLink>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default User_Edit;
