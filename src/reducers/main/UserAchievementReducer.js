import {handleActions} from 'redux-actions';
import {UserAchievementActionType} from '../../types';
const initialState = {
    // 检索条件
    userParams: {
        reUserId:null,
        userType:null,
        finDateStart:'',
        finDateEnd:''
    },
    // 检索结果
    userData:{
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        userInfo: [],
    },
    typeData:[]
};
export default handleActions({
    [UserAchievementActionType.setUserQueryParam]: (state, action) => {
        const {name, value} = action.payload;
        const paramsObj = {...state.userParams, [name]: value};
        return {
            ...state,
            userParams: paramsObj
        }
    },
    [UserAchievementActionType.setUserQueryParams]: (state, action) => {
        return {
            ...state,
            userParams: action.payload
        }
    },
    [UserAchievementActionType.setUserData]: (state, action) => {
        return {
            ...state,
            userData: action.payload
        }
    },
    [UserAchievementActionType.setTypeInfo]: (state, action) => {
        return {
            ...state,
            typeData: action.payload
        }
    },


}, initialState)