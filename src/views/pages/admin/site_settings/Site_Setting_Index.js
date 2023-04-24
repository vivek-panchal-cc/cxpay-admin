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
  CButton
} from '@coreui/react'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons'
import { site_setting_Service } from "../../../../services/admin/site_setting.service";
import { notify, history, _canAccess } from '../../../../_helpers/index';




class Site_Setting extends React.Component {

  constructor(props) {
    super(props);


    /************************** * Bind Method with class *******************************/

    this.handleColumnSort = this.handleColumnSort.bind(this);
    this.handleSearch = this.handleSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    this.state = {
      fields: {
        pageNo: 1,
        sort_dir: 'asc',
        sort_field: "site_name",
        search_page_title_name: "",
        totalPage: 1
      },
      _openPopup: false,
      banner_list: []
    };


    if (this.props._renderAccess === false) {
      notify.error('Access Denied Contact to Super User');
      history.push('/admin/site_setting');
    }
  }

  /***************** *  Get Api data when component Render very First Time *********************/

  componentDidMount() {

    this.get_site_list();
    
  }


  get_site_list() {
    site_setting_Service.getsite(this.state.fields).then(res => {
      console.log(res.result);
      if (res.status === false) {
        notify.error(res.message);
      } else {

        this.setState({
          totalRecords: res.totalRecords,
          fields: {
            ...this.state.fields,
            totalPage: res.totalPage
          },
          banner_list: res.result
        });

      }
    });
  }

  /************************* * Define Methods For sorting and page change**************************/
  pageChange = newPage => {
    console.log(newPage);
    newPage = (newPage === 0) ? 1 : newPage;
    this.setState({
      fields: {
        ...this.state.fields,
        pageNo: newPage
      }
    }, () => { this.get_site_list() });
  }

  handleColumnSort(fieldName) {
    this.setState({
      fields: {
        ...this.state.fields,
        sort_dir: ['desc'].includes(this.state.fields.sort_dir) ? 'asc' : 'desc',
        sort_field: fieldName
      }
    }, () => { this.get_site_list() });
  }

  handleChange(e) {
    const { name, value } = e.target;
    this.setState({ fields: { ...this.state.fields, [name]: value } });
  }

  handleSearch(type) {
    if (type === 'reset') {
      this.setState({
        fields: {
          pageNo: 1,
          sort_dir: 'asc',
          sort_field: "name",
          search_page_title_name: "",
          totalPage: 1
        }
      }, () => { this.get_site_list() });

    } else {
      this.get_site_list();
    }
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });
    site_setting_Service.delete_site(this.state.deleteId).then(res => {
      if (res.status === 'error') {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.get_site_list();
      }
    });
  }



  /****************** * Render Data To Dom ************************/

  render() {
    console.log(this.state.banner_list);
    return (<>
      <CRow>
        <CCol xl={12}>
          <CCard>
            <CCardBody>
              <CRow>
                <CCol xl={3}>
                  <CFormGroup row>
                    <CCol xs="12">
                      <CLabel htmlFor="name">Name</CLabel>
                      <CInput id="name" placeholder="Search Name" name="search_page_title_name" value={this.state.fields.search_page_title_name} onChange={this.handleChange} />
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


              <CRow>
                <CCol xl={12}>
                  <CFormGroup row>
                    <CCol xs="1">

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
             Site Setting
              <div className="card-header-actions">
                {_canAccess('site_setting', 'create') &&
                  <CLink
                    className="btn btn-dark btn-block"
                    aria-current="page"
                    to="/admin/site_setting/add"
                  >Add
              </CLink>
                }
              </div>
            </CCardHeader>
            <CCardBody>
              <div className="position-relative table-responsive">
                <table className="table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th onClick={() => this.handleColumnSort("user_title_name")}>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">
                            Site Name
                          </span>
                          {this.state.fields.sort_field !== 'user_title_name' && <FontAwesomeIcon icon={faSort} />}
                          {this.state.fields.sort_dir === 'asc' && this.state.fields.sort_field === 'user_title_name' && <FontAwesomeIcon icon={faSortUp} />}
                          {this.state.fields.sort_dir === 'desc' && this.state.fields.sort_field === 'user_title_name' && <FontAwesomeIcon icon={faSortDown} />}
                        </span>
                      </th>
                      <th>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">
                            Site Email
                          </span>
                        </span>
                      </th>

                      <th>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">
                            Contact
                          </span>
                        </span>
                      </th>
                      <th onClick={() => this.handleColumnSort("status")}>
                        <span className="sortCls">
                          <span className="table-header-text-mrg">
                            Status
                          </span>
                          {this.state.fields.sort_field !== 'status' && <FontAwesomeIcon icon={faSort} />}
                          {this.state.fields.sort_dir === 'asc' && this.state.fields.sort_field === 'status' && <FontAwesomeIcon icon={faSortUp} />}
                          {this.state.fields.sort_dir === 'desc' && this.state.fields.sort_field === 'status' && <FontAwesomeIcon icon={faSortDown} />}
                        </span>
                      </th>
                      {(_canAccess('site_setting', 'update') || _canAccess('site_setting', 'delete')) && <><th>Action</th></>}
                    </tr>
                  </thead>

                  <tbody>

                    {this.state.banner_list.length > 0 &&
                      this.state.banner_list.map((u, index) => (
                        <tr key={u._id}>
                          <td>{index + 1}</td>
                          <td>{u.site_name}</td>
                          <td>{u.site_email}</td>

                          <td>{u.contact}</td>
                          <td>{(u.status) ? 'Active' : 'Deactive'}</td>
                          {(_canAccess('site_setting', 'update') || _canAccess('site_setting', 'delete')) && <>
                            <td>
                              {_canAccess('site_setting', 'update') &&
                                <CLink className="btn btn-outline-dark btn-md" aria-current="page" to={`/admin/site_setting/edit/${u._id}`} >Edit </CLink>
                              }
                           &nbsp;
                            {_canAccess('site_setting', 'delete') &&
                                <button className="btn btn-outline-dark  btn-md " onClick={() => this.openDeletePopup(u._id)}>Delete</button>
                              }
                            </td>
                          </>}
                        </tr>
                      ))
                    }
                    {this.state.banner_list.length === 0 && <tr><td colSpan='5'>No records found</td></tr>}
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
          <CModalTitle>Delete User</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Are you Sure you want to delete this records?
              </CModalBody>
        <CModalFooter>
          <CButton color="danger" onClick={() => this.deleteUser()} >Delete</CButton>
          <CButton color="secondary" onClick={() => { this.setState({ _openPopup: !this.state._openPopup }) }}>Cancel</CButton>
        </CModalFooter>
      </CModal>
    </>);
  }

}

export default Site_Setting