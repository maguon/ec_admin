import React ,{useState}from 'react';
import { Link as RouterLink} from "react-router-dom";
import {Box,Button,Container,Grid,Link,TextField,Typography} from '@material-ui/core';
import {connect} from 'react-redux';


const ResetPassword =(props)=> {


    const {} = props;
    const [userName,setUserName] = useState("");
    const [validation,setValidation] = useState({});
    const validate = ()=>{
        if (!userName) {
            setValidation({userName:'请输入手机号'});
        } else if (userName.length != 11) {
            setValidation({userName:'请输入正确的手机号码'});
        }else{
            setValidation(()=>{let {userName,...res} = validation;return res;})
        }
    }
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
        <Box sx={{ mb: 3 }}>
              <Typography color="textPrimary" variant="h2" >
                忘记密码
              </Typography>
              <Typography color="textSecondary" gutterBottom variant="body2" >
                请输入你注册的邮箱
              </Typography>
            </Box>
            <div >
                <TextField fullWidth
                    label="用户名"
                    margin="normal"
                    name="userName"
                    type="text"
                    variant="outlined"
                    error={Object.keys(validation).length}
                    helperText={validation.userName}
                    value={userName}
                    onChange={(e)=>setUserName(e.target.value)}
                />

                <Box sx={{ py: 2 }}>
                    <Button color="secondary" fullWidth size="large" type="submit" variant="contained"
                            onClick={validate}
                    endIcon={<i className="mdi mdi-email-lock" />}>
                        发送验证码
                    </Button>
                </Box>

                <Grid container direction="row" justify="flex-end" >

                        <Typography color="textSecondary" variant="body1">
                            <Link component={RouterLink} to="/login" variant="h6">
                                返回登陆
                            </Link>
                        </Typography>
                </Grid>
            </div>
        </Container>
        </Box>
     </>
    )
}

const mapStateToProps = (state) => {
    return {
        
    }
};

const mapDispatchToProps = (dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);