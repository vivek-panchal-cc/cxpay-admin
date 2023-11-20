import React from "react";
import CIcon from "@coreui/icons-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUser,
  faUserFriends,
  faCogs,
  faFileAlt,
  faRupeeSign,
  faEnvelope,
  faSms,
  faBell,  
  faUsers,
  faBuilding,
  faClipboardList,
  faChartBar,
  faBook,
  faMoneyBill,
  faReceipt,
  faListAlt,
  faHandHoldingUsd,
  faWallet,
  faUserTie,
  faStopwatch,
  faSyncAlt
} from "@fortawesome/free-solid-svg-icons";
import IconFlorin from "assets/icons/IconFlorin";

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
    // icon: <FontAwesomeIcon icon={faRupeeSign} className="c-sidebar-nav-icon" />,    
    icon: <IconFlorin className="c-sidebar-nav-icon" />,    
    module_name: "fee_management",
    id: "fee_management_sidebar_id",
    // id: "fees_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Admin Users",
    to: "/admin/users",
    icon: (
      <FontAwesomeIcon icon={faUsers} className="c-sidebar-nav-icon" />
    ),
    module_name: "users",
    id: "users_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Business Customers",
    to: "/admin/business_customers",
    icon: (
      <FontAwesomeIcon icon={faBuilding} className="c-sidebar-nav-icon" />
    ),
    module_name: "business_customers",
    id: "business_customers_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Personal Customers",
    to: "/admin/personal_customers",
    icon: (
      <FontAwesomeIcon icon={faUser} className="c-sidebar-nav-icon" />
    ),
    module_name: "personal_customers",
    id: "personal_customers_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Agent Customers",
    to: "/admin/agent_customers",
    icon: <FontAwesomeIcon icon={faUserTie} className="c-sidebar-nav-icon" />,
    module_name: "agent_customers",
    id: "agent_customers_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Email Templates",
    to: "/admin/email_templates",
    icon: <FontAwesomeIcon icon={faEnvelope} className="c-sidebar-nav-icon" />,
    module_name: "email_templates",
    id: "email_templates_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "SMS Templates",
    to: "/admin/sms_templates",
    icon: <FontAwesomeIcon icon={faSms} className="c-sidebar-nav-icon" />,
    module_name: "sms_templates",
    id: "sms_templates_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "CMS Pages",
    to: "/admin/cms_pages",
    icon: <FontAwesomeIcon icon={faBook} className="c-sidebar-nav-icon" />,
    module_name: "cms_pages",
    id: "cms_pages_sidebar_id",
    // id: "cms_templates_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Schedule Payments",
    to: "/admin/schedule_payments",
    icon: <FontAwesomeIcon icon={faStopwatch} className="c-sidebar-nav-icon" />,
    module_name: "schedule_payments",
    id: "schedule_payments_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Recurring Payments",
    to: "/admin/recurring_payments",
    icon: <FontAwesomeIcon icon={faSyncAlt} className="c-sidebar-nav-icon" />,
    module_name: "recurring_payments",
    id: "recurring_payments_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Push Notifications",
    to: "/admin/notifications",
    icon: <FontAwesomeIcon icon={faBell} className="c-sidebar-nav-icon" />,
    module_name: "notifications",
    id: "notifications_sidebar_id",
    // id: "push_notification_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Customers Reports",
    to: "/admin/customer_reports",
    icon: <FontAwesomeIcon icon={faClipboardList} className="c-sidebar-nav-icon" />,
    module_name: "customer_reports",
    id: "customer_reports_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Transaction Reports",
    to: "/admin/transaction_reports",
    icon: <FontAwesomeIcon icon={faWallet} className="c-sidebar-nav-icon" />,
    module_name: "transaction_reports",
    id: "transaction_reports_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Withdraw Requests",
    to: "/admin/withdraw_requests",
    icon: <FontAwesomeIcon icon={faMoneyBill} className="c-sidebar-nav-icon" />,
    module_name: "withdraw_requests",
    id: "withdraw_requests_sidebar_id",
  },
  {
    _tag: "CSidebarNavItem",
    name: "Manual Topup Requests",
    to: "/admin/manual_requests",
    icon: <FontAwesomeIcon icon={faHandHoldingUsd} className="c-sidebar-nav-icon" />,
    module_name: "manual_requests",
    id: "manual_requests_sidebar_id",
  },
];

export default _nav;
