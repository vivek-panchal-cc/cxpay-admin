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
  CInputCheckbox
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import SimpleReactValidator from 'simple-react-validator';
import { site_setting_Service } from '../../../../services/admin/site_setting.service';
import { notify, history, capitalize, _canAccess } from '../../../../_helpers/index';

class Site_Setting_Add extends React.Component {

  constructor(props) {
    super(props);

    /************ Initialize State ************************/
    this.state = {

      site_name: '',
      site_email: '',
      site_address: '',
      contact: '',
      footer_text:'',
      site_logo:'',
      facebook_link:'',
      instagram_link:'',
      twitter_link:'',
      status: false,

    }

    if (this.props._renderAccess === false) {
      history.push('/admin/site_setting/add');
    }

    /************ Bind method with action  *********************/

    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);


  }

  /******************* Render Dom very first time  ***********************/
  componentDidMount() {
    setTimeout(() => _canAccess(this.props.module_name, this.props.action, '/admin/site_setting'), 300);

  }
  /***************** handler For input Change ******************/

  handleInputChange(event) {
    //let file =event.target.files;
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,

    });

  }

  /*********************** Upload Handler ******************/

  handleUpload(event) {
    const file = event.target.files[0];
    const filename = event.target.files[0].name;
   
    this.setState({
      site_logo: file,
      
    });

  }

  /************* Submit handler method  *******************/
  handleSubmit() {
    if (this.validator.allValid()) {

      let formData = new FormData();

      formData.append('site_name', this.state.site_name);
      formData.append('site_address', this.state.site_address);
      formData.append('contact', this.state.contact);
      formData.append('site_email', this.state.site_email);
      formData.append('footer_text', this.state.footer_text);
      formData.append('facebook_link', this.state.facebook_link);
      formData.append('instagram_link', this.state.instagram_link);
      formData.append('twitter_link', this.state.twitter_link);
      formData.append('site_logo', this.state.site_logo);
      formData.append('status', this.state.status);
     
      site_setting_Service.create_site(formData).then(res => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push('/admin/site_setting/add');
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
             Add
            </CCardHeader>
            <CCardBody>

              <CFormGroup row>
                <CCol md="12">

                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="menu_category"> Site Name</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput type="text" id="site_name" name="site_name" placeholder="Enter Site name" autoComplete="site_name " onChange={this.handleInputChange} />
                      <CFormText className="help-block">{this.validator.message('Site name', this.state.site_name, 'required', { className: 'text-danger' })}</CFormText>

                    </CCol>
                  </CFormGroup>

                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="menu_category">Site  Email</CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput type="text" id="site_email" name="site_email" placeholder="Enter Email " autoComplete="site_email " onChange={this.handleInputChange} />
                      <CFormText className="help-block">{this.validator.message('Site Email ', this.state.site_email, 'required', { className: 'text-danger' })}</CFormText>

                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="menu_category">Site Logo  </CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput type="file" id="site_logo" name="site_logo" placeholder="Browe Logo " autoComplete="site_logo " onChange={this.handleUpload} />
                      <CFormText className="help-block">{this.validator.message('Site Logo ', this.state.site_logo, 'required', { className: 'text-danger' })}</CFormText>

                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="menu_category">Contact </CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput type="text" id="contact" name="contact" placeholder="Enter Contact" autoComplete="Contact " onChange={this.handleInputChange} />
                      <CFormText className="help-block">{this.validator.message('Contact ', this.state.contact, 'required', { className: 'text-danger' })}</CFormText>

                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="menu_category">Footer Text </CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput type="text" id="footer_text" name="footer_text" placeholder="Enter Footer Text" autoComplete="footer_text " onChange={this.handleInputChange} />
                      <CFormText className="help-block">{this.validator.message('Footer Text', this.state.footer_text, 'required', { className: 'text-danger' })}</CFormText>

                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="menu_category">Site Address </CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput type="text" id="site_address" name="site_address" placeholder="Enter Site Address" autoComplete="footer_text " onChange={this.handleInputChange} />
                      <CFormText className="help-block">{this.validator.message('Site Address ', this.state.site_address, 'required', { className: 'text-danger' })}</CFormText>

                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="menu_category">Facebook Link </CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput type="text" id="facebook_link" name="facebook_link" placeholder="Facebook Link" autoComplete="facebook_link " onChange={this.handleInputChange} />
                      <CFormText className="help-block">{this.validator.message('>Facebook Link', this.state.facebook_link, 'required', { className: 'text-danger' })}</CFormText>

                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="instagram_link">Instagram Link </CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput type="text" id="instagram_link" name="instagram_link" placeholder="Enter Instagram Link" autoComplete="instagram_link " onChange={this.handleInputChange} />
                      <CFormText className="help-block">{this.validator.message('Instagram Link ', this.state.instagram_link, 'required', { className: 'text-danger' })}</CFormText>

                    </CCol>
                  </CFormGroup>
                  <CFormGroup row>
                    <CCol md="3">
                      <CLabel htmlFor="menu_category">Twitter Link </CLabel>
                    </CCol>
                    <CCol xs="12" md="9">
                      <CInput type="text" id="twitter_link" name="twitter_link" placeholder="Enter Twitter Link" autoComplete="twitter_link " onChange={this.handleInputChange} />
                      <CFormText className="help-block">{this.validator.message('Enter Twitter Link', this.state.twitter_link, 'required', { className: 'text-danger' })}</CFormText>

                    </CCol>
                  </CFormGroup>

                  <CFormGroup row>
                    <CCol md="12">
                      <CFormGroup variant="custom-checkbox" inline>
                        {this.state.status &&
                          <CInputCheckbox custom id="inline-checkbox1" name="status" value={this.state.status} defaultChecked onChange={this.handleInputChange} />
                        }
                        {this.state.status === false &&
                          <CInputCheckbox custom id="inline-checkbox1" name="status" value={this.state.status} onChange={this.handleInputChange} />
                        }
                        <CLabel variant="custom-checkbox" htmlFor="inline-checkbox1" >Status</CLabel>
                      </CFormGroup>
                    </CCol>
                  </CFormGroup>

                  <CFormGroup row></CFormGroup>
                </CCol>
              </CFormGroup>
              <br />


            </CCardBody>
            <CCardFooter>
              <CButton type="button" size="sm" color="primary" onClick={this.handleSubmit}><CIcon name="cil-scrubber" /> Submit</CButton>
              &nbsp;
              <CLink
                className="btn btn-danger btn-sm"
                aria-current="page"
                to="/admin/site_setting/add"
              >Cancel
              </CLink>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>);
  }

}

export default Site_Setting_Add;