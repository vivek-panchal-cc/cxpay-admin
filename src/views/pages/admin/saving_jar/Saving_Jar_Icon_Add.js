import React, { Component } from "react";
import Dropzone from "react-dropzone";
import {
  CButton,
  CFormGroup,
  CLabel,
  CCardHeader,
  CCard,
  CCardBody,
  CCardFooter,
  CLink,
  CRow,
  CCol,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSave,
  faBan,
  faTrash,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";
import { savingJarService } from "services/admin/savings_jar.service";
import { history, notify } from "../../../../_helpers/index";

class Saving_Jar_Icon_Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      jar_category_icons: [],
    };
  }

  onDrop = (acceptedFiles) => {
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    const validFiles = acceptedFiles.filter((file) => {
      if (!file.name.match(/\.png$/i)) {
        notify.error(`Only .png files are allowed: ${file.name}`);
        return false;
      }
      if (file.size > maxSize) {
        notify.error(`File ${file.name} exceeds 5MB size limit.`);
        return false;
      }
      return true;
    });

    this.setState((prevState) => ({
      jar_category_icons: [...prevState.jar_category_icons, ...validFiles],
    }));
  };

  handleDelete = (index) => {
    this.setState((prevState) => ({
      jar_category_icons: prevState.jar_category_icons.filter(
        (_, i) => i !== index
      ),
    }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.jar_category_icons.length === 0) {
      notify.error("Please upload at least one icon.");
      return;
    }
    let formData = new FormData();
    formData.append("operation_type", "saving_jar_icon_add");
    this.state.jar_category_icons.forEach((file, index) => {
      formData.append(`icon[${index}]`, file);
    });

    savingJarService.savingJarIconAdd(formData).then((res) => {
      if (!res.success) {
        notify.error(res.message);
      } else {
        notify.success(res.message);
        this.setState({ jar_category_icons: [] });
        history.push("/admin/saving_jar_icon");
      }
    });
  };

  render() {
    return (
      <CRow>
        <CCol xs="12">
          <CCard>
            <CCardHeader>
              <strong>Add Saving Jar Icons</strong>
            </CCardHeader>
            <CCardBody>
              <CFormGroup>
                {/* <CLabel>Jar Category Icons</CLabel> */}
                <Dropzone onDrop={this.onDrop} accept={{ image: [".png"] }}>
                  {({ getRootProps, getInputProps, isDragActive }) => (
                    <div
                      {...getRootProps()}
                      style={{
                        border: "2px dashed #007bff",
                        padding: "30px",
                        textAlign: "center",
                        cursor: "pointer",
                        borderRadius: "10px",
                        background: isDragActive ? "#e9f5ff" : "#f8f9fa",
                        transition: "background 0.3s ease-in-out",
                      }}
                    >
                      <input {...getInputProps()} />
                      <FontAwesomeIcon
                        icon={faUpload}
                        size="2x"
                        color="#007bff"
                      />
                      <p
                        style={{
                          color: "#007bff",
                          fontWeight: "bold",
                          marginTop: "10px",
                        }}
                      >
                        Click to upload or drag & drop PNG icons here
                      </p>
                    </div>
                  )}
                </Dropzone>

                {/* Display Uploaded Images */}
                <div
                  style={{
                    marginTop: "15px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                  }}
                >
                  {this.state.jar_category_icons.map((file, index) => (
                    <div
                      key={index}
                      style={{
                        position: "relative",
                        display: "inline-block",
                        width: "60px",
                      }}
                    >
                      <img
                        src={URL.createObjectURL(file)}
                        alt={`icon-${index}`}
                        width={60}
                        height={60}
                        style={{
                          borderRadius: "5px",
                          border: "1px solid #ddd",
                          padding: "5px",
                        }}
                      />
                      {/* Delete Button */}
                      <button
                        onClick={() => this.handleDelete(index)}
                        style={{
                          position: "absolute",
                          top: "-8px",
                          right: "-8px",
                          background: "red",
                          color: "white",
                          border: "none",
                          borderRadius: "50%",
                          cursor: "pointer",
                          width: "20px",
                          height: "20px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "12px",
                        }}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  ))}
                </div>
              </CFormGroup>
            </CCardBody>
            <CCardFooter>
              <CButton size="sm" color="primary" onClick={this.handleSubmit}>
                <FontAwesomeIcon icon={faSave} className="mr-1" /> Submit
              </CButton>
              &nbsp;
              <CLink
                className="btn btn-danger btn-sm"
                to="/admin/saving_jar_icon"
              >
                <FontAwesomeIcon icon={faBan} className="mr-1" /> Cancel
              </CLink>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    );
  }
}

export default Saving_Jar_Icon_Add;
