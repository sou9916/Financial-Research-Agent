import { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const API_BASE = 'http://localhost:8000';

function StockAnalysis({ symbol1, symbol2, period }) {
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);

  useEffect(() => {
    fetchStockData(symbol1, setData1, setLoading1, setError1);
  }, [symbol1, period]);

  useEffect(() => {
    if (symbol2 && symbol2 !== symbol1) {
      fetchStockData(symbol2, setData2, setLoading2, setError2);
    } else {
      setData2(null);
    }
  }, [symbol2, symbol1, period]);

  const fetchStockData = async (symbol, setData, setLoading, setError) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(`${API_BASE}/api/stock-data`, {
        symbol,
        period
      });
      setData(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderStockSection = (data, loading, error, symbol) => {
    if (loading) {
      return <div className="loading">Loading {symbol}...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    if (!data) {
      return <div className="info">No data available</div>;
    }

    const { metrics, data: stockData } = data;

    return (
      <div className="stock-section">
        <h3>{symbol}</h3>

        <div className="metrics">
          <div className="metric-card">
            <div className="metric-label">Latest Price</div>
            <div className="metric-value">₹{metrics.latest_price.toFixed(2)}</div>
            <div className={`metric-change ${metrics.price_change_pct >= 0 ? 'positive' : 'negative'}`}>
              {metrics.price_change_pct >= 0 ? '↑' : '↓'} {Math.abs(metrics.price_change_pct).toFixed(2)}%
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Data Points</div>
            <div className="metric-value">{metrics.data_points}</div>
          </div>

          <div className="metric-card">
            <div className="metric-label">Latest RSI</div>
            <div className="metric-value">
              {metrics.latest_rsi ? metrics.latest_rsi.toFixed(2) : 'N/A'}
            </div>
          </div>
        </div>

        <Plot
          data={[
            {
              x: stockData.map(d => d.Date),
              y: stockData.map(d => d.Close),
              type: 'scatter',
              mode: 'lines',
              name: `${symbol} Close`,
              line: { color: '#1f77b4', width: 2.5 }
            },
            {
              x: stockData.map(d => d.Date),
              y: stockData.map(d => d.MA20),
              type: 'scatter',
              mode: 'lines',
              name: '20-Day MA',
              line: { color: '#ff7f0e', width: 2, dash: 'dash' }
            }
          ]}
          layout={{
            title: `${symbol} Stock Price`,
            xaxis: { title: 'Date' },
            yaxis: { title: 'Price (INR)' },
            hovermode: 'x unified',
            height: 400,
            margin: { t: 50, b: 50 }
          }}
          config={{ responsive: true }}
          style={{ width: '100%' }}
        />

        <Plot
          data={[
            {
              x: stockData.map(d => d.Date),
              y: stockData.map(d => d.RSI),
              type: 'scatter',
              mode: 'lines',
              name: 'RSI',
              line: { color: '#2ca02c', width: 2.5 }
            }
          ]}
          layout={{
            title: `${symbol} RSI`,
            xaxis: { title: 'Date' },
            yaxis: { title: 'RSI Value', range: [0, 100] },
            shapes: [
              {
                type: 'line',
                x0: stockData[0]?.Date,
                x1: stockData[stockData.length - 1]?.Date,
                y0: 70,
                y1: 70,
                line: { color: 'red', dash: 'dot' }
              },
              {
                type: 'line',
                x0: stockData[0]?.Date,
                x1: stockData[stockData.length - 1]?.Date,
                y0: 30,
                y1: 30,
                line: { color: 'blue', dash: 'dot' }
              },
              {
                type: 'line',
                x0: stockData[0]?.Date,
                x1: stockData[stockData.length - 1]?.Date,
                y0: 50,
                y1: 50,
                line: { color: 'gray', dash: 'dot', width: 1 }
              }
            ],
            height: 300
          }}
          config={{ responsive: true }}
          style={{ width: '100%' }}
        />
      </div>
    );
  };

  const renderComparison = () => {
    if (!data1 || !data2) return null;

    return (
      <div className="comparison-section">
        <h3>📊 Comparison Chart</h3>

        <Plot
          data={[
            {
              x: data1.data.map(d => d.Date),
              y: data1.data.map(d => d.Close),
              type: 'scatter',
              mode: 'lines',
              name: symbol1,
              line: { color: '#1f77b4', width: 2.5 }
            },
            {
              x: data2.data.map(d => d.Date),
              y: data2.data.map(d => d.Close),
              type: 'scatter',
              mode: 'lines',
              name: symbol2,
              line: { color: '#ff7f0e', width: 2.5 }
            }
          ]}
          layout={{
            title: `${symbol1} vs ${symbol2}`,
            xaxis: { title: 'Date' },
            yaxis: { title: 'Price (INR)' },
            hovermode: 'x unified',
            height: 450
          }}
          config={{ responsive: true }}
          style={{ width: '100%' }}
        />

        <div className="performance-comparison">
          <h4>📈 Performance Comparison</h4>
          <div className="performance-grid">
            <div className="performance-card">
              <h5>{symbol1}</h5>
              <div className="performance-value">
                Period Return: {data1.metrics.period_return.toFixed(2)}%
              </div>
            </div>
            <div className="performance-card">
              <h5>{symbol2}</h5>
              <div className="performance-value">
                Period Return: {data2.metrics.period_return.toFixed(2)}%
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="stock-analysis">
      <h2>📈 Stock Price & Technical Indicators</h2>

      <div className="stocks-grid">
        <div className="stock-column">
          {renderStockSection(data1, loading1, error1, symbol1)}
        </div>

        <div className="stock-column">
          {symbol2 && symbol2 !== symbol1 ? (
            renderStockSection(data2, loading2, error2, symbol2)
          ) : (
            <div className="info-box">
              💡 Enter a second stock symbol above for comparison
            </div>
          )}
        </div>
      </div>

      {renderComparison()}
    </div>
  );
}

export default StockAnalysis;