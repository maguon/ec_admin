import React, {useEffect,useState}from 'react';
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
    TableBody, IconButton,
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
    selectCondition: {
        width: '100%',
    },
    button:{
        margin:'15px',
        float:'right'
    }
}));

//员工管理
function AdminUserSetting (props) {
    const {adminUserSettingReducer,changeStatus} = props;
    const {getUserList,updateUser,deleteUser} = props;
    const classes = useStyles();
    //查询条件
    const [conditionPhone,setConditionPhone]=useState("");
    const [conditionRealName,setConditionRealName]=useState("");
    const [conditionType,setConditionType]=useState("-1");
    const [conditionGender,setConditionGender]=useState("-1");
    const [conditionStatus,setConditionStatus]=useState("-1");
    //模态框
    const [modalOpen, setModalOpen] = useState(false);
    const [adminUser, setAdminUser] = useState("");
    const [type, setType] = useState("");
    const [adminPhone, setAdminPhone] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("1");
    //判断新增还是修改
    const [modalPage, setModalPage] = useState("");
    //详情获取id
    const [id, setId] = useState("");
    //用户状态
    const [status, setStatus] = useState("");

    //验证
    const [validation,setValidation] = useState({});
    useEffect(()=>{

    },[adminPhone,adminUser,password]);
    const validate = ()=>{
        const validateObj ={}
        if(modalPage=='new'){
            if (!adminPhone) {
                validateObj.adminPhone ='请输入手机号';
            } else if (adminPhone.length != 11) {
                validateObj.adminPhone ='请输入11位手机号';
            }
        }
        if (!adminUser) {
            validateObj.adminUser ='请输入用户姓名';
        }
        if(modalPage=='new'){
            if (!password) {
                validateObj.password ='请输入密码';
            }else if (password.length <6) {
                validateObj.password ='请输入大于6位的密码';
            }
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    }
    const addUser= ()=>{
        const errorCount = validate();
        if(errorCount==0){
            props.addUserItem(adminUser, adminPhone,password,gender,type,1);
            setModalOpen(false);
        }else{
        }
    }
    const setUser= ()=>{
        const errorCount = validate();
        if(errorCount==0){
            props.updateUserItem(adminUser, gender,type,id);
            setModalOpen(false);
        }else{
        }
    }
    useEffect(()=>{
        props.setStartNumber(0);
        props.getUserList();
        props.getUserTypeList();
    },[]);

    //初始添加模态框值
    const handleAddOpen =(user) =>{
        setModalOpen(true);
        if (user == null) {
            setModalPage('new');
            setAdminUser('');
            setType('1032');
            setAdminPhone('');
            setPassword('');
            setGender('1');
        } else {
            setModalPage('edit');
            setAdminUser(user.real_name);
            setType(user.type);
            setAdminPhone(user.phone);
            setGender(user.gender);
            setId(user.id);
            setStatus(user.status);
        }
    }

    //上一页
    const getPreBtnList = () => {
        props.setStartNumber(props.adminUserSettingReducer.start - (props.adminUserSettingReducer.size - 1));
        props.getUserList();
    };

    //下一页
    const getNextBtnList = () => {
        props.setStartNumber(props.adminUserSettingReducer.start + (props.adminUserSettingReducer.size - 1));
        props.getUserList();
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>员工管理</Typography>
            <Divider light className={classes.pageDivider}/>

            {/*查询条件*/}
            <Grid container  spacing={3}>
                <Grid item xs>
                    <TextField
                        fullWidth={true}
                        margin="dense"
                        variant="outlined"
                        label="手机"
                        value={conditionPhone}
                        onChange={(e)=>setConditionPhone(e.target.value)}
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        fullWidth={true}
                        margin="dense"
                        variant="outlined"
                        label="用户姓名"
                        value={conditionRealName}
                        onChange={(e)=>setConditionRealName(e.target.value)}
                    />
                </Grid>
                <Grid item xs>
                    <TextField className={classes.selectCondition}
                               select
                               margin="dense"
                               label="用户群组"
                               value={conditionType}
                               onChange={(e)=>setConditionType(e.target.value)}
                               SelectProps={{
                                   native: true,
                               }}
                               variant="outlined"
                    >
                        <option key={1} value={-1} disabled={true}>请选择</option>
                        {adminUserSettingReducer.typeArray.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.type_name}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs>
                    <TextField className={classes.selectCondition}
                               select
                               margin="dense"
                               label="性别"
                               value={conditionGender}
                               onChange={(e)=>setConditionGender(e.target.value)}
                               SelectProps={{
                                   native: true,
                               }}
                               variant="outlined"
                    >
                        <option key={1} value={-1} disabled={true}>请选择</option>
                        {sysConst.GENDER.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs>
                    <TextField className={classes.selectCondition}
                               select
                               margin="dense"
                               label="状态"
                               onChange={(e)=>setConditionStatus(e.target.value)}
                               value={conditionStatus}
                               SelectProps={{
                                   native: true,
                               }}
                               variant="outlined"
                    >
                        <option key={1} value={-1} disabled={true}>请选择</option>
                        {sysConst.USE_FLAG.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                {/*查询按钮*/}
                <Grid container item xs>
                    <Grid container direction="row" justify="space-evenly" alignItems="center">
                        <Fab size="small" color="primary" aria-label="add" onClick={() => {getUserList(conditionPhone,conditionRealName,conditionType,conditionGender,conditionStatus)}}>
                            <i className="mdi mdi-magnify mdi-24px"/>
                        </Fab>
                        {/*添加按钮*/}
                        <Fab size="small" color="primary" aria-label="add" onClick={()=>{handleAddOpen(null)}}>
                            <i className="mdi mdi-plus mdi-24px" />
                        </Fab>
                    </Grid>
                </Grid>

            </Grid>

            {/*主体*/}
            <Grid container spacing={2}>
                <TableContainer component={Paper} style={{marginTop:40}}>
                    <Table  size={'small'} aria-label="a dense table">
                        <TableHead >
                            <TableRow style={{height:60}}>
                                <TableCell align="center">手机</TableCell>
                                <TableCell align="center">用户名称</TableCell>
                                <TableCell align="center">用户群组</TableCell>
                                <TableCell align="center">性别</TableCell>
                                <TableCell align="center">状态</TableCell>
                                <TableCell align="center">操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {adminUserSettingReducer.adminArray.length > 0 && adminUserSettingReducer.adminArray.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell align="center" >{row.phone}</TableCell>
                                    <TableCell align="center">{row.real_name}</TableCell>
                                    <TableCell align="center">{row.type_name}</TableCell>
                                    <TableCell align="center">{commonUtil.getJsonValue(sysConst.GENDER, row.gender)}</TableCell>
                                    <TableCell align="center">{commonUtil.getJsonValue(sysConst.USE_FLAG, row.status)}</TableCell>
                                    <TableCell align="center">
                                        <Switch
                                            checked={row.status==1}
                                            onChange={(e)=>{
                                                changeStatus(row.status,row.id)
                                            }}
                                            name="状态"
                                            color='primary'
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                      <IconButton size="small" color="primary" onClick={() => {updateUser(row.id);handleAddOpen(row);}}><i className="mdi mdi-table-search purple-font margin-left10"
                                        > </i>
                                      </IconButton>
                                    </TableCell>
                                </TableRow>))}
                            { adminUserSettingReducer.adminArray.length === 0 &&
                                <TableRow > <TableCell align="center" colSpan="6">暂无数据</TableCell></TableRow>
                            }
                        </TableBody>
                    </Table>

                    {adminUserSettingReducer.dataSize >= adminUserSettingReducer.size &&
                    <Button className={classes.button} variant="contained" color="primary"  onClick={getNextBtnList}>
                        下一页
                    </Button>}
                    {adminUserSettingReducer.start > 0 && adminUserSettingReducer.dataSize > 0 &&
                    <Button className={classes.button} variant="contained" color="primary" onClick={getPreBtnList}>
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
                        {status!=0&&modalPage=='edit'? <Button variant="contained" onClick={setUser}  color="primary">
                            确定
                        </Button>:'' }


                        {modalPage=='new'?
                            <Button variant="contained" onClick={addUser} color="primary">
                                确定
                            </Button>:''}

                        <Button onClick={()=>{setModalOpen(false)}} color="primary" autoFocus>
                            取消
                        </Button>
                    </>
                }
            >
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField fullWidth
                                   margin='normal'
                                   disabled={modalPage=='new'?false:true}
                                   name="adminPhone"
                                   type="text"
                                   label="手机"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setAdminPhone(e.target.value)
                                   }}
                                   error={validation.adminPhone && validation.adminPhone!=''}
                                   helperText={validation.adminPhone}
                                   value={adminPhone}

                        />
                    </Grid>
                    <Grid item xs>
                        <TextField fullWidth
                                   margin='normal'
                                   label="用户姓名"
                                   name="adminUser"
                                   type="text"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setAdminUser(e.target.value)
                                   }}
                                   error={validation.adminUser&&validation.adminUser!=''}
                                   helperText={validation.adminUser}
                                   value={adminUser}

                        />
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    {modalPage=='new' ?  <Grid item xs>
                        <TextField fullWidth
                                   label="密码"
                                   name="password"
                                   margin="normal"
                                   type="password"
                                   variant="outlined"
                                   onChange={(e) => {
                                       setPassword(e.target.value)
                                   }}
                                   error={validation.password&&validation.password!=''}
                                   helperText={validation.password}
                                   value={password}
                        />
                    </Grid> : ''}
                </Grid>
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField className={classes.select}
                                   select
                                   label="用户群组"
                                   name="type"
                                   type="text"
                                   onChange={(e)=>{
                                       setType(e.target.value)
                                   }}
                                   value={type}
                                   SelectProps={{
                                       native: true,
                                   }}
                                   variant="outlined"
                        >
                            {adminUserSettingReducer.typeArray.map((option) => (
                                <option key={option.id} value={option.id}>
                                    {option.type_name}
                                </option>
                            ))}
                        </TextField>
                    </Grid>
                    <Grid item xs>
                        <TextField className={classes.select}
                                   select
                                   label="性别"
                                   name="gender"
                                   type="text"
                                   onChange={(e)=>{
                                       setGender(e.target.value)
                                   }}
                                   value={gender}
                                   SelectProps={{
                                       native: true,
                                   }}
                                   variant="outlined"
                        >
                            {sysConst.GENDER.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </TextField>
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
    //群组查找
    getUserTypeList:() =>{
        dispatch(adminUserSettingAction.getUserTypeList())
    },
    //添加员工
    addUserItem: (realName, phone,password,gender,type,status) => {
        if (realName.length > 0 && phone.length > 0 && password.length > 0) {
            dispatch(adminUserSettingAction.addUserItem({realName, phone,password,gender,type,status}));
        }
    },
    //获取列表
    getUserList: (phone,realName,type,gender,status) => {
        dispatch(adminUserSettingAction.getUserList({phone,realName,type,gender,status}))

    },
    setStartNumber: (start) => {
        dispatch(AdminUserSettingActionType.setStartNumber(start))
    },
    //修改员工信息(获取初始值)
    updateUser:(id) => {
        dispatch(adminUserSettingAction.updateUser(id))
    },
    //修改员工信息
    updateUserItem: (realName, gender,type,id) => {
        if (realName.length > 0) {
            dispatch(adminUserSettingAction.updateUserItem({realName, gender,type},id));
        }
    },
    //修改状态
    changeStatus:(flag,id) =>{
        dispatch(adminUserSettingAction.changeStatus(flag,id))
    }
    /*  //删除员工信息
    deleteUser: (id) => {
        dispatch(adminUserSettingAction.deleteUser(id))
    },*/
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminUserSetting)


