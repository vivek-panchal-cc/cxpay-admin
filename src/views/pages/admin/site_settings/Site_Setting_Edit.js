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
  CCardFooter,
  CButton,
  CLink,
  CInputFile
} from '@coreui/react'


import SimpleReactValidator from 'simple-react-validator';
import { site_setting_Service } from '../../../../services/admin/site_setting.service';
import { notify, history, _canAccess } from '../../../../_helpers/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {  faBan, faSave } from '@fortawesome/free-solid-svg-icons'



class Site_Setting_Edit extends React.Component {

  constructor(props) {
    super(props);

    this.state = {

      site_name: '',
      site_email: '',
      site_address: '',
      contact: '',
      footer_text: '',
      site_logo: '',
      facebook_link: '',
      instagram_link: '',
      twitter_link: '',
      file:''



    }

    if (this.props._renderAccess === false) {
      history.push('/admin/site_setting');
    }

    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);



  }

  componentDidMount() {
    setTimeout(() => {
      if (_canAccess(this.props.module_name, this.props.action, '/admin/dashboard')) {
        this.get_single_site();

      }
    }, 300);
  }

  //Define Function For Get Records from Api




  get_single_site() {
    site_setting_Service.getmysite().then(res => {

      

      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState(
          {
            site_name: res.data.site_name,
            site_email: res.data.site_email,
            site_address: res.data.site_address,
            contact: res.data.contact,
            footer_text: res.data.footer_text,
            site_logo:res.data.site_logo,
            facebook_link: res.data.facebook_link,
            instagram_link: res.data.instagram_link,
            twitter_link: res.data.twitter_link,


          }
        );
      }
    });
  }


  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;


    this.setState({
      [name]: value
    });
  }


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


      site_setting_Service.updatemysite(formData).then(res => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push('/admin/theme_setting');
        }
      });
    } else {
      this.validator.showMessages();
    }
  }

  handleUpload(event) {
  
    const filename =URL.createObjectURL(event.target.files[0]);
    const file = event.target.files[0];
    this.setState({
      site_logo: file,
      file:filename
    });

  }

  addDefaultSrc(ev){
    ev.target.src = `${process.env.REACT_APP_API_URL + 'uploads/default.jpg'}`
  }


  render() {

    const styles= {
      "maxWidth":"100px"
    }

  
   let image ;

   if(this.state.file)
   {
    image =<img  src={this.state.file} alt="Banner Image " style={styles}/>
   }         
    
   else{
     image =    <img onError={this.addDefaultSrc} src={`${ process.env.REACT_APP_API_URL+'uploads/'+this.state.site_logo}`} alt="Banner Image " style={styles}/>
     
   }

    return (<>
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              Theme Setting
            
            </CCardHeader>
            <CCardBody>
                    <CFormGroup >
                      <CLabel htmlFor="menu_category"> Site Name</CLabel>
                    {_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="site_name" name="site_name" placeholder="Enter Site name" autoComplete="site_name " onChange={this.handleInputChange} value={this.state.site_name} disabled={false} />
                      }
                      {!_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="site_name" name="site_name" placeholder="Enter Site name" autoComplete="site_name " onChange={this.handleInputChange} value={this.state.site_name} disabled={true} />
                      }

                  </CFormGroup>

                  <CFormGroup >
                   
                      <CLabel htmlFor="menu_category">Site  Email</CLabel>
                   
                      {_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="site_email" name="site_email" placeholder="Enter Email " autoComplete="site_email " onChange={this.handleInputChange} value={this.state.site_email} disabled={false} />
                      }
                      {!_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="site_email" name="site_email" placeholder="Enter Email " autoComplete="site_email " onChange={this.handleInputChange} value={this.state.site_email} disabled={true} />
                      }
                    
                  </CFormGroup>
                  <CFormGroup >
                    
                      <CLabel htmlFor="menu_category">Site Logo  </CLabel>
                   
                      {_canAccess('theme_setting', 'update') &&
                         <CInputFile id="file-input" name="file-input"  id="site_logo" name="site_logo" placeholder="Browe Logo " autoComplete="site_logo " onChange={this.handleUpload} disabled={false} />
                     
                     }
                      {!_canAccess('theme_setting', 'update') &&
                         <CInputFile id="file-input" name="file-input"  id="site_logo" name="site_logo" placeholder="Browe Logo " autoComplete="site_logo " onChange={this.handleUpload} disabled={true} />
                     
                     }
                     <br/>
                   {image}
                  </CFormGroup>
                  <CFormGroup >
                   
                      <CLabel htmlFor="menu_category">Contact </CLabel>
                    
                      {_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="contact" name="contact" placeholder="Enter Contact" autoComplete="Contact " onChange={this.handleInputChange} value={this.state.contact} disabled={false} />
                      }
                      {!_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="contact" name="contact" placeholder="Enter Contact" autoComplete="Contact " onChange={this.handleInputChange} value={this.state.contact} disabled={true} />
                      }
                   
                  </CFormGroup>
                  <CFormGroup >
                    
                      <CLabel htmlFor="menu_category">Footer Text </CLabel>
                  
                      {_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="footer_text" name="footer_text" placeholder="Enter Footer Text" autoComplete="footer_text " onChange={this.handleInputChange} value={this.state.footer_text} disabled={false} />
                      }
                      {!_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="footer_text" name="footer_text" placeholder="Enter Footer Text" autoComplete="footer_text " onChange={this.handleInputChange} value={this.state.footer_text} disabled={true} />


                      }   
                  </CFormGroup>
                  <CFormGroup >
                    
                      <CLabel htmlFor="menu_category">Site Address </CLabel>
                    
                      {_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="site_address" name="site_address" placeholder="Enter Site Address" autoComplete="site_address " onChange={this.handleInputChange} value={this.state.site_address} disabled={false} />
                      }
                      {!_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="site_address" name="site_address" placeholder="Enter Site Address" autoComplete="site_address " onChange={this.handleInputChange} value={this.state.site_address} disabled={true} />
                      }
                   
                  </CFormGroup>
                  <CFormGroup >
                    
                      <CLabel htmlFor="menu_category">Facebook Link </CLabel>
                   
                      {_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="facebook_link" name="facebook_link" placeholder="Facebook Link" autoComplete="facebook_link " onChange={this.handleInputChange} value={this.state.facebook_link} disabled={false} />
                      }
                      {!_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="facebook_link" name="facebook_link" placeholder="Facebook Link" autoComplete="facebook_link " onChange={this.handleInputChange} value={this.state.facebook_link} disabled={true} />
                      }

                  </CFormGroup>
                  <CFormGroup >
                   
                      <CLabel htmlFor="instagram_link">Instagram Link </CLabel>
                    
                      {_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="instagram_link" name="instagram_link" placeholder="Enter Instagram Link" autoComplete="instagram_link " onChange={this.handleInputChange} value={this.state.instagram_link} disabled={false} />
                      }
                      {!_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="instagram_link" name="instagram_link" placeholder="Enter Instagram Link" autoComplete="instagram_link " onChange={this.handleInputChange} value={this.state.instagram_link} disabled={true} />
                      }
                    
                  </CFormGroup>
                  <CFormGroup >
                    
                      <CLabel htmlFor="menu_category">Twitter Link </CLabel>
                    
                      {_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="twitter_link" name="twitter_link" placeholder="Enter Twitter Link" autoComplete="twitter_link " onChange={this.handleInputChange} value={this.state.twitter_link} disabled={false} />
                      }
                      {!_canAccess('theme_setting', 'update') &&
                        <CInput type="text" id="twitter_link" name="twitter_link" placeholder="Enter Twitter Link" autoComplete="twitter_link " onChange={this.handleInputChange} value={this.state.twitter_link} disabled={true} />
                      }
                  
                  </CFormGroup>
              
              <br />
            </CCardBody>
            <CCardFooter>
              {_canAccess('theme_setting', 'update') &&
                <CButton type="button" size="sm" color="primary" onClick={this.handleSubmit}><FontAwesomeIcon icon={faSave} className='mr-1' /> Submit</CButton>
              }
              {_canAccess('theme_setting', 'update') &&
                <CLink
                  className="btn btn-danger btn-sm ml-1"
                  aria-current="page"
                  to="/admin/"
                > <FontAwesomeIcon icon={faBan} className='mr-1' />Cancel
              </CLink>}
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>);
  }

}



export default Site_Setting_Edit;

