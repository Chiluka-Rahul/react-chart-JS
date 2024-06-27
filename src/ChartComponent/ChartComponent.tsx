import React, { useState, useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import 'chartjs-adapter-date-fns';
import { Line } from 'react-chartjs-2';
import { ChartOptions, ChartData } from 'chart.js';
import html2canvas from 'html2canvas';
import './index.css'; 
ChartJS.register(
  CategoryScale,
  LinearScale,
  TimeScale,
  TimeSeriesScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

const ChartComponent: React.FC<{ timeframe: 'day' | 'week' | 'month' }> = ({ timeframe }) => {
  const [chartData, setChartData] = useState<ChartData<'line'>>({
    labels: [],
    datasets: [
      {
        label: 'Values',
        data: [],
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
      },
    ],
  });

  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => {
        const labels = data.map((item: { timestamp: string }) => item.timestamp);
        const values = data.map((item: { value: number }) => item.value);

        setChartData({
          labels,
          datasets: [
            {
              label: 'Values',
              data: values,
              borderColor: 'rgba(75,192,192,1)',
              backgroundColor: 'rgba(75,192,192,0.2)',
            },
          ],
        });
      });
  }, [timeframe]);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            return `${label}: ${context.parsed.y}`;
          },
        },
      },
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
    scales: {
      x: {
        type: 'timeseries',
        time: {
          unit: timeframe,
          tooltipFormat: 'P',
        },
        title: {
          display: true,
          text: '- D A T E -',
        },
      },
      y: {
        title: {
          display: true,
          text: '- V A L U E -',
        },
      },
    },
    onClick: (event, elements) => {
        if (elements.length && chartData.labels && chartData.datasets[0].data) {
            const index = elements[0].index;
            const label = chartData.labels[index];
            const value = chartData.datasets[0].data[index];
            alert(`Date: ${label}\nValue: ${value}`);
          }
    },
  };

  const exportChart = (format: 'png' | 'jpg') => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL(`image/${format}`);
        link.download = `chart.${format}`;
        link.click();
      });
    }
  };

  return (
    <div className="chart-wrapper">
      <div ref={chartRef} className="chart-container">
        <Line data={chartData} options={options} />
      </div>
      <button onClick={() => exportChart('png')}>Export as PNG</button>
      <button onClick={() => exportChart('jpg')}>Export as JPG</button>
    </div>
  );
};

export default ChartComponent;
