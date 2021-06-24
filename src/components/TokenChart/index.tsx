import React, { useCallback, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import BigNumber from 'bignumber.js/bignumber';

import './TokenChart.scss';

interface TokenChartProps {
  page: string;
}

const TokenChart: React.FC<TokenChartProps> = ({ page }) => {
  const [days, setDays] = useState('1');
  const [refData, setRefData] = useState({
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        data: [1, 2, 3, 4, 5],
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
  const url: string =
    page === 'YDR Token'
      ? `https://api.coingecko.com/api/v3/coins/rubic/market_chart?vs_currency=usd&days=${days}`
      : 'https://dev-ydragon.rocknblock.io/api/indexes/info/690';

  const count = 255;
  const countNew = 256;
  const value = ((count - countNew) / countNew) * 100;
  const dir = value < 0 ? 'down' : 'up';
  const diff = new BigNumber(value).toFixed(1).toString();

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      xAxis: {
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
    // eslint-disable-next-line no-restricted-syntax
    for (const item of btnsList) {
      console.log(item.innerHTML);
      item.className = item === event.target ? 'chart-panel-btn active' : 'chart-panel-btn';
      switch (item.innerHTML) {
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
    }
  };

  const getChartInfo = (data: any) => {
    const chartInfo: { labels: string[]; data: number[] } = {
      labels: [],
      data: [],
    };
    if (data)
      data.forEach((item: number[]) => {
        const time = new Date(item[0]);
        chartInfo.labels.push(`${time.getHours()}:${time.getMinutes()}`);
        chartInfo.data.push(item[1]);
      });
    const lineChartData = {
      labels: chartInfo.labels,
      datasets: [
        {
          data: chartInfo.data,
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
    console.log('lineChartData:', lineChartData);
    return lineChartData;
  };

  const axiosData = useCallback(() => {
    axios.get(url).then((res) => {
      console.log('Response:', res.data.market_caps);
      setRefData(getChartInfo(res.data.market_caps));
    });
  }, [setRefData, url]);

  useEffect(() => {
    axiosData();
  }, [axiosData, days]);

  // useEffect(() => {
  //
  // }, [fetchData]);

  return (
    <div className="chart">
      <div className="chart-panel">
        <div className="chart-panel-title">
          ${count}
          <div className="diff">
            <div className={`diff-${dir}`}>
              <div className={`diff-${dir}-icon`} />
              {diff}%
            </div>
          </div>
        </div>
        <div
          role="button"
          tabIndex={0}
          className="chart-panel-btns"
          onClick={toggleHandler}
          onKeyDown={toggleHandler}
        >
          <div className="chart-panel-btn active">1d</div>
          <div className="chart-panel-btn">1m</div>
          <div className="chart-panel-btn">3m</div>
          <div className="chart-panel-btn">ALL</div>
        </div>
      </div>
      {Object.keys(refData).length ? <Line data={refData} options={options} type="line" /> : <></>}
    </div>
  );
};

export default TokenChart;
