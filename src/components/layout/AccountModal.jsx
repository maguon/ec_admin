import React, {useEffect, useState} from 'react';
import {connect} from 'react-redux';
import {Button, Grid, TextField} from '@material-ui/core';
import {SimpleModal} from '../'

const appAction = require('../../actions/layout/AppAction');

const AccountModal = (props) => {
    const {openFlag, closeAccountModal, changePassword} = props;
    // 模态数据
    const [modalData, setModalData] = useState({});
    // 模态校验
    const [validation, setValidation] = React.useState({});

    useEffect(() => {
        if (openFlag) {
            // 清check内容
            setValidation({});
            // 初始化模态数据
            setModalData({password: '', newPassword: '', renewPassword: ''});
        }
    }, [openFlag]);

    const validateModal = () => {
        const validateObj = {};
        if (!modalData.password) {
            validateObj.password = '请输入原密码';
        } else if (modalData.password.length<6 || modalData.password.length > 30) {
            validateObj.password = '密码长度大于等于6，小于等于30';
        }
        if (!modalData.newPassword) {
            validateObj.newPassword = '请输入新密码';
        } else if (modalData.newPassword.length<6 || modalData.newPassword.length > 30) {
            validateObj.newPassword = '密码长度大于等于6，小于等于30';
        }
        if (!modalData.renewPassword) {
            validateObj.renewPassword = '请输入确认密码';
        } else if (modalData.renewPassword.length<6 || modalData.renewPassword.length > 30) {
            validateObj.renewPassword = '密码长度大于等于6，小于等于30';
        } else if (modalData.renewPassword != modalData.newPassword) {
            validateObj.renewPassword = '确认密码与新密码不一致，请重新输入';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };

    const submitModal = () => {
        const errorCount = validateModal();
        if (errorCount === 0) {
            changePassword(modalData);
            closeAccountModal();
        }
    };

    return (
        <SimpleModal
            maxWidth={'sm'}
            title="修改密码"
            open={openFlag}
            onClose={closeAccountModal}
            showFooter={true}
            footer={
                <>
                    <Button variant="contained" color="primary" onClick={submitModal}>确定</Button>
                    <Button variant="contained" autoFocus onClick={closeAccountModal}>关闭</Button>
                </>
            }>

            <Grid container direction="column" justify="center" alignItems="center">
                <TextField label="原密码" fullWidth margin="dense" variant="outlined" type="password"
                           style={{paddingBottom: 20}}
                           value={modalData.password}
                           onChange={(e) => {
                               setModalData({...modalData, password: e.target.value});
                           }}
                           error={validation.password && validation.password != ''}
                           helperText={validation.password}
                />
                <TextField label="新密码" fullWidth margin="dense" variant="outlined" type="password"
                           style={{paddingBottom: 20}}
                           value={modalData.newPassword}
                           onChange={(e) => {
                               setModalData({...modalData, newPassword: e.target.value});
                           }}
                           error={validation.newPassword && validation.newPassword != ''}
                           helperText={validation.newPassword}
                />
                <TextField label="确认密码" fullWidth margin="dense" variant="outlined" type="password"
                           style={{paddingBottom: 20}}
                           value={modalData.renewPassword}
                           onChange={(e) => {
                               setModalData({...modalData, renewPassword: e.target.value});
                           }}
                           error={validation.renewPassword && validation.renewPassword != ''}
                           helperText={validation.renewPassword}
                />
            </Grid>
        </SimpleModal>
    )
};


const mapStateToProps = () => {
    return {}
};

const mapDispatchToProps = (dispatch) => ({
    changePassword: (modalData) => {
        dispatch(appAction.changePassword(modalData.password, modalData.newPassword));
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountModal)