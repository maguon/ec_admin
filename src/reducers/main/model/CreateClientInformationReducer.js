import {handleActions} from 'redux-actions';
import {CreateClientInformationActionType} from '../../../types';
const sysConst = require('../../../utils/SysConst');
const initialState = {
    flag:false,
    clientAgentId:null,
    clientSerial:'',
    clientSerialDetail:'',
    sourceType:sysConst.SOURCE_TYPE[0].value,
    name: "",
    tel: "",
    address: "",
    referUser:null,
    brandName:null,
    matchModelName:null,
    remark: "",
    clientAgentArray:[],
    referUserArray:[],
    prodMatchBrandArray:[],
    prodMatchModelArray:[]
};
export default handleActions({
    [CreateClientInformationActionType.setInformationFlag]: (state, action) => {
        return {
            ...state,
            flag: action.payload
        }
    },
    [CreateClientInformationActionType.setInformationClientAgentId]: (state, action) => {
        return {
            ...state,
            clientAgentId: action.payload
        }
    },
    [CreateClientInformationActionType.setInformationClientSerial]: (state, action) => {
        return {
            ...state,
            clientSerial: action.payload
        }
    },
    [CreateClientInformationActionType.setInformationClientSerialDetail]: (state, action) => {
        return {
            ...state,
            clientSerialDetail: action.payload
        }
    },
    [CreateClientInformationActionType.setInformationSourceType]: (state, action) => {
        return {
            ...state,
            sourceType: action.payload
        }
    },
    [CreateClientInformationActionType.setInformationName]: (state, action) => {
        return {
            ...state,
            name: action.payload
        }
    },
    [CreateClientInformationActionType.setInformationTel]: (state, action) => {
        return {
            ...state,
            tel: action.payload
        }
    },
    [CreateClientInformationActionType.setInformationAddress]: (state, action) => {
        return {
            ...state,
            address: action.payload
        }
    },
    [CreateClientInformationActionType.setInformationReferUser]: (state, action) => {
        return {
            ...state,
            referUser: action.payload
        }
    },
    [CreateClientInformationActionType.setInformationBrandName]: (state, action) => {
        return {
            ...state,
            brandName: action.payload
        }
    },
    [CreateClientInformationActionType.setInformationMatchModelName]: (state, action) => {
        return {
            ...state,
            matchModelName: action.payload
        }
    },
    [CreateClientInformationActionType.setInformationRemark]: (state, action) => {
        return {
            ...state,
            remark: action.payload
        }
    },
    [CreateClientInformationActionType.getInformationClientAgentArray]: (state, action) => {
        return {
            ...state,
            clientAgentArray: action.payload
        }
    },
    [CreateClientInformationActionType.getInformationReferUserArray]: (state, action) => {
        return {
            ...state,
            referUserArray: action.payload
        }
    },
    [CreateClientInformationActionType.getInformationProdMatchBrandArray]: (state, action) => {
        return {
            ...state,
            prodMatchBrandArray: action.payload
        }
    },
    [CreateClientInformationActionType.getInformationProdMatchModelArray]: (state, action) => {
        return {
            ...state,
            prodMatchModelArray: action.payload
        }
    },
}, initialState)