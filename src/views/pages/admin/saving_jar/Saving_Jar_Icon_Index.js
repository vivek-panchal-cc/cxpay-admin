import React from "react";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CLink,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton,
  CTooltip,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { savingJarService } from "services/admin/savings_jar.service";
import IconTrash from "assets/icons/IconTrash";
import "./SavingJarIcons.css";

class Saving_Jar_Icon_Index extends React.Component {
  constructor(props) {
    super(props);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.getSavingJarIconsList = this.getSavingJarIconsList.bind(this);

    this.state = {
      fields: {
        operation_type: "saving_jar_icon_list",
      },
      _openPopup: false,
      saving_jar_icon_list: [],
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/saving_jar_icon");
    }
  }

  componentDidMount() {
    this.getSavingJarIconsList();
  }

  getSavingJarIconsList() {
    savingJarService.savingJarIconBulkAction(this.state.fields).then((res) => {
      if (!res.success) {
        this.setState({
          saving_jar_icon_list: [],
        });
      } else {
        this.setState({
          saving_jar_icon_list: res.data || [],
        });
      }
    });
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }

  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });

    var postData = {
      id: [this.state.deleteId],
      operation_type: "saving_jar_icon_delete",
    };

    savingJarService.savingJarIconBulkAction(postData).then((res) => {
      if (!res.success) {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getSavingJarIconsList();
      }
    });
  }

  render() {
    return (
      <>
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardHeader>
                <strong>Saving Jar Icons</strong>
                <div className="card-header-actions">
                  {_canAccess("saving_jar", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/saving_jar_icon/add"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </CLink>
                    </CTooltip>
                  )}
                </div>
              </CCardHeader>
              <CCardBody>
                <div
                  className={`${
                    this.state.saving_jar_icon_list.length > 0
                      ? "saving-jar-icons-container"
                      : ""
                  }`}
                >
                  {this.state.saving_jar_icon_list &&
                    this.state.saving_jar_icon_list.length > 0 &&
                    this.state.saving_jar_icon_list.map((icon) => (
                      <div
                        key={icon.id}
                        className="saving-jar-icon"
                        onMouseEnter={() =>
                          this.setState({ hoveredIconId: icon.id })
                        }
                        onMouseLeave={() =>
                          this.setState({ hoveredIconId: null })
                        }
                      >
                        <img src={icon.url} alt="Saving Jar Icon" />
                        {_canAccess("saving_jar", "create") &&
                          this.state.hoveredIconId === icon.id && (
                            <IconTrash
                              className="delete-icon"
                              onClick={() => this.openDeletePopup(icon.id)}
                            />
                          )}
                      </div>
                    ))}
                </div>
                {this.state.saving_jar_icon_list?.length === 0 && (
                  <div>
                    <p>No icon found</p>
                  </div>
                )}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CModal
          show={this.state._openPopup}
          onClose={() => {
            this.setState({ _openPopup: !this.state._openPopup });
          }}
          color="danger"
        >
          <CModalHeader closeButton>
            <CModalTitle>Delete Saving Jar Icon</CModalTitle>
          </CModalHeader>
          <CModalBody>Are you sure you want to delete this icon?</CModalBody>
          <CModalFooter>
            <CButton color="danger" onClick={() => this.deleteUser()}>
              Delete
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

export default Saving_Jar_Icon_Index;
