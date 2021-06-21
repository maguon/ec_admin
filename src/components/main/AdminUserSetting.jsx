import React, {useEffect} from 'react';
import Select from 'react-select';
import {connect} from 'react-redux';

import {AdminUserSettingActionType} from '../../types';
import {NewAdminModal, SimpleModal} from '../index';

import {
    Button,
    Divider,
    Grid,
    Icon,
    IconButton,
    FormControlLabel,
    Checkbox,
    Typography, Container, Box, Paper, TextField, TableContainer, Table, TableHead, TableRow, TableCell, TableBody,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import Swal from "sweetalert2";
const adminUserSettingAction = require('../../actions/main/AdminUserSettingAction');
const newAdminModalAction = require('../../actions/modules/NewAdminModalAction');

const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        padding: theme.spacing(2),
        color: theme.palette.text.secondary,
    },
}));

//员工管理
function AdminUserSetting (props) {
    const [modalOpen, setModalOpen] = React.useState(false);
    const {adminUserSettingReducer, changeConditionStatus} = props;
    const classes = useStyles();

    useEffect(()=>{
        props.changeConditionStatus(null);
        props.getAdminList();
    },[]);
    const handleModelConfirm =() =>{
        setModalOpen(false);
        props.setShowLoadProgressFlag(true);
        setTimeout(()=>{
            props.setShowLoadProgressFlag(false);
            Swal.fire("操作成功","关闭对话框成功","success")
        },1000);

    }
    /**
     * 查询菜单设定情况
     */
    const queryAdminList = () => {
        props.getAdminList();
    };

  /*  const initModalData= () =>{}*/

    return (

        <Container maxWidth={'xl'}  style={{paddingBottom:50}} >
            <Box my={2}>
                {/* 标题部分 */}
                <Typography variant="body1" style={{paddingTop:10,paddingBottom:10}}>
                    员工管理
                </Typography>


                <Divider />
                <Grid container spacing={3} style={{paddingTop:20}}>
                    <Grid container item xs={11} spacing={3}>
                        <Grid item lg={3} sm={12} xs={12}>
                                <label htmlFor="conditionUserType" className={classes.selectLabel}>手机</label>
                                <Select
                                    inputId="conditionUserType"
                                    options={sysConst.USER_TYPES}
                                    value={adminUserSettingReducer.conditionUserType}
                                    isSearchable={false}
                                    placeholder={"请选择"}
                                    styles={sysConst.REACT_SELECT_SEARCH_STYLE}
                                    isClearable={false}
                                />
                            </Grid>
                        <Grid item lg={3} sm={12} xs={12}>
                            <label htmlFor="conditionUserType" className={classes.selectLabel}>管理员名称</label>
                            <Select
                                inputId="conditionUserType"
                                options={sysConst.USER_TYPES}
                                value={adminUserSettingReducer.conditionUserType}
                                isSearchable={false}
                                placeholder={"请选择"}
                                styles={sysConst.REACT_SELECT_SEARCH_STYLE}
                                isClearable={false}
                            />
                        </Grid>
                        <Grid item lg={3} sm={12} xs={12}>
                            <label htmlFor="conditionUserType" className={classes.selectLabel}>真实姓名</label>
                            <Select
                                inputId="conditionUserType"
                                options={sysConst.USER_TYPES}
                                value={adminUserSettingReducer.conditionUserType}
                                isSearchable={false}
                                placeholder={"请选择"}
                                styles={sysConst.REACT_SELECT_SEARCH_STYLE}
                                isClearable={false}
                            />
                        </Grid>
                        <Grid item lg={3} sm={12} xs={12}>
                            <label htmlFor="conditionUserType" className={classes.selectLabel}>状态</label>
                            <Select
                                inputId="conditionUserType"
                                options={sysConst.USER_TYPES}
                                value={adminUserSettingReducer.conditionUserType}
                                isSearchable={false}
                                placeholder={"请选择"}
                                styles={sysConst.REACT_SELECT_SEARCH_STYLE}
                                isClearable={false}
                            />
                        </Grid>
                    </Grid>
                    {/*查询按钮*/}
                    <Grid item xs={1}>
                        <IconButton className={classes.addButton} onClick={queryAdminList}><Icon>search</Icon></IconButton>
                    </Grid>
                </Grid>


                <TableContainer component={Paper} style={{marginTop:40}}>
                    <Table  size={'medium'} aria-label="a dense table">
                        <TableHead >
                            <TableRow style={{height:60}}>
                                <TableCell align="center">手机</TableCell>
                                <TableCell align="center">管理员名称</TableCell>
                                <TableCell align="center">真实姓名</TableCell>
                                <TableCell align="center">性别</TableCell>
                                <TableCell align="center">状态</TableCell>
                                <TableCell align="center">操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adminUserSettingReducer.adminArray.map((row) => (
                                <TableRow key={row._id}>
                                    <TableCell component="th" scope="row" align="center">
                                        {row._id}
                                    </TableCell>
                                    <TableCell align="center">{row.phone}</TableCell>
                                    <TableCell align="center">{row.name}</TableCell>
                                    <TableCell align="center">{row.realname}</TableCell>
                                    <TableCell align="center">{}</TableCell>
                                    <TableCell align="center">
                                        <i className="mdi mdi-close purple-font pointer margin-right10"></i>
                                        <i className="mdi mdi-eye-off purple-font pointer"></i>
                                        <i className="mdi mdi-table-search purple-font margin-left10"></i>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <SimpleModal
                    title="title"
                    open={modalOpen}
                    showFooter={true}
                    footer={
                        <>
                            <Button variant="contained" onClick={handleModelConfirm} color="primary">
                                确定
                            </Button>
                            <Button onClick={()=>{setModalOpen(false)}} color="primary" autoFocus>
                                取消
                            </Button>
                        </>
                    }
                    onClose={()=>{setModalOpen(false)}}

                >       <h2 id="transition-modal-title">Transition modal</h2>
                    <p id="transition-modal-description">react-transition-group animates me.</p>
                </SimpleModal>

                <div className="col s12 margin-top10">
                    <div className="right">
                        {adminUserSettingReducer.start > 0 && adminUserSettingReducer.dataSize > 0 &&
                        <a className="waves-light waves-effect custom-blue btn margin-right10" id="pre" onClick={this.preBtn}>
                            上一页
                        </a>}
                        {adminUserSettingReducer.dataSize >= adminUserSettingReducer.size &&
                        <a className="waves-light waves-effect custom-blue btn" id="next" onClick={this.nextBtn}>
                            下一页
                        </a>}
                    </div>
                </div>
            </Box>

        </Container>
    )

}

const mapStateToProps = (state, ownProps) => {
    let fromDetail = false;
    if (typeof ownProps.location.state !== 'undefined' && ownProps.location.state.fromDetail === true) {
        fromDetail = true;
    }
    return {
        adminUserSettingReducer: state.AdminUserSettingReducer,
        fromDetail: fromDetail
    }
};

const mapDispatchToProps = (dispatch) => ({
    getAdminList: () => {
        dispatch(adminUserSettingAction.getAdminList())
    },
    setStartNumber: (start) => {
        dispatch(AdminUserSettingActionType.setStartNumber(start))
    },
    setConditionAdminPhone: (value) => {
        dispatch(AdminUserSettingActionType.setConditionPhone(value))
    },
    setConditionAdminName: (value) => {
        dispatch(AdminUserSettingActionType.setConditionAdminName(value))
    },
    setConditionRealName: (value) => {
        dispatch(AdminUserSettingActionType.setConditionRealName(value))
    },
    changeConditionStatus: (value) => {
        dispatch(AdminUserSettingActionType.setConditionStatus(value))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminUserSetting)