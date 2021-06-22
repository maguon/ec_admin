import {handleActions} from 'redux-actions';
import {AppActionType} from '../../types';

const initialState = {
    showLoadProgressFlag: false,
    currentUser: {},
    currentUserMenu: []
};

export default handleActions({
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
    }
}, initialState);