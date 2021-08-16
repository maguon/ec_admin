import {handleActions} from 'redux-actions';
import {UserAchievementDetailActionType} from '../../types';
const initialState = {
    deployServiceInfo: [],
    checkServiceInfo: [],

};
export default handleActions({
    [UserAchievementDetailActionType.setDeployServiceData]: (state, action) => {
        return {
            ...state,
            deployServiceInfo: action.payload
        }
    },
    [UserAchievementDetailActionType.setCheckServiceData]: (state, action) => {
        return {
            ...state,
            checkServiceInfo: action.payload
        }
    }
}, initialState)