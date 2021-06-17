import {handleActions} from 'redux-actions';
import {AppActionType} from '../../types';

const initialState = {    
    showDrawerFlag:false,
    showLoadProgressFlag:false,
    accountModalOpenFlag:false,
    currentUser:{},
    currentUserMenu :[]
};

export default handleActions(
    {
        [AppActionType.showDrawer]: (state, action) => {
            return {
                ...state,
                showDrawerFlag: action.payload
            }
        },
        [AppActionType.showLoadProgress]: (state, action) => {
            console.log(action)
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
            return {
                ...state,
                currentUserMenu: action.payload
            }
        },
        [AppActionType.setAccountModalOpen]: (state, action) => {
            return {
                ...state,
                accountModalOpenFlag: action.payload
            }
        }
    }, initialState);