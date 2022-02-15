
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

let l3WebSocket = new WebSocket("ws://194.233.73.248:30205/")

const defaultLineData = {
  labels: [],
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
  const [lineData, setLineData] = useState(defaultLineData)
  const [marketOrders, setMarketOrders] = useState([{}, {}, {}, {}, {}, {}, {}, {}, {}, {}])
  const [message, setMessage] = useState({});
  const [subscribed, setSubscribed] = useState(false);
  const [bestAsk, setBestAsk] = useState(null);
  const [bestBid, setBestBid] = useState(null);
  const [midPrices, setMidPrices] = useState([])

  const handleExchangeChange = (newSelectedOptions) => {
    setExchangeChoices(newSelectedOptions)
  }
  const handleSymbolChange = (newSelectedOptions) => {
    setSymbolChoices(newSelectedOptions)
  }

  let updateMidPrices = () => {
    const now = new Date();
    bestBid && bestAsk && setMidPrices([...midPrices, [now, (bestBid.price + bestAsk.price) / 2]])
  }

  useEffect(() => {
    l3WebSocket.onopen = () => {
      console.log("Connected to L3 WebSocket")
    }
    l3WebSocket.onmessage = async (message) => {
      if (!subscribed) {
        return null
      }
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
    if (marketOrders.length > 10) {
      setMarketOrders(marketOrders.slice(0, 10))
    }
  }, [marketOrders])

  useEffect(() => {
    updateMidPrices()
  }, [bestBid, bestAsk])

  useEffect(() => {
    if (!subscribed) {
      return;
    }
    if (message.trade_id != -1) {
      for (const trade of marketOrders) {
        if (trade.trade_id == message.trade_id) {
          return null
        }
      }
      const trade = {
        order_id: message.order_id,
        trade_id: message.trade_id,
        price: message.price,
        size: message.size,
        side: message.side,
        timestamp: message.timestamp
      }
      setMarketOrders(marketOrders.slice(marketOrders.length - 9).concat(trade))
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
        } else if (message.lob_action == 3 && bestBid) {
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
        } else if (message.lob_action == 3 && bestAsk) {
          if (message.order_id == -1 && bestAsk.price == message.price || message.order_id == bestAsk.order_id) {
            setBestAsk(null)
          }
        }
      }
    }
  }, [message])

  const unsubscribe = async () => {
    const subscribeMessage = {
      'op': 'unsubscribe',
      "topic": symbolChoices.value
    }
    await l3WebSocket.close()
    await l3WebSocket.send(JSON.stringify(subscribeMessage))
    setSubscribed(false)

    let newLineData = {}

    const colour = random_rgba()
    newLineData = Object.assign({}, defaultLineData)
    newLineData.datasets = [
      {
        backgroundColor: colour,
        data: [],
        label: symbolChoices.value,
        borderColor: colour
      }
    ]
    for (const midPrice of midPrices) {
      newLineData.labels.push(midPrice[0])
      newLineData.datasets[0].data.push(midPrice[1])
    }
    setLineData(newLineData)
  }

  const subscribe = () => {
    
    setSubscribed(true)
    let subscribeMessage = {
      "op": "subscribe",
      "topic": symbolChoices.value
    }
    l3WebSocket.send(JSON.stringify(subscribeMessage))
    console.log(subscribeMessage)
    // console.log(symbolChoices[0].value)
}

  return (
    <div className="App">
      <Grid container spacing={4} className="data-container">
        <NavBar />
        <Grid item xs={5} md={3.5} className='select-grid-container'>
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
            Mid Price: {(bestAsk && bestBid) ? Number(((bestAsk.price + bestBid.price) / 2).toFixed(5)) : "Unable to Calculate"}
          </Typography>
          <Typography variant="h5" className="metric">
            Order Book Imbalance: {(bestAsk && bestBid) ? Number(((bestBid.size / (bestBid.size + bestAsk.size)).toFixed(5))) : "Unable to Calculate"}
          </Typography>
        </Grid>
        <Grid item xs={6.5} md={4.5} className='output-container'>
          <ReactJson src={subscribed ? (Object.keys(message).length == 22 ? message : blank_lob_data) : blank_lob_data} theme="chalk" style={{padding: "2%", fontSize: "22px"}} />
        </Grid>
        <Grid item xs={6} md={3.75}>
          <Charts lineData={lineData} lobEventCount={subscribed ? [0,0,0] : lobEventCount} symbolChoices={symbolChoices} />
          <LobRatioChart lobEventCount={subscribed ? [0,0,0] : lobEventCount}/>
        </Grid>
        <Grid item xs={12} md={12} className="market-order-container">
           <MarketOrderTable rows={marketOrders} />
        </Grid>
      </Grid>
    </div>
  )
}
