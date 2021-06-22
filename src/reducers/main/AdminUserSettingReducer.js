import {handleActions} from 'redux-actions';
import {AdminUserSettingActionType} from '../../types';

const initialState = {
    // 检索条件：电话
    conditionPhone: '',
    // 检索条件：用户名称
    conditionUserName: '',
    // 检索条件：性别
    conditionGender:null,
    // 检索条件：状态
    conditionStatus: null,
    // 员工列表
    adminArray: []

};

export default handleActions({
    [AdminUserSettingActionType.getAdminList]: (state, action) => {
        return {
            ...state,
            adminArray: action.payload
        }
    },
    [AdminUserSettingActionType.setConditionPhone]: (state, action) => {
        return {
            ...state,
            conditionPhone: action.payload
        }
    },
    [AdminUserSettingActionType.setConditionUserName]: (state, action) => {
        return {
            ...state,
            conditionUserName: action.payload
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
}, initialState)