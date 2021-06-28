import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
// 引入material-ui基础组件
import {
    Box,
    Grid,
    IconButton,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableBody,
    TableCell,
    TableContainer,
    Paper,
    Typography,
    Divider,
    Select,Switch,
    Button, Fab, FormControl, InputLabel, MenuItem,FormHelperText, makeStyles
} from "@material-ui/core";

// 引入Dialog
import {SimpleModal} from "../index";
import Swal from "sweetalert2";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {AuthoritySettingActionType} from "../../types";

const productManagerAction = require('../../actions/main/ProductManagerAction');
const commonAction = require('../../actions/layout/CommonAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;

const useStyles = makeStyles((theme) => ({
    root:{
        marginBottom: 20,
    },
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableRow: {
        padding: 5,
    },
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'
    }
}));

function ProductManager(props) {
    const {productManagerReducer, commonReducer, changeStatus, saveModalData} = props;
    const classes = useStyles();

    useEffect(() => {
        // 取得画面 select控件，基础数据
        props.getBaseSelectList();
        let dataStart = props.productManagerReducer.productData.start;
        props.getProductList(dataStart);
    }, []);

    // 检索条件
    const [paramCategory, setParamCategory] = React.useState(null);
    const [paramCategorySub, setParamCategorySub] = React.useState(null);

    // 查询列表
    const queryProductList = () => {
        // 默认第一页
        props.getProductList(0);
    };

    // 上一页
    const getPrePage = () => {
        props.getProductList(props.productManagerReducer.productData.start - (props.productManagerReducer.productData.size - 1));
    };

    // 下一页
    const getNextPage = () => {
        props.getProductList(props.productManagerReducer.productData.start + (props.productManagerReducer.productData.size - 1));
    };

    // 模态属性
    const [modalOpen, setModalOpen] = React.useState(false);
    // 关闭模态
    const closeModal = () => {
        setModalOpen(false);
    };
    // 新增 区分
    const [pageType, setPageType] = React.useState('');
    // App Id
    const [uid, setUid] = React.useState(-1);
    // App类型
    const [appType, setAppType] = React.useState(null);
    // 系统类型
    const [deviceType, setDeviceType] = React.useState(null);
    // 强制更新
    const [forceUpdate, setForceUpdate] = React.useState(null);
    // 版本号
    const [version, setVersion] = React.useState('');
    // 版本序号
    const [versionNum, setVersionNum] = React.useState(0);
    // 最低版本号
    const [minVersionNum, setMinVersionNum] = React.useState(0);
    // 下载地址
    const [url, setUrl] = React.useState('');
    // 备注
    const [remark, setRemark] = React.useState('');

    //初始添加模态框值
    const initModal =(data) =>{
        // 设定模态打开
        setModalOpen(true);
        // 清楚check内容
        setValidation({});
        // 新建 / 修改
        if (data == null) {
            setPageType('new');
            setAppType('');
            setDeviceType('');
            setForceUpdate('');
            setVersion('');
            setVersionNum('');
            setMinVersionNum('');
            setUrl('');
            setRemark('');
        } else {
            setPageType('edit');
            setUid(data.id);
            setAppType(data.app_type);
            setDeviceType(data.device_type);
            setForceUpdate(data.force_update);
            setVersion(data.version);
            setVersionNum(data.version_num);
            setMinVersionNum(data.min_version_num);
            setUrl(data.url);
            setRemark(data.remarks);
        }
    };

    const [validation,setValidation] = useState({});
    const validate = ()=>{
        const validateObj ={};
        if(pageType=='new'){
            if (!appType) {
                validateObj.appType ='请选择App类型';
            }
            if (!deviceType) {
                validateObj.deviceType ='请选择系统类型';
            }
            if (!forceUpdate) {
                validateObj.forceUpdate ='请选择强制更新';
            }
        }
        if (!version) {
            validateObj.version ='请输入版本号';
        }
        if (!versionNum) {
            validateObj.versionNum ='请输入版本序号';
        }
        if (!minVersionNum) {
            validateObj.minVersionNum ='请输入最低版本号';
        }
        if (!url) {
            validateObj.url ='请输入下载地址';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };

    const submitModal= ()=>{
        const errorCount = validate();
        if(errorCount==0){
            saveModalData(pageType, uid, appType, deviceType, forceUpdate, version, versionNum, minVersionNum, url, remark);
            setModalOpen(false);
        }
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>商品</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={10} spacing={3}>
                    <Grid item xs={3}>
                        <Autocomplete id="condition-category" fullWidth={true}
                                      options={commonReducer.categoryList}
                                      getOptionLabel={(option) => option.label}
                                      onChange={(event, value) => {
                                          setParamCategory(value);
                                      }}
                                      value={paramCategory}
                                      renderInput={(params) => <TextField {...params} label="商品分类" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Autocomplete id="condition-category-sub" fullWidth={true}
                                      options={commonReducer.categorySubList}
                                      getOptionLabel={(option) => option.label}
                                      onChange={(event, value) => {
                                          setParamCategorySub(value);
                                      }}
                                      value={paramCategorySub}
                                      renderInput={(params) => <TextField {...params} label="商品子分类" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                </Grid>

                {/*查询按钮*/}
                <Grid item xs={1}>
                    <Fab color="primary" aria-label="add" size="small" onClick={queryProductList}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>

                {/*追加按钮*/}
                <Grid item xs={1}>
                    <Fab color="primary" aria-label="add" size="small" onClick={() => {initModal(null)}}>
                        <i className="mdi mdi-plus mdi-24px"/>
                    </Fab>
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader aria-label="sticky table" style={{minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell padding="default" className={classes.head} align="left">商品名称</TableCell>
                            <TableCell padding="default" className={classes.head} align="left">商品别名</TableCell>
                            <TableCell padding="default" className={classes.head} align="left">序列号</TableCell>
                            <TableCell padding="default" className={classes.head} align="left">产地</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">标准类型</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">单位</TableCell>
                            <TableCell padding="default" className={classes.head} align="right">售价</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">状态</TableCell>
                            <TableCell padding="default" className={classes.head} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {productManagerReducer.productData.dataList.map((row) => (
                            <TableRow className={classes.tableRow}>
                                <TableCell padding="none" align="left">{row.product_name}</TableCell>
                                <TableCell padding="none" align="left">{row.product_s_name}</TableCell>
                                <TableCell padding="none" align="left">{row.product_serial}</TableCell>
                                <TableCell padding="none" align="left">{row.product_address}</TableCell>
                                <TableCell padding="none"
                                           align="center">{commonUtil.getJsonValue(sysConst.STANDARD_TYPE, row.standard_type)}</TableCell>
                                <TableCell padding="none" align="center">{row.unit_name}</TableCell>
                                <TableCell padding="none" align="right">{row.price}</TableCell>
                                <TableCell padding="none"
                                           align="center">{commonUtil.getJsonValue(sysConst.USE_FLAG, row.status)}</TableCell>
                                <TableCell padding="none" align="center">
                                    {/* 停用/可用 状态 */}
                                    <Switch
                                        checked={row.status==1}
                                        onChange={(e)=>{changeStatus(row.id, row.status)}}
                                        name="状态"
                                        color='primary'
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />

                                    {/* 编辑按钮 */}
                                    <IconButton color="primary" edge="start" onClick={() => {initModal(row)}}>
                                        <i className="mdi mdi-table-search mdi-24px"/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {productManagerReducer.productData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={8} style={{textAlign: 'center'}}>暂无数据</TableCell>
                        </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {productManagerReducer.productData.start > 0 && productManagerReducer.productData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}} onClick={getPrePage}>上一页</Button>}
                {productManagerReducer.productData.dataSize >= productManagerReducer.productData.size &&
                <Button variant="contained" color="primary" onClick={getNextPage}>下一页</Button>}
            </Box>

            {/* maxWidth */}
            {/*<MenuItem value="444">xs</MenuItem>*/}
            {/*<MenuItem value="600">sm</MenuItem>*/}
            {/*<MenuItem value="960">md</MenuItem>*/}
            {/*<MenuItem value="1280">lg</MenuItem>*/}
            {/*<MenuItem value="full">xl</MenuItem>*/}

            {/* 模态：新增/修改 高中信息 */}
            <SimpleModal
                maxWidth={'sm'}
                title={pageType === 'edit' ? '修改App' : '新增App'}
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
                    {pageType === 'edit' && <Grid item sm={12}><Typography color="primary">App编号：{uid}</Typography></Grid>}
                    <Grid item sm={4}>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="app-type-select-outlined-label">App类型</InputLabel>
                            <Select
                                label="App类型"
                                labelId="app-type-select-outlined-label"
                                id="app-type-select-outlined"
                                value={appType}
                                onChange={(event, value) => {
                                    setAppType(event.target.value);
                                }}
                                error={validation.appType&&validation.appType!=''}
                            >
                                {sysConst.APP_TYPE.map((item, index) => (
                                    <MenuItem value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                            {(validation.appType&&validation.appType!='') && <FormHelperText style={{color: 'red'}}>{validation.appType}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="sys-type-select-outlined-label">系统类型</InputLabel>
                            <Select
                                label="系统类型"
                                labelId="sys-type-select-outlined-label"
                                id="sys-type-select-outlined"
                                value={deviceType}
                                onChange={(event, value) => {
                                    setDeviceType(event.target.value);
                                }}
                                error={validation.deviceType&&validation.deviceType!=''}
                            >
                                {sysConst.DEVICE_TYPE.map((item, index) => (
                                    <MenuItem value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                            {(validation.deviceType&&validation.deviceType!='') && <FormHelperText style={{color: 'red'}}>{validation.deviceType}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" fullWidth={true} margin="dense">
                            <InputLabel id="force-update-select-outlined-label">强制更新</InputLabel>
                            <Select
                                label="强制更新"
                                labelId="force-update-select-outlined-label"
                                id="force-update-select-outlined"
                                value={forceUpdate}
                                onChange={(event, value) => {
                                    setForceUpdate(event.target.value);
                                }}
                                error={validation.forceUpdate&&validation.forceUpdate!=''}
                            >
                                {sysConst.FORCE_UPDATE.map((item, index) => (
                                    <MenuItem value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                            {(validation.forceUpdate&&validation.forceUpdate!='') && <FormHelperText style={{color: 'red'}}>{validation.forceUpdate}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField label="版本号" fullWidth={true} margin="dense" variant="outlined" value={version}
                                   onChange={(e) => {
                                       setVersion(e.target.value)
                                   }}
                                   error={validation.version&&validation.version!=''}
                                   helperText={validation.version}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="版本序号" fullWidth={true} margin="dense" variant="outlined" value={versionNum} type="number"
                                   onChange={(e) => {
                                       setVersionNum(e.target.value)
                                   }}
                                   error={validation.versionNum&&validation.versionNum!=''}
                                   helperText={validation.versionNum}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="最低版本号" fullWidth={true} margin="dense" variant="outlined" value={minVersionNum} type="number"
                                   onChange={(e) => {
                                       setMinVersionNum(e.target.value)
                                   }}
                                   error={validation.minVersionNum&&validation.minVersionNum!=''}
                                   helperText={validation.minVersionNum}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="下载地址" fullWidth={true} margin="dense" variant="outlined" value={url}
                                   onChange={(e) => {
                                       setUrl(e.target.value)
                                   }}
                                   error={validation.url&&validation.url!=''}
                                   helperText={validation.url}
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="备注" fullWidth={true} margin="dense" variant="outlined" multiline rows={4} value={remark}
                                   onChange={(e) => {
                                       setRemark(e.target.value)
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
        productManagerReducer: state.ProductManagerReducer,
        commonReducer: state.CommonReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    // 取得画面 select控件，基础数据
    getBaseSelectList: () => {
        dispatch(commonAction.getCategoryList());
        dispatch(commonAction.getCategorySubList(''));
        dispatch(commonAction.getBrandList());
        dispatch(commonAction.getBrandModelList(''));
    },
    getProductList: (dataStart) => {
        dispatch(productManagerAction.getProductList({dataStart}))
    },



    changeStatus: (id, status) => {
        Swal.fire({
            title: status === 1 ? "确定停用该数据？" : "确定重新启用该数据？",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(productManagerAction.changeStatus(id, status));
            }
        });
    },
    saveModalData: (pageType, uid, appType, deviceType, forceUpdate, version, versionNum, minVersionNum, url, remark) => {
        dispatch(productManagerAction.saveModalData({
            pageType,
            uid,
            appType,
            deviceType,
            forceUpdate,
            version,
            versionNum,
            minVersionNum,
            url,
            remark
        }));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductManager)
