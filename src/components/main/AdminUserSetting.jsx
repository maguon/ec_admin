import Swal from "sweetalert2";
import React, {useEffect,useState}from 'react';
import Select from 'react-select';
import {connect} from 'react-redux';

import {AdminUserSettingActionType} from '../../types';
import {SimpleModal} from '../index';

import {
    Button,
    Divider,
    Grid,
    IconButton,
    Typography,
    Paper,
    TextField,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const adminUserSettingAction = require('../../actions/main/AdminUserSettingAction');

const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');


const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        width: `calc(100% - 50px)`,
        paddingLeft: 30
    },
    // 标题样式
    pageTitle: {
        color: '#3C3CC4',
        fontSize: 20,
        fontWeight: 'bold'
    },
    pageDivider: {
        height: 1,
        marginBottom: 15,
        background: '#7179e6'
    },
    getButton: {
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: '#7179e6',
        marginTop:'13px',
        marginLeft:'30px'
    },
    addButton: {
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: '#3C3CC4',
        marginTop:'13px',
    },
    selectLabel: {
        fontSize: 10,
        color: 'grey'
    },
    zIndex:{
        modal:'1000'
    },
    select: {
        width: '100%',
        marginTop:'16px'
    },

}));

//员工管理
function AdminUserSetting (props) {
    const [modalOpen, setModalOpen] = React.useState(false);
    const {adminUserSettingReducer, changeConditionPhone,changeConditionUsername,changeConditionStatus,changeConditionGender} = props;
    const classes = useStyles();

    const {addAdminUserSetting,deleteUser} = props;

    const [addAdminUser, setAddAdminUser] = useState("");
    const [addAdminPhone, setAddAdminPhone] = useState("");
    const [addPassword, setAddPassword] = useState("");
    const [addGender, setAddGender] = useState("");
    const [submitFlag, setSubmitFlag] = useState(false);

    useEffect(()=>{
        props.changeConditionUsername('');
        props.changeConditionPhone('');
        props.changeConditionGender (null);
        props.changeConditionStatus(null);
        props.getAdminList();
    },[]);

    const addModelUser =() =>{
        setModalOpen(false);
        setTimeout(()=>{
            Swal.fire("操作成功","","success")
        },1000);

    }
    /**
     * 查询菜单设定情况
     */
    const queryAdminList = () => {
        props.getAdminList();
    };


    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>员工管理</Typography>
            <Divider light className={classes.pageDivider}/>

            {/*查询条件*/}
            <Grid container spacing={3}>
                <Grid container item xs={10} spacing={3}>
                    <Grid item xs={3} sm={3}>
                        <TextField
                            fullWidth={true}
                            margin={'normal'}
                            label="手机"
                            value={adminUserSettingReducer.conditionPhone}
                            onChange={(e)=>changeConditionPhone(e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={3} sm={3}>
                        <TextField
                            fullWidth={true}
                            margin={'normal'}
                            label="用户姓名"
                            value={adminUserSettingReducer.conditionUserName}
                            onChange={(e)=>changeConditionUsername(e.target.value)}
                        />
                    </Grid>
                    <Grid item lg={3} sm={3} xs={3}>
                        <label htmlFor="conditionUserType" className={classes.selectLabel}>性别</label>
                        <Select
                            inputId="conditionGender"
                            options={sysConst.GENDER}
                            value={adminUserSettingReducer.conditionGender}
                            onChange={changeConditionGender}
                            isSearchable={false}
                            placeholder={"请选择"}
                            styles={sysConst.REACT_SELECT_SEARCH_STYLE}
                            isClearable={false}
                        />
                    </Grid>
                    <Grid item lg={3} sm={3} xs={3}>
                        <label htmlFor="conditionStatus" className={classes.selectLabel}>状态</label>
                        <Select
                            inputId="conditionStatus"
                            options={sysConst.USE_FLAG}
                            onChange={changeConditionStatus}
                            value={adminUserSettingReducer.conditionStatus}
                            isSearchable={false}
                            placeholder={"请选择"}
                            styles={sysConst.REACT_SELECT_SEARCH_STYLE}
                            isClearable={false}
                        />
                    </Grid>
                </Grid>
                {/*查询按钮*/}
                <Grid item xs={1}>
                    <IconButton className={classes.getButton} onClick={queryAdminList}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </IconButton>
                </Grid>

                {/*添加按钮*/}
                <Grid item xs={1}>
                    <IconButton className={classes.addButton} onClick={()=>{setModalOpen(true)}}>
                        <i className="mdi mdi-plus mdi-24px" />
                    </IconButton>
                </Grid>
            </Grid>

            {/*主体*/}
            <Grid container spacing={2}>
                <TableContainer component={Paper} style={{marginTop:40}}>
                    <Table  size={'medium'} aria-label="a dense table">
                        <TableHead >
                            <TableRow style={{height:60}}>
                                <TableCell align="center">手机</TableCell>
                                <TableCell align="center">用户名称</TableCell>
                                <TableCell align="center">性别</TableCell>
                                <TableCell align="center">状态</TableCell>
                                <TableCell align="center">操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adminUserSettingReducer.adminArray.length > 0 && adminUserSettingReducer.adminArray.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell align="center">{row.phone}</TableCell>
                                    <TableCell align="center">{row.user_name}</TableCell>
                                    <TableCell align="center">{commonUtil.getJsonValue(sysConst.GENDER, row.gender)}</TableCell>
                                    <TableCell align="center">{commonUtil.getJsonValue(sysConst.USE_FLAG, row.status)}</TableCell>
                                    <TableCell align="center">
                                        <i className="mdi mdi-close purple-font pointer margin-right10" onClick={() => {deleteUser(row.id)}}> </i>
                                        <i className="mdi mdi-table-search purple-font margin-left10"> </i>
                                    </TableCell>
                                </TableRow>))}
                            { adminUserSettingReducer.adminArray.length === 0 &&
                                <TableRow > <TableCell align="center" colSpan="5">暂无数据</TableCell></TableRow>
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>


            {/*添加用户信息*/}
            <SimpleModal
                title="新增用户信息"
                open={modalOpen}
                showFooter={true}
                footer={
                    <>
                        <Button variant="contained" onClick={() => {
                            setSubmitFlag(true);
                            addAdminUserSetting(addAdminUser, addAdminPhone,addPassword,addGender,1,0)
                        }}  color="primary">
                            确定
                        </Button>
                        <Button onClick={()=>{setModalOpen(false)}} color="primary" autoFocus>
                            取消
                        </Button>
                    </>
                }
            >
                <Grid  container spacing={3}>
                    <Grid item xs={6} sm={6}>
                        <TextField fullWidth
                            margin='normal'
                            label="用户姓名"
                            variant="outlined"
                            onChange={(e)=>{
                               setSubmitFlag(false);
                               setAddAdminUser(e.target.value)
                            }}
                            error={addAdminUser == "" && submitFlag}
                            helperText={addAdminUser == "" && submitFlag  ? "用户姓名不能为空" : ""}
                            value={addAdminUser}

                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <TextField className={classes.select}
                            select
                            label="性别"
                            onChange={(e)=>{
                               setSubmitFlag(false);
                               setAddGender(e.target.value)
                            }}
                            value={addGender}
                            SelectProps={{
                                native: true,
                            }}
                            helperText={addGender == "" && submitFlag  ? "性别不能为空" : ""}
                            variant="outlined"
                        >
                            {sysConst.GENDER.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <TextField fullWidth
                                   margin='normal'
                                   label="手机"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setSubmitFlag(false);
                                       setAddAdminPhone(e.target.value)
                                   }}
                                   error={addAdminPhone == "" && submitFlag}
                                   helperText={addAdminPhone == "" && submitFlag  ? "手机不能为空" : ""}
                                   value={addAdminPhone}

                        />
                    </Grid>
                    <Grid item xs={6} sm={6}>
                        <TextField fullWidth
                                   label="密码"
                                   margin="normal"
                                   name="password"
                                   type="password"
                                   variant="outlined"
                                   onChange={(e) => {
                                       setSubmitFlag(false);
                                       setAddPassword(e.target.value)
                                   }}
                                   error={addPassword == "" && submitFlag}
                                   helperText={addPassword == "" && submitFlag  ? "密码不能为空" : ""}
                                   value={addPassword}
                        />
                    </Grid>
                </Grid>
            </SimpleModal>
        </div>
    )

}
const mapStateToProps = (state, ownProps) => {
    return {
        adminUserSettingReducer: state.AdminUserSettingReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    //添加员工
    addAdminUserSetting: (userName, phone,password,gender,status,type) => {
        if (userName.length > 0 && phone.length > 0 && password.length > 0 && gender.length > 0) {
            dispatch(adminUserSettingAction.addAdminUserSetting({userName, phone,password,gender,status,type}));
        }
    },
    //获取列表
    getAdminList: () => {
        dispatch(adminUserSettingAction.getAdminList())
    },
    changeConditionUsername: (value) => {
        dispatch(AdminUserSettingActionType.setConditionUserName(value))
    },
    changeConditionPhone: (value) => {
        dispatch(AdminUserSettingActionType.setConditionPhone(value))
    },
    changeConditionGender: (value) => {
        dispatch(AdminUserSettingActionType.setConditionGender(value))
    },
    changeConditionStatus: (value) => {
        dispatch(AdminUserSettingActionType.setConditionStatus(value))
    },

    //删除员工信息
    deleteUser: (id) => {
        dispatch(adminUserSettingAction.deleteUser(id))
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminUserSetting)


