import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import BigNumber from 'bignumber.js/bignumber';

import arrowDown from '../../assets/img/chart/arrow-down.svg';
import arrowUp from '../../assets/img/chart/arrow-up.svg';

import './YDRTokenChart.scss';

interface TokenChartProps {
  price: any;
}

const YDRTokenChart: React.FC<TokenChartProps> = ({ price }) => {
  const refDataLength = useRef(1);
  const refPrice = useRef(0.000001);
  const [days, setDays] = useState('1');
  const [diff, setDiff] = useState(['up', 0.0]);
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
  const url = `https://api.coingecko.com/api/v3/coins/rubic/market_chart?vs_currency=usd&days=${days}`;
  const daysFromUrl = days;

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

  const toggleHandler = (event: any) => {
    const btnsList = event.target.parentNode.children;
    [...btnsList].forEach((item: any) => {
      item.className = item === event.target ? 'chart-panel-btn active' : 'chart-panel-btn';
    });
    switch (event.target.innerHTML) {
      case '1d':
        setDays('1');
        break;
      case '1m':
        setDays('30');
        break;
      case '3m':
        setDays('90');
        break;
      case 'ALL':
        setDays('max');
        break;
      default:
        break;
    }
  };

  const parseDate = (date: Date) => {
    if (daysFromUrl === '1') {
      return `${date.getHours()}:${date.getMinutes()}`;
    }
    if (daysFromUrl === 'max') {
      return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    }
    return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
  };

  const getChartData = (data: any): any => {
    const datasetsData: { time: string; data: number }[] = [];
    if (data)
      data.forEach((item: number[]) => {
        const date = new Date(item[0]);
        datasetsData.push({
          time: parseDate(date),
          data: item[1],
        });
      });
    return {
      labels: [],
      datasets: [
        {
          data: datasetsData,
          fill: false,
          backgroundColor: 'transparent',
          borderColor: '#df3f3a',
          borderWidth: 3,
          pointBackgroundColor: '#df3f3a',
          pointBorderColor: '#fff',
          tension: 0.5,
        },
      ],
    };
  };

  const [clickedElement, setClickedElement] = useState(
    chartData.datasets[0].data[refDataLength.current - 1].data,
  );

  const getElementAtEvent = (element: string | any[]) => {
    if (!element.length) return;

    const { index } = element[0];
    const chosenPrice = chartData.datasets[0].data[index].data;
    setClickedElement(chosenPrice);

    const value = ((chosenPrice - refPrice.current) / refPrice.current) * 100;
    const dir = value < 0 ? 'down' : 'up';
    setDiff([dir, value]);
  };

  const axiosData = useCallback(() => {
    axios
      .get(url)
      .then((res) => {
        console.log('Request chartData success', res.data);
        refDataLength.current = res.data.prices.length;
        const currentPrice = res.data.prices[refDataLength.current - 1][1];
        setChartData(getChartData(res.data.prices));
        if (refPrice.current <= currentPrice) refPrice.current = currentPrice;
        setClickedElement(refPrice.current);
        price(refPrice.current);
      })
      .catch((err: any) => {
        console.log('Request chartData error', err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);

  useEffect(() => {
    axiosData();
  }, [axiosData]);

  return (
    <div className="chart">
      <div className="chart-panel">
        <div className="chart-panel-title">
          ${new BigNumber(clickedElement).toFixed(6)}
          <div className="diff">
            <div className={`diff-${diff[0]}`}>
              {diff[0] === 'up' && diff[1] !== '0.0' ? <img src={arrowUp} alt="arrow up" /> : null}
              {diff[0] === 'down' ? <img src={arrowDown} alt="arrow down" /> : null}
              {new BigNumber(diff[1]).toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="chart-panel-btns">
          <div
            className="chart-panel-btn active"
            role="button"
            tabIndex={0}
            onClick={toggleHandler}
            onKeyDown={toggleHandler}
          >
            1d
          </div>
          <div
            className="chart-panel-btn"
            role="button"
            tabIndex={0}
            onClick={toggleHandler}
            onKeyDown={toggleHandler}
          >
            1m
          </div>
          <div
            className="chart-panel-btn"
            role="button"
            tabIndex={0}
            onClick={toggleHandler}
            onKeyDown={toggleHandler}
          >
            3m
          </div>
          <div
            className="chart-panel-btn"
            role="button"
            tabIndex={0}
            onClick={toggleHandler}
            onKeyDown={toggleHandler}
          >
            ALL
          </div>
        </div>
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

export default YDRTokenChart;
