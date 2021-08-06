import React, {useEffect} from 'react';
import {connect, useDispatch} from 'react-redux';
// 引入material-ui基础组件
import {Box, Button, Divider, Fab, FormControl, Grid, InputLabel, makeStyles, MenuItem, Paper,
    Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography,Checkbox
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {DatePicker} from '@material-ui/pickers';
import {OrderPayActionType} from "../../types";
const orderPayAction = require('../../actions/main/OrderPayAction');
const commonAction = require('../../actions/layout/CommonAction');
const sysConst = require('../../utils/SysConst');
const commonUtil = require('../../utils/CommonUtil');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    root: customTheme.root,
    title: customTheme.pageTitle,
    divider: customTheme.pageDivider,
    tableHead:customTheme.tableHead,
}));

function CollectionRefundDetail(props) {
    const {collectionRefundDetailReducer, commonReducer} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    return (
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.title}>收款退款</Typography>
            <Divider light className={classes.divider}/>
        </div>
    )
}

const mapStateToProps = (state, ownProps) => {
    return {
        collectionRefundDetailReducer: state.CollectionRefundDetailReducer,
    }
};
const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(CollectionRefundDetail)
