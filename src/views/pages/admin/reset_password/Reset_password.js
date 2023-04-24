import React from 'react'
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
  CFormText,
  CFormGroup,
  CLabel
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { notify, history } from '../../../../_helpers/index';
import { userService } from '../../../../services/admin/user.service'
import SimpleReactValidator from 'simple-react-validator';
import $ from 'jquery';
const queryString = require('query-string');

class Reset_password extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      submitted: false,
      email: ''
    };
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  componentDidMount() {
    var parsed = queryString.parse(this.props.location.search);
    this.setState({ email: parsed.email,token:parsed.token });
  }

  handleSubmit(e) {
    e.preventDefault();
    this.setState({ submitted: true });
    if (this.validator.allValid()) {
      if (this.state.password !== this.state.confirm_password) {
        $('.confirm_password').html('<div class="text-danger">Password and confirm password must be same.</div>');
      } else {
        $('.confirm_password').html('');
        userService.resetPassword({token:this.state.token,password:this.state.password}).then(res => {
          if (res.status === false) {
            notify.error(res.message);
          } else {
            notify.success(res.message);
            history.push('/admin/login');
          }
        });  
      }
    } else {
      this.validator.showMessages();
    }
  }

  render() {
    const { email, submitted } = this.state;
    return (
      <div className="c-app c-default-layout flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md="6">
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={this.handleSubmit}>
                      <h1>Reset Password</h1>
                      <p className="text-muted">Enter your new password to reset your account</p>
                      {submitted && !email &&
                        <CFormText className="help-block"><div className='text-danger'>Email address is required</div></CFormText>
                      }
                      <CInputGroup className="mb-3" className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="email" placeholder="Email" autoComplete="email" name="email" value={this.state.email} onChange={this.handleChange} disabled />
                      </CInputGroup>
                      <CFormGroup>
                        <CLabel htmlFor="nf-email">Password</CLabel>
                        <CInput type="password" id="password" name="password" placeholder="Enter Password" autoComplete="false" onChange={this.handleChange} />
                        <CFormText className="help-block">{this.validator.message('password', this.state.password, 'required', { className: 'text-danger' })}</CFormText>
                      </CFormGroup>

                      <CFormGroup>
                        <CLabel htmlFor="nf-email">Confirm Password</CLabel>
                        <CInput type="password" id="confirm_password" name="confirm_password" placeholder="Enter Confirm Password" autoComplete="false" onChange={this.handleChange} />
                        <CFormText className="help-block confirm_password"></CFormText>
                      </CFormGroup>
                      <CRow>
                        <CCol xs="6">
                          <CButton color="primary" className="px-4" type='submit'>Reset</CButton>
                          &nbsp;
                          <CButton color="primary" className="px-4" type='button' onClick={() => { history.push('/admin/login'); }}>Cancel</CButton>
                        </CCol>
                      </CRow>
                    </CForm>
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

export default Reset_password; 