import { BEFORE_NFT, GET_NFTS, DELETE_NFT, GET_NFT, UPDATE_NFT_SETTINGS } from '../../redux/types';

const initialState = {
    nfts: null,
    pagination: null,
    getNftsAuth: false,
    nftId: null,
    nftDelAuth: false,
    nft: null,
    getNftAuth: false,
    updateAuth: false,
    updateSettingsRes : null
}

export default function (state = initialState, action) {
    switch (action.type) {
        case GET_NFTS:
            return {
                ...state,
                nfts: action.payload.nfts,
                pagination: action.payload.pagination,
                getNftsAuth: true
            }
        case GET_NFT:
            return {
                ...state,
                nft: action.payload,
                getNftAuth: true
            }
        case BEFORE_NFT:
            return {
                ...state,
                nfts: null,
                pagination: null,
                getNftsAuth: false,
                getNftAuth: false,
                nftId: null,
                nftDelAuth: false,
                updateAuth: false,
                updateSettingsRes : null
            }
        case DELETE_NFT:
            return {
                ...state,
                nftId: action.payload.nftId,
                nftDelAuth: true
            }
        case UPDATE_NFT_SETTINGS:
            return {
                ...state,
                updateAuth: true,
                updateSettingsRes : action.payload
            }
        default:
            return {
                ...state
            }
    }
}