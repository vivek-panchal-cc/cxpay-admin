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
  CLink,
  CTooltip
} from '@coreui/react'
import SimpleReactValidator from 'simple-react-validator';
import { systemModulesService } from '../../../../services/admin/'
import "@pathofdev/react-tag-input/build/index.css";
import ReactTagInput from "@pathofdev/react-tag-input";
import $ from 'jquery';
import { notify, history} from '../../../../_helpers/index';
import { globalConstants } from '../../../../constants/admin/global.constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBan, faSave } from '@fortawesome/free-solid-svg-icons'

class System_Modules_Add extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      fields: {
        module_name: '',
        action: ['view','create','update','delete']
      },
      module_permission: {}
    }

    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onActionChanged = this.onActionChanged.bind(this);
    if (this.props._renderAccess === false) {
      history.push('/admin/dashboard');
    }
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }

  onActionChanged(tags) {
    this.setState({ fields: { ...this.state.fields, ['action']: tags } });
  }


  handleSubmit() {
    if (this.validator.allValid()) {
      systemModulesService.createSystemModules(this.state.fields).then(res => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push('/admin/system_modules');
        }
      });
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
              Add Module
              <div className="card-header-actions">
                <CTooltip
                  content={globalConstants.BACK_MSG}
                >
                  <CLink
                    className="btn btn-danger btn-sm"
                    aria-current="page"
                    to="/admin/system_modules"
                  > <FontAwesomeIcon icon={faArrowLeft} className='mr-1' />Back
                  </CLink>
                </CTooltip>
              </div>
            </CCardHeader>
            <CCardBody>
              <CFormGroup>
                <CLabel htmlFor="nf-name">Module Name</CLabel>
                <CInput type="text" id="module_name" name="module_name" placeholder="Enter Module Name " autoComplete="name" onChange={this.handleChange} />
                <CFormText className="help-block">{this.validator.message('module_name', this.state.fields.module_name, 'required', { className: 'text-danger' })}</CFormText>
              </CFormGroup>

              <CFormGroup>
                <CLabel htmlFor="nf-name">Action</CLabel>              
                <ReactTagInput tags={this.state.fields.action} onChange={this.onActionChanged} validator={(value) => {
                    if(this.state.fields.action.includes(value)){ 
                      $('.error-action').html('<div class="text-danger">'+value+' action already is exists!</div>');
                    } else {
                    if(!/[^a-z]/.test(value)) {
                      $('.error-action').html('');
                      return true;    
                    } else {
                      $('.error-action').html('<div class="text-danger">Uppercase and special character not allow</div>');
                    }}}} />
                <CFormText className="help-block error-action">{this.validator.message('action', this.state.fields.action, 'required', { className: 'text-danger' })}</CFormText>
                <CFormText className="help-block"><b>Note : </b>This action field is used in ACL permission module.</CFormText>
              </CFormGroup>
            </CCardBody>
            <CCardFooter>
              <CButton type="button" size="sm" color="primary" onClick={this.handleSubmit}><FontAwesomeIcon icon={faSave} className='mr-1' />  Submit</CButton>
              &nbsp;
              <CLink
                className="btn btn-danger btn-sm"
                aria-current="page"
                to="/admin/system_modules"
              ><FontAwesomeIcon icon={faBan} className='mr-1' />Cancel
              </CLink>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>);
  }

}

export default System_Modules_Add;