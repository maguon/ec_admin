import React, {useEffect,useState}from 'react';
import {connect, useDispatch} from 'react-redux';
import Swal from "sweetalert2";
import {
    Button, Divider, Grid, Typography, Paper, TextField, TableContainer, Table, TableHead, TableRow,
    TableCell, TableBody, IconButton,Box, Switch, AppBar, Tabs, Tab,Fab
} from "@material-ui/core";
import {withStyles,makeStyles} from "@material-ui/core/styles";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TabContext from "@material-ui/lab/TabContext";
import TabPanel from "@material-ui/lab/TabPanel";
import {SimpleModal} from '../index';
import {ClientAgentActionType} from '../../types';
const ClientAgentAction = require('../../actions/main/ClientAgentAction');
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');
const customTheme = require('../layout/Theme').customTheme;
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        paddingLeft: 30
    },
    button:{
        margin:'15px',
        float:'right'
    },
    pageTitle: customTheme.pageTitle,
    pageDivider: customTheme.pageDivider,
    pdfPage:customTheme.pdfPage,
    pdfTitle:customTheme.pdfTitle,
    tblHeader:customTheme.tblHeader,
    tblLastHeader:customTheme.tblLastHeader,
    tblBody:customTheme.tblBody,
    tblLastBody:customTheme.tblLastBody
}));
const StyledTableCell = withStyles((theme) => ({
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'

    }
}))(TableCell);
function ClientAgent (props) {
    const {} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>服务项目设置</Typography>
            <Divider light className={classes.pageDivider}/>
            {/*查询条件*/}
            <Grid container  spacing={1}>
                <Grid container item xs={10} spacing={1}>
                    {/*客户类型  普通  大客户clientType*/}
                    {/*身份证号  idSerial*/}
                    {/*创建时间dateIdStart*/}
                    {/*客户来源sourceType*/}
                    {/*1可用，0停用 status*/}
                </Grid>
            </Grid>
        </div>
    )
}
const mapStateToProps = (state, ownProps) => {
    return {
        clientAgentReducer: state.ClientAgentReducer,
    }
};
const mapDispatchToProps = (dispatch) => ({
});
export default connect(mapStateToProps, mapDispatchToProps)(ClientAgent)
