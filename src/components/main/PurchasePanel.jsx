import React, {useEffect} from 'react';
import {connect} from 'react-redux';
// 引入material-ui基础组件
import {Card, CardContent, Divider, Grid, makeStyles, Typography} from "@material-ui/core";
const PurchasePanelAction = require('../../actions/main/PurchasePanelAction');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    card:{
        border:'1px solid #E4E4E4',
        width: '100%',
        height: 128
    }
}));

function StoragePanel(props) {
    const {PurchasePanelReducer} = props;
    const classes = useStyles();

    useEffect(() => {
        props.initData();
    }, []);

    return (
        <div className={classes.root}>
            <Typography gutterBottom className={classes.title}>采购主控</Typography>
            <Divider light className={classes.divider}/>

            <Grid container spacing={2}>
                <Grid item container xs={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>未完成的采购</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">运费：{PurchasePanelReducer.purchaseItemStat.transfer_cost}</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary" align="right">商品金额：{PurchasePanelReducer.purchaseItemStat.product_cost}</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">总价：{PurchasePanelReducer.purchaseItemStat.total_cost}</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary" align="right">数量：{PurchasePanelReducer.purchaseItemStat.count}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item container xs={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>未完成的退货</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">未出库数：{PurchasePanelReducer.purchaseRefundStat.count}</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary" align="right">退货数：{PurchasePanelReducer.purchaseRefundStat.refund_count}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

               {/* <Grid item container xs={4}>
                    <Card className={classes.card}>

                    </Card>
                </Grid>*/}
            </Grid>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        PurchasePanelReducer: state.PurchasePanelReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    initData: () => {
        dispatch(PurchasePanelAction.getPurchaseItemStat());
        dispatch(PurchasePanelAction.getPurchaseRefundStat());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StoragePanel)
