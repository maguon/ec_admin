import {handleActions} from 'redux-actions';
import {BrandManagerActionType} from '../../types';

const initialState = {
    brandList: []
};

export default handleActions({
    [BrandManagerActionType.setBrandList]: (state, action) => {
        return {
            ...state,
            brandList: action.payload
        }
    },
    [BrandManagerActionType.setBrandModelList]: (state, action) => {
        let brandList = state.brandList;
        if (action.payload && action.payload.length > 0) {
            for (let i = 0; i < brandList.length; i++) {
                if (brandList[i].id == action.payload[0].brand_id) {
                    brandList[i].sub = action.payload;
                    break;
                }
            }
        }
        return {
            ...state,
            brandList: brandList
        }
    }
}, initialState)