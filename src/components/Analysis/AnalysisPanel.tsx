import React from 'react';
import type { UserProgress } from '../../data/types';
import { generateLearningReport } from '../../engine/analysisEngine';

interface AnalysisPanelProps {
  progress: UserProgress;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ progress }) => {
  const report = generateLearningReport(progress);

  if (progress.answeredCount === 0) {
    return (
      <div className="analysis-panel">
        <h2>📈 学习分析</h2>
        <div className="no-data">
          <p>暂无答题记录</p>
          <p>开始答题后，这里会显示你的知识点掌握情况</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analysis-panel">
      <h2>📈 学习分析</h2>

      {/* 整体概况 */}
      <div className="analysis-summary">
        <div className="summary-card">
          <div className="summary-value">{report.totalAnswered}</div>
          <div className="summary-label">已答题数</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: getAccuracyColor(report.overallAccuracy) }}>
            {report.overallAccuracy}%
          </div>
          <div className="summary-label">总体正确率</div>
        </div>
        <div className="summary-card">
          <div className="summary-value">
            {report.weakPoints.length}
          </div>
          <div className="summary-label">待提高知识点</div>
        </div>
      </div>

      {/* 学习建议 */}
      {report.recommendations.length > 0 && (
        <div className="recommendations">
          <h3>💡 学习建议</h3>
          <ul>
            {report.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      {/* 科目掌握情况 */}
      <div className="analysis-section">
        <h3>📚 科目掌握</h3>
        <div className="subject-bars">
          {report.subjects.map((subject) => (
            <div key={subject.subject} className="subject-bar-item">
              <div className="subject-info">
                <span className="subject-name">{subject.label}</span>
                <span className="subject-accuracy" style={{ color: subject.color }}>
                  {subject.accuracy}%
                </span>
              </div>
              <div className="progress-bar-bg">
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${subject.accuracy}%`,
                    backgroundColor: subject.color,
                  }}
                />
              </div>
              <div className="subject-detail">
                <span>答对 {subject.correct}/{subject.total} 题</span>
                <span className="level-tag" style={{ backgroundColor: subject.color }}>
                  {subject.level}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 知识点掌握详情 */}
      {report.knowledgePoints.length > 0 && (
        <div className="analysis-section">
          <h3>🎯 知识点掌握</h3>
          <div className="knowledge-grid">
            {report.knowledgePoints.slice(0, 12).map((kp, index) => (
              <div
                key={index}
                className="knowledge-card"
                style={{ borderLeftColor: kp.color }}
              >
                <div className="kp-header">
                  <span className="kp-name">{kp.name}</span>
                  <span className="kp-accuracy" style={{ color: kp.color }}>
                    {kp.accuracy}%
                  </span>
                </div>
                <div className="kp-progress">
                  <div className="kp-bar-bg">
                    <div
                      className="kp-bar-fill"
                      style={{
                        width: `${kp.accuracy}%`,
                        backgroundColor: kp.color,
                      }}
                    />
                  </div>
                </div>
                <div className="kp-footer">
                  <span>{kp.correct}/{kp.total} 题</span>
                  <span className="kp-level" style={{ color: kp.color }}>
                    {kp.level}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 学习趋势 */}
      {report.trend.length > 0 && (
        <div className="analysis-section">
          <h3>📊 最近答题趋势</h3>
          <div className="trend-chart">
            {report.trend.map((item, index) => (
              <div
                key={index}
                className="trend-dot"
                style={{
                  backgroundColor: item.isCorrect ? '#22c55e' : '#ef4444',
                }}
                title={`第${item.index}题：${item.isCorrect ? '✓' : '✗'}`}
              />
            ))}
          </div>
          <div className="trend-legend">
            <span className="legend-item correct">✓ 正确</span>
            <span className="legend-item wrong">✗ 错误</span>
          </div>
        </div>
      )}
    </div>
  );
};

// 获取正确率颜色
const getAccuracyColor = (accuracy: number): string => {
  if (accuracy >= 85) return '#22c55e';
  if (accuracy >= 70) return '#3b82f6';
  if (accuracy >= 50) return '#f59e0b';
  return '#ef4444';
};
