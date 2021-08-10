import React from 'react';
import {connect} from 'react-redux';
import {Backdrop, CircularProgress} from '@material-ui/core';
import {makeStyles} from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#3f51b5',
    },
  }));
function LoadProgress(props){
    const classes = useStyles();
    const {appReducer} = props;
    return(
        <Backdrop className={classes.backdrop} open={appReducer.showLoadProgressFlag} style={{zIndex: 1365}}>
            <CircularProgress  size={80} thickness={1.6}/>
        </Backdrop>
    )
    
}
const mapStateToProps = (state) => {
    return {
        appReducer: state.AppReducer
    }
};

const mapDispatchToProps = (dispatch) => ({});

export default connect(mapStateToProps, mapDispatchToProps)(LoadProgress)