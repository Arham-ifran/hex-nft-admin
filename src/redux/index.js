import { combineReducers } from 'redux'
import adminReducer from '../views/Admin/Admin.reducer'
import rolesReducer from '../views/AdminStaff/permissions/permissions.reducer'
import categoryReducer from '../views/Categories/Categories.reducer'
import userReducer from 'views/Users/Users.reducer'
import collectionReducer from '../views/Collection/Collection.reducer'
import errorReducer from './shared/error/error.reducer'
import nftsReducer from 'views/Nfts/nfts.reducer'
import auctionsReducer from '../views/LiveAuctions/liveAuctions.reducer'
import emailReducer from '../views/EmailTemplates/EmailTemplates.reducer'
import settingsReducer from '.././views/Settings/settings.reducer'
import faqReducer from 'views/Faq/Faq.reducer'
import contactsReducer from 'views/Contacts/Contacts.reducer'
import ActivityReducer from 'views/Activity/Activity.reducer'
import DashboardReducer from 'views/Dashboard.reducer'
import ContentManagementReducer from 'views/ContentManagment/cms.reducer'
import NftReportingsReducer from 'views/NftReportings/nftReportings.reducer'
import NewsLetterReducer from 'views/Newsletter/newsletter.reducer'

export default combineReducers({
    admin: adminReducer,
    role: rolesReducer,
    category: categoryReducer,
    user: userReducer,
    collection: collectionReducer,
    error: errorReducer,
    nfts: nftsReducer,
    auctions: auctionsReducer,
    email: emailReducer,
    settings: settingsReducer,
    faqs: faqReducer,
    contacts: contactsReducer,
    activity: ActivityReducer,
    dashboard: DashboardReducer,
    content : ContentManagementReducer,
    reports : NftReportingsReducer,
    newsletter : NewsLetterReducer

})