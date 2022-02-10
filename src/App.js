import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  registerables,
  ArcElement,
} from 'chart.js';
import { Line, Pie } from 'react-chartjs-2';
import './App.css';
import NavBar from './components/NavBar';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
);

ChartJS.register(
  ArcElement
)

const lineOptions = {
  color: 'rgb(255,255,255)',
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Mid Price(BTC/USDT)',
      color: "white"
    },
  },
  scales: {
    x: {
      ticks: {
        color: "white"
      },
      grid: {
        color: "rgba(255,255,255,0.2)"
      }
    },
    y: {
      ticks: {
        color: "white"
      },
      grid: {
        color: "rgba(255,255,255,0.2)"
      }
    }
  },
};

const pieOptions = {
  color: 'rgb(255,255,255)',
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Number of LOB Events',
      color: "white"
    },
  },

};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

const lineData = {
  labels,
  defaultFontColor: "rgb(255, 255, 255)",
  datasets: [
    {
      label: 'Binance',
      data: [54, 32, 54, 20, 56, 33, 51],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Coinbase',
      data: [37, 41, 96, 54, 32, 57, 39],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
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

export default function App() {
  return (
    <div className="App">
      <NavBar />
      <div className="charts-container"> 
        <div className="line-chart-container">
          <Line className="test-chart" options={lineOptions} data={lineData} />
        </div>
        <div className="LOB-ratio-container">
          <Pie options={pieOptions} data={pieData}/>
        </div>
      </div>
    </div>
  )
}
