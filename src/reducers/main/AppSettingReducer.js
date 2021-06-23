import {handleActions} from 'redux-actions';
import {AppSettingActionType} from '../../types';

const initialState = {
    // 检索结果
    appData: {
        // 开始位置
        start: 0,
        // 每页数量
        size: 6,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        dataList: []
    },
    // 检索条件：系统
    conditionDeviceType: null,
    // 检索条件：状态
    conditionStatus: null,

    // 检索条件：模态状态
    modalOpen: false,
    // 检索结果
    modalData: {
        // 新增 / 修改 区分
        pageType: '',
        // 唯一键
        uid : -1,
        // 学校性质
        type: null,
        // 学校代码
        code: '',
        // 学校名称
        name: '',
        // 招生起始年
        startYear: 0,
        // 学校地址
        address: '',
        // 备注
        remark: ''
    }
};

export default handleActions({
    [AppSettingActionType.setAppData]: (state, action) => {
        return {
            ...state,
            appData: action.payload
        }
    },
    [AppSettingActionType.setConditionDeviceType]: (state, action) => {
        return {
            ...state,
            conditionDeviceType: action.payload
        }
    },
    [AppSettingActionType.setConditionStatus]: (state, action) => {
        return {
            ...state,
            conditionStatus: action.payload
        }
    },
    [AppSettingActionType.setModalOpen]: (state, action) => {
        return {
            ...state,
            modalOpen: action.payload
        }
    },
    [AppSettingActionType.setModalData]: (state, action) => {
        return {
            ...state,
            modalData: action.payload
        }
    }
}, initialState)