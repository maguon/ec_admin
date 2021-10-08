import {handleActions} from 'redux-actions';
import {LoginActionType} from '../../types';

const initialState = {
    userName: '',
    password: ''
};

export default handleActions({
    [LoginActionType.loginInit]: (state, action) => {
        return {
            ...state,
            data: action.payload
        }
    },
    [LoginActionType.setLoginUsername]: (state, action) => {
        return {
            ...state,
            userName: action.payload
        }
    },
    [LoginActionType.setLoginPassword]: (state, action) => {
        return {
            ...state,
            password: action.payload
        }
    }
}, initialState);