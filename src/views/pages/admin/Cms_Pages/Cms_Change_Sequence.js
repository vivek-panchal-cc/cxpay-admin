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
import { faArrowLeft, faPlus } from "@fortawesome/free-solid-svg-icons";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  notify,
  history,
  _canAccess,
  _loginUsersDetails,
} from "../../../../_helpers/index";
import { globalConstants } from "../../../../constants/admin/global.constants";
import IconDragAndDrop from "assets/icons/IconDragAndDrop";
import { pageService } from "../../../../services/admin/page.service";

class Cms_Change_Sequence extends React.Component {
  constructor(props) {
    super(props);
    this.onDragEnd = this.onDragEnd.bind(this);

    this.state = {
      fields: {},
      _openPopup: false,
      cms_list: [],
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/cms_pages");
    }
  }

  componentDidMount() {
    this.getCMSList();
  }

  getCMSList(callback) {
    pageService.getCMSList().then((res) => {
      if (!res.success) {
        notify.error(res.message);
      } else {
        this.setState({
          cms_list: res.data.cms_pages,
        });
        if (typeof callback === "function") {
          const sequenceData = res.data.cms_pages?.map((item, index) => ({
            id: item.id,
            sequence: index + 1,
          }));
          callback(sequenceData);
        }
      }
    });
  }

  onDragEnd(result) {
    if (!result.destination) {
      return;
    }
    const formData = new FormData();
    const { source, destination } = result;
    const cmsList = [...this.state.cms_list];
    let sequenceData = [];

    // Reordering within the same droppable
    if (source.droppableId === destination.droppableId) {
      const movedItem = cmsList?.splice(source.index, 1)[0];
      cmsList?.splice(destination.index, 0, movedItem);
    } else {
      // Moving to a different droppable
      const movedItem = cmsList?.splice(source.index, 1)[0];
      cmsList?.splice(destination.index, 0, movedItem);

      // Update sequence values after move
      for (let i = 0; i < cmsList?.length; i++) {
        cmsList[i].sequence = i + 1;
      }
    }

    // Update state with the new cms list
    this.setState({
      cms_list: cmsList,
    });

    // Construct sequence data in the desired format
    cmsList?.forEach((item, index) => {
      sequenceData?.push({
        id: item.id,
        sequence: index + 1,
      });
    });

    // formData.append("sequence_data", JSON.stringify(sequenceData));

    this.changeSequence(sequenceData);
  }

  changeSequence(sequenceData) {
    pageService
      .changeSequenceData({ sequence_data: sequenceData })
      .then((res) => {
        if (!res.success) {
          notify.error(res.message);
        } else {
          // notify.success(res.message);
          this.getCMSList();
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
                <strong>Change Sequence</strong>
                <div className="card-header-actions">
                  <CTooltip content={globalConstants.BACK_MSG}>
                    <CLink
                      className="btn btn-danger btn-sm"
                      aria-current="page"
                      to="/admin/cms_pages"
                    >
                      {" "}
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                        className="mr-1"
                      />{" "}
                      Back
                    </CLink>
                  </CTooltip>
                </div>
              </CCardHeader>
              <CCardBody>
                <DragDropContext onDragEnd={this.onDragEnd}>
                  <Droppable droppableId="cms_list">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef}>
                        <table className="table">
                          <thead>
                            <tr>
                              <th></th>
                              <th>Sequence</th>
                              <th>Title</th>
                              <th>Status</th>
                            </tr>
                          </thead>

                          <tbody>
                            {this.state.cms_list?.map((cms, index) => (
                              <Draggable
                                key={cms.id}
                                draggableId={cms.id.toString()}
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
                                    <td>{cms.sequence}</td>
                                    <td>{cms.title}</td>
                                    <td>
                                      {cms.status ? "Active" : "Deactive"}
                                    </td>
                                  </tr>
                                )}
                              </Draggable>
                            ))}
                            {this.state.cms_list?.length === 0 && (
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
      </>
    );
  }
}

export default Cms_Change_Sequence;
