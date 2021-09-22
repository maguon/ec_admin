import React, {useEffect} from 'react';
import {Link, useParams} from "react-router-dom";
import {connect, useDispatch} from 'react-redux';
import Swal from "sweetalert2";
// 引入material-ui基础组件
import {Button,Checkbox,Divider,FormControlLabel,Grid,IconButton,makeStyles,TextField,Typography} from "@material-ui/core";
import {CommonActionType, StorageCheckDetailActionType} from "../../types";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {SimpleModal} from "../index";
import {DatePicker} from "@material-ui/pickers";

const storageCheckDetailAction = require('../../actions/main/StorageCheckDetailAction');
const storageCheckAction = require('../../actions/main/StorageCheckAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const commonAction = require('../../actions/layout/CommonAction');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider
}));

function StorageCheck(props) {
    const {storageCheckDetailReducer, commonReducer, confirmCheck, downLoadCsv, downLoadPDF} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useParams();

    useEffect(() => {
        props.getBaseSelectList();
        props.getStorageCheckInfo(id);
    }, []);

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    const [uniqueModalOpen, setUniqueModalOpen] = React.useState(false);
    // 模态数据
    const [modalData, setModalData] = React.useState({uniqueArray:[]});
    // 模态校验
    const [validation,setValidation] = React.useState({});

    //初始添加模态框值
    const initModal =(storageCheckId) =>{
        // 清check内容
        setValidation({});
        // 清空仓库分区
        dispatch(CommonActionType.setStorageAreaList([]));
        // 初始化模态数据
        setModalData({
            ...modalData,
            storageCheckId: storageCheckId,
            storage: null,
            storageArea: null,
            supplier: null,
            product: null,
            checkCount: '',
            unitCost: '',
            storageDateId: null,
            remark: ''
        });
        // 设定模态打开
        setModalOpen(true);
    };

    const validateModal = ()=>{
        const validateObj ={};
        if (!modalData.storage) {
            validateObj.storage ='请选择仓库';
        }
        if (!modalData.storageArea) {
            validateObj.storageArea ='请选择仓库分区';
        }
        if (!modalData.product) {
            validateObj.product ='请选择商品';
        }
        if (!modalData.checkCount) {
            validateObj.checkCount ='请输入盘点数';
        }
        if (!modalData.unitCost) {
            validateObj.unitCost ='请输入商品单价';
        }
        if (!modalData.storageDateId) {
            validateObj.storageDateId ='请输入仓储日期';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };

    const submitModal= ()=>{
        const errorCount = validateModal();
        if(errorCount===0){
            dispatch(storageCheckDetailAction.saveModalData(modalData));
            setModalOpen(false);
        }
    };

    const submitUniqueModal= (type)=>{
        let uniqueArray = [];
        modalData.uniqueArray.forEach((item) => {
            if (item.checked === true) {
                uniqueArray.push(item.unique_id)
            }
        });
        dispatch(StorageCheckDetailActionType.setDetailList({name: "check_count", value: modalData.selectedNum, index: modalData.dataIndex}));
        dispatch(StorageCheckDetailActionType.setDetailList({name: "check_unique_arr", value: uniqueArray, index: modalData.dataIndex}));
        setUniqueModalOpen(false);
        if (type === 'submit') {
            dispatch(storageCheckDetailAction.saveStorageCheckRel(storageCheckDetailReducer.detailList[modalData.dataIndex]));
        }
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>
                <Link to={{pathname: '/storage_check', state: {fromDetail: true}}}>
                    <IconButton color="primary" edge="start">
                        <i className="mdi mdi-arrow-left-bold"/>
                    </IconButton>
                </Link>
                仓库盘点 - {storageCheckDetailReducer.storageCheckInfo.id}
            </Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分 */}
            <Grid container spacing={1}>
                <Grid item sm={3}>
                    <TextField label="计划盘点数" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={storageCheckDetailReducer.storageCheckInfo.plan_check_count}/>
                </Grid>
                <Grid item sm={3}>
                    <TextField label="盘点完成数" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={storageCheckDetailReducer.storageCheckInfo.checked_count}/>
                </Grid>
                <Grid item sm={3}>
                    <TextField label="盘点状态" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={commonUtil.getJsonValue(sysConst.STORAGE_CHECK_STATUS, storageCheckDetailReducer.storageCheckInfo.check_status)}/>
                </Grid>
                <Grid item sm={3}>
                    <TextField label="完成状态" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                               value={commonUtil.getJsonValue(sysConst.STORAGE_RET_STATUS, storageCheckDetailReducer.storageCheckInfo.status)}/>
                </Grid>
                <Grid item sm={12}>
                    <TextField label="盘点描述" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled multiline rows="2"
                               value={storageCheckDetailReducer.storageCheckInfo.check_desc}/>
                </Grid>
                <Grid item sm={12}>
                    <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows="2" InputLabelProps={{ shrink: true }}
                               disabled={storageCheckDetailReducer.storageCheckInfo.status == sysConst.STORAGE_RET_STATUS[1].value}
                               value={storageCheckDetailReducer.storageCheckInfo.remark}
                               onChange={(e) => {
                                   dispatch(StorageCheckDetailActionType.setStorageCheckInfo({name: "remark", value: e.target.value}))
                               }}
                    />
                </Grid>
                {storageCheckDetailReducer.storageCheckInfo.status == sysConst.STORAGE_RET_STATUS[0].value &&
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" style={{float:'right', marginLeft: 20}} onClick={()=>{confirmCheck(storageCheckDetailReducer.storageCheckInfo)}}>完成</Button>
                    <Button variant="contained" color="primary" style={{float:'right',marginLeft: 20}} onClick={()=>{dispatch(storageCheckDetailAction.saveStorageCheck())}}>保存</Button>
                </Grid>}
                <Grid item xs={12}>
                    <Typography color={"primary"}>盘点详情
                        <IconButton color="primary" edge="start" style={{marginLeft:1}} onClick={()=>{downLoadCsv(storageCheckDetailReducer.storageCheckInfo.id)}}>
                            <i className="mdi mdi-file-excel mdi-24px"/>
                        </IconButton>
                        <IconButton color="primary" edge="start" onClick={()=>{downLoadPDF(storageCheckDetailReducer.storageCheckInfo)}}>
                            <i className="mdi mdi-file-pdf mdi-24px"/>
                        </IconButton>
                        {/*{storageCheckDetailReducer.storageCheckInfo.status == sysConst.STORAGE_RET_STATUS[0].value &&*/}
                        {/*<IconButton color="primary" edge="start" size="small" onClick={()=>{initModal(storageCheckDetailReducer.storageCheckInfo.id)}}>盈</IconButton>}*/}
                    </Typography>
                </Grid>
            </Grid>

            {/* 下部分 */}
            {storageCheckDetailReducer.detailList.map((row, index) => (
                <Grid container spacing={1} key={index}>
                    <Grid item sm={2}>
                        <TextField label="仓库" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                                   value={row.storage_name}/>
                    </Grid>
                    <Grid item sm={2}>
                        <TextField label="仓库分区" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                                   value={row.storage_area_name}/>
                    </Grid>
                    <Grid item sm={2}>
                        <TextField label="商品" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                                   value={row.product_name}/>
                    </Grid>
                    <Grid item sm={1}>
                        <TextField label="是否全新" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                                   value={commonUtil.getJsonValue(sysConst.OLD_FLAG, row.old_flag)}/>
                    </Grid>
                    <Grid item sm={1}>
                        <TextField label="库存数" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} disabled
                                   value={row.storage_count}/>
                    </Grid>
                    <Grid item sm={1}>
                        <TextField label="盘点数" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }} type="number"
                                   disabled={storageCheckDetailReducer.storageCheckInfo.status == sysConst.STORAGE_RET_STATUS[1].value || row.unique_flag == sysConst.UNIQUE_FLAG[1].value}
                                   value={row.check_count}
                                   onChange={(e) => {
                                       dispatch(StorageCheckDetailActionType.setDetailList({name: "check_count", value: e.target.value, index: index}))
                                   }}
                        />
                    </Grid>
                    <Grid item container sm={3}>
                        <Grid item sm={10}>
                            <TextField label="备注" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                    disabled={storageCheckDetailReducer.storageCheckInfo.status == sysConst.STORAGE_RET_STATUS[1].value}
                                    value={row.remark == null ? '' : row.remark}
                                    onChange={(e) => {
                                        dispatch(StorageCheckDetailActionType.setDetailList({name: "remark", value: e.target.value, index: index}))
                                    }}
                            />
                        </Grid>

                        {storageCheckDetailReducer.storageCheckInfo.status == sysConst.STORAGE_RET_STATUS[0].value &&
                        <Grid item xs={1} align="center">
                            <IconButton>
                                {/* check_status = 0 ,未check， = 1，则是正常 */}
                                <i className={`mdi ${row.check_status === sysConst.STORAGE_CHECK_STATUS[0].value ? 'mdi-check-circle-outline blue' : (row.check_status === sysConst.STORAGE_CHECK_STATUS[1].value ? 'mdi-check-circle green' : 'mdi-alert-circle-outline red')} mdi-24px`}
                                onClick={()=>{
                                    if (row.check_count === '') {
                                        Swal.fire("盘点数不能为空，请输入", '', "warning");
                                    } else {
                                        dispatch(storageCheckDetailAction.saveStorageCheckRel(row));
                                    }
                                }}/>
                            </IconButton>
                        </Grid>}

                        <Grid item xs={1} align="center">
                            <IconButton disabled={row.unique_flag == sysConst.UNIQUE_FLAG[0].value}>
                                <i className="mdi mdi-barcode-scan" onClick={()=>{
                                    setUniqueModalOpen(true);
                                    setValidation({});
                                    let prodUnique = row.prod_unique_arr == null ? [] : row.prod_unique_arr;
                                    let checkUnique = row.check_unique_arr == null ? [] : row.check_unique_arr;
                                    let map = new Map();
                                    prodUnique.forEach((item) => {map.set(item,false)});
                                    checkUnique.forEach((item) => {map.set(item,true)});

                                    let uniqueArray = [];
                                    let selectedNum = 0;
                                    for (let [key, value] of map) {
                                        uniqueArray.push({unique_id : key, checked : value});
                                        if (value == true) {
                                            selectedNum++;
                                        }
                                    }

                                    setModalData({
                                        ...modalData,
                                        dataRow: row,
                                        dataIndex: index,
                                        uniqueId: '',
                                        selectedNum: selectedNum,
                                        selectAll: selectedNum == uniqueArray.length ? true : false,
                                        uniqueMap: map,
                                        uniqueArray: uniqueArray
                                    });
                                }}/>
                            </IconButton>
                        </Grid>
                    </Grid>

                </Grid>
            ))}

            <SimpleModal maxWidth='lg' showFooter title="唯一编码" open={uniqueModalOpen}
                         onClose={()=>{submitUniqueModal('close')}}
                         footer={
                             <>
                                 <Button variant="contained" color="primary" onClick={()=>{submitUniqueModal('submit')}}>确定</Button>
                                 <Button variant="contained" onClick={()=>{submitUniqueModal('close')}}>关闭</Button>
                             </>}
            >
                <Grid container spacing={1}>
                    {storageCheckDetailReducer.storageCheckInfo.status == sysConst.STORAGE_RET_STATUS[0].value &&
                        <>
                            <Grid item sm={11}>
                                <TextField label="新增唯一编码" fullWidth margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                           value={modalData.uniqueId}
                                           onChange={(e) => {
                                               setModalData({...modalData,uniqueId: e.target.value});
                                           }}
                                           error={validation.uniqueId&&validation.uniqueId!=''} helperText={validation.uniqueId}
                                />
                            </Grid>
                            <Grid item sm={1} style={{textAlign:'center'}}>
                                <IconButton color="primary">
                                    <i className="mdi mdi-plus-circle-outline" onClick={()=>{
                                        if (!modalData.uniqueId) {
                                            setValidation({uniqueId: '唯一编码不能为空'});
                                        } else if (modalData.uniqueId.length > 40) {
                                            setValidation({uniqueId: '唯一编码最大40位'});
                                        } else  if (modalData.uniqueMap.has(modalData.uniqueId)) {
                                            setValidation({uniqueId: '唯一编码不能重复'});
                                        } else {
                                            setValidation({});
                                            modalData.uniqueMap.set(modalData.uniqueId, false);
                                            modalData.uniqueArray.push({unique_id : modalData.uniqueId, checked : true});
                                            setModalData({...modalData, selectedNum : modalData.selectedNum + 1, uniqueId: ''});
                                        }
                                    }}/>
                                </IconButton>
                            </Grid>

                            <Grid item sm={12}>
                                <FormControlLabel key="select-all" label="全选"
                                                  control={
                                                      <Checkbox color="primary" key={'select-all-chk'}
                                                                checked={modalData.selectAll}
                                                                onChange={(e) => {
                                                                    modalData.uniqueArray.forEach((item) => {
                                                                        item.checked = e.target.checked;
                                                                    });
                                                                    setModalData({
                                                                        ...modalData,
                                                                        selectAll: e.target.checked,
                                                                        uniqueArray: modalData.uniqueArray,
                                                                        selectedNum: e.target.checked ? modalData.uniqueArray.length : 0
                                                                    });
                                                                }}
                                                      />
                                                  }
                                />
                            </Grid>

                            {modalData.uniqueArray.map((row, index) => (
                                <Grid item sm={4}>
                                    <FormControlLabel key={'checkbox_child_' + index} label={row.unique_id}
                                                      control={
                                                          <Checkbox color="primary" key={'checkbox_child_chk_' + index}
                                                                    checked={row.checked == true}
                                                                    onChange={(e) => {
                                                                        modalData.uniqueArray[index].checked = e.target.checked;
                                                                        let selectedSize = 0;
                                                                        modalData.uniqueArray.forEach((item) => {
                                                                            if (item.checked === true) {
                                                                                selectedSize++;
                                                                            }
                                                                        });
                                                                        setModalData({
                                                                            ...modalData,
                                                                            selectAll: selectedSize === modalData.uniqueArray.length,
                                                                            uniqueArray: modalData.uniqueArray,
                                                                            selectedNum: selectedSize
                                                                        });
                                                                    }}
                                                          />
                                                      }
                                    />
                                </Grid>))}
                        </>
                    }

                    {storageCheckDetailReducer.storageCheckInfo.status != sysConst.STORAGE_RET_STATUS[0].value &&
                        <>
                            {modalData.uniqueArray.map((row, index) => (
                                <>
                                    {row.checked == true && <Grid item sm={4}>{row.unique_id}</Grid>}
                                </>
                                ))}
                        </>
                    }
                </Grid>
            </SimpleModal>

            {/* 提升高度：当盘点详情过多时，避免 最后一条会被footer挡住 */}
            <Grid style={{height: 50}}>&nbsp;</Grid>

            <SimpleModal
                maxWidth={'sm'}
                title="新增盘盈入库"
                open={modalOpen}
                onClose={()=>{setModalOpen(false)}}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" color="primary" onClick={submitModal}>确定</Button>
                        <Button variant="contained" onClick={()=>{setModalOpen(false)}}>关闭</Button>
                    </>
                }
            >
                <Grid container spacing={2}>
                    <Grid item sm={6}>
                        <Autocomplete ListboxProps={{style: {maxHeight: '175px'}}} fullWidth
                                      options={commonReducer.storageList}
                                      getOptionLabel={(option) => option.storage_name}
                                      value={modalData.storage}
                                      onChange={(event, value) => {
                                          setModalData({...modalData,storage:value, storageArea:null});
                                          // 仓库有选择时，取得仓库分区， 否则清空
                                          if (value != null) {
                                              dispatch(commonAction.getStorageAreaList(value.id));
                                          } else {
                                              dispatch(CommonActionType.setStorageAreaList([]));
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"
                                                                          error={validation.storage&&validation.storage!=''}
                                                                          helperText={validation.storage}
                                      />}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete ListboxProps={{style: {maxHeight: '175px'}}} fullWidth
                                      options={commonReducer.storageAreaList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.storage_area_name}
                                      value={modalData.storageArea}
                                      onChange={(event, value) => {
                                          setModalData({...modalData,storageArea:value});
                                      }}
                                      renderInput={(params) => <TextField {...params} label="仓库分区" margin="dense" variant="outlined"
                                                                          error={validation.storageArea&&validation.storageArea!=''}
                                                                          helperText={validation.storageArea}
                                      />}
                        />
                    </Grid>

                    <Grid item sm={6}>
                        <Autocomplete ListboxProps={{style: {maxHeight: '175px'}}} fullWidth
                                      options={commonReducer.supplierList}
                                      getOptionLabel={(option) => option.supplier_name}
                                      value={modalData.supplier}
                                      onChange={(event, value) => {
                                          setModalData({...modalData,supplier:value});
                                      }}
                                      renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete ListboxProps={{style: {maxHeight: '175px'}}} fullWidth
                                      options={commonReducer.productList}
                                      getOptionLabel={(option) => option.product_name}
                                      value={modalData.product}
                                      onChange={(event, value) => {
                                          setModalData({...modalData,product:value});
                                      }}
                                      renderInput={(params) => <TextField {...params} label="商品" margin="dense" variant="outlined"
                                                                          error={validation.product&&validation.product!=''}
                                                                          helperText={validation.product}
                                      />}
                        />
                    </Grid>

                    <Grid item sm={6}>
                        <TextField label="商品单价" fullWidth margin="dense" variant="outlined" type="number"
                                   value={modalData.unitCost}
                                   onChange={(e) => {
                                       setModalData({...modalData,unitCost:e.target.value});
                                   }}
                                   error={validation.unitCost&&validation.unitCost!=''}
                                   helperText={validation.unitCost}
                        />
                    </Grid>

                    <Grid item sm={6}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="仓储日期"
                                    value={modalData.storageDateId == '' ? null : modalData.storageDateId}
                                    onChange={(date)=>{
                                        setModalData({...modalData,storageDateId:date});
                                    }}
                                    error={validation.storageDateId&&validation.storageDateId!=''}
                                    helperText={validation.storageDateId}
                        />
                    </Grid>

                    <Grid item sm={6}>
                        <TextField label="盘点数" fullWidth margin="dense" variant="outlined" type="number"
                                   value={modalData.checkCount}
                                   onChange={(e) => {
                                       setModalData({...modalData,checkCount:e.target.value});
                                   }}
                                   error={validation.checkCount&&validation.checkCount!=''}
                                   helperText={validation.checkCount}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={2} value={modalData.remark}
                                   onChange={(e) => {
                                       setModalData({...modalData,remark:e.target.value});
                                   }}
                        />
                    </Grid>
                </Grid>
            </SimpleModal>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        storageCheckDetailReducer: state.StorageCheckDetailReducer,
        commonReducer: state.CommonReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        dispatch(commonAction.getStorageList());
        dispatch(commonAction.getSupplierList());
        dispatch(commonAction.getProductList(null));
    },
    getStorageCheckInfo: (id) => {
        dispatch(storageCheckDetailAction.getStorageCheckInfo(id));
        dispatch(storageCheckDetailAction.getStorageCheckRelList(id));
    },
    confirmCheck: (storageCheckInfo) => {
        // 计划盘点数 <> 盘点完成数 则不能执行完成操作
        if (storageCheckInfo.plan_check_count != storageCheckInfo.checked_count) {
            Swal.fire("盘点完成数和计划盘点数不相等，不能执行完成", '', "warning");
        } else {
            Swal.fire({
                title: "确定完成该盘点",
                text: "完成后，库存商品将以当前盘点为准！",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "确定",
                cancelButtonText:"取消"
            }).then(async (value) => {
                if (value.isConfirmed) {
                    dispatch(storageCheckDetailAction.changeStorageCheckStatus(storageCheckInfo.id, sysConst.STORAGE_RET_STATUS[1].value));
                }
            });
        }
    },
    downLoadCsv: (storageCheckId) => {
        dispatch(storageCheckAction.downLoadCsv(storageCheckId))
    },
    downLoadPDF: (storageCheckInfo) => {
        dispatch(storageCheckAction.downLoadPDF(storageCheckInfo))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StorageCheck)
