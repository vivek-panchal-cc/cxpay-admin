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
import { menuManagementservice } from '../../../../services/admin/'
import { notify, history, _canAccess } from '../../../../_helpers/index';
import { globalConstants } from '../../../../constants/admin/global.constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBan, faSave } from '@fortawesome/free-solid-svg-icons'


class Menu_Management_Add extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      menu_category_name: '',
      status: false,
    }

    if (this.props._renderAccess === false) {
      history.push('/admin/menu_management');
    }
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentDidMount() {
    setTimeout(() => _canAccess(this.props.module_name, this.props.action, '/admin/menu_management'), 300);
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
      menuManagementservice.createmenu(this.state).then(res => {
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
              Add Menu Category
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


                <CInput type="text" id="menu_category_name" name="menu_category_name" placeholder=" Menu Category " autoComplete="menu_category_name " onChange={this.handleInputChange} />
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
              ><FontAwesomeIcon icon={faBan} className='mr-1' />Cancel
              </CLink>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>);
  }

}

export default Menu_Management_Add;