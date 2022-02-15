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
                        <TableRow key={row.trade_id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
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
