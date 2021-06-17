import React from 'react';
import {connect} from 'react-redux';
import {Box,Container,Grid,Typography}from '@material-ui/core';

// 综合页面
class ErrorPanel extends React.Component {

    constructor(props) {
        super(props);
    }
    componentDidMount() {
        
    }

    render() {
        const {} = this.props;
        return (
            <>
                <div>
                    <Grid container direction="row" justify="center" alignItems="center" >
                        <Typography variant="h1" component="h2" gutterBottom>
                            404
                        </Typography>
                    </Grid>
                    
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        mainPanelReducer: state.MainPanelReducer
    }
};

const mapDispatchToProps = (dispatch) => ({
    
});

export default connect(mapStateToProps, mapDispatchToProps)(ErrorPanel)