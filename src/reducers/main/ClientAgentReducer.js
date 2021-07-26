import {handleActions} from 'redux-actions';
import {ClientAgentActionType} from '../../types';
const initialState = {
    //查询条件
    queryClientObj:{
        clientType :null,
        idSerial :'',
        dateIdStart :'',
        dateIdEnd :'',
        sourceType :null,
        status:null
    },
    start :0,
    // 每页数量
    size: 11,
    // 检索结果数量
    dataSize: 0,
    // 客户集群列表
    clientArray: [],
};
export default handleActions({
    [ClientAgentActionType.setClientAgentQueryObj]: (state, action) => {
        return {
            ...state,
            queryClientObj: action.payload
        }
    },
    [ClientAgentActionType.setClientAgentQueryObjs]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.queryClientObj, [name]: value};
        return {
            ...state,
            queryClientObj: paramsObj
        }
    },
    [ClientAgentActionType.getClientList]: (state, action) => {
        return {
            ...state,
            clientArray: action.payload
        }
    },
    [ClientAgentActionType.setClientListDataSize]: (state, action) => {
        return {
            ...state,
            dataSize: action.payload
        }
    },
    [ClientAgentActionType.setClientListStart]: (state, action) => {
        return {
            ...state,
            start: action.payload
        }
    },

}, initialState)