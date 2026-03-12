// 题库索引文件
import type { Question, QuestionType, Difficulty, GradeLevel, SchoolSemester } from './types';
import { fractionQuestions } from './fractionQuestions';
import { geometryQuestions } from './geometryQuestions';
import { wordProblemQuestions } from './wordProblemQuestions';
import { englishQuestions } from './englishQuestions';
import { chineseQuestions } from './chineseQuestions';
import { grade5LowerMath } from './grade5LowerMath';
import { grade5LowerChinese } from './grade5LowerChinese';
import { grade5LowerEnglish } from './grade5LowerEnglish';
import { grade6UpperMath } from './grade6UpperMath';
import { grade6UpperChinese } from './grade6UpperChinese';
import { grade6UpperEnglish } from './grade6UpperEnglish';
import { grade6LowerMath } from './grade6LowerMath';
import { grade6LowerChinese } from './grade6LowerChinese';
import { grade6LowerEnglish } from './grade6LowerEnglish';

// 导出各年级题库
export {
  grade5LowerMath, grade5LowerChinese, grade5LowerEnglish,
  grade6UpperMath, grade6UpperChinese, grade6UpperEnglish,
  grade6LowerMath, grade6LowerChinese, grade6LowerEnglish,
};

// 导出原有五年级下题库（兼容）
export { fractionQuestions, geometryQuestions, wordProblemQuestions };

// 合并所有题库（只保留五年级下和六年级上下册）
export const allQuestions: Question[] = [
  // 五年级下册
  ...grade5LowerMath,
  ...grade5LowerChinese,
  ...grade5LowerEnglish,
  // 六年级上册
  ...grade6UpperMath,
  ...grade6UpperChinese,
  ...grade6UpperEnglish,
  // 六年级下册
  ...grade6LowerMath,
  ...grade6LowerChinese,
  ...grade6LowerEnglish,
  // 原有五年级下题库（保留兼容）
  ...fractionQuestions,
  ...geometryQuestions,
  ...wordProblemQuestions,
  ...englishQuestions,
  ...chineseQuestions,
];

// 按类型获取题目
export const getQuestionsByType = (type: QuestionType): Question[] => {
  return allQuestions.filter(q => q.type === type);
};

// 按难度获取题目
export const getQuestionsByDifficulty = (difficulty: Difficulty): Question[] => {
  return allQuestions.filter(q => q.difficulty === difficulty);
};

// 按类型和难度获取题目
export const getQuestionsByTypeAndDifficulty = (
  type: QuestionType,
  difficulty: Difficulty
): Question[] => {
  return allQuestions.filter(q => q.type === type && q.difficulty === difficulty);
};

// 按年级、学期和科目获取题目
export const getQuestionsByGradeSemesterAndType = (
  grade: GradeLevel | 'all',
  semester: SchoolSemester | 'all',
  type?: QuestionType
): Question[] => {
  let questions = allQuestions;

  if (grade !== 'all') {
    questions = questions.filter(q => q.grade === grade);
  }

  if (semester !== 'all') {
    questions = questions.filter(q => q.semester === semester);
  }

  if (type) {
    questions = questions.filter(q => q.type === type);
  }

  return questions;
};

// 按年级和学期获取题目
export const getQuestionsByGradeAndSemester = (grade: 5 | 6, semester?: 'upper' | 'lower'): Question[] => {
  let questions = allQuestions.filter(q => q.grade === grade);
  if (semester) {
    questions = questions.filter(q => q.semester === semester);
  }
  return questions;
};

// 获取指定数量的随机题目
export const getRandomQuestions = (count: number, type?: QuestionType): Question[] => {
  const pool = type ? getQuestionsByType(type) : allQuestions;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// 题库统计
export const getQuestionStats = () => {
  return {
    total: allQuestions.length,
    byType: {
      math: getQuestionsByType('math').length,
      english: getQuestionsByType('english').length,
      chinese: getQuestionsByType('chinese').length,
    },
    byGradeAndSemester: {
      grade5Lower: grade5LowerMath.length + grade5LowerChinese.length + grade5LowerEnglish.length,
      grade6Upper: grade6UpperMath.length + grade6UpperChinese.length + grade6UpperEnglish.length,
      grade6Lower: grade6LowerMath.length + grade6LowerChinese.length + grade6LowerEnglish.length,
    },
    byGrade: {
      grade5: grade5LowerMath.length + grade5LowerChinese.length + grade5LowerEnglish.length,
      grade6: grade6UpperMath.length + grade6UpperChinese.length + grade6UpperEnglish.length +
              grade6LowerMath.length + grade6LowerChinese.length + grade6LowerEnglish.length,
    },
    byDifficulty: {
      bronze: getQuestionsByDifficulty('bronze').length,
      silver: getQuestionsByDifficulty('silver').length,
      gold: getQuestionsByDifficulty('gold').length,
      diamond: getQuestionsByDifficulty('diamond').length,
    },
  };
};

export * from './types';
