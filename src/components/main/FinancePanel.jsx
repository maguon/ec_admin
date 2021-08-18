import React, {useEffect} from 'react';
import {connect} from 'react-redux';
// 引入material-ui基础组件
import {Card, CardContent, Divider, Grid, makeStyles, Typography} from "@material-ui/core";

const financePanelAction = require('../../actions/main/FinancePanelAction');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    card:{
        border:'1px solid #E4E4E4',
        width: '100%',
        height: 108
    }
}));

function FinancePanel(props) {
    const {financePanelReducer} = props;
    const classes = useStyles();

    useEffect(() => {
        props.initData();
    }, []);

    return (
        <div className={classes.root}>
            <Typography gutterBottom className={classes.title}>财务主控</Typography>
            <Divider light className={classes.divider}/>

            <Grid container spacing={2}>
                <Grid item container xs={6}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>未完成的采购付款</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">未完成数：{financePanelReducer.purchaseStat.count}</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary" align="right">金额：{financePanelReducer.purchaseStat.product_cost}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item container xs={6}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>未完成的采购退款</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">未完成数：{financePanelReducer.purchaseRefundStat.count}</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary" align="right">金额：{financePanelReducer.purchaseRefundStat.total_cost}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>


                <Grid item container xs={6}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>未付款的订单</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">未完成数：{financePanelReducer.orderStat.order_count}</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary" align="right">金额：{financePanelReducer.orderStat.total_actual_price}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item container xs={6}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>未付款的退单</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">未完成数：{financePanelReducer.orderRefundStat.order_refund_count}</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary" align="right">金额：{financePanelReducer.orderRefundStat.total_refund_price}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

            </Grid>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        financePanelReducer: state.FinancePanelReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    initData: () => {
        dispatch(financePanelAction.getPurchaseStat());
        dispatch(financePanelAction.getPurchaseRefundStat());
        dispatch(financePanelAction.getOrderStat());
        dispatch(financePanelAction.getOrderRefundStat());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(FinancePanel)
