import React from "react";
import {
  CSelect,
  CCol,
  CFormGroup,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CButton,
  CModalBody,
  CTooltip,
} from "@coreui/react";
import { notify, _canAccess } from "../../_helpers/index";
import { globalConstants } from "../../constants/admin/global.constants";

class MultiActionBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      _openPopup: false,
      action_name: "",
      _popupMessage: "",
    };
  }

  handleChange = (event) => {
    this.setState({ action_name: event.target.value });
  };
  _handleApplyAction = (event) => {
    this.props.onClick(this.state.action_name);
    this.setState({ _openPopup: false });
  };

  handleApplyButtonClick = (event) => {
    let appliedActionId = [];
    let selectedIds = this.props.checkBoxData;
    for (var key in selectedIds) {
      if (selectedIds[key]) {
        appliedActionId.push(key);
      }
    }
    if (appliedActionId.length > 0) {
      if (this.state.action_name !== "") {
        let modelPoupMessage = "";
        if (this.state.action_name === "delete") {
          modelPoupMessage = globalConstants.MULTI_DELETE_MSG;
          if (appliedActionId.length === 1) {
            modelPoupMessage = globalConstants.SINGLE_DELETE_MSG;
          }
        } else if (this.state.action_name === "active") {
          modelPoupMessage = globalConstants.MULTI_ACTIVE_MSG;
          if (appliedActionId.length === 1) {
            modelPoupMessage = globalConstants.SINGLE_ACTIVE_MSG;
          }
        } else if (this.state.action_name === "deactive") {
          modelPoupMessage = globalConstants.MULTI_DEACTIVE_MSG;
          if (appliedActionId.length === 1) {
            modelPoupMessage = globalConstants.SINGLE_DEACTIVE_MSG;
          }
        }
        this.setState({ _openPopup: true, _popupMessage: modelPoupMessage });
      } else {
        notify.error("Select bulk action");
      }
    } else {
      notify.error("Not found any selected records for bulk action");
    }
  };

  render() {
    return (
      (_canAccess(this.props.module_name, "delete") ||
      _canAccess(this.props.module_name, "update")) && 
      <>
        <CFormGroup row className="mr-0 ">
          <CCol xs="2">
            <CSelect
              id="action_name"
              name="action_name"
              onChange={this.handleChange}
            >
              <option key="0" value="">
                -- Bulk Action --
              </option>
              ;
              {_canAccess(this.props.module_name, "delete") && this.props.module_name != 'user_groups' && (
                <option key="1" value="delete">
                  Delete
                </option>
              )}
              {this.props.module_name !== "system_modules" &&
                _canAccess(this.props.module_name, "update") && (
                  <option key="2" value="active">
                    Activate
                  </option>
                )}
              {this.props.module_name !== "system_modules" &&
                _canAccess(this.props.module_name, "update") && (
                  <option key="3" value="deactive">
                    Deactivate
                  </option>
                )}
            </CSelect>
          </CCol>
          <CCol xs="2" className="pl-0">
            <CTooltip content={globalConstants.BULK_APPLY_BTN}>
              <button
                className="btn btn-dark"
                onClick={this.handleApplyButtonClick}
              >
                Apply
              </button>
            </CTooltip>
          </CCol>
          <CCol xs="8"></CCol>
        </CFormGroup>
        <CModal
          show={this.state._openPopup}
          onClose={() => {
            this.setState({ _openPopup: !this.state._openPopup });
          }}
          color="danger"
        >
          <CModalHeader closeButton>
            <CModalTitle>Bulk Action</CModalTitle>
          </CModalHeader>
          <CModalBody>{this.state._popupMessage}</CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={this._handleApplyAction}>
              Apply
            </CButton>
            <CButton
              color="secondary"
              onClick={() => {
                this.setState({ _openPopup: !this.state._openPopup });
              }}
            >
              Cancel
            </CButton>
          </CModalFooter>
        </CModal>
      </>
    );
  }
}

export default MultiActionBar;
