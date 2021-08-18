import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {Typography, AppBar, Tab, Tabs, TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, IconButton} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import {Link, useParams} from "react-router-dom";
const customTheme = require('../layout/Theme').customTheme;
const UserAchievementDetailAction = require('../../actions/main/UserAchievementDetailAction');
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {paddingLeft: 30 },
    // 标题样式
    pageTitle: customTheme.pageTitle,
    pageDivider: customTheme.pageDivider,
    tableHead:customTheme.tableHead,
}));
//绩效信息---详情
function UserAchievementDetail (props){
    const {userAchievementDetailReducer,getDeployServiceData,getCheckServiceData} = props;
    const classes = useStyles();
    const {id} = useParams();
    const {finDateStart} = useParams();
    const {finDateEnd} = useParams();
    const [value, setValue] = React.useState('1');
    useEffect(()=>{
        getDeployServiceData(id,finDateStart,finDateEnd);
        getCheckServiceData(id,finDateStart,finDateEnd)
    },[]);

    const changeTab = (event, newValue) => {
        setValue(newValue);
    };
    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>
                <Link to={{pathname: '/user_achievement', state: {fromDetail: true,finDateStart:finDateStart,finDateEnd:finDateEnd}}}>
                    <IconButton color="primary" edge="start"><i className="mdi mdi-arrow-left-bold"/></IconButton>
                </Link>
                员工绩效详情
            </Typography>
            <div className={classes.pageDivider}></div>

            {/*选项卡*/}
            <div>
                <TabContext value={value}>
                    <AppBar position="static" color="default">
                        <Tabs value={value}
                              onChange={changeTab}
                              indicatorColor="primary"
                              textColor="primary"
                              variant="fullWidth">
                            <Tab label="施工"   value="1" />
                            <Tab label="验收"   value="2" />
                        </Tabs>
                    </AppBar>
                    <TabPanel value='1'>
                        <div>
                            {/*主体*/}
                            <TableContainer component={Paper} style={{marginTop:10}}>
                                <Table  size='small' aria-label="a dense table">
                                    <TableHead >
                                        <TableRow>
                                            <TableCell className={classes.tableHead} align="center">订单号</TableCell>
                                            <TableCell className={classes.tableHead} align="center">名称</TableCell>
                                            <TableCell className={classes.tableHead} align="center">售价</TableCell>
                                            <TableCell className={classes.tableHead} align="center">折扣</TableCell>
                                            <TableCell className={classes.tableHead} align="center">实际价格</TableCell>
                                            <TableCell className={classes.tableHead} align="center">施工</TableCell>
                                            <TableCell className={classes.tableHead} align="center">时间</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {userAchievementDetailReducer.deployServiceInfo.length > 0 &&userAchievementDetailReducer.deployServiceInfo.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell align="center" >{row.order_id}</TableCell>
                                                <TableCell align="center" >{row.sale_service_name}</TableCell>
                                                <TableCell align="center" >{row.fixed_price=='0.00'?row.unit_price+'*'+Number(row.service_count):row.fixed_price}</TableCell>
                                                <TableCell align="center" >{row.discount_service_price}</TableCell>
                                                <TableCell align="center" >{row.actual_service_price}</TableCell>
                                                <TableCell align="center" >{row.deploy_user_name}</TableCell>
                                                <TableCell align="center" >{row.or_date_id}</TableCell>
                                            </TableRow>))}
                                        {userAchievementDetailReducer.deployServiceInfo.length === 0 &&
                                        <TableRow style={{height:60}}><TableCell align="center" colSpan="7">暂无数据</TableCell></TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </TabPanel>
                    <TabPanel value='2'>
                        <div>
                            {/*主体*/}
                            <TableContainer component={Paper} style={{marginTop:20}}>
                                <Table  size={'small'} aria-label="a dense table">
                                    <TableHead >
                                        <TableRow>
                                            <TableCell className={classes.tableHead} align="center">订单号</TableCell>
                                            <TableCell className={classes.tableHead} align="center">名称</TableCell>
                                            <TableCell className={classes.tableHead} align="center">售价</TableCell>
                                            <TableCell className={classes.tableHead} align="center">折扣</TableCell>
                                            <TableCell className={classes.tableHead} align="center">实际价格</TableCell>
                                            <TableCell className={classes.tableHead} align="center">验收</TableCell>
                                            <TableCell className={classes.tableHead} align="center">时间</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {userAchievementDetailReducer.checkServiceInfo.length > 0 &&userAchievementDetailReducer.checkServiceInfo.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell align="center" >{row.order_id}</TableCell>
                                                <TableCell align="center" >{row.sale_service_name}</TableCell>
                                                <TableCell align="center" >{row.fixed_price=='0.00'?row.unit_price+'*'+Number(row.service_count):row.fixed_price}</TableCell>
                                                <TableCell align="center" >{row.discount_service_price}</TableCell>
                                                <TableCell align="center" >{row.actual_service_price}</TableCell>
                                                <TableCell align="center" >{row.check_user_name}</TableCell>
                                                <TableCell align="center" >{row.or_date_id}</TableCell>
                                            </TableRow>))}
                                        {userAchievementDetailReducer.checkServiceInfo.length === 0 &&
                                        <TableRow style={{height:60}}><TableCell align="center" colSpan="7">暂无数据</TableCell></TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </div>
                    </TabPanel>
                </TabContext>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        userAchievementDetailReducer: state.UserAchievementDetailReducer,
        commonReducer: state.CommonReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    getDeployServiceData: (id,finDateStart,finDateEnd) => {
        dispatch(UserAchievementDetailAction.getDeployServiceData(id,finDateStart,finDateEnd));
    },
    getCheckServiceData: (id,finDateStart,finDateEnd) => {
        dispatch(UserAchievementDetailAction.getCheckServiceData(id,finDateStart,finDateEnd));
    },

});
export default connect(mapStateToProps, mapDispatchToProps)(UserAchievementDetail)