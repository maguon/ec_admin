import {handleActions} from 'redux-actions';
import {AdminUserSettingActionType} from '../../types';

const initialState = {
    // 开始位置
    start: 0,
    // 每页数量
    size: 11,
    // 检索结果数量
    dataSize: 0,
    // 员工列表
    adminArray: [],
    //详情
    adminItem:[],
    typeArray:[]

};

export default handleActions({
    [AdminUserSettingActionType.getUserList]: (state, action) => {
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