import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Link as RouterLink} from "react-router-dom";
import {Box, Button, Container, Grid, Link, TextField,Typography} from '@material-ui/core';
import {Field, reduxForm} from 'redux-form';
import {webName} from "../../config";
import {FormTextInput} from "../common/index";

const loginAction = require('../../actions/login/LoginAction');

const validate = values => {
    const errors = {}
    if (!values.userName) {
        errors.userName = '请输入手机号'
    } else if (values.userName.length != 11) {
        errors.userName = '请输入正确的手机号码'
    }
    if (!values.password) {
        errors.password = '请输入密码'
    } else if (values.password.length <6) {
        errors.password = '密码至少6位'
    }
    return errors
}

const Login = (props) => {
    const {login,submitting,handleSubmit,initialValues} = props;
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [submitFlag, setSubmitFlag] = useState(false);
    return (
        <Box sx={{
            backgroundColor: 'background.default',
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            justifyContent: 'center',
            alignItems: "center"
        }}>
            <Container maxWidth="md" style={{paddingTop: 80}}>
                <Typography color="textPrimary" variant="h2" align="center"><img style={{paddingTop: 6}} src="/logo120.png" alt=""/></Typography>
                <Typography color="textPrimary" variant="h2" align="center">{webName}</Typography>
                <form onSubmit={handleSubmit(login)}>
                    <Field type="text" label="用户名"  component={FormTextInput}  name="userName" />
                    <Field type="password" label="密码"  component={FormTextInput}   name="password" />
                    <Box sx={{py: 2}}>
                        <Button color="primary" fullWidth size="large" type="submit"
                                disabled={submitting}
                                variant="contained" endIcon={<i className="mdi mdi-login"/>}>
                            登陆
                        </Button>
                    </Box>
                </form>


                <Grid container spacing={3}>
                    <Grid item xs={6}>
                        <Typography color="textSecondary" variant="body1">
                            <Link component={RouterLink} to="/register" variant="h6">注册</Link>
                        </Typography>
                    </Grid>
                    <Grid container item xs={6} direction="row" justify="flex-end">
                        <Typography color="textSecondary" variant="body1">
                            <Link component={RouterLink} to="/reset" variant="h6">忘记密码</Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    )
};

const mapStateToProps = (state) => {
    return {
        initialValues: {userName:state.LoginReducer.userName,password:state.LoginReducer.password}
    }
};

const mapDispatchToProps = (dispatch) => ({
    login: (values) => {
        const {userName,password} = values;
        if (userName.length > 0 && password.length > 0) {
            dispatch(loginAction.login({userName, password}));
        }
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({
            form: 'loginForm',
            validate
        }
    )(Login));