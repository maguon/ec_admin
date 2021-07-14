import React, {useEffect, useState} from 'react';
import {Link as RouterLink} from "react-router-dom";
import {connect, useDispatch} from 'react-redux';
import {Button,Container,FormControl,FormHelperText,Grid,IconButton,InputAdornment,InputLabel,Link,OutlinedInput,TextField,Typography} from '@material-ui/core';

const commonUtil = require('../../utils/CommonUtil');
const appAction = require('../../actions/layout/AppAction');

const ResetPassword = () => {
    const dispatch = useDispatch();
    // 页面数据
    const [resetData, setResetData] = useState({phone:'',code:'',password:''});
    // 校验结果
    const [validation, setValidation] = useState({});
    // 倒计时
    let [second, setSecond] = useState(0);
    // 计数器
    let [timer, setTimer] = useState(0);

    // 使用 useEffect 监听 second 变化
    useEffect(() => {
        if (second > 0) {
            const newTimer = window.setInterval(() => {
                if (second < 1) {
                    // 倒计时结束
                    window.clearInterval(newTimer);
                } else {
                    setSecond(second - 1);
                }
            }, 1000);
            setTimer(newTimer);
        }
    }, [second]);

    // 清除倒计时
    useEffect(() => {
        return () => window.clearInterval(timer);
    }, [timer]);

    useEffect(() => {
        if (resetData.phone.length > 0 && resetData.code.length > 0 && resetData.password.length > 0) {
            setResetData({...resetData, 'btnDisabled': false})
        } else {
            setResetData({...resetData, 'btnDisabled': true})
        }
    }, [resetData.phone, resetData.code, resetData.password]);

    const validateSms = () => {
        const validateObj = {};
        if (!resetData.phone) {
            validateObj.phone = '请输入手机号';
        } else if (!commonUtil.isPhone(resetData.phone)) {
            validateObj.phone = '请输入正确的手机号码';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };

    const sendSms = async () => {
        const errorCount = validateSms();
        if (errorCount === 0) {
            // 发送请求验证码
            let ret = await dispatch(appAction.sendSms(resetData.phone));
            if (ret == true) {
                // 60秒内不能再次发送
                setSecond(60);
            }
        }
    };

    const validate = () => {
        const validateObj = {};
        if (!resetData.phone) {
            validateObj.phone = '请输入手机号';
        } else if (!commonUtil.isPhone(resetData.phone)) {
            validateObj.phone = '请输入正确的手机号码';
        }
        if (!resetData.code) {
            validateObj.code = '请输入验证码';
        }
        if (!resetData.password) {
            validateObj.password = '请输入新密码';
        } else if (resetData.password.length<6 || resetData.password.length > 30) {
            validateObj.password = '密码长度大于等于6，小于等于30';
        }
        setValidation(validateObj);
        return Object.keys(validateObj).length
    };

    const updatePassword = () => {
        const errorCount = validate();
        if (errorCount === 0) {
            dispatch(appAction.updatePassword(resetData));
        }
    };

    return (
        <Container maxWidth="sm" style={{paddingTop: 80}}>
            <Typography color="textPrimary" variant="h2">忘记密码</Typography>
            <Typography color="textSecondary" gutterBottom variant="body2">请输入你注册的手机</Typography>

            <Grid container spacing={2}>
                <Grid item sm={12}>
                    <FormControl fullWidth variant="outlined" margin="dense">
                        <InputLabel>手机号</InputLabel>
                        <OutlinedInput label="手机号"
                                       value={resetData.phone}
                                       onChange={(e) => setResetData({...resetData, 'phone': e.target.value})}
                                       endAdornment={
                                           <InputAdornment position="end">
                                               {second > 0 ? second :
                                                   <IconButton edge="end" onClick={sendSms}>
                                                       <i className="mdi mdi-email"/>
                                                   </IconButton>}
                                           </InputAdornment>
                                       }
                                       error={validation.phone && validation.phone != ''}
                        />
                        {(validation.phone && validation.phone != '') &&
                        <FormHelperText style={{color: 'red'}}>{validation.phone}</FormHelperText>}
                    </FormControl>
                </Grid>

                <Grid item sm={12}>
                    <TextField label="验证码" fullWidth margin="dense" variant="outlined"
                               value={resetData.code}
                               onChange={(e) => setResetData({...resetData, 'code': e.target.value})}
                               error={validation.code && validation.code != ''}
                               helperText={validation.code}
                    />
                </Grid>
                <Grid item sm={12}>
                    <TextField label="新密码" fullWidth margin="dense" variant="outlined" type="password"
                               value={resetData.password}
                               onChange={(e) => setResetData({...resetData, 'password': e.target.value})}
                               error={validation.password && validation.password != ''}
                               helperText={validation.password}
                    />
                </Grid>

                <Grid item sm={12}>
                    <Button fullWidth color="primary" variant="contained" size="small" endIcon={<i className="mdi mdi-account-key"/>}
                             disabled={resetData.btnDisabled} onClick={updatePassword}>
                        修改密码
                    </Button>
                </Grid>

                <Grid item sm={12} style={{textAlign: 'right'}}>
                    <Typography color="textSecondary" variant="body1">
                        <Link component={RouterLink} to="/login" variant="h6">
                            返回登陆
                        </Link>
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    )
};

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch) => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);