import {handleActions} from 'redux-actions';
import {AdminUserSettingActionType} from '../../types';
const initialState = {
    //查询条件
    queryObj:{
        realName:'',
        status:'',
        phone :'',
        type :'',
        gender :'',
        start :0
    },
    // 每页数量
    size: 11,
    // 检索结果数量
    dataSize: 0,
    // 员工列表
    adminArray: [],
    //详情
    adminItem:[],
    typeArray:[],
    perfLevelArray:[]
};
export default handleActions({
    [AdminUserSettingActionType.setQueryObj]: (state, action) => {
        return {
            ...state,
            queryObj: action.payload
        }
    },
    [AdminUserSettingActionType.getUserList]: (state, action) => {
        return {
            ...state,
            adminArray: action.payload
        }
    },
    [AdminUserSettingActionType.setUserListDataSize]: (state, action) => {
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
    [AdminUserSettingActionType.setPerfLevelArray]: (state, action) => {
        return {
            ...state,
            perfLevelArray: action.payload
        }
    },

}, initialState)