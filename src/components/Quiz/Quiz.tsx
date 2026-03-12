import React from 'react';
import type { Question } from '../../data/types';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface QuizProps {
  question: Question;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  currentScore: number;
  streak: number;
  answeredCount: number;
  onBackToDashboard: () => void;
}

export const Quiz: React.FC<QuizProps> = ({
  question,
  onAnswer,
  onNext,
  currentScore,
  streak,
  answeredCount,
  onBackToDashboard,
}) => {
  const [selectedOption, setSelectedOption] = React.useState<string>('');
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [userAnswer, setUserAnswer] = React.useState('');

  // 渲染 LaTeX 公式
  const renderLatex = (content: string) => {
    try {
      // 处理行内公式 \( ... \)
      const processed = content.replace(/\\\((.*?)\\\)/g, (_, formula) => {
        return katex.renderToString(formula, {
          displayMode: false,
          throwOnError: false,
        });
      });
      return processed;
    } catch (error) {
      return content;
    }
  };

  const handleOptionSelect = (option: string) => {
    if (showExplanation) return;
    setSelectedOption(option);
  };

  const handleSubmit = () => {
    if (!selectedOption) return;
    setShowExplanation(true);
    onAnswer(selectedOption);
  };

  const handleNext = () => {
    setSelectedOption('');
    setShowExplanation(false);
    setUserAnswer('');
    onNext();
  };

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <div className="score-display">
          <button
            onClick={onBackToDashboard}
            style={{
              background: '#eee',
              border: 'none',
              borderRadius: '8px',
              padding: '4px 8px',
              cursor: 'pointer',
              marginRight: '10px',
            }}
          >
            ← 返回
          </button>
          <span>积分：{currentScore}</span>
          {streak > 1 && <span className="streak">🔥 连胜 {streak} 次</span>}
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          已答题：{answeredCount}
        </div>
        <div className="difficulty-badge">{question.difficulty}</div>
      </div>

      <div className="question-card">
        <div className="question-type">{question.knowledgePoint}</div>
        <div
          className="question-content"
          dangerouslySetInnerHTML={{ __html: renderLatex(question.content) }}
        />
      </div>

      {question.options ? (
        <div className="options-container">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${selectedOption === option ? 'selected' : ''} ${
                showExplanation && option === question.answer ? 'correct' : ''
              } ${
                showExplanation && selectedOption === option && option !== question.answer ? 'wrong' : ''
              }`}
              onClick={() => handleOptionSelect(option)}
              disabled={showExplanation}
              dangerouslySetInnerHTML={{ __html: renderLatex(option) }}
            />
          ))}
        </div>
      ) : (
        <div className="input-container">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="输入你的答案"
            disabled={showExplanation}
          />
          <button
            className="submit-btn"
            onClick={() => {
              if (!userAnswer.trim()) return;
              setShowExplanation(true);
              onAnswer(userAnswer.trim());
            }}
            disabled={showExplanation || !userAnswer.trim()}
          >
            提交
          </button>
        </div>
      )}

      {showExplanation && (
        <div className="explanation-card">
          <div className="result-icon">
            {selectedOption === question.answer || userAnswer === question.answer ? (
              <span className="correct-icon">✓ 正确！</span>
            ) : (
              <span className="wrong-icon">✗ 错误</span>
            )}
          </div>
          <div className="explanation-content">
            <p><strong>正确答案：</strong></p>
            <div dangerouslySetInnerHTML={{ __html: renderLatex(question.answer) }} />
            <p><strong>解析：</strong></p>
            <div dangerouslySetInnerHTML={{ __html: renderLatex(question.explanation) }} />
          </div>
          <button className="next-btn" onClick={handleNext}>
            下一题 →
          </button>
        </div>
      )}

      {!showExplanation && question.options && (
        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!selectedOption}
        >
          提交答案
        </button>
      )}
    </div>
  );
};
