import {handleActions} from 'redux-actions';
import {StorageActionType} from '../../types';

const initialState = {
    storageList: []
};

export default handleActions({
    [StorageActionType.setStorageList]: (state, action) => {
        return {
            ...state,
            storageList: action.payload
        }
    },
    [StorageActionType.setStorageAreaList]: (state, action) => {
        let storageList = state.storageList;
        if (action.payload && action.payload.length > 0) {
            for (let i = 0; i < storageList.length; i++) {
                if (storageList[i].id == action.payload[0].storage_id) {
                    storageList[i].sub = action.payload;
                    break;
                }
            }
        }
        return {
            ...state,
            storageList: storageList
        }
    }
}, initialState)