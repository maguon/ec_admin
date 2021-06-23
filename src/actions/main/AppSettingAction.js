import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppSettingActionType} from '../../types';

const httpUtil = require('../../utils/HttpUtils');
const sysConst = require('../../utils/SysConst');

export const getHighSchoolList = (dataStart) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = dataStart;
        // 检索条件：每页数量
        const size = getState().AppSettingReducer.highSchool.size;
        // 检索条件：学校名称
        const conditionName = getState().AppSettingReducer.conditionName.trim();
        // 检索条件：学校性质
        const conditionType = getState().AppSettingReducer.conditionType;

        // 基本检索URL
        let url = apiHost + '/api/highSchool?start=' + start + '&size=' + size;

        // 检索条件
        let conditionsObj = {
            name: conditionName,
            type: conditionType === null ? '' : conditionType.value
        };
        let conditions = httpUtil.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;
        const res = await httpUtil.httpGet(url);
        let highSchool = getState().AppSettingReducer.highSchool;
        if (res.success === true) {
            highSchool.start = start;
            highSchool.dataSize = res.result.length;
            highSchool.dataList = res.result.slice(0, size - 1);
            dispatch({type: AppSettingActionType.setHighSchool, payload: highSchool});
        } else if (res.success === false) {
            Swal.fire("获取高中列表信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const changeHighSchoolStatus = (id, status) => async (dispatch, getState) => {
    Swal.fire({
        title: status === 0 ? "确定停用该数据？" : "确定重新启用该数据？",
        text: "",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "确定",
        cancelButtonText:"取消"
    }).then(async (value) => {
        if (value.isConfirmed) {
            // 状态
            const url = apiHost + '/api/highSchool/' + id + '/status';
            const res = await httpUtil.httpPut(url, {status: status});
            if (res.success === true) {
                Swal.fire("修改成功", "", "success");
                // 刷新列表
                dispatch(getHighSchoolList(getState().AppSettingReducer.highSchool.start));
            } else if (res.success === false) {
                Swal.fire("修改失败", res.msg, "warning");
            }
        }
    });
};

// 初期数据
export const initModalData = (data) => async (dispatch, getState) => {
    // 取得 modal 数据
    let modalData = getState().AppSettingReducer.modalData;

    // 新建 / 修改
    if (data == null) {
        // 新增 区分
        modalData.pageType = 'new';
        // 唯一键
        modalData.uid = -1;
        // 学校性质
        modalData.type = null;
        // 学校代码
        modalData.code = '';
        // 学校名称
        modalData.name = '';
        // 招生起始年
        modalData.startYear = '';
        // 学校地址
        modalData.address = '';
        // 备注
        modalData.remark = '';
    } else {
        let selectedType = {
            value: data.type,
            label: sysConst.HIGH_SCHOOL_TYPE[data.type - 1].label
        };
        // 修改 区分
        modalData.pageType = 'edit';
        // 唯一键
        modalData.uid = data.uid;
        // 学校性质
        modalData.type = selectedType;
        // 学校代码
        modalData.code = data.code;
        // 学校名称
        modalData.name = data.hs_name;
        // 招生起始年
        modalData.startYear = data.start_year;
        // 学校地址
        modalData.address = data.address;
        // 备注
        modalData.remark = data.remark;
    }
    dispatch({type: AppSettingActionType.setModalData, payload: modalData});
    dispatch({type: AppSettingActionType.setModalOpen, payload: true});
};

export const saveModalData = () => async (dispatch, getState) => {
    try {
        // 模态数据
        let modalData = getState().AppSettingReducer.modalData;

        // 判断
        if (modalData.type == null || modalData.name == '' || modalData.address == '') {
            Swal.fire("请输入必要信息", "", "warning");
        } else {
            const params = {
                code: modalData.code,
                name: modalData.name,
                type: modalData.type == null ? '' : modalData.type.value,
                address: modalData.address,
                startYear: modalData.startYear,
                remark: modalData.remark
            };
            // 基本url
            let url = apiHost + '/api/highSchool';
            let res;
            if (modalData.pageType === 'new') {
                res = await httpUtil.httpPost(url, params);
            } else {
                url = url + '/' + modalData.uid;
                res = await httpUtil.httpPut(url, params);
            }
            if (res.success === true) {
                Swal.fire("保存成功", "", "success");
                // 关闭模态
                dispatch({type: AppSettingActionType.setModalOpen, payload: false});
                // 刷新列表
                dispatch(getHighSchoolList(getState().AppSettingReducer.highSchool.start));
            } else if (res.success === false) {
                Swal.fire("保存失败", res.msg, "warning");
            }
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};