import React, {useEffect} from 'react';
import {connect} from 'react-redux';
// 引入material-ui基础组件
import {Card, CardContent, Divider, Grid, makeStyles, Typography} from "@material-ui/core";

const storagePanelAction = require('../../actions/main/StoragePanelAction');
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
    const {storagePanelReducer} = props;
    const classes = useStyles();

    useEffect(() => {
        props.initData();
    }, []);

    return (
        <div className={classes.root}>
            <Typography gutterBottom className={classes.title}>仓储主控</Typography>
            <Divider light className={classes.divider}/>

            <Grid container spacing={2}>
                <Grid item container xs={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>未入库的采购</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">未入库数：{storagePanelReducer.purchaseItemStat.count}</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary" align="right">采购数量：{storagePanelReducer.purchaseItemStat.purchase_count}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item container xs={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>未出库的退货</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">未出库数：{storagePanelReducer.purchaseRefundStat.count}</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary" align="right">退货数：{storagePanelReducer.purchaseRefundStat.refund_count}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item container xs={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>未完成盘点</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">未完成数：{storagePanelReducer.storageCheckStat.count}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item container xs={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>未出库的订单商品</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">未出库数：{storagePanelReducer.orderStat.count}</Typography></Grid>
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
        storagePanelReducer: state.StoragePanelReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    initData: () => {
        dispatch(storagePanelAction.getPurchaseItemStat());
        dispatch(storagePanelAction.getPurchaseRefundStat());
        dispatch(storagePanelAction.getStorageCheckStat());
        dispatch(storagePanelAction.getOrderStat());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StoragePanel)
