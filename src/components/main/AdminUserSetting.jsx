import React, {useEffect,useState}from 'react';
import Select from 'react-select';
import {connect} from 'react-redux';

import {AdminUserSettingActionType} from '../../types';
import {SimpleModal} from '../index';

import {
    Button,
    Divider,
    Grid,
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
import Fab from '@material-ui/core/Fab';
import Switch from '@material-ui/core/Switch';
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
    selectLabel: {
        fontSize: 10,
        color: 'grey'
    },

    select: {
        width: '100%',
        marginTop:'16px'
    },
    button:{
        margin:'15px',
        float:'right'
    }
}));

//员工管理
function AdminUserSetting (props) {
    const [modalOpen, setModalOpen] = useState(false);
    const [adminUser, setAdminUser] = useState("");
    const [type, setType] = useState("");
    const [adminPhone, setAdminPhone] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("1");
    const [submitFlag, setSubmitFlag] = useState(false);
    const {adminUserSettingReducer, changeConditionPhone,changeConditionUsername,changeConditionStatus,changeConditionGender,changePutStatus} = props;
    const classes = useStyles();
    const {adminUserSetting,putAminUserSetting,deleteUser,putUser} = props;
    const [modalPage, setModalPage] = useState("");
    const [id, setId] = useState("");
    const [status, setStatus] = useState("");

    useEffect(()=>{
        props.setStartNumber(0);
        props.changeConditionUsername('');
        props.changeConditionPhone('');
        props.changeConditionGender (null);
        props.changeConditionStatus(null);
        props.getAdminList();
        props.adminUserTypeSetting();
    },[]);

    //初始添加模态框值
    const handleAddOpen =(user) =>{
        setModalOpen(true);
        //console.log('', user);
        if (user == null) {
            setModalPage('new');
            setAdminUser('');
            setType('1032');
            setAdminPhone('');
            setPassword('');
            setGender('1');
        } else {
            setModalPage('edit');
            setAdminUser(user.user_name);
            setType('1032');
            setAdminPhone(user.phone);
            setGender(user.gender);
            setId(user.id);
            setStatus(user.status);
        }
    }

    /**
     * 查询菜单设定情况
     */
    const queryAdminList = () => {
        props.getAdminList();
    };
    /**
     * 上一页
     */
    const preBtn = () => {
        props.setStartNumber(props.adminUserSettingReducer.start - (props.adminUserSettingReducer.size - 1));
        props.getAdminList();
    };

    /**
     * 下一页
     */
    const nextBtn = () => {
        props.setStartNumber(props.adminUserSettingReducer.start + (props.adminUserSettingReducer.size - 1));
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
                    <Fab color="primary" aria-label="add"  onClick={queryAdminList}>
                        <i className="mdi mdi-magnify mdi-24px"/>
                    </Fab>
                </Grid>

                {/*添加按钮*/}
                <Grid item xs={1}>
                    <Fab color="primary" aria-label="add" onClick={()=>{handleAddOpen(null)}}>
                        <i className="mdi mdi-plus mdi-24px" />
                    </Fab>
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
                                    <TableCell align="center" >{row.phone}</TableCell>
                                    <TableCell align="center">{row.user_name}</TableCell>
                                    <TableCell align="center">{commonUtil.getJsonValue(sysConst.GENDER, row.gender)}</TableCell>
                                    <TableCell align="center">{commonUtil.getJsonValue(sysConst.USE_FLAG, row.status)}</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            checked={row.status==1}
                                            onChange={(e)=>{
                                                changePutStatus(row.status,row.id)
                                            }}
                                            name="状态"
                                            color='primary'
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                       {/* <i className="mdi mdi-close purple-font pointer margin-right10" onClick={() => {deleteUser(row.id)}}> </i>*/}
                                        <i className="mdi mdi-table-search purple-font margin-left10" onClick={() =>
                                        {putUser(row.id);
                                            handleAddOpen(row);
                                         //setPutModalOpen(true)
                                        }}> </i>
                                    </TableCell>
                                </TableRow>))}
                            { adminUserSettingReducer.adminArray.length === 0 &&
                                <TableRow > <TableCell align="center" colSpan="5">暂无数据</TableCell></TableRow>
                            }
                        </TableBody>
                    </Table>

                    {adminUserSettingReducer.dataSize >= adminUserSettingReducer.size &&
                    <Button className={classes.button} variant="contained" color="primary"  onClick={nextBtn}>
                        下一页
                    </Button>}
                    {adminUserSettingReducer.start > 0 && adminUserSettingReducer.dataSize > 0 &&
                    <Button className={classes.button} variant="contained" color="primary" onClick={preBtn}>
                        上一页
                    </Button>}

                </TableContainer>
            </Grid>

            {/*添加或修改用户信息*/}
            <SimpleModal
                title={modalPage=='new' ? "新增用户信息" : "修改用户信息"}
                open={modalOpen}
                showFooter={true}
                footer={
                    <>
                        {status==0&&modalPage=='edit'?'':  <Button variant="contained" onClick={() => {
                            setSubmitFlag(true);
                            setModalOpen(adminUser==''||gender==''||type==''?true:false)
                            putAminUserSetting(adminUser,gender,type,id)
                        }}  color="primary">
                            确定
                        </Button>}


                        {modalPage=='new'&&status==null?
                            <Button variant="contained" onClick={() => {
                                setSubmitFlag(true);
                                setModalOpen(adminUser==''|| adminPhone==''||password==''||gender==''||type==''?true:false)
                                adminUserSetting(adminUser, adminPhone,password,gender,type,1)
                            }}  color="primary">
                                确定
                            </Button>:''}

                        <Button onClick={()=>{setModalOpen(false)}} color="primary" autoFocus>
                            取消
                        </Button>
                    </>
                }
            >
                <Grid  container spacing={3}>
                    <Grid item xs={modalPage=='new' ? 4 : 6} sm={modalPage=='new' ? 4 : 6}>
                        <TextField fullWidth
                            margin='normal'
                            label="用户姓名"
                            variant="outlined"
                            onChange={(e)=>{
                               setSubmitFlag(false);
                               setAdminUser(e.target.value)
                            }}
                            error={adminUser == "" && submitFlag}
                            helperText={adminUser == "" && submitFlag  ? "用户姓名不能为空" : ""}
                            value={adminUser}

                        />
                    </Grid>
                    <Grid item xs={modalPage=='new' ? 4 : 6} sm={modalPage=='new' ? 4 : 6}>
                        <TextField className={classes.select}
                                   select
                                   label="用户群组"
                                   onChange={(e)=>{
                                       setSubmitFlag(false);
                                       setType(e.target.value)
                                   }}
                                   value={type}
                                   SelectProps={{
                                       native: true,
                                   }}
                                   error={type == ""&& submitFlag}
                                   helperText={type == "" && submitFlag  ? "用户群组不能为空" : ""}
                                   variant="outlined"
                        >
                            {adminUserSettingReducer.typeArray.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.type_name}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={modalPage=='new' ? 4 : 6} sm={modalPage=='new' ? 4 : 6}>
                        <TextField className={classes.select}
                            select
                            label="性别"
                            onChange={(e)=>{
                               setSubmitFlag(false);
                               setGender(e.target.value)
                            }}
                            value={gender}
                            SelectProps={{
                                native: true,
                            }}
                           error={gender == ""&& submitFlag}
                            helperText={gender == "" && submitFlag  ? "性别不能为空" : ""}
                            variant="outlined"
                        >
                            {sysConst.GENDER.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs={modalPage=='new' ? 6 : 6} sm={modalPage=='new' ? 6 : 6}>
                        <TextField fullWidth maxLength="11" minLength='11'
                                   margin='normal'
                                   disabled={modalPage=='new'?false:true}
                                   label="手机"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setSubmitFlag(false);
                                       setAdminPhone(e.target.value)
                                   }}
                                   error={adminPhone == "" && submitFlag&&adminPhone!=="11"}
                                   helperText={adminPhone == "" && submitFlag  ? "手机不能为空" : ""}
                                   value={adminPhone}

                        />
                    </Grid>
                    {modalPage=='new' ?  <Grid item xs={6} sm={6}>
                        <TextField fullWidth maxLength="20"
                                   label="密码"
                                   margin="normal"
                                   name="password"
                                   type="password"
                                   variant="outlined"
                                   onChange={(e) => {
                                       setSubmitFlag(false);
                                       setPassword(e.target.value)
                                   }}
                                   error={password == "" && submitFlag&& password<5}
                                   helperText={password == "" && submitFlag  ? "密码不能为空" : ""}
                                   value={password}
                        />
                    </Grid> : ''}

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
    adminUserSetting: (userName, phone,password,gender,type,status) => {
        if (userName.length > 0 && phone.length > 0 && password.length > 0) {
            dispatch(adminUserSettingAction.adminUserSetting({userName, phone,password,gender,type,status}));
        }
    },
    //获取列表
    getAdminList: () => {
        dispatch(adminUserSettingAction.getAdminList())
    },
    setStartNumber: (start) => {
        dispatch(AdminUserSettingActionType.setStartNumber(start))
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
  /*  //删除员工信息
    deleteUser: (id) => {
        dispatch(adminUserSettingAction.deleteUser(id))
    },*/
    //修改员工信息(获取初始值)
    putUser:(id) => {
        dispatch(adminUserSettingAction.putUser(id))
    },
    putAminUserSetting: (userName, gender,type,id) => {
        if (userName.length > 0 && gender.length > 0) {
            dispatch(adminUserSettingAction.putAminUserSetting({userName, gender,type},id));
        }
    },
    adminUserTypeSetting:() =>{
        dispatch(adminUserSettingAction.adminUserTypeSetting())
    },
    //修改状态
    changePutStatus:(flag,id) =>{
        dispatch(adminUserSettingAction.changePutStatus(flag,id))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminUserSetting)


