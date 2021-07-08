import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios, { AxiosResponse } from 'axios';

import PriceDifferenceBag from '../../PriceDifferenceBag';

import './IndexChart.scss';

interface IndexChartProps {
  tokens: any;
  indexId: any;
}

const IndexChart: React.FC<IndexChartProps> = ({ tokens, indexId }) => {
  const url = `https://dev-ydragon.rocknblock.io/api/indexes/info/${indexId}`;
  const refAxiosData: React.MutableRefObject<any> = useRef([]);
  const refData: React.MutableRefObject<any> = useRef([]);
  const refMax = useRef(0);
  const refMin = useRef(0);
  const refCurrentPrice = useRef('');
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
  const [diff, setDiff] = useState(['up', 0.0]);

  const options = {
    layout: {
      padding: 10,
    },
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
      yAxis: {
        suggestedMin: refMin.current,
        suggestedMax: refMax.current,
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

  const getElementAtEvent = (element: string | any[]) => {
    if (!element.length) return;

    const { index } = element[0];
    const currentValue = refData.current[index].data;
    const currentTokens = refAxiosData.current[index].tokens_history;
    setClickedElement(currentValue);
    tokens(currentTokens);

    const value =
      ((currentValue - Number(refCurrentPrice.current)) / Number(refCurrentPrice.current)) * 100;
    const dir = value < 0 ? 'down' : 'up';
    setDiff([dir, value]);
  };

  const axiosData = useCallback(() => {
    axios.get(url).then((res: AxiosResponse) => {
      console.log('refData request success', res.data);
      const arr: number[] = [];
      refAxiosData.current = res.data;
      refAxiosData.current.forEach((item: any) => {
        arr.push(Number(item.market_cap));
        const date = new Date(item.time);
        const parsedDate = `${date.getHours()}:${date.getMinutes()}`;
        refData.current.push({
          time: parsedDate,
          data: item.market_cap,
        });
      });
      refMax.current = Math.max(...arr) + 1;
      refMin.current = Math.min(...arr) - 1;
      const dataLength = refData.current.length;
      refCurrentPrice.current = refData.current[dataLength - 1].data;
      setClickedElement(refCurrentPrice.current);
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
        <PriceDifferenceBag price={Number(clickedElement)} diff={diff} />
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
