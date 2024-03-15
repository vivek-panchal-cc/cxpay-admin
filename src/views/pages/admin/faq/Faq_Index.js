import React from "react";
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
  CTooltip,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSort,
  faSortDown,
  faSortUp,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";

import {
  notify,
  history,
  _canAccess,
  _loginUsersDetails,
} from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { faqService } from "services/admin/faq.service";

class FaqIndex extends React.Component {
  constructor(props) {
    super(props);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteUser = this.deleteUser.bind(this);

    this.state = {
      fields: {},
      _openPopup: false,
      faq_list: [],
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/faq");
    }
  }

  componentDidMount() {
    this.getFaqList();
  }

  getFaqList() {
    faqService.getFaqList().then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({
          faq_list: res.result,
        });
      }
    });
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });
    faqService.deleteFaq({ id: +this.state.deleteId }).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getFaqList();
      }
    });
  }

  FaqStatusChangedHandler(faq_id, status) {
    faqService.changeFaqStatus(faq_id, { status: !status }).then((res) => {
      if (res.status === "error") {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getFaqList();
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
                Faqs
                <div className="card-header-actions">
                  {_canAccess("faqs", "create") && (
                    <CTooltip content={globalConstants.ADD_BTN}>
                      <CLink
                        className="btn btn-dark btn-block"
                        aria-current="page"
                        to="/admin/faq/add"
                      >
                        <FontAwesomeIcon icon={faPlus} />
                      </CLink>
                    </CTooltip>
                  )}
                </div>
              </CCardHeader>
              <CCardBody>
                <div className="position-relative table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Sequence</th>
                        <th>Question</th>
                        <th>Status</th>
                        {(_canAccess("faqs", "update") ||
                          _canAccess("faqs", "delete")) && (
                          <>
                            <th>Action</th>
                          </>
                        )}
                      </tr>
                    </thead>

                    <tbody>
                      {this.state.faq_list?.length > 0 &&
                        this.state.faq_list?.map((u, index) => (
                          <tr key={u.id}>
                            <td>{u.sequence}</td>
                            <td>
                              {" "}
                              {_canAccess("faqs", "view") && (
                                <CLink to={`/admin/faq/detailview/${u.id}`}>
                                  {u.faq_question}
                                </CLink>
                              )}
                            </td>

                            <td>
                              {_canAccess("faqs", "update") && (
                                <CLink
                                  onClick={() =>
                                    this.FaqStatusChangedHandler(
                                      u.id,
                                      u.status
                                    )
                                  }
                                >
                                  {u.status ? "Active" : "Deactive"}
                                </CLink>
                              )}
                              {_canAccess("faqs", "update") === false && (
                                <>{u.status ? "Active" : "Deactive"}</>
                              )}
                            </td>
                            {(_canAccess("faqs", "update") ||
                              _canAccess("faqs", "delete")) && (
                              <>
                                <td>
                                  {_canAccess("faqs", "update") && (
                                    <CTooltip
                                      content={globalConstants.EDIT_BTN}
                                    >
                                      <CLink
                                        className="btn  btn-md btn-primary"
                                        aria-current="page"
                                        to={`/admin/faq/edit/${u.id}`}
                                      >
                                        <CIcon name="cil-pencil"></CIcon>{" "}
                                      </CLink>
                                    </CTooltip>
                                  )}
                                  &nbsp;
                                  {_canAccess("faqs", "delete") && (
                                    <CTooltip
                                      content={globalConstants.DELETE_BTN}
                                    >
                                      <button
                                        className="btn  btn-md btn-danger "
                                        onClick={() =>
                                          this.openDeletePopup(u.id)
                                        }
                                      >
                                        <CIcon name="cil-trash"></CIcon>
                                      </button>
                                    </CTooltip>
                                  )}
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      {this.state.faq_list?.length === 0 && (
                        <tr>
                          <td colSpan="5">No records found</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
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
            <CModalTitle>Delete Faq</CModalTitle>
          </CModalHeader>
          <CModalBody>Are you sure you want to delete this Faq?</CModalBody>
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

export default FaqIndex;
