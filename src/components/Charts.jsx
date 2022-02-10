import React from 'react';

import { Line, Pie } from 'react-chartjs-2';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';

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
  return (
    <div className="charts-container"> 
        <div className="line-chart-container">
            <Tabs>
                {/* <TabList>
                    <Tab>Line Chart</Tab>
                    <Tab>Pie Chart</Tab>
                </TabList>
                <TabPanel>
                </TabPanel>
                <TabPanel>
                    <h2>Test panel 2</h2>
                </TabPanel> */}
                <TabList>
                    {props.symbolChoices.map(choice => <Tab>{choice.label}</Tab>)}
                </TabList>
                {props.lineData.map(data => <TabPanel><Line data={data} options={lineOptions} /></TabPanel>)}
            </Tabs>
        </div>
        <div className="LOB-ratio-container">
            <Pie options={pieOptions} data={props.pieData}/>
        </div>
    </div>
  );
}
