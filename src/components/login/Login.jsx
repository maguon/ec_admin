import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm} from 'redux-form';
import { Link as RouterLink} from "react-router-dom";
import {Box,Button,Container,Grid,Link,TextField,Typography} from '@material-ui/core';
import { LoginActionType } from '../../types';
import {webName} from "../../config";
const loginAction = require('../../actions/login/LoginAction');



class Login extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }
    login =()=>{
        this.props.login(this.props.loginReducer)
    }
    render() {
        const {login,loginReducer,changeUsername,changePassword} = this.props;
        return (
        <>
            <Box sx={{
                    backgroundColor: 'background.default',
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems:"center"
            }}>
            <Container maxWidth="sm" style={{paddingTop:80}}>
                <Typography color="textPrimary" variant="h2" >{webName}</Typography>
                <form>
                    <TextField fullWidth
                        label="用户名"
                        margin="normal"
                        name="userName"
                        variant="outlined"
                        onChange={changeUsername}
                        value={loginReducer.userName}
                    />
                    <TextField fullWidth
                        label="密码"
                        margin="normal"
                        name="password"
                        type="password"
                        variant="outlined"
                        onChange={changePassword}
                        value={loginReducer.password}
                    />
                    <Box sx={{ py: 2 }}>
                        <Button color="primary" fullWidth size="large" type="button" onClick={this.login} variant="contained"
                        endIcon={<i className="mdi mdi-login" />}>
                            登陆
                        </Button>
                    </Box>
                    
                    <Grid container spacing={3} >
                        <Grid item xs={6}  >
                            <Typography color="textSecondary" variant="body1">
                                <Link component={RouterLink} to="/register" variant="h6">
                                    注册
                                </Link>
                            </Typography>
                        </Grid>
                        <Grid container item xs={6}  direction="row" justify="flex-end" >
                            <Typography color="textSecondary" variant="body1">
                                <Link component={RouterLink} to="/reset" variant="h6">
                                    忘记密码
                                </Link>
                            </Typography>
                        </Grid>
                    </Grid>
                </form>                        
            </Container>
            </Box>
         </>   
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loginReducer: state.LoginReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    login: (values) => {
        console.log(values);
        dispatch(loginAction.login(values));
    },
    changeUsername:(e)=>{
        dispatch(LoginActionType.setLoginUsername(e.target.value))
    },
    changePassword:(e)=>{
        dispatch(LoginActionType.setLoginPassword(e.target.value))
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(
    reduxForm({
            form: 'loginForm'
        }
    )(Login));