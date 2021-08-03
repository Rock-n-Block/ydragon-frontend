import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';

import { coingeckoApi } from '../../services/api';
import PriceDifferenceBag from '../PriceDifferenceBag';

import './YDRTokenChart.scss';

interface TokenChartProps {
  price: (value: number) => void;
}

const YDRTokenChart: React.FC<TokenChartProps> = ({ price }) => {
  const refDataLength = useRef(1);
  const refPrice = useRef(0.000001);
  const [days, setDays] = useState('1');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
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
  const daysFromUrl = days;
  const options = {
    aspectRatio: windowWidth > 768 ? 4 : 2,
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

  const getWindowWidth = () => {
    const { innerWidth: width } = window;
    return width;
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
        if (!datasetsData.find((element: any) => element.time === parseDate(date))) {
          datasetsData.push({
            time: parseDate(date),
            data: item[1],
          });
        }
      });
    refDataLength.current = datasetsData.length;
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
    coingeckoApi
      .getYDRTokensChart(days)
      .then((res) => {
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
  }, [days]);

  useEffect(() => {
    function handleResize() {
      setWindowWidth(getWindowWidth());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    axiosData();
  }, [axiosData]);

  return (
    <div className="chart">
      <div className="chart-panel">
        <PriceDifferenceBag price={clickedElement} diff={diff} />
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
          height={500}
          data={chartData}
          options={options}
          type="line"
          getElementAtEvent={getElementAtEvent}
        />
      ) : (
        <></>
      )}
      <a href="https://www.coingecko.com/" target="_blank" rel="noreferrer" className="chart-link">
        Source: coingecko.com
      </a>
    </div>
  );
};

export default YDRTokenChart;
