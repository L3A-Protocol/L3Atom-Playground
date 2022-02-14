import React from 'react'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

function createData(order_id, price, size, trade_id, timestamp, side) {
    return { order_id, price, size, trade_id, timestamp, side}
}

const rows = [
    createData(6327304598743, 0.436, 39738.7, 75389045, new Date(), "buy"),
    createData(6327304685454, 0.123, 39738.9, 75389046, new Date(), "sell"),
    createData(6327304784619, 1.3, 39733.9, 75389047, new Date(), "sell"),
    createData(6327304898984, 4.121, 39738.7, 75389048, new Date(), "buy"),
    createData(6327304989576, 0.104, 39738.7, 75389049, new Date(), "buy"),
]

export default function MarketOrderTable(props) {
  return (
    <TableContainer component={Paper}>
        <Table aria-label="simple table" className="market-orders-table">
            <TableHead>
                <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Size</TableCell>
                    <TableCell>Trade ID</TableCell>
                    <TableCell>Timestamp</TableCell>
                    <TableCell>Side</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {props.rows.map(row => {
                    return (
                        <TableRow key={row.order_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <TableCell className="market-order-row" component="th" scope="row">
                                {row.order_id}
                            </TableCell>
                            <TableCell className="market-order-row">{row.price}</TableCell>
                            <TableCell className="market-order-row">{row.size}</TableCell>
                            <TableCell className="market-order-row">{row.trade_id}</TableCell>
                            <TableCell className="market-order-row">{row.timestamp}</TableCell>
                            <TableCell className="market-order-row" >{row.side && (row.side == 1 ? 'Buy' : 'Sell')}</TableCell>
                        </TableRow>
                    )
                })}
            </TableBody>
        </Table>
    </TableContainer>
  )
}
