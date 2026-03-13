import React from 'react';
import type { UserProgress, QuestionType, GradeLevel, SchoolSemester } from '../../data/types';
import type { UserInfo } from '../../engine/userManager';
import { getQuestionStats } from '../../data';
import { unitTestQuestions } from '../../data/unitTestQuestions';
import { AnalysisPanel } from '../Analysis/AnalysisPanel';

interface DashboardProps {
  progress: UserProgress;
  user: UserInfo | null;
  selectedSubject: QuestionType | 'all';
  selectedGrade: GradeLevel;
  selectedSemester: SchoolSemester | 'all';
  onSwitchToQuiz: () => void;
  onSubjectChange: (subject: QuestionType | 'all') => void;
  onGradeChange: (grade: GradeLevel) => void;
  onSemesterChange: (semester: SchoolSemester | 'all') => void;
  onClearRecords: () => void;
  onStartUnitTest: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  progress,
  user,
  selectedSubject,
  selectedGrade,
  selectedSemester,
  onSwitchToQuiz,
  onSubjectChange,
  onGradeChange,
  onSemesterChange,
  onClearRecords,
  onStartUnitTest,
}) => {
  const accuracy = progress.answeredCount > 0
    ? Math.round((progress.correctCount / progress.answeredCount) * 100)
    : 0;

  const stats = getQuestionStats();

  // 只保留五年级和六年级
  const grades: { key: GradeLevel; label: string; icon: string; count: number }[] = [
    { key: 5, label: '五年级下', icon: '5️⃣', count: stats.byGrade.grade5 },
    { key: 6, label: '六年级', icon: '6️⃣', count: stats.byGrade.grade6 },
  ];

  const semesters: { key: SchoolSemester | 'all'; label: string; count: number }[] = [
    { key: 'all', label: '全部学期', count: stats.byGrade.grade6 },
    { key: 'upper', label: '上学期', count: stats.byGradeAndSemester.grade6Upper },
    { key: 'lower', label: '下学期', count: stats.byGradeAndSemester.grade6Lower },
  ];

  // 根据选中的年级和学期计算科目题目数量
  const getSubjectCount = (subject: QuestionType | 'all'): number => {
    if (selectedGrade === 5) {
      // 五年级只有下册，每科约 20 题
      if (subject === 'all') return stats.byGrade.grade5;
      if (subject === 'math') return Math.floor(stats.byGrade.grade5 / 3);
      if (subject === 'english') return Math.floor(stats.byGrade.grade5 / 3);
      if (subject === 'chinese') return Math.floor(stats.byGrade.grade5 / 3);
    } else if (selectedGrade === 6) {
      if (selectedSemester === 'all') {
        // 六年级全部学期
        if (subject === 'all') return stats.byGrade.grade6;
        if (subject === 'math') return 200; // 100 上册 + 100 下册
        if (subject === 'english') return 200;
        if (subject === 'chinese') return 200;
      } else if (selectedSemester === 'upper') {
        // 六年级上册
        if (subject === 'all') return stats.byGradeAndSemester.grade6Upper;
        if (subject === 'math') return 100;
        if (subject === 'english') return 100;
        if (subject === 'chinese') return 100;
      } else if (selectedSemester === 'lower') {
        // 六年级下册
        if (subject === 'all') return stats.byGradeAndSemester.grade6Lower;
        if (subject === 'math') return 100;
        if (subject === 'english') return 100;
        if (subject === 'chinese') return 100;
      }
    }
    return 0;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>📊 天津 5-6 年级测验系统</h1>
        {user && (
          <div className="user-greeting">
            <span className="avatar">{user.avatar}</span>
            <span>{user.name}，加油！</span>
          </div>
        )}
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{progress.totalPoints}</div>
          <div className="stat-label">总积分</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{progress.answeredCount}</div>
          <div className="stat-label">已答题</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{accuracy}%</div>
          <div className="stat-label">正确率</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">🔥 {progress.streak}</div>
          <div className="stat-label">连续正确</div>
        </div>
      </div>

      {/* 年级选择器 */}
      <div className="subject-section">
        <h2>🎓 选择年级</h2>
        <div className="subject-grid">
          {grades.map((grade) => {
            const isSelected = selectedGrade === grade.key;
            return (
              <button
                key={grade.key}
                className={`subject-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onGradeChange(grade.key)}
              >
                <div className="subject-icon">{grade.icon}</div>
                <div className="subject-name">{grade.label}</div>
                <div className="subject-count">{grade.count}题</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 学期选择器（仅当选择六年级时显示） */}
      {selectedGrade === 6 && (
        <div className="subject-section">
          <h2>📅 选择学期</h2>
          <div className="subject-grid">
            {semesters.map((semester) => {
              const isSelected = selectedSemester === semester.key;
              const icon = semester.key === 'all' ? '📅' : semester.key === 'upper' ? '📘' : '📗';
              return (
                <button
                  key={semester.key}
                  className={`subject-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => onSemesterChange(semester.key)}
                >
                  <div className="subject-icon">{icon}</div>
                  <div className="subject-name">{semester.label}</div>
                  <div className="subject-count">{semester.count}题</div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* 科目选择器 */}
      <div className="subject-section">
        <h2>📚 选择科目</h2>
        <div className="subject-grid">
          {[
            { key: 'all' as const, label: '全部科目', icon: '📚' },
            { key: 'math' as QuestionType, label: '数学', icon: '🔢' },
            { key: 'english' as QuestionType, label: '英语', icon: '🔤' },
            { key: 'chinese' as QuestionType, label: '语文', icon: '📖' },
          ].map((subject) => {
            const isSelected = selectedSubject === subject.key;
            return (
              <button
                key={subject.key}
                className={`subject-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSubjectChange(subject.key)}
              >
                <div className="subject-icon">{subject.icon}</div>
                <div className="subject-name">{subject.label}</div>
                <div className="subject-count">{getSubjectCount(subject.key)}题</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="action-buttons">
        <button className="primary-btn" onClick={onSwitchToQuiz}>
          📝 开始答题
        </button>
        <button className="secondary-btn" onClick={onClearRecords} style={{ marginLeft: '10px' }}>
          🗑️ 清除记录
        </button>
      </div>

      {/* 单元测试栏目 */}
      <div className="subject-section">
        <h2>📋 单元测试</h2>
        <div className="unit-test-card" onClick={onStartUnitTest}>
          <div className="unit-test-icon">📝</div>
          <div className="unit-test-info">
            <div className="unit-test-title">A2-2 五年级数学第二单元练习</div>
            <div className="unit-test-desc">因数与倍数 · 质数与合数 · 2/3/5 的倍数特征</div>
            <div className="unit-test-meta">
              <span>共 {unitTestQuestions.length} 题</span>
              <span>·</span>
              <span>满分 100 分</span>
            </div>
          </div>
          <div className="unit-test-arrow">→</div>
        </div>
      </div>

      <AnalysisPanel progress={progress} />
    </div>
  );
};
