import React from 'react'

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
  CLink
} from '@coreui/react'
import SimpleReactValidator from 'simple-react-validator';
import { userService } from '../../../../services/admin/user.service'
import { notify, history } from '../../../../_helpers/index';
import $ from 'jquery';
import { connect } from 'react-redux';
import { userConstants } from '../../../../constants/admin';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBan,faSave } from '@fortawesome/free-solid-svg-icons'


class User_Myprofile extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fields: {
        name: '',
        email:'',
        password:'',
        confirm_password:''
      }
    }
    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {    
     
    userService.getMyProfile().then(res => {
      if (res.status === false) {
        notify.error(res.message);
        history.push('/admin/my-profile');
      } else {
        if (res.data == null) {
          notify.error('Something Went Wrong!');
          history.push('/admin/my-profile');
        } else {
          this.setState({  fields: {...this.state.fields, name: res.data.name } });
          this.setState({  fields: {...this.state.fields, email: res.data.email } });
        }
      }
    }); 
  }

  handleChange(e) {
    const { name, value } = e.target;
    if (name === 'status') {
      var fstatus = (value === 'true') ? false : true;
      this.setState({ fields: { ...this.state.fields, [name]: fstatus } });
    } else {
      this.setState({ fields: { ...this.state.fields, [name]: value } });
    }
  }

  handleFieldChange = (inputFieldId, inputFieldValue) => {
    this.setState({ fields: { ...this.state.fields, [inputFieldId]: inputFieldValue } });
  }

  handleSubmit() {
    if (this.validator.allValid()) {
      if (this.state.fields.password !== this.state.fields.confirm_password) {
        $('.confirm_password').html('<div class="text-danger">Password and confirm password must be same.</div>');
      } else {
        $('.confirm_password').html('');
        userService.updateMyProfile(this.state.fields).then(res => {
          
          if (res.status === false) {
            notify.error(res.message);
          } else {
            let _user = JSON.parse(localStorage.getItem('user'));
            _user.name = this.state.fields.name;
            localStorage.setItem('user', JSON.stringify(_user));
            
            let user = this.props.user;
            const { dispatch } = this.props;
            user.name = this.state.fields.name;
            dispatch({ type: userConstants.MYPROFILE_CHANGE,user });
            notify.success(res.message);
            history.push('/admin/my-profile');
          }

          this.setState({ fields: { ...this.state.fields, ['password']: '' } });
          this.setState({ fields: { ...this.state.fields, ['confirm_password']: '' } });

        });
      }
    } else {
      this.validator.showMessages();
    }
  }

  render() {

    return (<>
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              My Profile
            </CCardHeader>
            <CCardBody>
              <CFormGroup>
                <CLabel htmlFor="nf-name">Name</CLabel>
                <CInput type="text" id="name" name="name" placeholder="Enter Name " autoComplete="name" value={this.state.fields.name} onChange={this.handleChange} />
                <CFormText className="help-block">{this.validator.message('name', this.state.fields.name, 'required', { className: 'text-danger' })}</CFormText>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="nf-email">Email</CLabel>
                <CInput type="email" id="email" name="email" placeholder="Enter Email " autoComplete="email" value={this.state.fields.email} onChange={this.handleChange} disabled={true}/>
              </CFormGroup>
              <CFormGroup>
                <CLabel htmlFor="nf-email">Password</CLabel>
                <CInput type="password" id="password" name="password" placeholder="Enter Password " autoComplete="false" value={this.state.fields.password} onChange={this.handleChange} />
                <CFormText className="help-block"></CFormText>
              </CFormGroup>

              <CFormGroup>
                <CLabel htmlFor="nf-email">Confirm Password</CLabel>
                <CInput type="password" id="confirm_password" name="confirm_password" placeholder="Enter Confirm Password " autoComplete="false" value={this.state.fields.confirm_password} onChange={this.handleChange} />
                <CFormText className="help-block confirm_password"></CFormText>
              </CFormGroup>
            </CCardBody>
            <CCardFooter>
              <CButton type="button" size="sm" color="primary" onClick={this.handleSubmit}><FontAwesomeIcon icon={faSave} className='mr-1'/> Submit</CButton>
              &nbsp;
              <CLink
                className="btn btn-danger btn-sm"
                aria-current="page"
                to="/admin/dashboard"
              ><FontAwesomeIcon icon={faBan} className='mr-1'/>Cancel
              </CLink>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>);
  }

}

function mapStateToProps(state) {
  let user = state.authentication.user;
  return {
      user:user
  };
}

// export default User_Myprofile;
export  default connect(mapStateToProps)(User_Myprofile);