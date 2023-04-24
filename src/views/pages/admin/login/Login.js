import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { connect } from "react-redux";
import { userActions } from "../../../../actions/admin";
import { history } from "../../../../_helpers/history";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      submitted: false,
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    const { email, password } = this.state;
    const { dispatch } = this.props;
    if (email && password) {
      dispatch(userActions.login(email, password));
    }
  }

  render() {
    const { alert } = this.props;
    const { email, password, submitted } = this.state;
    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="8">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={this.handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      {alert.message && (
                        <div className={`alert ${alert.type}`}>
                          {alert.message}
                        </div>
                      )}
                      <CInputGroup
                        className="mb-3"
                        className={
                          "form-group" +
                          (submitted && !email ? " has-error" : "")
                        }
                      >
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          type="email"
                          placeholder="Email"
                          autoComplete="email"
                          name="email"
                          value={email}
                          onChange={this.handleChange}
                        />
                      </CInputGroup>
                      {submitted && !email && (
                        <div className="help-block text-danger">
                          Email address is required
                        </div>
                      )}
                      <CInputGroup
                        className="mb-4"
                        className={
                          "form-group" +
                          (submitted && !password ? " has-error" : "")
                        }
                      >
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-lock-locked" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          name="password"
                          value={password}
                          onChange={this.handleChange}
                        />
                      </CInputGroup>
                      {submitted && !password && (
                        <div className="help-block text-danger">
                          Password is required
                        </div>
                      )}
                      <CRow>
                        <CCol xs="6">
                          <CButton
                            color="primary"
                            className="px-4"
                            type="submit"
                          >
                            Login
                          </CButton>
                        </CCol>
                        <CCol xs="6" className="text-right">
                          <CButton
                            color="link"
                            className="px-0"
                            onClick={() => {
                              history.push("/admin/forgot_password");
                            }}
                          >
                            Forgot password?
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard
                  className="text-white bg-primary py-5 d-md-down-none"
                  style={{ width: "44%" }}
                >
                  <CCardBody className="text-center">
                    <div>
                      <p>
                        <img
                          src={
                            require("../../../../assets/img/CXPAY_ME_shadow.png")
                              .default
                          }
                          alt="Logo"
                          className="cc-logo-styles-mobile"
                        />
                      </p>
                    </div>
                  </CCardBody>
                </CCard>
              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { loggingIn } = state.authentication;
  const { alert } = state;
  return {
    loggingIn,
    alert,
  };
}

const connectedLoginPage = connect(mapStateToProps)(Login);
export default connectedLoginPage;
