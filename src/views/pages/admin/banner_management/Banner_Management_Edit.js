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
  CSwitch,
  CLink,
  CTooltip
} from '@coreui/react'

import SimpleReactValidator from 'simple-react-validator';
import { bannerManagementser } from '../../../../services/admin/'
import { notify, history, _canAccess } from '../../../../_helpers/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBan, faSave } from '@fortawesome/free-solid-svg-icons'
import { globalConstants } from '../../../../constants/admin/global.constants';
const MediaLibrary = React.lazy(() => import('../../../../components/admin/MediaLibrary'));


class Banner_Management_Edit extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
    
        title: '',
        short_description:'',
        image_path:'',
        banner_order:'',
        status:true,
        id: this.props.match.params.id,
        file:''
       
    }

    if(this.props._renderAccess === false){
      history.push('/admin/banner_management');
    }
    
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleSelectMedia = this.handleSelectMedia.bind(this);    
  }

  componentDidMount() {
    setTimeout(() => {
      if (_canAccess(this.props.module_name, this.props.action, '/admin/banner_management')) {
        this.getsingle_banner_menu();
      }
    }, 300);
  }

  //Define Function For Get Records from Api

  getsingle_banner_menu() {
    bannerManagementser.get_banner_single(this.state.id).then(res => {
      
      if (res.status === false) {
        notify.error(res.message);
      } else {
        var bannerRequest = {
            title: res.result.title,
            short_description:res.result.short_description,
            image_path:res.result.image_path,
            banner_order:res.result.banner_order,
            status:res.result.status,        
        };
        if(res.result.media_id !== undefined && res.result.media_id !== null){
          bannerRequest = {
            ...bannerRequest,
            media_id:res.result.media_id._id,
            media_path:res.result.media_id.media_path,
          };
        }
        this.setState(bannerRequest);
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
      formData.append('title',this.state.title);
      formData.append('short_description',this.state.short_description);
      formData.append('image_path',this.state.image_path);
      formData.append('banner_order',this.state.banner_order);
      formData.append('status',this.state.status);
      formData.append('_id',this.state.id);
      formData.append('media_id',this.state.media_id);

      bannerManagementser.update_banner_menu(formData).then(res => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push('/admin/banner_management');
        }
      });
    } else {
      this.validator.showMessages();
    }
  }

  handleUpload(event)
  {
    
    const filename =URL.createObjectURL(event.target.files[0]);
    const file =event.target.files[0];
    this.setState({
      image_path:file,
      file:filename
   });

    }
    
  addDefaultSrc(ev){
    ev.target.src = `${process.env.REACT_APP_API_URL + 'uploads/default.jpg'}`
  }

  handleSelectMedia = (media_id = '', media_path = '') => {
    if (media_id !== '') {
      this.setState({ media_id: media_id, media_path: media_path });
    } else {
      this.setState({ media_id: '', media_path: '' });
    }
  }    

  render() {
    const styles= {
      "maxWidth":"100px"
    }

  
   let image ;
   if(this.state.media_path === undefined || this.state.media_path === null)
   { 
    image =<img onError={this.addDefaultSrc} src={`${ process.env.REACT_APP_API_URL+'uploads/media/'+this.state.media_path}`} alt="Banner Image " style={styles}/>
   } else {
     image = <img onError={this.addDefaultSrc} src={`${ process.env.REACT_APP_API_URL+'uploads/media/'+this.state.media_path}`} alt="Banner Image " style={styles}/>
   }
                 
  
    return (<>
      <CRow>
        <CCol xs="12">
          <CCard>
          <CCardHeader>
         
                    Edit Banner
                 
               
              <div className="card-header-actions">
              <CTooltip
                  content={globalConstants.BACK_MSG}
                >
              <CLink
                className="btn btn-danger btn-sm"
                aria-current="page"
                to="/admin/banner_management"
              ><FontAwesomeIcon icon={faArrowLeft} className='mr-1' /> Back
              </CLink>
              </CTooltip>
              </div>
             
      </CCardHeader>
            <CCardBody>
            
               <CFormGroup >
                 
                    <CLabel htmlFor="menu_category">Title</CLabel>
                 
                    <CInput type="text" id="title" name="title" placeholder="Enter Title" autoComplete="title "  value={this.state.title} onChange={this.handleInputChange}/>
                    <CFormText className="help-block">{this.validator.message('Title name', this.state.title, 'required', { className: 'text-danger' })}</CFormText>
    
                </CFormGroup>

                <CFormGroup>
                  
                    <CLabel htmlFor="menu_category">Short Description</CLabel>
                  
                  
                    <CInput type="text" id="short_description" name="short_description" placeholder="Enter Short Description " autoComplete="short_description " value={this.state.short_description} onChange={this.handleInputChange}/>
                    <CFormText className="help-block">{this.validator.message('short_description name', this.state.short_description, 'required', { className: 'text-danger' })}</CFormText>
    
                  
                </CFormGroup>
                {/* <CFormGroup >
                  
                    <CLabel htmlFor="menu_category">Banner Image </CLabel>
                  
                  <CInputFile id="file-input" name="file-input"  id="image_path" name="image_path"  onChange={this.handleUpload}/>
                  <br/>
                  
                   {image}
                  
                </CFormGroup> */}
                <CFormGroup >
                    <CLabel>Banner Image </CLabel>
                    <MediaLibrary onClick={this.handleSelectMedia} />
                    {/* <img onError={this.addDefaultSrc} src={`${process.env.REACT_APP_API_URL + 'uploads/media/' + this.state.selectedMediaFile}`} alt="Banner Image " style={styles} /> */}
                    {image}
                    <CFormText className="help-block">{this.validator.message('Banner Image', this.state.media_id, 'required', { className: 'text-danger' })}</CFormText>
                  </CFormGroup>
                <CFormGroup >
                 
                    <CLabel htmlFor="menu_category">Order</CLabel>
                  
                    <CInput type="number" id="banner_order" name="banner_order" placeholder="Enter Order" autoComplete="banner_order "  value={this.state.banner_order} onChange={this.handleInputChange}/>
                    <CFormText className="help-block">{this.validator.message('banner_order number', this.state.banner_order, 'required', { className: 'text-danger' })}</CFormText>
    
                  
                </CFormGroup>
                <CFormGroup row>
                <CCol tag="label" sm="1" className="col-form-label">
                   Status 
                  </CCol>
                  <CCol sm="11">
                  <CFormGroup variant="custom-checkbox" inline>
                    {this.state.status &&
                      <CSwitch className="mr-1"
                      color="primary"  name="status" value={this.state.status} defaultChecked onChange={this.handleInputChange} />
                    }
                   
                    {this.state.status === false &&
                      <CSwitch className="mr-1"
                      color="primary"  name="status" value={this.state.status} onChange={this.handleInputChange} />
                    }

                  </CFormGroup>
                </CCol>
              </CFormGroup>
               
                
              <br />
              
              
            </CCardBody>
            <CCardFooter>
              <CButton type="button" size="sm" color="primary" onClick={this.handleSubmit}><FontAwesomeIcon icon={faSave} className='mr-1' /> Submit</CButton>
              &nbsp;
              <CLink
                className="btn btn-danger btn-sm"
                aria-current="page"
                to="/admin/banner_management"
              ><FontAwesomeIcon icon={faBan} className='mr-1' /> Cancel
              </CLink>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>);
  }

}



export default Banner_Management_Edit;

