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
  CFormText
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { notify, history } from '../../../../_helpers/index';
import { userService } from '../../../../services/admin/user.service'

class Forgot_password extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      submitted: false
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
    const { email } = this.state;
    if (email) {
      userService.forgotPassword({email:email}).then(res => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push('admin/login');
        }
      });      
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
                      <h1>Forgot Password</h1>
                      <p className="text-muted">Enter your email to reset your password</p>
                      <CInputGroup className="mb-3" className={'form-group' + (submitted && !email ? ' has-error' : '')}>
                        <CInputGroupPrepend>
                          <CInputGroupText>
                            <CIcon name="cil-user" />
                          </CInputGroupText>
                        </CInputGroupPrepend>
                        <CInput type="email" placeholder="Email" autoComplete="email" name="email" onChange={this.handleChange} />
                      </CInputGroup>
                      {submitted && !email &&
                            <CFormText className="help-block"><div className='text-danger'>Email address is required</div><br/></CFormText>
                      }
                      <CRow>
                        <CCol xs="6">
                          <CButton color="primary" className="px-4" type='submit'>Request</CButton>
                          &nbsp;
                          <CButton color="danger" className="px-4" type='button' onClick={() => { history.push('/admin/login'); }}>Cancel</CButton>
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

export default Forgot_password; 