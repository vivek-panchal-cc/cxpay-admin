import React from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CCollapse,
  CRow,
} from "@coreui/react";
import { notify, history, capitalize } from "../../../../_helpers/index";
import { savingJarService } from "services/admin/savings_jar.service";
import { globalConstants } from "constants/admin/global.constants";
import IconMinus from "assets/icons/IconMinus";
import IconPlus from "assets/icons/IconPlus";

class Category_Wise_Jar_List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fields: {
        id: +this.props.id,
        operation_type: "saving_jar_category_wise_jar_list",
      },
      jar_details: [],
      activeIndex: null,
    };

    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/saving_jar");
    }
  }

  componentDidMount() {
    this.getSavingJarCategoryDetails();
  }

  getSavingJarCategoryDetails() {
    savingJarService.savingJarBulkAction(this.state.fields).then((res) => {
      if (!res.success) {
        // notify.error(res.message);
        this.setState({ jar_details: [] });
      } else {
        this.setState({
          jar_details: res.data,
        });
      }
    });
  }

  toggleAccordion = (index) => {
    this.setState((prevState) => ({
      activeIndex: prevState.activeIndex === index ? null : index,
    }));
  };

  render() {
    const { jar_details, activeIndex } = this.state;
    return (
      <CRow>
        <CCol xl={12}>
          <CCard>
            <CCardHeader>
              <strong>Categories wise Jar Details</strong>
            </CCardHeader>
            <CCardBody>
              <div className="position-relative table-responsive">
                {jar_details && jar_details?.length > 0 ? (
                  jar_details.map((jar, index) => (
                    <CCard key={jar.jar_id} className="mb-3">
                      {/* Accordion Header */}
                      <CCardHeader className="d-flex justify-content-between align-items-center">
                        <CButton
                          style={{ boxShadow: "none" }}
                          block
                          color="link"
                          className="text-left m-0 p-0"
                          onClick={() => this.toggleAccordion(index)}
                        >
                          <strong>{capitalize(jar.jar_name)}</strong>
                        </CButton>
                        <span
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            this.toggleAccordion(index);
                          }}
                        >
                          {activeIndex === index ? <IconMinus /> : <IconPlus />}
                        </span>
                      </CCardHeader>
                      {/* Accordion Content */}
                      <CCollapse show={activeIndex === index}>
                        <CCardBody>
                          <p>
                            <b>Target Amount : </b>
                            {globalConstants.CURRENCY_SYMBOL}&nbsp;
                            {typeof parseFloat(jar.target_amount) === "number"
                              ? parseFloat(jar.target_amount).toFixed(2)
                              : jar.target_amount}
                          </p>
                          <h5>Owner Details</h5>
                          <ul>
                            <li>
                              <strong>Owner Name:</strong>{" "}
                              {jar.owner.owner_name}
                            </li>
                            <li>
                              <strong>Mobile Number:</strong>{" "}
                              {`+${jar.owner.owner_mobile_number}`}
                            </li>
                            <li>
                              <strong>Account Number:</strong>{" "}
                              {jar.owner.owner_account_number}
                            </li>
                            <li>
                              <strong>User Type:</strong>{" "}
                              {capitalize(jar.owner.owner_user_type)}
                            </li>
                          </ul>
                          <h5>Members</h5>
                          {jar.members && jar.members?.length > 0 ? (
                            <div style={{ overflowX: "auto" }}>
                              <table className="table">
                                <thead>
                                  <tr>
                                    <th>#</th>
                                    <th>Member Name</th>
                                    <th>Mobile Number</th>
                                    <th>Account Number</th>
                                    <th>User Type</th>
                                    <th>Request Accepted</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {jar.members.map((member, idx) => (
                                    <tr key={idx}>
                                      <td>{idx + 1}</td>
                                      <td>{member.member_name}</td>
                                      <td>{`+${member.mobile_number}`}</td>
                                      <td>{member.account_number}</td>
                                      <td>{capitalize(member.user_type)}</td>
                                      <td>
                                        {member.request_accept ? "Yes" : "No"}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            <p>No members found.</p>
                          )}
                        </CCardBody>
                      </CCollapse>
                    </CCard>
                  ))
                ) : (
                  <p>No records found</p>
                )}
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    );
  }
}

export default Category_Wise_Jar_List;
