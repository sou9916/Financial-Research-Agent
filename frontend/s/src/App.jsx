import { useState } from 'react';
import StockAnalysis from './components/StockAnalysis';
import NewsAnalysis from './components/NewsAnalysis';
import './App.css';

function App() {
  const [symbol1, setSymbol1] = useState('RELIANCE.NS');
  const [symbol2, setSymbol2] = useState('TCS.NS');
  const [period, setPeriod] = useState('3mo');
  const [activeTab, setActiveTab] = useState('technical');

  return (
    <div className="app">
      <header className="app-header">
        <h1>📈 Financial Research AI Agent – Indian Stock Analyzer</h1>
        <p className="subtitle">
          Analyze Indian stock data with real-time charts, basic indicators (MA, RSI), news, and sentiment analysis.
        </p>
        <div className="info-banner">
          💡 Tip: Use .NS for NSE stocks and .BO for BSE stocks (e.g., RELIANCE.NS, TCS.NS).
        </div>
      </header>

      <div className="controls">
        <div className="input-group">
          <label>1st Stock Symbol</label>
          <input
            type="text"
            value={symbol1}
            onChange={(e) => setSymbol1(e.target.value.toUpperCase())}
            placeholder="RELIANCE.NS"
          />
        </div>

        <div className="input-group">
          <label>2nd Stock Symbol (optional)</label>
          <input
            type="text"
            value={symbol2}
            onChange={(e) => setSymbol2(e.target.value.toUpperCase())}
            placeholder="TCS.NS"
          />
        </div>

        <div className="input-group">
          <label>Time Period</label>
          <select value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="1mo">1 Month</option>
            <option value="3mo">3 Months</option>
            <option value="6mo">6 Months</option>
            <option value="1y">1 Year</option>
            <option value="2y">2 Years</option>
          </select>
        </div>
      </div>

      <div className="tabs">
        <button
          className={activeTab === 'technical' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('technical')}
        >
          📊 Technical Analysis
        </button>
        <button
          className={activeTab === 'news' ? 'tab active' : 'tab'}
          onClick={() => setActiveTab('news')}
        >
          📰 News & Sentiment
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'technical' ? (
          <StockAnalysis
            symbol1={symbol1}
            symbol2={symbol2}
            period={period}
          />
        ) : (
          <NewsAnalysis
            symbol1={symbol1}
            symbol2={symbol2}
          />
        )}
      </div>

      <footer className="app-footer">
        <div className="footer-row">
          <span>Data: Yahoo Finance, NewsAPI</span>
          <span>Indicators: 20-Day MA, 14-Day RSI</span>
          <span>Sentiment: VADER</span>
        </div>
        <p className="disclaimer">⚠️ For educational purposes only. Not financial advice.</p>
      </footer>
    </div>
  );
}

export default App;