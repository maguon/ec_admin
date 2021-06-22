import React, {useState} from 'react';
import {connect} from 'react-redux';
import {Link as RouterLink} from "react-router-dom";
import {Box, Button, Container, Grid, Link, TextField, Typography} from '@material-ui/core';
import {webName} from "../../config";

const loginAction = require('../../actions/login/LoginAction');

const Login = (props) => {
    const {login} = props;
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
            <Container maxWidth="sm" style={{paddingTop: 80}}>
                <Typography color="textPrimary" variant="h2" align="center"><img style={{paddingTop: 6}} src="/logo120.png" alt=""/></Typography>
                <Typography color="textPrimary" variant="h2" align="center">{webName}</Typography>
                <TextField fullWidth
                           label="用户名"
                           margin="normal"
                           name="userName"
                           variant="outlined"
                           onChange={(e) => {
                               setSubmitFlag(false);
                               setUserName(e.target.value)
                           }}
                           error={userName == "" && submitFlag}
                           helperText={userName == "" && submitFlag  ? "用户名不能为空" : ""}
                           value={userName}
                />
                <TextField fullWidth
                           label="密码"
                           margin="normal"
                           name="password"
                           type="password"
                           variant="outlined"
                           onChange={(e) => {
                               setSubmitFlag(false);
                               setPassword(e.target.value)
                           }}
                           error={password == "" && submitFlag}
                           helperText={password == "" && submitFlag  ? "密码不能为空" : ""}
                           value={password}
                />
                <Box sx={{py: 2}}>
                    <Button color="primary" fullWidth size="large" type="button" onClick={() => {
                        setSubmitFlag(true);
                        login(userName, password)
                    }} variant="contained" endIcon={<i className="mdi mdi-login"/>}>
                        登陆
                    </Button>
                </Box>

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

const mapStateToProps = () => {
    return {}
};

const mapDispatchToProps = (dispatch) => ({
    login: (userName, password) => {
        if (userName.length > 0 && password.length > 0) {
            dispatch(loginAction.login({userName, password}));
        }
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);