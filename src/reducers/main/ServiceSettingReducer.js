import {handleActions} from 'redux-actions';
import {ServiceSettingActionType} from '../../types';
const initialState = {
    //查询条件
    queryObj:{
        serviceType:null,
        servicePartType:null,
        servicePriceType :null,
        serviceCostType :null,
        salePerfType :null,
        deployPerfType :null,
        checkPerfType :null,
        status:null
    },
    start :0,
    // 每页数量
    size: 11,
    // 检索结果数量
    dataSize: 0,
    // 供应商列表
    serviceSettingArray: [],
    serviceSettingRelArray:[]
};
export default handleActions({
    [ServiceSettingActionType.setServiceSettingQueryObj]: (state, action) => {
        return {
            ...state,
            queryObj: action.payload
        }
    },
    [ServiceSettingActionType.setServiceSettingQueryObjs]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.queryObj, [name]: value};
        return {
            ...state,
            queryObj: paramsObj
        }
    },
    [ServiceSettingActionType.getServiceSettingList]: (state, action) => {
        return {
            ...state,
            serviceSettingArray: action.payload
        }
    },
    [ServiceSettingActionType.setServiceSettingListDataSize]: (state, action) => {
        return {
            ...state,
            dataSize: action.payload
        }
    },
    [ServiceSettingActionType.setServiceSettingListStart]: (state, action) => {
        return {
            ...state,
            start: action.payload
        }
    },
    [ServiceSettingActionType.getServiceSettingRelList]: (state, action) => {
        return {
            ...state,
            serviceSettingRelArray: action.payload
        }
    },

}, initialState)