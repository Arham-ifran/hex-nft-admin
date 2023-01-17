//importing layouts....
import Admin from 'layouts/Admin';
import UnAuth from 'layouts/Auth';

import Dashboard from "views/Dashboard.js";
import Login from "./views/Login/Login";
import Categories from "./views/Categories/Categories";
import Users from "./views/Users/Users"
import Collections from "./views/Collection/Collections"
import SiteSettings from "views/Settings/SiteSettings";
import SocialSettings from "views/Settings/SocialSettings";
import NftsSettings from "views/Settings/NftsSettings";
import Faq from "views/Faq/Faq";
import AddFaq from "views/Faq/AddFaq"
import EditFaq from 'views/Faq/EditFaq';
import EmailTemplates from "views/EmailTemplates/EmailTemplates";
import Profile from 'views/Profile/profile'
import Unauth from 'layouts/Auth';
import Nfts from 'views/Nfts/Nfts';
import Nft from 'views/Nfts/Nft'
import LiveAuctions from 'views/LiveAuctions/LiveAuctions';
import Collection from 'views/Collection/Collection';
import EmailTemplate from 'views/EmailTemplates/EmailTemplate';
import ForgotPassword from 'views/ForgotPassword/ForgotPassword';
import ResetPassword from 'views/ResetPassword/ResetPassword';
import Contacts from 'views/Contacts/Contacts';
import Activity from 'views/Activity/Activity';
import Permissions from 'views/AdminStaff/permissions/permissionsListingComponent'
import Staff from 'views/AdminStaff/staff/staffListingComponent'
import ContentManagement from 'views/ContentManagment/contentManagement';
import AddContentPage from 'views/ContentManagment/addContentPage'
import NftReportings from 'views/NftReportings/nftReportings'
import NewsLetter from 'views/Newsletter/listSubscriptions'

var routes = [
  {
    path: "/",
    layout: Unauth,
    name: "Login",
    icon: "nc-icon nc-chart-pie-35",
    access: true,
    exact: true,
    component: Login
  },
  {
    path: "/dashboard",
    layout: Admin,
    name: "Dashboard",
    icon: "nc-icon nc-chart-pie-35",
    access: true,
    exact: true,
    component: Dashboard,
    showInSideBar: true
  },
  {
    path: "/profile",
    layout: Admin,
    name: "Profile",
    icon: "nc-icon nc-circle-09",
    access: true, exact: true,
    component: Profile,
    showInSideBar: false,
  },
  {
    collapse: true,
    name: "Admin Staff",
    state: "openAdminStaff",
    icon: "nc-icon nc-grid-45",
    showInSideBar: true,
    submenus: [
      {
        path: "/permissions",
        layout: Admin,
        name: "Permissions",
        icon: "nc-icon nc-grid-45",
        access: true, exact: true,
        component: Permissions,
        showInSideBar: true,
      },
      {
        path: "/staff",
        layout: Admin,
        name: "Staff",
        icon: "nc-icon nc-grid-45",
        access: true, exact: true,
        component: Staff,
        showInSideBar: true,
      },
      // {
      //   path: "/live-auctions",
      //   layout: Admin,
      //   name: "NFTs Auctions",
      //   mini: "NA",
      //   icon: "nc-icon nc-grid-45",
      //   access: true, exact: true,
      //   component: LiveAuctions,
      //   showInSideBar: true,
      // }
    ],
  },

  // {
  //   path: "/admin/staff",
  //   layout: Admin,
  //   name: "Permissions",
  //   icon: "nc-icon nc-circle-09",
  //   access: true, exact: true,
  //   component: Permissions,
  //   showInSideBar: true,
  // },
  {
    path: "/users",
    layout: Admin,
    name: "Users",
    icon: "nc-icon nc-single-02",
    access: true, exact: true,
    component: Users,
    showInSideBar: true,
  },
  // {
  //   path: "/roles",
  //   layout: Admin,
  //   name: "Roles & Permissions",
  //   icon: "nc-icon nc-single-02",
  //   access: true, exact: true,
  //   component: Roles,
  //   showInSideBar: true,
  // },
  {
    path: "/categories",
    layout: Admin,
    name: "Categories",
    icon: "nc-icon nc-bullet-list-67",
    access: true, exact: true,
    component: Categories,
    showInSideBar: true
  },
  {
    path: "/collections",
    layout: Admin,
    name: "Collections",
    icon: "nc-icon nc-cart-simple",
    access: true, exact: true,
    component: Collections,
    showInSideBar: true,
  },
  {
    path: "/collection/:collectionId",
    layout: Admin,
    name: "Collection",
    icon: "nc-icon nc-cart-simple",
    access: true, exact: true,
    component: Collection,
  },
  {
    collapse: true,
    name: "NFTs",
    state: "openProducts",
    icon: "nc-icon nc-grid-45",
    showInSideBar: true,
    submenus: [
      {
        path: "/nfts",
        layout: Admin,
        name: "All NFTs",
        mini: "AN",
        icon: "nc-icon nc-grid-45",
        access: true, exact: true,
        component: Nfts,
        showInSideBar: true,
      },
      {
        path: "/live-auctions",
        layout: Admin,
        name: "NFTs Auctions",
        mini: "NA",
        icon: "nc-icon nc-grid-45",
        access: true, exact: true,
        component: LiveAuctions,
        showInSideBar: true,
      },
      {
        path: "/nft-reports",
        layout: Admin,
        name: "NFTs Reporting",
        icon: "nc-icon nc-bulb-63",
        access: true, exact: true,
        component: NftReportings,
        showInSideBar: true,
      },
    ],
  },

  {
    path: "/nft/:nftId",
    layout: Admin,
    name: "NFTs",
    icon: "nc-icon nc-grid-45",
    access: true, exact: true,
    component: Nft,
    showInSideBar: false,
  },

  // {
  //   path: "/live-auctions",
  //   layout: Admin,
  //   name: "Live Auctions",
  //   icon: "nc-icon nc-money-coins",
  //   access: true, exact: true,
  //   component: LiveAuctions,
  //   showInSideBar: true,
  // },
  {
    path: "/email-templates",
    layout: Admin,
    name: "Email Templates",
    icon: "nc-icon nc-email-83",
    access: true, exact: true,
    component: EmailTemplates,
    showInSideBar: true,
  },
  {
    path: "/email-template/:emailId",
    layout: Admin,
    name: "Email Template",
    icon: "nc-icon nc-cart-simple",
    access: true, exact: true,
    component: EmailTemplate,
  },
  {
    path: "/faq",
    layout: Admin,
    name: "FAQS",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: Faq,
    showInSideBar: true,
  },
  {
    path: "/add-faq",
    layout: Admin,
    name: "Add Faq",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: AddFaq,
  },
  {
    path: "/edit-faq/:faqId",
    layout: Admin,
    name: "Edit Faq",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: EditFaq,
  },
  {
    path: "/cms",
    layout: Admin,
    name: "Content Management",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: ContentManagement,
    showInSideBar: true,
  },
  {
    path: "/add-cms",
    layout: Admin,
    name: "Add Content",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: AddContentPage,
  },
  {
    path: "/edit-cms/:contentId",
    layout: Admin,
    name: "Edit Content",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: AddContentPage,
  },
  {
    path: "/contact",
    layout: Admin,
    name: "Contacts",
    icon: "nc-icon nc-send",
    access: true, exact: true,
    component: Contacts,
    showInSideBar: true,
  },
  {
    path: "/activity",
    layout: Admin,
    name: "Activities",
    icon: "nc-icon nc-notes",
    access: true, exact: true,
    component: Activity,
    showInSideBar: true,
  },
  {
    path: "/newsletter",
    layout: Admin,
    name: "Newsletters",
    icon: "nc-icon nc-bulb-63",
    access: true, exact: true,
    component: NewsLetter,
    showInSideBar: true,
  },
  {
    collapse: true,
    name: "Settings",
    state: "opensettings",
    icon: "nc-icon nc-settings-gear-64",
    showInSideBar: true,
    submenus: [
      {
        path: "/site-settings",
        layout: Admin,
        name: "Site Settings",
        mini: "SS",
        icon: "nc-icon nc-settings-gear-64",
        access: true, exact: true,
        component: SiteSettings,
        showInSideBar: true,
      },
      {
        path: "/social-settings",
        layout: Admin,
        name: "Social Settings",
        mini: "SS",
        icon: "nc-icon nc-settings-gear-64",
        access: true, exact: true,
        component: SocialSettings,
        showInSideBar: true,
      },
      // COMMENTED TEMP.
      // {
      //   path: "/percentage-settings",
      //   layout: Admin,
      //   name: "Percentage Settings",
      //   mini: "NS",
      //   icon: "nc-icon nc-settings-gear-64",
      //   access: true, exact: true,
      //   component: NftsSettings,
      //   showInSideBar: true,
      // }
    ],
  },
  {
    path: "/login",
    layout: UnAuth,
    name: "Login",
    mini: "LP",
    component: Login,
  },
  {
    path: "/forgot-password",
    layout: UnAuth,
    name: "Forgot Passowrd",
    mini: "FP",
    component: ForgotPassword,
  },
  {
    path: "/reset-password/:adminId",
    layout: UnAuth,
    name: "Reset Passowrd",
    mini: "RP",
    component: ResetPassword,
  }
];

export default routes;
