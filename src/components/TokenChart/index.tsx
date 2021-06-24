import React, { useCallback, useEffect, useRef } from 'react';
import { Line } from 'react-chartjs-2';
import axios from 'axios';
import BigNumber from 'bignumber.js/bignumber';

import './TokenChart.scss';

interface TokenChartProps {
  page: string;
}

const TokenChart: React.FC<TokenChartProps> = ({ page }) => {
  const refFetchData = useRef({});
  const refData = useRef({});
  const days = 1;
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
    keepAspectRatio: false,
    responsive: true,
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
      datasets: {
        data: chartInfo.data,
        fill: false,
        backgroundColor: 'transparent',
        borderColor: '#df3f3a',
        borderWidth: 3,
        pointBackgroundColor: '#df3f3a',
        pointBorderColor: '#fff',
        tension: 0.5,
      },
    };
    console.log('lineChartData:', lineChartData);
    return lineChartData;
  };

  const axiosData = useCallback(() => {
    axios.get(url).then((res) => {
      console.log('Response:', res.data.market_caps);
      refFetchData.current = res.data.market_caps;
      console.log('refFetchData:', refFetchData.current);
      refData.current = getChartInfo(refFetchData.current);
      console.log('refData:', refData.current);
    });
  }, [url]);

  useEffect(() => {
    axiosData();
  }, [axiosData]);

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
        <div className="chart-panel-btns">
          <button type="button" className="chart-panel-btn active">
            1d
          </button>
          <button type="button" className="chart-panel-btn">
            1m
          </button>
          <button type="button" className="chart-panel-btn">
            3m
          </button>
          <button type="button" className="chart-panel-btn">
            ALL
          </button>
        </div>
      </div>
      {Object.keys(refData.current).length ? (
        <Line data={refData.current} options={options} type="line" height={400} />
      ) : (
        <></>
      )}
    </div>
  );
};

export default TokenChart;
