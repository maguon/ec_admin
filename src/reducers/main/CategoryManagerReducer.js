import {handleActions} from 'redux-actions';
import {CategoryManagerActionType} from '../../types';

const initialState = {
    categoryList: []
};

export default handleActions({
    [CategoryManagerActionType.setCategoryList]: (state, action) => {
        return {
            ...state,
            categoryList: action.payload
        }
    },
    [CategoryManagerActionType.setCategorySubList]: (state, action) => {
        let categoryList = state.categoryList;
        if (action.payload && action.payload.length > 0) {
            for (let i = 0; i < categoryList.length; i++) {
                if (categoryList[i].id == action.payload[0].category_id) {
                    categoryList[i].sub = action.payload;
                    break;
                }
            }
        }
        return {
            ...state,
            categoryList: categoryList
        }
    }
}, initialState)