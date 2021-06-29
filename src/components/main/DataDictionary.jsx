import React, {useEffect}from 'react';
import {connect} from 'react-redux';
import {
    Grid,
    AppBar,
    Tab,
    Tabs, TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell,
} from "@material-ui/core";
import TabContext from '@material-ui/lab/TabContext';
import TabPanel from '@material-ui/lab/TabPanel';
import {withStyles} from "@material-ui/core/styles";
const DataDictionaryAction = require('../../actions/main/DataDictionaryAction');
const StyledTableCell = withStyles((theme) => ({
    head: {
        fontWeight:'bold',
        background:'#F7F6F9',
        borderTop: '2px solid #D4D4D4'

    }
}))(TableCell);
//数据字典

function DataDictionary(props){
    const {dataDictionaryReducer,getSupplierList,getCategoryList,getProductList,getBrandList} = props;
    const [value, setValue] = React.useState('1');
    const handleChange = (event, newValue) => {
        setValue(newValue);
        newValue=='2'? getCategoryList(): newValue=='3'? getBrandList(): newValue=='4'?getProductList(): getSupplierList();
    };
    useEffect(()=>{
        getSupplierList();
    },[]);
    return(
        <TabContext value={value}>
            <AppBar position="static" color="default">
                <Tabs value={value}
                      onChange={handleChange}
                      indicatorColor="primary"
                      textColor="primary"
                      variant="fullWidth">
                    <Tab label="供应商"   value="1" />
                    <Tab label="类目" value="2" />
                    <Tab label="品牌"    value="3" />
                    <Tab label="商品"    value="4" />
                </Tabs>
            </AppBar>
            <TabPanel value='1'>
                <Grid container spacing={2}>
                    <TableContainer component={Paper} style={{marginTop:40}}>
                        <Table  size={'small'} aria-label="a dense table">
                            <TableHead>
                                <TableRow style={{height:60}}>
                                    <StyledTableCell align="center">供应商ID</StyledTableCell>
                                    <StyledTableCell align="center">供应商名称</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataDictionaryReducer.supplierArray.length > 0 &&dataDictionaryReducer.supplierArray.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center" >{row.id}</TableCell>
                                        <TableCell align="center" >{row.supplier_name}</TableCell>
                                    </TableRow>))}
                                {dataDictionaryReducer.supplierArray.length === 0 &&
                                <TableRow style={{height:60}}><TableCell align="center" colSpan="2">暂无数据</TableCell></TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </TabPanel>
            <TabPanel value='2'>
                <Grid container spacing={2}>
                    <TableContainer component={Paper} style={{marginTop:40}}>
                        <Table  size={'small'} aria-label="a dense table">
                            <TableHead>
                                <TableRow style={{height:60}}>
                                    <StyledTableCell align="center">类目ID</StyledTableCell>
                                    <StyledTableCell align="center">类目名称</StyledTableCell>
                                    <StyledTableCell align="center">二级类目ID</StyledTableCell>
                                    <StyledTableCell align="center">二级类目名称</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataDictionaryReducer.categoryArray.length > 0 &&dataDictionaryReducer.categoryArray.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center" >{row.category_id}</TableCell>
                                        <TableCell align="center" >{row.category_name}</TableCell>
                                        <TableCell align="center" >{row.id}</TableCell>
                                        <TableCell align="center" >{row.category_sub_name}</TableCell>
                                    </TableRow>))}
                                {dataDictionaryReducer.categoryArray.length === 0 &&
                                <TableRow style={{height:60}}><TableCell align="center" colSpan="4">暂无数据</TableCell></TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </TabPanel>
            <TabPanel value='3'>
                <Grid container spacing={2}>
                    <TableContainer component={Paper} style={{marginTop:40}}>
                        <Table  size={'small'} aria-label="a dense table">
                            <TableHead>
                                <TableRow style={{height:60}}>
                                    <StyledTableCell align="center">品牌ID</StyledTableCell>
                                    <StyledTableCell align="center">品牌名称</StyledTableCell>
                                    <StyledTableCell align="center">型号ID</StyledTableCell>
                                    <StyledTableCell align="center">型号名称</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataDictionaryReducer.brandArray.length > 0 &&dataDictionaryReducer.brandArray.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center" >{row.brand_id}</TableCell>
                                        <TableCell align="center" >{row.brand_name}</TableCell>
                                        <TableCell align="center" >{row.id}</TableCell>
                                        <TableCell align="center" >{row.brand_model_name}</TableCell>
                                    </TableRow>))}
                                {dataDictionaryReducer.brandArray.length === 0 &&
                                <TableRow style={{height:60}}><TableCell align="center" colSpan="4">暂无数据</TableCell></TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </TabPanel>
            <TabPanel value='4'>
                <Grid container spacing={2}>
                    <TableContainer component={Paper} style={{marginTop:40}}>
                        <Table  size={'small'} aria-label="a dense table">
                            <TableHead>
                                <TableRow style={{height:60}}>
                                    <StyledTableCell align="center">类目ID</StyledTableCell>
                                    <StyledTableCell align="center">类目名称</StyledTableCell>
                                    <StyledTableCell align="center">二级类目ID</StyledTableCell>
                                    <StyledTableCell align="center">二级类目名称</StyledTableCell>
                                    <StyledTableCell align="center">品牌ID</StyledTableCell>
                                    <StyledTableCell align="center">品牌名称</StyledTableCell>
                                    <StyledTableCell align="center">型号ID</StyledTableCell>
                                    <StyledTableCell align="center">型号名称</StyledTableCell>
                                    <StyledTableCell align="center">商品ID</StyledTableCell>
                                    <StyledTableCell align="center">商品名称</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {dataDictionaryReducer.productArray.length > 0 &&dataDictionaryReducer.productArray.map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell align="center" >{row.category_id}</TableCell>
                                        <TableCell align="center" >{row.category_name}</TableCell>
                                        <TableCell align="center" >{row.category_sub_id}</TableCell>
                                        <TableCell align="center" >{row.category_sub_name}</TableCell>
                                        <TableCell align="center" >{row.brand_id}</TableCell>
                                        <TableCell align="center" >{row.brand_name}</TableCell>
                                        <TableCell align="center" >{row.brand_model_id}</TableCell>
                                        <TableCell align="center" >{row.brand_model_name}</TableCell>
                                        <TableCell align="center" >{row.id}</TableCell>
                                        <TableCell align="center" >{row.product_name}</TableCell>
                                    </TableRow>))}
                                {dataDictionaryReducer.productArray.length === 0 &&
                                <TableRow style={{height:60}}><TableCell align="center" colSpan="10">暂无数据</TableCell></TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Grid>
            </TabPanel>
        </TabContext>
    )

}


const mapStateToProps = (state, ownProps) => {
    return {
        dataDictionaryReducer: state.DataDictionaryReducer
    }
};

const mapDispatchToProps = (dispatch,ownProps) => ({

    getSupplierList: () => {
        dispatch(DataDictionaryAction.getSupplierList())
    },
    getCategoryList: () => {
        dispatch(DataDictionaryAction.getCategoryList())
    },
    getProductList: () => {
        dispatch(DataDictionaryAction.getProductList())
    },
    getBrandList: () => {
        dispatch(DataDictionaryAction.getBrandList())
    }

});

export default connect(mapStateToProps, mapDispatchToProps)(DataDictionary)
