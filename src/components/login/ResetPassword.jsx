import React from 'react';
import { Link as RouterLink} from "react-router-dom";
import {Box,Button,Container,Grid,Link,TextField,Typography} from '@material-ui/core';
import {connect} from 'react-redux';

/**
 * UI组件：重置密码。
 */
class ResetPassword extends React.Component {

    /**
     * 组件准备要挂载的最一开始，调用执行
     * @param props
     */
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    /**
     * 渲染(挂载)画面。
     */
    render() {
        const {handleSubmit} = this.props;
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
                <form onSubmit={handleSubmit}>
                    <TextField fullWidth
                        label="用户名"
                        margin="normal"
                        name="email"
                        type="email"
                        variant="outlined"
                    />
                    
                    <Box sx={{ py: 2 }}>
                        <Button color="secondary" fullWidth size="large" type="submit" variant="contained"
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
                </form>                        
            </Container>
            </Box>
         </> 
        )
    }
}

const mapStateToProps = (state) => {
    return {
        
    }
};

const mapDispatchToProps = (dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(ResetPassword);