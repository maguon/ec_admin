import {handleActions} from 'redux-actions';
import {ClientInformationActionType} from '../../types';
const initialState = {
    //查询条件
    queryClientObj:{
        tel:'',
        clientSerial:'',
        clientSerialDetail:'',
        referUser :null,
        dateIdStart :'',
        dateIdEnd :'',
        sourceType :null,
        status:null,
        clientAgentId:null
    },
    start :0,
    // 每页数量
    size: 11,
    // 检索结果数量
    dataSize: 0,
    // 客户信息列表
    clientInformationArray: [],
    referUserArray:[],
    clientAgentArray:[],
    prodMatchBrandArray:[],
    prodMatchModelArray:[]
};
export default handleActions({
    [ClientInformationActionType.setClientInformationQueryObj]: (state, action) => {
        return {
            ...state,
            queryClientObj: action.payload
        }
    },
    [ClientInformationActionType.setClientInformationQueryObjs]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.queryClientObj, [name]: value};
        return {
            ...state,
            queryClientObj: paramsObj
        }
    },
    [ClientInformationActionType.getClientInformationList]: (state, action) => {
        return {
            ...state,
            clientInformationArray: action.payload
        }
    },
    [ClientInformationActionType.setClientInformationListDataSize]: (state, action) => {
        return {
            ...state,
            dataSize: action.payload
        }
    },
    [ClientInformationActionType.setClientInformationListStart]: (state, action) => {
        return {
            ...state,
            start: action.payload
        }
    },
    [ClientInformationActionType.getClientInformationUserList]: (state, action) => {
        return {
            ...state,
            referUserArray: action.payload
        }
    },
    [ClientInformationActionType.getClientAgentList]: (state, action) => {
        return {
            ...state,
            clientAgentArray: action.payload
        }
    },
    [ClientInformationActionType.setProdMatchBrandList]: (state, action) => {
        return {
            ...state,
            prodMatchBrandArray: action.payload
        }
    },
    [ClientInformationActionType.setProdMatchModelList]: (state, action) => {
        return {
            ...state,
            prodMatchModelArray: action.payload
        }
    },
}, initialState)