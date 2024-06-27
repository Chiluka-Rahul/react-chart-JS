import React, { useState } from 'react';
import ChartComponent from './ChartComponent/ChartComponent';
import './App.css';

const App: React.FC = () => {
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month' >('day');

  return (
    <div className="App">
      <header className='heading'>Chart Analysis</header>
      <div className="App-header">
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as 'day' | 'week' | 'month')}
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>
      <ChartComponent timeframe={timeframe} />
    </div>
  );
};

export default App;
