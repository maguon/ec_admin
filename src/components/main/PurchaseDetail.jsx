import React, {useEffect, useState} from 'react';
import {connect,useDispatch} from 'react-redux';
import {PurchaseDetailActionType} from '../../types';
import {
    Button,
    Grid,
    Typography,
    TextField,
    IconButton,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import {Link, useParams} from "react-router-dom";
import Swal from "sweetalert2";
const commonUtil = require('../../utils/CommonUtil');
const PurchaseDetailAction = require('../../actions/main/PurchaseDetailAction');
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
    }
}));

//采购---详情
function PurchaseDetail (props){
    const {purchaseDetailReducer,getPurchaseDetailInfo,getPurchaseItemDetailInfo,changeStatus,updatePurchaseDetailInfo,updatePurchaseDetailItemInfo} = props;
    const classes = useStyles();
    const dispatch = useDispatch();
    const {id} = useParams();
    const [transferCostTypeFlag, setTransferCostTypeFlag] = useState(true);
    const [purchaseCountTotal, setPurchaseCountTotal] = useState(0);
    useEffect(()=>{
        getPurchaseDetailInfo(id);
        getPurchaseItemDetailInfo(id);
    },[]);
    useEffect(()=>{
        if(purchaseDetailReducer.purchaseDetailInfo.transfer_cost_type==2){
            setTransferCostTypeFlag(false)
        }else {
            setTransferCostTypeFlag(true)
            purchaseDetailReducer.purchaseDetailInfo.transfer_cost=0;
        }
    },[purchaseDetailReducer.purchaseDetailInfo.transfer_cost_type]);
    useEffect(()=> {
        let num=0;
        for (let i = 0; i < purchaseDetailReducer.purchaseDetailItemInfo.length; i++) {
            num += (purchaseDetailReducer.purchaseDetailItemInfo[i].unit_cost*purchaseDetailReducer.purchaseDetailItemInfo[i].purchase_count)
        }
        setPurchaseCountTotal(num+Number(purchaseDetailReducer.purchaseDetailInfo.transfer_cost));
    },[purchaseDetailReducer.purchaseDetailInfo,purchaseDetailReducer.purchaseDetailItemInfo])

    return(
        <div className={classes.root}>
            {/* 标题部分 */}
            <Typography gutterBottom className={classes.pageTitle}>
                <Link to={{pathname: '/purchase', state: {fromDetail: true}}}>
                    <IconButton color="primary" edge="start">
                        <i className="mdi mdi-arrow-left-bold"></i>
                    </IconButton>
                </Link>
                采购 -{commonUtil.getJsonValue(sysConst.PURCHASE_STATUS,purchaseDetailReducer.purchaseDetailInfo.status)}({purchaseDetailReducer.purchaseDetailInfo.id})
            </Typography>
            <div className={classes.pageDivider}></div>

            {/*供应商选择*/}
            <Grid  container spacing={3}>
                <Grid item xs>
                    <FormControl variant="outlined"   disabled={true} fullWidth={true} margin="dense">
                        <InputLabel id="standard-select-outlined-label" shrink>供应商名称</InputLabel>
                        <TextField fullWidth
                                   disabled={true}
                                   size="small"
                                   name="supplierName"
                                   type="text"
                                   label="供应商名称"
                                   variant="outlined"
                                   value={purchaseDetailReducer.purchaseDetailInfo.supplier_name}

                        />
                    </FormControl>
                </Grid>
                <Grid item xs>
                    <FormControl variant="outlined" fullWidth={true} margin="dense">
                        <InputLabel id="standard-select-outlined-label" shrink>运费类型</InputLabel>
                        <Select
                            label="运费类型"
                            labelId="standard-select-outlined-label"
                            id="standard-select-outlined"
                            value={purchaseDetailReducer.purchaseDetailInfo.transfer_cost_type}
                            onChange={(e)=>{
                                dispatch(PurchaseDetailActionType.setPurchaseDetailInfo({name:"transfer_cost_type",value:e.target.value}))
                            }}
                        >
                            {sysConst.TRANSFER_COST_TYPE.map((item, index) => (
                                <MenuItem key={item.value} value={item.value}>{item.label}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs>
                    <TextField label="运费" disabled={transferCostTypeFlag} fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                               value={purchaseDetailReducer.purchaseDetailInfo.transfer_cost}
                               onChange={(e) => {
                                   dispatch(PurchaseDetailActionType.setPurchaseDetailInfo({name: "transfer_cost",value: e.target.value}))
                               }}
                    />
                </Grid>
                <Grid item xs>
                    <TextField label="总价" fullWidth={true} disabled={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                               value={Number(purchaseCountTotal)}
                    />
                </Grid>
            </Grid>
            {/*商品选择*/}
            {purchaseDetailReducer.purchaseDetailItemInfo.map((item,index)=>(
                <Grid  container spacing={3} key={index}>
                    <Grid item xs>
                        <FormControl variant="outlined"   disabled={true} fullWidth={true} margin="dense">
                            <InputLabel id="standard-select-outlined-label" shrink>商品</InputLabel>
                            <TextField fullWidth
                                       disabled={true}
                                       size="small"
                                       name="supplierName"
                                       type="text"
                                       label="商品"
                                       variant="outlined"
                                       value={item.product_name}

                            />
                        </FormControl>
                    </Grid>
                    <Grid item xs>
                        <TextField label="商品单价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={item.unit_cost}
                                   onChange={(e) => {
                                       dispatch(PurchaseDetailActionType.setPurchaseDetailItemInfo({index,name: "unit_cost",value: e.target.value}))
                                   }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField label="商品数量" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={item.purchase_count}
                                   onChange={(e) => {
                                       dispatch(PurchaseDetailActionType.setPurchaseDetailItemInfo({index,name: "purchase_count",value: e.target.value}))
                                   }}
                        />
                    </Grid>
                    <Grid item xs>
                        <TextField disabled={true} label="商品总价" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={Number(item.unit_cost)*Number(item.purchase_count)}
                        />
                    </Grid>
                    <Grid item xs={4}>
                        <TextField label="备注" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                                   value={item.remark}
                                   onChange={(e) => {
                                       dispatch(PurchaseDetailActionType.setPurchaseDetailItemInfo({index,name: "remark",value: e.target.value}))
                                   }}
                        />
                    </Grid>
                    <Grid item xs  align="center"  style={{display:purchaseDetailReducer.purchaseDetailInfo.status==3?'block':'none',marginTop:'15px'}}>
                        <Button variant="contained" color="primary" onClick={() => {updatePurchaseDetailItemInfo(item.id,index)}}>修改</Button>
                    </Grid>
                    <Grid item xs  align="center" disabled={true} style={{display:(purchaseDetailReducer.purchaseDetailInfo.status==1||purchaseDetailReducer.purchaseDetailInfo.status==7)?'block':'none',marginTop:'15px'}}>
                        <Button  variant="contained" color="grey">修改</Button>
                    </Grid>
                </Grid>
            ))}
            {/*备注*/}
            <Grid  container spacing={3}>
                <Grid item xs>
                    <TextField label="备注" fullWidth={true} margin="dense" variant="outlined" InputLabelProps={{ shrink: true }}
                               value={purchaseDetailReducer.purchaseDetailInfo.remark}
                               onChange={(e) => {
                                   dispatch(PurchaseDetailActionType.setPurchaseDetailInfo({name: "remark",value: e.target.value}))
                               }}
                    />
                </Grid>
            </Grid>
            {/*修改  状态*/}
            <Grid  container spacing={3}>
                <Grid item xs  align="right" style={{display:purchaseDetailReducer.purchaseDetailInfo.status==3?'block':'none'}}>
                    <Button variant="contained" color="primary" onClick={updatePurchaseDetailInfo}>修改</Button>
                </Grid>

                <Grid item xs  align="center"   style={{display:purchaseDetailReducer.purchaseDetailInfo.status==1?'block':'none'}}>
                    <Button variant="contained" color="primary"  onClick={() => {changeStatus(id,3)}}>开始处理</Button>
                </Grid>
                <Grid item xs  align="left"  style={{display:purchaseDetailReducer.purchaseDetailInfo.status==3?'block':'none'}}>
                    <Button variant="contained" color="primary"  onClick={() => {changeStatus(id,7)}}>处理中</Button>
                </Grid>
                <Grid item xs  align="center" disabled={true} style={{display:purchaseDetailReducer.purchaseDetailInfo.status==7?'block':'none'}}>
                    <Button variant="contained" color="grey">已处理</Button>
                </Grid>
            </Grid>
        </div>
    )

}

const mapStateToProps = (state, ownProps) => {
    return {
        purchaseDetailReducer: state.PurchaseDetailReducer
    }
};

const mapDispatchToProps = (dispatch,ownProps) => ({
    getPurchaseDetailInfo:(id)=>{
        dispatch(PurchaseDetailAction.getPurchaseDetailInfo(id))
    },
    getPurchaseItemDetailInfo:(id)=>{
        dispatch(PurchaseDetailAction.getPurchaseItemDetailInfo(id))
    },
    updatePurchaseDetailInfo:()=>{
        dispatch(PurchaseDetailAction.updatePurchaseDetailInfo())
    },
    updatePurchaseDetailItemInfo:(itemId,index)=>{
        dispatch(PurchaseDetailAction.updatePurchaseDetailItemInfo(itemId,index))
    },
    changeStatus: (id, status) => {
        Swal.fire({
            title: status === 3 ? "确定开始处理该条采购？" : "确定完成该采购数据？",
            text: "",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "确定",
            cancelButtonText:"取消"
        }).then(async (value) => {
            if (value.isConfirmed) {
                dispatch(PurchaseDetailAction.updatePurchaseDetailInfoStatus(id,status))
            }
        });
    },

});

export default connect(mapStateToProps, mapDispatchToProps)(PurchaseDetail)