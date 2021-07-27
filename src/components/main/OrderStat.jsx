import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import ReactECharts from 'echarts-for-react';
import {Divider, Grid, makeStyles, MenuItem, Paper, Select, Typography} from "@material-ui/core";

const orderStatAction = require('../../actions/main/OrderStatAction');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead: customTheme.tableHead
}));

function OrderStat(props) {
    const {orderStatReducer, getStatOrderByDay, getStatOrderByMonth} = props;
    const classes = useStyles();

    const [dateRange, setDateRange] = React.useState(sysConst.DATE_RANGE[0].value);
    const [monthOption, setMonthOption] = React.useState({});
    const [dayOption, setDayOption] = React.useState({});

    // 执行1次，取得数结构
    useEffect(() => {
        getStatOrderByDay(sysConst.DATE_RANGE[0].value);
        getStatOrderByMonth();
    }, []);

    useEffect(() => {
        if (orderStatReducer.statOrderByDay.length > 0) {
            setDayOpt();
        }
    }, [orderStatReducer.statOrderByDay.length]);

    useEffect(() => {
        if (orderStatReducer.statOrderByMonth.length > 0) {
            setMonthOpt();
        }
    }, [orderStatReducer.statOrderByMonth.length]);

    const setMonthOpt = () => {
        let xAxis = {data: []};
        let series = [{name: '订单', type: 'bar', data: []}];
        for (let item of orderStatReducer.statOrderByMonth.values()) {
            xAxis.data.push(item.y_month);
            series[0].data.push(item.service_price);
        }
        // 反转
        xAxis.data.reverse();
        series[0].data.reverse();
        setMonthOption(createOption('', '订单', xAxis, series));
    };

    const setDayOpt = () => {
        let xAxis = {data: []};
        let series = [{name: '订单', type: 'bar', data: []}];
        for (let item of orderStatReducer.statOrderByDay.values()) {
            xAxis.data.push(item.id);
            series[0].data.push(item.service_price);
        }
        // 反转
        xAxis.data.reverse();
        series[0].data.reverse();
        setDayOption(createOption('', '订单', xAxis, series));
    };

    const createOption = (title, legend, xAxis, series) => {
        return {
            title: {text: title},
            tooltip: {},
            legend: {data: [legend]},
            xAxis: xAxis,
            yAxis: {},
            series: series
        };
    };

    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>订单统计</Typography>
            <Divider light className={classes.divider}/>

            <Paper elevation={3}>
                <Paper style={{background: '#F9F9F9'}} variant="outlined">
                    <Grid container spacing={0}>
                        <Grid item xs={6} style={{padding: 10}}>订单（按天统计）</Grid>
                        <Grid item xs={6} style={{textAlign: 'right'}}>
                            <Select label="最近天数"
                                    style={{height: 40, width: 120}}
                                    value={dateRange}
                                    onChange={(e, value) => {
                                        setDateRange(e.target.value);
                                        getStatOrderByDay(e.target.value);
                                    }}
                            >
                                {sysConst.DATE_RANGE.map((item, index) => (
                                    <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                                ))}
                            </Select>
                        </Grid>
                    </Grid>
                </Paper>
                <ReactECharts style={{height: 400}} option={dayOption}/>
            </Paper>

            <Paper elevation={3}>
                <Paper style={{background: '#f9f9f9'}} variant="outlined">
                    <Grid container spacing={0}>
                        <Grid item xs={6} style={{padding: 10}}>订单（按月统计）</Grid>
                    </Grid>
                </Paper>
                <ReactECharts  style={{height: 400}} option={monthOption}/>
            </Paper>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        orderStatReducer: state.OrderStatReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    getStatOrderByDay: (size) => {
        dispatch(orderStatAction.getStatOrderByDay(size))
    },
    getStatOrderByMonth: () => {
        dispatch(orderStatAction.getStatOrderByMonth())
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderStat)