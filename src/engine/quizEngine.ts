// 出题引擎
import type { Question, QuestionType, Difficulty, UserProgress, AnswerRecord, GradeLevel, SchoolSemester } from '../data/types';
import { allQuestions } from '../data';

export class QuizEngine {
  private availableQuestions: Question[];
  private answeredQuestionIds: Set<string>;
  private wrongQuestionIds: Set<string>;

  constructor() {
    this.availableQuestions = allQuestions;
    this.answeredQuestionIds = new Set();
    this.wrongQuestionIds = new Set();
  }

  // 加载用户进度
  loadProgress(progress: UserProgress) {
    this.answeredQuestionIds = new Set(progress.records.map(r => r.questionId));
    // 错题：答错的题目
    this.wrongQuestionIds = new Set(
      progress.records.filter(r => !r.isCorrect).map(r => r.questionId)
    );
  }

  // 获取下一道题目
  getNextQuestion(
    preferredType?: QuestionType,
    preferredGrade?: GradeLevel,
    preferredSemester?: SchoolSemester,
    preferredDifficulty?: Difficulty
  ): Question | null {
    let pool = this.availableQuestions.filter(
      q => !this.answeredQuestionIds.has(q.id)
    );

    // 优先从错题中选题（如果错题数量足够）
    // 错题回测也要遵循科目和年级选择
    let wrongPool = pool.filter(q => this.wrongQuestionIds.has(q.id));

    // 按科目和年级过滤错题池
    if (preferredType) {
      wrongPool = wrongPool.filter(q => q.type === preferredType);
    }
    if (preferredGrade) {
      wrongPool = wrongPool.filter(q => q.grade === preferredGrade);
    }
    if (preferredSemester) {
      wrongPool = wrongPool.filter(q => q.semester === preferredSemester);
    }

    if (wrongPool.length > 0 && Math.random() < 0.3) {
      // 30% 概率出做错的题
      const randomIndex = Math.floor(Math.random() * wrongPool.length);
      return wrongPool[randomIndex];
    }

    // 按科目和年级过滤题目池
    if (preferredType) {
      pool = pool.filter(q => q.type === preferredType);
    }
    if (preferredGrade) {
      pool = pool.filter(q => q.grade === preferredGrade);
    }
    if (preferredSemester) {
      pool = pool.filter(q => q.semester === preferredSemester);
    }

    // 如果该科目/年级的题目都已答过，重置该范围的题目
    if (pool.length === 0) {
      if (preferredType || preferredGrade) {
        // 重置特定范围的题目
        pool = this.availableQuestions.filter(q => {
          if (preferredType && q.type !== preferredType) return false;
          if (preferredGrade && q.grade !== preferredGrade) return false;
          if (preferredSemester && q.semester !== preferredSemester) return false;
          return true;
        });
        // 从已答题目中移除该范围的题目
        pool.forEach(q => this.answeredQuestionIds.delete(q.id));
        pool.forEach(q => this.wrongQuestionIds.delete(q.id));
      } else {
        // 没有指定科目和年级，重置所有题目
        this.answeredQuestionIds.clear();
        pool = this.availableQuestions;
      }
    }

    return this.getRandomFromPool(pool, preferredType, preferredGrade, preferredSemester, preferredDifficulty);
  }

  // 从池子中随机选题
  private getRandomFromPool(
    pool: Question[],
    _preferredType?: QuestionType,
    _preferredGrade?: GradeLevel,
    _preferredSemester?: SchoolSemester,
    preferredDifficulty?: Difficulty
  ): Question {
    // 按难度筛选
    if (preferredDifficulty) {
      const diffPool = pool.filter(q => q.difficulty === preferredDifficulty);
      if (diffPool.length > 0) {
        pool = diffPool;
      }
    }

    // 随机选择
    const randomIndex = Math.floor(Math.random() * pool.length);
    return pool[randomIndex];
  }

  // 判题
  checkAnswer(question: Question, userAnswer: string): {
    isCorrect: boolean;
    explanation: string;
    pointsEarned: number;
  } {
    const normalizedUserAnswer = userAnswer.trim().toLowerCase();
    const normalizedCorrectAnswer = question.answer.trim().toLowerCase();

    const isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;

    return {
      isCorrect,
      explanation: question.explanation,
      pointsEarned: isCorrect ? question.points : 0,
    };
  }

  // 记录答题结果
  recordAnswer(
    questionId: string,
    isCorrect: boolean,
    answerTime: number
  ): AnswerRecord {
    const record: AnswerRecord = {
      questionId,
      isCorrect,
      answerTime,
      timestamp: Date.now(),
    };

    this.answeredQuestionIds.add(questionId);
    if (!isCorrect) {
      this.wrongQuestionIds.add(questionId);
    } else {
      // 答对后从错题集中移除
      this.wrongQuestionIds.delete(questionId);
    }

    return record;
  }

  // 获取错题本
  getWrongQuestions(): Question[] {
    return this.availableQuestions.filter(q =>
      this.wrongQuestionIds.has(q.id)
    );
  }

  // 获取答题统计
  getStats(): {
    totalAnswered: number;
    correctCount: number;
    wrongCount: number;
    accuracy: number;
  } {
    const totalAnswered = this.answeredQuestionIds.size;
    const wrongCount = this.wrongQuestionIds.size;
    const correctCount = totalAnswered - wrongCount;
    const accuracy = totalAnswered > 0 ? (correctCount / totalAnswered) * 100 : 0;

    return {
      totalAnswered,
      correctCount,
      wrongCount,
      accuracy,
    };
  }
}

// 创建单例
export const quizEngine = new QuizEngine();
