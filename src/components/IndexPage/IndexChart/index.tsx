import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Line } from 'react-chartjs-2';
import cn from 'classnames';

import { indexesApi } from '../../../services/api';
import PriceDifferenceBag from '../../PriceDifferenceBag';

import './IndexChart.scss';
import { AxiosResponse } from 'axios';
import { IHistoricalToken } from '../IndexTable';
import moment from 'moment';

interface IndexChartProps {
  onClick: (value: IFetchedData) => void;
  indexId: any;
  diff: number;
}
export interface IFetchedData {
  diff: string;
  index: number;
  market_cap: string;
  rate: string;
  time: Date | string;
  tokens_history: IHistoricalToken[];
  total_supply: string;
}

const btns = ['1d', '1m', '3m', 'MAX'];

interface IMemoLine {
  data: any;
  options: any;
  getElementAtEvent: (element: string | any[]) => void;
}

const MemoLine: React.FC<IMemoLine> = React.memo(
  ({ data, options, getElementAtEvent }) => {
    return (
      <Line data={data} options={options} height={600} getElementAtEvent={getElementAtEvent} />
    );
  },
  (prev, next) => {
    return prev.data.datasets[0].data[0].time === next.data.datasets[0].data[0].time;
  },
);

const IndexChart: React.FC<IndexChartProps> = React.memo(({ onClick, indexId, diff }) => {
  const [days, setDays] = useState('1');
  const [activeBtn, setActiveBtn] = useState<string>(btns[0]);
  const refDataLength = useRef(1);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const refPrice = useRef(0.000001);
  const refMax = useRef(0);
  const refMin = useRef(0);
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
  const [fetchedData, setFetchedData] = useState<Array<IFetchedData>>([]);
  const [clickedElement, setClickedElement] = useState(
    chartData.datasets[0].data[refDataLength.current - 1].data,
  );
  const options = {
    layout: {
      padding: 10,
    },
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

  const getWindowWidth = () => {
    const { innerWidth: width } = window;
    return width;
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

  const getElementAtEvent = useCallback(
    (element: string | any[]) => {
      if (!element.length) return;

      const { index } = element[0];
      const chosenPrice = chartData.datasets[0].data[index].data;
      const fetchedItem = fetchedData[index];
      setClickedElement(chosenPrice);
      onClick(fetchedItem);
    },
    [chartData.datasets, fetchedData, onClick],
  );

  const getChartData = useCallback(
    (data: any): any => {
      const datasetsData: { time: string; data: number }[] = [];
      const arr: number[] = [];
      const dayAllowed =
        (new Date(data[data.length - 1].time).getTime() - new Date(data[0].time).getTime()) /
          (3600000 * 24) <
        1;
      if (data)
        data.forEach((item: any) => {
          const date = new Date(item.time);
          // if (!datasetsData.find((element: any) => element.time === parseDate(date))) {}
          arr.push(Number(item.rate));
          datasetsData.push({
            time: parseDate(date, dayAllowed),
            data: Number(item.rate),
          });
        });
      refDataLength.current = datasetsData.length;
      refMax.current = Math.max(...arr) + 1;
      refMin.current = Math.min(...arr) - 1;
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
    },
    [parseDate],
  );

  const axiosData = useCallback(() => {
    indexesApi
      .getIndexTokensChart(indexId, days)
      .then((res: AxiosResponse<IFetchedData[]>) => {
        const currentPrice = res.data[res.data.length - 1].rate;
        setFetchedData(res.data);
        setChartData(getChartData(res.data));
        if (refPrice.current <= +currentPrice) refPrice.current = +currentPrice;
        setClickedElement(refPrice.current);
      })
      .catch((err: any) => {
        console.log('Request chartData error', err);
      });
  }, [indexId, days, getChartData]);

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
        <PriceDifferenceBag
          price={Number(clickedElement)}
          diff={[diff >= 0 ? 'up' : 'down', diff]}
          decimals={2}
        />
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
        <MemoLine data={chartData} options={options} getElementAtEvent={getElementAtEvent} />
      ) : (
        <></>
      )}
    </div>
  );
});

export default IndexChart;
