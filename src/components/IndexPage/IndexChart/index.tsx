import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios, { AxiosResponse } from 'axios';
import BigNumber from 'bignumber.js/bignumber';

import './IndexChart.scss';

const options = {
  aspectRatio: 4,
  parsing: {
    xAxisKey: 'time',
    yAxisKey: 'data',
  },
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    xAxis: {
      ticks: {
        maxRotation: 0,
        autoSkip: true,
        padding: 10,
      },
      offset: true,
      grid: {
        display: true,
        offset: true,
        color: '#4A578F',
        lineWidth: 0.5,
      },
    },
  },
  elements: {
    point: {
      radius: 0,
      borderWidth: 0,
      hoverRadius: 10,
      hoverBorderWidth: 5,
      hitRadius: 400,
    },
  },
};

interface IndexChartProps {
  tokens: any;
  indexId: any;
}

const IndexChart: React.FC<IndexChartProps> = ({ tokens, indexId }) => {
  const url = `https://dev-ydragon.rocknblock.io/api/indexes/info/${indexId}`;
  const refAxiosData: React.MutableRefObject<any> = useRef([]);
  const refData: React.MutableRefObject<any> = useRef([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        data: [{ time: '1', data: 0 }],
        fill: false,
        backgroundColor: 'transparent',
        borderColor: '#df3f3a',
        borderWidth: 3,
        pointBackgroundColor: '#df3f3a',
        pointBorderColor: '#fff',
        tension: 0.5,
      },
    ],
  });
  const [clickedElement, setClickedElement] = useState('');

  const getElementAtEvent = (element: string | any[]) => {
    if (!element.length) return;

    const { index } = element[0];
    const currentValue = refData.current[index].data;
    const currentTokens = refAxiosData.current[index].tokens_history;
    setClickedElement(currentValue);
    tokens(currentTokens);
  };

  const axiosData = useCallback(() => {
    axios.get(url).then((res: AxiosResponse) => {
      refAxiosData.current = res.data;
      refAxiosData.current.forEach((item: any) => {
        refData.current.push({ time: item.time, data: item.market_cap });
      });
      const dataLength = refData.current.length;
      setClickedElement(refData.current[dataLength - 1].data);
      setChartData({
        labels: [],
        datasets: [
          {
            data: refData.current,
            fill: false,
            backgroundColor: 'transparent',
            borderColor: '#df3f3a',
            borderWidth: 3,
            pointBackgroundColor: '#df3f3a',
            pointBorderColor: '#fff',
            tension: 0.5,
          },
        ],
      });
    });
  }, [url]);

  useEffect(() => {
    axiosData();
  }, [axiosData]);

  return (
    <div className="chart">
      <div className="chart-panel">
        <div className="chart-panel-title">${new BigNumber(clickedElement).toFixed(6)}</div>
      </div>
      {Object.keys(chartData).length ? (
        <Line
          data={chartData}
          options={options}
          type="line"
          getElementAtEvent={getElementAtEvent}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default IndexChart;
