import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
// 引入material-ui基础组件
import {
    Box,
    Button,
    Divider,
    Fab,
    FormControl,
    Grid,
    IconButton,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from '@material-ui/pickers';
// 引入Dialog
import {SimpleModal} from "../index";
import {CommonActionType, StorageCheckActionType} from "../../types";

const storageCheckAction = require('../../actions/main/StorageCheckAction');
const commonAction = require('../../actions/layout/CommonAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;

const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead:customTheme.tableHead,
    pdfPage:customTheme.pdfPage,
    pdfTitle:customTheme.pdfTitle,
    tblHeader:customTheme.tblHeader,
    tblLastHeader:customTheme.tblLastHeader,
    tblBody:customTheme.tblBody,
    tblLastBody:customTheme.tblLastBody
}));

function StorageCheck(props) {
    const {storageCheckReducer, commonReducer, saveModalData, downLoadCsv, downLoadPDF, fromDetail} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    // 查询列表
    const queryStorageCheckList = () => {
        // 默认第一页
        props.getStorageCheckList(0);
    };

    // 上一页
    const getPrePage = () => {
        props.getStorageCheckList(props.storageCheckReducer.storageCheckData.start - (props.storageCheckReducer.storageCheckData.size - 1));
    };

    // 下一页
    const getNextPage = () => {
        props.getStorageCheckList(props.storageCheckReducer.storageCheckData.start + (props.storageCheckReducer.storageCheckData.size - 1));
    };

    useEffect(() => {
        // 详情页面 返回 保留reducer，否则，清空
        if (!fromDetail) {
            let queryParams = {
                dateIdStart: '',
                dateIdEnd: '',
                checkStatus: null,
                status: null
            };
            dispatch(StorageCheckActionType.setQueryParams(queryParams));
        }
        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        props.getStorageCheckList(props.storageCheckReducer.storageCheckData.start);
    }, []);

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 关闭模态
    const closeModal = () => {
        setModalOpen(false);
    };

    // 仓库
    const [storage, setStorage] = React.useState(null);
    // 仓库分区
    const [storageArea, setStorageArea] = React.useState(null);
    // 商品分类
    const [category, setCategory] = React.useState(null);
    // 商品子分类
    const [categorySub, setCategorySub] = React.useState(null);
    // 品牌
    const [brand, setBrand] = React.useState(null);
    // 品牌型号
    const [brandModel, setBrandModel] = React.useState(null);
    // 供应商
    const [supplier, setSupplier] = React.useState(null);
    // 备注
    const [remark, setRemark] = React.useState('');
    //  描述
    const [desc, setDesc] = React.useState('全部');

    //初始添加模态框值
    const initModal =() =>{
        // 清空仓库分区
        props.setStorageAreaList([]);
        // 清空商品子分类
        props.setCategorySubList([]);
        // 清空品牌型号
        props.setBrandModelList([]);

        setStorage(null);
        setStorageArea(null);
        setCategory(null);
        setCategorySub(null);
        setBrand(null);
        setBrandModel(null);
        setSupplier(null);
        setRemark('');
        // 设定模态打开
        setModalOpen(true);
    };

    useEffect(() => {
        let desc = "";
        if (storage != null) {
            desc = desc + "仓库：" + storage.storage_name + ",";
        }
        if (storageArea != null) {
            desc = desc + "仓库分区：" + storageArea.storage_area_name + ",";
        }
        if (category != null) {
            desc = desc + "商品分类：" + category.category_name + ",";
        }
        if (categorySub != null) {
            desc = desc + "商品子分类：" + categorySub.category_sub_name + ",";
        }
        if (brand != null) {
            desc = desc + "品牌：" + brand.brand_name + ",";
        }
        if (brandModel != null) {
            desc = desc + "品牌型号：" + brandModel.brand_model_name + ",";
        }
        if (supplier != null) {
            desc = desc + "供应商：" + supplier.supplier_name + ",";
        }

        if(desc.length > 0) {
            desc = desc.substr(0, desc.length-1);
        } else {
            desc = "全部";
        }
        setDesc(desc);
    }, [storage,storageArea,category,categorySub,brand,brandModel,supplier]);

    const submitModal= ()=>{
        saveModalData(storage,storageArea,category,categorySub,brand,brandModel,supplier,remark,desc);
        setModalOpen(false);
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>仓库盘点</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={10} spacing={1}>
                    <Grid item xs={3}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="盘点日期（始）"
                                    value={storageCheckReducer.queryParams.dateIdStart=="" ? null : storageCheckReducer.queryParams.dateIdStart}
                                    onChange={(date)=>{
                                        dispatch(StorageCheckActionType.setQueryParam({name: "dateIdStart", value: date}))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="盘点日期（终）"
                                    value={storageCheckReducer.queryParams.dateIdEnd=="" ? null : storageCheckReducer.queryParams.dateIdEnd}
                                    onChange={(date)=>{
                                        dispatch(StorageCheckActionType.setQueryParam({name: "dateIdEnd", value: date}))
                                    }}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>盘点状态</InputLabel>
                            <Select label="盘点状态"
                                value={storageCheckReducer.queryParams.checkStatus}
                                onChange={(e, value) => {
                                    dispatch(StorageCheckActionType.setQueryParam({name: "checkStatus", value: e.target.value}));
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.STORAGE_CHECK_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={3}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>完成状态</InputLabel>
                            <Select label="完成状态"
                                value={storageCheckReducer.queryParams.status}
                                onChange={(e, value) => {
                                    dispatch(StorageCheckActionType.setQueryParam({name: "status", value: e.target.value}));
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.STORAGE_RET_STATUS.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/*查询按钮*/}
                <Grid item xs={1} style={{textAlign:'right'}}>
                    <Fab color="primary" size="small" onClick={queryStorageCheckList}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>

                {/*追加按钮*/}
                <Grid item xs={1} style={{textAlign:'right'}}>
                    <Fab color="primary" size="small" onClick={() => {initModal()}}>
                        <i className="mdi mdi-plus mdi-24px"/>
                    </Fab>
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead} align="center">盘点日期</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作人员</TableCell>
                            <TableCell className={classes.tableHead} align="center">计划盘点数</TableCell>
                            <TableCell className={classes.tableHead} align="center">盘点完成数</TableCell>
                            <TableCell className={classes.tableHead} align="center">盘点状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">完成状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {storageCheckReducer.storageCheckData.dataList.map((row) => (
                            <TableRow key={row.id}>
                                <TableCell align="center">{row.date_id == 0 ? '' : row.date_id}</TableCell>
                                <TableCell align="center">{row.real_name}</TableCell>
                                <TableCell align="center">{row.plan_check_count}</TableCell>
                                <TableCell align="center">{row.checked_count}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.STORAGE_CHECK_STATUS, row.check_status)}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.STORAGE_RET_STATUS, row.status)}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" edge="start" size="small" onClick={()=>{downLoadCsv(row.id)}}>
                                        <i className="mdi mdi-file-excel"/>
                                    </IconButton>
                                    <IconButton color="primary" edge="start" size="small" onClick={()=>{downLoadPDF(row)}}>
                                        <i className="mdi mdi-file-pdf"/>
                                    </IconButton>
                                    {/* 编辑按钮 */}
                                    <IconButton color="primary" edge="start" size="small">
                                        <Link to={{pathname: '/storage_check/' + row.id}}>
                                            <i className="mdi mdi-table-search"/>
                                        </Link>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {storageCheckReducer.storageCheckData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={7} align="center">暂无数据</TableCell>
                        </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {storageCheckReducer.storageCheckData.start > 0 && storageCheckReducer.storageCheckData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}} onClick={getPrePage}>上一页</Button>}
                {storageCheckReducer.storageCheckData.dataSize >= storageCheckReducer.storageCheckData.size &&
                <Button variant="contained" color="primary" onClick={getNextPage}>下一页</Button>}
            </Box>

            <SimpleModal
                maxWidth={'sm'}
                title="新增仓库盘点"
                open={modalOpen}
                onClose={closeModal}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" color="primary" onClick={submitModal}>确定</Button>
                        <Button variant="contained" onClick={closeModal}>关闭</Button>
                    </>
                }
            >
                <Grid container spacing={2}>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.storageList}
                                      getOptionLabel={(option) => option.storage_name}
                                      value={storage}
                                      onChange={(event, value) => {
                                          setStorage(value);
                                          setStorageArea(null);
                                          // 仓库有选择时，取得仓库分区， 否则清空
                                          if (value != null) {
                                              props.getStorageAreaList(value.id);
                                          } else {
                                              props.setStorageAreaList([]);
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="仓库" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.storageAreaList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.storage_area_name}
                                      value={storageArea}
                                      onChange={(event, value) => {
                                          setStorageArea(value);
                                      }}
                                      renderInput={(params) => <TextField {...params} label="仓库分区" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.categoryList}
                                      getOptionLabel={(option) => option.category_name}
                                      value={category}
                                      onChange={(event, value) => {
                                          setCategory(value);
                                          setCategorySub(null);
                                          // 商品分类有选择时，取得商品子分类， 否则清空
                                          if (value != null) {
                                              props.getCategorySubList(value.id);
                                          } else {
                                              props.setCategorySubList([]);
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="商品分类" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.categorySubList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.category_sub_name}
                                      value={categorySub}
                                      onChange={(event, value) => {
                                          setCategorySub(value);
                                      }}
                                      renderInput={(params) => <TextField {...params} label="商品子分类" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.brandList}
                                      getOptionLabel={(option) => option.brand_name}
                                      value={brand}
                                      onChange={(event, value) => {
                                          setBrand(value);
                                          setBrandModel(null);
                                          // 品牌有选择时，取得品牌型号， 否则清空
                                          if (value != null) {
                                              props.getBrandModelList(value.id);
                                          } else {
                                              props.setBrandModelList([]);
                                          }
                                      }}
                                      renderInput={(params) => <TextField {...params} label="品牌" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.brandModelList}
                                      noOptionsText="无选项"
                                      getOptionLabel={(option) => option.brand_model_name}
                                      value={brandModel}
                                      onChange={(event, value) => {
                                          setBrandModel(value);
                                      }}
                                      renderInput={(params) => <TextField {...params} label="品牌型号" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item sm={6}>
                        <Autocomplete fullWidth
                                      options={commonReducer.supplierList}
                                      getOptionLabel={(option) => option.supplier_name}
                                      value={supplier}
                                      onChange={(event, value) => {
                                          setSupplier(value);
                                      }}
                                      renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={2} value={remark}
                                   onChange={(e) => {
                                       setRemark(e.target.value)
                                   }}
                        />
                    </Grid>
                </Grid>
            </SimpleModal>

            {/* PDF 输出用 DIV */}
            <div id="pdf" className={classes.pdfPage} style={{marginTop: -99998}}>
                <Grid container spacing={0}>
                    <Grid item sm={12} className={classes.pdfTitle}>仓库盘点</Grid>
                    <Grid item sm={2}><img style={{width: 120,paddingLeft:30}} src="/logo120.png"  alt=""/></Grid>
                    <Grid item container sm={10} spacing={0}>
                        <Grid item sm={6}><b>盘点ID：</b>{storageCheckReducer.pdfData.id}</Grid>
                        <Grid item sm={6}><b>计划盘点数：</b>{storageCheckReducer.pdfData.plan_check_count}</Grid>
                        <Grid item sm={6}><b>操作人员：</b>{storageCheckReducer.pdfData.real_name}</Grid>
                        <Grid item sm={6}><b>盘点创建时间：</b>{commonUtil.getDateTime(storageCheckReducer.pdfData.created_on)}</Grid>
                        <Grid item sm={12}><b>盘点描述：</b>{storageCheckReducer.pdfData.check_desc}</Grid>
                    </Grid>
                </Grid>

                <Grid container spacing={0} style={{paddingTop: 15}}>
                    <Grid item sm={2} className={classes.tblHeader}>仓库</Grid>
                    <Grid item sm={2} className={classes.tblHeader}>仓库分区</Grid>
                    <Grid item sm={2} className={classes.tblHeader}>商品</Grid>
                    <Grid item sm={1} className={classes.tblHeader}>库存数</Grid>
                    <Grid item sm={1} className={classes.tblHeader}>盘点数</Grid>
                    <Grid item sm={4} className={classes.tblLastHeader}>备注</Grid>
                </Grid>

                {storageCheckReducer.pdfDataList.map((row, index) => (
                    <Grid container spacing={0}>
                        <Grid item sm={2} className={classes.tblBody}>{row.storage_name}</Grid>
                        <Grid item sm={2} className={classes.tblBody}>{row.storage_area_name}</Grid>
                        <Grid item sm={2} className={classes.tblBody}>{row.product_name}</Grid>
                        <Grid item sm={1} className={classes.tblBody}>{row.storage_count}</Grid>
                        <Grid item sm={1} className={classes.tblBody}>{row.check_count}</Grid>
                        <Grid item sm={4} className={classes.tblLastBody}>{row.remark}</Grid>
                    </Grid>
                ))}
            </div>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    let fromDetail = false;
    if (typeof ownProps.location.state != 'undefined' && ownProps.location.state != null && ownProps.location.state.fromDetail) {
        fromDetail = true;
    }
    return {
        storageCheckReducer: state.StorageCheckReducer,
        commonReducer: state.CommonReducer,
        fromDetail: fromDetail
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        dispatch(commonAction.getStorageList());
        dispatch(commonAction.getCategoryList());
        dispatch(commonAction.getBrandList());
        dispatch(commonAction.getSupplierList());
    },
    // select控件，联动检索
    getStorageAreaList: (storageId) => {
        dispatch(commonAction.getStorageAreaList(storageId));
    },
    setStorageAreaList: (value) => {
        dispatch(CommonActionType.setStorageAreaList(value));
    },
    getCategorySubList: (categoryId) => {
        dispatch(commonAction.getCategorySubList(categoryId));
    },
    setCategorySubList: (value) => {
        dispatch(CommonActionType.setCategorySubList(value));
    },
    getBrandModelList: (brandId) => {
        dispatch(commonAction.getBrandModelList(brandId));
    },
    setBrandModelList: (value) => {
        dispatch(CommonActionType.setBrandModelList(value));
    },

    getStorageCheckList: (dataStart) => {
        dispatch(storageCheckAction.getStorageCheckList({dataStart}))
    },
    saveModalData: (storage,storageArea,category,categorySub,brand,brandModel,supplier,remark,desc) => {
        dispatch(storageCheckAction.saveModalData({
            storage,storageArea,category,categorySub,brand,brandModel,supplier,remark,desc
        }));
    },
    downLoadCsv: (storageCheckId) => {
        dispatch(storageCheckAction.downLoadCsv(storageCheckId))
    },
    downLoadPDF: (storageCheckInfo) => {
        dispatch(StorageCheckActionType.setPdfData(storageCheckInfo));
        dispatch(storageCheckAction.downLoadPDF(storageCheckInfo.id));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StorageCheck)
