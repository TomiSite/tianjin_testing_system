// 知识点掌握程度分析引擎
import type { UserProgress, AnswerRecord, KnowledgePointStats, SubjectStats, QuestionType } from '../data/types';
import { allQuestions } from '../data';

// 获取题目信息
const getQuestionInfo = (questionId: string) => {
  const question = allQuestions.find(q => q.id === questionId);
  if (!question) return null;

  return {
    knowledgePoint: question.knowledgePoint,
    difficulty: question.difficulty,
    questionType: question.type,
    grade: question.grade,
    semester: question.semester,
  };
};

// 丰富答题记录
const enrichRecords = (records: AnswerRecord[]): AnswerRecord[] => {
  return records.map(record => {
    const info = getQuestionInfo(record.questionId);
    return {
      ...record,
      knowledgePoint: info?.knowledgePoint || record.knowledgePoint,
      difficulty: info?.difficulty || record.difficulty,
      questionType: info?.questionType || record.questionType,
      grade: info?.grade || record.grade,
      semester: info?.semester || record.semester,
    };
  });
};

// 计算掌握程度等级
const getLevel = (accuracy: number): '未掌握' | '待提高' | '良好' | '优秀' => {
  if (accuracy >= 85) return '优秀';
  if (accuracy >= 70) return '良好';
  if (accuracy >= 50) return '待提高';
  return '未掌握';
};

// 获取掌握程度颜色
const getLevelColor = (level: string): string => {
  switch (level) {
    case '优秀': return '#22c55e';  // 绿色
    case '良好': return '#3b82f6';  // 蓝色
    case '待提高': return '#f59e0b'; // 橙色
    case '未掌握': return '#ef4444'; // 红色
    default: return '#6b7280';
  }
};

// 分析知识点掌握情况
export const analyzeKnowledgePoints = (progress: UserProgress): KnowledgePointStats[] => {
  const records = enrichRecords(progress.records);
  const knowledgeMap = new Map<string, { total: number; correct: number }>();

  records.forEach(record => {
    if (!record.knowledgePoint) return;

    const existing = knowledgeMap.get(record.knowledgePoint) || { total: 0, correct: 0 };
    existing.total += 1;
    if (record.isCorrect) {
      existing.correct += 1;
    }
    knowledgeMap.set(record.knowledgePoint, existing);
  });

  const stats: KnowledgePointStats[] = [];
  knowledgeMap.forEach((data, name) => {
    const accuracy = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
    stats.push({
      name,
      total: data.total,
      correct: data.correct,
      accuracy,
      level: getLevel(accuracy),
      color: getLevelColor(getLevel(accuracy)),
    });
  });

  // 按答题数降序，正确率升序排序（优先显示薄弱知识点）
  return stats.sort((a, b) => {
    if (b.total !== a.total) return b.total - a.total;
    return a.accuracy - b.accuracy;
  });
};

// 分析科目掌握情况
export const analyzeSubjectStats = (progress: UserProgress): SubjectStats[] => {
  const records = enrichRecords(progress.records);

  // 初始化各科目统计
  const subjectData: Record<string, { total: number; correct: number }> = {
    math: { total: 0, correct: 0 },
    english: { total: 0, correct: 0 },
    chinese: { total: 0, correct: 0 },
  };

  records.forEach(record => {
    if (record.questionType) {
      subjectData[record.questionType].total += 1;
      if (record.isCorrect) {
        subjectData[record.questionType].correct += 1;
      }
    }
  });

  const subjectLabels: Record<string, string> = {
    math: '数学',
    english: '英语',
    chinese: '语文',
  };

  const subjectColors: Record<string, string> = {
    math: '#3b82f6',
    english: '#8b5cf6',
    chinese: '#ef4444',
  };

  const stats: SubjectStats[] = [];
  (Object.keys(subjectData) as Array<keyof typeof subjectData>).forEach(key => {
    const data = subjectData[key];
    if (data.total > 0) {
      const accuracy = Math.round((data.correct / data.total) * 100);
      stats.push({
        subject: key as QuestionType,
        label: subjectLabels[key],
        total: data.total,
        correct: data.correct,
        accuracy,
        level: getLevel(accuracy),
        color: subjectColors[key],
      });
    }
  });

  return stats.sort((a, b) => a.accuracy - b.accuracy); // 按正确率升序，薄弱科目在前
};

// 分析难度掌握情况
export const analyzeDifficultyStats = (progress: UserProgress) => {
  const records = enrichRecords(progress.records);
  const difficultyData: Record<string, { total: number; correct: number }> = {
    bronze: { total: 0, correct: 0 },
    silver: { total: 0, correct: 0 },
    gold: { total: 0, correct: 0 },
    diamond: { total: 0, correct: 0 },
  };

  records.forEach(record => {
    if (record.difficulty) {
      difficultyData[record.difficulty].total += 1;
      if (record.isCorrect) {
        difficultyData[record.difficulty].correct += 1;
      }
    }
  });

  const difficultyLabels: Record<string, string> = {
    bronze: '青铜级',
    silver: '白银级',
    gold: '黄金级',
    diamond: '钻石级',
  };

  const difficultyColors: Record<string, string> = {
    bronze: '#cd7f32',
    silver: '#c0c0c0',
    gold: '#ffd700',
    diamond: '#b9f2ff',
  };

  return Object.entries(difficultyData)
    .filter(([_, data]) => data.total > 0)
    .map(([key, data]) => ({
      difficulty: key,
      label: difficultyLabels[key],
      total: data.total,
      correct: data.correct,
      accuracy: Math.round((data.correct / data.total) * 100),
      color: difficultyColors[key],
    }));
};

// 获取学习趋势（最近 10 题的正确情况）
export const getLearningTrend = (progress: UserProgress) => {
  const records = enrichRecords(progress.records);
  const recentRecords = records.slice(-20); // 最近 20 题

  return recentRecords.map((record, index) => ({
    index: index + 1,
    isCorrect: record.isCorrect,
    questionType: record.questionType,
  }));
};

// 获取薄弱知识点（正确率低于 50%）
export const getWeakKnowledgePoints = (progress: UserProgress): KnowledgePointStats[] => {
  const allStats = analyzeKnowledgePoints(progress);
  return allStats.filter(stat => stat.accuracy < 70);
};

// 获取推荐学习的知识点
export const getRecommendedKnowledgePoints = (progress: UserProgress): KnowledgePointStats[] => {
  const weakPoints = getWeakKnowledgePoints(progress);
  // 按答题数排序，优先推荐做得多但正确率低的知识点
  return weakPoints.sort((a, b) => b.total - a.total).slice(0, 3);
};

// 综合分析报告
export interface LearningAnalysisReport {
  overallAccuracy: number;
  totalAnswered: number;
  knowledgePoints: KnowledgePointStats[];
  subjects: SubjectStats[];
  weakPoints: KnowledgePointStats[];
  recommendations: string[];
  trend: Array<{ index: number; isCorrect: boolean; questionType?: QuestionType }>;
}

export const generateLearningReport = (progress: UserProgress): LearningAnalysisReport => {
  const knowledgePoints = analyzeKnowledgePoints(progress);
  const subjects = analyzeSubjectStats(progress);
  const weakPoints = getWeakKnowledgePoints(progress);
  const trend = getLearningTrend(progress);

  const overallAccuracy = progress.answeredCount > 0
    ? Math.round((progress.correctCount / progress.answeredCount) * 100)
    : 0;

  // 生成学习建议
  const recommendations: string[] = [];

  if (weakPoints.length > 0) {
    const topWeak = weakPoints[0];
    recommendations.push(`建议加强练习【${topWeak.name}】知识点，当前正确率${topWeak.accuracy}%`);
  }

  if (subjects.length > 0) {
    const weakestSubject = subjects[0];
    if (weakestSubject.accuracy < 70) {
      recommendations.push(`【${weakestSubject.label}】正确率较低，建议多做专项练习`);
    }
  }

  if (trend.length >= 10) {
    const recentCorrect = trend.filter(t => t.isCorrect).length;
    const recentAccuracy = recentCorrect / trend.length * 100;
    if (recentAccuracy < 60) {
      recommendations.push('最近答题正确率下降，建议复习相关知识点后再练习');
    } else if (recentAccuracy > 85) {
      recommendations.push('最近状态很好，继续保持！');
    }
  }

  if (progress.answeredCount < 10) {
    recommendations.push('答题数量较少，继续加油积累练习量！');
  }

  return {
    overallAccuracy,
    totalAnswered: progress.answeredCount,
    knowledgePoints,
    subjects,
    weakPoints,
    recommendations,
    trend,
  };
};
