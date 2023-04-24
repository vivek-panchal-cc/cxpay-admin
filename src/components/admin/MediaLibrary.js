import React from 'react';
import {
  CCol,
  CFormGroup,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CModalBody,
  CTooltip,
  CTabs,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CRow
} from '@coreui/react'
import { globalConstants } from '../../constants/admin/global.constants';
import { mediaService } from "../../services/admin/media.service";
import { notify } from '../../_helpers';
import $ from 'jquery';
import 'react-dropzone-uploader/dist/styles.css';
import Dropzone from 'react-dropzone-uploader';
import { authHeaderMutlipart } from '../../_helpers/auth-header';
// import { Preview } from './Preview';
// const Preview = React.lazy(() => import('./Preview'));
require('dotenv').config();


class MediaLibrary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _openPopup: false,
      action_name: '',
      _popupMessage: '',
      media: [],
      activeTab: 1,
      selectedMediaId: '',
    }
    this.selectMedia = this.selectMedia.bind(this);
    this._handleCancelAction = this._handleCancelAction.bind(this);
  }

  _handleApplyAction = (event) => {
    this.props.onClick(this.state.selectedMediaId, this.state.selectedMediaFile);
    this.setState({ _openPopup: false })
  }

  _handleDeleteAction = (event) => {
    if (this.state.selectedMediaId !== '') {
      mediaService.deleteMedia({ media_id: this.state.selectedMediaId }).then(res => {
        if (res.status === false) {
          notify.error(res.message);
        } else {
          this.getMedia();
          this.setState({ _openPopupConfrim: false, selectedMediaId: '', selectedMediaFile: '' });
        }
      });
    } else {
      notify.error('Media file not selected');
    }
  }

  handleApplyButtonClick = (event) => {
    this.setState({ _openPopup: true });
  }

  componentDidMount() {
    this.getMedia();
  }

  _handleDeletePopup() {
    if (this.state.selectedMediaId !== '') {
      this.setState({ _openPopupConfrim: !this.state._openPopupConfrim })
    } else {
      notify.error('Media file not selected');
    }
  }

  getMedia() {
    mediaService.getMedia().then(res => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({ media: res.data });
      }
      setTimeout(() => {
        $('.dzu-previewContainer').remove();
        $('.dzu-inputLabelWithFiles').addClass('willDeleteRef');
        $('.willDeleteRef').removeClass('dzu-inputLabelWithFiles');
        $('.willDeleteRef').addClass('dzu-inputLabel');
        this.setState({ activeTab: 1 });
      }, 2000);
    });
  }

  setActiveTab(id) {
    this.setState({ activeTab: id });
  }

  selectMedia(id, filepath) {
    if (id === this.state.selectedMediaId) {
      this.setState({ selectedMediaId: '', selectedMediaFile: '' });
      $('.mediaLibrary').removeClass('selected-media');
    } else {
      this.setState({ selectedMediaId: id, selectedMediaFile: filepath });
      $('.mediaLibrary').removeClass('selected-media');
      $('#' + id).addClass('selected-media');
    }
  }

  addDefaultSrc(ev) {
    ev.target.src = `${process.env.REACT_APP_API_URL + 'uploads/default.jpg'}`
  }

  _handleCancelAction() {
    this.setState({ _openPopup: !this.state._openPopup });
  }

  getUploadParams = ({ file }) => {
    const body = new FormData();
    body.append('media_path', file);
    return { headers: authHeaderMutlipart('', ''), url: `${process.env.REACT_APP_API_URL}api/media/upload`, body }
  }

  handleChangeStatus = ({ xhr }) => {
    if (xhr) {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const result = JSON.parse(xhr.response);
          if (result.status === 'success') {
            this.getMedia();
          }
        }
      }
    }
  }

  render() {
    const responsive = {
      width: "100%",
      height: "160px"
    }
    return <>
      <CFormGroup row className='mr-0 '>
        <CCol xs="2" className='pl-3'>
          <CTooltip content={globalConstants.MEDIA_LIBRARY} >
            <button className="btn btn-dark" onClick={this.handleApplyButtonClick}>Media Library</button>
          </CTooltip>
        </CCol>
        <CCol xs="8"></CCol>
      </CFormGroup>
      <CModal show={this.state._openPopup} onClose={() => { this.setState({ _openPopup: !this.state._openPopup }) }} size="xl" >
        <CModalHeader closeButton>
          <CModalTitle>Select or Upload Media</CModalTitle>
        </CModalHeader>
        <CModalBody >
          <CTabs activeTab={this.state.activeTab} onActiveTabChange={idx => this.setActiveTab(idx)}>
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink>
                  Upload Files
                  </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink>
                  Media Library
                  </CNavLink>
              </CNavItem>
            </CNav>
            <CTabContent>
              <CTabPane>
                <Dropzone
                  getUploadParams={this.getUploadParams}
                  onChangeStatus={this.handleChangeStatus}
                  styles={{
                    dropzone: { overflow: 'auto', height: '380px','marginTop': '-1px','borderTopWidth': '0px','borderWidth': '1px','borderRadius': '0px' },
                    inputLabel: { color: '#c4c9d0' }
                  }}
                  canRemove={true}
                  canRestart={true}
                  // PreviewComponent={Preview}
                  accept="image/*"
                  timeout="500"
                  inputWithFilesContent="Drag Files or Click to Browse"
                />
              </CTabPane>
              <CTabPane>
                <CRow className="pt-4 media-popup">
                  {this.state.media.length > 0 &&
                    this.state.media.map((u, index) => (
                      <CCol xs="12" sm="6" lg="3" key={index}>
                        <div className="card bg-gradient-info text-white" style={responsive} >
                          <img className="sortCls mediaLibrary" id={u._id} onError={this.addDefaultSrc} src={`${process.env.REACT_APP_API_URL + 'uploads/media/' + u.media_path}`} alt="Media Image" onClick={(event) => { this.selectMedia(u._id, u.media_path) }} />
                        </div>
                      </CCol>
                    ))
                  }
                </CRow>
              </CTabPane>
            </CTabContent>
          </CTabs>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={this._handleApplyAction} >Select</CButton>
          <CButton color="danger" onClick={() => { this._handleDeletePopup() }} >Delete</CButton>
          <CButton color="secondary" onClick={() => { this.setState({ _openPopup: !this.state._openPopup }) }}>Cancel</CButton>
        </CModalFooter>
      </CModal>
      <div className='deletepopup-container'>
        <CModal
          show={this.state._openPopupConfrim}
          onClose={() => { this.setState({ _openPopupConfrim: !this.state._openPopupConfrim }) }}
          color="danger"
          className="deletepopup"
        >
          <CModalHeader closeButton>
            <CModalTitle>Delete Media Item</CModalTitle>
          </CModalHeader>
          <CModalBody>
            Are you sure you want to delete this media item?
        </CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this._handleDeleteAction()} >Delete</CButton>
            <CButton color="secondary" onClick={() => { this.setState({ _openPopupConfrim: false }) }}>Cancel</CButton>
          </CModalFooter>
        </CModal>
      </div>
    </>;
  }
}

export default MediaLibrary;