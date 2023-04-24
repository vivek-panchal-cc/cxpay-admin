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
import CIcon from '@coreui/icons-react'

import SimpleReactValidator from 'simple-react-validator';
import { menuManagementservice } from '../../../../services/admin/'
import { notify, history, _canAccess } from '../../../../_helpers/index';
import { globalConstants } from '../../../../constants/admin/global.constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBan, faSave } from '@fortawesome/free-solid-svg-icons'


class Menu_Management_Edit extends React.Component {


  /*********** Define Initial State  ******************/

  constructor(props) {
    super(props);

    this.state = {
      menu_category_name: '',
      id: this.props.match.params.id
    }

    if (this.props._renderAccess === false) {
      history.push('/admin/menu_management');
    }

    /************** Bind Method with current class *******************/

    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  /************ Reteive Data Api very first time component render to dom  **************************/
  componentDidMount() {
    setTimeout(() => {
      if (_canAccess(this.props.module_name, this.props.action, '/admin/menu_management')) {
        this.getsingle_category_menu();
      }
    }, 300);
  }

  //Define Function For Get Records from Api

  getsingle_category_menu() {
    menuManagementservice.get_category_signle(this.state.id).then(res => {

      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({
          menu_category_name: res.result.menu_category_name,
          status: res.result.status
        }
        );
      }
    });
  }

  /*************** Define Method for on change event  *********************/
  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  /*************** Define Method for on Submit event  *********************/
  handleSubmit() {
    if (this.validator.allValid()) {
      menuManagementservice.update_category_menu({ menu_category_name: this.state.menu_category_name, status: this.state.status, _id: this.state.id }).then(res => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push('/admin/menu_management');
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
              Edit Menu Category
              <div className="card-header-actions">
                <CTooltip
                  content={globalConstants.BACK_MSG}
                >
                  <CLink
                    className="btn btn-danger btn-sm"
                    aria-current="page"
                    to="/admin/menu_management"
                  > <FontAwesomeIcon icon={faArrowLeft} className='mr-1' /> Back
              </CLink>
                </CTooltip>
              </div>
            </CCardHeader>
            <CCardBody>

              <CFormGroup>



                <CLabel htmlFor="menu_category_name">Menu Category </CLabel>


                <CInput type="text" id="menu_category_name" name="menu_category_name" placeholder="Menu Category " autoComplete="menu_category_name " value={this.state.menu_category_name} onChange={this.handleInputChange} />
                <CFormText className="help-block">{this.validator.message('menu category name', this.state.menu_category_name, 'required', { className: 'text-danger' })}</CFormText>


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


              <br />


            </CCardBody>
            <CCardFooter>
              <CButton type="button" size="sm" color="primary" onClick={this.handleSubmit}><FontAwesomeIcon icon={faSave} className='mr-1' /> Submit</CButton>
              &nbsp;
              <CLink
                className="btn btn-danger btn-sm"
                aria-current="page"
                to="/admin/menu_management"
              > <FontAwesomeIcon icon={faBan} className='mr-1' />Cancel
              </CLink>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>);
  }

}

export default Menu_Management_Edit;

