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
  { value: 'ETHUSD', label: 'ETH/USD' },
  { value: 'LTCUSD', label: 'LTC/USD' },
  { value: 'XRPUSD', label: 'XRP/USD' },
  { value: 'BTCETH', label: 'BTC/ETH' },
  { value: 'BTCLTC', label: 'BTC/LTC' }
]

const symbolFuturesOptions = [
  { value: 'BTCUSD-PERPETUAL', label: 'BTC/USD PERPETUAL' },
  { value: 'ETHUSD-PERPETUAL', label: 'ETH/USD PERPETUAL' },
  { value: 'LTCUSD-PERPETUAL', label: 'LTC/USD PERPETUAL' },
  { value: 'XRPUSD-PERPETUAL', label: 'XRP/USD PERPETUAL' },
  { value: 'BTCETH-PERPETUAL', label: 'BTC/ETH PERPETUAL' },
  { value: 'BTCLTC-PERPETUAL', label: 'BTC/LTC PERPETUAL' }
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
    <div className="select-container">
      <Typography variant="h6" className="title">
        Select Exchange(s)
      </Typography>
      <Select isMulti options={exchangeOptions} onChange={props.handleExchangeChange}/>
      <Typography variant="h6" className="title">
        Select Symbol(s)
      </Typography>
      <Select options={totalSymbolOptions} onChange={props.handleSymbolChange} isMulti />
    </div>
  )
}
