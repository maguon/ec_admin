import React ,{Fragment,useEffect,useState}from 'react';
import {connect} from 'react-redux';
// 引入UI组件
import Select from 'react-select';
// 引入material-ui基础组件
import {
    Box,
    Grid,
    IconButton,
    Icon,
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
    Modal,
    Button
} from "@material-ui/core";

// 引入关联文件
import {AppSettingActionType} from '../../types';
import { makeStyles } from '@material-ui/core/styles';
import clsx from "clsx";
import {SimpleModal} from "../index";

const appSettingAction = require('../../actions/main/AppSettingAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;
// 抽屉宽度
const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
    bodyShift: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: drawerWidth,
        transition: customTheme.transitions.create(['margin', 'width'], {
            easing: customTheme.transitions.easing.easeOut,
            duration: customTheme.transitions.duration.enteringScreen,
        }),
    },
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    table: {
        minWidth: 650,
    },
    tableRow: {
        padding: 5,
    },
    tableNoData: customTheme.tableNoData,
    container: {
        maxHeight: 240,
    },
    addButton : {
        width: customTheme.shapeCircle.width,
        height: customTheme.shapeCircle.height,
        borderRadius: customTheme.shapeCircle.borderRadius,
        backgroundColor: customTheme.addButton.color,
    },
    queryButton : {
        width: customTheme.shapeCircle.width,
        height: customTheme.shapeCircle.height,
        borderRadius: customTheme.shapeCircle.borderRadius,
        backgroundColor: customTheme.queryButton.color,
    },
    selectLabel:customTheme.selectLabel,
    modalButton:customTheme.modalButton,
    tableButton:customTheme.tableButton,
    red: customTheme.mustInput,

}));

function AppSetting (props) {
    const [modalOpen, setModalOpen] = React.useState(false);
    const {appSettingReducer, commonReducer, changeConditionType, initModal, changeStatus, saveModalData} = props;
    const classes = useStyles();

    useEffect(()=>{
        // 不是detail页面返回，清空检索条件
        let dataStart = props.appSettingReducer.highSchool.start;
        props.getHighSchoolList(dataStart);
    },[]);

    // const handleModelConfirm =() =>{
    //     setModalOpen(false);
    //     props.setShowLoadProgressFlag(true);
    //     setTimeout(()=>{
    //         props.setShowLoadProgressFlag(false);
    //         Swal.fire("操作成功","关闭对话框成功","success")
    //     },1000);
    // }

    // const handleDateChange = (event) => {
    //     console.log('',event);
    //     setSelectedDate(event);
    //     // setSelectedDate(event.target.value);
    // };
    //
    // const handleChangeTextDate = (event) => {
    //     console.log('',event);
    //     setSelectedDate(event.target.value);
    // };

    // 更新 检索条件：名称
    const changeConditionName = (event) => {
        props.setConditionName(event.target.value);
    };

    // 更新 模态：学校性质
    const changeModalSchoolType = (value) => {
        let modalData = props.appSettingReducer.modalData;
        modalData.type = value;
        props.setModalData(modalData);
    };

    // 更新 模态：学校代码
    const changeModalSchoolCode = (event) => {
        let modalData = props.appSettingReducer.modalData;
        modalData.code = event.target.value;
        props.setModalData(modalData);
    };

    // 更新 模态：学校名称
    const changeModalSchoolName = (event) => {
        let modalData = props.appSettingReducer.modalData;
        modalData.name = event.target.value;
        props.setModalData(modalData);
    };

    // 更新 模态：招生起始年
    const changeModalSchoolStart = (event) => {
        let modalData = props.appSettingReducer.modalData;
        modalData.startYear = event.target.value;
        props.setModalData(modalData);
    };

    // 更新 模态：地址
    const changeModalSchoolAddress = (event) => {
        let modalData = props.appSettingReducer.modalData;
        modalData.address = event.target.value;
        props.setModalData(modalData);
    };

    // 更新 模态：备注
    const changeModalSchoolRemark = (event) => {
        let modalData = props.appSettingReducer.modalData;
        modalData.remark = event.target.value;
        props.setModalData(modalData);
    };

    // 查询列表
    const queryHighSchoolList = () => {
        // 默认第一页
        props.getHighSchoolList(0);
    };

    // 上一页
    const preBtn = () => {
        props.getHighSchoolList(props.appSettingReducer.highSchool.start - (props.appSettingReducer.highSchool.size - 1));
    };

    // 下一页
    const nextBtn = () => {
        props.getHighSchoolList(props.appSettingReducer.highSchool.start + (props.appSettingReducer.highSchool.size - 1));
    };

    // 关闭模态
    const modalClose = () => {
        props.setModalOpen(false);
    };



    return (
        <div className={classes.title}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>高中基本信息</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={10} spacing={3}>
                    <Grid item xs={6} sm={3}>
                        <TextField xs={12} label="名称（模糊查询）" fullWidth={true} margin={'normal'} type="search"
                                   value={appSettingReducer.conditionName} onChange={changeConditionName}/>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <label htmlFor="aria-example-input" className={classes.selectLabel}>学校性质</label>
                        <Select
                            inputId="aria-example-input"
                            options={sysConst.HIGH_SCHOOL_TYPE}
                            onChange={changeConditionType}
                            value={appSettingReducer.conditionType}
                            isSearchable={false}
                            placeholder={"请选择"}
                            styles={sysConst.REACT_SELECT_SEARCH_STYLE}
                            isClearable={true}
                        />
                    </Grid>
                </Grid>

                {/*查询按钮*/}
                <Grid item xs={1}>
                    <IconButton className={classes.addButton} onClick={queryHighSchoolList}><Icon>search</Icon></IconButton>
                </Grid>

                {/*追加按钮*/}
                <Grid item xs={1}>
                    <IconButton className={classes.queryButton} onClick={() => {initModal(null)}}><Icon>add</Icon></IconButton>
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            {/*<DataTable columns={columns} detail={'high_school'}/>*/}
            <TableContainer component={Paper} className={classes.container}>
                <Table className={classes.table} stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell padding="default" align="center">学校代码</TableCell>
                            <TableCell padding="default" align="left">名称</TableCell>
                            <TableCell padding="default" align="center">性质</TableCell>
                            <TableCell padding="default" align="left">地址</TableCell>
                            <TableCell padding="default" align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {appSettingReducer.highSchool.dataList.map((row) => (
                            <TableRow className={classes.tableRow}>
                                <TableCell padding="none" component="th" scope="row" align="center"> {row.code}</TableCell>
                                <TableCell padding="none" align="left">{row.hs_name}</TableCell>
                                <TableCell padding="none" align="center">{commonUtil.getJsonValue(sysConst.HIGH_SCHOOL_TYPE, row.type)}</TableCell>
                                <TableCell padding="none" align="left">{row.address}</TableCell>
                                <TableCell padding="none" align="center">
                                    {/*<Link to={{pathname: '/high_school/' + row.uid}}>*/}
                                    {/*    <i className="mdi mdi-table-search purple-font"/>*/}
                                    {/*</Link>*/}

                                    {/* 停用状态 */}
                                    {row.status == sysConst.USE_FLAG[0].value &&
                                    <IconButton color="default" edge="start" onClick={() => {changeStatus(row.uid, sysConst.USE_FLAG[1].value)}}>
                                        <Icon>visibility_off</Icon>
                                    </IconButton>}

                                    {/* 可用状态 */}
                                    {row.status == sysConst.USE_FLAG[1].value &&
                                    <IconButton color="secondary" edge="start" onClick={() => {changeStatus(row.uid, sysConst.USE_FLAG[0].value)}}>
                                        <Icon>visibility</Icon>
                                    </IconButton>}

                                    {/* 编辑按钮 */}
                                    <IconButton color="primary" edge="start" onClick={() => {initModal(row)}}>
                                        <Icon>edit_outlined</Icon>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {appSettingReducer.highSchool.dataList.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={5} className={classes.tableNoData}>暂无数据</TableCell>
                        </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box className={classes.tableButton}>
                {appSettingReducer.highSchool.start > 0 && appSettingReducer.highSchool.dataSize > 0 &&
                <Button variant="contained" color="primary" className={classes.modalButton} onClick={preBtn}>上一页</Button>}
                {appSettingReducer.highSchool.dataSize >= appSettingReducer.highSchool.size &&
                <Button variant="contained" color="primary" className={classes.modalButton} onClick={nextBtn}>下一页</Button>}
            </Box>

            {/* 模态：新增/修改 高中信息 */}
            <SimpleModal
                title={appSettingReducer.modalData.pageType === 'edit' ? '修改高中信息' : '新增高中信息'}
                open={appSettingReducer.modalOpen}
                onClose={modalClose}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" color="primary" className={classes.modalButton} onClick={saveModalData}>确定</Button>
                        <Button variant="contained" className={classes.modalButton} onClick={modalClose}>关闭</Button>
                    </>
                }
            >
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <label htmlFor="aria-example-input" className={classes.selectLabel}>
                                        <span className={appSettingReducer.modalData.type==null ? classes.red : ''}>
                                            学校性质<span className={classes.red}>*</span>
                                        </span>
                        </label>
                        <Select
                            options={sysConst.HIGH_SCHOOL_TYPE}
                            onChange={changeModalSchoolType}
                            value={appSettingReducer.modalData.type}
                            isSearchable={false}
                            placeholder={"请选择"}
                            styles={sysConst.CUSTOM_REACT_SELECT_STYLE}
                            isClearable={false}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <TextField label="学校代码" fullWidth={true} margin={'normal'}
                                   value={appSettingReducer.modalData.code} onChange={changeModalSchoolCode}/>
                    </Grid>

                    <Grid item xs={6}>
                        <TextField label={<span className={appSettingReducer.modalData.name=='' ? classes.red : ''}>学校名称<span className={classes.red}>*</span></span>}
                                   fullWidth={true} margin={'normal'}
                                   value={appSettingReducer.modalData.name} onChange={changeModalSchoolName}/>
                    </Grid>

                    <Grid item xs={3}>
                        <TextField label="招生起始年" fullWidth={true} margin={'normal'} type="number"
                                   value={appSettingReducer.modalData.startYear} onChange={changeModalSchoolStart}/>
                    </Grid>
                    <Grid item xs={9}>
                        <TextField label={<span className={appSettingReducer.modalData.address=='' ? classes.red : ''}>学校地址<span className={classes.red}>*</span></span>}
                                   fullWidth={true} margin={'normal'}
                                   value={appSettingReducer.modalData.address} onChange={changeModalSchoolAddress}/>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField label="备注" fullWidth={true} margin={'normal'} multiline rows={4} variant="outlined"
                                   value={appSettingReducer.modalData.remark} onChange={changeModalSchoolRemark}/>
                    </Grid>
                </Grid>
            </SimpleModal>
        </div>
    )

}

const mapStateToProps = (state) => {
    return {
        appSettingReducer: state.AppSettingReducer,
        commonReducer: state.AppReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    getHighSchoolList: (dataStart) => {
        dispatch(appSettingAction.getHighSchoolList(dataStart))
    },
    setConditionName: (value) => {
        dispatch(AppSettingActionType.setConditionDeviceType(value))
    },
    changeConditionType: (value) => {
        dispatch(AppSettingActionType.setConditionStatus(value))
    },
    setModalOpen: (value) => {
        dispatch(AppSettingActionType.setModalOpen(value))
    },
    initModal: (data) => {
        dispatch(appSettingAction.initModalData(data));
    },
    setModalData: (value) => {
        dispatch(AppSettingActionType.setModalData(value))
    },
    changeStatus: (id, status) => {
        dispatch(appSettingAction.changeHighSchoolStatus(id, status));
    },
    saveModalData: () => {
        dispatch(appSettingAction.saveModalData());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AppSetting)
