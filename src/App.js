
import './App.css';
import NavBar from './components/NavBar';
import DataSelector from './components/DataSelector';
import Charts from './components/Charts';
import {useState} from 'react';
import { Button } from '@mui/material';
import 'react-tabs/style/react-tabs.css';

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const defaultLineData = {
  labels,
  defaultFontColor: "rgb(255, 255, 255)",
  datasets: [],
};

const pieData = {
  labels: ["Inserts", "Updates", "Deletes"],
  datasets: [
    {
      label: '# of events',
      data: [12, 19, 3],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(75,192,192)'
      ]
    }
  ]
}

function random_rgba() {
  var o = Math.round, r = Math.random, s = 255;
  return 'rgb(' + o(r()*s) + ',' + o(r()*s) + ',' + o(r()*s) + ')';
}

export default function App() {

  const [exchangeChoices, setExchangeChoices] = useState([])
  const [symbolChoices, setSymbolChoices] = useState([])
  const [lineData, setLineData] = useState([defaultLineData])

  const handleExchangeChange = (newSelectedOptions) => {
    setExchangeChoices(newSelectedOptions)
  }
  const handleSymbolChange = (newSelectedOptions) => {
    setSymbolChoices(newSelectedOptions)
  }

  const subscribe = () => {
    let newTotalData = []
    let newLineData = {}
    // console.log(symbolChoices[0].value)
    for (let symbol of symbolChoices) {
      console.log(symbol.value)
      newLineData = Object.assign({}, defaultLineData)
      newLineData.datasets = exchangeChoices.map(option => {
        let res = {
          symbol: symbol.value,
          label: option.label,
          backgroundColor: random_rgba(),
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
      <NavBar />
      <DataSelector handleExchangeChange={handleExchangeChange} handleSymbolChange={handleSymbolChange} />
      {/* {console.log(exchangeChoices)} */}
      <Button color="error" variant="contained" onClick={subscribe}>Subscribe</Button>
      <Charts lineData={lineData} pieData={pieData} symbolChoices={symbolChoices} />
    </div>
  )
}
