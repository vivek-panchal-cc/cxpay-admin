import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from "@coreui/react";
import { useLocation } from "react-router-dom";

import $ from "jquery";
import { menuPermission } from "../_helpers/common-utility";

// sidebar nav config
import navigation from "./_nav";

const TheSidebar = (props) => {
  const dispatch = useDispatch();
  const show = useSelector((state) => state.theme.sidebarShow);
  const location = useLocation();
  var permissions_navigations = menuPermission(navigation);
  setTimeout(() => {
    $(".c-sidebar-nav-link.c-active").removeClass("c-active");
    $("#" + location.pathname.split("/")[2] + "_sidebar_id").addClass(
      "c-active"
    );
  }, 200);
  const sidebarNavStyle = {
    overflowY: "auto", /* Enable vertical scrollbar */
    scrollbarWidth: "none", /* Width of the scrollbar */
    scrollbarColor: "#3c4b64 #3c4b64", /* Color of the scrollbar thumb and track */
    scrollbarTrackColor: "#3c4b64", /* Color of the scrollbar track */
    scrollbarTrackHoverColor: "#3c4b64", /* Color of the scrollbar track on hover */
    scrollbarHandleColor: "#3c4b64", /* Color of the scrollbar handle */
    scrollbarHandleHoverColor: "#3c4b64", /* Color of the scrollbar handle on hover */
    scrollbarCornerColor: "transparent", /* Color of the scrollbar corner */
  };

  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="dashboard">
        <img
          src={require("assets/img/cxpay_me_logo.png").default}
          className="cc-logo-styles"
        />
        {/* <CIcon
          className="c-sidebar-brand-full"
          name="logo-negative"
          height={35}
        />
        <CIcon
          className="c-sidebar-brand-minimized"
          name="sygnet"
          height={35}
        /> */}
      </CSidebarBrand>
      <CSidebarNav style={sidebarNavStyle}>
        <CCreateElement
          items={permissions_navigations}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle,
          }}
        />
      </CSidebarNav>

      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  );
};

export default React.memo(TheSidebar);
