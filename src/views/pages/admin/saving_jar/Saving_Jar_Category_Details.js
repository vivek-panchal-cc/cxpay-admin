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
import { history, notify } from "../../../../_helpers/index";
import CategoryDetailsById from "./Category_Details_By_Id";
import CategoryWiseJarList from "./Category_Wise_Jar_List";

class Saving_Jar_Category_Details extends React.Component {
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
      history.push("/admin/saving_jar");
    }
  }

  componentDidMount() {}

  handleTabClick = (tab) => {
    if (this.state.activeTab !== tab) {
      history.push({
        pathname: `/admin/saving_jar/${this.props.match.params.id}/${tab}`,
        state: {
          ...this.props.location.state,
          // route: tab,
        },
      });
      this.setState({ activeTab: tab });
    }
  };

  getBackRoute = () => {
    const { initialRoute } = this.state;
    switch (initialRoute) {
      case "basic_details":
      default:
        return "/admin/saving_jar";
    }
  };

  render() {
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
                  active={activeTab === "jar_details"}
                  onClick={() => this.handleTabClick("jar_details")}
                >
                  Sub-account Details
                </CNavLink>
              </CNavItem>
            </CNav>
          </CCardHeader>
          <CCardBody>
            <CTabContent>
              <CTabPane active={activeTab === "basic_details"}>
                {activeTab === "basic_details" && (
                  <CategoryDetailsById
                    id={this.props.match.params.id}
                    activeTab={activeTab}
                  />
                )}
              </CTabPane>
              <CTabPane active={activeTab === "jar_details"}>
                {activeTab === "jar_details" && (
                  <CategoryWiseJarList
                    id={this.props.match.params.id}
                    activeTab={activeTab}
                  />
                )}
              </CTabPane>
            </CTabContent>
          </CCardBody>
          <CCardFooter>
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

export default Saving_Jar_Category_Details;
