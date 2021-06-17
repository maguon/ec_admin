import React from 'react';
import { Link as RouterLink} from "react-router-dom";
import {Box,Button,Container,Grid,Link,TextField,Typography} from '@material-ui/core';
import {connect} from 'react-redux';
import {webName} from "../../config"
/**
 * UI组件：注册用户。
 */
class Register extends React.Component {

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
                    注册
                  </Typography>
                  <Typography color="textSecondary" gutterBottom variant="body2" >
                    欢迎注册{webName}
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
                    <TextField fullWidth
                        label="密码"
                        margin="normal"
                        name="password"
                        type="password"
                        variant="outlined"
                    />
                    <Box sx={{ py: 2 }}>
                        <Button color="primary" fullWidth size="large" type="submit" variant="contained"
                        endIcon={<i className="mdi mdi-check-decagram-outline" />}>
                            注册
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

export default connect(mapStateToProps, mapDispatchToProps)(Register)