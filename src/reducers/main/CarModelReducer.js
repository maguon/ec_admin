import {handleActions} from 'redux-actions';
import {CarModelActionType} from '../../types';

const initialState = {
    carList: []
};

export default handleActions({
    [CarModelActionType.setCarList]: (state, action) => {
        return {
            ...state,
            carList: action.payload
        }
    },
    [CarModelActionType.setCarModelList]: (state, action) => {
        let carList = state.carList;
        if (action.payload && action.payload.length > 0) {
            for (let i = 0; i < carList.length; i++) {
                if (carList[i].id == action.payload[0].match_brand_id) {
                    carList[i].sub = action.payload;
                    break;
                }
            }
        }
        return {
            ...state,
            carList: carList
        }
    }
}, initialState)