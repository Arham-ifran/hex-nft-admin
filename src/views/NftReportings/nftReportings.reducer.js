import {GET_REPORTINGS, GET_REPORT, EDIT_REPORT, DELETE_REPORT, BEFORE_REPORT, ADD_REPORT_RESPONSE, GET_REPORT_MESSAGES} from '../../redux/types'

const initialState = {
    getNftReports: {},
    getNftReportsAuth: false,

    deleteNftReport: {},
    deleteNftReportAuth: false,

    getNftReport : {},
    getNftReportAuth: false,

    updateNftReport : {},
    updateNftReportAuth: false,

    addReportResponseData : {},
    addReportResponseAuth : false,

    getReportMessagesRes : {},
    getReportMessagesAuth : false
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_REPORT:
            return {
                ...state,
                getNftReport: action.payload,
                getNftReportAuth: true
            }
        case GET_REPORTINGS:
            return {
                ...state,
                getNftReports: action.payload,
                getNftReportsAuth: true
            }
        case EDIT_REPORT:
            return {
                ...state,
                updateNftReport: action.payload,
                updateNftReportAuth: true
            }
        case DELETE_REPORT:
            return {
                ...state,
                deleteNftReport: action.payload,
                deleteNftReportAuth: true
            }
        case ADD_REPORT_RESPONSE:
            return {
                ...state,
                addReportResponseData: action.payload,
                addReportResponseAuth: true
            }

        case GET_REPORT_MESSAGES:
            return {
                ...state,
                getReportMessagesRes: action.payload,
                getReportMessagesAuth: true
            }
        case BEFORE_REPORT:
            return {
                ...state,
                getNftReports: {},
                getNftReport: {},
                updateNftReport: {},
                deleteNftReport: {},
                addContentRes: {},
                addReportResponseData: {},
                getReportMessagesRes: {},

                getReportMessagesAuth: false,
                addReportResponseAuth: false,
                getNftReportsAuth: false,
                deleteNftReportAuth: false,
                addContentAuth: false,
                getNftReportAuth: false,
                updateNftReportAuth: false
            }
        default:
            return {
                ...state
            }
    }
}