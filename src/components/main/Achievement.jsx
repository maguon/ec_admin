import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Grid, Typography, AppBar, Tab, Tabs, TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, TextField, Fab, Box, Button} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from "@material-ui/pickers";
import {AchievementActionType} from "../../types";
const commonAction = require('../../actions/layout/CommonAction');
const customTheme = require('../layout/Theme').customTheme;
const AchievementAction = require('../../actions/main/AchievementAction');
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        paddingLeft: 30
    },
    // 标题样式
    pageTitle: customTheme.pageTitle,
    pageDivider: customTheme.pageDivider,
    tableHead:customTheme.tableHead,
    selectLabel: {
        fontSize: 10,
        color: 'grey'
    },
    select: {
        width: '100%',
    },
    selectCondition: {
        width: '100%',
    },
    button:{
        margin:'15px',
        float:'right'
    },
    divider:{
        margin:'20px 0',
        paddingTop:6
    },
    updateButton:{
        marginTop:'20px',
        float:'right'
    }
}));
//绩效信息---详情
function Achievement (props){
    const {achievementReducer,commonReducer,getOrderItemService,getOrderItemProd} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [value, setValue] = React.useState('1');
    useEffect(()=>{
        let  serviceParams= {
                orderId:'',
                saleServiceId:null,
                deployUserId:null,
                checkUserId:null,
                dateStart:'',
                dateEnd:''
            };
        let productParams= {
                purchaseId:'',
                supplierId:null,
                orderId:'',
                saleUserId:null,
                prodId:null,
                dateStart:'',
                dateEnd:''
            };
        dispatch(AchievementActionType.setServiceParams(serviceParams));
        dispatch(AchievementActionType.setProductParams(productParams));
        props.getBaseSelectList();
        getOrderItemService(0);
        getOrderItemProd(0)
    },[]);

    const changeTab = (event, newValue) => {
        setValue(newValue);
        if(newValue=='1'){
            getOrderItemService(0);
        }
        if(newValue=='2'){
            getOrderItemProd(0);
        }
    };
    const getOrderItemServiceArray=()=>{
        getOrderItemService(0)
    }
    const getOrderItemProdArray=()=>{
        getOrderItemProd(0)
    }
    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>绩效信息</Typography>
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
                            <Tab label="服务"   value="1" />
                            <Tab label="商品"   value="2" />
                        </Tabs>
                    </AppBar>
                    <TabPanel value='1'>
                        <div>
                            {/*查询条件*/}
                            <Grid container  spacing={1}>
                                <Grid container item xs={11} spacing={1}>
                                    {/*订单号*/}
                                    <Grid item xs>
                                        <TextField label="订单编号" fullWidth margin="dense" variant="outlined" type="number" value={achievementReducer.serviceParams.orderId}
                                                   onChange={(e)=>{dispatch(AchievementActionType.setServiceParam({name: "orderId", value: e.target.value}))}}/>

                                    </Grid>
                                    {/*名称*/}
                                    <Grid item  xs>
                                        <Autocomplete fullWidth
                                                      options={commonReducer.saleServiceList}
                                                      getOptionLabel={(option) => option.service_name}
                                                      value={achievementReducer.serviceParams.saleServiceId}
                                                      onChange={(event, value) => {
                                                          dispatch(AchievementActionType.setServiceParam({name: "saleServiceId", value: value}));
                                                      }}
                                                      renderInput={(params) => <TextField {...params} label="服务名称" margin="dense" variant="outlined"/>}
                                        />
                                    </Grid>
                                    {/*施工*/}
                                    <Grid item  xs>
                                        <Autocomplete fullWidth
                                                      options={commonReducer.userList}
                                                      getOptionLabel={(option) => option.real_name}
                                                      value={achievementReducer.serviceParams.deployUserId}
                                                      onChange={(event, value) => {
                                                          dispatch(AchievementActionType.setServiceParam({name: "deployUserId", value: value}));
                                                      }}
                                                      renderInput={(params) => <TextField {...params} label="施工人" margin="dense" variant="outlined"/>}
                                        />
                                    </Grid>
                                    {/*验收*/}
                                    <Grid item  xs>
                                        <Autocomplete fullWidth
                                                      options={commonReducer.userList}
                                                      getOptionLabel={(option) => option.real_name}
                                                      value={achievementReducer.serviceParams.checkUserId}
                                                      onChange={(event, value) => {
                                                          dispatch(AchievementActionType.setServiceParam({name: "checkUserId", value: value}));
                                                      }}
                                                      renderInput={(params) => <TextField {...params} label="验收人" margin="dense" variant="outlined"/>}
                                        />
                                    </Grid>
                                    {/*时间*/}
                                    <Grid item  xs>
                                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                                    label="创建时间（始）"
                                                    value={achievementReducer.serviceParams.dateStart=='' ? null :achievementReducer.serviceParams.dateStart}
                                                    onChange={(date) => {
                                                        dispatch(AchievementActionType.setServiceParam({name: "dateStart", value:date}));
                                                    }}
                                        />
                                    </Grid>
                                    <Grid item  xs>
                                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                                    label="创建时间（终）"
                                                    value={achievementReducer.serviceParams.dateEnd==''? null :achievementReducer.serviceParams.dateEnd}
                                                    onChange={(date) => {
                                                        dispatch(AchievementActionType.setServiceParam({name: "dateEnd", value:date}));
                                                    }}
                                        />
                                    </Grid>
                                </Grid>
                                {/*查询按钮*/}
                                <Grid item xs={1} style={{textAlign: 'right',marginTop:10}}>
                                    <Fab color="primary" size="small" onClick={getOrderItemServiceArray}>
                                        <i className="mdi mdi-magnify mdi-24px"/>
                                    </Fab>
                                </Grid>
                            </Grid>
                            {/*主体*/}
                            <TableContainer component={Paper} style={{marginTop:10}}>
                                <Table  size='small' aria-label="a dense table">
                                    <TableHead >
                                        <TableRow>
                                            <TableCell className={classes.tableHead} align="center">订单号</TableCell>
                                            <TableCell className={classes.tableHead} align="center">服务名称</TableCell>
                                            <TableCell className={classes.tableHead} align="center">售价</TableCell>
                                            <TableCell className={classes.tableHead} align="center">折扣</TableCell>
                                            <TableCell className={classes.tableHead} align="center">实际价格</TableCell>
                                            <TableCell className={classes.tableHead} align="center">施工</TableCell>
                                            <TableCell className={classes.tableHead} align="center">验收</TableCell>
                                            <TableCell className={classes.tableHead} align="center">时间</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {achievementReducer.serviceData.serviceInfo.length > 0 &&achievementReducer.serviceData.serviceInfo.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell align="center" >{row.order_id}</TableCell>
                                                <TableCell align="center" >{row.sale_service_name}</TableCell>
                                                <TableCell align="center" >{row.fixed_price=='0.00'?row.unit_price+'*'+Number(row.service_count):row.fixed_price}</TableCell>
                                                <TableCell align="center" >{row.discount_service_price}</TableCell>
                                                <TableCell align="center" >{row.actual_service_price}</TableCell>
                                                <TableCell align="center" >{row.deploy_user_name}</TableCell>
                                                <TableCell align="center" >{row.check_user_name}</TableCell>
                                                <TableCell align="center" >{row.or_date_id}</TableCell>
                                            </TableRow>))}
                                        {achievementReducer.serviceData.serviceInfo.length === 0 &&
                                        <TableRow style={{height:60}}><TableCell align="center" colSpan="8">暂无数据</TableCell></TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {/* 上下页按钮 */}
                            <Box style={{textAlign: 'right'}}>
                                {achievementReducer.serviceData.dataSize >=achievementReducer.serviceData.size &&
                                <Button className={classes.button} variant="contained" color="primary"  size="small"
                                        onClick={()=>{dispatch(AchievementAction.getOrderItemService(achievementReducer.serviceData.start+(achievementReducer.serviceData.size-1)))}}>
                                    下一页
                                </Button>}
                                {achievementReducer.serviceData.start > 0 &&achievementReducer.serviceData.dataSize > 0 &&
                                <Button className={classes.button} variant="contained" color="primary"  size="small" style={{marginRight: 20}}
                                    onClick={()=>{dispatch(AchievementAction.getOrderItemService(achievementReducer.serviceData.start-(achievementReducer.serviceData.size-1)))}}>
                                    上一页
                                </Button>}
                            </Box>
                        </div>
                    </TabPanel>
                    <TabPanel value='2'>
                        <div>
                            {/*查询条件*/}
                            <Grid container  spacing={1}>
                                <Grid container item xs={11} spacing={1}>
                                    {/*订单号*/}
                                    <Grid item xs>
                                        <TextField label="订单编号" fullWidth margin="dense" variant="outlined" type="number" value={achievementReducer.productParams.orderId}
                                                   onChange={(e)=>{dispatch(AchievementActionType.setProductParam({name: "orderId", value: e.target.value}))}}/>

                                    </Grid>
                                    {/*采购单号*/}
                                    <Grid item xs>
                                        <TextField label="采购单号" fullWidth margin="dense" variant="outlined" type="number" value={achievementReducer.productParams.purchaseId}
                                                   onChange={(e)=>{dispatch(AchievementActionType.setProductParam({name: "purchaseId", value: e.target.value}))}}/>

                                    </Grid>
                                    {/*供应商*/}
                                    <Grid item  xs>
                                        <Autocomplete fullWidth
                                                      options={commonReducer.supplierList}
                                                      getOptionLabel={(option) => option.supplier_name}
                                                      value={achievementReducer.productParams.supplierId}
                                                      onChange={(event, value) => {
                                                          dispatch(AchievementActionType.setProductParam({name: "supplierId", value: value}));
                                                      }}
                                                      renderInput={(params) => <TextField {...params} label="供应商" margin="dense" variant="outlined"/>}
                                        />
                                    </Grid>
                                    {/*名称*/}
                                    <Grid item  xs>
                                        <Autocomplete fullWidth
                                                      options={commonReducer.productList}
                                                      getOptionLabel={(option) => option.product_name}
                                                      value={achievementReducer.productParams.prodId}
                                                      onChange={(event, value) => {
                                                          dispatch(AchievementActionType.setProductParam({name: "prodId", value: value}));
                                                      }}
                                                      renderInput={(params) => <TextField {...params} label="商品名称" margin="dense" variant="outlined"/>}
                                        />
                                    </Grid>
                                    {/*销售*/}
                                    <Grid item  xs>
                                        <Autocomplete fullWidth
                                                      options={commonReducer.userList}
                                                      getOptionLabel={(option) => option.real_name}
                                                      value={achievementReducer.productParams.saleUserId}
                                                      onChange={(event, value) => {
                                                          dispatch(AchievementActionType.setProductParam({name: "saleUserId", value: value}));
                                                      }}
                                                      renderInput={(params) => <TextField {...params} label="销售" margin="dense" variant="outlined"/>}
                                        />
                                    </Grid>
                                    {/*时间*/}
                                    <Grid item  xs>
                                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                                    label="创建时间（始）"
                                                    value={achievementReducer.productParams.dateStart=='' ? null :achievementReducer.productParams.dateStart}
                                                    onChange={(date) => {
                                                        dispatch(AchievementActionType.setProductParam({name: "dateStart", value:date}));
                                                    }}
                                        />
                                    </Grid>
                                    <Grid item  xs>
                                        <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense" format="yyyy/MM/dd"
                                                    okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                                    label="创建时间（终）"
                                                    value={achievementReducer.productParams.dateEnd==''? null :achievementReducer.productParams.dateEnd}
                                                    onChange={(date) => {
                                                        dispatch(AchievementActionType.setProductParam({name: "dateEnd", value:date}));
                                                    }}
                                        />
                                    </Grid>
                                </Grid>
                                {/*查询按钮*/}
                                <Grid item xs={1} style={{textAlign: 'right',marginTop:10}}>
                                    <Fab color="primary" size="small" onClick={getOrderItemProdArray}>
                                        <i className="mdi mdi-magnify mdi-24px"/>
                                    </Fab>
                                </Grid>
                            </Grid>
                            {/*主体*/}
                            <TableContainer component={Paper} style={{marginTop:20}}>
                                <Table  size={'small'} aria-label="a dense table">
                                    <TableHead >
                                        <TableRow>
                                            <TableCell className={classes.tableHead} align="center">订单号</TableCell>
                                            <TableCell className={classes.tableHead} align="center">商品名称</TableCell>
                                            <TableCell className={classes.tableHead} align="center">价格*数量</TableCell>
                                            <TableCell className={classes.tableHead} align="center">折扣</TableCell>
                                            <TableCell className={classes.tableHead} align="center">实际价格</TableCell>
                                            <TableCell className={classes.tableHead} align="center">销售</TableCell>
                                            <TableCell className={classes.tableHead} align="center">采购单号</TableCell>
                                            <TableCell className={classes.tableHead} align="center">供应商</TableCell>
                                            <TableCell className={classes.tableHead} align="center">时间</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {achievementReducer.productData.productInfo.length > 0 &&achievementReducer.productData.productInfo.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell align="center" >{row.order_id}</TableCell>
                                                <TableCell align="center" >{row.prod_name}</TableCell>
                                                <TableCell align="center" >{row.unit_price}*{Number(row.prod_count)}</TableCell>
                                                <TableCell align="center" >{row.discount_prod_price}</TableCell>
                                                <TableCell align="center" >{row.actual_prod_price}</TableCell>
                                                <TableCell align="center" >{row.sale_user_name}</TableCell>
                                                <TableCell align="center" >{row.purchase_id}</TableCell>
                                                <TableCell align="center" >{row.supplier_name}</TableCell>
                                                <TableCell align="center" >{row.date_id}</TableCell>
                                            </TableRow>))}
                                        {achievementReducer.productData.productInfo.length === 0 &&
                                        <TableRow style={{height:60}}><TableCell align="center" colSpan="9">暂无数据</TableCell></TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                            {/* 上下页按钮 */}
                            <Box style={{textAlign: 'right'}}>
                                {achievementReducer.productData.dataSize >=achievementReducer.productData.size &&
                                <Button className={classes.button} variant="contained" color="primary"  size="small"
                                        onClick={()=>{dispatch(AchievementAction.getOrderItemProd(achievementReducer.productData.start+(achievementReducer.productData.size-1)))}}>
                                    下一页
                                </Button>}
                                {achievementReducer.productData.start > 0 &&achievementReducer.productData.dataSize > 0 &&
                                <Button className={classes.button} variant="contained" color="primary"  size="small" style={{marginRight: 20}}
                                        onClick={()=>{dispatch(AchievementAction.getOrderItemProd(achievementReducer.productData.start-(achievementReducer.productData.size-1)))}}>
                                    上一页
                                </Button>}
                            </Box>
                        </div>
                    </TabPanel>
                </TabContext>
            </div>
        </div>
    )
}
const mapStateToProps = (state) => {
    return {
        achievementReducer: state.AchievementReducer,
        commonReducer: state.CommonReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    getBaseSelectList:()=>{
        // 取得用户信息列表
        dispatch(commonAction.getUserList());
        // 取得服务列表
        dispatch(commonAction.getSaleServiceList());
        // 取得商品列表
        dispatch(commonAction.getProductList());
        // 取得供应商列表
        dispatch(commonAction.getSupplierList());
    },
    getOrderItemService: (start) => {
        dispatch(AchievementAction.getOrderItemService(start));
    },
    getOrderItemProd: (start) => {
        dispatch(AchievementAction.getOrderItemProd(start));
    },

});
export default connect(mapStateToProps, mapDispatchToProps)(Achievement)