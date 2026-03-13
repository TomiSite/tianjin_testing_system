import { useState } from 'react';
import { unitTestQuestions } from '../../data/unitTestQuestions';
import './UnitTest.css';

interface UnitTestProps {
  onBackToDashboard: () => void;
}

export function UnitTest({ onBackToDashboard }: UnitTestProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [completedQuestions, setCompletedQuestions] = useState<Set<string>>(new Set());

  const currentQuestion = unitTestQuestions[currentIndex];

  const handleSubmit = () => {
    if (!currentQuestion || !selectedAnswer) return;

    const correct = checkAnswer(selectedAnswer, currentQuestion.answer);
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore(score + currentQuestion.points);
    }
    setAnsweredCount(answeredCount + 1);
    setCompletedQuestions(new Set(completedQuestions).add(currentQuestion.id));
  };

  const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
    return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
  };

  const handleNext = () => {
    if (currentIndex < unitTestQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setSelectedAnswer('');
      setShowResult(false);
    }
  };

  const progress = ((currentIndex + 1) / unitTestQuestions.length) * 100;

  return (
    <div className="unit-test-container">
      <div className="unit-test-header">
        <button className="back-btn" onClick={onBackToDashboard}>
          ← 返回
        </button>
        <h1>📝 单元测试 - A2-2 五年级数学第二单元练习</h1>
        <div className="score-display">
          得分：<span className="score">{score}</span>
        </div>
      </div>

      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
        <span className="progress-text">
          {currentIndex + 1} / {unitTestQuestions.length}
        </span>
      </div>

      <div className="question-card">
        <div className="question-type">
          {currentQuestion?.knowledgePoint}
        </div>
        <div className="question-content">
          {currentQuestion?.content}
        </div>

        {currentQuestion?.options && (
          <div className="options-list">
            {currentQuestion.options.map((option, index) => (
              <label
                key={index}
                className={`option-item ${
                  showResult
                    ? checkAnswer(option, currentQuestion.answer)
                      ? 'correct'
                      : selectedAnswer === option && !isCorrect
                      ? 'incorrect'
                      : ''
                    : selectedAnswer === option
                    ? 'selected'
                    : ''
                }`}
              >
                <input
                  type="radio"
                  name="answer"
                  value={option}
                  checked={selectedAnswer === option}
                  onChange={(e) => !showResult && setSelectedAnswer(e.target.value)}
                  disabled={showResult}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}

        {!currentQuestion?.options && (
          <div className="fill-answer">
            <input
              type="text"
              className="answer-input"
              placeholder="请输入答案"
              value={selectedAnswer}
              onChange={(e) => !showResult && setSelectedAnswer(e.target.value)}
              disabled={showResult}
            />
          </div>
        )}

        {showResult && (
          <div className={`result-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            <div className="result-title">
              {isCorrect ? '✅ 回答正确！' : '❌ 回答错误'}
            </div>
            <div className="correct-answer">
              正确答案：{currentQuestion?.answer}
            </div>
            <div className="explanation">
              <strong>解析：</strong>{currentQuestion?.explanation}
            </div>
          </div>
        )}

        <div className="action-buttons">
          {currentIndex > 0 && !showResult && (
            <button className="nav-btn prev-btn" onClick={handlePrev}>
              上一题
            </button>
          )}

          {!showResult ? (
            <button
              className="action-btn submit-btn"
              onClick={handleSubmit}
              disabled={!selectedAnswer}
            >
              提交答案
            </button>
          ) : (
            <button
              className="action-btn next-btn"
              onClick={handleNext}
              disabled={currentIndex >= unitTestQuestions.length - 1}
            >
              {currentIndex >= unitTestQuestions.length - 1 ? '已完成' : '下一题'}
            </button>
          )}
        </div>
      </div>

      <div className="question-nav-grid">
        <h3>题目导航</h3>
        <div className="nav-grid">
          {unitTestQuestions.map((_, index) => (
            <button
              key={index}
              className={`nav-grid-item ${
                index === currentIndex ? 'current' : ''
              } ${completedQuestions.has(unitTestQuestions[index].id) ? 'completed' : ''}`}
              onClick={() => {
                setCurrentIndex(index);
                setSelectedAnswer('');
                setShowResult(false);
              }}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {currentIndex >= unitTestQuestions.length - 1 && completedQuestions.size === unitTestQuestions.length && (
        <div className="completion-modal">
          <div className="completion-content">
            <h2>🎉 练习完成！</h2>
            <div className="final-stats">
              <div className="stat-item">
                <span className="stat-label">总得分</span>
                <span className="stat-value">{score}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">正确率</span>
                <span className="stat-value">
                  {Math.round((completedQuestions.size / unitTestQuestions.length) * 100)}%
                </span>
              </div>
            </div>
            <button className="action-btn" onClick={onBackToDashboard}>
              返回主页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
