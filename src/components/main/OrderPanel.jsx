import React, {useEffect} from 'react';
import {connect} from 'react-redux';
// 引入material-ui基础组件
import {Card, CardContent, Divider, Grid, makeStyles, Typography} from "@material-ui/core";
const OrderPanelAction = require('../../actions/main/OrderPanelAction');
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

function OrderPanel(props) {
    const {OrderPanelReducer} = props;
    const classes = useStyles();

    useEffect(() => {
        props.initData();
    }, []);

    return (
        <div className={classes.root}>
            <Typography gutterBottom className={classes.title}>订单主控</Typography>
            <Divider light className={classes.divider}/>

            <Grid container spacing={2}>
                <Grid item container xs={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>未处理的订单</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary" >未处理的订单数：{OrderPanelReducer.orderStat.count}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item container xs={4}>
                    <Card className={classes.card}>
                        <CardContent>
                            <Grid container spacing={1}>
                                <Grid item xs={12}><Typography variant="h5" gutterBottom>处理中的订单</Typography></Grid>
                                <Grid item xs={6}><Typography color="textSecondary">处理中的订单数：{OrderPanelReducer.orderStatIng.count}</Typography></Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

              {/*  <Grid item container xs={4}>
                    <Card className={classes.card}>
                    </Card>
                </Grid>*/}
            </Grid>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        OrderPanelReducer: state.OrderPanelReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    initData: () => {
        dispatch(OrderPanelAction.getOrderStat());
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(OrderPanel)
