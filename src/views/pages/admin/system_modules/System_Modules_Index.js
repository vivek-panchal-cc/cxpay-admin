import React from 'react'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CPagination,
  CLink,
  CFormGroup,
  CInput,
  CLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CTooltip
} from '@coreui/react'
import { systemModulesService } from "../../../../services/admin/system_modules.service";
import { notify,history } from '../../../../_helpers/index';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortDown, faSortUp, faPlus } from '@fortawesome/free-solid-svg-icons'
import { globalConstants } from '../../../../constants/admin/global.constants';
import CIcon from '@coreui/icons-react'
const CheckBoxes = React.lazy(() => import('../../../../components/admin/Checkboxes'));
const MultiActionBar = React.lazy(() => import('../../../../components/admin/MultiActionBar'));


class System_Modules_Index extends React.Component {

  constructor(props) {
    super(props);
    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteSystemModules = this.deleteSystemModules.bind(this);

    this.state = {
      fields: {
        pageNo: 1,
        sort_dir: 'asc',
        sort_field: "module_name",
        search_module_name: "",
        totalPage: 1
      },
      _openPopup: false,
      module_list: [],
      multiaction: [],
      allCheckedbox: false
    };

    if (this.props._renderAccess === false) {
      history.push('/admin/dashboard');
    }
  }

  componentDidMount() {
    this.getSystemModulesList();
  }

  getSystemModulesList() {
    systemModulesService.getSystemModulesListData(this.state.fields).then(res => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({ totalRecords: res.totalRecords ,
          fields: {
            ...this.state.fields,
            totalPage: res.totalPage
          },
          module_list: res.result
        });
        /* Multi delete checkbox code */
        if (res.result?.length > 0) {
          let modules = res.result;
          let multiaction = [];
          for (var key in modules) {
            multiaction[modules[key]._id] = false;
          }
          this.setState({ multiaction: multiaction });
        } else if (res.result?.length === 0) {
          this.setState({ multiaction: [] });
        }
      }
    });
  }

  pageChange = newPage => {
    newPage = (newPage === 0) ? 1 : newPage;
    this.setState({ fields: {
      ...this.state.fields,
      pageNo: newPage
    }},() => { this.getSystemModulesList() });
  }

  handleColumnSort(fieldName) {
    this.setState({
      fields: {
        ...this.state.fields,
        sort_dir: ['desc'].includes(this.state.fields.sort_dir) ? 'asc' : 'desc',
        sort_field: fieldName
      }
    }, () => { this.getSystemModulesList() });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }

  handleSearch(type) {
    this.resetCheckedBox();
    if (type === 'reset') {
      this.setState({
        fields: {
          pageNo: 1,
          sort_dir: 'asc',
          sort_field: "name",
          search_module_name: "",
          totalPage: 1
        }
      }, () => { this.getSystemModulesList() });

    } else {
      this.getSystemModulesList();
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteSystemModules() {
    this.setState({ _openPopup: false, deleteId: undefined });
    systemModulesService.deleteSystemModules(this.state.deleteId).then(res => {
      if (res.status === 'error') {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getSystemModulesList();
      }
    });
  }

  resetCheckedBox() {
    this.setState({ allCheckedbox: false });
  }

  handleApplyAction = (actionValue = '') => {
    if (actionValue !== '') {
      let appliedActionId = [];
      let selectedIds = this.state.multiaction;
      for (var key in selectedIds) {
        if (selectedIds[key]) {
          appliedActionId.push(key);
        }
      }

      switch (actionValue) {
        case 'delete':
          systemModulesService.deleteMultipleSystemModules({ system_module_ids: appliedActionId }).then(res => {
            if (res.status === false) {
              notify.error(res.message);
            } else {
              notify.success(res.message);
              this.resetCheckedBox();
              this.getSystemModulesList();
            }
          });
          break;
        default:
          break;
      }

    }
  }

  handleAllChecked = (event) => {
    let multiactions = this.state.multiaction;
    for (var key in multiactions) {
      multiactions[key] = event.target.checked;
    }
    this.setState({ multiaction: multiactions, allCheckedbox: event.target.checked });
  }

  handleCheckChieldElement = (event) => {
    let multiactions = this.state.multiaction;
    multiactions[event.target.value] = event.target.checked;
    this.setState({ multiaction: multiactions });
  }


  render() {

    return (<>
      <CRow>
        <CCol xl={12}>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol xl={3}>
                  <CFormGroup row>
                    <CCol xs="12">
                      <CLabel htmlFor="name">Module Name</CLabel>
                      <CInput id="name" placeholder="Search Module Name" name="search_module_name" value={this.state.fields.search_module_name} onChange={this.handleChange} />
                    </CCol>
                  </CFormGroup>
                </CCol>

                <CCol xl={9}>
                  <CFormGroup row>
                    <CCol xs="12">

                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
              <CRow>
                <CCol xl={12}>
                  <CFormGroup row>
                    <CCol xs="1">
                      <button className="btn btn-dark btn-md" onClick={() => this.handleSearch()}>Search</button>
                    </CCol>
                    <CCol xs="2">
                      <button className="btn btn-dark btn-md" onClick={() => this.handleSearch('reset')}>Clear</button>
                    </CCol>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <CRow>
        <CCol xl={12}>
          <CCard>
            <CCardHeader>
              Modules Management
              <div className="card-header-actions">
                <CTooltip content={globalConstants.ADD_BTN} >
                  <CLink
                    className="btn btn-dark btn-block"
                    aria-current="page"
                    to="/admin/system_modules/add"
                  ><FontAwesomeIcon icon={faPlus} />
                  </CLink>
                </CTooltip>
              </div>
            </CCardHeader>
            <CCardBody>
              <div className="position-relative table-responsive">
              <MultiActionBar onClick={this.handleApplyAction} checkBoxData={this.state.multiaction} module_name={'system_modules'} />
                <table className="table">
                  <thead>
                    <tr>
                      <th><input type="checkbox" onClick={this.handleAllChecked} value="checkedall" onChange={e => { }} checked={this.state.allCheckedbox} /></th>
                      <th>#</th>
                      <th onClick={() => this.handleColumnSort("module_name")}>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">
                            Module Name
                          </span>
                          {this.state.fields.sort_field !== 'module_name' && <FontAwesomeIcon icon={faSort} />}
                          {this.state.fields.sort_dir === 'asc' && this.state.fields.sort_field === 'module_name' && <FontAwesomeIcon icon={faSortUp} />}
                          {this.state.fields.sort_dir === 'desc' && this.state.fields.sort_field === 'module_name' && <FontAwesomeIcon icon={faSortDown} />}
                        </span>
                      </th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.module_list?.length > 0 &&
                      this.state.module_list?.map((u, index) => (
                        <tr key={u._id}>
                          <td><CheckBoxes handleCheckChieldElement={this.handleCheckChieldElement} _id={u._id} _isChecked={this.state.multiaction[u._id]} /></td>
                          <td>{index + 1}</td>
                          <td>{u.module_name}</td>
                          <td>
                          <CTooltip content={globalConstants.EDIT_BTN} ><CLink className="btn  btn-md btn-primary" aria-current="page" to={`/admin/system_modules/edit/${u._id}`} ><CIcon name="cil-pencil"></CIcon>  </CLink></CTooltip>
                        &nbsp;
                          <CTooltip content={globalConstants.DELETE_BTN} ><button className="btn  btn-md btn-danger" onClick={() => this.openDeletePopup(u._id)}><CIcon name="cil-trash"></CIcon></button></CTooltip>
                          </td>
                        </tr>
                      ))
                    }
                    {this.state.module_list?.length === 0 && <tr><td colSpan='5'>No records found</td></tr>}
                  </tbody>
                </table>
                <CPagination
                  activePage={this.state.fields.pageNo}
                  onActivePageChange={this.pageChange}
                  pages={this.state.fields.totalPage}
                  doubleArrows={true}
                  align="end"
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal
        show={this.state._openPopup}
        onClose={() => { this.setState({ _openPopup: !this.state._openPopup }) }}
        color="danger"
      >
        <CModalHeader closeButton>
          <CModalTitle>Delete System Module</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you sure you want to delete this record?
        </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => this.deleteSystemModules()} >Delete</CButton>
          <CButton color="secondary" onClick={() => { this.setState({ _openPopup: !this.state._openPopup }) }}>Cancel</CButton>
        </CModalFooter>
      </CModal>
    </>);
  }

}

export default System_Modules_Index;