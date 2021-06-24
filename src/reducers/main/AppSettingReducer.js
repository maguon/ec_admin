import {handleActions} from 'redux-actions';
import {AppSettingActionType} from '../../types';

const initialState = {
    // 检索结果
    appData: {
        // 开始位置
        start: 0,
        // 每页数量
        size: 11,
        // 检索结果数量
        dataSize: 0,
        // 数据列表
        dataList: []
    },
    // 检索条件：模态状态
    modalOpen: false,
    // 检索结果
    modalData: {
        // 新增 / 修改 区分
        pageType: '',
        // 唯一键
        uid : -1,
        // App类型
        appType: null,
        // 系统类型
        deviceType: null,
        // 强制更新
        forceUpdate: null,
        // 版本号
        version: '',
        // 版本序号
        versionNum: 0,
        // 最低版本号
        minVersionNum: 0,
        // 下载地址
        url: '',
        // 备注
        remarks: ''
    }
};

export default handleActions({
    [AppSettingActionType.setAppData]: (state, action) => {
        return {
            ...state,
            appData: action.payload
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