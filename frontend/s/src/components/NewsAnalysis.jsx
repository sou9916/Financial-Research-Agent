import { useState, useEffect } from 'react';
import axios from 'axios';
import Plot from 'react-plotly.js';

const API_BASE = 'http://localhost:8000';

function NewsAnalysis({ symbol1, symbol2 }) {
  const [news1, setNews1] = useState(null);
  const [news2, setNews2] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [error1, setError1] = useState(null);
  const [error2, setError2] = useState(null);

  useEffect(() => {
    fetchNews(symbol1, setNews1, setLoading1, setError1);
  }, [symbol1]);

  useEffect(() => {
    if (symbol2 && symbol2 !== symbol1) {
      fetchNews(symbol2, setNews2, setLoading2, setError2);
    } else {
      setNews2(null);
    }
  }, [symbol2, symbol1]);

  const fetchNews = async (symbol, setNews, setLoading, setError) => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE}/api/news`, { symbol });
      setNews(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const renderSentimentGauge = (avgSentiment, symbol) => {
    return (
      <Plot
        data={[
          {
            type: 'indicator',
            mode: 'gauge+number',
            value: avgSentiment,
            title: { text: `${symbol}<br>Avg Sentiment`, font: { size: 18 } },
            gauge: {
              axis: { range: [-1, 1] },
              bar: { color: 'darkblue' },
              steps: [
                { range: [-1, -0.05], color: '#ffcccc' },
                { range: [-0.05, 0.05], color: '#ffffcc' },
                { range: [0.05, 1], color: '#ccffcc' }
              ],
              threshold: {
                line: { color: 'red', width: 3 },
                value: 0
              }
            }
          }
        ]}
        layout={{ height: 250, margin: { l: 20, r: 20, t: 40, b: 20 } }}
        config={{ responsive: true }}
        style={{ width: '100%' }}
      />
    );
  };

  const renderNewsSection = (news, loading, error, symbol) => {
    if (loading) {
      return <div className="loading">Loading news for {symbol}...</div>;
    }

    if (error) {
      return <div className="error">{error}</div>;
    }

    if (!news) {
      return <div className="info">No news data available</div>;
    }

    const { articles, sentiment_summary } = news;

    if (!articles || articles.length === 0) {
      return (
        <div className="info-box">
          <p>No news articles found for {symbol}</p>
          {news.message && <p>{news.message}</p>}
        </div>
      );
    }

    return (
      <div className="news-section">
        <h3>📰 News & Sentiment: {symbol}</h3>

        {sentiment_summary && (
          <>
            <div className="sentiment-summary">
              <h4>📊 Sentiment Summary</h4>
              <div className="summary-metrics">
                <div className="summary-card">
                  <div className="summary-label">Avg Score</div>
                  <div className="summary-value">
                    {sentiment_summary.avg_score.toFixed(3)}
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">🟢 Positive</div>
                  <div className="summary-value">
                    {sentiment_summary.positive_count}
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">🟡 Neutral</div>
                  <div className="summary-value">
                    {sentiment_summary.neutral_count}
                  </div>
                </div>
                <div className="summary-card">
                  <div className="summary-label">🔴 Negative</div>
                  <div className="summary-value">
                    {sentiment_summary.negative_count}
                  </div>
                </div>
              </div>
            </div>

            {renderSentimentGauge(sentiment_summary.avg_score, symbol)}

            <div className={`sentiment-interpretation ${sentiment_summary.overall.toLowerCase()}`}>
              {sentiment_summary.overall === 'Positive' && (
                <p>✅ <strong>POSITIVE</strong> - Favorable news coverage for {symbol}</p>
              )}
              {sentiment_summary.overall === 'Negative' && (
                <p>⚠️ <strong>NEGATIVE</strong> - Concerning news coverage for {symbol}</p>
              )}
              {sentiment_summary.overall === 'Neutral' && (
                <p>ℹ️ <strong>NEUTRAL</strong> - Balanced news coverage for {symbol}</p>
              )}
            </div>
          </>
        )}

        <div className="headlines">
          <h4>📰 Headlines</h4>
          {articles.map((article, idx) => (
            <details key={idx} className="article-card">
              <summary className={`article-summary sentiment-${article.color}`}>
                <span className="emoji">
                  {article.color === 'green' ? '🟢' : article.color === 'red' ? '🔴' : '🟡'}
                </span>
                <strong>{idx + 1}. {article.title}</strong>
              </summary>
              <div className="article-content">
                {article.description && (
                  <p className="article-description">{article.description}</p>
                )}
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="article-link"
                >
                  🔗 Read Article
                </a>
                <p className="article-meta">
                  Score: {article.score.toFixed(3)} | {article.date} | {article.source}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="news-analysis">
      <h2>📰 News & Sentiment Analysis</h2>

      <div className="news-grid">
        {renderNewsSection(news1, loading1, error1, symbol1)}

        {symbol2 && symbol2 !== symbol1 ? (
          <>
            <hr className="divider" />
            {renderNewsSection(news2, loading2, error2, symbol2)}
          </>
        ) : (
          <div className="info-box">
            💡 Add a second stock symbol for comparison
          </div>
        )}
      </div>
    </div>
  );
}

export default NewsAnalysis;