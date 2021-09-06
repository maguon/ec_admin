import {handleActions} from 'redux-actions';
import {UserPerfLevelActionType} from '../../types';

const initialState = {
    // 检索结果
    userPerfLevelData: {
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        dataList: []
    },
    // 模态数据
    modalData: {pageType: '',perfName: '', remark: '', saleRatio: 1, deployRatio: 1, checkRatio: 1}
};

export default handleActions({
    [UserPerfLevelActionType.getUserPerfLevelData]: (state, action) => {
        return {
            ...state,
            userPerfLevelData: action.payload
        }
    },
    [UserPerfLevelActionType.setModalData]: (state, action) => {
        return {
            ...state,
            modalData: action.payload
        }
    }
}, initialState)