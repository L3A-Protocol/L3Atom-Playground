
import './App.css';
import NavBar from './components/NavBar';
import DataSelector from './components/DataSelector';
import Charts from './components/Charts';
import {useState, useEffect} from 'react';
import { Button, Grid, Typography } from '@mui/material';
import 'react-tabs/style/react-tabs.css';
import ReactJson from 'react-json-view'
import LobRatioChart from './components/LobRatioChart';
import MarketOrderTable from './components/MarketOrderTable';

let l3WebSocket = new WebSocket("ws://194.233.73.249:30205/")

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const defaultLineData = {
  labels,
  defaultFontColor: "rgb(255, 255, 255)",
  datasets: [],
};

function random_rgba() {
  var o = Math.round, r = Math.random, s = 155;
  return 'rgb(' + o(r()*s+100) + ',' + o(r()*s+100) + ',' + o(r()*s+100) + ')';
}

const blank_lob_data = {
  "quote_no":0,
  "event_no":0,
  "order_id":0,
  "original_order_id":0,
  "side": 0,
  "price":0,
  "size":0,
  "lob_action":0,
  "event_timestamp":0,
  "send_timestamp":0,
  "receive_timestamp":0,
  "order_type":0,
  "is_implied":0,
  "order_executed":0,
  "execution_price":0,
  "executed_size":0,
  "aggressor_side":0,
  "matching_order_id":0,
  "old_order_id":0,
  "trade_id":0,
  "size_ahead":0,
  "orders_ahead":0
  
}

export default function App() {

  const [lobEventCount, setLobEventCount] = useState([0,0,0]);
  const [exchangeChoices, setExchangeChoices] = useState([])
  const [symbolChoices, setSymbolChoices] = useState([])
  const [lineData, setLineData] = useState([defaultLineData])
  const [marketOrders, setMarketOrders] = useState([])
  const [message, setMessage] = useState({});
  const [subscribed, setSubscribed] = useState(false);
  const [bestAsk, setBestAsk] = useState(null);
  const [bestBid, setBestBid] = useState(null);

  const handleExchangeChange = (newSelectedOptions) => {
    setExchangeChoices(newSelectedOptions)
  }
  const handleSymbolChange = (newSelectedOptions) => {
    setSymbolChoices(newSelectedOptions)
  }

  useEffect(() => {
    l3WebSocket.onopen = () => {
      console.log("Connected to L3 WebSocket")
    }

    l3WebSocket.onmessage = async (message) => {
      const data = JSON.parse(await message.data.text())
      setMessage(data)
      //console.log(pieData)
    }
  }, [])

  useEffect(() => {
    if (subscribed == false) {
      l3WebSocket.onmessage = () => null
    } else {
      l3WebSocket.onmessage = async (message) => {
        const data = JSON.parse(await message.data.text())
        setMessage(data)
      }
    }
  }, [subscribed])

  useEffect(() => {
    if (!subscribed) {
      return null
    }
    if (message.trade_id != -1) {
      const trade = {
        order_id: message.order_id,
        trade_id: message.trade_id,
        price: message.price,
        size: message.size,
        side: message.side,
        timestamp: message.timestamp
      }
      setMarketOrders(marketOrders.length >= 10 ? marketOrders.slice(marketOrders.length - 10).concat(trade) : marketOrders.concat(trade))
    }
    else {
      let originalLobEventCount = [...lobEventCount]
      if (message.lob_action == 1) {
        return null;
      }
      let lobEventIndex = message.lob_action - 2
      originalLobEventCount[lobEventIndex] += 1
      setLobEventCount(originalLobEventCount)
      if (message.side == 1) {
        if ((message.lob_action == 2 || message.lob_action == 4) && (!bestBid || message.price > bestBid.price)) {
          setBestBid({
            price: message.price,
            size: message.size,
            order_id: message.order_id,
          })
        } else if (message.lob_action == 3) {
          if (message.order_id == -1 && bestBid.price == message.price || message.order_id == bestBid.order_id) {
            setBestBid(null)
            console.log("Cleared best bid")
          }
        }
      } else if (message.side == 2) {
        if ((message.lob_action == 2 || message.lob_action == 4) && (!bestAsk || message.price < bestAsk.price)) {
          setBestAsk({
            price: message.price,
            size: message.size,
            order_id: message.order_id,
          })
        } else if (message.lob_action == 3) {
          if (message.order_id == -1 && bestAsk.price == message.price || message.order_id == bestAsk.order_id) {
            setBestAsk(null)
          }
        }
      }
    }
  }, [message])

  const unsubscribe = () => {
    const subscribeMessage = {
      'op': 'unsubscribe',
      "topic": "BTCUSD"
    }
    l3WebSocket.send(JSON.stringify(subscribeMessage))
    setSubscribed(false)
  }

  const subscribe = () => {
    let newTotalData = []
    let newLineData = {}
    let subscribeMessage = {
      "op": "subscribe",
      "topic": "BTCUSD"
    }
    setSubscribed(true)
    l3WebSocket.send(JSON.stringify(subscribeMessage))
    console.log(subscribeMessage)
    // console.log(symbolChoices[0].value)
    const colours = exchangeChoices.map(choice => random_rgba())
    for (let symbol of symbolChoices) {
      console.log(symbol.value)
      newLineData = Object.assign({}, defaultLineData)
      newLineData.datasets = exchangeChoices.map((option, index) => {
        let res = {
          symbol: symbol.value,
          label: option.label,
          backgroundColor: colours[index],
          data: []
        }
        res.borderColor = res.backgroundColor
        for (let i = 0; i < 7; i++) {
          res.data.push(Math.floor(Math.random() * 100))
        }
        return res
      })
      newTotalData.push(newLineData)
    }
    setLineData(newTotalData)
    console.log(newTotalData)
}

  return (
    <div className="App">
      <Grid container spacing={4} className="data-container">
        <NavBar />
        <Grid item xs={3.5} className='select-container'>
          <DataSelector handleExchangeChange={handleExchangeChange} handleSymbolChange={handleSymbolChange} />
          {/* {console.log(exchangeChoices)} */}
          <Button color="error" variant="contained" onClick={subscribe}>Subscribe</Button>
          <Button color="error" variant="contained" onClick={unsubscribe}>Unsubscribe</Button>
          <Typography style={{marginTop:"10%"}} variant="h6" className="title">
            Metrics (Aggregated)
          </Typography>
          <Typography variant="h5" className="metric">
            Best Ask Price: {bestAsk ? bestAsk.price : "None"}
          </Typography>
          <Typography variant="h5" className="metric">
            Best Bid Price: {bestBid ? bestBid.price : "None"}
          </Typography>
          <Typography variant="h5" className="metric">
            Mid Price: {(bestAsk && bestBid) ? Number(((bestAsk.price + bestBid.price) / 2).toFixed(5)) : "None"}
          </Typography>
          <Typography variant="h5" className="metric">
            Order Book Imbalance: {(bestAsk && bestBid) ? Number(((bestBid.size / (bestBid.size + bestAsk.size)).toFixed(5))) : "None"}
          </Typography>
        </Grid>
        <Grid item xs={5} className='output-container'>
          <ReactJson src={subscribed ? (Object.keys(message).length == 22 ? message : blank_lob_data) : blank_lob_data} theme="chalk" style={{padding: "2%", fontSize: "22px"}} />
        </Grid>
        <Grid item xs={3.5}>
          <Charts lineData={lineData} marketOrders={marketOrders} lobEventCount={subscribed ? [0,0,0] : lobEventCount} symbolChoices={symbolChoices} />
          <LobRatioChart lobEventCount={subscribed ? [0,0,0] : lobEventCount}/>
        </Grid>
        <Grid item xs={8}>
           <MarketOrderTable rows={marketOrders} />
        </Grid>
        <Grid item xs={4}>
        </Grid>
      </Grid>
    </div>
  )
}
