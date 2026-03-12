// 题目类型定义
export type QuestionType = 'math' | 'english' | 'chinese';
export type Difficulty = 'bronze' | 'silver' | 'gold' | 'diamond';
export type GradeLevel = 5 | 6;  // 年级（只保留 5-6 年级）
export type SchoolSemester = 'upper' | 'lower';  // 学期：upper=上册，lower=下册

export interface Question {
  id: string;
  type: QuestionType;
  difficulty: Difficulty;
  content: string;           // 题目内容（支持 LaTeX 格式）
  options?: string[];        // 选择题选项（填空题为 undefined）
  answer: string;            // 正确答案
  explanation: string;       // 答案解析
  points: number;            // 分值
  knowledgePoint: string;    // 知识点标签
  grade?: GradeLevel;        // 年级（可选，兼容旧题库）
  semester?: SchoolSemester; // 学期（可选）
}

// 用户答题记录
export interface AnswerRecord {
  questionId: string;
  isCorrect: boolean;
  answerTime: number;        // 答题用时（秒）
  timestamp: number;
  knowledgePoint?: string;   // 知识点标签
  difficulty?: Difficulty;   // 题目难度
  questionType?: QuestionType; // 题目类型
  grade?: GradeLevel;        // 年级
  semester?: SchoolSemester; // 学期
}

// 知识点掌握情况
export interface KnowledgePointStats {
  name: string;              // 知识点名称
  total: number;             // 总答题数
  correct: number;           // 正确数
  accuracy: number;          // 正确率
  level: '未掌握' | '待提高' | '良好' | '优秀'; // 掌握程度
  color: string;             // 显示颜色
}

// 科目掌握情况
export interface SubjectStats {
  subject: QuestionType;
  label: string;
  total: number;
  correct: number;
  accuracy: number;
  level: '未掌握' | '待提高' | '良好' | '优秀';
  color: string;
}

// 用户进度
export interface UserProgress {
  totalPoints: number;       // 总积分
  answeredCount: number;     // 已答题数量
  correctCount: number;      // 正确数量
  records: AnswerRecord[];   // 答题记录
  gameTimeEarned: number;    // 已获得游戏时间（分钟）
  gameTimeUsed: number;      // 已使用游戏时间（分钟）
  badges: string[];          // 已解锁徽章
  lastAnswerTime: number;    // 上次答题时间（用于连续奖励）
  streak: number;            // 连续正确次数
}

// 徽章定义
export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  condition: (progress: UserProgress) => boolean;
}

// 初始用户进度
export const createInitialProgress = (): UserProgress => ({
  totalPoints: 0,
  answeredCount: 0,
  correctCount: 0,
  records: [],
  gameTimeEarned: 0,
  gameTimeUsed: 0,
  badges: [],
  lastAnswerTime: 0,
  streak: 0,
});
