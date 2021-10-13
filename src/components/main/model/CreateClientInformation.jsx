import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Button,Grid,TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {SimpleModal} from "../../index";
import {CreateClientInformationActionType} from '../../../types';
const CreateClientInformationAction =require('../../../actions/main/model/CreateClientInformationAction');
const sysConst = require('../../../utils/SysConst');
function CreateClientInformation(props){
    const {createClientInformationReducer,getClientAgent,getUserArray,getProdMatchBrandList,addClientAgentInformationItem} = props;
    const dispatch = useDispatch();
    const [validation,setValidation] = useState({});
    useEffect(()=>{
        getClientAgent();
        getUserArray();
        getProdMatchBrandList();
    },[])
    //验证()
    const validate = ()=>{
        const validateObj ={};
        if (!createClientInformationReducer.clientAgentId||createClientInformationReducer.clientAgentId==null) {
            validateObj.clientAgentId ='请选择客户集群';
        }
        if (!createClientInformationReducer.clientSerial) {
            validateObj.clientSerial ='请选择车牌号';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    }
    // 关闭模态
    const modalClose = () => {
        dispatch(CreateClientInformationActionType.setInformationFlag(false))
        dispatch(CreateClientInformationActionType.getInformationProdMatchModelArray([]))
    }
    const addClientInfo =()=>{
        const errorCount = validate();
        if(errorCount===0){
            addClientAgentInformationItem();
        }
    }
    return(
        <SimpleModal
            maxWidth="md"
            maxHeight="md"
            title="新增客户信息"
            open={createClientInformationReducer.flag}
            onClose={modalClose}
            showFooter={true}
            footer={
                <>
                    <Button variant="contained" onClick={addClientInfo} color="primary">
                        确定
                    </Button>
                    <Button onClick={modalClose} color="primary" autoFocus>
                        取消
                    </Button>
                </>
            }
        >

            <Grid  container spacing={3}>
                {/*客户集群clientAgentId*/}
                <Grid item xs>
                    <Autocomplete ListboxProps={{ style: { maxHeight: '175px' } }} fullWidth
                                  options={createClientInformationReducer.clientAgentArray}
                                  getOptionLabel={(option) => option.name}
                                  value={createClientInformationReducer.clientAgentId}
                                  onChange={(e,value) => {
                                      dispatch(CreateClientInformationActionType.setInformationClientAgentId(value));
                                  }}
                                  renderInput={(params) => <TextField {...params} label="客户集群" margin="dense" variant="outlined"
                                                                      error={validation.clientAgentId&&validation.clientAgentId!=''}
                                                                      helperText={validation.clientAgentId}
                                  />}
                    />
                </Grid>
                {/*车牌号 clientSerial*/}
                <Grid item xs>
                    <TextField
                        fullWidth={true}
                        margin="dense"
                        variant="outlined"
                        label="车牌号"
                        value={createClientInformationReducer.clientSerial}
                        onChange={(e,value) => {
                            dispatch(CreateClientInformationActionType.setInformationClientSerial(e.target.value));
                        }}
                        error={validation.clientSerial&&validation.clientSerial!=''}
                        helperText={validation.clientSerial}
                    />
                </Grid>
                {/*VIN clientSerialDetail*/}
                <Grid item xs>
                    <TextField
                        fullWidth={true}
                        margin="dense"
                        variant="outlined"
                        label="VIN"
                        value={createClientInformationReducer.clientSerialDetail}
                        onChange={(e,value) => {
                            dispatch(CreateClientInformationActionType.setInformationClientSerialDetail(e.target.value));
                        }}
                    />
                </Grid>
                {/*类型名称 modelId,modelName*/}

                {/*客户来源 sourceType*/}
                <Grid item xs>
                    <TextField style={{marginTop:'7px'}} fullWidth
                               size="small"
                               select
                               label="客户来源"
                               name="sourceType"
                               type="number"
                               value={createClientInformationReducer.sourceType}
                               onChange={(e,value) => {
                                   dispatch(CreateClientInformationActionType.setInformationSourceType(e.target.value));
                               }}
                               SelectProps={{
                                   native: true,
                               }}
                               variant="outlined"
                    >
                        {sysConst.SOURCE_TYPE.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                </Grid>
            </Grid>

            <Grid  container spacing={3}>
                {/*用户 name*/}
                <Grid item xs>
                    <Grid item xs>
                        <TextField
                            fullWidth={true}
                            margin="dense"
                            variant="outlined"
                            label="用户"
                            value={createClientInformationReducer.name}
                            onChange={(e,value) => {
                                dispatch(CreateClientInformationActionType.setInformationName(e.target.value));
                            }}
                        />
                    </Grid>
                </Grid>
                {/*电话 tel*/}
                <Grid item xs>
                    <Grid item xs>
                        <TextField
                            fullWidth={true}
                            margin="dense"
                            variant="outlined"
                            type='number'
                            label="电话"
                            value={createClientInformationReducer.tel}
                            onChange={(e,value) => {
                                dispatch(CreateClientInformationActionType.setInformationTel(e.target.value));
                            }}
                        />
                    </Grid>
                </Grid>
                {/*地址 address*/}
                <Grid item xs>
                    <Grid item xs>
                        <TextField
                            fullWidth={true}
                            margin="dense"
                            variant="outlined"
                            label="地址"
                            value={createClientInformationReducer.address}
                            onChange={(e,value) => {
                                dispatch(CreateClientInformationActionType.setInformationAddress(e.target.value));
                            }}
                        />
                    </Grid>
                </Grid>
                {/*推荐人 referUser*/}
                <Grid item xs>
                    <Autocomplete fullWidth
                                  ListboxProps={{ style: { maxHeight: '175px' } }}
                                  options={createClientInformationReducer.referUserArray}
                                  getOptionLabel={(option) => option.real_name}
                                  value={createClientInformationReducer.referUser}
                                  onChange={(e,value) => {
                                      dispatch(CreateClientInformationActionType.setInformationReferUser(value));
                                  }}
                                  renderInput={(params) => <TextField {...params} label="推荐人" margin="dense" variant="outlined"/>}
                    />
                </Grid>
            </Grid>

            <Grid  container spacing={3}>
                <Grid item xs={3}>
                    <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                  options={createClientInformationReducer.prodMatchBrandArray}
                                  getOptionLabel={(option) => option.brand_name}
                                  value={createClientInformationReducer.brandName}
                                  onChange={(e,value) => {
                                      dispatch(CreateClientInformationActionType.setInformationBrandName(value));
                                      dispatch(CreateClientInformationActionType.setInformationMatchModelName(null));
                                      if (value != null) {
                                          dispatch(CreateClientInformationAction.getProdMatchModelList(value.id));

                                      }else {
                                          dispatch(CreateClientInformationActionType.setInformationMatchModelName(null));
                                          dispatch(CreateClientInformationActionType.getInformationProdMatchModelArray(null));
                                      }
                                  }}
                                  renderInput={(params) => <TextField {...params} label="品牌" margin="dense" variant="outlined"/>}
                    />
                </Grid>
                <Grid item xs={3}>
                    <Autocomplete fullWidth ListboxProps={{style: {maxHeight: '175px'}}}
                                  options={createClientInformationReducer.prodMatchModelArray}
                                  noOptionsText="无选项"
                                  getOptionLabel={(option) => option.match_model_name}
                                  value={createClientInformationReducer.matchModelName}
                                  onChange={(e,value) => {
                                      dispatch(CreateClientInformationActionType.setInformationMatchModelName(value));
                                  }}
                                  renderInput={(params) => <TextField {...params} label="车型" margin="dense" variant="outlined"/>}
                    />
                </Grid>
                {/*备注remark*/}
                <Grid item xs={6}>
                    <TextField
                        fullWidth={true}
                        margin="dense"
                        variant="outlined"
                        label="备注"
                        value={createClientInformationReducer.remark}
                        onChange={(e,value) => {
                            dispatch(CreateClientInformationActionType.setInformationRemark(e.target.value));
                        }}
                    />
                </Grid>
            </Grid>
        </SimpleModal>
    )
}
const mapStateToProps = (state, ownProps) => {
    return {
        createClientInformationReducer: state.CreateClientInformationReducer,
    }
};
const mapDispatchToProps = (dispatch) => ({
    getClientAgent:()=>{
        dispatch(CreateClientInformationAction.getClientAgent());
    },
    getUserArray:()=>{
        dispatch(CreateClientInformationAction.getUserArray());
    },
    getProdMatchBrandList:()=>{
        dispatch(CreateClientInformationAction.getProdMatchBrandList());
    },
    addClientAgentInformationItem:()=>{
        dispatch(CreateClientInformationAction.addClientAgentInformationItem());
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateClientInformation)