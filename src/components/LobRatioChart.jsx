import React, { useMemo } from 'react'
import { Pie } from 'react-chartjs-2';

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

export default function LobRatioChart(props) {

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
        <div className="LOB-ratio-container">
            <Pie key={props.lobEventCount} options={pieOptions} data={pieData}/>
        </div>
    )
}
