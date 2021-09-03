import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
// 引入material-ui基础组件
import {
    Accordion,
    AccordionSummary, Box, Button,
    Card,
    CardContent,
    Divider,
    Grid, IconButton,
    makeStyles, Paper, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow,
    Typography
} from "@material-ui/core";
import {Link} from "react-router-dom";
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
    },
    accordion:{
        width:'100%',
        padding:0,
        margin:0,
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
    },
    accordionSummary:{
        width:'100%',
        padding:0,
        margin:0,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
}));

function StoragePanel(props) {
    const {purchasePanelReducer} = props;
    const classes = useStyles();
    const [expanded, setExpanded] = useState(false);
    const dispatch = useDispatch();
    useEffect(() => {
        props.initData();
    }, []);
    const handleChange = (panel) => (event, newExpanded) => {
        setExpanded(newExpanded ? panel : false);
    };
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

                 <Grid item container xs={6}>
                     <Accordion className={classes.accordion} square expanded={expanded === 'panel'} onChange={handleChange('panel')}>
                         <AccordionSummary className={classes.accordionSummary} aria-controls="panel1d-content" id="panel1d-header">
                             <Card className={classes.card}>
                                 <CardContent>
                                     <Grid container spacing={1}>
                                         <Grid item xs={12}><Typography variant="h5" gutterBottom>库存预警商品:{purchasePanelReducer.prodStoreWarning.length}</Typography></Grid>
                                     </Grid>
                                 </CardContent>
                             </Card>
                         </AccordionSummary>
                         <div style={{padding:'30px'}}>
                             <Grid container  spacing={3}>
                                 <TableContainer component={Paper} style={{marginTop: 20}}>
                                     <Table stickyHeader size="small">
                                         <TableBody>
                                             {purchasePanelReducer.prodStoreWarning.map((row) => (
                                                 <TableRow key={row.id}>
                                                     <TableCell align="center">{row.product_name}</TableCell>
                                                     <TableCell align="center">在库:{row.storage_count+row.unit_name}({row.storage_min==null?0:row.storage_min}-{row.storage_max})</TableCell>
                                                 </TableRow>
                                             ))}
                                             {purchasePanelReducer.prodStoreWarning.length === 0 &&
                                             <TableRow>
                                                 <TableCell colSpan={2} align="center">暂无数据</TableCell>
                                             </TableRow>}
                                         </TableBody>
                                     </Table>
                                 </TableContainer>

                                 {/* 上下页按钮 */}
                               {/*  <Box style={{textAlign: 'right', marginTop: 20}}>
                                     {purchasePanelReducer.start > 0 && purchasePanelReducer.dataSize > 0 &&
                                     <Button variant="contained" color="primary" style={{marginRight: 20}}
                                             onClick={()=>{dispatch(purchasePanelAction.getProdStoreWarning(purchasePanelReducer.start-(purchasePanelReducer.size-1)))}}>上一页</Button>}
                                     {purchasePanelReducer.dataSize >= purchasePanelReducer.size &&
                                     <Button variant="contained" color="primary"
                                             onClick={()=>{dispatch(purchasePanelAction.getProdStoreWarning(purchasePanelReducer.start+(purchasePanelReducer.size-1)))}}>下一页</Button>}
                                 </Box>*/}

                             </Grid>
                         </div>
                     </Accordion>
                </Grid>
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
        dispatch(purchasePanelAction.getProdStoreWarning(0));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(StoragePanel)
