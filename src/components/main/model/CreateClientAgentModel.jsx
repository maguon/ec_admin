import React, {useEffect, useState} from 'react';
import {connect, useDispatch} from 'react-redux';
import {Button,Grid,TextField} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {SimpleModal} from "../../index";
import {CreateClientAgentModelActionType} from "../../../types";
const CreateClientAgentModelAction =require('../../../actions/main/model/CreateClientAgentModelAction')
const sysConst = require('../../../utils/SysConst');
function CreateClientModel (props) {
    const {createClientModelReducer,getCurrentUser,addClientAgentItem} = props;
    const dispatch = useDispatch();
    const [validation,setValidation] = useState({});
    useEffect(()=>{
        getCurrentUser()
    },[])
    //验证()
    const validate = ()=>{
        const validateObj ={};
        if (!createClientModelReducer.name) {
            validateObj.name ='请输入客户名称';
        }
        if (createClientModelReducer.salesUserId==null) {
            validateObj.salesUserId ='请输入联系人';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    }
    // 关闭模态
    const modalClose = () => {
        dispatch(CreateClientAgentModelActionType.setFlag(false))
    };

    const addClientAgentArray =()=>{
        const errorCount = validate();
        if(errorCount===0){
            addClientAgentItem();
        }
    }
    return(
        <SimpleModal
            title= "添加客户集群信息"
            open={createClientModelReducer.flag}
            onClose={modalClose}
            showFooter={true}
            footer={
                <>
                    <Button variant="contained" onClick={() => {addClientAgentArray()}}  color="primary">
                        确定
                    </Button>
                    <Button onClick={modalClose} color="primary" autoFocus>
                        关闭
                    </Button>
                </>
            }
        >
            <Grid  container spacing={3}>
                <Grid item xs>
                    <TextField fullWidth
                               size="small"
                               name="serviceName"
                               type="text"
                               label="客户名称"
                               variant="outlined"
                               onChange={(e)=>{
                                   dispatch(CreateClientAgentModelActionType.setName(e.target.value));
                               }}
                               error={validation.name && validation.name!=''}
                               helperText={validation.name}
                               value={createClientModelReducer.name}

                    />
                </Grid>
                <Grid item xs>
                    <TextField fullWidth
                               size="small"
                               select
                               label="客户类型"
                               name="modifyServiceType"
                               type="number"
                               onChange={(e)=>{
                                   dispatch(CreateClientAgentModelActionType.setClientType(e.target.value));
                               }}
                               value={createClientModelReducer.clientType}
                               SelectProps={{
                                   native: true,
                               }}
                               variant="outlined"
                    >
                        {sysConst.CLIENT_TYPE.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs>
                    <TextField fullWidth
                               size="small"
                               select
                               label="客户来源"
                               name="sourceType"
                               type="number"
                               onChange={(e)=>{
                                   dispatch(CreateClientAgentModelActionType.setSourceType(e.target.value));
                               }}
                               value={createClientModelReducer.sourceType}
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
                <Grid item xs>
                    <TextField type='number' label="电话" fullWidth margin="dense" variant="outlined"
                               value={createClientModelReducer.tel}
                               onChange={(e) => {
                                   dispatch(CreateClientAgentModelActionType.setTel(e.target.value));
                               }}

                    />
                </Grid>
                <Grid item xs>
                    <TextField type='number' label="身份证号" fullWidth margin="dense"  variant="outlined"
                               value={createClientModelReducer.idSerial}
                               onChange={(e) => {
                                   dispatch(CreateClientAgentModelActionType.setIdSerial(e.target.value));
                               }}
                    />
                </Grid>
                <Grid item xs>
                    <TextField label="地址" fullWidth margin="dense" variant="outlined"
                               value={createClientModelReducer.address}
                               onChange={(e) => {
                                   dispatch(CreateClientAgentModelActionType.setAddress(e.target.value));
                               }}
                    />
                </Grid>
            </Grid>
            <Grid  container spacing={3}>
                <Grid item xs>
                    <Autocomplete fullWidth={true} id="salesUserId"
                                  options={createClientModelReducer.currentUserArray}
                                  getOptionLabel={(option) => option.real_name}
                                  value={createClientModelReducer.salesUserId}
                                  onChange={(e,value) => {
                                      dispatch(CreateClientAgentModelActionType.setSalesUserId(value));
                                  }}
                                  renderInput={(params) => <TextField {...params} label="联系人" margin="dense" variant="outlined"
                                                                      error={validation.salesUserId&&validation.salesUserId!=''}
                                                                      helperText={validation.salesUserId}/>}
                    />
                </Grid>
                <Grid item xs>
                    <TextField fullWidth margin="dense" variant="outlined" label="备注" multiline value={createClientModelReducer.remark}
                               onChange={(e) => {
                                   dispatch(CreateClientAgentModelActionType.setRemark(e.target.value));
                               }}/>
                </Grid>
            </Grid>
        </SimpleModal>

    )
}
const mapStateToProps = (state, ownProps) => {
    return {
        createClientModelReducer: state.CreateClientAgentModelReducer,
    }
};
const mapDispatchToProps = (dispatch) => ({
    getCurrentUser: () => {
        dispatch(CreateClientAgentModelAction.getCurrentUser());
    },
    addClientAgentItem:()=>{
        dispatch(CreateClientAgentModelAction.addClientAgentItem())
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(CreateClientModel)