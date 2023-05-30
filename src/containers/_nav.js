import React from "react";
import CIcon from "@coreui/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUser,
  faUserFriends,
  faCogs,
  faFileAlt,
  faRupeeSign,
} from "@fortawesome/free-solid-svg-icons";

const _nav = [
  {
    _tag: "CSidebarNavItem",
    name: "Dashboard",
    to: "/admin/dashboard",
    icon: <CIcon name="cil-speedometer" customClasses="c-sidebar-nav-icon" />,
    module_name: "dashboard",
    id: "dashboard_sidebar_id",
  },
  // {
  //   _tag: "CSidebarNavItem",
  //   name: "Settings",
  //   to: "/admin/settings",
  //   icon: <FontAwesomeIcon icon={faCogs} className="c-sidebar-nav-icon" />,
  //   module_name: "settings",
  //   id: "settings_sidebar_id",
  // },
  {
    _tag: "CSidebarNavItem",
    name: "Modules Management",
    to: "/admin/system_modules",
    icon: <FontAwesomeIcon icon={faCogs} className="c-sidebar-nav-icon" />,
    module_name: "system_modules",
    id: "system_modules_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Groups Management",
    to: "/admin/user_groups",
    icon: (
      <FontAwesomeIcon icon={faUserFriends} className="c-sidebar-nav-icon" />
    ),
    module_name: "user_groups",
    id: "user_groups_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Fees Management",
    to: "/admin/fee_management",
    icon: <FontAwesomeIcon icon={faRupeeSign} className="c-sidebar-nav-icon" />,
    module_name: "fee_management",
    id: "fees_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Admin Users",
    to: "/admin/users",
    icon: (
      <FontAwesomeIcon icon={faUserFriends} className="c-sidebar-nav-icon" />
    ),
    module_name: "users",
    id: "users_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Business Customers",
    to: "/admin/business_customers",
    icon: (
      <FontAwesomeIcon icon={faUserFriends} className="c-sidebar-nav-icon" />
    ),
    module_name: "business_customers",
    id: "business_customers_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Personal Customers",
    to: "/admin/personal_customers",
    icon: (
      <FontAwesomeIcon icon={faUserFriends} className="c-sidebar-nav-icon" />
    ),
    module_name: "personal_customers",
    id: "personal_customers_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Email Templates",
    to: "/admin/email_templates",
    icon: <FontAwesomeIcon icon={faFileAlt} className="c-sidebar-nav-icon" />,
    module_name: "email_templates",
    id: "email_templates_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "SMS Templates",
    to: "/admin/sms_templates",
    icon: <FontAwesomeIcon icon={faFileAlt} className="c-sidebar-nav-icon" />,
    module_name: "sms_templates",
    id: "sms_templates_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "CMS Pages",
    to: "/admin/cms_pages",
    icon: <FontAwesomeIcon icon={faFileAlt} className="c-sidebar-nav-icon" />,
    module_name: "cms_pages",
    id: "cms_templates_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Push Notification",
    to: "/admin/notifications",
    icon: <FontAwesomeIcon icon={faFileAlt} className="c-sidebar-nav-icon" />,
    module_name: "notifications",
    id: "push_notification_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Customers Reports",
    to: "/admin/customer_reports",
    icon: <FontAwesomeIcon icon={faFileAlt} className="c-sidebar-nav-icon" />,
    module_name: "customer_reports",
    id: "customer_reports_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Transaction Reports",
    to: "/admin/transaction_reports",
    icon: <FontAwesomeIcon icon={faFileAlt} className="c-sidebar-nav-icon" />,
    module_name: "transaction_reports",
    id: "transaction_reports_sidebar_id",
  },
];

export default _nav;
