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
  return (
    <CSidebar
      show={show}
      onShowChange={(val) => dispatch({ type: "set", sidebarShow: val })}
    >
      <CSidebarBrand className="d-md-down-none" to="/">
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
      <CSidebarNav>
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
