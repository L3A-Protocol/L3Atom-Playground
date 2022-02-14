
import './App.css';
import NavBar from './components/NavBar';
import DataSelector from './components/DataSelector';
import Charts from './components/Charts';
import {useState, useEffect} from 'react';
import { Button } from '@mui/material';
import 'react-tabs/style/react-tabs.css';
import ReactJson from 'react-json-view'

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
  "quote_no": 0,
  "event_no": 0,
  "order_id": 0,
  
}

export default function App() {

  const [lobEventCount, setLobEventCount] = useState([0,0,0]);
  const [exchangeChoices, setExchangeChoices] = useState([])
  const [symbolChoices, setSymbolChoices] = useState([])
  const [lineData, setLineData] = useState([defaultLineData])
  const [marketOrders, setMarketOrders] = useState([])
  const [message, setMessage] = useState({});
  const [subscribed, setSubscribed] = useState(false);

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
      setMarketOrders(marketOrders.length >= 10 ? marketOrders.slice(1).concat(trade) : marketOrders.concat(trade))
    }
    else {
      let originalLobEventCount = [...lobEventCount]
      let lobEventIndex = message.lob_action - 2
      originalLobEventCount[lobEventIndex] += 1
      setLobEventCount(originalLobEventCount)
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
      <div className="data-container">
        <NavBar />
        <div className='select-container'>
          <DataSelector handleExchangeChange={handleExchangeChange} handleSymbolChange={handleSymbolChange} />
          {/* {console.log(exchangeChoices)} */}
          <Button color="error" variant="contained" onClick={subscribe}>Subscribe</Button>
          <Button color="error" variant="contained" onClick={unsubscribe}>Unsubscribe</Button>
        </div>
        <div className='output-container'>
          <ReactJson src={subscribed ? message : {}} theme="chalk" style={{padding: "2%", fontSize: "22px"}} />
        </div>
        <Charts lineData={lineData} marketOrders={marketOrders} lobEventCount={subscribed ? [0,0,0] : lobEventCount} symbolChoices={symbolChoices} />
      </div>
    </div>
  )
}
