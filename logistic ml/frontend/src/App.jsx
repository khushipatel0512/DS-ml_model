import React, { useState } from 'react';
import './App.css';

function App() {
  const [studyHours, setStudyHours] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Validation
    if (studyHours === '' || isNaN(studyHours)) {
      setErrorMsg('Please enter a valid study hour number.');
      setResult(null);
      return;
    }

    const hours = parseFloat(studyHours);
    if (hours < 0 || hours > 24) {
      setErrorMsg('Please enter realistic study hours (between 0 and 24).');
      setResult(null);
      return;
    }

    setLoading(true);

    try {
      // Call deployed Render FastAPI backend API
      const response = await fetch('https://student-marks-predict-xncn.onrender.com/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ StudyHours: hours }),
      });

      if (response.ok) {
        const data = await response.json();
        setResult({
          status: data.result,
          hours: hours,
          source: 'Render Backend API'
        });
        setLoading(false);
        return;
      }
      throw new Error('API server returned error');
    } catch {
      // Fallback: Exact Logistic Regression formula trained on the dataset
      // Logit: z = (1.121604 * hours) - 6.102256
      // Decision boundary: hours >= 5.44 => Pass, else Fail
      const coef = 1.1216044109489698;
      const intercept = -6.102256178294062;
      const logit = coef * hours + intercept;
      const probability = 1 / (1 + Math.exp(-logit));
      const predictedResult = logit >= 0 ? 'Pass' : 'Fail';

      setResult({
        status: predictedResult,
        hours: hours,
        probability: (probability * 100).toFixed(1),
        source: 'Logistic Regression'
      });
      setLoading(false);
    }
  };

  return (
    <div className="page-wrapper">
      {/* 1. Header */}
      <header className="site-header">
        <div className="header-content">
          <div className="logo-badge">🎓</div>
          <div>
            <h1>Student Performance Predictor</h1>
            <p>Predict exam pass or fail based on study hours</p>
          </div>
        </div>
      </header>

      {/* 2. Body Part: Contains Only 1 Form */}
      <main className="site-body">
        <form className="study-form" onSubmit={handleSubmit}>
          <div className="form-title-bar">
            <h2>Exam Result Prediction Form</h2>
            <span className="info-tag">Single Feature ML</span>
          </div>

          <div className="form-group">
            <label htmlFor="studyHoursInput" className="form-label">
              Enter Student Study Hr:
            </label>
            <input
              id="studyHoursInput"
              type="number"
              step="0.1"
              min="0"
              max="24"
              value={studyHours}
              onChange={(e) => setStudyHours(e.target.value)}
              placeholder="e.g. 6.5"
              className="text-input"
              autoFocus
            />
            <small className="field-hint">Enter daily hours studied (e.g. 3, 5.5, 8)</small>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Evaluating...' : 'Check Result (Pass / Fail)'}
          </button>

          {/* Validation Error Message */}
          {errorMsg && (
            <div className="alert-box error">
              <span>⚠️ {errorMsg}</span>
            </div>
          )}

          {/* Result Display Message */}
          {result && !errorMsg && (
            <div className={`result-card ${result.status.toLowerCase()}`}>
              <div className="result-icon">
                {result.status === 'Pass' ? '🎉' : '❌'}
              </div>
              <div className="result-info">
                <span className="result-label">Prediction Result:</span>
                <h3 className="result-status">
                  Student will {result.status.toUpperCase()}
                </h3>
                <p className="result-detail">
                  For <strong>{result.hours}</strong> study hour(s), model predicts:{' '}
                  <span className="result-pill">{result.status}</span>
                </p>
                {result.probability && (
                  <div className="prob-meter">
                    <div className="prob-label">
                      <span>Pass Probability:</span>
                      <strong>{result.probability}%</strong>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${result.probability}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </form>
      </main>

      {/* 3. Footer */}
      <footer className="site-footer">
        <p>© 2026 Student Study Hour Predictor • Built with React.js & Machine Learning</p>
      </footer>
    </div>
  );
}

export default App;
