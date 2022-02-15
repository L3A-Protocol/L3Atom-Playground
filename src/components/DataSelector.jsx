import React, {useState} from 'react'
import Select from 'react-select'
import { Typography } from '@mui/material'

const exchangeOptions = [
  { value: 'coinbase', label: 'Coinbase' },
  { value: 'binance', label: 'Binance' },
  { value: 'bitfinex', label: 'Bitfinex' },
  { value: 'okex', label: 'OKEx' },
  { value: 'huobi', label: 'Huobi' },
  { value: 'kraken', label: 'Kraken'},
  { value: 'phemex', label: 'Phemex' },
  { value: 'bybit', label: 'Bybit' },
  { value: 'ftx', label: 'FTX' },
  { value: 'deribit', label: 'Deribit' },
  { value: 'kucoin', label: 'Kucoin' }
]

const symbolSpotOptions = [
  { value: 'BTCUSD', label: 'BTC/USD' },
  { value: 'BTCUSDT', label: 'BTC/USDT' },
]

const symbolFuturesOptions = [
  { value: 'BTCUSD-PERPETUAL', label: 'BTC/USD PERPETUAL' },
]

const totalSymbolOptions = [
  {
    label: "Spots",
    options: symbolSpotOptions
  },
  {
    label: "Futures",
    options: symbolFuturesOptions
  }
]

export default function DataSelector(props) {

  return (
    <div className='select-container'>
      <Typography variant="h6" className="title">
        Select Symbol
      </Typography>
      <Select options={totalSymbolOptions} onChange={props.handleSymbolChange} />
    </div>
  )
}
