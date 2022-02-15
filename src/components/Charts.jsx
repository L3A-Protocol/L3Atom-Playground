import React from 'react';

import { Line, Pie } from 'react-chartjs-2';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

import MarketOrderTable from './MarketOrderTable';

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
        text: 'Mid Price',
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

export default function Charts(props) {

  return (
    <div className="charts-container"> 
        <div className="line-chart-container">
            <Line data={props.lineData} options={lineOptions}/>
        </div>
    </div>
  );
}
