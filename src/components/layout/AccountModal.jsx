import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Button, FormControl, InputLabel, OutlinedInput, Grid} from '@material-ui/core';
import {SimpleModal} from '../'
import {AppActionType} from '../../types';

const AccountModal = (props) => {
    const {openFlag, closeAccountModal} = props;

    const [password, setPasssword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [renewPassword, setRenewPassword] = useState("");

    const handleModelConfirm = () => {
        console.log('handleModelConfirm');
        // setAccountModalOpenFlag(false);
    };

    return (
        <SimpleModal
            title="修改密码"
            open={openFlag}
            onClose={closeAccountModal}
            showFooter={true}
            footer={
                <>
                    <Button variant="contained" onClick={handleModelConfirm} color="primary">
                        确定
                    </Button>
                    <Button onClick={closeAccountModal} color="primary" autoFocus>
                        取消
                    </Button>
                </>
            }>

            <Grid container direction="column" justify="center" alignItems="center">
                <FormControl fullWidth variant="outlined" style={{paddingBottom: 20}}>
                    <InputLabel htmlFor="old_password_input">原密码</InputLabel>
                    <OutlinedInput
                        id="old_password_input"
                        type={'password'}
                        value={password}
                        onChange={(e) => setPasssword(e.target.value)}
                        labelWidth={50}
                    />
                </FormControl>
                <FormControl fullWidth variant="outlined" style={{paddingBottom: 20}}>
                    <InputLabel htmlFor="new_password_input">新密码</InputLabel>
                    <OutlinedInput
                        id="new_password_input"
                        type={'password'}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        labelWidth={50}
                    />
                </FormControl>
                <FormControl fullWidth variant="outlined" style={{paddingBottom: 20}}>
                    <InputLabel htmlFor="renew_password_input">确认新密码</InputLabel>
                    <OutlinedInput
                        id="renew_password_input"
                        type={'password'}
                        value={renewPassword}
                        onChange={(e) => setRenewPassword(e.target.value)}
                        labelWidth={80}
                    />
                </FormControl>
            </Grid>
        </SimpleModal>
    )
};


const mapStateToProps = () => {
    return {}
};

const mapDispatchToProps = (dispatch) => ({
    setShowLoadProgressFlag: (f) => {
        dispatch(AppActionType.showLoadProgress(f))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountModal)