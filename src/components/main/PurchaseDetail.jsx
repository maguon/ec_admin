import React, {useEffect}from 'react';
import {connect,useDispatch} from 'react-redux';
import {SupplierDetailActionType} from '../../types';
import {
    Button,
    Divider,
    Grid,
    Typography,
    TextField,
    IconButton,
    AppBar,
    Tab,
    Tabs, TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell,
} from "@material-ui/core";
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import {makeStyles, withStyles} from "@material-ui/core/styles";
import {Link, useParams} from "react-router-dom";
const commonUtil = require('../../utils/CommonUtil');
const sysConst = require('../../utils/SysConst');
const useStyles = makeStyles((theme) => ({
    // 标题样式
    root: {
        width: `calc(100% - 50px)`,
        paddingLeft: 30
    },
    // 标题样式
    pageTitle: {
        color: '#3C3CC4',
        fontSize: 20,
        fontWeight: 'bold'
    },
    pageDivider: {
        height: 1,
        marginBottom: 15,
        background: '#7179e6'
    },
    selectLabel: {
        fontSize: 10,
        color: 'grey'
    },

    select: {
        width: '100%',
    },
    selectCondition: {
        width: '100%',
    },
    button:{
        margin:'15px',
        float:'right'
    },
    divider:{
        margin:'20px 0'
    },
    updateButton:{
        marginTop:'20px',
        float:'right'
    }
}));
const StyledTableCell = withStyles((theme) => ({
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'

    }
}))(TableCell);
//采购---详情
function PurchaseDetail (props){
    const classes = useStyles();
    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>
                <Link to={{pathname: '/purchase', state: {fromDetail: true}}}>
                    <IconButton color="primary" edge="start">
                        <i className="mdi mdi-arrow-left-bold"></i>
                    </IconButton>
                </Link>
                采购 -{/* {supplierDetailReducer.supplierInfo.supplier_name}({supplierDetailReducer.supplierInfo.id})*/}
            </Typography>
            <div className={classes.pageDivider}></div>

        </div>
    )

}

const mapStateToProps = (state, ownProps) => {
    return {
        purchaseDetailReducer: state.PurchaseDetailReducer
    }
};

const mapDispatchToProps = (dispatch,ownProps) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseDetail)