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
  CSwitch,
  CInputFile,
  CTooltip
} from '@coreui/react'

import SimpleReactValidator from 'simple-react-validator';
import { bannerManagementser } from '../../../../services/admin/'
import { notify, history, _canAccess } from '../../../../_helpers/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBan, faSave } from '@fortawesome/free-solid-svg-icons'
import { globalConstants } from '../../../../constants/admin/global.constants';
const MediaLibrary = React.lazy(() => import('../../../../components/admin/MediaLibrary'));

const API_URL = process.env.REACT_APP_API_URL;
class Menu_Management_Add extends React.Component {

  constructor(props) {
    super(props);
    /************ Initialize State ************************/
    this.state = {
      title: '',
      short_description: '',
      image_path: '',
      banner_order: '',
      status: false,
      file: '',
      media_id: ''
    }
    if (this.props._renderAccess === false) {
      history.push('/admin/banner_management');
    }
    /************ Bind method with action  *********************/
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpload = this.handleUpload.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectMedia = this.handleSelectMedia.bind(this);
  }

  /******************* Render Dom very first time  ***********************/
  componentDidMount() {
    setTimeout(() => _canAccess(this.props.module_name, this.props.action, '/admin/banner_management'), 300);
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
    const filename = URL.createObjectURL(event.target.files[0]);
    var alt = event.target.files[0].name

    this.setState({
      image_path: file,
      file: filename

    });
  }

  /************* Submit handler method  *******************/
  handleSubmit() {
    if (this.validator.allValid()) {

      let formData = new FormData();
      formData.append('title', this.state.title);
      formData.append('short_description', this.state.short_description);
      formData.append('image_path', this.state.image_path);
      formData.append('banner_order', this.state.banner_order);
      formData.append('status', this.state.status);
      formData.append('media_id', this.state.media_id);

      bannerManagementser.createbanner(formData).then(res => {
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
  addDefaultSrc(ev) {
    ev.target.src = `${API_URL + 'uploads/default.jpg'}`
  }

  handleSelectMedia = (media_id = '', selectedMediaFile = '') => {
    if (media_id !== '') {
      this.setState({ media_id: media_id, selectedMediaFile: selectedMediaFile });
    } else {
      this.setState({ media_id: '', selectedMediaFile: '' });
    }
  }

  render() {
    let image;
    const styles = {
      "maxWidth": "100px"
    }
    return (<>
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              Add Banner
             <div className="card-header-actions">
                <CTooltip
                  content={globalConstants.BACK_MSG}
                >
                  <CLink
                    className="btn btn-danger btn-sm"
                    aria-current="page"
                    to="/admin/banner_management"
                  > <FontAwesomeIcon icon={faArrowLeft} className='mr-1' /> Back
              </CLink>
                </CTooltip>
              </div>
            </CCardHeader>
            <CCardBody>
              <CFormGroup row>
                <CCol md="12">
                  <CFormGroup >
                    <CLabel htmlFor="menu_category">Title</CLabel>
                    <CInput type="text" id="title" name="title" placeholder="Enter Title" autoComplete="title " onChange={this.handleInputChange} />
                    <CFormText className="help-block">{this.validator.message('Title name', this.state.title, 'required', { className: 'text-danger' })}</CFormText>
                  </CFormGroup>
                  <CFormGroup >
                    <CLabel htmlFor="menu_category">Short Description</CLabel>
                    <CInput type="text" id="short_description" name="short_description" placeholder="Enter Short Description " autoComplete="short_description " onChange={this.handleInputChange} />
                    <CFormText className="help-block">{this.validator.message('short_description name', this.state.short_description, 'required', { className: 'text-danger' })}</CFormText>
                  </CFormGroup>
                  {/* <CFormGroup >
                    <CLabel>Banner Image </CLabel>
                    <CInputFile id="file-input" name="file-input" id="image_path" name="image_path" onChange={this.handleUpload} />
                    <img onError={this.addDefaultSrc} src={this.state.file} alt="Banner Image " style={styles} />
                  </CFormGroup> */}
                  <CFormGroup >
                    <CLabel>Banner Image </CLabel>
                    <MediaLibrary onClick={this.handleSelectMedia} />
                    <img onError={this.addDefaultSrc} src={`${API_URL + 'uploads/media/' + this.state.selectedMediaFile}`} alt="Banner Image " style={styles} />
                    <CFormText className="help-block">{this.validator.message('Banner Image', this.state.media_id, 'required', { className: 'text-danger' })}</CFormText>
                  </CFormGroup>
                  <CFormGroup >
                    <CLabel htmlFor="menu_category">Order </CLabel>
                    <CInput type="number" id="banner_order" name="banner_order" placeholder="Enter Order" autoComplete="banner_order " onChange={this.handleInputChange} />
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
                            color="primary" name="status" value={this.state.status} defaultChecked onChange={this.handleInputChange} />
                        }
                        {this.state.status === false &&
                          <CSwitch className="mr-1"
                            color="primary" name="status" value={this.state.status} onChange={this.handleInputChange} />
                        }
                      </CFormGroup>
                    </CCol>
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
              > <FontAwesomeIcon icon={faBan} className='mr-1' /> Cancel
              </CLink>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>);
  }

}

export default Menu_Management_Add;