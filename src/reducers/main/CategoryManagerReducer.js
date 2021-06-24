import {handleActions} from 'redux-actions';
import {CategoryManagerActionType} from '../../types';

const initialState = {
    categoryList: [],
    categorySubList: []
};

export default handleActions({
    [CategoryManagerActionType.setCategoryList]: (state, action) => {
        return {
            ...state,
            categoryList: action.payload
        }
    },
    [CategoryManagerActionType.setCategorySubList]: (state, action) => {
        return {
            ...state,
            categorySubList: action.payload
        }
    }
}, initialState)