import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
import ReactECharts from 'echarts-for-react';
import {Divider, Fab, Grid, makeStyles, MenuItem, Paper, Select, Typography} from "@material-ui/core";
import {DatePicker} from "@material-ui/pickers";
import {ServiceItemStatActionType} from "../../types";
const ServiceItemStatAction = require('../../actions/main/ServiceItemStatAction');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead: customTheme.tableHead
}));
function ServiceItemStat(props) {
    const {serviceItemStatReducer,getStatServiceOrderType,getStatServiceOrderPartType} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const [orderTypeOption, setOrderTypeOption] = React.useState({});
    const [orderPartTypeOption, setOrderPartTypeOption] = React.useState({});
    // 执行1次，取得数结构
    useEffect(() => {
        getStatServiceOrderType();
        getStatServiceOrderPartType();
    }, []);

    useEffect(() => {
        if (serviceItemStatReducer.serviceOrderTypeArray.length > 0) {
            setOrderTypeOpt();
        }
    }, [serviceItemStatReducer.serviceOrderTypeArray.length]);

    useEffect(() => {
        if (serviceItemStatReducer.serviceOrderPartTypeArray.length > 0) {
            setOrderPartTypeOpt();
        }
    }, [serviceItemStatReducer.serviceOrderPartTypeArray.length]);

    const setOrderTypeOpt = () => {
        let legend = [];
        let series = [{name: '金额', type: 'pie', radius : '55%', center: ['50%', '60%'], data: [], itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }}];
        for (let item of sysConst.SERVICE_TYPE) {
            legend.push(item.label);
        }
        for (let item of serviceItemStatReducer.serviceOrderTypeArray) {
            for (let type of sysConst.SERVICE_TYPE) {
                if( type.value==item.service_type){
                    series[0].data.push({value:Number(item.service_price)+Number(item.prod_price),name:type.label})
                }
            }
        }
        setOrderTypeOption(createOption('', legend , series));
    };

    const setOrderPartTypeOpt = () => {
        let legend =  [];
        let series = [{name: '金额', type: 'pie',radius : '55%', center: ['50%', '60%'], data: [], itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }}];
        for (let item of sysConst.SERVICE_PART_TYPE) {
            legend.push(item.label);
        }
        for (let item of serviceItemStatReducer.serviceOrderPartTypeArray) {
            for (let type of sysConst.SERVICE_PART_TYPE) {
                if( type.value==item.service_part_type){
                    series[0].data.push({value:Number(item.service_price)+Number(item.prod_price),name:type.label})
                }
            }
        }
        setOrderPartTypeOption(createOption('',legend  , series));
    };

    const createOption = (title, legend, series) => {
        return {
            title: {text: title},
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: legend},
            series: series
        };
    };
    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>服务项目统计</Typography>
            <Divider light className={classes.divider}/>

            <Paper elevation={3}>
                <Paper style={{background: '#F9F9F9'}} variant="outlined">
                    <Grid container spacing={0}>
                        <Grid item xs={6} style={{padding: 10}}>服务类型</Grid>
                        <Grid item xs={6} style={{textAlign: 'right'}}>
                            <Grid container spacing={4}>
                                <Grid item xs={5}>
                                    <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                                format="yyyy/MM/dd"
                                                okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                                label="完成日期（始）"
                                                value={serviceItemStatReducer.serviceParams.dateStart == "" ? null : serviceItemStatReducer.serviceParams.dateStart}
                                                onChange={(date) => {
                                                    dispatch(ServiceItemStatActionType.setServiceParams({name: "dateStart", value: date}))
                                                }}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                                format="yyyy/MM/dd"
                                                okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                                label="完成日期（终）"
                                                value={serviceItemStatReducer.serviceParams.dateEnd == "" ? null : serviceItemStatReducer.serviceParams.dateEnd}
                                                onChange={(date) => {
                                                    dispatch(ServiceItemStatActionType.setServiceParams({name: "dateEnd", value: date}))
                                                }}
                                    />
                                </Grid>
                                <Grid item xs={2} container style={{textAlign:'center',marginTop:10}}>
                                    {/*查询按钮*/}
                                    <Grid item xs={6}>
                                        <Fab color="primary" size="small" onClick={()=>{dispatch(ServiceItemStatAction.getStatServiceOrderType())}}>
                                            <i className="mdi mdi-magnify mdi-24px"/>
                                        </Fab>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Paper>
                <ReactECharts style={{height: 400}} option={orderTypeOption}/>
            </Paper>
            <Paper elevation={3}>
                <Paper style={{background: '#F9F9F9'}} variant="outlined">
                    <Grid container spacing={0}>
                        <Grid item xs={6} style={{padding: 10}}>服务项目类型</Grid>
                        <Grid item xs={6} style={{textAlign: 'right'}}>
                            <Grid container spacing={4}>
                                <Grid item xs={5}>
                                    <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                                format="yyyy/MM/dd"
                                                okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                                label="完成日期（始）"
                                                value={serviceItemStatReducer.servicePartTypeParams.dateStart == "" ? null : serviceItemStatReducer.servicePartTypeParams.dateStart}
                                                onChange={(date) => {
                                                    dispatch(ServiceItemStatActionType.setServicePartTypeParams({name: "dateStart", value: date}))
                                                }}
                                    />
                                </Grid>
                                <Grid item xs={5}>
                                    <DatePicker autoOk fullWidth clearable inputVariant="outlined" margin="dense"
                                                format="yyyy/MM/dd"
                                                okLabel="确定" clearLabel="清除" cancelLabel={false} showTodayButton todayLabel="今日"
                                                label="完成日期（终）"
                                                value={serviceItemStatReducer.servicePartTypeParams.dateEnd == "" ? null : serviceItemStatReducer.servicePartTypeParams.dateEnd}
                                                onChange={(date) => {
                                                    dispatch(ServiceItemStatActionType.setServicePartTypeParams({name: "dateEnd", value: date}))
                                                }}
                                    />
                                </Grid>
                                <Grid item xs={2} container style={{textAlign:'center',marginTop:10}}>
                                    {/*查询按钮*/}
                                    <Grid item xs={6}>
                                        <Fab color="primary" size="small" onClick={()=>{dispatch(ServiceItemStatAction.getStatServiceOrderPartType())}}>
                                            <i className="mdi mdi-magnify mdi-24px"/>
                                        </Fab>
                                    </Grid>
                                </Grid>
                        </Grid>
                        </Grid>
                    </Grid>
                </Paper>
                <ReactECharts style={{height: 400}} option={orderPartTypeOption}/>
            </Paper>



        </div>
    )

}
const mapStateToProps = (state) => {
    return {
        serviceItemStatReducer: state.ServiceItemStatReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    getStatServiceOrderType: () => {
        dispatch(ServiceItemStatAction.getStatServiceOrderType())
    },
    getStatServiceOrderPartType: () => {
        dispatch(ServiceItemStatAction.getStatServiceOrderPartType())
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(ServiceItemStat)
