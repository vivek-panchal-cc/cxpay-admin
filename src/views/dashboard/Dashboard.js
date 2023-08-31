import {
  CCard,
  CCardBody,
  CCardText,
  CCardTitle,
  CCol,
  CRow,
} from "@coreui/react";
import React from "react";
import { dashboardService } from "../../services/admin/dashboard.service";
import { notify } from "../../_helpers/index";
import { setLoading } from "../../_helpers/";
import "./dashboard.css";

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      total_individuals: 0,
      active_individuals: 0,
      inactive_individuals: 0,
      business_customer_total: 0,
      transaction_total: 0,
      active_business: 0,
      inactive_business: 0,
      total_credit_amount: 0,
      total_debit_amount: 0,
      total_customers: 0,
      currentMonth: null,
    };
  }

  componentDidMount() {
    if (
      this.props.location.state !== undefined &&
      this.props.location.state !== null
    ) {
      window.history.replaceState("page", "");
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
    var today = new Date();
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();

    today = mm + "/" + yyyy;
    this.setState({ currentMonth: today });
    this.getDashboardDetails();
  }

  getDashboardDetails() {
    setLoading(true);
    dashboardService.getDetails().then((res) => {
      if (res.status === false) {
        notify.error(res.message);
        setLoading(false);
      } else {
        this.setState({
          total_individuals: res.data.total_individuals,
          active_individuals: res.data.active_individuals,
          inactive_individuals: res.data.inactive_individuals,
          business_customer_total: res.data.total_business,
          transaction_total: res.data.transaction_total,
          active_business: res.data.active_business,
          inactive_business: res.data.inactive_business,
          total_credit_amount: res.data.total_credit_amount,
          total_debit_amount: res.data.total_debit_amount,
          total_customers: res.data.total_customers,
        });
        setLoading(false);
      }
    });
  }

  render() {
    return (
      <>
        <CRow>
          <CCol sm={4}>
            <CCard color="primary" className="dashboard-card">
              <CCardBody>
                <CCardTitle className="dashboard-card-title">
                  Total Customers
                </CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    {this.state.total_customers
                      ? this.state.total_customers
                      : "0"}
                  </h4>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={4}>
            <CCard color="info" className="dashboard-card">
              <CCardBody>
                <CCardTitle className="dashboard-card-title">
                  Personal Customers
                </CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    {this.state.total_individuals
                      ? this.state.total_individuals
                      : "0"}
                  </h4>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={4}>
            <CCard
              style={{ backgroundColor: "rgb(61, 28, 189, 0.61) !important" }}
              className="transaparent-card"
            >
              <CCardBody>
                <CCardTitle className="dashboard-card-title">
                  Business Customers
                </CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    {this.state.business_customer_total
                      ? this.state.business_customer_total
                      : "0"}
                  </h4>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CRow>
          <CCol sm={4}>
            <CCard color="warning" className="dashboard-card">
              <CCardBody>
                <span className="float-right">
                  <h5>{this.state.currentMonth}</h5>
                </span>
                <CCardTitle className="dashboard-card-title">
                  Monthly Credited Amount
                </CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    ANG{" "}
                    {this.state.total_credit_amount
                      ? this.state.total_credit_amount
                      : "0"}
                  </h4>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm={4}>
            <CCard color="danger" className="dashboard-card">
              <CCardBody>
                <span className="float-right">
                  <h5>{this.state.currentMonth}</h5>
                </span>
                <CCardTitle className="dashboard-card-title">
                  Monthly Debited Amount
                </CCardTitle>
                <CCardText>
                  <h4 className="dashboard-card-number">
                    ANG{" "}
                    {this.state.total_debit_amount
                      ? this.state.total_debit_amount
                      : "0"}
                  </h4>
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default Dashboard;
