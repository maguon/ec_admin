import React, {useEffect} from 'react';
import {connect} from 'react-redux';
// 引入material-ui基础组件
import {Card, CardContent, Divider, Grid, makeStyles, Typography} from "@material-ui/core";
const purchasePanelAction = require('../../actions/main/PurchasePanelAction');
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

function StoragePanel(props) {
    const {purchasePanelReducer} = props;
    const classes = useStyles();

    useEffect(() => {
        props.initData();
    }, []);

    return (
        <div className={classes.root}>
            <Typography gutterBottom className={classes.title}>采购主控</Typography>
            <Divider light className={classes.divider}/>

            <Grid container spacing={2}>
                <Grid item container xs={6}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>未完成的采购</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary" >未完成数：{purchasePanelReducer.purchaseItemStat.count}</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary" align="right">商品金额：{purchasePanelReducer.purchaseItemStat.product_cost}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item container xs={6}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>未完成的退货</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">未完成数：{purchasePanelReducer.purchaseRefundStat.count}</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary" align="right">退款总价：{purchasePanelReducer.purchaseRefundStat.total_cost}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* <Grid item container xs={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>未出库的订单商品</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">未出库数：{purchasePanelReducer.orderStat.count}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid> */}
            </Grid>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        purchasePanelReducer: state.PurchasePanelReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    initData: () => {
        dispatch(purchasePanelAction.getPurchaseItemStat());
        dispatch(purchasePanelAction.getPurchaseRefundStat());
        // dispatch(purchasePanelAction.getOrderStat());

    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StoragePanel)
