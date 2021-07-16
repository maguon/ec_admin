import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import ReactECharts from 'echarts-for-react';
import {Divider, Grid, makeStyles, MenuItem, Paper, Select, Typography} from "@material-ui/core";

const purchaseStatAction = require('../../actions/main/PurchaseStatAction');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead: customTheme.tableHead
}));

function PurchaseStat(props) {
    const {purchaseStatReducer, getStatPurchaseByDay, getStatPurchaseByMonth} = props;
    const classes = useStyles();

    const [dateRange, setDateRange] = React.useState(sysConst.DATE_RANGE[0].value);
    const [monthOption, setMonthOption] = React.useState({});
    const [dayOption, setDayOption] = React.useState({});

    // 执行1次，取得数结构
    useEffect(() => {
        getStatPurchaseByDay(sysConst.DATE_RANGE[0].value);
        getStatPurchaseByMonth();
    }, []);

    useEffect(() => {
        if (purchaseStatReducer.statPurchaseByDay.length > 0) {
            setDayOpt();
        }
    }, [purchaseStatReducer.statPurchaseByDay.length]);

    useEffect(() => {
        if (purchaseStatReducer.statPurchaseByMonth.length > 0) {
            setMonthOpt();
        }
    }, [purchaseStatReducer.statPurchaseByMonth.length]);

    const setMonthOpt = () => {
        let xAxis = {data: []};
        let series = [{name: '商品成本', type: 'bar', data: []}];
        for (let item of purchaseStatReducer.statPurchaseByMonth.values()) {
            xAxis.data.push(item.y_month);
            series[0].data.push(item.product_cost);
        }
        // 反转
        xAxis.data.reverse();
        series[0].data.reverse();
        setMonthOption(createOption('', '商品成本', xAxis, series));
    };

    const setDayOpt = () => {
        let xAxis = {data: []};
        let series = [{name: '商品成本', type: 'bar', data: []}];
        for (let item of purchaseStatReducer.statPurchaseByDay.values()) {
            xAxis.data.push(item.id);
            series[0].data.push(item.product_cost);
        }
        // 反转
        xAxis.data.reverse();
        series[0].data.reverse();
        setDayOption(createOption('', '商品成本', xAxis, series));
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
            <Typography gutterBottom className={classes.title}>采购统计</Typography>
            <Divider light className={classes.divider}/>

            <Paper elevation={3}>
                <Paper style={{background: '#F9F9F9'}} variant="outlined">
                    <Grid container spacing={0}>
                        <Grid item xs={6} style={{padding: 10}}>商品采购成本（按天统计）</Grid>
                        <Grid item xs={6} style={{textAlign: 'right'}}>
                            <Select label="最近天数"
                                    style={{height: 40, width: 120}}
                                    value={dateRange}
                                    onChange={(e, value) => {
                                        setDateRange(e.target.value);
                                        getStatPurchaseByDay(e.target.value);
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
                        <Grid item xs={6} style={{padding: 10}}>商品采购成本（按月统计）</Grid>
                    </Grid>
                </Paper>
                <ReactECharts  style={{height: 400}} option={monthOption}/>
            </Paper>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        purchaseStatReducer: state.PurchaseStatReducer,
    }
};

const mapDispatchToProps = (dispatch) => ({
    getStatPurchaseByDay: (size) => {
        dispatch(purchaseStatAction.getStatPurchaseByDay(size))
    },
    getStatPurchaseByMonth: () => {
        dispatch(purchaseStatAction.getStatPurchaseByMonth())
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseStat)