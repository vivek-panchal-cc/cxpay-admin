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
  CSelect,
  CSwitch,
  CLink,
  CTooltip
} from '@coreui/react'

import SimpleReactValidator from 'simple-react-validator';
import { MenuitemServices } from '../../../../services/admin/'
import { notify, history } from '../../../../_helpers/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBan, faSave } from '@fortawesome/free-solid-svg-icons'
import { globalConstants } from '../../../../constants/admin/global.constants';


class Menu_Items_Edit extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      menu_title: '',
      menu_types: 'custom',
      cms_id: '',
      menu_url: '',
      id: this.props.match.params.id,
      order: 0,
      cms_page:[]
    }

    if (this.props._renderAccess === false) {
      history.push('/admin/menu_management');
    }

    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleInputChange = this.handleInputChange.bind(this);


  }

  componentDidMount() {

    this.get_category_single();
    this.getcmsListing();
  }

  //Define Function For Get Records from Api

  get_category_single() {
    MenuitemServices.getsinglemenucategory(this.state.id).then(res => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({
          menu_title: res.result.menu_title,
          menu_types: res.result.menu_types,
          status: res.result.status,
          cms_id: res.result.cms_id,
          menu_url: res.result.menu_url,
          order: res.result.order,
          _id: this.state.id
        });
      }
    });
  }

  getcmsListing ()
  {
    MenuitemServices.CmsListing().then(res => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        
        this.setState({
          cms_page:res.message
        });
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
      MenuitemServices.updatemenu_category(this.state).then(res => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.goBack();
        }
      });
    } else {
      this.validator.showMessages();
    }
  }

  render() {

   

    let menu_url;
    let title_menu;
    if (this.state.menu_types === 'cms') {
      menu_url = <CSelect custom name="cms_id" id="select" value={this.state.cms_id} onChange={this.handleInputChange}>
        <option value="select">Select Cms Page</option>
        {this.state.cms_page.map(list => { return  <option key={list._id} value={list._id}>{list.title}</option> })}
      </CSelect>
      title_menu = "Cms Page"
    }
    else {
      menu_url = <CInput type="text" id="menu_url" name="menu_url" placeholder="Menu Url" autoComplete="menu_url " value={this.state.menu_url} onChange={this.handleInputChange} />
      title_menu = "Menu Url"
    }
    return (<>
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              Edit Menu Item
              <div className="card-header-actions">
                <CTooltip
                  content={globalConstants.BACK_MSG}
                >
                  <CLink
                    className="btn btn-danger btn-sm"
                    aria-current="page"
                    onClick={() => { history.goBack(); }}
                  > <FontAwesomeIcon icon={faArrowLeft} className='mr-1' /> Back
              </CLink>
                </CTooltip>
              </div>
            </CCardHeader>
            <CCardBody>

              <CFormGroup >
                <CLabel htmlFor="menu_category">Menu Title</CLabel>

                <CInput type="text" id="menu_title" name="menu_title" placeholder="Menu Title" autoComplete="menu_title " value={this.state.menu_title} onChange={this.handleInputChange} />
                <CFormText className="help-block">{this.validator.message('menu title name', this.state.menu_title, 'required', { className: 'text-danger' })}</CFormText>
              </CFormGroup>
              <CFormGroup>

                <CLabel htmlFor="select">Menu Type</CLabel>


                <CSelect custom name="menu_types" value={this.state.menu_types} id="select" onChange={this.handleInputChange}>
                  <option value="custom">Custom Link</option>
                  <option value="cms">CMS</option>

                </CSelect>

              </CFormGroup>
              <CFormGroup>

                <CLabel htmlFor="menu_url">{title_menu}</CLabel>

                {menu_url}

              </CFormGroup>
              <CFormGroup >

                <CLabel htmlFor="menu_category"> Order</CLabel>


                <CInput type="number" id="order" name="order" placeholder="Enter Order Number" autoComplete="order" value={this.state.order} onChange={this.handleInputChange} />
                <CFormText className="help-block">{this.validator.message('order', this.state.order, 'required', { className: 'text-danger' })}</CFormText>

              </CFormGroup>
              <CFormGroup row>
                <CCol md="1">
                  <CLabel htmlFor="select">Status</CLabel>
                </CCol>
                <CCol md="11">
                  <CSwitch
                    name="status"
                    className="mr-1"
                    color="primary"
                    defaultChecked={this.state.status}
                    onClick={this.handleInputChange}
                  />
                </CCol>
              </CFormGroup>

            </CCardBody>
            <CCardFooter>
              <CButton type="button" size="sm" color="primary" onClick={this.handleSubmit}><FontAwesomeIcon icon={faSave} className='mr-1' /> Submit</CButton>
              &nbsp;
              <CLink
                className="btn btn-danger btn-sm"
                aria-current="page"
                onClick={() => { history.goBack(); }}
              > <FontAwesomeIcon icon={faBan} className='mr-1' /> Cancel
              </CLink>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>);
  }

}




export default Menu_Items_Edit;