import React, { Component } from "react";
import ReactDOM from "react-dom";
import $ from "jquery";
import slugify from "react-slugify";

import {
  CButton,
  CFormGroup,
  CLabel,
  CFormText,
  CInput,
  CCol,
  CLink,
  CSwitch,
  CCardHeader,
  CCard,
  CCardBody,
  CCardFooter,
  CTooltip,
  CRow,
  CTabPane,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CNavItem,
  CNavLink,
  CTabContent,
  CNav,
  CTabs,
  CModal,
} from "@coreui/react";

import SimpleReactValidator from "simple-react-validator";
// import { emailTemplateService } from '../../../../services/admin/email_template.service';
import { smsTemplateService } from "../../../../services/admin/sms_template.service";
import { notify, history, _canAccess } from "../../../../_helpers/index";
import { Editor } from "@tinymce/tinymce-react";
import { globalConstants } from "../../../../constants/admin/global.constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSave, faBan, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import Dropzone from "react-dropzone-uploader";
import { mediaService } from "../../../../services/admin/media.service";
import { authHeaderMutlipart } from "../../../../_helpers/auth-header";
import "react-dropzone-uploader/dist/styles.css";
import "./Draft.css";

class SMS_Template_Edit extends Component {
  constructor(props) {
    super(props);

    /************  Define iniitla State by  ***********************/
    this.state = {
      name: "",
      id: this.props.match.params.id,
      initialValue: "",
      status: false,
      media: [],
      activeTab: 1,
      _openPopup: false,
      selectedMediaFile: "",
      media_height: "",
      media_width: "",
      media_alt_text: "",
    };

    /************************* Bind Methods for actions  **************************/

    this.validator = new SimpleReactValidator({ autoForceUpdate: this });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.selectMedia = this.selectMedia.bind(this);
    this._handleCancelAction = this._handleCancelAction.bind(this);
  }

  /*************** * Bind Method For Form Editor **********************/
  handleEditorChange = (content, editor) => {
    this.setState({
      initialValue: content,
    });
  };

  /************************ Define  Method For Form Field **************************/
  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    this.setState({
      [name]: value,
    });
  }
  /********** Retrive Api of Listing media images  *****************/
  getMedia() {
    mediaService.getMedia().then((res) => {
      if (res.status === false) {
        notify.error(res.message);
      } else {
        this.setState({ media: res.data });
      }
      setTimeout(() => {
        $(".dzu-previewContainer").remove();
        $(".dzu-inputLabelWithFiles").addClass("willDeleteRef");
        $(".willDeleteRef").removeClass("dzu-inputLabelWithFiles");
        $(".willDeleteRef").addClass("dzu-inputLabel");
        this.setState({ activeTab: 1 });
      }, 2000);
    });
  }

  // Close  modal box method
  _handleCancelAction() {
    $("#myModal").css("display", "none");
  }

  /******** media Modal gallery  ************/
  _handleApplyAction = (event) => {
    const img_src = `${
      process.env.REACT_APP_API_URL +
      "uploads/media/" +
      this.state.selectedMediaFile
    }`;
    let content = this.state.initialValue;
    if (
      this.state.media_height.trim() !== "" &&
      this.state.media_width.trim() !== ""
    ) {
      var styleVal =
        'style="height:' +
        this.state.media_height +
        "; width:" +
        this.state.media_width +
        '"';
    }
    var altVal = 'alt="Image"';
    if (this.state.media_alt_text.trim() !== "") {
      altVal = 'alt="' + this.state.media_alt_text + '"';
    }
    const img = "<img " + altVal + ' src="' + img_src + '" ' + styleVal + "/>";
    this.setState({
      initialValue: content.concat(img),
      media_height: "",
      media_width: "",
      media_alt_text: "",
    });
    $("#myModal").css("display", "none");
  };

  /********Select media from gallery  ************/
  selectMedia(id, filepath) {
    if (id === this.state.selectedMediaId) {
      this.setState({ selectedMediaId: "", selectedMediaFile: "" });
      $(".mediaLibrary").removeClass("selected-media");
    } else {
      this.setState({ selectedMediaId: id, selectedMediaFile: filepath });
      $(".mediaLibrary").removeClass("selected-media");
      $("#" + id).addClass("selected-media");
    }
  }

  _handleDeleteAction = (event) => {
    if (this.state.selectedMediaId !== "") {
      mediaService
        .deleteMedia({ media_id: this.state.selectedMediaId })
        .then((res) => {
          if (res.status === false) {
            notify.error(res.message);
          } else {
            this.getMedia();
            this.setState({
              _openPopupConfrim: false,
              selectedMediaId: "",
              selectedMediaFile: "",
            });
          }
        });
    } else {
      notify.error("Media file not selected");
    }
  };

  /******* Delete images from popup **********/

  _handleDeletePopup() {
    if (this.state.selectedMediaId !== "") {
      this.setState({ _openPopupConfrim: !this.state._openPopupConfrim });
    } else {
      notify.error("Media file not selected");
    }
  }

  // set Active tab

  setActiveTab(id) {
    this.setState({ activeTab: id });
  }

  // Drag & drop upload media

  getUploadParams = ({ file }) => {
    const body = new FormData();
    body.append("media_path", file);
    return {
      headers: authHeaderMutlipart("", ""),
      url: `${process.env.REACT_APP_API_URL}api/media/upload`,
      body,
    };
  };

  handleChangeStatus = ({ xhr }) => {
    if (xhr) {
      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          const result = JSON.parse(xhr.response);
          if (result.status === "success") {
            this.getMedia();
          }
        }
      };
    }
  };

  addDefaultSrc(ev) {
    ev.target.src = `${process.env.REACT_APP_API_URL + "uploads/default.jpg"}`;
  }

  /********** Retrieve Data very first time render to dom  ************************/
  componentDidMount() {
    this.getMedia();
    setTimeout(() => {
      if (
        _canAccess(
          this.props.module_name,
          this.props.action,
          "/admin/sms_templates"
        )
      ) {
        const slug = slugify(this.state.name, { delimiter: "-" });
        var postData = { id: this.state.id };
        smsTemplateService.getpage(postData).then((res) => {
          if (res.status === false) {
            notify.error(res.message);
            history.push("/admin/sms_templates");
          } else {
            if (res.result == null) {
              notify.error("Page not found");
              history.push("/admin/sms_templates");
            } else {
              this.setState({
                name: res.result.name,
                initialValue: res.result.template,
                status: res.result.status,
                slug: slug,
              });
            }
          }
        });
      }
    }, 300);
  }

  // Submit Button Handler For Create Page
  handleSubmit(event) {
    this.checkValidation(event);
  }

  checkValidation(event) {
    if (this.validator.allValid()) {
      const slug = slugify(this.state.name, { delimiter: "-" });
      var postData = {
        name: this.state.name,
        slug: slug,
        template: this.state.initialValue,
        status: this.state.status,
        id: this.state.id,
      };
      smsTemplateService.updatepage(postData).then((res) => {
        if (res.status === "error") {
          notify.error(res.message);
        } else {
          notify.success(res.message);
          history.push("/admin/sms_templates");
          event.preventDefault();
        }
      });
    } else {
      this.validator.showMessages();
    }
  }

  // Rendering Html To Dom
  render() {
    if (this.state.selectedMediaFile !== "") {
      var responsive = {
        width: "100%",
        height: "110px",
      };
    } else {
      var responsive = {
        width: "100%",
        height: "160px",
      };
    }
    return (
      <CCard>
        <CCardHeader>
          Edit Page
          <div className="card-header-actions">
            <CTooltip content={globalConstants.BACK_MSG}>
              <CLink
                className="btn btn-danger btn-sm"
                aria-current="page"
                to="/admin/sms_templates"
              >
                {" "}
                <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back
              </CLink>
            </CTooltip>
          </div>
        </CCardHeader>
        <CCardBody>
          <CFormGroup>
            <CLabel htmlFor="nf-name">Name</CLabel>
            <CInput
              type="text"
              id="name"
              name="name"
              placeholder="Enter Name"
              autoComplete="name"
              onChange={this.handleChange}
              value={this.state.name}
            />
            <CFormText className="help-block">
              {this.validator.message("name", this.state.name, "required", {
                className: "text-danger",
              })}
            </CFormText>
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="nf-name">Slug</CLabel>
            <CInput
              type="text"
              name="slug"
              id="slug"
              placeholder="Enter Slug"
              value={slugify(this.state.name, { delimiter: "-" })}
              onChange={this.handleChange}
            />
            <CFormText className="help-block"></CFormText>
          </CFormGroup>

          <CFormGroup>
            <CLabel htmlFor="nf-name"> Description</CLabel>
            <div id="myModal" className="modal1">
              <div className="modal-content1">
                <CModalHeader closeButton>
                  <CModalTitle>Select or Upload Media </CModalTitle>
                </CModalHeader>
                <CModalBody>
                  <CTabs
                    activeTab={this.state.activeTab}
                    onActiveTabChange={(idx) => this.setActiveTab(idx)}
                  >
                    <CNav variant="tabs">
                      <CNavItem>
                        <CNavLink>Upload Files</CNavLink>
                      </CNavItem>
                      <CNavItem>
                        <CNavLink>Media Library</CNavLink>
                      </CNavItem>
                    </CNav>
                    <CTabContent>
                      <CTabPane>
                        <Dropzone
                          getUploadParams={this.getUploadParams}
                          onChangeStatus={this.handleChangeStatus}
                          styles={{
                            dropzone: {
                              overflow: "auto",
                              height: "380px",
                              marginTop: "-1px",
                              borderTopWidth: "0px",
                              borderWidth: "1px",
                              borderRadius: "0px",
                            },
                            inputLabel: { color: "#c4c9d0" },
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
                        <CRow>
                          <CCol
                            xl={this.state.selectedMediaFile !== "" ? 9 : 12}
                          >
                            <CRow className="pt-4 media-popup">
                              {this.state.media.length > 0 &&
                                this.state.media.map((u, index) => (
                                  <CCol xs="12" sm="6" lg="3" key={index}>
                                    <div
                                      className="card bg-gradient-info text-white"
                                      style={responsive}
                                    >
                                      <img
                                        className="sortCls mediaLibrary"
                                        id={u._id}
                                        onError={this.addDefaultSrc}
                                        src={`${
                                          process.env.REACT_APP_API_URL +
                                          "uploads/media/" +
                                          u.media_path
                                        }`}
                                        alt="Media Image"
                                        onClick={(event) => {
                                          this.selectMedia(u._id, u.media_path);
                                        }}
                                      />
                                    </div>
                                  </CCol>
                                ))}
                            </CRow>
                          </CCol>
                          {this.state.selectedMediaFile !== "" && (
                            <CCol xl={3}>
                              <img
                                className="mt-4 mediaLibraryPreview"
                                onError={this.addDefaultSrc}
                                src={`${
                                  process.env.REACT_APP_API_URL +
                                  "uploads/media/" +
                                  this.state.selectedMediaFile
                                }`}
                                alt="Media Image"
                              />
                              <CFormGroup>
                                <CLabel className="mt-3">Alt Text</CLabel>
                                <CInput
                                  type="text"
                                  id="media_alt_text"
                                  name="media_alt_text"
                                  placeholder="Alt Text"
                                  autoComplete="media_alt_text"
                                  value={this.state.media_alt_text}
                                  onChange={this.handleChange}
                                />
                              </CFormGroup>
                              <CFormGroup>
                                <div style={{ display: "flex" }}>
                                  <div className="mr-2">
                                    Height
                                    <CInput
                                      type="text"
                                      id="media_height"
                                      name="media_height"
                                      placeholder="Height"
                                      autoComplete="media_height"
                                      value={this.state.media_height}
                                      onChange={this.handleChange}
                                    />
                                  </div>
                                  <div>
                                    Width
                                    <CInput
                                      type="text"
                                      id="media_width"
                                      name="media_width"
                                      placeholder="Width "
                                      autoComplete="media_width"
                                      value={this.state.media_width}
                                      onChange={this.handleChange}
                                    />
                                  </div>
                                </div>
                                <small>
                                  <strong>Note:</strong> Height & Width can be
                                  percentage or pixel. E.g. height:10px,
                                  width:10px{" "}
                                </small>
                              </CFormGroup>
                            </CCol>
                          )}
                        </CRow>
                      </CTabPane>
                    </CTabContent>
                  </CTabs>
                </CModalBody>
                <CModalFooter>
                  <CButton color="primary" onClick={this._handleApplyAction}>
                    Select
                  </CButton>
                  <CButton
                    color="danger"
                    onClick={() => {
                      this._handleDeletePopup();
                    }}
                  >
                    Delete
                  </CButton>
                  <CButton
                    color="secondary"
                    onClick={() => {
                      this._handleCancelAction();
                    }}
                  >
                    Cancel
                  </CButton>
                </CModalFooter>
              </div>
              <div className="deletepopup-container">
                <CModal
                  show={this.state._openPopupConfrim}
                  onClose={() => {
                    this.setState({
                      _openPopupConfrim: !this.state._openPopupConfrim,
                    });
                  }}
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
                    <CButton
                      color="danger"
                      onClick={() => this._handleDeleteAction()}
                    >
                      Delete
                    </CButton>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        this.setState({ _openPopupConfrim: false });
                      }}
                    >
                      Cancel
                    </CButton>
                  </CModalFooter>
                </CModal>
              </div>
            </div>
            <input
              id="my-file"
              type="file"
              name="my-file"
              style={{ display: "none" }}
            />
            <Editor
              apiKey="ovyr2unz01dy6h1yzrkiga2ptd9z0nbuzwgpa8634x2k6z7j"
              // initialValue={this.state.initialValue}
              value={this.state.initialValue}
              init={{
                placeholder: "Enter Description",

                height: 500,
                plugins: [
                  "advlist autolink lists link  charmap print preview anchor ",
                  "searchreplace wordcount visualblocks code fullscreen",
                  "insertdatetime media table  paste code",
                ],

                toolbar:
                  "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link myCustomToolbarButton ",

                file_browser_callback_types: "image",

                file_picker_callback: function (callback, value, meta) {
                  if (meta.filetype == "image") {
                    var input = document.getElementById("my-file");
                    input.click();
                    input.onchange = function () {
                      var file = input.files[0];
                      var reader = new FileReader();
                      reader.onload = function (e) {
                        callback(e.target.result, {
                          alt: file.name,
                        });
                      };
                      reader.readAsDataURL(file);
                    };
                  }
                },
                paste_data_images: true,

                setup: function (editor) {
                  var modal = document.getElementById("myModal");
                  // Get the <span> element that closes the modal
                  var span = document.getElementsByClassName("close")[0];

                  editor.ui.registry.addButton("myCustomToolbarButton", {
                    icon: "gallery",
                    tooltip: "Insert images",
                    onAction: function () {
                      modal.style.display = "block";
                      // When the user clicks on <span> (x), close the modal
                      span.onclick = function () {
                        modal.style.display = "none";
                      };

                      // When the user clicks anywhere outside of the modal, close it
                      window.onclick = function (event) {
                        if (event.target == modal) {
                          modal.style.display = "none";
                        }
                      };
                    },
                  });
                },
              }}
              onEditorChange={this.handleEditorChange}
            />
            <CFormText className="help-block">
              {this.validator.message(
                "description ",
                this.state.initialValue,
                "required",
                { className: "text-danger" }
              )}
            </CFormText>
          </CFormGroup>

          <CFormGroup row>
            <CCol tag="label" sm="1" className="col-form-label">
              Status
            </CCol>

            <CCol sm="11">
              <CFormGroup variant="custom-checkbox" inline>
                {this.state.status && (
                  <CSwitch
                    className="mr-1"
                    color="primary"
                    name="status"
                    value={this.state.status}
                    defaultChecked
                    onChange={this.handleChange}
                  />
                )}

                {this.state.status === false && (
                  <CSwitch
                    className="mr-1"
                    color="primary"
                    name="status"
                    value={this.state.status}
                    onChange={this.handleChange}
                  />
                )}
              </CFormGroup>
            </CCol>
          </CFormGroup>
        </CCardBody>
        <CCardFooter>
          <CButton
            type="button"
            size="sm"
            color="primary"
            onClick={this.handleSubmit}
          >
            {" "}
            <FontAwesomeIcon icon={faSave} className="mr-1" /> Submit
          </CButton>
          &nbsp;
          <CLink
            className="btn btn-danger btn-sm"
            aria-current="page"
            to="/admin/sms_templates"
          >
            {" "}
            <FontAwesomeIcon icon={faBan} className="mr-1" /> Cancel
          </CLink>
        </CCardFooter>
      </CCard>
    );
  }
}
// Export out Class component
export default SMS_Template_Edit;
