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
import CIcon from "@coreui/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  notify,
  history,
  _canAccess,
  _loginUsersDetails,
} from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { faqService } from "services/admin/faq.service";
import IconDragAndDrop from "assets/icons/IconDragAndDrop";

class FaqIndex extends React.Component {
  constructor(props) {
    super(props);
    this.openDeletePopup = this.openDeletePopup.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.onDragEnd = this.onDragEnd.bind(this);

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

  getFaqList(callback) {
    faqService.getFaqList().then((res) => {
      if (!res.success) {
        notify.error(res.message);
      } else {
        this.setState({
          faq_list: res.result,
        });
        if (typeof callback === "function") {
          const sequenceData = res.result?.map((item, index) => ({
            id: item.id,
            sequence: index + 1,
          }));
          callback(sequenceData);
        }
      }
    });
  }

  openDeletePopup(id) {
    this.setState({ _openPopup: true, deleteId: id });
  }
  deleteUser() {
    this.setState({ _openPopup: false, deleteId: undefined });
    faqService.deleteFaq({ id: +this.state.deleteId }).then((res) => {
      if (!res.success) {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getFaqList((sequenceData) => {
          this.changeSequence(sequenceData);
        });
      }
    });
  }

  faqStatusChangedHandler(faq_id, status) {
    let changeStatus = {
      id: +faq_id,
      status: !status,
    };
    faqService.changeFaqStatus(changeStatus).then((res) => {
      if (!res.success) {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.getFaqList();
      }
    });
  }

  // onDragEnd(result) {
  //   if (!result.destination) {
  //     return;
  //   }

  //   const faq_list = Array.from(this.state.faq_list);
  //   const [reorderedItem] = faq_list.splice(result.source.index, 1);
  //   faq_list.splice(result.destination.index, 0, reorderedItem);

  //   this.setState({
  //     faq_list: faq_list,
  //   });
  // }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    const formData = new FormData();
    const { source, destination } = result;
    const faqList = [...this.state.faq_list];
    let sequenceData = [];

    // Reordering within the same droppable
    if (source.droppableId === destination.droppableId) {
      const movedItem = faqList?.splice(source.index, 1)[0];
      faqList?.splice(destination.index, 0, movedItem);
    } else {
      // Moving to a different droppable
      const movedItem = faqList?.splice(source.index, 1)[0];
      faqList?.splice(destination.index, 0, movedItem);

      // Update sequence values after move
      for (let i = 0; i < faqList?.length; i++) {
        faqList[i].sequence = i + 1;
      }
    }

    // Update state with the new faq list
    this.setState({
      faq_list: faqList,
    });

    // Construct sequence data in the desired format
    faqList?.forEach((item, index) => {
      sequenceData?.push({
        id: item.id,
        sequence: index + 1,
      });
    });

    // formData.append("sequence_data", JSON.stringify(sequenceData));

    this.changeSequence(sequenceData);
  }

  changeSequence(sequenceData) {
    faqService
      .changeSequenceData({ sequence_data: sequenceData })
      .then((res) => {
        if (!res.success) {
          notify.error(res.message);
        } else {
          // notify.success(res.message);
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
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Droppable droppableId="faq_list">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <table className="table">
                          <thead>
                            <tr>
                              <th></th>
                              <th>Sequence</th>
                              <th>Question</th>
                              <th>Status</th>
                              {_canAccess("faqs", "update") && <th>Action</th>}
                            </tr>
                          </thead>

                          <tbody>
                            {this.state.faq_list?.map((faq, index) => (
                              <Draggable
                                key={faq.id}
                                draggableId={faq.id.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className={
                                      snapshot.isDragging ? "dragging" : ""
                                    }
                                  >
                                    <td>
                                      <CTooltip
                                        content={globalConstants.DRAG_DROP}
                                      >
                                        <IconDragAndDrop />
                                      </CTooltip>
                                    </td>
                                    <td>{faq.sequence}</td>
                                    <td>
                                      {_canAccess("faqs", "view") ? (
                                        <CLink
                                          to={`/admin/faq/detailview/${faq.id}`}
                                        >
                                          {faq.faq_question}
                                        </CLink>
                                      ) : (
                                        faq.faq_question
                                      )}
                                    </td>
                                    <td>
                                      {_canAccess("faqs", "update") ? (
                                        <CLink
                                          onClick={() =>
                                            this.faqStatusChangedHandler(
                                              faq.id,
                                              faq.status
                                            )
                                          }
                                        >
                                          {faq.status ? "Active" : "Deactive"}
                                        </CLink>
                                      ) : faq.status ? (
                                        "Active"
                                      ) : (
                                        "Deactive"
                                      )}
                                    </td>
                                    {_canAccess("faqs", "update") && (
                                      <td>
                                        <CLink
                                          className="btn  btn-md btn-primary"
                                          aria-current="page"
                                          to={`/admin/faq/edit/${faq.id}`}
                                        >
                                          <CIcon name="cil-pencil"></CIcon>{" "}
                                        </CLink>
                                        &nbsp;
                                        <button
                                          className="btn  btn-md btn-danger "
                                          onClick={() =>
                                            this.openDeletePopup(faq.id)
                                          }
                                        >
                                          <CIcon name="cil-trash"></CIcon>
                                        </button>
                                      </td>
                                    )}
                                  </tr>
                                )}
                              </Draggable>
                            ))}
                            {this.state.faq_list?.length === 0 && (
                              <tr>
                                <td className="text-center" colSpan="5">
                                  No records found
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
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
