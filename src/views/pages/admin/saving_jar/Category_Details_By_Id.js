import React from "react";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormGroup,
  CRow,
} from "@coreui/react";

import {
  capitalize,
  formatDate,
  history,
  notify,
} from "../../../../_helpers/index";
import { savingJarService } from "services/admin/savings_jar.service";
import "../business_customers/kycTable.css";
import "assets/css/page.css";
import "assets/css/responsive.css";

class CategoryDetailsById extends React.Component {
  constructor(props) {
    super(props);
    const id = this.props.id;
    const detail_type = this.props.activeTab;
    this.state = {
      categoryDetails: [],
      categoryName: "",
      fields: {
        id: +id,
        operation_type: "saving_jar_category_detail",
        detail_type: detail_type,
      },
      _openPopup: false,
      animalImages: [],
      multiaction: [],
    };
    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/saving_jar");
    }
  }

  componentDidMount() {
    this.getJarDetails();
  }

  getJarDetails() {
    savingJarService.savingJarBulkAction(this.state.fields).then((res) => {
      if (!res.success) {
        notify.error(res.message);
        history.push("/admin/saving_jar");
      } else {
        this.setState({
          categoryDetails: res.data,
        });
      }
    });
  }

  render() {
    return (
      <>
        {/* <CCard>
          <CCardBody> */}
        <CRow>
          <CCol xl={12}>
            <CCard>
              <CCardHeader>
                <strong>Category Details</strong>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  <CCol xl={12}>
                    <CFormGroup row>
                      {/* <CCol xs="6">
                            <div style={{ paddingRight: "20px" }}>
                              {this.state.categoryDetails.jar_category_icon !==
                                null &&
                                this.state.categoryDetails.jar_category_icon !==
                                  undefined && (
                                  <>
                                    <img
                                      style={{ borderRadius: "50px" }}
                                      width={100}
                                      height={100}
                                      src={
                                        this.state.categoryDetails
                                          .jar_category_icon
                                          ? this.state.categoryDetails
                                              .jar_category_icon
                                          : "/avatars/default-avatar.png"
                                      }
                                      alt="Profile"
                                    />
                                  </>
                                )}
                            </div>
                          </CCol> */}
                      <CCol xs="6">
                        <p>
                          <b>Sub-account Category Name: </b>
                          {capitalize(
                            this.state.categoryDetails.jar_category_name
                          )}
                        </p>
                        <p>
                          <b>Status: </b>
                          {this.state.categoryDetails.jar_category_status
                            ? "True"
                            : "False"}
                        </p>
                        {this.state.categoryDetails.updated_at && (
                          <p>
                            <b>Updated At: </b>
                            {formatDate(this.state.categoryDetails.updated_at)}
                          </p>
                        )}
                      </CCol>
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        {/* </CCardBody>
        </CCard> */}
      </>
    );
  }
}

export default CategoryDetailsById;
