import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import {Link} from "react-router-dom";
import {Icon} from "@material-ui/core";

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        maxHeight: 440,
        fontColor: 'red'
    },
});

export default function DataTable(props) {
    const classes = useStyles();
    // const [columns, setColumns] = React.useState([]);
    // const [rows, setRows] = React.useState([]);
    let {detail, columns, rows} = props;
    console.log('rows', rows);

    const customTable = (
        <Paper className={classes.root}>
            <TableContainer className={classes.container}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/*{rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => {*/}
                        {rows.map((row) => {

                            console.log('row', row);
                            return (
                                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                    {columns.map((column) => {
                                        const value = row[column.id];
                                        if (column.label === '操作') {
                                            return (
                                                <TableCell align="center">
                                                    <Link to={{pathname: '/' + detail + '/' + value}}>
                                                        <Icon>find_in_page</Icon>
                                                    </Link>
                                                </TableCell>
                                            );
                                        } else {
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number' ? column.format(value) : value}
                                                </TableCell>
                                            );
                                        }
                                    })}
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
            {/*<TablePagination*/}
            {/*    rowsPerPageOptions={[10, 25, 100]}*/}
            {/*    component="div"*/}
            {/*    count={rows.length}*/}
            {/*    rowsPerPage={rowsPerPage}*/}
            {/*    page={page}*/}
            {/*    onChangePage={handleChangePage}*/}
            {/*    onChangeRowsPerPage={handleChangeRowsPerPage}*/}
            {/*/>*/}
        </Paper>
        );

    // const [rows, setRows] = React.useState([]);
    // const rowsRef = React.useRef(rows);
    // rowsRef.current  = props.rows;
    //
    // console.log('rows', rows);
    // console.log('rowsRef', rowsRef);
    // console.log('rowsRef.current', rowsRef.current);
    //
    // React.useEffect(()=>{
    //     console.log("每次更新后对会执行");
    //     setRows(props.rows);
    // });

    // const [page, setPage] = React.useState(0);
    // const [rowsPerPage, setRowsPerPage] = React.useState(10);
    //
    // const handleChangePage = (event, newPage) => {
    //     setPage(newPage);
    // };
    //
    // const handleChangeRowsPerPage = (event) => {
    //     setRowsPerPage(+event.target.value);
    //     setPage(0);
    // };

    return (customTable);
}
