import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Link} from "react-router-dom";
// 引入material-ui基础组件
import {Box, Button, Divider, Grid, IconButton, makeStyles, Paper,Fab, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from '@material-ui/pickers';
// 引入Dialog
import {UserAchievementActionType} from "../../types";
const UserAchievementAction = require('../../actions/main/UserAchievementAction');
const commonAction = require('../../actions/layout/CommonAction');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead:customTheme.tableHead,
}));

function UserAchievement(props) {
    const {userAchievementReducer,commonReducer, fromDetail} = props;
    const classes = useStyles();
    const dispatch = useDispatch();

    useEffect(() => {
        // 详情页面 返回 保留reducer，否则，清空
        if (!fromDetail) {
            let queryParams = {
                reUserId:null,
                userType:null,
                finDateStart: '',
                finDateEnd: '',
            };
            dispatch(UserAchievementActionType.setUserQueryParams(queryParams));
        }
        // 取得画面 select控件，基础数据
        props.getUserList();
        props.getUserType();
        props.getUserAchievementList(userAchievementReducer.userData.start);
    }, []);
    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>员工绩效</Typography>
            <Divider light className={classes.divider}/>

            {/* 上部分：检索条件输入区域 */}
            <Grid container spacing={3}>
                <Grid container item xs={10} spacing={1}>
                    <Grid item xs={3}>
                        <Autocomplete fullWidth
                                      options={userAchievementReducer.typeData}
                                      getOptionLabel={(option) => option.type_name}
                                      value={userAchievementReducer.userParams.userType}
                                      onChange={(event, value) => {
                                          dispatch(UserAchievementActionType.setUserQueryParam({name: "userType", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="用户群组" margin="dense" variant="outlined"/>}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <Autocomplete fullWidth
                                      options={commonReducer.userList}
                                      getOptionLabel={(option) => option.real_name}
                                      value={userAchievementReducer.userParams.reUserId}
                                      onChange={(event, value) => {
                                          dispatch(UserAchievementActionType.setUserQueryParam({name: "reUserId", value: value}));
                                      }}
                                      renderInput={(params) => <TextField {...params} label="用户" margin="dense" variant="outlined"/>}
                        />
                    </Grid>

                    <Grid item xs={3}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（始）"
                                    value={userAchievementReducer.userParams.finDateStart=="" ? null : userAchievementReducer.userParams.finDateStart}
                                    onChange={(date)=>{
                                        dispatch(UserAchievementActionType.setUserQueryParam({name: "finDateStart", value: date}))
                                    }}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                    label="完成日期（终）"
                                    value={userAchievementReducer.userParams.finDateEnd=="" ? null : userAchievementReducer.userParams.finDateEnd}
                                    onChange={(date)=>{
                                        dispatch(UserAchievementActionType.setUserQueryParam({name: "finDateEnd", value: date}))
                                    }}
                        />
                    </Grid>
                </Grid>
                <Grid item xs={2} container style={{textAlign:'right',marginTop:10}}>
                    {/*查询按钮*/}
                    <Grid item xs={12} align="center">
                        <Fab color="primary" size="small" onClick={()=>{dispatch(UserAchievementAction.getUserAchievementList(0))}}>
                            <i className="mdi mdi-magnify mdi-24px"/>
                        </Fab>
                    </Grid>
                </Grid>
            </Grid>

            {/* 下部分：检索结果显示区域 */}
            <TableContainer component={Paper} style={{marginTop: 20}}>
                <Table stickyHeader size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHead} align="center">员工</TableCell>
                            <TableCell className={classes.tableHead} align="center">施工笔数</TableCell>
                            <TableCell className={classes.tableHead} align="center">施工收益</TableCell>
                            <TableCell className={classes.tableHead} align="center">验收笔数</TableCell>
                            <TableCell className={classes.tableHead} align="center">验收收益</TableCell>
                            <TableCell className={classes.tableHead} align="center">操作</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {userAchievementReducer.userParams.finDateStart!==''&&userAchievementReducer.userParams.finDateEnd!==''
                        &&userAchievementReducer.userParams.finDateStart!==null&&userAchievementReducer.userParams.finDateEnd!==null
                        &&userAchievementReducer.userData.userInfo.map((row,index) => (
                            <TableRow key={'userAchievement-'+index}>
                                <TableCell align="center">{row.real_name}</TableCell>
                                <TableCell align="center">{row.deploy_count}</TableCell>
                                <TableCell align="center">{row.deploy_perf}</TableCell>
                                <TableCell align="center">{row.check_count}</TableCell>
                                <TableCell align="center">{row.check_perf}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" edge="start" size="small">
                                        <Link to={{pathname: '/user_achievement/' + row.id+'&finDateStart='+commonUtil.formatDate(userAchievementReducer.userParams.finDateStart, 'yyyyMMdd')+'&finDateEnd='+commonUtil.formatDate(userAchievementReducer.userParams.finDateEnd, 'yyyyMMdd')}}><i className="mdi mdi-table-search"/></Link>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}

                        {userAchievementReducer.userData.userInfo.length === 0 &&
                        <TableRow>
                            <TableCell colSpan={6} align="center">暂无数据</TableCell>
                        </TableRow>}
                        {(userAchievementReducer.userParams.finDateStart==''||userAchievementReducer.userParams.finDateEnd==''||
                         userAchievementReducer.userParams.finDateStart==null||userAchievementReducer.userParams.finDateEnd==null)
                        &&
                            <TableRow>
                                <TableCell colSpan={6} align="center">请选择完成时间</TableCell>
                            </TableRow> }
                    </TableBody>
                </Table>
            </TableContainer>

            {/* 上下页按钮 */}
            <Box style={{textAlign: 'right', marginTop: 20}}>
                {userAchievementReducer.userData.start > 0 && userAchievementReducer.userData.dataSize > 0 &&
                <Button variant="contained" color="primary" style={{marginRight: 20}}
                        onClick={()=>{dispatch(UserAchievementAction.getUserAchievementList(userAchievementReducer.userData.start-(userAchievementReducer.userData.size-1)))}}>上一页</Button>}
                {userAchievementReducer.userData.dataSize >= userAchievementReducer.userData.size &&
                <Button variant="contained" color="primary"
                        onClick={()=>{dispatch(UserAchievementAction.getUserAchievementList(userAchievementReducer.userData.start+(userAchievementReducer.userData.size-1)))}}>下一页</Button>}
            </Box>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    let fromDetail = false;
    if (typeof ownProps.location.state != 'undefined' && ownProps.location.state != null && ownProps.location.state.fromDetail) {
        fromDetail = true;
    }
    return {
        userAchievementReducer: state.UserAchievementReducer,
        commonReducer:state.CommonReducer,
        fromDetail: fromDetail
    }
};

const mapDispatchToProps = (dispatch) => ({
    getUserType:() => {
        dispatch(UserAchievementAction.getUserType())
    },
    getUserAchievementList: (dataStart) => {
        dispatch(UserAchievementAction.getUserAchievementList(dataStart))
    },
    getUserList: () => {
        dispatch(commonAction.getUserList())
    },
});
export default connect(mapStateToProps, mapDispatchToProps)(UserAchievement)
