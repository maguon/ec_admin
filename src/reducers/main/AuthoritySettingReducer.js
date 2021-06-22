import {handleActions} from 'redux-actions';
import {AuthoritySettingActionType} from '../../types';

const initialState = {
    // 当前用户群组列表
    userGroupList: [],
    // 当前用户类型
    currentUserType: null,
    // 当前画面菜单
    currentMenu: []
};

export default handleActions({
    [AuthoritySettingActionType.setMenuList]: (state, action) => {
        return {
            ...state,
            currentMenu: action.payload
        }
    },
    [AuthoritySettingActionType.setUserGroupList]: (state, action) => {
        let userGroupList = [];
        action.payload.forEach((value) => {
            userGroupList.push({value: value.id, label: value.type_name})
        });
        return {
            ...state,
            userGroupList: userGroupList
        }
    },
    [AuthoritySettingActionType.setCurrentUserType]: (state, action) => {
        return {
            ...state,
            currentUserType: action.payload
        }
    }
}, initialState)