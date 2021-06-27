import {handleActions} from 'redux-actions';
import {AppActionType} from '../../types';

const sysConst = require('../../utils/SysConst');
const initialState = {
    showLoadProgressFlag: false,
    currentUser: {},
    currentUserMenu: []
};

export default handleActions({
    [AppActionType.showLoadProgress]: (state, action) => {
        return {
            ...state,
            showLoadProgressFlag: action.payload
        }
    },
    [AppActionType.setCurrentUser]: (state, action) => {
        return {
            ...state,
            currentUser: action.payload
        }
    },
    [AppActionType.setCurrentUserMenu]: (state, action) => {
        let menuList = JSON.parse(JSON.stringify(sysConst.ALL_PAGE_LIST));

        for (let i = menuList.length - 1; i >=0; i--) {
            if (menuList[i].children.length > 0) {
                for (let j = menuList[i].children.length - 1; j >=0; j--) {
                    if (!action.payload.has(menuList[i].children[j].link)) {
                        menuList[i].children.splice(j,1);
                    }
                }
                if (menuList[i].children.length === 0) {
                    menuList.splice(i,1);
                }
            } else {
                if (!action.payload.has(menuList[i].link)) {
                    menuList.splice(i,1);
                }
            }
        }
        return {
            ...state,
            currentUserMenu: menuList
        }
    }
}, initialState);
