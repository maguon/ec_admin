import {handleActions} from 'redux-actions';
import {AdminUserSettingActionType} from '../../types';

const initialState = {
    // 开始位置
    start: 0,
    // 每页数量
    size: 11,
    // 检索结果数量
    dataSize: 0,
    // 检索条件：电话
    conditionPhone: '',
    // 检索条件：用户名称
    conditionRealName: '',
    // 检索条件：性别
    conditionGender:null,
    //检索条件：用户群组
    conditionType:null,
    // 检索条件：状态
    conditionStatus: null,
    // 员工列表
    adminArray: [],

    //详情
    adminItem:[],

    typeArray:[]

};

export default handleActions({
    [AdminUserSettingActionType.getAdminList]: (state, action) => {
        return {
            ...state,
            adminArray: action.payload
        }
    },
    [AdminUserSettingActionType.setStartNumber]: (state, action) => {
        return {
            ...state,
            start: action.payload
        }
    },
    [AdminUserSettingActionType.setDataSize]: (state, action) => {
        return {
            ...state,
            dataSize: action.payload
        }
    },
    [AdminUserSettingActionType.setConditionPhone]: (state, action) => {
        return {
            ...state,
            conditionPhone: action.payload
        }
    },
    [AdminUserSettingActionType.setConditionRealName]: (state, action) => {
        return {
            ...state,
            conditionRealName: action.payload
        }
    },
    [AdminUserSettingActionType.setConditionType]: (state, action) => {
        return {
            ...state,
            conditionType: action.payload
        }
    },
    [AdminUserSettingActionType.setConditionGender]: (state, action) => {
        return {
            ...state,
            conditionGender: action.payload
        }
    },
    [AdminUserSettingActionType.setConditionStatus]: (state, action) => {
        return {
            ...state,
            conditionStatus: action.payload
        }
    },
    [AdminUserSettingActionType.setAdminItem]: (state, action) => {
        return {
            ...state,
            adminItem: action.payload
        }
    },
    [AdminUserSettingActionType.setTypeArray]: (state, action) => {
        return {
            ...state,
            typeArray: action.payload
        }
    },

}, initialState)