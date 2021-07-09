import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import Swal from "sweetalert2";
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

const appSettingAction = require('../../actions/main/AppSettingAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;

const useStyles = makeStyles((theme) => ({
    root:{
        marginBottom: 20,
        minWidth: 800
    },
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead: customTheme.tableHead
}));

function AppSetting(props) {
    const {appSettingReducer, changeStatus, deleteApp, saveModalData} = props;
    const classes = useStyles();

    useEffect(() => {
        let dataStart = props.appSettingReducer.appData.start;
        props.getAppList(paramDeviceType, paramStatus, dataStart);
    }, []);

    // 检索条件
    const [paramDeviceType, setParamDeviceType] = React.useState('');
    const [paramStatus, setParamStatus] = React.useState('');

    // 查询列表
    const queryAppList = () => {
        // 默认第一页
        props.getAppList(paramDeviceType, paramStatus, 0);
    };

    // 上一页
    const getPrePage = () => {
        props.getAppList(paramDeviceType, paramStatus, props.appSettingReducer.appData.start - (props.appSettingReducer.appData.size - 1));
    };

    // 下一页
    const getNextPage = () => {
        props.getAppList(paramDeviceType, paramStatus, props.appSettingReducer.appData.start + (props.appSettingReducer.appData.size - 1));
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
        if(pageType==='new'){
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
        if(errorCount===0){
            saveModalData(pageType, uid, appType, deviceType, forceUpdate, version, versionNum, minVersionNum, url, remark, paramDeviceType, paramStatus);
            setModalOpen(false);
        }
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>App系统</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={10} spacing={1}>
                    <Grid item xs={6} sm={3}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel >系统</InputLabel>
                            <Select label="系统"
                                value={paramDeviceType}
                                onChange={(event, value) => {
                                    setParamDeviceType(event.target.value);
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.DEVICE_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>状态</InputLabel>
                            <Select label="状态"
                                value={paramStatus}
                                onChange={(event, value) => {
                                    setParamStatus(event.target.value);
                                }}
                            >
                                <MenuItem value="">请选择</MenuItem>
                                {sysConst.USE_FLAG.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>

                {/*查询按钮*/}
                <Grid item xs={1}>
                    <Fab color="primary" size="small" onClick={queryAppList}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>

                {/*追加按钮*/}
                <Grid item xs={1}>
                    <Fab color="primary" size="small" onClick={() => {initModal(null)}}>
                        <i className="mdi mdi-plus mdi-24px"/>
                    </Fab>
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead} align="center">App类型</TableCell>
                            <TableCell className={classes.tableHead} align="center">系统类型</TableCell>
                            <TableCell className={classes.tableHead} align="left">版本号</TableCell>
                            <TableCell className={classes.tableHead} align="left">版本序号</TableCell>
                            <TableCell className={classes.tableHead} align="left">最低版本号</TableCell>
                            <TableCell className={classes.tableHead} align="center">强制更新</TableCell>
                            <TableCell className={classes.tableHead} align="center">状态</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appSettingReducer.appData.dataList.map((row) => (
                            <TableRow key={'table-row-' + row.id}>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.APP_TYPE, row.app_type)}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.DEVICE_TYPE, row.device_type)}</TableCell>
                                <TableCell align="left">{row.version}</TableCell>
                                <TableCell align="left">{row.version_num}</TableCell>
                                <TableCell align="left">{row.min_version_num}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.FORCE_UPDATE, row.force_update)}</TableCell>
                                <TableCell align="center">{commonUtil.getJsonValue(sysConst.USE_FLAG, row.status)}</TableCell>
                                <TableCell align="center">
                                    {/* 停用/可用 状态 */}
                                    <Switch color='primary' size="small" name="状态"
                                        checked={row.status==1}
                                        onChange={(e)=>{
                                            changeStatus(row.id, row.status, paramDeviceType, paramStatus)
                                        }}
                                    />

                                    {/* 删除按钮 */}
                                    <IconButton color="primary" edge="start" size="small" onClick={() => {deleteApp(row.id, paramDeviceType, paramStatus)}}>
                                        <i className="mdi mdi-close mdi-24px"/>
                                    </IconButton>

                                    {/* 编辑按钮 */}
                                    <IconButton color="primary" edge="start" size="small" onClick={() => {initModal(row)}}>
                                        <i className="mdi mdi-table-search mdi-24px"/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {appSettingReducer.appData.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={8} align="center">暂无数据</TableCell>
                        </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {appSettingReducer.appData.start > 0 && appSettingReducer.appData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}} onClick={getPrePage}>上一页</Button>}
                {appSettingReducer.appData.dataSize >= appSettingReducer.appData.size &&
                <Button variant="contained" color="primary" onClick={getNextPage}>下一页</Button>}
            </Box>

            {/* maxWidth */}
            {/*<MenuItem value="444">xs</MenuItem>*/}
            {/*<MenuItem value="600">sm</MenuItem>*/}
            {/*<MenuItem value="960">md</MenuItem>*/}
            {/*<MenuItem value="1280">lg</MenuItem>*/}
            {/*<MenuItem value="full">xl</MenuItem>*/}

            {/* 模态：新增/修改 */}
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
                <Grid container spacing={1}>
                    {pageType === 'edit' && <Grid item sm={12}><Typography color="primary">App编号：{uid}</Typography></Grid>}
                    <Grid item sm={4}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>App类型</InputLabel>
                            <Select label="App类型"
                                value={appType}
                                onChange={(event, value) => {
                                    setAppType(event.target.value);
                                }}
                                error={validation.appType&&validation.appType!=''}
                            >
                                {sysConst.APP_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                            {(validation.appType&&validation.appType!='') && <FormHelperText style={{color: 'red'}}>{validation.appType}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>系统类型</InputLabel>
                            <Select label="系统类型"
                                value={deviceType}
                                onChange={(event, value) => {
                                    setDeviceType(event.target.value);
                                }}
                                error={validation.deviceType&&validation.deviceType!=''}
                            >
                                {sysConst.DEVICE_TYPE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                            {(validation.deviceType&&validation.deviceType!='') && <FormHelperText style={{color: 'red'}}>{validation.deviceType}</FormHelperText>}
                        </FormControl>
                    </Grid>
                    <Grid item xs={4}>
                        <FormControl variant="outlined" fullWidth margin="dense">
                            <InputLabel>强制更新</InputLabel>
                            <Select label="强制更新"
                                value={forceUpdate}
                                onChange={(event, value) => {
                                    setForceUpdate(event.target.value);
                                }}
                                error={validation.forceUpdate&&validation.forceUpdate!=''}
                            >
                                {sysConst.FORCE_UPDATE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                            {(validation.forceUpdate&&validation.forceUpdate!='') && <FormHelperText style={{color: 'red'}}>{validation.forceUpdate}</FormHelperText>}
                        </FormControl>
                    </Grid>

                    <Grid item xs={4}>
                        <TextField label="版本号" fullWidth margin="dense" variant="outlined" value={version}
                                   onChange={(e) => {
                                       setVersion(e.target.value)
                                   }}
                                   error={validation.version&&validation.version!=''}
                                   helperText={validation.version}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="版本序号" fullWidth margin="dense" variant="outlined" value={versionNum} type="number"
                                   onChange={(e) => {
                                       setVersionNum(e.target.value)
                                   }}
                                   error={validation.versionNum&&validation.versionNum!=''}
                                   helperText={validation.versionNum}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="最低版本号" fullWidth margin="dense" variant="outlined" value={minVersionNum} type="number"
                                   onChange={(e) => {
                                       setMinVersionNum(e.target.value)
                                   }}
                                   error={validation.minVersionNum&&validation.minVersionNum!=''}
                                   helperText={validation.minVersionNum}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <TextField label="下载地址" fullWidth margin="dense" variant="outlined" value={url}
                                   onChange={(e) => {
                                       setUrl(e.target.value)
                                   }}
                                   error={validation.url&&validation.url!=''}
                                   helperText={validation.url}
                        />

                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="备注" fullWidth margin="dense" variant="outlined" multiline rows={4} value={remark}
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
        appSettingReducer: state.AppSettingReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    getAppList: (paramDeviceType, paramStatus, dataStart) => {
        dispatch(appSettingAction.getAppList({paramDeviceType, paramStatus, dataStart}))
    },
    changeStatus: (id, status, paramDeviceType, paramStatus) => {
        Swal.fire({
            title: status === 1 ? "确定停用该数据？" : "确定重新启用该数据？",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(appSettingAction.changeStatus(id, status, {paramDeviceType, paramStatus}));
            }
        });
    },
    deleteApp: (id, paramDeviceType, paramStatus) => {
        Swal.fire({
            title: "确定删除该App版本",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(appSettingAction.deleteApp(id, {paramDeviceType, paramStatus}));
            }
        });
    },
    saveModalData: (pageType, uid, appType, deviceType, forceUpdate, version, versionNum, minVersionNum, url, remark, paramDeviceType, paramStatus) => {
        dispatch(appSettingAction.saveModalData({
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
        }, {paramDeviceType, paramStatus}));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppSetting)
