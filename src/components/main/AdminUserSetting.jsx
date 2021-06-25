import Swal from 'sweetalert2';
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
import {withStyles,makeStyles} from "@material-ui/core/styles";
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
const StyledTableCell = withStyles((theme) => ({
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'

    }
}))(TableCell);
//员工管理
function AdminUserSetting (props) {
    const {adminUserSettingReducer,updateUserStatusInfo,getUserById} = props;
    const classes = useStyles();
    //查询条件
    const [paramPhone,setParamPhone]=useState("");
    const [paramRealName,setParamRealName]=useState("");
    const [paramType,setParamType]=useState("-1");
    const [paramGender,setParamGender]=useState("-1");
    const [paramStatus,setParamStatus]=useState("-1");
    //模态框
    const [modalOpenFlag, setModalOpenFlag] = useState(false);
    const [adminUsername, setAdminUsername] = useState("");
    const [type, setType] = useState("");
    const [adminUserPhone, setAdminUserPhone] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("1");
    const [pageNumber,setPageNumber] = useState(0);

    const [validation,setValidation] = useState({});
    //判断新增还是修改
    const [modalCreateFlag, setModalCreateFlag] = useState(false);
    //详情获取id
    const [id, setId] = useState("");
    //用户状态
    const [status, setStatus] = useState("");

    useEffect(()=>{
        const queryObj = {
            realName:paramRealName,
            status:paramStatus,
            phone :paramPhone,
            type :paramType,
            gender :paramGender,
            start :pageNumber
        };
        props.setQueryObj(queryObj);
    },[paramRealName,paramStatus,paramPhone,paramType,paramGender,pageNumber])

    //验证()
    const validate = ()=>{
        const validateObj ={}
        if(modalCreateFlag==true){
            if (!adminUserPhone) {
                validateObj.adminUserPhone ='请输入手机号';
            } else if (adminUserPhone.length != 11) {
                validateObj.adminUserPhone ='请输入11位手机号';
            }
            if (!adminUsername) {
                validateObj.adminUsername ='请输入用户姓名';
            }
            if (!password) {
                validateObj.password ='请输入密码';
            }else if (password.length <6) {
                validateObj.password ='请输入大于6位的密码';
            }
        }
        if(modalCreateFlag==false){
            if (!adminUsername) {
                validateObj.adminUsername ='请输入用户姓名';
            }
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    }
    const addUser= ()=>{
        const errorCount = validate();
        if(errorCount==0){
            props.addUser(adminUsername, adminUserPhone,password,gender,type,1);
            setModalOpenFlag(false);
        }
    }
    const setUser= ()=>{
        const errorCount = validate();
        if(errorCount==0){
            props.updateUserInfo(adminUsername, gender,type,id);
            setModalOpenFlag(false);
        }
    }
    const updateUserStatus= (status,id)=>{
        Swal.fire({
            title: status === 1 ? "确定停用该员工？" : "确定重新启用该员工？",
            text: "",
            icon: "warning",
            confirmButtonText:'确定',
            cancelButtonText: "取消",
        }).then(async function (isConfirm) {
            updateUserStatusInfo(status,id)
        })
    }
    // 关闭模态
    const modalClose = () => {
        setModalOpenFlag(false);
    };

    useEffect(()=>{
        props.getUserList();
        props.getUserTypeList();
    },[]);

    const getUserArray =() =>{
        props.setQueryObj({
            realName:paramRealName,
            status:paramStatus,
            phone :paramPhone,
            type :paramType,
            gender :paramGender,
            start :0})
        props.getUserList();
        setPageNumber(0);
    }

    //初始添加模态框值
    const handleAddOpen =(user) =>{
        setModalOpenFlag(true);
        if (user == null) {
            setModalCreateFlag(true);
            setAdminUsername('');
            setType('1032');
            setAdminUserPhone('');
            setPassword('');
            setGender('1');
        } else {
            setModalCreateFlag(false);
            setAdminUsername(user.real_name);
            setType(user.type);
            setAdminUserPhone(user.phone);
            setGender(user.gender);
            setId(user.id);
            setStatus(user.status);
        }
    }

    //上一页
    const getPreUserList = () => {
        setPageNumber(pageNumber- (props.adminUserSettingReducer.size-1));
        props.setQueryObj({
            realName:paramRealName,
            status:paramStatus,
            phone :paramPhone,
            type :paramType,
            gender :paramGender,
            start :pageNumber- (props.adminUserSettingReducer.size-1)})
        props.getUserList();
    };

    //下一页
    const getNextUserList = () => {
        setPageNumber(pageNumber+ (props.adminUserSettingReducer.size-1));
        props.setQueryObj({
            realName:paramRealName,
            status:paramStatus,
            phone :paramPhone,
            type :paramType,
            gender :paramGender,
            start :pageNumber+ (props.adminUserSettingReducer.size-1)})
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
                        value={paramPhone}
                        onChange={(e)=>setParamPhone(e.target.value)}
                    />
                </Grid>
                <Grid item xs>
                    <TextField
                        fullWidth={true}
                        margin="dense"
                        variant="outlined"
                        label="用户姓名"
                        value={paramRealName}
                        onChange={(e)=>setParamRealName(e.target.value)}
                    />
                </Grid>
                <Grid item xs>
                    <TextField className={classes.selectCondition}
                               select
                               margin="dense"
                               label="用户群组"
                               value={paramType}
                               onChange={(e)=>setParamType(e.target.value)}
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
                               value={paramGender}
                               onChange={(e)=>setParamGender(e.target.value)}
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
                               onChange={(e)=>setParamStatus(e.target.value)}
                               value={paramStatus}
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
                        <Fab size="small" color="primary" aria-label="add" onClick={() => {getUserArray()}}>
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
                                <StyledTableCell align="center">手机</StyledTableCell>
                                <StyledTableCell align="center">用户名称</StyledTableCell>
                                <StyledTableCell align="center">用户群组</StyledTableCell>
                                <StyledTableCell align="center">性别</StyledTableCell>
                                <StyledTableCell align="center">状态</StyledTableCell>
                                <StyledTableCell align="center">操作</StyledTableCell>
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
                                                updateUserStatus(row.status,row.id)
                                            }}
                                            name="状态"
                                            color='primary'
                                            inputProps={{ 'aria-label': 'secondary checkbox' }}
                                        />
                                      <IconButton size="primary" color="primary" onClick={() => {getUserById(row.id);handleAddOpen(row);}}><i className="mdi mdi-table-search purple-font margin-left10"
                                        > </i>
                                      </IconButton>
                                    </TableCell>
                                </TableRow>))}
                            { adminUserSettingReducer.adminArray.length === 0 &&
                                <TableRow style={{height:60}}> <TableCell align="center" colSpan="6">暂无数据</TableCell></TableRow>
                            }
                        </TableBody>
                    </Table>

                    {adminUserSettingReducer.dataSize >= adminUserSettingReducer.size &&
                    <Button className={classes.button} variant="contained" color="primary"  onClick={getNextUserList}>
                        下一页
                    </Button>}
                    {adminUserSettingReducer.queryObj.start > 0 && adminUserSettingReducer.dataSize > 0 &&
                    <Button className={classes.button} variant="contained" color="primary" onClick={getPreUserList}>
                        上一页
                    </Button>}

                </TableContainer>
            </Grid>

            {/*添加或修改用户信息*/}
            <SimpleModal
                title={modalCreateFlag==true ? "新增用户信息" : "修改用户信息"}
                open={modalOpenFlag}
                onClose={modalClose}
                showFooter={true}
                footer={
                    <>
                        {status!=0&&modalCreateFlag==false? <Button variant="contained" onClick={setUser}  color="primary">
                            确定
                        </Button>:'' }


                        {modalCreateFlag==true?
                            <Button variant="contained" onClick={addUser} color="primary">
                                确定
                            </Button>:''}

                        <Button onClick={modalClose} color="primary" autoFocus>
                            取消
                        </Button>
                    </>
                }
            >
                <Grid  container spacing={3}>
                    <Grid item xs>
                        <TextField fullWidth
                                   margin='normal'
                                   disabled={modalCreateFlag?false:true}
                                   name="adminUserPhone"
                                   type="text"
                                   label="手机"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setAdminUserPhone(e.target.value)
                                   }}
                                   error={validation.adminUserPhone && validation.adminUserPhone!=''}
                                   helperText={validation.adminUserPhone}
                                   value={adminUserPhone}

                        />
                    </Grid>
                    <Grid item xs>
                        <TextField fullWidth
                                   margin='normal'
                                   label="用户姓名"
                                   name="adminUsername"
                                   type="text"
                                   variant="outlined"
                                   onChange={(e)=>{
                                       setAdminUsername(e.target.value)
                                   }}
                                   error={validation.adminUsername&&validation.adminUsername!=''}
                                   helperText={validation.adminUsername}
                                   value={adminUsername}

                        />
                    </Grid>
                </Grid>
                <Grid  container spacing={3}>
                    {modalCreateFlag==true ?  <Grid item xs>
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
    setQueryObj:(queryObj) =>{
        dispatch(AdminUserSettingActionType.setQueryObj(queryObj))
    },
    //群组查找
    getUserTypeList:() =>{
        dispatch(adminUserSettingAction.getUserTypeList())
    },
    //添加员工
    addUser: (realName, phone,password,gender,type,status) => {
        if (realName.length > 0 && phone.length > 0 && password.length > 0) {
            dispatch(adminUserSettingAction.addUser({realName, phone,password,gender,type,status}));
        }
    },
    //获取列表
    getUserList: () => {
        dispatch(adminUserSettingAction.getUserList())

    },
    //修改员工信息(获取初始值)
    getUserById:(id) => {
        dispatch(adminUserSettingAction.getUserById(id))
    },
    //修改员工信息
    updateUserInfo: (realName, gender,type,id) => {
        if (realName.length > 0) {
            dispatch(adminUserSettingAction.updateUserInfo({realName, gender,type},id))
        }
    },
    //修改状态
    updateUserStatusInfo:(flag,id) =>{
        dispatch(adminUserSettingAction.updateUserStatus(flag,id))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AdminUserSetting)


