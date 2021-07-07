import {createHashHistory, createBrowserHistory} from 'history';
import Swal from 'sweetalert2';
import {apiHost} from '../../config';
import {AppActionType, StorageCheckActionType} from '../../types';
import html2canvas from 'html2canvas';
import {jsPDF} from "jspdf";

const httpUtil = require('../../utils/HttpUtils');
const localUtil = require('../../utils/LocalUtils');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');

export const getStorageCheckList = (params) => async (dispatch, getState) => {
    try {
        // 检索条件：开始位置
        const start = params.dataStart;
        // 检索条件：每页数量
        const size = getState().StorageCheckReducer.storageCheckData.size;
        // 检索条件
        const queryParams = getState().StorageCheckReducer.queryParams;
        // 基本检索URL
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageCheck?start=' + start + '&size=' + size;
        // 检索条件
        let conditionsObj = {
            dateIdStart: commonUtil.formatDate(queryParams.dateIdStart, 'yyyyMMdd'),
            dateIdEnd: commonUtil.formatDate(queryParams.dateIdEnd, 'yyyyMMdd'),
            checkStatus: queryParams.checkStatus == null ? '' : queryParams.checkStatus,
            status: queryParams.status == null ? '' : queryParams.status
        };
        let conditions = httpUtil.objToUrl(conditionsObj);
        // 检索URL
        url = conditions.length > 0 ? url + "&" + conditions : url;

        dispatch({type: AppActionType.showLoadProgress, payload: true});
        const res = await httpUtil.httpGet(url);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        let storageCheckData = getState().StorageCheckReducer.storageCheckData;
        if (res.success) {
            storageCheckData.start = start;
            storageCheckData.dataSize = res.rows.length;
            storageCheckData.dataList = res.rows.slice(0, size - 1);
            dispatch({type: StorageCheckActionType.setStorageCheckData, payload: storageCheckData});
        } else if (!res.success) {
            Swal.fire("获取仓库盘点列表信息失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const saveModalData = (modalData) => async (dispatch, getState) => {
    try {
        let params = {
            checkDesc: modalData.desc,
            remark: modalData.remark
        };
        if (modalData.storage != null) {
            params = {...params, storageId: modalData.storage.id};
        }
        if (modalData.storageArea != null) {
            params = {...params, storageAreaId: modalData.storageArea.id};
        }
        if (modalData.supplier != null) {
            params = {...params, supplierId: modalData.supplier.id};
        }
        if (modalData.category != null) {
            params = {...params, categoryId: modalData.category.id};
        }
        if (modalData.categorySub != null) {
            params = {...params, categorySubId: modalData.categorySub.id};
        }
        if (modalData.brand != null) {
            params = {...params, brandId: modalData.brand.id};
        }
        if (modalData.brandModel != null) {
            params = {...params, brandModelId: modalData.brandModel.id};
        }

        // 基本url
        let url = apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID) + '/storageCheck';
        dispatch({type: AppActionType.showLoadProgress, payload: true});
        let res = await httpUtil.httpPost(url, params);
        dispatch({type: AppActionType.showLoadProgress, payload: false});
        if (res.success && res.rows.length > 0) {
            const history = createHashHistory();
            history.push('/storage_check/' + res.rows[0].id);
            Swal.fire("保存成功", "", "success");
            // } else if (!res.success) {
            //     Swal.fire("保存失败", res.msg, "warning");
        }
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const downLoadCsv = (storageCheckId) => async () => {
    try {
        // 基本检索URL
        let url = 'http://' + apiHost + '/api/user/' + localUtil.getSessionItem(sysConst.LOGIN_USER_ID)
            + '/storageCheck/' + storageCheckId + '/storageCheckRel.csv';
        window.open(url);
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};

export const downLoadPDF = () => async () => {
    console.log('----------------------------------------');
    try {
        html2canvas(document.getElementById("ttt"), {
            // allowTaint: true, //避免一些不识别的图片干扰，默认为false，遇到不识别的图片干扰则会停止处理html2canvas
            // taintTest: false,
            useCORS: true,
            // Create a canvas with double-resolution.
            scale: 2,
            // Create a canvas with 144 dpi (1.5x resolution).
            dpi: 192,
            // 背景设为白色（默认为黑色）
            background: "#fff"
        }).then(function (canvas) {
            // document.getElementById("temp").appendChild(canvas);

            console.log('aaaaaaaaaaaaaaa')
            // Html / Canvas 画面 尺寸
            var contentWidth = canvas.width;
            var contentHeight = canvas.height;
            console.log('contentWidth', contentWidth);
            console.log('contentHeight', contentHeight);

            // 一页pdf显示html页面生成的canvas高度;（根据比例，算出来的固定值）
            var htmlPageHeight = contentWidth / 595.28 * 841.89;
            console.log('htmlPageHeight', htmlPageHeight);
            //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
            var pdfPageWidth = 595.28;
            var pdfPageHeight = 595.28 / contentWidth * contentHeight;
            console.log('pdfPageHeight', pdfPageHeight);
            var pageData = canvas.toDataURL('image/jpeg', 1.0);

            // var pdf = new jsPDF('', 'pt', 'a4');
            // 画面尺寸小于 一页，则默认为A4，否则：设定指定高度画面
            var pdf = new jsPDF('', 'pt', contentHeight < htmlPageHeight ? 'a4' : [pdfPageWidth, pdfPageHeight + 30]);
            pdf.addImage(pageData, 'JPEG', 0, 0, pdfPageWidth, pdfPageHeight);

            // 分页显示 代码暂时不用


            // 保存PDF文件
            pdf.save('测试.pdf');
        });
    } catch (err) {
        Swal.fire("操作失败", err.message, "error");
    }
};


/**
 * 下载PDF文件。
 */
// const downloadPDF = function () {
//     try{
//         // 去掉画面CSS (主要为了去滚动条)
//         $("#context-div").removeClass("ConWrap");
//         $("#carInfoDiv").removeClass("modal");
//         $(".shadeDowWrap").show();
//         // 下载PDF 之前，去掉画面显示的 删除图标
//         $(".img_close").remove();
//         html2canvas(document.getElementById("car_info"), {
//             // allowTaint: true, //避免一些不识别的图片干扰，默认为false，遇到不识别的图片干扰则会停止处理html2canvas
//             // taintTest: false,
//             useCORS: true,
//             // Create a canvas with double-resolution.
//             scale: 2,
//             // Create a canvas with 144 dpi (1.5x resolution).
//             dpi: 192,
//             onrendered: function(canvas) {
//                 // Html / Canvas 画面 尺寸
//                 var contentWidth = canvas.width;
//                 var contentHeight = canvas.height;
//                 // 一页pdf显示html页面生成的canvas高度;（根据比例，算出来的固定值）
//                 var htmlPageHeight = contentWidth / 595.28 * 841.89;
//                 //a4纸的尺寸[595.28,841.89]，html页面生成的canvas在pdf中图片的宽高
//                 var pdfPageWidth = 595.28;
//                 var pdfPageHeight = 595.28/contentWidth * contentHeight;
//                 var pageData = canvas.toDataURL('image/jpeg', 1.0);
//
//                 // var pdf = new jsPDF('', 'pt', 'a4');
//                 // 画面尺寸小于 一页，则默认为A4，否则：设定指定高度画面
//                 var pdf = new jsPDF('', 'pt', contentHeight < htmlPageHeight ? 'a4' : [pdfPageWidth, pdfPageHeight + 30]);
//                 pdf.addImage(pageData, 'JPEG', 0, 0, pdfPageWidth, pdfPageHeight );
//
//                 // 分页显示 代码暂时不用
//
//                 // // 未生成pdf的html页面高度
//                 // var leftHeight = contentHeight;
//                 // // pdf页面偏移 （因为分页，产生偏移）
//                 // var position = 0;
//                 // // 当内容未超过pdf一页显示的范围，无需分页
//                 // if (leftHeight < htmlPageHeight) {
//                 //     pdf.addImage(pageData, 'JPEG', 0, 0, pdfPageWidth, pdfPageHeight);
//                 // } else {
//                 //     // 有剩余未显示内容，则循环执行
//                 //     while(leftHeight > 0) {
//                 //         pdf.addImage(pageData, 'JPEG', 0, position, pdfPageWidth, pdfPageHeight);
//                 //         leftHeight -= htmlPageHeight;
//                 //         position -= 841.89;
//                 //         //避免添加空白页
//                 //         if(leftHeight > 0) {
//                 //             pdf.addPage();
//                 //         }
//                 //     }
//                 // }
//
//                 // 保存PDF文件
//                 pdf.save(vin + '.pdf');
//                 $(".shadeDowWrap").hide();
//             },
//             // 背景设为白色（默认为黑色）
//             background: "#fff"
//         });
//     } finally {
//         // 追加画面CSS
//         $("#carInfoDiv").addClass("modal");
//         $("#context-div").addClass("ConWrap");
//         // 关闭模态
//         $('#carInfoDiv').modal('close');
//     }
// };