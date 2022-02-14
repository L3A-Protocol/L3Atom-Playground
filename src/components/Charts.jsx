import React, {useEffect, useState, useMemo} from 'react';

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
  
  const pieOptions = {
    responsive: true,
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

export default function Charts(props) {

  const pieData = useMemo(() => {
    return{
      labels: ["Inserts", "Deletes",  "Updates"],
      datasets: [
        {
          data: props.lobEventCount,
          label: '# of events',
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(75,192,192)'
          ]
        }
      ]
    }
  }, [props.lobEventCount]);

  return (
    <div className="charts-container"> 
        <div className="line-chart-container">
            <Tabs>
                <TabList>
                    {props.symbolChoices.map(choice => <Tab>{choice.label}</Tab>)}
                </TabList>
                {props.lineData.map(data => <TabPanel><Line data={data} options={lineOptions} /></TabPanel>)}
            </Tabs>
        </div>
        <div className="LOB-ratio-container">
            <Pie key={props.lobEventCount} options={pieOptions} data={pieData}/>
        </div>
        <div className="market-order-container">
            <MarketOrderTable rows={props.marketOrders} />
        </div>
        
    </div>
  );
}
