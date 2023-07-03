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
  CInputCheckbox,
  CTooltip
} from '@coreui/react'
import SimpleReactValidator from 'simple-react-validator';
import { systemModulesService, userGroupsService } from '../../../../services/admin/'
import { notify, history, capitalize, _canAccess } from '../../../../_helpers/index';
import $ from 'jquery';
import { globalConstants } from '../../../../constants/admin/global.constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faBan, faSave } from '@fortawesome/free-solid-svg-icons'


class User_Groups_Edit extends React.Component {

  constructor(props) {
    super(props);
    //Identify user has access this page or not

    this.state = {
      fields: {
        user_group_name: '',
        status: true,
        _id: this.props.match.params.id
      },
      module_permission: {}
    }

    this.handleChange = this.handleChange.bind(this);
    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.permssionChange = this.permssionChange.bind(this);
  }

  componentDidMount() {
    setTimeout(() => {
      if (_canAccess(this.props.module_name, this.props.action, '/admin/user_groups')) {
        /*
          Get User deatils
        */
        userGroupsService.getUserGroup(this.state.fields._id).then(res => {
          if (res.status === false) {
            notify.error(res.message);
          } else {
            if (res.data == null) {
              notify.error('User Group not found');
              history.push('/admin/user_groups');
            }

            this.setState({ ...this.state.fields, fields: res.data }, () => { this.setSystemModules() });

          }
        });
      }
    }, 300);
  }

  /*
    Get system module actions
  */
  setSystemModules() {

    var savedPermission = this.state.fields.permission;
    systemModulesService.getSystemModulesList().then(res => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        let permissionModel = [];
        res.data.forEach((value, index) => {
          permissionModel[value.module_name] = [];
          value.action.forEach((innerValue, innerIndex) => {
            permissionModel[value.module_name][innerValue] = false;
            if (savedPermission[value.module_name] !== undefined) {
              if (savedPermission[value.module_name].includes(innerValue)) {
                permissionModel[value.module_name][innerValue] = true;
              }
            }
          });
        });
        this.setState({ module_permission: permissionModel });
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

  permssionChange(e) {
    const { name, value } = e.target;

    var permission_array = this.state.module_permission;
    var action = name.split('___')[0];
    var permission_val = permission_array[action];
    var trueFlag = 0;
    for (var key in permission_val) {
      if (key === value) {
        permission_val[key] = !permission_val[key];
        if (value !== 'view') {
          permission_val['view'] = true;
        }
      }
      if (key !== 'view' && permission_val[key] === true) {
        trueFlag = trueFlag + 1;
      }
    }

    if (trueFlag > 0 && value === 'view') {
      permission_val['view'] = true;
      e.preventDefault();
      notify.info('View action is required while other module action is selected');
      return;
    }

    if (trueFlag === 0 && value !== 'view') {
      //permission_val['view'] = false;
    }
    permission_array[action] = permission_val;
    this.setState({ module_permission: { ...this.state.module_permission, [action]: permission_val } });
    $('.module_permission').html('');
  }

  handleSubmit() {

    let finalPermission = [];
    for (var key in this.state.module_permission) {
      for (var innerKey in this.state.module_permission[key]) {
        if (this.state.module_permission[key][innerKey]) {
          if (finalPermission[key] === undefined) {
            finalPermission[key] = [];
          }
          finalPermission[key].push(innerKey);
        }
      }
    }
    if (this.validator.allValid() && Object.keys(finalPermission).length !== 0) {
      var postVal = {
        id: this.state.fields._id,
        user_group_name: this.state.fields.user_group_name,
        status: this.state.fields.status,
        permissions: Object.assign({}, finalPermission)
      }
      userGroupsService.updateUserGroup(postVal).then(res => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push('/admin/user_groups');
        }
      });
    } else {
      this.validator.showMessages();
      if (Object.keys(finalPermission).length === 0) {
        $('.module_permission').html('<div class="text-danger">Atleast one module permission has required.</div>');
      }
    }
  }

  render() {
    var { module_permission } = this.state;

    return (<>
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              <b>Edit Group</b>
              <div className="card-header-actions">
                <CTooltip
                  content={globalConstants.BACK_MSG}
                >
                  <CLink
                    className="btn btn-danger btn-sm"
                    aria-current="page"
                    to="/admin/user_groups"
                  > <FontAwesomeIcon icon={faArrowLeft} className='mr-1' /> Back
                  </CLink>
                </CTooltip>
              </div>
            </CCardHeader>
            <CCardBody>
              <CFormGroup>
                <CLabel htmlFor="nf-name">Group Name</CLabel>
                <CInput type="text" id="user_group_name" name="user_group_name" placeholder="Enter Group Name " autoComplete="name" value={this.state.fields.user_group_name} onChange={this.handleChange} disabled={(this.state.fields.user_group_name === 'Super Users') ? true : false} />
                <CFormText className="help-block">{this.validator.message('user_group_name', this.state.fields.user_group_name, 'required', { className: 'text-danger' })}</CFormText>
              </CFormGroup>
              <br />
              {globalConstants.SUPER_PERMISSION_USER_ID.indexOf(this.state.fields._id) === -1 &&
                <CFormGroup row>
                  <CCol md="12">
                    <span className="h6">Module Permissions</span>
                    <hr />
                  </CCol>
                </CFormGroup>
              }
              {globalConstants.SUPER_PERMISSION_USER_ID.indexOf(this.state.fields._id) === -1 &&
                <>
                  {Object.keys(module_permission).map(((module_name, i) => (
                    <CFormGroup row key={i} >
                      <CCol md="2" >
                        <CLabel><strong>{capitalize(module_name.replace("_", " "))}</strong></CLabel>
                      </CCol>
                      <CCol md="9">
                        {Object.entries(module_permission[module_name]).map((([key, item]) => (
                          <CFormGroup variant="custom-checkbox" inline key={module_name + key}>
                            {item &&
                              <CInputCheckbox custom id={module_name + '___' + key} name={module_name + '___' + key} value={key} defaultChecked onClick={this.permssionChange} />
                            }
                            {item === false &&
                              <CInputCheckbox custom id={module_name + '___' + key} name={module_name + '___' + key} value={key} onChange={this.permssionChange} />
                            }
                            <CLabel variant="custom-checkbox" htmlFor={module_name + '___' + key}>{capitalize(key.replace("_", " "))}</CLabel>
                          </CFormGroup>
                        )
                        ))}
                      </CCol>
                    </CFormGroup>
                  )
                  ))
                  }
                </>
              }
              <CFormText className="help-block module_permission"></CFormText>
            </CCardBody>
            <CCardFooter>
              <CButton type="button" size="sm" color="primary" onClick={this.handleSubmit}><FontAwesomeIcon icon={faSave} className='mr-1' /> Submit</CButton>
              &nbsp;
              <CLink
                className="btn btn-danger btn-sm"
                aria-current="page"
                to="/admin/user_groups"
              ><FontAwesomeIcon icon={faBan} className='mr-1' />Cancel
              </CLink>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>);
  }

}

export default User_Groups_Edit;
