import {handleActions} from 'redux-actions';
import {CommonActionType} from '../../types';

const initialState = {
    // 抽屉状态
    drawerOpen: false,
    // AppBar ToolBar 手机模式 锚点
    mobileMoreAnchorEl: null,

    // 登录用户的详细信息
    loginUserInfo :{},
    // 登录用户的菜单数组
    loginUserMenuList :[],
    // 用户列表 (根据电话模糊查询)
    userList: [],
    // 设备版本
    appVersionList: [],



    // 高中列表
    highSchoolList: []
};

export default handleActions({
    [CommonActionType.setDrawerOpen]: (state, action) => {
        return {
            ...state,
            drawerOpen: action.payload
        }
    },
    [CommonActionType.setMobileMoreAnchorEl]: (state, action) => {
        return {
            ...state,
            mobileMoreAnchorEl: action.payload
        }
    },



    [CommonActionType.getLoginUserInfo]: (state, action) => {
        return {
            ...state,
            loginUserInfo: action.payload
        }
    },
    [CommonActionType.getLoginUserMenu]: (state, action) => {
        let newMenu = [];
        let oldMenu = action.payload;
        let tmpMenu;
        for (let i = 0; i < oldMenu.length; i++) {
            if (oldMenu[i].children.length === 0 && oldMenu[i].usable) {
                newMenu.push(oldMenu[i]);
            }
            if (oldMenu[i].children.length > 0) {
                tmpMenu = oldMenu[i];
                for (let k = tmpMenu.children.length -1; k >= 0; k--) {
                    if (!tmpMenu.children[k].usable) {
                        tmpMenu.children.splice(k,1);
                    }
                }
                if (tmpMenu.children.length > 0) {
                    newMenu.push(tmpMenu);
                }
            }
        }

        return {
            ...state,
            loginUserMenuList: newMenu
        }
    },
    [CommonActionType.getUserByPhoneList]: (state, action) => {
        let userList = [];
        action.payload.forEach((value) => {
            // userList.push(value.user_login_info[0].phone + "  " + value.real_name + " " + value.user_login_info[0]._id);
            userList[value._id + "  " + value.user_detail_info[0].nick_name + "  " + value.phone] =null;
        });
        // userList = ['Burns Bay Road', 'Downing Street', 'Wall Street'];
        return {
            ...state,
            userList: userList
        }
    },
    [CommonActionType.getAppVersionList]: (state, action) => {
        let appVersionList = [];
        action.payload.forEach((value) => {
            appVersionList.push({value: value._id, label: value.version})
        });
        return {
            ...state,
            appVersionList: appVersionList
        }
    },









    [CommonActionType.getHighSchoolList]: (state, action) => {
        let highSchoolList = [];
        action.payload.forEach((value) => {
            highSchoolList.push({value: value.uid, label: value.hs_name})
        });
        return {
            ...state,
            highSchoolList: highSchoolList
        }
    }
}, initialState)
