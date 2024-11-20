import React from "react";

import {
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CLink,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
} from "@coreui/react";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  _canAccess,
  _loginUsersDetails,
  history,
  notify,
} from "../../../../_helpers/index";
import Business_Customers_Details from "./Business_Customers_Details";
import Business_Customers_Transactions_Report from "./Business_Customers_Transactions_Report";
import Business_Customers_Schedule_Payments from "./Business_Customers_Schedule_Payments";
import Business_Customers_Recurring_Payments from "./Business_Customers_Recurring_Payments";
import Business_Customers_Withdraw_Requests from "./Business_Customers_Withdraw_Requests";
import Business_Customers_Manual_Topup_Requests from "./Business_Customers_Manual_Topup_Requests";

class Business_Customers_Details_Report extends React.Component {
  constructor(props) {
    super(props);
    const { state } = this.props.location || {};
    const initialRoute = state?.route || "basic_details";
    this.state = {
      initialRoute, // Preserve the initial route
      activeTab: this.props.match.params.typeId,
      countryData: [],
      customerDetails: [],
    };
    if (this.props._renderAccess === false) {
      notify.error("Access Denied Contact to Super User");
      history.push("/admin/business_customers");
    }
  }

  componentDidMount() {}

  handleTabClick = (tab) => {
    if (this.state.activeTab !== tab) {
      history.push({
        pathname: `/admin/business_customers/${this.props.match.params.account_number}/${tab}`,
        state: {
          ...this.props.location.state,
          route: tab,
        },
      });
      this.setState({ activeTab: tab });
    }
  };

  getBackRoute = () => {
    const { initialRoute } = this.state;
    switch (initialRoute) {
      case "pending_kyc":
        return "/admin/business_customers/pending_kyc";
      case "admin_approval":
        return "/admin/business_customers/admin_approval";
      case "basic_details":
      default:
        return "/admin/business_customers";
    }
  };

  render() {
    const { state } = this.props.location || {};
    const mobile_number = state?.mobile_number;
    const { activeTab } = this.state;

    const backRoute = this.getBackRoute();
    return (
      <>
        <CCard>
          <CCardHeader>
            <CNav variant="tabs">
              <CNavItem>
                <CNavLink
                  active={activeTab === "basic_details"}
                  onClick={() => this.handleTabClick("basic_details")}
                >
                  Details
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === "transaction_details"}
                  onClick={() => this.handleTabClick("transaction_details")}
                >
                  Transaction Details
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === "schedule_details"}
                  onClick={() => this.handleTabClick("schedule_details")}
                >
                  Schedule Details
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === "recurring_details"}
                  onClick={() => this.handleTabClick("recurring_details")}
                >
                  Recurring Details
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === "withdraw_request_details"}
                  onClick={() =>
                    this.handleTabClick("withdraw_request_details")
                  }
                >
                  Withdraw Request Details
                </CNavLink>
              </CNavItem>
              <CNavItem>
                <CNavLink
                  active={activeTab === "manual_topup_request_details"}
                  onClick={() =>
                    this.handleTabClick("manual_topup_request_details")
                  }
                >
                  Manual Topup Request Details
                </CNavLink>
              </CNavItem>
            </CNav>
          </CCardHeader>
          <CCardBody>
            <CTabContent>
              <CTabPane active={activeTab === "basic_details"}>
                {activeTab === "basic_details" && (
                  <Business_Customers_Details
                    mobile_number={mobile_number}
                    account_number={this.props.match.params.account_number}
                    activeTab={activeTab}
                  />
                )}
              </CTabPane>
              <CTabPane active={activeTab === "transaction_details"}>
                {activeTab === "transaction_details" && (
                  <Business_Customers_Transactions_Report
                    account_number={this.props.match.params.account_number}
                    activeTab={activeTab}
                  />
                )}
              </CTabPane>
              <CTabPane active={activeTab === "schedule_details"}>
                {activeTab === "schedule_details" && (
                  <Business_Customers_Schedule_Payments
                    account_number={this.props.match.params.account_number}
                    activeTab={activeTab}
                  />
                )}
              </CTabPane>
              <CTabPane active={activeTab === "recurring_details"}>
                {activeTab === "recurring_details" && (
                  <Business_Customers_Recurring_Payments
                    account_number={this.props.match.params.account_number}
                    activeTab={activeTab}
                  />
                )}
              </CTabPane>
              <CTabPane active={activeTab === "withdraw_request_details"}>
                {activeTab === "withdraw_request_details" && (
                  <Business_Customers_Withdraw_Requests
                    account_number={this.props.match.params.account_number}
                    activeTab={activeTab}
                  />
                )}
              </CTabPane>
              <CTabPane active={activeTab === "manual_topup_request_details"}>
                {activeTab === "manual_topup_request_details" && (
                  <Business_Customers_Manual_Topup_Requests
                    account_number={this.props.match.params.account_number}
                    activeTab={activeTab}
                  />
                )}
              </CTabPane>
            </CTabContent>
          </CCardBody>
          <CCardFooter>
            {/* {activeTab === "basic_details" && _canAccess("guides", "update") && (
              <CLink
                className="btn btn-primary btn-sm"
                aria-current="page"
                to={`/admin/business_customers/edit/${this.state.account_number}`}
              >
                {" "}
                <FontAwesomeIcon icon={faEdit} className="mr-1" /> Edit
              </CLink>
            )}{" "} */}
            <CLink
              className="btn btn-danger btn-sm"
              aria-current="page"
              to={backRoute}
            >
              {" "}
              <FontAwesomeIcon icon={faArrowLeft} className="mr-1" /> Back
            </CLink>
          </CCardFooter>
        </CCard>
      </>
    );
  }
}

export default Business_Customers_Details_Report;
