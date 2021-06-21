import {handleActions} from 'redux-actions';
import {AdminUserSettingActionType} from '../../types';

const initialState = {
    // 开始位置
    start: 0,
    // 每页数量
    size: 11,
    // 检索结果数量
    dataSize: 0,

    // 检索条件：手机
    conditionPhone: '',
    // 检索条件：管理员名称
    conditionAdminName: '',
    // 检索条件：真实姓名
    conditionRealName: '',
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
    [AdminUserSettingActionType.setConditionAdminName]: (state, action) => {
        return {
            ...state,
            conditionAdminName: action.payload
        }
    },
    [AdminUserSettingActionType.setConditionRealName]: (state, action) => {
        return {
            ...state,
            conditionRealName: action.payload
        }
    },
    [AdminUserSettingActionType.setConditionStatus]: (state, action) => {
        return {
            ...state,
            conditionStatus: action.payload
        }
    }
}, initialState)