import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import cn from 'classnames';
import moment from 'moment';

import { coingeckoApi } from '../../services/api';
import PriceDifferenceBag from '../PriceDifferenceBag';

import './YDRTokenChart.scss';
import useWindowDebouncedEvent from '../../hooks/useWindowDebouncedEvent';

interface TokenChartProps {
  price: (value: number) => void;
}

interface IMemoLine {
  data: any;
  options: any;
  getElementAtEvent: (element: string | any[]) => void;
}

const MemoLine: React.FC<IMemoLine> = React.memo(
  ({ data, options, getElementAtEvent }) => {
    return (
      <Line data={data} options={options} height={500} getElementAtEvent={getElementAtEvent} />
    );
  },
  (prev, next) => {
    return prev.data.datasets[0].data[0].time === next.data.datasets[0].data[0].time;
  },
);

const btns = ['1d', '1m', '3m', 'MAX'];
const YDRTokenChart: React.FC<TokenChartProps & React.HTMLAttributes<HTMLDivElement>> = ({
  price,
  className,
}) => {
  const refDataLength = useRef(1);
  const refPrice = useRef(0.000001);
  const [days, setDays] = useState('1');
  const [activeBtn, setActiveBtn] = useState<string>(btns[0]);
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
  const options = {
    aspectRatio: windowWidth > 768 ? 1.6 : 2,
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

  const toggleHandler = (btnName: string) => {
    setActiveBtn(btnName);
    switch (btnName) {
      case '1d':
        setDays('1');
        break;
      case '1m':
        setDays('30');
        break;
      case '3m':
        setDays('90');
        break;
      case 'MAX':
        setDays('max');
        break;
      default:
        break;
    }
  };

  const parseDate = useCallback(
    (date: Date, dayAllowed?: boolean) => {
      if (days === '1') {
        // return moment(date).format('D/HH:MM');
        return moment(date).format('HH:mm');
        // return `${date.getHours()}:${date.getMinutes()}`;
      }
      if (days === 'max' && !dayAllowed) {
        return moment(date).format('DD MMM YYYY');
      }
      // return `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
      return moment(date).format('DD MMM, h A');
    },
    [days],
  );

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
        console.error('Request chartData error', err);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days]);

  const handleResize = (screenWidth: number) => {
    setWindowWidth(screenWidth);
  };
  useWindowDebouncedEvent('resize', window.innerWidth, handleResize, 500);

  useEffect(() => {
    axiosData();
  }, [axiosData]);

  return (
    <div className={cn('chart', className)}>
      <div className="chart-panel">
        <PriceDifferenceBag price={clickedElement} diff={diff} />
        <div className="chart-panel-btns">
          {btns.map((btn) => (
            <div
              key={btn}
              className={cn('chart-panel-btn', {
                active: activeBtn === btn,
              })}
              role="button"
              tabIndex={0}
              onClick={() => toggleHandler(btn)}
              onKeyDown={() => {}}
            >
              {btn}
            </div>
          ))}
        </div>
      </div>
      {Object.keys(chartData).length ? (
        <MemoLine
          data={chartData}
          options={options}
          // type="line"
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
